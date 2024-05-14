class Enemy extends Phaser.GameObjects.Sprite
{
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
                this.die();
            }
        }
    }

    spawn() {
        this.visible = true;
        this.active = true;
    }

    kill() {
        this.visible = false;
        this.active = false;
    }
}

// class Enemy extends Phaser.Physics.Matter.Sprite
// {
//     constructor (world, x, y, texture, bodyOptions)
//     {
//         super(world, x, y, texture, null, { plugin: bodyOptions });

//         this.play('eyes');

//         this.setFrictionAir(0);

//         this.scene.add.existing(this);

//         const angle = Phaser.Math.Between(0, 360);
//         const speed = Phaser.Math.FloatBetween(1, 3);

//         this.setAngle(angle);

//         this.setAngularVelocity(Phaser.Math.FloatBetween(-0.05, 0.05));

//         this.setVelocityX(speed * Math.cos(angle));
//         this.setVelocityY(speed * Math.sin(angle));
//     }

//     preUpdate (time, delta)
//     {
//         super.preUpdate(time, delta);
//     }
// }