class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {        
        super(scene, x, y, texture, frame);
        this.visible = false;
        this.active = false;
        return this;
    }

    update() {
        if (this.active) {
            this.y -= this.speed;
            if (this.y < -(this.displayHeight/2)) {
                this.kill();
            }
        }
    }

    throw() {
        this.visible = true;
        this.active = true;
    }

    kill() {
        this.visible = false;
        this.active = false;
    }
}

// class Bullet extends Phaser.Physics.Matter.Sprite
// {
//     lifespan;

//     constructor (world, x, y, texture, bodyOptions)
//     {
//         super(world, x, y, texture, null, { plugin: bodyOptions });

//         this.setFrictionAir(0);
//         this.setFixedRotation();
//         this.setActive(false);

//         this.scene.add.existing(this);

//         this.world.remove(this.body, true);
//     }

//     fire (x, y, speed)
//     {
//         this.world.add(this.body);

//         this.setPosition(x, y);
//         this.setActive(true);
//         this.setVisible(true);

//         this.setVelocityY(speed);

//         this.lifespan = 1000;
//     }

//     preUpdate (time, delta)
//     {
//         super.preUpdate(time, delta);

//         this.lifespan -= delta;

//         if (this.lifespan <= 0)
//         {
//             this.setActive(false);
//             this.setVisible(false);
//             this.world.remove(this.body, true);
//         }
//     }
// }