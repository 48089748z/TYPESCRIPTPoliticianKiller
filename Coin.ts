/**
 * Created by 48089748z on 21/04/16.
 */
module MyGame
{
    export class Coin extends Phaser.Sprite
    {
        constructor(game:Phaser.Game, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame:string|number) {
            super(game, x, y, key, frame);
            this.anchor.setTo(0.5,0.5);
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
        }
        update():void
        {
            super.update();
            this.angle = this.angle+1;
        }
    }
}