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
        this.LEVEL = 1;
        this.SCORE = 0;
        this.TOTAL_KILLED = 0;
        this.TAKEN_COINS = 0;
        this.PLAYER_MAX_VELOCITY = 600;
        this.PLAYER_VELOCITY = 400;
        this.PLAYER_DRAG = 300;
        this.PLAYER_LIVES = 3;
        this.PLAYER_ACCELERATION = 500;
        this.FIRE_RATE = 200;
        this.TEXT_MARGIN = 50;
        this.NEXT_FIRE = 0;
        this.BULLET_SPEED = 600;
        this.state.add('main', mainState);
        this.state.add("start", StartState);
        this.state.add("menu", MenuState);
        this.state.start('start');
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
        if (this.game.device.desktop) {
            this.game.cursors = this.input.keyboard.createCursorKeys();
        }
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
        if (this.game.politicians.countLiving() == 0) {
            this.game.LEVEL += 1;
            this.newLevel();
        }
        this.physics.arcade.collide(this.game.coins, this.game.player, this.getCoin, null, this);
        this.physics.arcade.collide(this.game.politicians, this.game.player, this.politicianHitPlayer, null, this);
        this.physics.arcade.collide(this.game.player, this.game.walls);
        this.physics.arcade.collide(this.game.bullets, this.game.walls, this.destroyBullet, null, this);
        this.physics.arcade.collide(this.game.bullets, this.game.politicians, this.destroyPolitician, null, this);
        this.physics.arcade.collide(this.game.politicians, this.game.politicians);
        this.physics.arcade.collide(this.game.politicians, this.game.walls);
        this.game.player.rotation = this.physics.arcade.angleToPointer(this.game.player, this.input.activePointer);
        this.game.levelText.setText("LEVEL: " + this.game.LEVEL + "        Level Enemies: " + this.game.LEVEL * 10 + "     Level Coins: " + this.game.LEVEL * 3 + "\n                     Killed Enemies: " + this.game.TOTAL_KILLED + "     Taken Coins: " + this.game.TAKEN_COINS);
        this.onMouseLeftClick();
    };
    mainState.prototype.getCoin = function (player, coin) {
        coin.kill();
        this.game.SCORE += 20;
        this.game.TAKEN_COINS += 1;
        this.game.scoreText.setText("PLAYER: " + this.game.player.NAME + "\nSCORE: " + this.game.SCORE);
    };
    mainState.prototype.politicianHitPlayer = function (player, politician) {
        politician.kill();
        this.game.SCORE -= 100;
        player.health -= 1;
        this.game.scoreText.setText("PLAYER: " + this.game.player.NAME + "\nSCORE: " + this.game.SCORE);
        this.game.livesText.setText("LIVES: " + this.game.player.health);
        if (player.health == 0) {
            player.kill();
            this.game.informationText.setText("GAME OVER\nCLICK TO RESTART");
            this.input.onTap.addOnce(this.finishGame, this);
        }
    };
    mainState.prototype.finishGame = function () {
        this.game.LEVEL = 1;
        this.game.state.restart();
    };
    mainState.prototype.newLevel = function () {
        var highScore = localStorage.getItem("highScore");
        if (highScore == null || highScore < this.game.SCORE) {
            localStorage.setItem("highScore", this.game.SCORE.toString());
            localStorage.setItem("highUser", this.game.player.NAME);
        }
        this.game.state.restart();
        // this.game.LEVEL = 1;
    };
    mainState.prototype.destroyPolitician = function (bullet, politician) {
        this.game.SCORE += 10;
        this.game.TOTAL_KILLED += 1;
        this.game.scoreText.setText("PLAYER: " + this.game.player.NAME + "\nSCORE: " + this.game.SCORE);
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
        for (var x = 0; x < this.game.LEVEL * 3; x++) {
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
        for (var x = 0; x < this.game.LEVEL * 10; x++) {
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
        this.game.scoreText = this.add.text(50, 0, 'PLAYER: ' + this.game.player.NAME + '\nSCORE: ' + this.game.SCORE, { font: "30px Arial", fill: "#000000" });
        this.game.scoreText.fixedToCamera = true;
        this.game.livesText = this.add.text(1600, 20, 'LIVES: ' + this.game.player.health, { font: "30px Arial", fill: "#000000" });
        this.game.livesText.fixedToCamera = true;
        this.game.informationText = this.add.text(this.world.centerX, this.world.centerY, '', { font: "130px Arial", fill: "#000000" });
        this.game.informationText.anchor.setTo(0.5, 0.5);
        this.game.levelText = this.add.text(this.world.centerX, 35, "LEVEL: " + this.game.LEVEL + "        Level Enemies: " + this.game.LEVEL * 10 + "     Level Coins: " + this.game.LEVEL * 3 + "\n                     Killed Enemies: " + this.game.TOTAL_KILLED + "     Taken Coins: " + this.game.TAKEN_COINS, { font: "20px Arial", fill: "#000000" });
        this.game.levelText.anchor.setTo(0.5, 0.5);
        this.game.levelText.fixedToCamera = true;
        this.game.highestScoreText = this.add.text(this.world.centerX, this.world.height - 30, "HIGHEST SCORE: " + localStorage.getItem("highScore") + " by " + localStorage.getItem("highUser"), { font: "50px Arial", fill: "#000000" });
        this.game.highestScoreText.anchor.setTo(0.5, 0.5);
        this.game.highestScoreText.fixedToCamera = true;
    };
    mainState.prototype.configMAP = function () {
        switch (this.game.LEVEL) {
            case 1: {
                this.game.stage.backgroundColor = "#FFFFFF";
                break;
            }
            case 2: {
                this.game.stage.backgroundColor = "#FFF700";
                break;
            }
            case 3: {
                this.game.stage.backgroundColor = "#89FF00";
                break;
            }
            case 4: {
                this.game.stage.backgroundColor = "#00FCFF";
                break;
            }
            case 5: {
                this.game.stage.backgroundColor = "#FF00C4";
                break;
            }
            case 6: {
                this.game.stage.backgroundColor = "#FF0000";
                break;
            }
            default: {
                this.game.stage.backgroundColor = "#6E6E6E";
                break;
            }
        }
        this.game.walls = this.add.group();
        for (var x = 1; x < 19; x++) {
            var upperWall = new Wall(this.game, (x - 1) * 100, 0, 'upper_wall', 0);
            this.saveWall(upperWall);
            var lowerWall = new Wall(this.game, (x - 1) * 100, this.world.height - 100, 'lower_wall', 0);
            this.saveWall(lowerWall);
            if (x < this.game.LEVEL) {
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
        var player = new Player(localStorage.getItem("username").toString(), this.game.PLAYER_LIVES, this.game, +50, this.world.centerY, 'player', null);
        this.game.player = this.add.existing(player);
    };
    mainState.prototype.configBULLETS = function () {
        this.game.bullets = this.add.group();
        this.game.bullets.enableBody = true;
        this.game.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        for (var x = 0; x < 30; x++) {
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
        this.game = game;
        this.NAME = name;
        this.anchor.setTo(0.5, 0.5);
        this.health = startingLives;
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.velocity.setTo(this.game.PLAYER_VELOCITY, this.game.PLAYER_VELOCITY);
        this.body.maxVelocity.setTo(this.game.PLAYER_MAX_VELOCITY, this.game.PLAYER_MAX_VELOCITY);
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
var MenuState = (function (_super) {
    __extends(MenuState, _super);
    function MenuState() {
        _super.apply(this, arguments);
    }
    MenuState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        var loadingText = this.add.text(this.world.centerX, this.world.centerY - 100, 'LOADING ...', { font: '50px Arial', fill: '#000000' });
        loadingText.anchor.setTo(0.5, 0.5);
        var loading = this.add.sprite(this.world.centerX, this.world.centerY, 'loading');
        loading.anchor.setTo(0.5, 0.5);
        this.load.image('lower_wall', 'assets/lower_wall-100x100.png');
        this.load.image('upper_wall', 'assets/upper_wall-100x100.png');
        this.load.image('player', 'assets/player-133x100.png');
        this.load.image('red_explosion', 'assets/explosion-72x60.png');
        this.load.image('bullet', 'assets/bullet-32x20.png');
        this.load.image('obstacle', 'assets/stone-60x60.png');
        this.load.image('coin', 'assets/coin-60x60.png');
        this.load.image('pablo', 'assets/pablo-50x50.png');
        this.physics.startSystem(Phaser.Physics.ARCADE);
    };
    MenuState.prototype.create = function () {
        _super.prototype.create.call(this);
        var playerUsername = prompt("Please enter your Username");
        localStorage.setItem("username", playerUsername);
        this.game.state.start('main');
    };
    return MenuState;
})(Phaser.State);
var StartState = (function (_super) {
    __extends(StartState, _super);
    function StartState() {
        _super.apply(this, arguments);
    }
    StartState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.load.image('loading', 'assets/loading-436x140.png');
    };
    StartState.prototype.create = function () {
        _super.prototype.create.call(this);
        this.stage.backgroundColor = "#ffffff";
        this.game.state.start('menu');
    };
    return StartState;
})(Phaser.State);
//# sourceMappingURL=main.js.map