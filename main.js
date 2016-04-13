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
        _super.call(this, 1536, 900, Phaser.CANVAS, 'gameDiv');
        this.PLAYER_MAX_SPEED = 300;
        this.PLAYER_DRAG = 600;
        this.PLAYER_LIVES = 5;
        this.PLAYER_ACCELERATION = 500;
        this.FIRE_RATE = 200;
        this.TEXT_MARGIN = 50;
        this.NEXT_FIRE = 0;
        this.BULLET_SPEED = 600;
        this.state.add('main', mainState);
        this.state.start('main');
    }
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
        this.load.image('pablo', 'assets/pablo-50x50.png');
        //this.load.image('pedro', 'assets/pedro-50x50.png');
        //this.load.image('mariano', 'assets/mariano50x50.png');
        //this.load.image('albert', 'assets/albert50x50.png');
    };
    mainState.prototype.create = function () {
        _super.prototype.create.call(this);
        this.configMAP();
        this.configPLAYER();
        this.configBULLETSEXPLOSIONS();
        this.configPOLITICIANS();
    };
    mainState.prototype.update = function () {
        _super.prototype.update.call(this);
        this.physics.arcade.collide(this.game.player, this.game.walls);
        this.physics.arcade.collide(this.game.bullets, this.game.walls, this.destroyBullet, null, this);
        //this.physics.arcade.collide(this.game.)
        this.game.player.rotation = this.physics.arcade.angleToPointer(this.game.player, this.input.activePointer);
        this.onMouseLeftClick();
    };
    mainState.prototype.destroyBullet = function (bullet, wall) {
        bullet.kill();
        bullet.explosionable.doExplode(bullet.body.x, bullet.body.y);
    };
    mainState.prototype.configPOLITICIANS = function () {
        this.game.podemos = this.add.group();
        for (var x = 0; x < 20; x++) {
            var politician = new Politician(this.game, 1000, x * x, 'pablo', 0);
            this.game.podemos.add(politician);
        }
    };
    mainState.prototype.onMouseLeftClick = function () {
        if (this.input.activePointer.isDown && this.time.now > this.game.NEXT_FIRE) {
            var bullet = this.game.bullets.getFirstDead();
            if (bullet) {
                var x = this.game.player.x + (Math.cos(this.game.player.rotation) * this.game.player.width * 0.5 + 15);
                var y = this.game.player.y + (Math.sin(this.game.player.rotation) * this.game.player.width * 0.5 + 15);
                bullet.reset(x, y);
                bullet.angle = this.game.player.angle;
                var velocity = this.physics.arcade.velocityFromRotation(bullet.rotation, this.game.BULLET_SPEED);
                bullet.body.velocity.setTo(velocity.x, velocity.y);
                this.game.NEXT_FIRE = this.time.now + this.game.FIRE_RATE;
            }
        }
    };
    mainState.prototype.configMAP = function () {
        this.game.walls = this.add.group();
        for (var x = 0; x < 12; x++) {
            var upperWall = new Wall(this.game, x * 128, 0, 'wall', 0);
            this.game.add.existing(upperWall);
            this.game.walls.add(upperWall);
            var lowerWall = new Wall(this.game, x * 128, this.world.height - 128, 'wall', 0);
            this.game.add.existing(lowerWall);
            this.game.walls.add(lowerWall);
        }
    };
    mainState.prototype.configPLAYER = function () {
        var oriol = new Player('ORIOL', this.game.PLAYER_LIVES, this.game, +50, this.world.centerY, 'player', null);
        this.game.player = this.add.existing(oriol);
    };
    mainState.prototype.configBULLETSEXPLOSIONS = function () {
        this.game.explosions = this.add.group();
        this.game.explosions.createMultiple(30, null);
        this.game.explosions.forEach(function (explosion) { explosion.loadTexture('red_explosion'); }, this);
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
        this.alive = false;
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
        this.alive = false;
    }
    RedExplosion.prototype.doExplode = function (x, y) {
        var explosion = this.game.explosions.getFirstDead();
        if (explosion) {
            explosion.reset(x - 50, y - 50);
            var tween = this.game.add.tween(explosion).to({ alpha: 0 }, 300);
            tween.onComplete.add(function () { explosion.kill(); });
            tween.start();
        }
    };
    return RedExplosion;
})(Phaser.Sprite);
var Politician = (function (_super) {
    __extends(Politician, _super);
    function Politician(game, x, y, key, frame) {
        _super.call(this, game, x, y, key, frame);
        this.GAME = game;
        this.anchor.setTo(0.5, 0.5);
        // this.body.angle = this.game.rnd;
    }
    return Politician;
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
        if (this.game.cursors.up.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
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