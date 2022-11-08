namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let player: ƒ.Node;
  let walls: ƒ.Node;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    console.log(viewport.camera);
    viewport.camera.mtxPivot.translateZ(30);
    viewport.camera.mtxPivot.rotateY(180);
    //viewport.camera.mtxPivot.translateX(-2);
    //viewport.camera.mtxPivot.translateY(2);

    let graph: ƒ.Node = viewport.getBranch();
    player = graph.getChildrenByName("Player")[0];
    walls = graph.getChildrenByName("Walls")[0];

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
    // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {

    let positionPlayer = player.mtxLocal.translation;
    let deltaTime: number = ƒ.Loop.timeFrameReal / 500;

    if(checkCollision(positionPlayer)) {
        if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W]))
            player.mtxLocal.translateY(1 * deltaTime);
        if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S]))
            player.mtxLocal.translateY(-1 * deltaTime);
        if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A]))
            player.mtxLocal.translateX(-1 * deltaTime);
        if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]))
            player.mtxLocal.translateX(1 * deltaTime);
    }


    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function checkCollision(_pos: ƒ.Vector3): boolean {
    let check: ƒ.Node = walls.getChild(_pos.y+1)?.getChild(_pos.x+1)?.getChild(0);
    return (!check || check.name == "Wall");
  }

  export class GameObject extends ƒ.Node {
    public static readonly meshQuad: ƒ.MeshQuad = new ƒ.MeshQuad();
    public rect: ƒ.Rectangle;

        public constructor(_name: string, _size: ƒ.Vector2, _position: ƒ.Vector2) {
        super(_name);

        this.rect = new ƒ.Rectangle(_position.x, _position.y, _size.x, _size.y, ƒ.ORIGIN2D.CENTER);

        this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position.toVector3(0))));

        let cmpQuad: ƒ.ComponentMesh = new ƒ.ComponentMesh(GameObject.meshQuad);
        this.addComponent(cmpQuad);
        cmpQuad.mtxPivot.scale(_size.toVector3(0));
        }
    }

}