const package = require("./package.json");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const config = {
    mode: "development",
    target: "web",
    context: path.join(__dirname, "src"),
    entry: "./main.js",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "host-[name].bundle.js",
        uniqueName: package.name,
    },
    resolve: {
        extensions: ['.js'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.join(__dirname, "/assets/index.html"),
        }),
        new ModuleFederationPlugin({
            name: "host",
            remotes: {
                RemoteModuleFoo: fetchRemoteModule("RemoteModuleFoo", "/moduleEntry.js"),
                RemoteModuleBar: fetchRemoteModule("RemoteModuleBar", "/moduleEntry.js"),
                RemoteModuleBaz: fetchRemoteModule("RemoteModuleBaz", "/moduleEntry.js"),
            },
            shared: {
                "lodash/toUpper": {
                    eager: true,
                },
            },
        }),
    ],
    optimization: {
        splitChunks: {
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /\/node_modules\//,
                    name: 'vendor',
                    filename: 'host-[name].bundle.js',
                    chunks: 'all',
                },
            },
        },
    },
    devtool: false,
};

module.exports = config;

function fetchRemoteModule(remoteId, path) {
    return `promise new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = window.${remoteId}Url + "${path}";
        script.onload = () => {
            const m = {
                get: (request) => window.${remoteId}.get(request),
                init: (arg) => {
                    try {
                        return window.${remoteId}.init(arg);
                    } catch (e) {
                        console.log("${remoteId} has already been loaded");
                    }
                },
            };
            resolve(m);
        }
        document.head.appendChild(script);
    })`;
}