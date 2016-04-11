var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="phaser/phaser.d.ts"/>
window.onload = function () { new PoliticianKiller(); };
var PoliticianKiller = (function (_super) {
    __extends(PoliticianKiller, _super);
    function PoliticianKiller() {
        _super.call(this, 1280, 900, Phaser.CANVAS, 'gameDiv');
        this.PLAYER_MAX_SPEED = 300;
        this.PLAYER_DRAG = 600;
        this.PLAYER_LIVES = 5;
        this.PLAYER_ACCELERATION = 500;
        this.state.add('main', mainState);
        this.state.start('main');
    }
    PoliticianKiller.prototype.explode = function (x, y) {
        var explosion = this.explosions.getFirstDead();
        if (explosion) {
            explosion.reset(x - this.rnd.integerInRange(0, 5) + this.rnd.integerInRange(0, 5), y - this.rnd.integerInRange(0, 5) + this.rnd.integerInRange(0, 5));
            explosion.alpha = 0.6;
            explosion.angle = this.rnd.angle();
            explosion.scale.setTo(this.rnd.realInRange(0.5, 0.75));
            this.add.tween(explosion.scale).to({ x: 0, y: 0 }, 500).start();
            var tween = this.add.tween(explosion).to({ alpha: 0 }, 500);
            tween.onComplete.add(function () {
                explosion.kill();
            });
            tween.start();
        }
    };
    return PoliticianKiller;
})(Phaser.Game);
var mainState = (function (_super) {
    __extends(mainState, _super);
    function mainState() {
        _super.apply(this, arguments);
    }
    mainState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.loadImages();
        this.physics.startSystem(Phaser.Physics.ARCADE);
        if (this.game.device.desktop) {
            this.game.cursors = this.input.keyboard.createCursorKeys();
        }
    };
    mainState.prototype.loadImages = function () {
        this.load.image('wall', 'assets/PNG/Tiles/greystone.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('red_explosion', 'assets/explosion.gif');
        this.load.image('bullet', 'assets/bullet.png');
        //this.load.image('pablo', 'assets/pablo.png');
        //this.load.image('pedro', 'assets/pedro.png');
        //this.load.image('mariano', 'assets/mariano.png');
        //this.load.image('albert', 'assets/albert.png');
    };
    mainState.prototype.create = function () {
        _super.prototype.create.call(this);
        this.configMAP();
        this.configPLAYER();
    };
    mainState.prototype.update = function () {
        _super.prototype.update.call(this);
        this.physics.arcade.collide(this.game.player, this.game.walls);
    };
    //fireWhenButtonClicked() {if (this.input.activePointer.isDown) {this.fire();}};
    mainState.prototype.configMAP = function () {
        this.game.walls = this.add.group();
        for (var x = 0; x < 10; x++) {
            var upperWall = new Wall(this.game, x * 128, 0, 'wall', 0);
            this.game.add.existing(upperWall);
            this.game.walls.add(upperWall);
            var lowerWall = new Wall(this.game, x * 128, this.world.height - 128, 'wall', 0);
            this.game.add.existing(lowerWall);
            this.game.walls.add(lowerWall);
        }
    };
    mainState.prototype.configPLAYER = function () {
        var oriol = new Player('ORIOL', this.game.PLAYER_LIVES, this.game, this.world.centerX, this.world.centerY, 'player', 0);
        this.game.player = this.add.existing(oriol);
    };
    mainState.prototype.configBULLETS = function () {
        this.game.bullets = this.add.group();
        this.game.bullets.enableBody = true;
        this.game.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        for (var x = 0; x < 20; x++) {
            var bullet = new Bullet(this.game, 'bullet');
            bullet.setExplosionable(new RedExplosion(this.game));
            this.game.bullets.add(bullet);
        }
    };
    return mainState;
})(Phaser.State);
var Wall = (function (_super) {
    __extends(Wall, _super);
    function Wall(game, x, y, key, frame) {
        _super.call(this, game, x, y, key, frame);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.immovable = true;
    }
    return Wall;
})(Phaser.Sprite);
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet(game, key) {
        _super.call(this, game, 0, 0, key, 0);
        this.anchor.setTo(0.5, 0.5);
        this.scale.setTo(0.5, 0.5);
        this.checkWorldBounds = true;
        this.events.onOutOfBounds.add(this.killBullet, this);
        this.kill();
    }
    Bullet.prototype.killBullet = function (bullet) { bullet.kill(); };
    Bullet.prototype.setExplosionable = function (explosionable) { this.explosionable = explosionable; };
    return Bullet;
})(Phaser.Sprite);
var RedExplosion = (function (_super) {
    __extends(RedExplosion, _super);
    function RedExplosion(game) {
        _super.call(this, game, 0, 0, null, 0);
        this.game = game;
        this.anchor.set(0.5, 0.5);
        this.kill();
    }
    RedExplosion.prototype.checkExplosionType = function (x, y) {
        this.game.explosions.forEach(function (explosion) { explosion.loadTexture('red_explosion'); }, this);
        this.game.explode(x, y);
    };
    return RedExplosion;
})(Phaser.Sprite);
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(name, startingLives, game, x, y, key, frame) {
        _super.call(this, game, x, y, key, frame);
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
    Player.prototype.update = function () {
        _super.prototype.update.call(this);
        this.rotation = this.game.physics.arcade.angleToPointer(this.game.input.activePointer);
        if (this.game.cursors.left.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            this.game.player.body.acceleration.x = -this.game.PLAYER_ACCELERATION;
        }
        else if (this.game.cursors.right.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            this.game.player.body.acceleration.x = this.game.PLAYER_ACCELERATION;
        }
        else if (this.game.cursors.up.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            this.game.player.body.acceleration.y = -this.game.PLAYER_ACCELERATION;
        }
        else if (this.game.cursors.down.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            this.game.player.body.acceleration.y = this.game.PLAYER_ACCELERATION;
        }
        else {
            this.game.player.body.acceleration.x = 0;
            this.game.player.body.acceleration.y = 0;
        }
    };
    return Player;
})(Phaser.Sprite);
//# sourceMappingURL=main.js.map