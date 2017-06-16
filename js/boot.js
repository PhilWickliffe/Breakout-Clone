var BREAKOUT = {};
BREAKOUT.Boot = function (game) {};
BREAKOUT.Boot.prototype = {
    preload: function () {
        this.load.image('preloaderBall', 'assets/loadBall.png');
        this.state.start('Preloader');
    },
    create: function () {
        this.input.maxPointers = 1;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        if (this.game.device.desktop) {
            this.scale.maxWidth = 640;
            this.scale.maxHeight = 960;
        }

        this.scale.forceOrientation(true, false);
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.refresh();
    }
}