function main() {
    import("./action").then(({ doRemoteBarAction }) => {
        console.log("init remote bundle bar");
        doRemoteBarAction();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});