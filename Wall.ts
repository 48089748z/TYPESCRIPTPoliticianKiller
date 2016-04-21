/**
 * Created by 48089748z on 21/04/16.
 */
module MyGame
{
    export class Wall extends Phaser.Sprite
    {
        constructor(game:PoliticianKiller, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame:string|number)
        {
            super(game, x, y, key, frame);
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.immovable = true;
        }
    }
}