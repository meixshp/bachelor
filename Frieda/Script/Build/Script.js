"use strict";
var Frieda;
(function (Frieda) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Frieda); // Register the namespace to FUDGE for serialization
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
    Frieda.CustomComponentScript = CustomComponentScript;
})(Frieda || (Frieda = {}));
var Frieda;
(function (Frieda) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let player;
    let avatar;
    let joystickURL = "ws://192.168.2.209:1338/";
    //let connectedToWS: boolean;
    let grid;
    let graph;
    let positionPlayer;
    let tempPosition;
    let sprite;
    let flower;
    let cameraNode = new ƒ.Node("cameraNode");
    let cmpCamera = new ƒ.ComponentCamera();
    let interactiveObjects;
    let grasses;
    let bushes;
    let trees;
    let door;
    let walls;
    let tombstones;
    let flowers;
    let speechboxOpen;
    Frieda.root = new ƒ.Node("Root");
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        // ---------- IF DEFAULT CAMERA
        // viewport = _event.detail;
        // viewport.camera.mtxPivot.translateZ(80);
        // viewport.camera.mtxPivot.rotateY(180);
        // viewport.camera.mtxPivot.translateX(3);
        // viewport.camera.mtxPivot.translateY(8);
        // graph = viewport.getBranch();
        // ---------- IF CAMERA ON PLAYER
        graph = ƒ.Project.resources["Graph|2022-11-29T12:16:57.928Z|95652"];
        cmpCamera.mtxPivot.translation = new ƒ.Vector3(0, 0, 30);
        cmpCamera.mtxPivot.rotation = new ƒ.Vector3(0, 180, 0);
        cameraNode.addComponent(cmpCamera);
        cameraNode.addComponent(new ƒ.ComponentTransform());
        graph.addChild(cameraNode);
        let canvas = document.querySelector("canvas");
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", graph, cmpCamera, canvas);
        //connectedtoWS = connecting(joystickURL);
        Frieda.connectToWS(joystickURL);
        player = graph.getChildrenByName("Player")[0];
        await Frieda.loadSprites();
        await handleSprites();
        // document.querySelector("#speechbox").setAttribute("style","visibility:visible");
        // document.getElementById("speechbox").innerHTML = "Game over!";
        speechboxOpen = false;
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start();
    }
    async function update(_event) {
        placeCameraOnChar();
        document.addEventListener("keydown", interactWithObject);
        let deltaTime = ƒ.Loop.timeFrameReal / 200;
        tempPosition = player.mtxLocal.translation;
        if (Frieda.connectedtoWS) {
            Frieda.doSend("getState");
            let state = Frieda.getState();
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
        viewport.draw();
        //ƒ.AudioManager.default.update();
    }
    async function handleSprites() {
        grasses = graph.getChildrenByName("Map")[0].getChild(0);
        // for (let grass of grasses.getChildren()) {
        //     await setGrassMaterial(grass);
        // }
        await Frieda.setGrassMaterial(grasses.getChild(0), new ƒ.Vector2(5, 5));
        await Frieda.setGrassMaterial(grasses.getChild(1), new ƒ.Vector2(26, 6));
        await Frieda.setGrassMaterial(grasses.getChild(2), new ƒ.Vector2(5, 6));
        await Frieda.setGrassMaterial(grasses.getChild(3), new ƒ.Vector2(16, 9));
        await Frieda.setGrassMaterial(grasses.getChild(4), new ƒ.Vector2(12, 15));
        await Frieda.setGrassMaterial(grasses.getChild(5), new ƒ.Vector2(18, 18));
        await Frieda.setGrassMaterial(grasses.getChild(6), new ƒ.Vector2(6, 9));
        await Frieda.setGrassMaterial(grasses.getChild(7), new ƒ.Vector2(14, 13));
        bushes = graph.getChildrenByName("Map")[0].getChild(1);
        for (let bush of bushes.getChildren()) {
            bush.getComponent(ƒ.ComponentMaterial).activate(false);
            Frieda.setSpriteBush(bush);
        }
        trees = graph.getChildrenByName("Map")[0].getChild(2);
        for (let tree of trees.getChildren()) {
            Frieda.setSpriteTree(tree);
        }
        flowers = graph.getChildrenByName("Interactables")[0];
        for (let flower of flowers.getChildren()) {
            flower.getComponent(ƒ.ComponentMaterial).activate(false);
            Frieda.setSpriteFlower(flower);
        }
        door = graph.getChildrenByName("Map")[0].getChild(3);
        Frieda.setSpriteDoor(door);
        // walls = graph.getChildrenByName("Map")[0].getChild(0).getChild(11);
        // await setWallMaterial(walls);
        tombstones = graph.getChildrenByName("Tombstones")[0];
        for (let stone of tombstones.getChildren()) {
            Frieda.setSpriteTombstone(stone);
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
        newNode.mtxLocal.translate(new ƒ.Vector3(player.mtxLocal.translation.x, player.mtxLocal.translation.y, 0.01));
        return newNode;
    }
    function placeCameraOnChar() {
        cameraNode.mtxLocal.mutate({
            translation: player.mtxWorld.translation,
            rotation: new ƒ.Vector3(0, player.mtxWorld.rotation.y, 0),
        });
    }
    function checkCollision(node) {
        let obstacles = graph.getChildrenByName("Tombstones")[0];
        for (let obstacle of obstacles.getChildren()) {
            let positionObstacle = obstacle.mtxLocal.translation;
            if (Math.abs(node.mtxLocal.translation.x - positionObstacle.x) <= 1) {
                if (Math.abs(node.mtxLocal.translation.y - positionObstacle.y) <= 1) {
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
            if (speechboxOpen) {
                document.querySelector("#speechbox").setAttribute("style", "visibility:hidden");
                speechboxOpen = false;
            }
            else {
                if (interactiveObjects.getChildren().length != 0) {
                    // if list is not empty
                    for (let object of interactiveObjects.getChildren()) {
                        // go through list
                        let positionObject = object.mtxLocal.translation;
                        if (placableObject) {
                            // if there is a placableObject object available
                            if (Math.abs(player.mtxLocal.translation.x - positionObject.x) <= 1.0) {
                                // check positioning
                                if (Math.abs(player.mtxLocal.translation.y - positionObject.y) <= 1.5) {
                                    interactiveObjects.removeChild(object); // remove it
                                    placableObject = false; //no placable object nearby anymore
                                }
                            }
                        }
                    }
                }
                if (interactiveObjects.getChildren().length < 4) {
                    if (placableObject) {
                        flower = createBlock();
                        interactiveObjects.addChild(flower);
                        Frieda.setSpriteFlower(flower);
                    }
                }
                else {
                    document.querySelector("#speechbox").setAttribute("style", "visibility:visible");
                    document.getElementById("speechbox").innerHTML = "Oh, there's nothing to pick here...";
                    speechboxOpen = true;
                }
            }
        }
    }
})(Frieda || (Frieda = {}));
var Frieda;
(function (Frieda) {
    var ƒAid = FudgeAid;
    Frieda.animations = {};
    let spriteTombstone;
    let spriteFlower;
    let spriteBush;
    let spriteTree;
    let spriteDoor;
    let material;
    async function loadSprites() {
        let imgSpriteSheetGrass = new ƒ.TextureImage();
        await imgSpriteSheetGrass.load("Images/GRASS+.png");
        let spriteSheet = new ƒ.CoatTextured(undefined, imgSpriteSheetGrass);
        let imgSpriteSheetWall = new ƒ.TextureImage();
        await imgSpriteSheetWall.load("Images/wall3.png");
        let spriteSheetWall = new ƒ.CoatTextured(undefined, imgSpriteSheetWall);
        let imgSpriteSheetTilesheet = new ƒ.TextureImage();
        await imgSpriteSheetTilesheet.load("Images/tilesheet.png");
        let spriteSheetTilesheet = new ƒ.CoatTextured(undefined, imgSpriteSheetTilesheet);
        let imgSpriteSheetOverworld = new ƒ.TextureImage();
        await imgSpriteSheetOverworld.load("Images/Overworld.png");
        let spriteSheetOverworld = new ƒ.CoatTextured(undefined, imgSpriteSheetOverworld);
        generateSprites(spriteSheet, spriteSheetWall, spriteSheetTilesheet, spriteSheetOverworld);
    }
    Frieda.loadSprites = loadSprites;
    function generateSprites(_spritesheet, _spritesheetWall, _spritesheetTilesheet, _spritesheetOverworld) {
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
        // Bush ------------------------
        const bush = new ƒAid.SpriteSheetAnimation("bush", _spritesheet);
        bush.generateByGrid(ƒ.Rectangle.GET(160, 176, 16, 16), 1, 16, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(16));
        // Tree ------------------------
        const tree = new ƒAid.SpriteSheetAnimation("tree", _spritesheetTilesheet);
        tree.generateByGrid(ƒ.Rectangle.GET(580, 488, 182, 245), 1, 200, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(200));
        // // Door ------------------------
        const door = new ƒAid.SpriteSheetAnimation("door", _spritesheetOverworld);
        door.generateByGrid(ƒ.Rectangle.GET(498, 79, 27, 33), 1, 33, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(33));
        Frieda.animations["grass"] = grass;
        Frieda.animations["wall"] = wall;
        Frieda.animations["tombstone"] = stone;
        Frieda.animations["flower"] = flower;
        Frieda.animations["bush"] = bush;
        Frieda.animations["tree"] = tree;
        Frieda.animations["door"] = door;
    }
    async function setGrassMaterial(_node, _scale) {
        let textureImage = new ƒ.TextureImage();
        await textureImage.load("../Images/grass.png");
        let coatSprite = new ƒ.CoatTextured(undefined, textureImage);
        material = new ƒ.Material("grass", ƒ.ShaderLitTextured, coatSprite);
        //material = new ƒ.Material("grass", ƒ.ShaderLit, new ƒ.CoatColored(new ƒ.Color(1, 0, 1, 1)));
        let cmpMaterial = new ƒ.ComponentMaterial(material);
        _node.addComponent(cmpMaterial);
        cmpMaterial.mtxPivot.scale(_scale);
    }
    Frieda.setGrassMaterial = setGrassMaterial;
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
    Frieda.setWallMaterial = setWallMaterial;
    function setSpriteTombstone(_node) {
        spriteTombstone = new ƒAid.NodeSprite("SpriteWall");
        spriteTombstone.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        spriteTombstone.setAnimation(Frieda.animations["tombstone"]);
        spriteTombstone.setFrameDirection(1);
        spriteTombstone.mtxLocal.translateZ(0.0001);
        spriteTombstone.framerate = 1;
        _node.addChild(spriteTombstone);
        //_node.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
    }
    Frieda.setSpriteTombstone = setSpriteTombstone;
    function setSpriteFlower(_node) {
        spriteFlower = new ƒAid.NodeSprite("SpriteFlower");
        spriteFlower.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        spriteFlower.setAnimation(Frieda.animations["flower"]);
        spriteFlower.setFrameDirection(1);
        spriteFlower.mtxLocal.translateZ(0.0001);
        spriteFlower.framerate = 1;
        _node.addChild(spriteFlower);
        //_node.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
    }
    Frieda.setSpriteFlower = setSpriteFlower;
    function setSpriteBush(_node) {
        spriteBush = new ƒAid.NodeSprite("SpriteBush");
        spriteBush.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        spriteBush.setAnimation(Frieda.animations["bush"]);
        spriteBush.setFrameDirection(1);
        spriteBush.mtxLocal.translateZ(0.0001);
        spriteBush.framerate = 1;
        _node.addChild(spriteBush);
        //_node.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
    }
    Frieda.setSpriteBush = setSpriteBush;
    function setSpriteTree(_node) {
        spriteTree = new ƒAid.NodeSprite("SpriteTree");
        spriteTree.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        spriteTree.setAnimation(Frieda.animations["tree"]);
        spriteTree.setFrameDirection(1);
        spriteTree.mtxLocal.translateZ(0.0001);
        spriteTree.framerate = 1;
        _node.addChild(spriteTree);
        //_node.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
    }
    Frieda.setSpriteTree = setSpriteTree;
    function setSpriteDoor(_node) {
        spriteDoor = new ƒAid.NodeSprite("SpriteDoor");
        spriteDoor.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        spriteDoor.setAnimation(Frieda.animations["door"]);
        spriteDoor.setFrameDirection(1);
        spriteDoor.mtxLocal.translateZ(0.0001);
        spriteDoor.framerate = 1;
        _node.addChild(spriteDoor);
        //_node.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
    }
    Frieda.setSpriteDoor = setSpriteDoor;
})(Frieda || (Frieda = {}));
var Frieda;
(function (Frieda) {
    let state = 0;
    let url = "";
    Frieda.connectedtoWS = false;
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
    Frieda.connecting = connecting;
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
    Frieda.connectToWS = connectToWS;
    function onOpen(event) {
        console.log("Connected.");
        Frieda.connectedtoWS = true;
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
    Frieda.doSend = doSend;
    function getState() {
        return state;
    }
    Frieda.getState = getState;
})(Frieda || (Frieda = {}));
//# sourceMappingURL=Script.js.map