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
            name: "RemoteModuleBar",
            filename: "moduleEntry.js",
            exposes: {
                "./action": "./b/action",
            },
        }),
    ],
    devtool: false,
    target: "web",
};

module.exports = config;

