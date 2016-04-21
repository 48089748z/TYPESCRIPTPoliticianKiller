/// <reference path="phaser/phaser.d.ts"/>
module MyGame
{
    window.onload = () => {new PoliticianKiller();};
    export class PoliticianKiller extends Phaser.Game
    {
        LEVEL = 1;
        SCORE = 0;
        TOTAL_KILLED = 0;
        TAKEN_COINS = 0;
        PLAYER_MAX_VELOCITY = 600;
        PLAYER_VELOCITY = 400;
        PLAYER_DRAG = 300;
        PLAYER_LIVES = 3;
        PLAYER_ACCELERATION = 500;
        FIRE_RATE = 200;
        NEXT_FIRE = 0;
        BULLET_SPEED = 600;

        cuidaoSound;
        highestScoreText:Phaser.Text;
        scoreText:Phaser.Text;
        levelText:Phaser.Text;
        livesText:Phaser.Text;
        informationText:Phaser.Text;
        cursors:Phaser.CursorKeys;
        player:Player;
        bullets:Phaser.Group;
        explosions:Phaser.Group;
        walls:Phaser.Group;
        politicians:Phaser.Group;
        coins:Phaser.Group;
        constructor()
        {
            super(1800, 900, Phaser.CANVAS, 'gameDiv');
            this.state.add('start', StartState);
            this.state.add('menu', MenuState);
            this.state.add('main', mainState);
            this.state.start('start');
        }
    }
}