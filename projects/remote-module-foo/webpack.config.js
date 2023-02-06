const package = require("./package.json");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const config = {
    mode: "development",
    context: path.join(__dirname, "src"),
    entry: "./main.js",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "foo-[name].bundle.js",
        uniqueName: package.name,
    },
    resolve: {
        extensions: ['.js'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.join(__dirname, "/assets/index.html"),
            excludeChunks: ["RemoteModuleFoo"],
        }),
        new ModuleFederationPlugin({
            name: "RemoteModuleFoo",
            filename: "moduleEntry.js",
            exposes: {
                "./action": "./action",
            },
            shared: ["lodash/toUpper"],
        }),
    ],
    optimization: {
        splitChunks: {
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /\/node_modules\//,
                    name: 'vendor',
                    filename: 'foo-[name].bundle.js',
                    chunks: 'all',
                },
            },
        },
    },
    devtool: false,
    target: "web",
};

module.exports = config;

