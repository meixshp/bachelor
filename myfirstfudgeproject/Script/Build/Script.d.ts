declare namespace Script {
    import ƒ = FudgeCore;
    class CubeComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class GameObject extends ƒ.Node {
        static readonly meshQuad: ƒ.MeshQuad;
        rect: ƒ.Rectangle;
        constructor(_name: string, _size: ƒ.Vector2, _position: ƒ.Vector2);
    }
}
