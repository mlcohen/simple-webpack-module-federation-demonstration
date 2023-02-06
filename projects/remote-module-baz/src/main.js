function main() {
    console.log("init remote bundle baz");
    import("./action").then(({ doRemoteBazAction }) => {
        doRemoteBazAction();
    })
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});