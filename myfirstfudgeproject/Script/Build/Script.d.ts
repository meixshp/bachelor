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
}
declare namespace Script {
    function getPosition(): Promise<string | Response>;
}
declare namespace Script {
    function connectToWS(_url: string): void;
    function doSend(_message: string): void;
    function getState(): number;
}
