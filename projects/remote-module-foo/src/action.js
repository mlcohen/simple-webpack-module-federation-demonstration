const toUpper = require("lodash/toUpper");

function doRemoteFooAction() {
    console.log(`remote ${toUpper("foo")} action invoked`);
}

module.exports = {
    doRemoteFooAction,
};