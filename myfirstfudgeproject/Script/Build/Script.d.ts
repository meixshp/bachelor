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
    function setGrassMaterial(_node: ƒ.Node): Promise<void>;
    function setWallMaterial(_node: ƒ.Node): Promise<void>;
    function setSpriteTombstone(_node: ƒ.Node): void;
    function setSpriteFlower(_node: ƒ.Node): void;
    function addLightRadius(_node: ƒ.Node): Promise<void>;
}
declare namespace Script {
    function getPosition(): Promise<any>;
}
declare namespace Script {
    class WebSocketClient {
        state: number;
        websocket: WebSocket;
        url: string;
        connected: boolean;
        constructor(_url: string);
        connecting(): boolean;
        connectToWS(_url: string): void;
        onOpen(event: any): void;
        onClose(event: any): void;
        onMessage(event: any): void;
        onError(event: any): void;
        doSend(_message: string): void;
        getState(): number;
    }
}
