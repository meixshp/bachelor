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
    var ƒAid = FudgeAid;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let player;
    let avatar;
    let joystickURL = "ws://192.168.2.209:1338/";
    let connectedToWS;
    let grid;
    let graph;
    let positionPlayer;
    let tempPosition;
    let sprite;
    let flower;
    let cameraNode = new ƒ.Node("cameraNode");
    let cmpCamera = new ƒ.ComponentCamera();
    let interactiveObjects;
    Script.root = new ƒ.Node("Root");
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        //viewport = _event.detail;
        connectedToWS = false; //connecting(joystickURL);
        //connectToWS(joystickURL);
        //console.log(viewport.camera);
        //viewport.camera.mtxPivot.translateZ(100);
        //viewport.camera.mtxPivot.rotateY(180);
        //viewport.camera.mtxPivot.translateX(-2);
        //viewport.camera.mtxPivot.translateY(2);
        //graph = viewport.getBranch();
        graph = ƒ.Project.resources["Graph|2022-08-09T09:54:54.928Z|39207"];
        player = graph.getChildrenByName("Player")[0];
        //sprite = await createSprite();
        //player.addChild(sprite);
        //player.getComponent(ƒ.ComponentMaterial).activate(false);
        cmpCamera.mtxPivot.translation = new ƒ.Vector3(0, 0, 30);
        cmpCamera.mtxPivot.rotation = new ƒ.Vector3(0, 180, 0);
        cameraNode.addComponent(cmpCamera);
        cameraNode.addComponent(new ƒ.ComponentTransform());
        graph.addChild(cameraNode);
        let canvas = document.querySelector("canvas");
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", graph, cmpCamera, canvas);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start();
    }
    async function update(_event) {
        placeCameraOnChar();
        document.addEventListener("keydown", interactWithObject);
        let deltaTime = ƒ.Loop.timeFrameReal / 200;
        tempPosition = player.mtxLocal.translation;
        if (connectedToWS) {
            Script.doSend("getState");
            let state = Script.getState();
            if (state == 4 || state == 5 || state == 6)
                player.mtxLocal.translateY(1 * deltaTime);
            if (state == 8 || state == 10 || state == 9)
                player.mtxLocal.translateY(-1 * deltaTime);
            if (state == 1 || state == 5 || state == 9)
                player.mtxLocal.translateX(-1 * deltaTime);
            if (state == 2 || state == 10 || state == 6)
                player.mtxLocal.translateX(1 * deltaTime);
        }
        else {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W]))
                player.mtxLocal.translateY(1 * deltaTime);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S]))
                player.mtxLocal.translateY(-1 * deltaTime);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A]))
                player.mtxLocal.translateX(-1 * deltaTime);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]))
                player.mtxLocal.translateX(1 * deltaTime);
        }
        if (checkCollision(player)) {
            console.log("colliding");
            player.mtxLocal.translation = tempPosition;
        }
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        //ƒ.AudioManager.default.update();
    }
    async function createSprite() {
        let imgSpriteSheet = new ƒ.TextureImage();
        await imgSpriteSheet.load("Images/avatar_sprites.png");
        let coat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
        let animation = new ƒAid.SpriteSheetAnimation("Player", coat);
        animation.generateByGrid(ƒ.Rectangle.GET(0, 128, 64, 128), 8, 82, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(64));
        let sprite = new ƒAid.NodeSprite("Sprite");
        sprite.setAnimation(animation);
        sprite.setFrameDirection(1);
        sprite.framerate = 15;
        let cmpTransfrom = new ƒ.ComponentTransform();
        sprite.addComponent(cmpTransfrom);
        sprite.getComponent(ƒ.ComponentMaterial).clrPrimary.a = 0.5;
        return sprite;
    }
    function createBlock() {
        let newNode = new ƒ.Node("Flower");
        let mesh = new ƒ.MeshSphere();
        let material = new ƒ.Material("MaterialFlower", ƒ.ShaderLit, new ƒ.CoatColored());
        let cmpTransfrom = new ƒ.ComponentTransform();
        let cmpMesh = new ƒ.ComponentMesh(mesh);
        let cmpMaterial = new ƒ.ComponentMaterial(material);
        cmpMaterial.clrPrimary = ƒ.Color.CSS("red");
        newNode.addComponent(cmpMaterial);
        newNode.addComponent(cmpMesh);
        newNode.addComponent(cmpTransfrom);
        newNode.mtxLocal.translate(new ƒ.Vector3(player.mtxLocal.translation.x, player.mtxLocal.translation.y, 1));
        return newNode;
    }
    function placeCameraOnChar() {
        cameraNode.mtxLocal.mutate({
            translation: player.mtxWorld.translation,
            rotation: new ƒ.Vector3(0, player.mtxWorld.rotation.y, 0),
        });
    }
    function checkCollision(node) {
        let obstacles = graph.getChildrenByName("Obstacles")[0];
        for (let obstacle of obstacles.getChildren()) {
            let positionObstacle = obstacle.mtxLocal.translation;
            if (Math.abs(node.mtxLocal.translation.x - positionObstacle.x) <= 1.2) {
                if (Math.abs(node.mtxLocal.translation.y - positionObstacle.y) <= 1.5) {
                    return true;
                }
            }
        }
        return false;
    }
    function interactWithObject(_event) {
        let placableObject = true;
        interactiveObjects = graph.getChildrenByName("Interactables")[0];
        if (_event.code == ƒ.KEYBOARD_CODE.SPACE) {
            if (interactiveObjects.getChildren().length != 0) { // if list is not empty
                for (let object of interactiveObjects.getChildren()) { // go through list
                    let positionObject = object.mtxLocal.translation;
                    if (placableObject) { // if there is a placableObject object available
                        if (Math.abs(player.mtxLocal.translation.x - positionObject.x) <= 1.0) { // check positioning
                            if (Math.abs(player.mtxLocal.translation.y - positionObject.y) <= 1.50) {
                                interactiveObjects.removeChild(object); // remove it
                                placableObject = false; //no placable object nearby anymore
                            }
                        }
                    }
                }
            }
            if (placableObject) {
                flower = createBlock();
                interactiveObjects.addChild(flower);
            }
        }
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒAid = FudgeAid;
    Script.animations = {};
    let spriteWater;
    let spritePaths;
    let spriteCat;
    let spriteCatThrow;
    let spriteCatWin;
    async function loadSprites() {
        let imgSpriteSheetCharacter = new ƒ.TextureImage();
        await imgSpriteSheetCharacter.load("Assets/3232SpriteTP.png");
        let spriteSheet = new ƒ.CoatTextured(undefined, imgSpriteSheetCharacter);
        let imgSpriteSheetGrass = new ƒ.TextureImage();
        await imgSpriteSheetGrass.load("Assets/StateMachine/PMWalk.png");
        let spriteSheetCAT = new ƒ.CoatTextured(undefined, imgSpriteSheetGrass);
        let imgSpriteSheetWall = new ƒ.TextureImage();
        await imgSpriteSheetWall.load("Assets/StateMachine/PMThrow.png");
        let spriteSheetCATThrow = new ƒ.CoatTextured(undefined, imgSpriteSheetWall);
        let imgSpriteSheetFlower = new ƒ.TextureImage();
        await imgSpriteSheetFlower.load("Assets/StateMachine/PMJump.png");
        let spriteSheetCATWin = new ƒ.CoatTextured(undefined, imgSpriteSheetFlower);
        generateSprites(spriteSheet, spriteSheetCAT, spriteSheetCATThrow, spriteSheetCATWin);
    }
    Script.loadSprites = loadSprites;
    function generateSprites(_spritesheet, _spriteSheetCAT, _spriteSheetCATThrow, _spriteSheetCATWin) {
        // ------------------------ Mobs p1 --------------------------------
        const mob = new ƒAid.SpriteSheetAnimation("mob", _spritesheet);
        mob.generateByGrid(ƒ.Rectangle.GET(160, 0, 32, 32), 4, 32, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(32));
        const mob2 = new ƒAid.SpriteSheetAnimation("mob2", _spritesheet);
        mob2.generateByGrid(ƒ.Rectangle.GET(288, 0, 32, 32), 4, 32, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(32));
        // ------------------------ Mobs p2 --------------------------------
        const mobP2 = new ƒAid.SpriteSheetAnimation("mobP2", _spritesheet);
        mobP2.generateByGrid(ƒ.Rectangle.GET(416, 0, 32, 32), 4, 32, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(32));
        const mob2P2 = new ƒAid.SpriteSheetAnimation("mob2P2", _spritesheet);
        mob2P2.generateByGrid(ƒ.Rectangle.GET(544, 0, 32, 32), 4, 32, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(32));
        // ------------------------ Water --------------------------------
        const water = new ƒAid.SpriteSheetAnimation("water", _spritesheet);
        water.generateByGrid(ƒ.Rectangle.GET(0, 0, 32, 32), 3, 32, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(32));
        // ------------------------ Statemachine IDLE --------------------------------
        const cat = new ƒAid.SpriteSheetAnimation("cat", _spriteSheetCAT);
        cat.generateByGrid(ƒ.Rectangle.GET(0, 0, 32, 32), 6, 32, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(32));
        // ------------------------ Statemachine THROW --------------------------------
        const catThrow = new ƒAid.SpriteSheetAnimation("catThrow", _spriteSheetCATThrow);
        catThrow.generateByGrid(ƒ.Rectangle.GET(0, 0, 32, 32), 4, 32, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(32));
        // ------------------------ Statemachine WIN --------------------------------
        const catWin = new ƒAid.SpriteSheetAnimation("catWin", _spriteSheetCATWin);
        catWin.generateByGrid(ƒ.Rectangle.GET(0, 0, 32, 32), 8, 32, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(32));
        // ------------------------ Paths --------------------------------
        const paths = new ƒAid.SpriteSheetAnimation("paths", _spritesheet);
        paths.generateByGrid(ƒ.Rectangle.GET(96, 0, 32, 32), 1, 32, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(32));
        Script.animations["mob"] = mob;
        Script.animations["mob2"] = mob2;
        Script.animations["mobP2"] = mobP2;
        Script.animations["mob2P2"] = mob2P2;
        Script.animations["paths"] = paths;
        Script.animations["water"] = water;
        Script.animations["cat"] = cat;
        Script.animations["catThrow"] = catThrow;
        Script.animations["catWin"] = catWin;
    }
    function setSprite(_node) {
        spriteWater = new ƒAid.NodeSprite("Sprite");
        spriteWater.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        spriteWater.setAnimation(Script.animations["water"]);
        spriteWater.setFrameDirection(1);
        spriteWater.mtxLocal.translateZ(0.0001);
        spriteWater.framerate = 2;
        _node.addChild(spriteWater);
        _node.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
    }
    Script.setSprite = setSprite;
    function setSpritePaths(_node) {
        spritePaths = new ƒAid.NodeSprite("Sprite");
        spritePaths.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        spritePaths.setAnimation(Script.animations["paths"]);
        spritePaths.setFrameDirection(1);
        spritePaths.mtxLocal.translateZ(0.0001);
        spritePaths.framerate = 1;
        _node.addChild(spritePaths);
        _node.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
    }
    Script.setSpritePaths = setSpritePaths;
    function setSpriteCat(_node) {
        spriteCat = new ƒAid.NodeSprite("SpriteCat");
        spriteCat.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        spriteCat.setAnimation(Script.animations["cat"]);
        spriteCat.setFrameDirection(1);
        spriteCat.mtxLocal.translateZ(0.0001);
        spriteCat.framerate = 5;
        _node.addChild(spriteCat);
        _node.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
        //spriteCat.mtxLocal.rotateZ(90);
    }
    Script.setSpriteCat = setSpriteCat;
    function setSpriteCatThrow(_node) {
        spriteCatThrow = new ƒAid.NodeSprite("SpriteCatThrow");
        spriteCatThrow.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        spriteCatThrow.setAnimation(Script.animations["catThrow"]);
        spriteCatThrow.setFrameDirection(1);
        spriteCatThrow.mtxLocal.translateZ(0.0002);
        spriteCatThrow.framerate = 5;
        _node.addChild(spriteCatThrow);
        _node.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
        //spriteCat.mtxLocal.rotateZ(90);
    }
    Script.setSpriteCatThrow = setSpriteCatThrow;
    function setSpriteCatWin(_node) {
        spriteCatWin = new ƒAid.NodeSprite("SpriteCatWin");
        spriteCatWin.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        spriteCatWin.setAnimation(Script.animations["catWin"]);
        spriteCatWin.setFrameDirection(1);
        spriteCatWin.mtxLocal.translateZ(0.0002);
        spriteCatWin.framerate = 5;
        _node.addChild(spriteCatWin);
        _node.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
        //spriteCat.mtxLocal.rotateZ(90);
    }
    Script.setSpriteCatWin = setSpriteCatWin;
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
    //let connectedtoWS: boolean = false;
    let websocket;
    console.log("Trying to open a WebSocket connection...");
    //connectToWS(url);
    function connecting(_url) {
        try {
            connectToWS(_url);
            return true;
        }
        catch {
            return false;
        }
    }
    Script.connecting = connecting;
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