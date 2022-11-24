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
    let root: ƒ.Node;
}
declare namespace Script {
    import ƒAid = FudgeAid;
    let animations: ƒAid.SpriteSheetAnimations;
    function loadSprites(): Promise<void>;
    function setSpriteGrass(_node: ƒ.Node): void;
    function setSpriteWall(_node: ƒ.Node): void;
    function setSpriteTombstone(_node: ƒ.Node): void;
    function setSpriteFlower(_node: ƒ.Node): void;
}
declare namespace Script {
    function getPosition(): Promise<string | Response>;
}
declare namespace Script {
    function connecting(_url: string): boolean;
    function connectToWS(_url: string): void;
    function doSend(_message: string): void;
    function getState(): number;
}
