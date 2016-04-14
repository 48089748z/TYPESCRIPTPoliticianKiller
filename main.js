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
        _super.call(this, 1800, 900, Phaser.CANVAS, 'gameDiv');
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
        this.load.image('lower_wall', 'assets/lower_wall-100x100.png');
        this.load.image('upper_wall', 'assets/upper_wall-100x100.png');
        this.load.image('player', 'assets/player-133x100.png');
        this.load.image('red_explosion', 'assets/explosion-72x60.png');
        this.load.image('bullet', 'assets/bullet-32x20.png');
        this.load.image('obstacle', 'assets/stone-60x60.png');
        this.load.image('coin', 'assets/coin-60x60.png');
        this.load.image('pablo', 'assets/pablo-50x50.png');
        //this.load.image('pedro', 'assets/pedro-50x50.png');
        //this.load.image('mariano', 'assets/mariano50x50.png');
        //this.load.image('albert', 'assets/albert50x50.png');
    };
    mainState.prototype.create = function () {
        _super.prototype.create.call(this);
        this.configMAP();
        this.configPLAYER();
        this.configBULLETS();
        this.configCOINS();
        this.configEXPLOSIONS();
        this.configPOLITICIANS();
        this.configTEXTS();
    };
    mainState.prototype.update = function () {
        _super.prototype.update.call(this);
        this.physics.arcade.collide(this.game.coins, this.game.player, this.getCoin, null, this);
        this.physics.arcade.collide(this.game.politicians, this.game.player, this.politicianHitPlayer, null, this);
        this.physics.arcade.collide(this.game.player, this.game.walls);
        this.physics.arcade.collide(this.game.bullets, this.game.walls, this.destroyBullet, null, this);
        this.physics.arcade.collide(this.game.bullets, this.game.politicians, this.destroyPolitician, null, this);
        this.physics.arcade.collide(this.game.politicians, this.game.politicians);
        this.physics.arcade.collide(this.game.politicians, this.game.walls);
        this.game.player.rotation = this.physics.arcade.angleToPointer(this.game.player, this.input.activePointer);
        this.onMouseLeftClick();
    };
    mainState.prototype.getCoin = function (player, coin) {
        coin.kill();
        player.SCORE += 50;
        this.game.scoreText.setText("SCORE: " + this.game.player.SCORE);
    };
    mainState.prototype.politicianHitPlayer = function (player, politician) {
        politician.kill();
        player.SCORE -= 10;
        player.health -= 1;
        this.game.scoreText.setText("SCORE: " + this.game.player.SCORE);
        this.game.livesText.setText("LIVES: " + this.game.player.health);
        if (player.health == 0) {
            player.kill();
            this.game.informationText.setText("GAME OVER");
            this.input.onTap.addOnce(this.restart, this);
        }
    };
    mainState.prototype.restart = function () { this.game.state.restart(); };
    mainState.prototype.destroyPolitician = function (bullet, politician) {
        this.game.player.SCORE += 10;
        this.game.scoreText.setText("SCORE: " + this.game.player.SCORE);
        bullet.explosion.doExplode(bullet.body.x, bullet.body.y);
        politician.kill();
        bullet.kill();
    };
    mainState.prototype.destroyBullet = function (bullet, wall) {
        bullet.kill();
        bullet.explosion.doExplode(bullet.body.x, bullet.body.y);
    };
    mainState.prototype.configCOINS = function () {
        this.game.coins = this.add.group();
        this.game.coins.enableBody = true;
        for (var x = 0; x < 20; x++) {
            var randomX = this.game.rnd.integerInRange(50, 1500);
            var randomY = this.game.rnd.integerInRange(200, 700);
            var coin = new Coin(this.game, randomX, randomY, 'coin', 0);
            this.game.coins.add(coin);
        }
    };
    mainState.prototype.configPOLITICIANS = function () {
        this.game.politicians = this.add.group();
        this.game.politicians.physicsBodyType = Phaser.Physics.ARCADE;
        this.game.politicians.enableBody = true;
        for (var x = 0; x < 30; x++) {
            var randomX = this.game.rnd.integerInRange(300, 1500);
            var randomY = this.game.rnd.integerInRange(200, 700);
            var politician = new Politician(this.game, randomX, randomY, 'pablo', 0);
            this.game.politicians.add(politician);
        }
    };
    mainState.prototype.onMouseLeftClick = function () {
        if (this.input.activePointer.isDown && this.time.now > this.game.NEXT_FIRE) {
            var bullet = this.game.bullets.getFirstDead();
            if (bullet) {
                var x = this.game.player.x + (Math.cos(this.game.player.rotation) * this.game.player.width * 0.3 + 3);
                var y = this.game.player.y + (Math.sin(this.game.player.rotation) * this.game.player.width * 0.3 + 3);
                bullet.reset(x, y);
                bullet.angle = this.game.player.angle;
                var velocity = this.physics.arcade.velocityFromRotation(bullet.rotation, this.game.BULLET_SPEED);
                bullet.body.velocity.setTo(velocity.x, velocity.y);
                this.game.NEXT_FIRE = this.time.now + this.game.FIRE_RATE;
            }
        }
    };
    mainState.prototype.configTEXTS = function () {
        this.game.scoreText = this.add.text(50, 20, 'SCORE: ' + this.game.player.SCORE, { font: "40px Arial", fill: "#000000" });
        this.game.scoreText.fixedToCamera = true;
        this.game.livesText = this.add.text(1600, 20, 'LIVES: ' + this.game.player.health, { font: "40px Arial", fill: "#000000" });
        this.game.livesText.fixedToCamera = true;
        this.game.livesText = this.add.text(this.world.centerX, this.world.centerY, '', { font: "40px Arial", fill: "#000000" });
        this.game.livesText.fixedToCamera = true;
    };
    mainState.prototype.configMAP = function () {
        this.game.stage.backgroundColor = "#2ECCFA";
        this.game.walls = this.add.group();
        for (var x = 1; x < 19; x++) {
            var upperWall = new Wall(this.game, (x - 1) * 100, 0, 'upper_wall', 0);
            this.saveWall(upperWall);
            var lowerWall = new Wall(this.game, (x - 1) * 100, this.world.height - 100, 'lower_wall', 0);
            this.saveWall(lowerWall);
            if (x < 4) {
                var obstacle = new Wall(this.game, this.world.centerX, x * 200, 'obstacle', 0);
                this.saveWall(obstacle);
                obstacle = new Wall(this.game, this.world.centerX - 500, x * 200, 'obstacle', 0);
                this.saveWall(obstacle);
                obstacle = new Wall(this.game, this.world.centerX + 500, x * 200, 'obstacle', 0);
                this.saveWall(obstacle);
            }
        }
    };
    mainState.prototype.saveWall = function (wall) {
        this.game.add.existing(wall);
        this.game.walls.add(wall);
    };
    mainState.prototype.configPLAYER = function () {
        var oriol = new Player('ORIOL', this.game.PLAYER_LIVES, this.game, +50, this.world.centerY, 'player', null);
        this.game.player = this.add.existing(oriol);
    };
    mainState.prototype.configBULLETS = function () {
        this.game.bullets = this.add.group();
        this.game.bullets.enableBody = true;
        this.game.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        for (var x = 0; x < 20; x++) {
            var bullet = new Bullet(this.game, 'bullet');
            this.game.bullets.add(bullet);
        }
    };
    mainState.prototype.configEXPLOSIONS = function () {
        this.game.explosions = this.add.group();
        this.game.explosions.enableBody = true;
        for (var x = 0; x < 3000; x++) {
            var explosion = new Explosion(this.game);
            this.game.explosions.add(explosion);
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
        this.game = game;
        this.explosion = new Explosion(this.game);
        this.anchor.setTo(0.5, 0.5);
        this.scale.setTo(0.5, 0.5);
        this.checkWorldBounds = true;
        this.events.onOutOfBounds.add(this.killBullet, this);
        this.alive = false;
    }
    Bullet.prototype.killBullet = function (bullet) {
        bullet.kill();
    };
    return Bullet;
})(Phaser.Sprite);
var Politician = (function (_super) {
    __extends(Politician, _super);
    function Politician(game, x, y, key, frame) {
        _super.call(this, game, x, y, key, frame);
        this.ENEMY_SPEED = 100;
        this.GAME = game;
        this.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.collideWorldBounds = true;
        this.body.bounce.setTo(1);
        this.body.velocity.setTo(this.ENEMY_SPEED, this.ENEMY_SPEED);
        this.body.angle = this.game.rnd;
    }
    return Politician;
})(Phaser.Sprite);
var Explosion = (function (_super) {
    __extends(Explosion, _super);
    function Explosion(game) {
        _super.call(this, game, 1000, 500, 'red_explosion', 0);
        this.game = game;
        this.kill();
    }
    Explosion.prototype.doExplode = function (x, y) {
        var deadExplosion = this.game.explosions.getFirstDead();
        if (deadExplosion) {
            deadExplosion.reset(x - 30, y - 30);
            this.game.add.tween(deadExplosion).to({ alpha: 0 }, 600, Phaser.Easing.Linear.None, true);
        }
    };
    return Explosion;
})(Phaser.Sprite);
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(name, startingLives, game, x, y, key, frame) {
        _super.call(this, game, x, y, key, frame);
        this.SCORE = 0;
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
var Coin = (function (_super) {
    __extends(Coin, _super);
    function Coin(game, x, y, key, frame) {
        _super.call(this, game, x, y, key, frame);
        this.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
    }
    Coin.prototype.update = function () {
        _super.prototype.update.call(this);
        this.angle = this.angle + 1;
    };
    return Coin;
})(Phaser.Sprite);
//# sourceMappingURL=main.js.map