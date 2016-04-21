/**
 * Created by 48089748z on 21/04/16.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MyGame;
(function (MyGame) {
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
    MyGame.StartState = StartState;
})(MyGame || (MyGame = {}));
//# sourceMappingURL=StartState.js.map