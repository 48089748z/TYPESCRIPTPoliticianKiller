/**
 * Created by 48089748z on 21/04/16.
 */
module MyGame
{
    export class Explosion extends Phaser.Sprite
    {
        game:PoliticianKiller;
        constructor(game:PoliticianKiller)
        {
            super(game, 1000, 500, 'red_explosion', 0);
            this.game = game;
            this.kill();
        }
        doExplode(x:number, y:number):void
        {
            var deadExplosion = this.game.explosions.getFirstDead();
            if (deadExplosion)
            {
                deadExplosion.reset(x-30, y-30);
                this.game.add.tween(deadExplosion).to( { alpha: 0 }, 600, Phaser.Easing.Linear.None, true);
                // .onComplete.add(() => {explosion.kill();}); SI LE PONGO ESTO LO HACE MAL, POR ESO CREO 3000 BULLETS
            }
        }
    }
}