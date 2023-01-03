const path = require("path");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const config = {
    mode: "development",
    context: path.join(__dirname, "src"),
    entry: "./index.js",
    resolve: {
        extensions: ['.js'],
    },
    plugins: [
        new ModuleFederationPlugin({
            name: "RemoteModuleFoo",
            filename: "moduleEntry.js",
            exposes: {
                "./action": "./a/action",
            },
        }),
    ],
    devtool: false,
    target: "web",
};

module.exports = config;
