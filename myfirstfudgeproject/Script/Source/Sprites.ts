namespace Script {
    import ƒAid = FudgeAid;

    export let animations: ƒAid.SpriteSheetAnimations = {};
    let spriteTombstone: ƒAid.NodeSprite;
    let spriteFlower: ƒAid.NodeSprite;
    let spriteLight: ƒAid.NodeSprite;
    let material: ƒ.Material;

    export async function loadSprites(): Promise<void> {
        let imgSpriteSheetGrass: ƒ.TextureImage = new ƒ.TextureImage();
        await imgSpriteSheetGrass.load("Images/GRASS+.png");
        let spriteSheet: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheetGrass);

        let imgSpriteSheetWall: ƒ.TextureImage = new ƒ.TextureImage();
        await imgSpriteSheetWall.load("Images/wall3.png");
        let spriteSheetWall: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheetWall);

        // let imgSpriteSheetLight: ƒ.TextureImage = new ƒ.TextureImage();
        // await imgSpriteSheetLight.load("Images/light_radius.png");
        // let spriteSheetLight: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheetLight);

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

        // Light ------------------------
        // const light: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("light", _spritesheetLight);
        // light.generateByGrid(ƒ.Rectangle.GET(0, 0, 3508, 2480), 1, 2480, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(3508));

        animations["grass"] = grass;
        animations["wall"] = wall;
        animations["tombstone"] = stone;
        animations["flower"] = flower;
        // animations["light"] = light;
    }

    export async function setGrassMaterial(_node: ƒ.Node): Promise<void> {
        let textureImage: ƒ.TextureImage = new ƒ.TextureImage();
        await textureImage.load("../Images/grass.png");
        let coatSprite: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, textureImage);
        material = new ƒ.Material("grass", ƒ.ShaderLitTextured, coatSprite);
        //material = new ƒ.Material("grass", ƒ.ShaderLit, new ƒ.CoatColored(new ƒ.Color(1, 0, 1, 1)));
        let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);
        _node.addComponent(cmpMaterial);
        cmpMaterial.mtxPivot.scale(new ƒ.Vector2(12, 9))
    }

    export async function setWallMaterial(_node: ƒ.Node): Promise<void> {
        let textureImage: ƒ.TextureImage = new ƒ.TextureImage();
        await textureImage.load("../Images/wall3.png");
        let coatSprite: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, textureImage);
        material = new ƒ.Material("wall", ƒ.ShaderLitTextured, coatSprite);
        //material = new ƒ.Material("grass", ƒ.ShaderLit, new ƒ.CoatColored(new ƒ.Color(1, 0, 1, 1)));
        let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);
        _node.addComponent(cmpMaterial);
        cmpMaterial.mtxPivot.scale(new ƒ.Vector2(12, 1))
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

    export async function addLightRadius(_node: ƒ.Node): Promise<void> {
        let textureImage: ƒ.TextureImage = new ƒ.TextureImage();
        await textureImage.load("../Images/lightradius.png");
        let coatSprite: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, textureImage);
        material = new ƒ.Material("Light", ƒ.ShaderLitTextured, coatSprite);
        //material = new ƒ.Material("grass", ƒ.ShaderLit, new ƒ.CoatColored(new ƒ.Color(1, 0, 1, 1)));
        let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);
        _node.addComponent(cmpMaterial);
        cmpMaterial.mtxPivot.scale(new ƒ.Vector2(1, 1))

        // spriteLight = new ƒAid.NodeSprite("SpriteLight");
        // spriteLight.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        // spriteLight.setAnimation(<ƒAid.SpriteSheetAnimation>animations["light"]);
        // spriteLight.setFrameDirection(1);
        // spriteLight.mtxLocal.translateZ(0.0001);
        // spriteLight.framerate = 1;

        // _node.addChild(spriteLight);
    }
}
