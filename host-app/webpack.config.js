const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const ExternalTemplateRemotesPlugin = require('external-remotes-plugin');

const config = {
    mode: "development",
    context: path.join(__dirname, "src"),
    entry: "./main.js",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js"
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
                RemoteModuleFoo: `promise new Promise(${fetchRemoteModule("RemoteModuleFoo", "/moduleEntry.js")})`,
                RemoteModuleBar: `promise new Promise(${fetchRemoteModule("RemoteModuleBar", "/moduleEntry.js")})`,
                RemoteModuleBaz: `promise new Promise(${fetchRemoteModule("RemoteModuleBaz", "/moduleEntry.js")})`,
            },
            // remotes: {
            //     RemoteModuleFoo: "RemoteModuleFoo@[window.RemoteModuleFooUrl]/moduleEntry.js",
            //     RemoteModuleBar: "RemoteModuleBar@[window.RemoteModuleBarUrl]/moduleEntry.js"
            // },
        }),
        new ExternalTemplateRemotesPlugin(),
    ],
    devtool: false,
    target: "web",
    devServer: {
        compress: false,
        port: 9000,
    },
};

module.exports = config;

function fetchRemoteModule(remoteId, path) {
    return `
    (resolve) => {
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
    }
    `;
}