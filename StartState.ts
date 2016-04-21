/**
 * Created by 48089748z on 21/04/16.
 */

module MyGame
{
    export class StartState extends Phaser.State //STATE TO PRELOAD THE LOADING BAR
    {
        preload():void
        {
            super.preload();
            this.load.image('loading', 'assets/loading-436x140.png');
        }
        create():void
        {
            super.create();
            this.stage.backgroundColor = "#ffffff";
            this.game.state.start('menu');
        }
    }
}
