/**
 * Created by 48089748z on 21/04/16.
 */
module MyGame
{
    export class MenuState extends Phaser.State //STATE TO SHOW THE LOADING BAR, LOADING IMAGES AND GETTING USERNAME
    {
        preload():void
        {
            super.preload();
            var loadingText = this.add.text(this.world.centerX, this.world.centerY - 100, 'LOADING ...', {font: '50px Arial', fill: '#000000'});
            loadingText.anchor.setTo(0.5, 0.5);
            var loading = this.add.sprite(this.world.centerX, this.world.centerY, 'loading');
            loading.anchor.setTo(0.5, 0.5);
            this.load.image('lower_wall', 'assets/lower_wall-100x100.png');
            this.load.image('upper_wall', 'assets/upper_wall-100x100.png' )
            this.load.image('player', 'assets/player-133x100.png');
            this.load.image('red_explosion', 'assets/explosion-72x60.png');
            this.load.image('bullet','assets/bullet-32x20.png');
            this.load.image('obstacle', 'assets/stone-60x60.png');
            this.load.image('coin', 'assets/coin-60x60.png');
            this.load.image('pablo', 'assets/pablo-50x50.png');
            this.load.audio('enemyHitPlayer', 'assets/cuidao.wav');
            this.physics.startSystem(Phaser.Physics.ARCADE);
        }
        create():void
        {
            super.create();
            var playerUsername = prompt("Please enter your Username");
            localStorage.setItem("username", playerUsername);
            this.game.state.start('main');
        }
    }
}