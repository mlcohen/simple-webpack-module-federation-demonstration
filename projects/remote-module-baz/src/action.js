const toUpper = require("lodash/toUpper");

function doRemoteBazAction() {
    console.log(`remote ${toUpper("baz")} action invoked`);
}

module.exports = {
    doRemoteBazAction,
};