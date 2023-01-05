# Simple Webpack Module Federation Demonstration

This repo provides a very simple demonstration of how Webpack's module federation works.

The repository contains four projects:

- A host app project `host-app`
- Three remote module projects: `remote-module-foo`, `remote-module-bar` and `remote-module-baz`

The host app and the three remote modules are all served from their own local server:

- host on `localhost:8000`
- remote module foo on `localhost:8001`
- remote module bar on `localhost:8002`
- remote module baz on `localhost:8003`


## Setup

1. `yarn install`
2. `yarn project:install:all`
3. `yarn project:build:all`


## Running the Demonstration

- To serve host and the remote modules, run `yarn project:serve:all`
- To shutdown the local servers, run `yarn project:shutdown:all`

When the servers are all running, open your browser and go to `http://localhost:8000`. In your browser's JavaScript console, you should see the following output:

```
LOADED remote module foo
remote foo action invoked
LOADED remote module bar
remote bar action invoked
LOADED remote module baz
remote baz action invoked
```

In your browser's inspector network tab, you should see the following files being loaded in this order:

```
localhost:8000: index.html
localhost:8000: bundle.js
localhost:8001: moduleEntry.js
localhost:8002: moduleEntry.js	
localhost:8003: moduleEntry.js	
localhost:8001: a_action_js.js
localhost:8002: b_action_js.js
localhost:8003: c_action_js.js
```

![JavaScript Console](./assets/images/console-output.png)

## What's happening in this demonstration?

When you load the host app, the app's `main` [function](https://github.com/mlcohen/simple-webpack-module-federation-demonstration/blob/main/host-app/src/main.js) will execute. When invoked, the `main` function will dynamically import three modules: First `RemoteModuleFoo/action` then `RemoteModuleBar/action` and finally `RemoteModuleBaz/action`.

When a remote module has been loaded, the host app will execute an exported function from imported module. For the foo remote module, the exported `doRemoteFooAction` [function](https://github.com/mlcohen/simple-webpack-module-federation-demonstration/blob/main/remote-module-foo/src/a/action.js) is invoked, and for the bar remote module, the exported `doRemoteBarAction` [function](https://github.com/mlcohen/simple-webpack-module-federation-demonstration/blob/main/remote-module-bar/src/b/action.js) is invoked, and for the baz remote module, the exported `doRemoteBazAction` [function](https://github.com/mlcohen/simple-webpack-module-federation-demonstration/blob/main/remote-module-baz/src/c/action.js) is invoked.

Each remote module is loaded in series with a bit of delay added in between. This is to help emphasize how remote module are loaded by Webpack.

## What is module federation?

Module federation allows any project made up of a collection of modules to be built, bundled and deployed in a way where they can be dynamically fetched and loaded at runtime by a Webpack compliant host. These federated modules, also referred to as _remote modules_ do not need to be available at build time for the host to be built. The benefit is that each project representing a federated module can be independently maintained, tested, built and deployed. This means the applications that host remote modules can then be smaller, quicker to build, quicker to load, and not be concerned about how each federated module is built and deployed. All that a host needs to know is:

1. The name of the federated module
2. What a federated module exports for public use
3. Where the federated module can be fetched from

Module federation opens the doors for microfrontends where you can independently maintain and deploy small web applications such that each application can be both a host _and_ a remote module. This is referred to as _bidirectional hosting_.

## How does module federation work?

Let's start with the basics: Setting up projects representing a host and remote modules.

### Setting up a remote module

For any project that is representing a remote module, you need to include Webpack's `ModuleFederationPlugin` [plugin](https://webpack.js.org/plugins/module-federation-plugin) in the project's `webpack.config.js` file. At a minimum, you specify:

1. The *name* of the remote module
2. The name of the file representing the remote module's entry
3. What the remote module exposes for use

For example, let's say you want to create a remote module *Foo* that exports (or _exposes_) a submodule called _action_. You'd have the following:

```js
// webpack.config.js (using Webpack v5)
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const config = {
    ...
    plugins: [
        new ModuleFederationPlugin({
            name: "Foo",
            filename: "moduleEntry.js",
            exposes: ["./action"],
        }),
    ],
};

module.exports = config;
```

Each part in the remote module project's configuration is important as it will be needed by a host to use it.

### Setting up a host

Setting up the host application to use remote modules requires:

1. Updating the app's `webpack.config.js` file to use the `ModuleFederationPlugin` plugin
2. Making use of the global `import()` function to import _exposed_ submodules from a remote module

#### Configuring the host

Like remote modules, the host application also makes use of Webpack's `ModuleFederationPlugin` plugin but, unlike remote modules, you are configuring the plugin to tell it what remote modules to use and how the host retrieves the remote modules. Here we want the host to use the *Foo* remote module.

```js
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const config = {
    ...
    plugins: [
        new ModuleFederationPlugin({
            name: "host",
            remotes: {
                Foo: `promise new Promise((resolve) => {
                    const script = document.createElement("script");
                    script.src = window.FooUrl + "/moduleEntry.js";
                    script.onload = () => {
                        const m = {
                            get: (request) => window.Foo.get(request),
                            init: (arg) => {
                                try {
                                    return window.Foo.init(arg);
                                } catch (e) {
                                    console.log("Foo has already been loaded");
                                }
                            },
                        };
                        resolve(m);
                    }
                    document.head.appendChild(script);
                }`,
            },
        }),
    ],
};
```

We use the plugin's `remotes` field to tell Webpack that we want to use the *Foo* remote module. The value assigned to the key _Foo_ is a stringified promise. This promise is what Webpack will use to fetch and load the remote module. The promise will create a DOM script element to fetch the remote module's entry file (`moduleEntry.js`). Once the entry file has been retrieved and loaded, the promise is resolved by passing back the *Foo* module's entry interface (an `init` and `get` function). This interface is what Webpack uses to import functionality from the remote module.

Do you really need to explicitly write this promise logic? Well, no. You could instead use the `ExternalTemplateRemotesPlugin` [plugin](https://www.npmjs.com/package/external-remotes-plugin) that will essentially do the same thing. But seeing the promise logic makes it clear how Webpack goes about retrieving and loading remote modules. 

#### Importing remote modules

For a host application to import something from a remote module, the application must use the `import()` function. `import` is an [ES6 feature](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) that all major browser vendors (and nodejs) implement. To import something from the *Foo* remote module, we do the following:

```js
import('Foo/action').then(({ doAction }) => {
    doAction();
});
```

It's that simple.

Above, we want to access the `doAction` function in the `Foo/action` module. `import` returns a promise and when resolved returns the module that gives you access to what the module exports. Behind the scenes, Webpack is doing a lot of work to carefully retrieve and load the `action` module.

## What does Webpack actually do to make module federation work?

Behind the scenes, Webpack does a bunch of work to keep track of modules making sure they are correctly imported based on what and how a module exports its functionality. Much if not all of this logic is automatically added by Webpack during the build and bundling process. Therefore, to understand how module federation _really works_ under the hood, you need to have some reasonable familiarity with how Webpack manages modules.

### Module Management: The Fundamentals

Every file that imports and/or exports is considered a module. In the case of JavaScript files, Webpack inheritly understands how to infer what a file, or rather _module_, is importing and exporting whether it be via [CommonJS](https://blog.risingstack.com/node-js-at-scale-module-system-commonjs-require/) (ie. `require` and `module.exports`), [ES6](https://www.digitalocean.com/community/tutorials/js-modules-es6) (ie. `import`, `export` statements) or some other common(-ish) JS modulization approach such as [AMD](https://requirejs.org/docs/whyamd.html). With this inherit knowledge, Webpack takes over the underlying mechanics of doing the actual importing and exporting.

In a basic Webpack application that has one [defined entry point](https://requirejs.org/docs/whyamd.html) and one [defined output](https://webpack.js.org/concepts/#output) with and no use of dynamic importing, module federation, or any kind of configuration causing forced code splitting, the static bundle produced will contain all of the JavaScript modules that Webpack was able to resolve. Resolve based on what is being imported, starting from the file representing the entry point. Essentialy Webpack creates a graph of modules that it can then process. The result of this is that for each imported module that Webpack comes across, Webpack will add that module to the bundle by wrapping the module's code up in a closure and mapping the closure to a key where the key is a unique relative path to the module.

Let's put this into more concrete terms.

To start, we have a simple application with a single main entry file called `main.js`. Main imports a file called `utils.js` located in the same directory. Both are located in the project's `src/` directory. 

```js
// src/utils.js
function toUpper(str) {
    str.toUppercase();
}

module.exports = {
    toUppercase,
};
```

```js
// src/main.js
const { toUpper } = require("./utils");

function main() {
	console.log(toUpper("Hello world");
}

main();
```

The output will be a file named `bundle.js` containing `main.js` and `utils.js` code. Taking a look inside `bundle.js`, what do we get?

When you first look at the bundle code generated by Webpack, you'll immediately notice a fair amount of anonymous closures. There is a root-level closure encapsulating all the code that Webpack generated. This is Webpack's _bootstrap_ closure and gets immediately executed once all the JavaScript has been processed. (To put it another way, the bootstrap closure is an (IFFE)[https://developer.mozilla.org/en-US/docs/Glossary/IIFE]).

Within the bootstrap closure, there are two fundamental parts that drive Webpack's module management:

1. A dictionary `___webpack_modules___` that stores all of the modules resolved by Webpack
2. A `__webpack_require__` function used to resolve imported modules at runtime

For the `util.js` file, the code is wrapped up in an anonomys function that is provided a single argument: access to the module's root object that provides access to the module's exports object.


```js
var __webpack_modules__ = ({
    "./utils.js": ((module) => {
        function toUpper(str) {
            str.toUppercase()
        }

        module.exports = {
          toUpper,
		 };
	}),
});
```

If a module were to import functionality from other modules, Webpack would adjust the anonymous wrapper to pass in Webpack's `__webpack_require__` function.

For the entry file `main.js`, Webpack treats it a bit differently. First, the main module's code is placed at the very end of the bootstrap closure. Second, the main module's code is wrapped up in an anonymous closure but it is not provided any arguments. Instead is just directly access the `__webpack_require__` fucnction defined within the bootstrap closure. In the end we get the following:

```js
(() => { // webpack's bootstrap closure	

var __webpack_modules__ = ({
    ...
});

function __webpack_require__(moduleId) {
    ...
}

...

(() => {
    /* main.js */
    const { toUpper } = __webpack_require__("./utils.js");

    function main() {
        console.log(toUpper("Hello world");
    }

    main();
})();

})(); 
```

And that's basically it. Again, this is what Webpack would generate for an application with simple importing and exporting. Additional logic would be added if we were to use ES6 `import` and `export` statements but the funadmentals would still be there (`___webpack_modules___` and `__webpack_require__`).

What about this `__webpack_require__` function, anyway? What is it doing? It's fairly simple. All the require function does is lookup a module being imported, get the module's root object, prepare the module if it's the first time the module is being accessed, and, finally, return the module's exports object. This is the require function generated for our simple bundle:

```js
var __webpack_module_cache__ = {};

function __webpack_require__(moduleId) {
	var cachedModule = __webpack_module_cache__[moduleId];
	if (cachedModule !== undefined) {
		return cachedModule.exports;
	}

	var module = __webpack_module_cache__[moduleId] = {
		exports: {}
	};

	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);

	return module.exports;
}
```