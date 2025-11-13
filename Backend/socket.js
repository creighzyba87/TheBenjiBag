"use strict";
// callable form: require("./socket")(server, io)
function socketEntry(/* server, io */){ return; }
// named methods if code does socket.init()  or socket.start()
async function init(){ return; }
async function start(){ return; }
module.exports = Object.assign(socketEntry, { init, start });