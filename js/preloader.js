// JavaScript Document
// Author ArcticArcade
BREAKOUT.Preloader = function (game) {
    BREAKOUT.gameWidth = 640;
    BREAKOUT.gameHeight = 960;
    BREAKOUT.score = 0;
    BREAKOUT.highScore = 0;
    BREAKOUT.currentLevel = 0;
};
BREAKOUT.Preloader.prototype = {
    preload: function () {
        this.stage.backgroundColor = '#000000';
        this.load.crossOrigin = "anonymous";
		this.preloadBall = this.add.sprite(BREAKOUT.gameWidth / 2 - 189, BREAKOUT.gameHeight / 2, 'preloaderBall');
		this.load.setPreloadSprite(this.preloadBall);

		this.load.image('background', 'assets/background.png');
		this.load.spritesheet('paddle', 'assets/paddle.png', 102, 22);
		this.load.spritesheet('tiles', 'assets/tiles.png', 72, 32);
		this.load.spritesheet('balls', 'assets/balls.png', 26, 26);
		this.load.bitmapFont('myFont', 'assets/font.png', 'assets/font.fnt');
    },
    create: function () {
		if(this.preloadBall) this.preloadBall.destroy();
		this.load.preloadSprite = null;
        this.state.start('Game');
    }
};