function main() {
    window.RemoteModuleFooUrl = 'http://localhost:8001';
    window.RemoteModuleBarUrl = 'http://localhost:8002';

    import('RemoteModuleFoo/action').then((m) => {
        console.log('LOADED remote module foo');
        console.log(m.doRemoteFooAction());
    });

    import('RemoteModuleBar/action').then((m) => {
        console.log('LOADED remote module bar');
        console.log(m.doRemoteBarAction());
    });
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});
