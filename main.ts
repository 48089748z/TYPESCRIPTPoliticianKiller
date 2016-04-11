/// <reference path="phaser/phaser.d.ts"/>
window.onload = () => {new PoliticianKiller();};
class PoliticianKiller extends Phaser.Game
{
    PLAYER_MAX_SPEED = 300;
    PLAYER_DRAG = 600;
    PLAYER_LIVES = 5;
    PLAYER_ACCELERATION = 500;

    cursors:Phaser.CursorKeys;
    player:Phaser.Sprite;
    bullets:Phaser.Group;
    explosions:Phaser.Group;
    walls:Phaser.Group;
    politicians:Phaser.Group;
    constructor()
    {
        super(1280, 900, Phaser.CANVAS, 'gameDiv');
        this.state.add('main', mainState);
        this.state.start('main');
    }
    explode(x:number, y:number)
    {
        var explosion = this.explosions.getFirstDead();
        if (explosion)
        {
            explosion.reset(x - this.rnd.integerInRange(0, 5) + this.rnd.integerInRange(0, 5), y - this.rnd.integerInRange(0, 5) + this.rnd.integerInRange(0, 5));
            explosion.alpha = 0.6;
            explosion.angle = this.rnd.angle();
            explosion.scale.setTo(this.rnd.realInRange(0.5, 0.75));
            this.add.tween(explosion.scale).to({x: 0, y: 0}, 500).start();
            var tween = this.add.tween(explosion).to({alpha: 0}, 500);
            tween.onComplete.add(() => {
                explosion.kill();
            });
            tween.start();
        }
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

        //this.load.image('pablo', 'assets/pablo.png');
        //this.load.image('pedro', 'assets/pedro.png');
        //this.load.image('mariano', 'assets/mariano.png');
        //this.load.image('albert', 'assets/albert.png');
    }
    create():void
    {
         super.create();
         this.configMAP();
         this.configPLAYER();

    }
    update():void
    {
        super.update();
        this.physics.arcade.collide(this.game.player, this.game.walls);

    }
    //fireWhenButtonClicked() {if (this.input.activePointer.isDown) {this.fire();}};


    configMAP()
    {
        this.game.walls = this.add.group();
        for (var x=0; x<10; x++)
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
        var oriol = new Player('ORIOL', this.game.PLAYER_LIVES, this.game, this.world.centerX, this.world.centerY, 'player', 0);
        this.game.player = this.add.existing(oriol);
    }
    configBULLETS()
    {
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
class Bullet extends Phaser.Sprite //AIXO SERIA COM EL GAT, LES BULLETS EXPLOTEN PER TANT IMPLEMENTEN LA INTERFICIE EXPLOSIONABLE PER A QUE POGUEM PASARLI UN TIPUS D'EXPLOSIÓ
{
    explosionable:Explosionable;
    constructor(game:PoliticianKiller, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture)
    {
        super(game, 0, 0, key, 0);
        this.anchor.setTo(0.5, 0.5);
        this.scale.setTo(0.5, 0.5);
        this.checkWorldBounds = true;
        this.events.onOutOfBounds.add(this.killBullet, this);
        this.kill();
    }
    killBullet(bullet:Bullet) {bullet.kill();}
    setExplosionable(explosionable:Explosionable):void {this.explosionable = explosionable;}
}
interface Explosionable
{
    checkExplosionType(x:number, y:number):void
}
class RedExplosion extends Phaser.Sprite implements Explosionable //EXPLOSIÓ VERMELLA
{
    game:PoliticianKiller;
    constructor(game:PoliticianKiller)
    {
        super(game, 0, 0, null, 0);
        this.game = game;
        this.anchor.set(0.5, 0.5);
        this.kill();
    }
    checkExplosionType(x:number, y:number):void
    {
        this.game.explosions.forEach((explosion:Phaser.Sprite) => {explosion.loadTexture('red_explosion');}, this);
        this.game.explode(x, y);
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
        this.rotation = this.game.physics.arcade.angleToPointer(this.game.input.activePointer);
        if (this.game.cursors.left.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {this.game.player.body.acceleration.x = -this.game.PLAYER_ACCELERATION;}
        else if (this.game.cursors.right.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {this.game.player.body.acceleration.x = this.game.PLAYER_ACCELERATION;}
        else if (this.game.cursors.up.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {this.game.player.body.acceleration.y = -this.game.PLAYER_ACCELERATION;}
        else if (this.game.cursors.down.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {this.game.player.body.acceleration.y = this.game.PLAYER_ACCELERATION;}
        else
        {
            this.game.player.body.acceleration.x = 0;
            this.game.player.body.acceleration.y = 0;
        }
    }
}



