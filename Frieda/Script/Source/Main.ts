namespace Frieda {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    ƒ.Debug.info("Main Program Template running!");

    let viewport: ƒ.Viewport;
    let player: ƒ.Node;
    let avatar: ƒAid.NodeSprite;
    let joystickURL = "ws://192.168.2.209:1338/";
    //let connectedToWS: boolean;
    let grid: ƒ.Node;
    let graph: ƒ.Node;
    let positionPlayer: ƒ.Vector3;
    let tempPosition: ƒ.Vector3;
    let sprite: ƒAid.NodeSprite;
    let flower: ƒ.Node;
    let cameraNode: ƒ.Node = new ƒ.Node("cameraNode");
    let cmpCamera = new ƒ.ComponentCamera();
    let interactiveObjects: ƒ.Node;
    let grasses: ƒ.Node;
    let bushes: ƒ.Node;
    let trees: ƒ.Node;
    let door: ƒ.Node;
    let walls: ƒ.Node;
    let tombstones: ƒ.Node;
    let flowers: ƒ.Node;
    let speechboxOpen: boolean;

    export let root: ƒ.Node = new ƒ.Node("Root");
    document.addEventListener("interactiveViewportStarted", <EventListener>(<unknown>start));

    async function start(_event: CustomEvent): Promise<void> {
        // ---------- IF DEFAULT CAMERA
        // viewport = _event.detail;
        // viewport.camera.mtxPivot.translateZ(80);
        // viewport.camera.mtxPivot.rotateY(180);
        // viewport.camera.mtxPivot.translateX(3);
        // viewport.camera.mtxPivot.translateY(8);
        // graph = viewport.getBranch();

        // ---------- IF CAMERA ON PLAYER
        graph = <ƒ.Graph>ƒ.Project.resources["Graph|2022-11-29T12:16:57.928Z|95652"];
        cmpCamera.mtxPivot.translation = new ƒ.Vector3(0, 0, 30);
        cmpCamera.mtxPivot.rotation = new ƒ.Vector3(0, 180, 0);
        cameraNode.addComponent(cmpCamera);
        cameraNode.addComponent(new ƒ.ComponentTransform());
        graph.addChild(cameraNode);

        let canvas: HTMLCanvasElement = document.querySelector("canvas");
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", graph, cmpCamera, canvas);

        //connectedtoWS = connecting(joystickURL);
        connectToWS(joystickURL);

        player = graph.getChildrenByName("Player")[0];

        await loadSprites();
        await handleSprites();

        // document.querySelector("#speechbox").setAttribute("style","visibility:visible");
        // document.getElementById("speechbox").innerHTML = "Game over!";
        speechboxOpen = false;

        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start();
    }

    async function update(_event: Event): Promise<void> {
        placeCameraOnChar();
        document.addEventListener("keydown", interactWithObject);

        let deltaTime: number = ƒ.Loop.timeFrameReal / 200;
        tempPosition = player.mtxLocal.translation;

        if (connectedtoWS) {
            doSend("getState");
            let state = getState();
            if (state == 4 || state == 5 || state == 6) player.mtxLocal.translateY(1 * deltaTime);
            if (state == 8 || state == 10 || state == 9) player.mtxLocal.translateY(-1 * deltaTime);
            if (state == 1 || state == 5 || state == 9) player.mtxLocal.translateX(-1 * deltaTime);
            if (state == 2 || state == 10 || state == 6) player.mtxLocal.translateX(1 * deltaTime);
        } else {
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

    async function handleSprites(): Promise<void> {
        grasses = graph.getChildrenByName("Map")[0].getChild(0);
        // for (let grass of grasses.getChildren()) {
        //     await setGrassMaterial(grass);
        // }
        await setGrassMaterial(grasses.getChild(0), new ƒ.Vector2(5, 5));
        await setGrassMaterial(grasses.getChild(1), new ƒ.Vector2(26, 6));
        await setGrassMaterial(grasses.getChild(2), new ƒ.Vector2(5, 6));
        await setGrassMaterial(grasses.getChild(3), new ƒ.Vector2(16, 9));
        await setGrassMaterial(grasses.getChild(4), new ƒ.Vector2(12, 15));
        await setGrassMaterial(grasses.getChild(5), new ƒ.Vector2(18, 18));
        await setGrassMaterial(grasses.getChild(6), new ƒ.Vector2(6, 9));
        await setGrassMaterial(grasses.getChild(7), new ƒ.Vector2(14, 13));

        bushes = graph.getChildrenByName("Map")[0].getChild(1);
        for (let bush of bushes.getChildren()) {
            bush.getComponent(ƒ.ComponentMaterial).activate(false);
            setSpriteBush(bush);
        }

        trees = graph.getChildrenByName("Map")[0].getChild(2);
        for (let tree of trees.getChildren()) {
            setSpriteTree(tree);
        }

        flowers = graph.getChildrenByName("Interactables")[0];
        for (let flower of flowers.getChildren()) {
            flower.getComponent(ƒ.ComponentMaterial).activate(false);
            setSpriteFlower(flower);
        }

        door = graph.getChildrenByName("Map")[0].getChild(3);
        setSpriteDoor(door);

        // walls = graph.getChildrenByName("Map")[0].getChild(0).getChild(11);
        // await setWallMaterial(walls);

        tombstones = graph.getChildrenByName("Tombstones")[0];
        for (let stone of tombstones.getChildren()) {
            setSpriteTombstone(stone);
        }
    }

    function createBlock(): ƒ.Node {
        let newNode: ƒ.Node = new ƒ.Node("Flower");

        //let mesh: ƒ.MeshSphere = new ƒ.MeshSphere();
        let material: ƒ.Material = new ƒ.Material("MaterialFlower", ƒ.ShaderLit, new ƒ.CoatColored());
        let cmpTransfrom: ƒ.ComponentTransform = new ƒ.ComponentTransform();
        //let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(mesh);
        let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);
        cmpMaterial.clrPrimary = ƒ.Color.CSS("red");

        newNode.addComponent(cmpMaterial);
        //newNode.addComponent(cmpMesh);
        newNode.addComponent(cmpTransfrom);
        newNode.mtxLocal.translate(
            new ƒ.Vector3(player.mtxLocal.translation.x, player.mtxLocal.translation.y, 0.01)
        );

        return newNode;
    }

    function placeCameraOnChar(): void {
        cameraNode.mtxLocal.mutate({
            translation: player.mtxWorld.translation,
            rotation: new ƒ.Vector3(0, player.mtxWorld.rotation.y, 0),
        });
    }

    function checkCollision(node: ƒ.Node): boolean {
        let obstacles: ƒ.Node = graph.getChildrenByName("Tombstones")[0];

        for (let obstacle of obstacles.getChildren()) {
            let positionObstacle: ƒ.Vector3 = obstacle.mtxLocal.translation;

            if (Math.abs(node.mtxLocal.translation.x - positionObstacle.x) <= 1) {
                if (Math.abs(node.mtxLocal.translation.y - positionObstacle.y) <= 1) {
                    return true;
                }
            }
        }
        return false;
    }

    function interactWithObject(_event: KeyboardEvent): void {
        let placableObject: boolean = true;
        interactiveObjects = graph.getChildrenByName("Interactables")[0];

        if (_event.code == ƒ.KEYBOARD_CODE.SPACE) {
            if (speechboxOpen) {
                document.querySelector("#speechbox").setAttribute("style", "visibility:hidden");
                speechboxOpen = false;
            } else {
                if (interactiveObjects.getChildren().length != 0) {
                    // if list is not empty
                    for (let object of interactiveObjects.getChildren()) {
                        // go through list
                        let positionObject: ƒ.Vector3 = object.mtxLocal.translation;

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
                        setSpriteFlower(flower);
                    }
                } else {
                    document.querySelector("#speechbox").setAttribute("style", "visibility:visible");
                    document.getElementById("speechbox").innerHTML = "Oh, there's nothing to pick here...";
                    speechboxOpen = true;
                }
            }
        }
    }
}
