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

    scoreText:Phaser.Text;
    livesText:Phaser.Text;
    informationText:Phaser.Text;
    cursors:Phaser.CursorKeys;
    player:Player;
    bullets:Phaser.Group;
    explosions:Phaser.Group;
    walls:Phaser.Group;
    politicians:Phaser.Group;
    coins:Phaser.Group;


    constructor()
    {
        super(1800, 900, Phaser.CANVAS, 'gameDiv');
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
        this.load.image('lower_wall', 'assets/lower_wall-100x100.png');
        this.load.image('upper_wall', 'assets/upper_wall-100x100.png' )
        this.load.image('player', 'assets/player-133x100.png');
        this.load.image('red_explosion', 'assets/explosion-72x60.png');
        this.load.image('bullet','assets/bullet-32x20.png');
        this.load.image('obstacle', 'assets/stone-60x60.png');

        this.load.image('coin', 'assets/coin-60x60.png');
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
        this.configBULLETS();
        this.configCOINS();
        this.configEXPLOSIONS();
        this.configPOLITICIANS();
        this.configTEXTS();
    }
    update():void
    {
        super.update();
        this.physics.arcade.collide(this.game.coins, this.game.player, this.getCoin, null, this);
        this.physics.arcade.collide(this.game.politicians, this.game.player, this.politicianHitPlayer, null, this);
        this.physics.arcade.collide(this.game.player, this.game.walls);
        this.physics.arcade.collide(this.game.bullets, this.game.walls, this.destroyBullet, null, this);
        this.physics.arcade.collide(this.game.bullets, this.game.politicians, this.destroyPolitician, null, this);
        this.physics.arcade.collide(this.game.politicians, this.game.politicians);
        this.physics.arcade.collide(this.game.politicians, this.game.walls);
        this.game.player.rotation = this.physics.arcade.angleToPointer(this.game.player, this.input.activePointer);
        this.onMouseLeftClick();
    }
    getCoin(player:Player, coin:Coin)
    {
        coin.kill();
        player.SCORE +=50;
        this.game.scoreText.setText("SCORE: "+this.game.player.SCORE);
    }
    politicianHitPlayer(player:Player, politician:Politician)
    {
        politician.kill();
        player.SCORE -= 10;
        player.health -=1;
        this.game.scoreText.setText("SCORE: "+this.game.player.SCORE)
        this.game.livesText.setText("LIVES: "+this.game.player.health);
        if (player.health==0)
        {
            player.kill();
            this.game.informationText.setText("GAME OVER");
            this.input.onTap.addOnce(this.restart, this);
        }
    }
    restart() {this.game.state.restart();}
    destroyPolitician(bullet:Bullet, politician:Politician)
    {
        this.game.player.SCORE +=10;
        this.game.scoreText.setText("SCORE: "+this.game.player.SCORE);
        bullet.explosion.doExplode(bullet.body.x, bullet.body.y);
        politician.kill();
        bullet.kill();
    }
    destroyBullet(bullet:Bullet, wall:Wall)
    {
        bullet.kill();
        bullet.explosion.doExplode(bullet.body.x, bullet.body.y);
    }
    configCOINS()
    {
        this.game.coins = this.add.group();
        this.game.coins.enableBody = true;
        for (var x=0; x<20; x++)
        {
            var randomX = this.game.rnd.integerInRange(50, 1500);
            var randomY = this.game.rnd.integerInRange(200, 700);
            var coin = new Coin(this.game, randomX, randomY, 'coin', 0);
            this.game.coins.add(coin);
        }

    }
    configPOLITICIANS()
    {
        this.game.politicians = this.add.group();
        this.game.politicians.physicsBodyType = Phaser.Physics.ARCADE;
        this.game.politicians.enableBody = true;
        for (var x=0; x<30; x++)
        {
            var randomX = this.game.rnd.integerInRange(300, 1500);
            var randomY = this.game.rnd.integerInRange(200, 700);
            var politician = new Politician(this.game, randomX, randomY, 'pablo', 0);
            this.game.politicians.add(politician);
        }

    }
    onMouseLeftClick()
    {
        if (this.input.activePointer.isDown && this.time.now > this.game.NEXT_FIRE)
        {
            var bullet = this.game.bullets.getFirstDead();
            if (bullet)
            {
                var x = this.game.player.x + (Math.cos(this.game.player.rotation) * this.game.player.width * 0.3 + 3);
                var y = this.game.player.y + (Math.sin(this.game.player.rotation) * this.game.player.width * 0.3 + 3);
                bullet.reset(x, y);
                bullet.angle = this.game.player.angle;
                var velocity = this.physics.arcade.velocityFromRotation(bullet.rotation, this.game.BULLET_SPEED);
                bullet.body.velocity.setTo(velocity.x, velocity.y);
                this.game.NEXT_FIRE = this.time.now + this.game.FIRE_RATE;
            }
        }
    }
    configTEXTS()
    {
        this.game.scoreText = this.add.text(50, 20, 'SCORE: '+this.game.player.SCORE, {font: "40px Arial", fill: "#000000"});
        this.game.scoreText.fixedToCamera = true;
        this.game.livesText = this.add.text(1600, 20, 'LIVES: '+this.game.player.health, {font: "40px Arial", fill: "#000000"});
        this.game.livesText.fixedToCamera = true;
        this.game.livesText = this.add.text(this.world.centerX, this.world.centerY, '', {font: "40px Arial", fill: "#000000"});
        this.game.livesText.fixedToCamera = true;
    }
    configMAP()
    {
        this.game.stage.backgroundColor = "#2ECCFA";
        this.game.walls = this.add.group();
        for (var x=1; x<19; x++)
        {
            var upperWall = new Wall(this.game, (x-1)*100, 0, 'upper_wall', 0);
            this.saveWall(upperWall);
            var lowerWall = new Wall(this.game, (x-1)*100, this.world.height-100, 'lower_wall', 0);
            this.saveWall(lowerWall);
            if (x<4)
            {
                var obstacle = new Wall(this.game,  this.world.centerX, x*200, 'obstacle',0);
                this.saveWall(obstacle);
                obstacle = new Wall(this.game,  this.world.centerX-500, x*200, 'obstacle',0);
                this.saveWall(obstacle);
                obstacle = new Wall(this.game,  this.world.centerX+500, x*200, 'obstacle',0);
                this.saveWall(obstacle);
            }
        }
    }
    saveWall(wall:Wall)
    {
        this.game.add.existing(wall);
        this.game.walls.add(wall);
    }


    configPLAYER()
    {
        var oriol = new Player('ORIOL', this.game.PLAYER_LIVES, this.game, +50, this.world.centerY, 'player', null);
        this.game.player = this.add.existing(oriol);
    }
    configBULLETS()
    {
        this.game.bullets = this.add.group();
        this.game.bullets.enableBody = true;
        this.game.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        for (var x=0; x< 20; x++)
        {
            var bullet = new Bullet(this.game, 'bullet');
            this.game.bullets.add(bullet);
        }
    }
    configEXPLOSIONS()
    {
        this.game.explosions = this.add.group();
        this.game.explosions.enableBody = true;
        for (var x=0; x<3000; x++)
        {
            var explosion = new Explosion(this.game);
            this.game.explosions.add(explosion);
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
    explosion:Explosion;
    game:PoliticianKiller;
    constructor(game:PoliticianKiller, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture)
    {
        super(game, 0, 0, key, 0);
        this.game = game;
        this.explosion = new Explosion(this.game);
        this.anchor.setTo(0.5, 0.5);
        this.scale.setTo(0.5, 0.5);
        this.checkWorldBounds = true;
        this.events.onOutOfBounds.add(this.killBullet, this);
        this.alive = false;
    }
    killBullet(bullet:Bullet)
    {
        bullet.kill();
    }
}
class Politician extends Phaser.Sprite
{
    GAME:PoliticianKiller;
    ENEMY_SPEED = 100;
    constructor(game:PoliticianKiller, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame:string|number)
    {
        super(game, x, y, key, frame);
        this.GAME = game;
        this.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.collideWorldBounds = true;
        this.body.bounce.setTo(1);
        this.body.velocity.setTo(this.ENEMY_SPEED, this.ENEMY_SPEED);
        this.body.angle = this.game.rnd;
    }
}
class Explosion extends Phaser.Sprite
{
    game:PoliticianKiller;
    constructor(game:PoliticianKiller)
    {
        super(game, 1000, 500, 'red_explosion', 0);
        this.game = game;
        this.kill();
    }
    doExplode(x:number, y:number):void
    {
        var deadExplosion = this.game.explosions.getFirstDead();
        if (deadExplosion)
        {
            deadExplosion.reset(x-30, y-30);
            this.game.add.tween(deadExplosion).to( { alpha: 0 }, 600, Phaser.Easing.Linear.None, true);
            // .onComplete.add(() => {explosion.kill();}); SI LE PONGO ESTO LO HACE MAL
        }
    }
}
class Player extends Phaser.Sprite
{
    game:PoliticianKiller;
    SCORE:number=0;
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
class Coin extends Phaser.Sprite
{
    constructor(game:Phaser.Game, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame:string|number) {
        super(game, x, y, key, frame);
        this.anchor.setTo(0.5,0.5);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
    }
    update():void
    {
        super.update();
        this.angle = this.angle+1;
    }
}



