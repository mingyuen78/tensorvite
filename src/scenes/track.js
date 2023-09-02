import 'phaser';
import GameUtil from 'gameutil';
export default class Track extends Phaser.Scene {
    constructor (){
        super('track');
    }
    preload() {
        
    }
    create() {
        this.MID_X = this.game.config.width / 2;
        this.MID_Y = this.game.config.height / 2;     
        this.handTrack = this.add.image(this.MID_X, this.MID_Y, "cursor");
        this.handTrack.setOrigin(0.5);
        this.handTrack.setScale(0.1);
        
    }
    update() {
        this.handTrack.x = window.innerWidth - window._rightWrist.x;
        this.handTrack.y = window._rightWrist.y;
        
        
    }
}
