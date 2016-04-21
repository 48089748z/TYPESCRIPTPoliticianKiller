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
    MyGame.MenuState = MenuState;
})(MyGame || (MyGame = {}));
//# sourceMappingURL=MenuState.js.map