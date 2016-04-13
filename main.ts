/// <reference path="phaser/phaser.d.ts"/>
window.onload = () => {new PoliticianKiller();};
class PoliticianKiller extends Phaser.Game
{
    PLAYER_MAX_SPEED = 300;
    PLAYER_DRAG = 600;
    PLAYER_LIVES = 5;
    PLAYER_ACCELERATION = 500;
    FIRE_RATE = 200;
    TEXT_MARGIN = 50;
    NEXT_FIRE = 0;
    BULLET_SPEED = 600;

    cursors:Phaser.CursorKeys;
    player:Phaser.Sprite;
    bullets:Phaser.Group;
    explosions:Phaser.Group;
    walls:Phaser.Group;
    podemos:Phaser.Group;
    pp:Phaser.Group;
    psoe:Phaser.Group;
    ciudadanos:Phaser.Group;

    constructor()
    {
        super(1536, 900, Phaser.CANVAS, 'gameDiv');
        this.state.add('main', mainState);
        this.state.start('main');
    }
}
class mainState extends Phaser.State
{
    game:PoliticianKiller;
    preload():void
    {
        super.preload();
        this.loadImages();
        this.physics.startSystem(Phaser.Physics.ARCADE);
        if (this.game.device.desktop) {this.game.cursors = this.input.keyboard.createCursorKeys();}
    }
    loadImages()
    {
        this.load.image('wall', 'assets/PNG/Tiles/greystone.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('red_explosion', 'assets/explosion.gif');
        this.load.image('bullet','assets/bullet.png');

        this.load.image('pablo', 'assets/pablo-50x50.png');
        //this.load.image('pedro', 'assets/pedro-50x50.png');
        //this.load.image('mariano', 'assets/mariano50x50.png');
        //this.load.image('albert', 'assets/albert50x50.png');
    }
    create():void
    {
        super.create();
        this.configMAP();
        this.configPLAYER();
        this.configBULLETSEXPLOSIONS();
        this.configPOLITICIANS();
    }
    update():void
    {
        super.update();
        this.physics.arcade.collide(this.game.player, this.game.walls);
        this.physics.arcade.collide(this.game.bullets, this.game.walls, this.destroyBullet, null, this);
        //this.physics.arcade.collide(this.game.)

        this.game.player.rotation = this.physics.arcade.angleToPointer(this.game.player, this.input.activePointer);
        this.onMouseLeftClick();
    }
    destroyBullet(bullet:Bullet, wall:Wall)
    {
        bullet.kill();
        bullet.explosionable.doExplode(bullet.body.x, bullet.body.y);
    }
    configPOLITICIANS()
    {
        this.game.podemos = this.add.group();
        for (var x=0; x<20; x++)
        {
            var politician = new Politician(this.game, 1000, x*x, 'pablo', 0);
            this.game.podemos.add(politician);
        }

    }
    onMouseLeftClick()
    {
        if (this.input.activePointer.isDown && this.time.now > this.game.NEXT_FIRE)
        {
            var bullet = this.game.bullets.getFirstDead();
            if (bullet)
            {
                var x = this.game.player.x + (Math.cos(this.game.player.rotation) * this.game.player.width * 0.5 + 15);
                var y = this.game.player.y + (Math.sin(this.game.player.rotation) * this.game.player.width * 0.5 + 15);
                bullet.reset(x, y);
                bullet.angle = this.game.player.angle;
                var velocity = this.physics.arcade.velocityFromRotation(bullet.rotation, this.game.BULLET_SPEED);
                bullet.body.velocity.setTo(velocity.x, velocity.y);
                this.game.NEXT_FIRE = this.time.now + this.game.FIRE_RATE;
            }
        }
    }
    configMAP()
    {
        this.game.walls = this.add.group();
        for (var x=0; x<12; x++)
        {
            var upperWall = new Wall(this.game, x*128, 0, 'wall', 0);
            this.game.add.existing(upperWall);
            this.game.walls.add(upperWall);
            var lowerWall = new Wall(this.game, x*128, this.world.height-128, 'wall', 0);
            this.game.add.existing(lowerWall);
            this.game.walls.add(lowerWall);
        }
    }
    configPLAYER()
    {
        var oriol = new Player('ORIOL', this.game.PLAYER_LIVES, this.game, +50, this.world.centerY, 'player', null);
        this.game.player = this.add.existing(oriol);
    }
    configBULLETSEXPLOSIONS()
    {
        this.game.explosions = this.add.group();
        this.game.explosions.createMultiple(30, null);
        this.game.explosions.forEach((explosion:Phaser.Sprite) => {explosion.loadTexture('red_explosion');}, this);
        this.game.bullets = this.add.group();
        this.game.bullets.enableBody = true;
        this.game.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        for (var x=0; x<20; x++)
        {
            var bullet = new Bullet(this.game, 'bullet');
            bullet.setExplosionable(new RedExplosion(this.game));
            this.game.bullets.add(bullet);
        }
    }
}
class Wall extends Phaser.Sprite
{
    constructor(game:PoliticianKiller, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame:string|number)
    {
        super(game, x, y, key, frame);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.immovable = true;
    }
}
class Bullet extends Phaser.Sprite
{
    explosionable:Explosionable;
    constructor(game:PoliticianKiller, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture)
    {
        super(game, 0, 0, key, 0);
        this.anchor.setTo(0.5, 0.5);
        this.scale.setTo(0.5, 0.5);
        this.checkWorldBounds = true;
        this.events.onOutOfBounds.add(this.killBullet, this);
        this.alive = false;
    }
    killBullet(bullet:Bullet) {bullet.kill();}
    setExplosionable(explosionable:Explosionable):void {this.explosionable = explosionable;}
}
interface Explosionable {doExplode(x:number, y:number):void}
class RedExplosion extends Phaser.Sprite implements Explosionable
{
    game:PoliticianKiller;
    constructor(game:PoliticianKiller)
    {
        super(game, 0, 0, null, 0);
        this.game = game;
        this.anchor.set(0.5, 0.5);
        this.alive = false;
    }
    doExplode(x:number, y:number):void
    {
            var explosion = this.game.explosions.getFirstDead();
            if (explosion)
            {
                explosion.reset(x-50, y-50);
                var tween = this.game.add.tween(explosion).to({alpha: 0}, 300);
                tween.onComplete.add(() => {explosion.kill();});
                tween.start();
            }
    }
}
class Politician extends Phaser.Sprite
{
    GAME:PoliticianKiller;
    constructor(game:PoliticianKiller, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame:string|number)
    {
        super(game, x, y, key, frame);
        this.GAME = game;
        this.anchor.setTo(0.5, 0.5);
       // this.body.angle = this.game.rnd;
    }
}
class Player extends Phaser.Sprite
{
    game:PoliticianKiller;
    SCORE:number;
    NAME:string;
    constructor(name:string, startingLives:number, game:PoliticianKiller, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame:string|number)
    {
        super(game, x, y, key, frame);
        this.game = game;
        this.NAME = name;
        this.SCORE = 0;
        this.anchor.setTo(0.5, 0.5);
        this.health = startingLives;
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.maxVelocity.setTo(this.game.PLAYER_MAX_SPEED, this.game.PLAYER_MAX_SPEED);
        this.body.collideWorldBounds = true;
        this.body.drag.setTo(this.game.PLAYER_DRAG, this.game.PLAYER_DRAG);
    }

    update():void
    {
        super.update();
        if (this.game.cursors.up.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {this.game.player.body.acceleration.y = -this.game.PLAYER_ACCELERATION;}
        else if (this.game.cursors.down.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {this.game.player.body.acceleration.y = this.game.PLAYER_ACCELERATION;}
        else
        {
            this.game.player.body.acceleration.x = 0;
            this.game.player.body.acceleration.y = 0;
        }
    }
}



