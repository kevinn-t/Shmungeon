class LevelTwo extends Phaser.Scene {
    constructor() {
        super("levelTwo");
        this.my = {sprite: {}};
        this.bulletSpeed = 10;
        this.bulletCooldown = 15;
        this.bulletCooldownCounter = 0;
    }

    preload(){
        // console.log("preload");
        // load map
        this.load.setPath("./assets/Shmaps");
        this.load.image("tiny_dung_tiles", "tilemap_packed.png");
        this.load.tilemapTiledJSON("lvl2", "FinalLevel.json");
        // load sprites
        this.load.setPath("./assets");
        this.load.image("shmotagonist", "player.png");
        this.load.image("bat", "flyingCritter.png");
        this.load.image("rat", "smallCritter.png");
        this.load.image("alchemist", "tallCritter.png");
        this.load.image("acid", "enemyProj.png");
        this.load.image("axe", "playerProj.png");
    }
// 480 2100
    create(){
        // console.log("create");
        // add a tile map
        this.map = this.add.tilemap("lvl2", 16, 16, 20, 50);
        // add a tileset to the map
        this.tileset = this.map.addTilesetImage("Kenneys-tiny-dung-set", "tiny_dung_tiles");
        // create a tile map layer
        this.groundLayer = this.map.createLayer("Ground", this.tileset, 0, 0);
        this.wallLayer = this.map.createLayer("Walls", this.tileset, 0, 0);
        this.decoLayer = this.map.createLayer("Deco", this.tileset, 0, 0);
        // this.spikeLayer = this.map.createLayer("Spikes", this.tileset, 0, 0);
        this.groundLayer.setScale(3.0);
        this.wallLayer.setScale(3.0);
        this.decoLayer.setScale(3.0);
        // this.spikeLayer.setScale(3.0);
        // add the player avatar
        let my = this.my;
        my.sprite.avatar = this.add.sprite(480, 2100, "shmotagonist");
        my.sprite.avatar.setScale(3);
        // add player camera
        this.cameras.main.setSize(960, 600);
        this.cameras.main.startFollow(my.sprite.avatar, true, 1, 1, 0, 250);
        this.cameras.main.setBounds(0,0,960,2400);
        // player controls
        this.moveSpeed = Phaser.Math.GetSpeed(800, 3);
        this.strafeLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.strafeRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.start = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.restart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.throw = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // axe projectiles
        my.sprite.bulletGroup = this.add.group({
            active: true,
            defaultKey: "axe",
            maxSize: 10,
            runChildUpdate: true
            });
        my.sprite.bulletGroup.createMultiple({
            classType: Bullet,
            active: false,
            key: my.sprite.bulletGroup.defaultKey,
            repeat: my.sprite.bulletGroup.maxSize-1
        });
        my.sprite.bulletGroup.propertyValueSet("speed", this.bulletSpeed);
    }

    update(time, delta){
        // console.log("update");
        let my = this.my;
        // constantly rotate thrown axes
        my.sprite.bulletGroup.children.iterate(child => {
            child.setScale(2.0);
            child.angle-=10;
            // delete or hide axes when hitting wall
            if (child.y <= 144){
                child.makeInactive();
            }
        });

        if (my.sprite.avatar.y > 250) {
            my.sprite.avatar.y -= 5;
            this.bulletCooldownCounter--;
            // strafe left on A
            if (this.strafeLeft.isDown && my.sprite.avatar.x>80 &&
            !this.strafeRight.isDown) {
                my.sprite.avatar.x -= this.moveSpeed * delta;
                my.sprite.avatar.flipX = true;
            }
            // strafe right on D
            if (this.strafeRight.isDown && my.sprite.avatar.x < 885 &&
            !this.strafeLeft.isDown) {
                my.sprite.avatar.x += this.moveSpeed * delta;
                my.sprite.avatar.flipX = false;
            }
            // restart on R
            if (this.restart.isDown) {
                this.scene.start("levelOne");
            }
            // throw an axe on SPACE
            if (this.throw.isDown) {
                if (this.bulletCooldownCounter < 0) {
                    // Get the first inactive bullet, and make it active
                    let bullet = my.sprite.bulletGroup.getFirstDead();
                    // bullet will be null if there are no inactive (available) bullets
                    if (bullet != null) {
                        this.bulletCooldownCounter = this.bulletCooldown;
                        bullet.makeActive();
                        bullet.x = my.sprite.avatar.x;
                        bullet.y = my.sprite.avatar.y - (my.sprite.avatar.displayHeight/2);
                    }
                }
            }

        // ease into the exit when at the end
        } else {
            this.firstTween = this.add.tween({
                targets: my.sprite.avatar,
                x: 480,
                y: 150+48,
                duration: 3000,
                ease: 'linear',
                onComplete: ()=>{
                    console.log("game complete");
                    my.sprite.avatar.y -= 5;
                    // move to next lvl
                    // this.scene.start("end");
                }
            });
        }
    }

}