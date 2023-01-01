# simple-webpack-module-federation-demonstration

This repo provides a simple demonstration of how Webpack's module federation works.

The repository contains three directories:

- A host app directory `/host-app`
- two remote module directories: `/remote-module-foo` and `/remote-module-bar`

The host app and the two remote modules are all served from their own local server:

- host on `localhost:8000`
- remote module foo on `localhost:8001`
- remote module bar on `localhost:8002`


## Setup

1. `yarn install`
2. `yarn install:all`
3. `yarn build:all`


## Running the Demonstration

- To serve host and the remote modules, run `yarn serve:all`
- To shutdown the local servers, run `yarn shutdown:all`

When the servers are all running, open your browser and go to `http://localhost:8000`. In your browser's JavaScript console, you should see the following output:

```
LOADED remote module foo
remote foo action invoked
LOADED remote module bar
remote bar action invoked
```

In your browser's inspector network tab, you should see the following files being loaded in this order:

```
localhost:8000: index.html
localhost:8000: bundle.js
localhost:8001: moduleEntry.js
localhost:8002: moduleEntry.js	
localhost:8001: a_action_js.js
localhost:8002: b_action_js.js
```

![JavaScript Console](./assets/images/console-output.jpg)

### What's Happening?

When you load the host app's `bundle.js`, the app's `main` [function](https://github.com/mlcohen/simple-webpack-module-federation-demonstration/blob/main/host-app/src/main.js) will execute. When invoked, the `main` function will dynamically import two modules: `RemoteModuleFoo/action` and `RemoteModuleBar/action`. 

When a remote module has been loaded, the host app will execute an exported function from imported module. For the foo remote module, the exported `doRemoteFooAction` [function](https://github.com/mlcohen/simple-webpack-module-federation-demonstration/blob/main/remote-module-foo/src/a/action.js) is invoked, and for the bar remote module, the exported `doRemoteBarAction` [function](https://github.com/mlcohen/simple-webpack-module-federation-demonstration/blob/main/remote-module-bar/src/b/action.js) is invoked.