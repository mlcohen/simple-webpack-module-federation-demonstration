const toUpper = require("lodash/toUpper");

function doRemoteBarAction() {
    console.log(`remote ${toUpper("bar")} action invoked`);
}

module.exports = {
    doRemoteBarAction,
};