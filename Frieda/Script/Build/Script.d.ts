declare namespace Frieda {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Frieda {
    import ƒ = FudgeCore;
    let root: ƒ.Node;
}
declare namespace Frieda {
    import ƒAid = FudgeAid;
    let animations: ƒAid.SpriteSheetAnimations;
    function loadSprites(): Promise<void>;
    function setGrassMaterial(_node: ƒ.Node, _scale: ƒ.Vector2): Promise<void>;
    function setWallMaterial(_node: ƒ.Node): Promise<void>;
    function setSpriteTombstone(_node: ƒ.Node): void;
    function setSpriteFlower(_node: ƒ.Node): void;
    function setSpriteBush(_node: ƒ.Node): void;
    function setSpriteTree(_node: ƒ.Node): void;
    function setSpriteDoor(_node: ƒ.Node): void;
}
declare namespace Frieda {
    let connectedtoWS: boolean;
    function connecting(_url: string): boolean;
    function connectToWS(_url: string): void;
    function doSend(_message: string): void;
    function getState(): number;
}
