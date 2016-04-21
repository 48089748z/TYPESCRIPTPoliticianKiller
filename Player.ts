/**
 * Created by 48089748z on 21/04/16.
 */
module MyGame
{
    export class Player extends Phaser.Sprite
    {
        game:PoliticianKiller;
        NAME:string;
        constructor(name:string, startingLives:number, game:PoliticianKiller, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame:string|number)
        {
            super(game, x, y, key, frame);
            this.game = game;
            this.NAME = name;
            this.anchor.setTo(0.5, 0.5);
            this.health = startingLives;
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.velocity.setTo(this.game.PLAYER_VELOCITY, this.game.PLAYER_VELOCITY);
            this.body.maxVelocity.setTo(this.game.PLAYER_MAX_VELOCITY,this.game.PLAYER_MAX_VELOCITY);
            this.body.collideWorldBounds = true;
            this.body.drag.setTo(this.game.PLAYER_DRAG, this.game.PLAYER_DRAG);
        }
        update():void
        {
            super.update();
            if (this.game.cursors.left.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {this.game.player.body.acceleration.x = -this.game.PLAYER_ACCELERATION;}
            else if (this.game.cursors.right.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {this.game.player.body.acceleration.x = this.game.PLAYER_ACCELERATION;}
            else if (this.game.cursors.up.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {this.game.player.body.acceleration.y = -this.game.PLAYER_ACCELERATION;}
            else if (this.game.cursors.down.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {this.game.player.body.acceleration.y = this.game.PLAYER_ACCELERATION;}
            else {this.game.player.body.acceleration.x = 0; this.game.player.body.acceleration.y = 0;}
        }
    }
}