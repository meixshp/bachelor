namespace Frieda {
    import ƒAid = FudgeAid;

    export let animations: ƒAid.SpriteSheetAnimations = {};
    let spriteTombstone: ƒAid.NodeSprite;
    let spriteFlower: ƒAid.NodeSprite;
    let spriteBush: ƒAid.NodeSprite;
    let spriteTree: ƒAid.NodeSprite;
    let spriteDoor: ƒAid.NodeSprite;
    let material: ƒ.Material;

    export async function loadSprites(): Promise<void> {
        let imgSpriteSheetGrass: ƒ.TextureImage = new ƒ.TextureImage();
        await imgSpriteSheetGrass.load("Images/GRASS+.png");
        let spriteSheet: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheetGrass);

        let imgSpriteSheetWall: ƒ.TextureImage = new ƒ.TextureImage();
        await imgSpriteSheetWall.load("Images/wall3.png");
        let spriteSheetWall: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheetWall);

        let imgSpriteSheetTilesheet: ƒ.TextureImage = new ƒ.TextureImage();
        await imgSpriteSheetTilesheet.load("Images/tilesheet.png");
        let spriteSheetTilesheet: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheetTilesheet);

        let imgSpriteSheetOverworld: ƒ.TextureImage = new ƒ.TextureImage();
        await imgSpriteSheetOverworld.load("Images/Overworld.png");
        let spriteSheetOverworld: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheetOverworld);

        generateSprites(spriteSheet, spriteSheetWall, spriteSheetTilesheet, spriteSheetOverworld);
    }

    function generateSprites(
        _spritesheet: ƒ.CoatTextured,
        _spritesheetWall: ƒ.CoatTextured,
        _spritesheetTilesheet: ƒ.CoatTextured,
        _spritesheetOverworld: ƒ.CoatTextured
    ): void {
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

        // Bush ------------------------
        const bush: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("bush", _spritesheet);
        bush.generateByGrid(ƒ.Rectangle.GET(160, 176, 16, 16), 1, 16, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(16));

        // Tree ------------------------
        const tree: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("tree", _spritesheetTilesheet);
        tree.generateByGrid(ƒ.Rectangle.GET(580, 488, 182, 245), 1, 200, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(200));

        // // Door ------------------------
        const door: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("door", _spritesheetOverworld);
        door.generateByGrid(ƒ.Rectangle.GET(498, 79, 27, 33), 1, 33, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(33));

        animations["grass"] = grass;
        animations["wall"] = wall;
        animations["tombstone"] = stone;
        animations["flower"] = flower;
        animations["bush"] = bush;
        animations["tree"] = tree;
        animations["door"] = door;
    }

    export async function setGrassMaterial(_node: ƒ.Node, _scale: ƒ.Vector2): Promise<void> {
        let textureImage: ƒ.TextureImage = new ƒ.TextureImage();
        await textureImage.load("../Images/grass.png");
        let coatSprite: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, textureImage);
        material = new ƒ.Material("grass", ƒ.ShaderLitTextured, coatSprite);
        //material = new ƒ.Material("grass", ƒ.ShaderLit, new ƒ.CoatColored(new ƒ.Color(1, 0, 1, 1)));
        let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);
        _node.addComponent(cmpMaterial);
        cmpMaterial.mtxPivot.scale(_scale);
    }

    export async function setWallMaterial(_node: ƒ.Node): Promise<void> {
        let textureImage: ƒ.TextureImage = new ƒ.TextureImage();
        await textureImage.load("../Images/wall3.png");
        let coatSprite: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, textureImage);
        material = new ƒ.Material("wall", ƒ.ShaderLitTextured, coatSprite);
        //material = new ƒ.Material("grass", ƒ.ShaderLit, new ƒ.CoatColored(new ƒ.Color(1, 0, 1, 1)));
        let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);
        _node.addComponent(cmpMaterial);
        cmpMaterial.mtxPivot.scale(new ƒ.Vector2(12, 1));
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

    export function setSpriteBush(_node: ƒ.Node): void {
        spriteBush = new ƒAid.NodeSprite("SpriteBush");
        spriteBush.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        spriteBush.setAnimation(<ƒAid.SpriteSheetAnimation>animations["bush"]);
        spriteBush.setFrameDirection(1);
        spriteBush.mtxLocal.translateZ(0.0001);
        spriteBush.framerate = 1;

        _node.addChild(spriteBush);
        //_node.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
    }

    export function setSpriteTree(_node: ƒ.Node): void {
        spriteTree = new ƒAid.NodeSprite("SpriteTree");
        spriteTree.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        spriteTree.setAnimation(<ƒAid.SpriteSheetAnimation>animations["tree"]);
        spriteTree.setFrameDirection(1);
        spriteTree.mtxLocal.translateZ(0.0001);
        spriteTree.framerate = 1;

        _node.addChild(spriteTree);
        //_node.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
    }

    export function setSpriteDoor(_node: ƒ.Node): void {
        spriteDoor = new ƒAid.NodeSprite("SpriteDoor");
        spriteDoor.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        spriteDoor.setAnimation(<ƒAid.SpriteSheetAnimation>animations["door"]);
        spriteDoor.setFrameDirection(1);
        spriteDoor.mtxLocal.translateZ(0.0001);
        spriteDoor.framerate = 1;

        _node.addChild(spriteDoor);
        //_node.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
    }
}
