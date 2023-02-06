function main() {
    window.RemoteModuleFooUrl = 'http://localhost:8001';
    window.RemoteModuleBarUrl = 'http://localhost:8002';
    window.RemoteModuleBazUrl = 'http://localhost:8003';

    import("./app").then(({ app }) => {
        app.run();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});
