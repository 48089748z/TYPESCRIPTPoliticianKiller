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
    MyGame.Politician = Politician;
})(MyGame || (MyGame = {}));
//# sourceMappingURL=Politician.js.map