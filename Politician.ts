/**
 * Created by 48089748z on 21/04/16.
 */
module MyGame
{
    export class Politician extends Phaser.Sprite
    {
        GAME:PoliticianKiller;
        ENEMY_SPEED = 100;
        constructor(game:PoliticianKiller, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame:string|number)
        {
            super(game, x, y, key, frame);
            this.GAME = game;
            this.anchor.setTo(0.5, 0.5);
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.collideWorldBounds = true;
            this.body.bounce.setTo(1);
            this.body.velocity.setTo(this.ENEMY_SPEED, this.ENEMY_SPEED);
            this.body.angle = this.game.rnd;
        }
    }
}
