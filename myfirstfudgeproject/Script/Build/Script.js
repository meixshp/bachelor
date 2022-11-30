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
    let lightRadius;
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
    let grass;
    let walls;
    let tombstones;
    let flowers;
    let pulse;
    Script.root = new ƒ.Node("Root");
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        // ---------- IF DEFAULT CAMERA 
        // viewport = _event.detail;
        // viewport.camera.mtxPivot.translateZ(42);
        // viewport.camera.mtxPivot.rotateY(180);
        // viewport.camera.mtxPivot.translateX(0);
        // viewport.camera.mtxPivot.translateY(4);
        // graph = viewport.getBranch();
        // ---------- IF CAMERA ON PLAYER
        graph = ƒ.Project.resources["Graph|2022-08-09T09:54:54.928Z|39207"];
        cmpCamera.mtxPivot.translation = new ƒ.Vector3(0, 0, 30);
        cmpCamera.mtxPivot.rotation = new ƒ.Vector3(0, 180, 0);
        cameraNode.addComponent(cmpCamera);
        cameraNode.addComponent(new ƒ.ComponentTransform());
        graph.addChild(cameraNode);
        let canvas = document.querySelector("canvas");
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", graph, cmpCamera, canvas);
        connectedToWS = false;
        //connecting(joystickURL);
        //connectToWS(joystickURL);
        player = graph.getChildrenByName("Player")[0];
        lightRadius = player.getChildrenByName("Light")[0];
        //lightRadius.getComponent(ƒ.ComponentMaterial).activate(false);
        //sprite = await createSprite();
        //player.addChild(sprite);
        //player.getComponent(ƒ.ComponentMaterial).activate(false);
        await Script.loadSprites();
        await Script.addLightRadius(lightRadius);
        await handleSprites();
        //document.querySelector("#speechbox").setAttribute("style","visibility:visible");
        //document.getElementById("speechbox").innerHTML = "Game over!";
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start();
    }
    async function update(_event) {
        placeCameraOnChar();
        document.addEventListener("keydown", interactWithObject);
        let deltaTime = ƒ.Loop.timeFrameReal / 200;
        tempPosition = player.mtxLocal.translation;
        //changeLightRadius();
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
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W])) {
                player.mtxLocal.translateY(1 * deltaTime);
                //lightRadius.mtxLocal.translateY(1 * deltaTime);
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S])) {
                player.mtxLocal.translateY(-1 * deltaTime);
                //lightRadius.mtxLocal.translateY(-1 * deltaTime*200);
            }
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
    async function handleSprites() {
        grass = graph.getChildrenByName("Map")[0].getChild(1);
        await Script.setGrassMaterial(grass);
        //for (let block of grass.getChildren()) {
        //    setSpriteGrass(block);
        //}
        walls = graph.getChildrenByName("Map")[0].getChild(0).getChild(11);
        await Script.setWallMaterial(walls);
        tombstones = graph.getChildrenByName("Obstacles")[0];
        for (let stone of tombstones.getChildren()) {
            Script.setSpriteTombstone(stone);
        }
    }
    function createBlock() {
        let newNode = new ƒ.Node("Flower");
        //let mesh: ƒ.MeshSphere = new ƒ.MeshSphere();
        let material = new ƒ.Material("MaterialFlower", ƒ.ShaderLit, new ƒ.CoatColored());
        let cmpTransfrom = new ƒ.ComponentTransform();
        //let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(mesh);
        let cmpMaterial = new ƒ.ComponentMaterial(material);
        cmpMaterial.clrPrimary = ƒ.Color.CSS("red");
        newNode.addComponent(cmpMaterial);
        //newNode.addComponent(cmpMesh);
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
                Script.setSpriteFlower(flower);
            }
        }
    }
    function changeLightRadius() {
        let defaultZ = 6;
        if (pulse <= 90) {
            console.log("Big Radius");
        }
        else if (pulse > 90) {
            console.log("Small Radius");
        }
        else
            console.log("Default Radius");
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒAid = FudgeAid;
    Script.animations = {};
    let spriteTombstone;
    let spriteFlower;
    let spriteLight;
    let material;
    async function loadSprites() {
        let imgSpriteSheetGrass = new ƒ.TextureImage();
        await imgSpriteSheetGrass.load("Images/GRASS+.png");
        let spriteSheet = new ƒ.CoatTextured(undefined, imgSpriteSheetGrass);
        let imgSpriteSheetWall = new ƒ.TextureImage();
        await imgSpriteSheetWall.load("Images/wall3.png");
        let spriteSheetWall = new ƒ.CoatTextured(undefined, imgSpriteSheetWall);
        // let imgSpriteSheetLight: ƒ.TextureImage = new ƒ.TextureImage();
        // await imgSpriteSheetLight.load("Images/light_radius.png");
        // let spriteSheetLight: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheetLight);
        generateSprites(spriteSheet, spriteSheetWall);
    }
    Script.loadSprites = loadSprites;
    function generateSprites(_spritesheet, _spritesheetWall) {
        // Grass ------------------------
        const grass = new ƒAid.SpriteSheetAnimation("grass", _spritesheet);
        grass.generateByGrid(ƒ.Rectangle.GET(128, 48, 16, 16), 1, 16, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(16));
        // Tombstones ------------------------
        const stone = new ƒAid.SpriteSheetAnimation("stone", _spritesheet);
        stone.generateByGrid(ƒ.Rectangle.GET(160, 208, 16, 16), 1, 16, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(16));
        // Flower ------------------------
        const flower = new ƒAid.SpriteSheetAnimation("flower", _spritesheet);
        flower.generateByGrid(ƒ.Rectangle.GET(32, 192, 16, 16), 1, 16, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(16));
        // Flower ------------------------
        const wall = new ƒAid.SpriteSheetAnimation("wall", _spritesheetWall);
        wall.generateByGrid(ƒ.Rectangle.GET(0, 0, 250, 250), 1, 250, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(250));
        // Light ------------------------
        // const light: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("light", _spritesheetLight);
        // light.generateByGrid(ƒ.Rectangle.GET(0, 0, 3508, 2480), 1, 2480, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(3508));
        Script.animations["grass"] = grass;
        Script.animations["wall"] = wall;
        Script.animations["tombstone"] = stone;
        Script.animations["flower"] = flower;
        // animations["light"] = light;
    }
    async function setGrassMaterial(_node) {
        let textureImage = new ƒ.TextureImage();
        await textureImage.load("../Images/grass.png");
        let coatSprite = new ƒ.CoatTextured(undefined, textureImage);
        material = new ƒ.Material("grass", ƒ.ShaderLitTextured, coatSprite);
        //material = new ƒ.Material("grass", ƒ.ShaderLit, new ƒ.CoatColored(new ƒ.Color(1, 0, 1, 1)));
        let cmpMaterial = new ƒ.ComponentMaterial(material);
        _node.addComponent(cmpMaterial);
        cmpMaterial.mtxPivot.scale(new ƒ.Vector2(12, 9));
    }
    Script.setGrassMaterial = setGrassMaterial;
    async function setWallMaterial(_node) {
        let textureImage = new ƒ.TextureImage();
        await textureImage.load("../Images/wall3.png");
        let coatSprite = new ƒ.CoatTextured(undefined, textureImage);
        material = new ƒ.Material("wall", ƒ.ShaderLitTextured, coatSprite);
        //material = new ƒ.Material("grass", ƒ.ShaderLit, new ƒ.CoatColored(new ƒ.Color(1, 0, 1, 1)));
        let cmpMaterial = new ƒ.ComponentMaterial(material);
        _node.addComponent(cmpMaterial);
        cmpMaterial.mtxPivot.scale(new ƒ.Vector2(12, 1));
    }
    Script.setWallMaterial = setWallMaterial;
    function setSpriteTombstone(_node) {
        spriteTombstone = new ƒAid.NodeSprite("SpriteWall");
        spriteTombstone.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        spriteTombstone.setAnimation(Script.animations["tombstone"]);
        spriteTombstone.setFrameDirection(1);
        spriteTombstone.mtxLocal.translateZ(0.0001);
        spriteTombstone.framerate = 1;
        _node.addChild(spriteTombstone);
        //_node.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
    }
    Script.setSpriteTombstone = setSpriteTombstone;
    function setSpriteFlower(_node) {
        spriteFlower = new ƒAid.NodeSprite("SpriteFlower");
        spriteFlower.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        spriteFlower.setAnimation(Script.animations["flower"]);
        spriteFlower.setFrameDirection(1);
        spriteFlower.mtxLocal.translateZ(0.0001);
        spriteFlower.framerate = 1;
        _node.addChild(spriteFlower);
        //_node.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
    }
    Script.setSpriteFlower = setSpriteFlower;
    async function addLightRadius(_node) {
        let textureImage = new ƒ.TextureImage();
        await textureImage.load("../Images/lightradius.png");
        let coatSprite = new ƒ.CoatTextured(undefined, textureImage);
        material = new ƒ.Material("Light", ƒ.ShaderLitTextured, coatSprite);
        //material = new ƒ.Material("grass", ƒ.ShaderLit, new ƒ.CoatColored(new ƒ.Color(1, 0, 1, 1)));
        let cmpMaterial = new ƒ.ComponentMaterial(material);
        _node.addComponent(cmpMaterial);
        cmpMaterial.mtxPivot.scale(new ƒ.Vector2(1, 1));
        // spriteLight = new ƒAid.NodeSprite("SpriteLight");
        // spriteLight.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        // spriteLight.setAnimation(<ƒAid.SpriteSheetAnimation>animations["light"]);
        // spriteLight.setFrameDirection(1);
        // spriteLight.mtxLocal.translateZ(0.0001);
        // spriteLight.framerate = 1;
        // _node.addChild(spriteLight);
    }
    Script.addLightRadius = addLightRadius;
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