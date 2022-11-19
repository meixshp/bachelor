"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CubeComponentScript extends ƒ.ComponentScript {
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "CubeComponentScript added to ";
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        ƒ.Debug.log(this.message, this.node);
                        break;
                    case "componentRemove" /* COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* NODE_DESERIALIZED */:
                        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                        break;
                }
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    // Register the script as component for use in the editor via drag&drop
    CubeComponentScript.iSubclass = ƒ.Component.registerSubclass(CubeComponentScript);
    Script.CubeComponentScript = CubeComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "CustomComponentScript added to ";
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        ƒ.Debug.log(this.message, this.node);
                        break;
                    case "componentRemove" /* COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* NODE_DESERIALIZED */:
                        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                        break;
                }
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    // Register the script as component for use in the editor via drag&drop
    CustomComponentScript.iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let player;
    let joystickURL = "ws://192.168.2.209:1338/";
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        Script.connectToWS(joystickURL);
        console.log(viewport.camera);
        viewport.camera.mtxPivot.translateZ(30);
        viewport.camera.mtxPivot.rotateY(180);
        //viewport.camera.mtxPivot.translateX(-2);
        //viewport.camera.mtxPivot.translateY(2);
        let graph = viewport.getBranch();
        player = graph.getChildrenByName("Player")[0];
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start();
        // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    async function update(_event) {
        Script.doSend("getState");
        let state = Script.getState();
        //let positionPlayer = player.mtxLocal.translation;
        let deltaTime = ƒ.Loop.timeFrameReal / 500;
        /*
                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W]))
                    player.mtxLocal.translateY(1 * deltaTime);
                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S]))
                    player.mtxLocal.translateY(-1 * deltaTime);
                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A]))
                    player.mtxLocal.translateX(-1 * deltaTime);
                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]))
                    player.mtxLocal.translateX(1 * deltaTime);
        */
        if (state == 4 || state == 5 || state == 6)
            player.mtxLocal.translateY(1 * deltaTime);
        if (state == 8 || state == 10 || state == 9)
            player.mtxLocal.translateY(-1 * deltaTime);
        if (state == 1 || state == 5 || state == 9)
            player.mtxLocal.translateX(-1 * deltaTime);
        if (state == 2 || state == 10 || state == 6)
            player.mtxLocal.translateX(1 * deltaTime);
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    async function getPosition() {
        try {
            return await holdConnection();
        }
        catch (error) {
            if (error instanceof Error) {
                console.log('error message: ', error.message);
                return error.message;
            }
            else {
                console.log('unexpected error: ', error);
                return 'An unexpected error occurred';
            }
        }
    }
    Script.getPosition = getPosition;
    //--------------------------------------------------------------//
    async function holdConnection() {
        const response = await fetch('http://192.168.2.211:90', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        });
        return response;
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    let state = 0;
    let url = "";
    //let connected: boolean;
    let websocket;
    console.log("Trying to open a WebSocket connection...");
    //connectToWS(url);
    function connectToWS(_url) {
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
    Script.connectToWS = connectToWS;
    function onOpen(event) {
        console.log("Connected.");
        //connected = true;
    }
    function onClose(event) {
        console.log("Disconnected.");
        // connected = false;
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
        state = event.data;
    }
    function onError(event) {
        console.log("Error: " + event.data);
    }
    function doSend(_message) {
        websocket.send(_message);
    }
    Script.doSend = doSend;
    function getState() {
        return state;
    }
    Script.getState = getState;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map