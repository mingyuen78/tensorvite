import 'phaser';
export default class Preload extends Phaser.Scene {
    constructor (){
        super('preload');
    }
    preload() {
        this.load.setPath('assets');
        this.load.image('loader_bar', '/images/loading.png');
        this.load.image('cursor', '/images/indicator.png');
    }
    create() {
        this.MID_X = this.game.config.width / 2;
        this.MID_Y = this.game.config.height / 2;               
        const loading = this.add.image(this.MID_X, this.MID_Y, "loader_bar");
        
        loading.setOrigin(0.5);
        this.loading = loading;
        this.loading.scaleX = 0;

        window.addEventListener('TensorReady', (evt)=> {
            this.loading.scaleX = 1;
            this.scene.start("track");
        });
    }
    update() {
        
    }
}
