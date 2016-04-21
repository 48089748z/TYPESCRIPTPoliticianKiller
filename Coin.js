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
    MyGame.Coin = Coin;
})(MyGame || (MyGame = {}));
//# sourceMappingURL=Coin.js.map