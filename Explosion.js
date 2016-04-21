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
    MyGame.Explosion = Explosion;
})(MyGame || (MyGame = {}));
//# sourceMappingURL=Explosion.js.map