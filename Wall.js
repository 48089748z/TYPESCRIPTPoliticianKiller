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
    var Wall = (function (_super) {
        __extends(Wall, _super);
        function Wall(game, x, y, key, frame) {
            _super.call(this, game, x, y, key, frame);
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.immovable = true;
        }
        return Wall;
    })(Phaser.Sprite);
    MyGame.Wall = Wall;
})(MyGame || (MyGame = {}));
//# sourceMappingURL=Wall.js.map