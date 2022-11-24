namespace Script {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    ƒ.Debug.info("Main Program Template running!");

    let viewport: ƒ.Viewport;
    let player: ƒ.Node;
    let avatar: ƒAid.NodeSprite;
    let joystickURL = "ws://192.168.2.209:1338/";
    let connectedToWS: boolean;
    let grid: ƒ.Node;
    let graph: ƒ.Node;
    let positionPlayer: ƒ.Vector3;
    let tempPosition: ƒ.Vector3;
    let sprite: ƒAid.NodeSprite;
    let flower: ƒ.Node;
    let cameraNode: ƒ.Node = new ƒ.Node("cameraNode");
    let cmpCamera = new ƒ.ComponentCamera();
    let interactiveObjects: ƒ.Node;

    export let root: ƒ.Node = new ƒ.Node("Root");

    document.addEventListener("interactiveViewportStarted", <EventListener>(<unknown>start));

    async function start(_event: CustomEvent): Promise<void> {
        //viewport = _event.detail;

        connectedToWS = false; //connecting(joystickURL);
        //connectToWS(joystickURL);

        //console.log(viewport.camera);
        //viewport.camera.mtxPivot.translateZ(100);
        //viewport.camera.mtxPivot.rotateY(180);
        //viewport.camera.mtxPivot.translateX(-2);
        //viewport.camera.mtxPivot.translateY(2);

        //graph = viewport.getBranch();
        graph = <ƒ.Graph>ƒ.Project.resources["Graph|2022-08-09T09:54:54.928Z|39207"];
        player = graph.getChildrenByName("Player")[0];
        //sprite = await createSprite();
        //player.addChild(sprite);
        //player.getComponent(ƒ.ComponentMaterial).activate(false);

        cmpCamera.mtxPivot.translation = new ƒ.Vector3(0, 0, 30);
        cmpCamera.mtxPivot.rotation = new ƒ.Vector3(0, 180, 0);
        cameraNode.addComponent(cmpCamera);
        cameraNode.addComponent(new ƒ.ComponentTransform());
        graph.addChild(cameraNode);

        let canvas: HTMLCanvasElement = document.querySelector("canvas");
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", graph, cmpCamera, canvas);

        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start();
    }

    async function update(_event: Event) {
        placeCameraOnChar();
        document.addEventListener("keydown", interactWithObject);

        let deltaTime: number = ƒ.Loop.timeFrameReal / 200;
        tempPosition = player.mtxLocal.translation;

        if (connectedToWS) {
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
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        //ƒ.AudioManager.default.update();
    }

    async function createSprite(): Promise<ƒAid.NodeSprite> {
        let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
        await imgSpriteSheet.load("Images/avatar_sprites.png");
        let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);

        let animation: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("Player", coat);
        animation.generateByGrid(
            ƒ.Rectangle.GET(0, 128, 64, 128),
            8,
            82,
            ƒ.ORIGIN2D.BOTTOMCENTER,
            ƒ.Vector2.X(64)
        );

        let sprite: ƒAid.NodeSprite = new ƒAid.NodeSprite("Sprite");
        sprite.setAnimation(animation);
        sprite.setFrameDirection(1);
        sprite.framerate = 15;

        let cmpTransfrom: ƒ.ComponentTransform = new ƒ.ComponentTransform();
        sprite.addComponent(cmpTransfrom);
        sprite.getComponent(ƒ.ComponentMaterial).clrPrimary.a = 0.5;

        return sprite;
    }

    function createBlock(): ƒ.Node {
        let newNode: ƒ.Node = new ƒ.Node("Flower");

        let mesh: ƒ.MeshSphere = new ƒ.MeshSphere();
        let material: ƒ.Material = new ƒ.Material("MaterialFlower", ƒ.ShaderLit, new ƒ.CoatColored());

        let cmpTransfrom: ƒ.ComponentTransform = new ƒ.ComponentTransform();
        let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(mesh);
        let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);

        cmpMaterial.clrPrimary = ƒ.Color.CSS("red");

        newNode.addComponent(cmpMaterial);
        newNode.addComponent(cmpMesh);
        newNode.addComponent(cmpTransfrom);

        newNode.mtxLocal.translate(
            new ƒ.Vector3(player.mtxLocal.translation.x, player.mtxLocal.translation.y, 1)
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
        let obstacles: ƒ.Node = graph.getChildrenByName("Obstacles")[0];

        for (let obstacle of obstacles.getChildren()) {
            let positionObstacle: ƒ.Vector3 = obstacle.mtxLocal.translation;

            if (Math.abs(node.mtxLocal.translation.x - positionObstacle.x) <= 1.2) {
                if (Math.abs(node.mtxLocal.translation.y - positionObstacle.y) <= 1.5) {
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
            if (interactiveObjects.getChildren().length != 0) {            // if list is not empty
                for (let object of interactiveObjects.getChildren()) {      // go through list
                    let positionObject: ƒ.Vector3 = object.mtxLocal.translation;

                    if (placableObject) {                                       // if there is a placableObject object available
                        if (Math.abs(player.mtxLocal.translation.x - positionObject.x) <= 1.0) {        // check positioning
                            if (Math.abs(player.mtxLocal.translation.y - positionObject.y) <= 1.50) {
                                interactiveObjects.removeChild(object);         // remove it
                                placableObject = false;                         //no placable object nearby anymore
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
}
