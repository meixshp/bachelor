namespace Script {
    export class WebSocketClient {
        public state: number = 0;
        public websocket: WebSocket;
        public url: string;
        public connected: boolean;
        
        //let connectedtoWS: boolean = false;
        constructor(_url: string) {
            this.url = _url;
            console.log("Trying to open a WebSocket connection...");
            this.connected = false;
            //this.connecting(this.url);
        }

        public connecting(): boolean {
            try {
                this.connectToWS(this.url);
                return true;
            } catch {
                return false;
            }
        }

        public connectToWS(_url: string) {
            this.url = _url;
            this.websocket = new WebSocket(_url);
            this.websocket.onopen = (evt) => {
                this.onOpen(evt);
            };
            this.websocket.onclose = (evt) => {
                this.onClose(evt);
            };
            this.websocket.onmessage = (evt) => {
                this.onMessage(evt);
            };
            this.websocket.onerror = (evt) => {
                this.onError(evt);
            };
        }

        public onOpen(event: any) {
            console.log("Connected.");
            this.connected = true;
            //connected = true;
        }

        public onClose(event: any) {
            console.log("Disconnected.");
            // connected = false;
            setTimeout(function () {
                this.connectToWS(this.url);
            }, 1000);
        }

        public onMessage(event: any) {
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
            this.state = event.data;
        }

        public onError(event: any) {
            console.log("Error: " + event.data);
        }

        public doSend(_message: string) {
            this.websocket.send(_message);
        }

        public getState(): number {
            return this.state;
        }
    }
}
