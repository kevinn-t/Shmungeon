class LevelOne extends Phaser.Scene {
    constructor() {
        super("levelOne");
        this.my = {sprite: {}};
        this.run = false;
        this.moveSpeed = Phaser.Math.GetSpeed(800, 3); // 800px / 3 seconds
        this.bulletSpeed = 10;
        this.bulletCooldown = 15;
        this.bulletCooldownCounter = 0;
    }

    preload(){
        // load map
        this.load.setPath("./assets/Shmaps");
        this.load.image("tiny_dung_tiles", "tilemap_packed.png");
        this.load.tilemapTiledJSON("lvl1", "FirstLevel.json");

        // load sprites
        this.load.setPath("./assets");
        this.load.image("shmotagonist", "player.png");
        this.load.image("bat", "flyingCritter.png");
        this.load.image("rat", "smallCritter.png");
        this.load.image("alchemist", "tallCritter.png");
        this.load.image("acid", "enemyProj.png");
        this.load.image("axe", "playerProj.png");
    }

    create(){
        // add a tile map
        this.map = this.add.tilemap("lvl1", 16, 16, 20, 50);
        // const wrapBounds = {
        //     wrap: {
        //         min: { x: 0, y: 0 },
        //         max: { x: 960, y: 600 }
        //     }
        // };

        // add a tileset to the map
        this.tileset = this.map.addTilesetImage("Kennys-tiny-dung-set", "tiny_dung_tiles");
        
        // create a tile map layer
        this.groundLayer = this.map.createLayer("Ground", this.tileset, 0, 0);
        this.wallLayer = this.map.createLayer("Walls", this.tileset, 0, 0);
        this.decoLayer = this.map.createLayer("Deco", this.tileset, 0, 0);
        this.groundLayer.setScale(3.0);
        this.wallLayer.setScale(3.0);
        this.decoLayer.setScale(3.0);
        
        // add the player avatar
        let my = this.my;
        my.sprite.avatar = this.add.sprite(480, 2350, "shmotagonist");
        my.sprite.avatar.setScale(3);
        
        // add player camera
        this.cameras.main.setSize(960, 600);
        this.cameras.main.startFollow(my.sprite.avatar, true, 1, 1, 0, 250);
        this.cameras.main.setBounds(0,0,960,2400);
        
        // player controls
        this.strafeLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.strafeRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.start = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.restart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.throw = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.debugSummon = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.COMMA);
        
        // collisions
        // this.axeCollisionCategory = this.matter.world.nextCategory();
        // this.alchCollisionCategory = this.matter.world.nextCategory();

        // axe projectile group
        // this.axes = [];
        // for (let i = 0; i < 64; i++){
        //     const axe = new Bullet(this.matter.world, 0, 0, 'axe', wrapBounds);
        //     axe.setCollisionCategory(this.axeCollisionCategory);
        //     axe.setCollidesWith([ this.alchCollisionCategory]);
        //     axe.setOnCollide(this.bulletVsEnemy);
        //     this.axes.push(axe);
        // }

        my.sprite.axeGroup = this.add.group({
            active: true,
            defaultKey: "axe",
            maxSize: 10,
            runChildUpdate: true
        });
        my.sprite.axeGroup.createMultiple({
            classType: Bullet,
            active: false,
            key: my.sprite.axeGroup.defaultKey,
            repeat: my.sprite.axeGroup.maxSize-1
        });
        my.sprite.axeGroup.propertyValueSet("speed", this.bulletSpeed);

        // alchemists group
        // this.alchemists = [];
        // for (let i = 0; i < 6; i++){
        //     const alchemist = new Enemy(this.matter.world, Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600), 'enemy', wrapBounds);
        //     alchemist.setCollisionCategory(this.alchCollisionCategory);
        //     alchemist.setCollidesWith([this.axeCollisionCategory ]);
        //     this.alchemists.push(alchemist);
        // }

        my.sprite.alchGroup = this.add.group({
            active: true,
            defaultKey: "alchemist",
            maxSize: 12,
            runChildUpdate: true
        });
        my.sprite.alchGroup.createMultiple({
            classType: Enemy,
            active: false,
            key: my.sprite.alchGroup.defaultKey,
            repeat: my.sprite.alchGroup.maxSize-1
        });
        my.sprite.alchGroup.propertyValueSet("speed", this.moveSpeed);

        // collisions
        // this.physics.add.overlap(my.sprite.axeGroup, my.sprite.alchGroup, this.killEnemy);
        
        
    }

    killEnemy = function (proj, enemy){ // Bullet class proj, Enemy class enemy
        proj.kill();
        enemy.kill();
        console.log('hit' + (Math.ceil(Math.random()*5)));
    }

    // bulletVsEnemy (collisionData){
    //     const bullet = collisionData.bodyA.gameObject;
    //     const enemy = collisionData.bodyB.gameObject;
    //     bullet.setActive(false);
    //     bullet.setVisible(false);
    //     bullet.world.remove(bullet.body, true);
    //     enemy.setActive(false);
    //     enemy.setVisible(false);
    //     enemy.world.remove(enemy.body, true);
    // }

    update(time, delta){
        let my = this.my;
        
        // update thrown axes
        my.sprite.axeGroup.children.iterate(axe => {
            axe.setScale(2.0);
            axe.angle-=10;

            my.sprite.alchGroup.children.iterate(alch => {
                this.physics.add.overlap(axe, alch, this.killEnemy(axe, alch));
                alch.setScale(3.0);
            });

            // delete or hide axes when hitting wall
            if (axe.y <= 144){
                axe.kill();
            }
        });
        
        // start game on ENTER
        if (this.start.isDown) {
            this.run = true;
        }
        
        if (this.run) {
            // constantly move sprites
            if (my.sprite.avatar.y > 250) {
                my.sprite.avatar.y -= this.moveSpeed;
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
                    this.run = true;
                    this.scene.start("levelOne");
                }
                
                // throw an axe on SPACE
                if (this.throw.isDown) {
                    if (this.bulletCooldownCounter < 0) {
                        // Get the first inactive bullet, and make it active
                        let axe = my.sprite.axeGroup.getFirstDead();
                        // bullet will be null if there are no inactive (available) bullets
                        if (axe != null) {
                            this.bulletCooldownCounter = this.bulletCooldown;
                            axe.throw();
                            axe.x = my.sprite.avatar.x;
                            axe.y = my.sprite.avatar.y - (my.sprite.avatar.displayHeight/2);
                        }
                    }
                }
                
                // debug summon alchemists
                if (this.debugSummon.isDown) {
                    // Get the first inactive bullet, and make it active
                    let alch = my.sprite.alchGroup.getFirstDead();
                    // bullet will be null if there are no inactive (available) bullets
                    if (alch != null) {
                        alch.spawn();
                        alch.x = my.sprite.avatar.x;
                        alch.y = my.sprite.avatar.y - 240;
                    }
                }

            // ease into the exit when at the end
            } else {
                this.run = false;
                this.firstTween = this.add.tween({
                    targets: my.sprite.avatar,
                    x: 480,
                    y: 150,
                    duration: 3000,
                    ease: 'linear',
                    onComplete: ()=>{
                        console.log("tween done");
                        my.sprite.avatar.y -= this.travelSpeed;
                        // move to next lvl
                        this.scene.start("levelTwo");
                    }
                });
            }
        }
    }
}

/** Collision detection
 * theres a built in system: Arcade Physics
 * 
 * initialize
 * (make groups)
 * make sprites
 * add sprites to groups
 * state which groups can collide w/ eachother
 * add collision handler
 * 
 * staticGroup = this.physics.add.staticGroup()
 * this would be used for walls, ground
 * group = this.physics.add.group()
 * for moving objects
 * 
 * 
 * 
 */
