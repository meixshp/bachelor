namespace Script {
    import ƒAid = FudgeAid;

    export let animations: ƒAid.SpriteSheetAnimations = {};
    let spriteGrass: ƒAid.NodeSprite;
    let spriteWall: ƒAid.NodeSprite;
    let spriteTombstone: ƒAid.NodeSprite;
    let spriteFlower: ƒAid.NodeSprite;

    export async function loadSprites(): Promise<void> {
        let imgSpriteSheetGrass: ƒ.TextureImage = new ƒ.TextureImage();
        await imgSpriteSheetGrass.load("Images/GRASS+.png");
        let spriteSheet: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheetGrass);

        let imgSpriteSheetWall: ƒ.TextureImage = new ƒ.TextureImage();
        await imgSpriteSheetWall.load("Images/wall3.png");
        let spriteSheetWall: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheetWall);

        generateSprites(spriteSheet, spriteSheetWall);
    }

    function generateSprites(_spritesheet: ƒ.CoatTextured, _spritesheetWall: ƒ.CoatTextured): void {

        // Grass ------------------------
        const grass: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("grass", _spritesheet);
        grass.generateByGrid(ƒ.Rectangle.GET(128, 48, 16, 16), 1, 16, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(16));

        // Tombstones ------------------------
        const stone: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("stone", _spritesheet);
        stone.generateByGrid(ƒ.Rectangle.GET(160, 208, 16, 16), 1, 16, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(16));

        // Flower ------------------------
        const flower: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("flower", _spritesheet);
        flower.generateByGrid(ƒ.Rectangle.GET(32, 192, 16, 16), 1, 16, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(16));

        // Flower ------------------------
        const wall: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("wall", _spritesheetWall);
        wall.generateByGrid(ƒ.Rectangle.GET(0, 0, 250, 250), 1, 250, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(250));

        animations["grass"] = grass;
        animations["wall"] = wall;
        animations["tombstone"] = stone;
        animations["flower"] = flower;
    }

    export function setSpriteGrass(_node: ƒ.Node): void {
        spriteGrass = new ƒAid.NodeSprite("SpriteGrass");
        spriteGrass.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        spriteGrass.setAnimation(<ƒAid.SpriteSheetAnimation>animations["grass"]);
        spriteGrass.setFrameDirection(1);
        spriteGrass.mtxLocal.translateZ(0.0001);
        spriteGrass.framerate = 1;

        _node.addChild(spriteGrass);
        //_node.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
    }

    export function setSpriteWall(_node: ƒ.Node): void {
        spriteWall = new ƒAid.NodeSprite("SpriteWall");
        spriteWall.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        spriteWall.setAnimation(<ƒAid.SpriteSheetAnimation>animations["wall"]);
        spriteWall.setFrameDirection(1);
        spriteWall.mtxLocal.translateZ(0.0001);
        spriteWall.framerate = 1;

        _node.addChild(spriteWall);
        //_node.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
    }

    export function setSpriteTombstone(_node: ƒ.Node): void {
        spriteTombstone = new ƒAid.NodeSprite("SpriteWall");
        spriteTombstone.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        spriteTombstone.setAnimation(<ƒAid.SpriteSheetAnimation>animations["tombstone"]);
        spriteTombstone.setFrameDirection(1);
        spriteTombstone.mtxLocal.translateZ(0.0001);
        spriteTombstone.framerate = 1;

        _node.addChild(spriteTombstone);
        //_node.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
    }

    export function setSpriteFlower(_node: ƒ.Node): void {
        spriteFlower = new ƒAid.NodeSprite("SpriteFlower");
        spriteFlower.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        spriteFlower.setAnimation(<ƒAid.SpriteSheetAnimation>animations["flower"]);
        spriteFlower.setFrameDirection(1);
        spriteFlower.mtxLocal.translateZ(0.0001);
        spriteFlower.framerate = 1;

        _node.addChild(spriteFlower);
        //_node.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
    }
}
