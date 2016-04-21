var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 48089748z on 21/04/16.
 */
var MyGame;
(function (MyGame) {
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
    MyGame.Player = Player;
})(MyGame || (MyGame = {}));
//# sourceMappingURL=Player.js.map