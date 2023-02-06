function main() {
    console.log("init remote bundle foo");
    import("./action").then(({ doRemoteFooAction }) => {
        doRemoteFooAction();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});