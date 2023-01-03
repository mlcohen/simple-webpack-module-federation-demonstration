function main() {
    window.RemoteModuleFooUrl = 'http://localhost:8001';
    window.RemoteModuleBarUrl = 'http://localhost:8002';
    window.RemoteModuleBazUrl = 'http://localhost:8003';

    function loadRemoteModuleFoo() {
        import('RemoteModuleFoo/action').then((m) => {
            console.log('LOADED remote module foo');
            console.log(m.doRemoteFooAction());
            setTimeout(() => {
                loadRemoteModuleBar();
            }, 2000);
        });
    }

    function loadRemoteModuleBar() {
        import('RemoteModuleBar/action').then((m) => {
            console.log('LOADED remote module bar');
            console.log(m.doRemoteBarAction());
            setTimeout(() => {
                loadRemoteModuleBaz();
            }, 2000);
        });
    }

    function loadRemoteModuleBaz() {
        import('RemoteModuleBaz/action').then((m) => {
            console.log('LOADED remote module baz');
            console.log(m.doRemoteBazAction());
        });
    }

    setTimeout(() => {
        loadRemoteModuleFoo();
    }, 2000)
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});
