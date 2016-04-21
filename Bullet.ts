/**
 * Created by 48089748z on 21/04/16.
 */
module MyGame
{
    export class Bullet extends Phaser.Sprite
    {
        explosion:Explosion;
        game:PoliticianKiller;
        constructor(game:PoliticianKiller, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture)
        {
            super(game, 0, 0, key, 0);
            this.game = game;
            this.explosion = new Explosion(this.game);
            this.anchor.setTo(0.5, 0.5);
            this.scale.setTo(0.5, 0.5);
            this.checkWorldBounds = true;
            this.events.onOutOfBounds.add(this.killBullet, this);
            this.alive = false;
        }
        killBullet(bullet:Bullet) {bullet.kill();}
    }
}