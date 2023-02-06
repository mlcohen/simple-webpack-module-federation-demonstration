const toUpper = require("lodash/toUpper");

class App {

    sayHello() {
        console.log(`${toUpper("Host")} says hello world!`);
    }

    run () {
        this.sayHello();

        function loadRemoteModuleFoo() {
            import('RemoteModuleFoo/action').then((m) => {
                console.log('Loaded remote module foo');
                console.log(m.doRemoteFooAction());
                setTimeout(() => {
                    loadRemoteModuleBar();
                }, 1000);
            });
        }

        function loadRemoteModuleBar() {
            import('RemoteModuleBar/action').then((m) => {
                console.log('Loaded remote module bar');
                console.log(m.doRemoteBarAction());
                setTimeout(() => {
                    loadRemoteModuleBaz();
                }, 1000);
            });
        }

        function loadRemoteModuleBaz() {
            import('RemoteModuleBaz/action').then((m) => {
                console.log('Loaded remote module baz');
                console.log(m.doRemoteBazAction());
            });
        }

        setTimeout(() => {
            loadRemoteModuleFoo();
        }, 2000)
    }

}

module.exports = {
    app: new App(),
};
