let url = "ws://192.168.2.211:1337/";
let connected: boolean;
let websocket: WebSocket;

window.onload = function () {
    const element = document.getElementById("getState");
    element?.addEventListener("click", onPress);
};

console.log("Trying to open a WebSocket connection...");
connectToWS(url);

function connectToWS(_url: string) {
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
function onOpen(event: any) {
    console.log("Connected.");
    connected = true;
    doSend("getState");
}

function onClose(event: any) {
    console.log("Disconnected.");
    connected = false;
    setTimeout(function () {
        connectToWS(url);
    }, 2000);
}

function onMessage(event: any) {
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

function onError(event: any) {
    console.log("Error: " + event.data);
}

function doSend(_message: string) {
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
