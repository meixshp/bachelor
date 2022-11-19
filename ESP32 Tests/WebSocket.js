"use strict";
var url = "ws://192.168.2.211:1337/";
var connected;
var websocket;
window.onload = function () {
    var element = document.getElementById("getState");
    element === null || element === void 0 ? void 0 : element.addEventListener("click", onPress);
};
console.log("Trying to open a WebSocket connection...");
connectToWS(url);
function connectToWS(_url) {
    websocket = new WebSocket(_url);
    websocket.onopen = function (evt) {
        onOpen(evt);
    };
    websocket.onclose = function (evt) {
        onClose(evt);
    };
    websocket.onmessage = function (evt) {
        onMessage(evt);
    };
    websocket.onerror = function (evt) {
        onError(evt);
    };
}
function onOpen(event) {
    console.log("Connected.");
    connected = true;
    doSend("getState");
}
function onClose(event) {
    console.log("Disconnected.");
    connected = false;
    setTimeout(function () {
        connectToWS(url);
    }, 2000);
}
function onMessage(event) {
    //console.log("Received: " + event.data);
    /*switch (event.data) {
        case "0":
            console.log(event.data);
            break;
        case "1":
            console.log(event.data);
            break;
        default:
            break;
    }*/
    console.log(event.data);
}
function onError(event) {
    console.log("Error: " + event.data);
}
function doSend(_message) {
    //console.log("Sending: " + _message);
    // while (connected) {
    //     setTimeout(function () {
    //         websocket.send(_message);
    //     }, 2000);
    // }
    websocket.send(_message);
}
function onPress() {
    doSend("getState");
}
