namespace Script {
    import ƒ = FudgeCore;
    
    ƒ.Debug.info("Main Program Template running!");

    let viewport: ƒ.Viewport;
    let player: ƒ.Node;
    let joystickURL = "ws://192.168.2.209:1338/";

    document.addEventListener("interactiveViewportStarted", <EventListener>start);
    

    function start(_event: CustomEvent): void {
        viewport = _event.detail;
        connectToWS(joystickURL);

        console.log(viewport.camera);
        viewport.camera.mtxPivot.translateZ(30);
        viewport.camera.mtxPivot.rotateY(180);
        //viewport.camera.mtxPivot.translateX(-2);
        //viewport.camera.mtxPivot.translateY(2);

        let graph: ƒ.Node = viewport.getBranch();
        player = graph.getChildrenByName("Player")[0];

        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start();
        // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }

    async function update(_event: Event) {
        doSend("getState");
        let state = getState();
        //let positionPlayer = player.mtxLocal.translation;
        let deltaTime: number = ƒ.Loop.timeFrameReal / 500;
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
        
    if(state == 4 || state == 5 || state == 6)
        player.mtxLocal.translateY(1 * deltaTime);
    if(state == 8 || state == 10 || state == 9)
        player.mtxLocal.translateY(-1 * deltaTime);
    if(state == 1 || state == 5 || state == 9)
        player.mtxLocal.translateX(-1 * deltaTime);
    if(state == 2 || state == 10 || state == 6)
        player.mtxLocal.translateX(1 * deltaTime);


        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }

}
