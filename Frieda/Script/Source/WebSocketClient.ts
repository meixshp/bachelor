namespace Frieda {
    let state: number = 0;
    let url = "";
    export let connectedtoWS: boolean = false;
    let websocket: WebSocket;

    console.log("Trying to open a WebSocket connection...");
    //connectToWS(url);

    export function connecting(_url: string): boolean {
        try {
            connectToWS(_url);
            return true;
        } catch {
            return false;
        }
    }

    export function connectToWS(_url: string) {
        url = _url;
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
        connectedtoWS = true;
    }

    function onClose(event: any) {
        console.log("Disconnected.");
        // connected = false;
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
        state = event.data;
    }

    function onError(event: any) {
        console.log("Error: " + event.data);
    }

    export function doSend(_message: string) {
        websocket.send(_message);
    }

    export function getState(): number {
        return state;
    }
}
