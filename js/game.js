// Breakout clone - Phil Wickliffe
/*
I tried to put a bit of a spin on the game, my idea is to make it colourful and hectic.
When you hit a tile, there's a chance of it spawning another ball. As the game progresses, the chance increases, as does the speed.
The further you get, the razier it should be.

Also on completion, I added a wee nicety. Tap to create a new ball...
*/

BREAKOUT.Game = function (game) {
    BREAKOUT._game = game;
};

BREAKOUT.Game.prototype = {
    create: function () {
        maps = [
            //Stage 1
            [
                [0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 1, 1],
                [2, 2, 2, 2, 2, 2, 2, 2],
                [3, 3, 3, 3, 3, 3, 3, 3],
                [4, 4, 4, 4, 4, 4, 4, 4],
                [5, 5, 5, 5, 5, 5, 5, 5],
                [6, 6, 6, 6, 6, 6, 6, 6],
                [7, 7, 7, 7, 7, 7, 7, 7]
            ],
            //Stage 2
            [
                [0, 0, 0, 0, 0, 0, 0],
                [1, 2, 3, 4, 5, 6, 7],
                [2, 3, 4, 5, 6, 7, 1],
                [3, 4, 5, 6, 7, 1, 2],
                [4, 5, 6, 7, 1, 2, 3],
                [5, 6, 7, 1, 2, 3, 4],
                [6, 7, 1, 2, 3, 4, 5],
                [7, 1, 2, 3, 4, 5, 6]
            ],
            //Stage 3 - Introducing metallic blocks
            [
                [1, 1, 0, 2, 2, 0, 1, 1],
                [1, 1, 0, 2, 2, 0, 1, 1],
                [2, 2, 0, 1, 1, 0, 2, 2],
                [2, 2, 0, 1, 1, 0, 2, 2],
                [1, 1, 0, 2, 2, 0, 1, 1],
                [1, 1, 0, 2, 2, 0, 1, 1],
                [8, 8, 8, 8, 8, 8, 8, 8],
                [2, 2, 0, 1, 1, 0, 2, 2],
                [2, 2, 0, 1, 1, 0, 2, 2],
                [1, 1, 0, 2, 2, 0, 1, 1],
                [1, 1, 0, 2, 2, 0, 1, 1],
                [2, 2, 0, 1, 1, 0, 2, 2],
                [2, 2, 0, 1, 1, 0, 2, 2],
                [8, 8, 8, 8, 8, 8, 8, 8]
            ],
            //Stage 4
            [
                [1, 2, 3, 4, 8, 5, 6, 7],
                [1, 2, 3, 8, 4, 5, 6, 7],
                [1, 2, 3, 4, 8, 5, 6, 7],
                [1, 2, 3, 8, 4, 5, 6, 7],
                [1, 2, 3, 4, 8, 5, 6, 7],
                [1, 2, 3, 8, 4, 5, 6, 7],
                [1, 2, 3, 4, 8, 5, 6, 7],
                [1, 2, 3, 8, 4, 5, 6, 7]
            ],
            //Stage 5 - The Metal
            [
                [8, 0, 8, 0, 8, 0, 8, 0],
                [0, 8, 0, 8, 0, 8, 0, 8],
                [8, 0, 8, 0, 8, 0, 8, 0],
                [0, 8, 0, 8, 0, 8, 0, 8],
                [8, 0, 8, 0, 8, 0, 8, 0],
                [0, 8, 0, 8, 0, 8, 0, 8],
                [8, 0, 8, 0, 8, 0, 8, 0],
                [0, 8, 0, 8, 0, 8, 0, 8]
            ]
        ]
        lives = 3;
        BREAKOUT.score = 0;
        powerupTypes = 4; //how many different powerups to choose from
        powerupChance = 0.2; //0-1, the closer to 1, the more likely to spawn a powerup when you break a tile
        paddleLeft = 69;
        paddleRight = 571;
        gameComplete = false;

        //Game physics
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.checkCollision.down = false;

        this.background = this.add.image(0, 0, 'background');

        this.scoreText = this.add.bitmapText(30, 105, 'myFont', '' + BREAKOUT.score, 20);
        this.scoreText.anchor.set(0, 0);
        this.highText = this.add.bitmapText(320, 105, 'myFont', '' + BREAKOUT.highScore, 20);
        this.livesText = this.add.bitmapText(610, 105, 'myFont', '' + lives, 20);
        this.livesText.anchor.set(1, 0);

        //hidden walls for balls
        this.walls = this.add.group();
        this.walls.enableBody = true;
        this.walls.physicsBodyType = Phaser.Physics.ARCADE;
        //
        var leftWall = this.walls.create(0, 150, 'balls');
        leftWall.width = 15;
        leftWall.height = 810;
        leftWall.body.immovable = true;
        leftWall.body.bounce.set(1);
        this.walls.add(leftWall);
        //
        var rightWall = this.walls.create(625, 150, 'balls');
        rightWall.width = 15;
        rightWall.height = 810;
        rightWall.body.immovable = true;
        rightWall.body.bounce.set(1);
        this.walls.add(rightWall);
        //
        var topWall = this.walls.create(15, 135, 'balls');
        topWall.width = 610;
        topWall.height = 15;
        topWall.body.immovable = true;
        topWall.body.bounce.set(1);
        this.walls.add(topWall);
        //
        this.walls.alpha = 0;

        this.startStage();
    },

    startStage: function () {
        currentMap = maps[BREAKOUT.currentLevel];
        ballReleased = false;
        //Each stage gets faster, and more likely to add a ball. CRAY.
        ballChance = 0.2 + BREAKOUT.currentLevel / 10;
        speedMultiplier = 1 + BREAKOUT.currentLevel / 8;

        //tiles
        this.tiles = this.add.group();
        this.tiles.enableBody = true;
        this.tiles.physicsBodyType = Phaser.Physics.ARCADE;
        var tile;

        var mapWidth = currentMap[0].length;
        var mapHeight = currentMap.length;
        //center tiles depending on map data. Max 8 wide
        var mapX = 320 - mapWidth / 2 * 76 + 39;
        for (var y = 0; y < mapHeight; y++) {
            for (var x = 0; x < mapWidth; x++) {
                var mapValue = currentMap[y][x];
                if (mapValue != 0) {
                    tile = this.tiles.create(mapX + (x * 76), 167 + (y * 32), 'tiles');
                    tile.anchor.set(0.5, 0.5);
                    tile.animations.add('anim');
                    tile.frame = mapValue - 1;
                    tile.body.bounce.set(1);
                    tile.body.immovable = true;

                    tile.lives = 1;
                    if (mapValue == 8) tile.lives++; //extra hit for metal tile
                }
            }
        }

        //Paddle
        paddle = this.add.sprite(this.world.centerX, 900, 'paddle');
        paddle.animations.add('anim');
        paddle.anchor.setTo(0.5, 0);
        this.physics.enable(paddle, Phaser.Physics.ARCADE);

        paddle.body.collideWorldBounds = true;
        paddle.body.bounce.set(1);
        paddle.body.immovable = true;

        //Initial ball
        this.balls = this.add.group();
        this.addBall(paddle.x, paddle.y - 13, 7);

        this.introText = this.add.bitmapText(this.world.centerX, this.world.centerY, 'myFont', 'Stage ' + (BREAKOUT.currentLevel + 1), 50);
        this.introText.anchor.set(0.5, 0.5);

        this.input.onDown.add(this.downResponse, this);
    },

    addBall: function (_ballX, _ballY, _ballFrame) {
        //new life, stick ball onto paddle
        if (this.balls.countLiving() === 0) {
            ballReleased = false;
        }

        var ball = this.game.make.sprite(_ballX, _ballY, 'balls');
        ball.anchor.set(0.5, 0.5);

        ball.checkWorldBounds = true;
        this.physics.enable(ball, Phaser.Physics.ARCADE);
        ball.body.collideWorldBounds = true;
        ball.body.bounce.set(1);
        ball.animations.add('anim');
        ball.frame = _ballFrame;

        ball.events.onOutOfBounds.add(this.ballLost, this);
        this.balls.add(ball);

        if (ballReleased || gameComplete) {
            //new randomized ball
            ball.body.velocity.x = (Math.round(Math.random() * 100 - 50) * speedMultiplier);
            ball.body.velocity.y = (250 + Math.round(Math.random() * 100 - 50)) * speedMultiplier;
        }
    },

    //Update
    update: function () {
        paddle.x = this.input.x;

        if (paddle.x < paddleLeft) {
            paddle.x = paddleLeft;
        }
        else if (paddle.x > paddleRight) {
            paddle.x = paddleRight;
        }

        if (ballReleased == false) {
            var ball = this.balls.children[0];
            if(ball) ball.body.x = paddle.x - 13;
        }
        else
        {
            this.physics.arcade.collide(this.balls, paddle, this.ballHitPaddle, null, this);
            this.physics.arcade.collide(this.balls, this.tiles, this.ballHitTile, null, this);
            this.physics.arcade.collide(this.balls, this.walls, this.ballHitWall, null, this);
        }
    },

    downResponse: function () {
        if (gameComplete) {
            //bit of random fun when the game is won
            this.addBall(this.world.centerX, 100, Math.floor(Math.random() * 7));
            ballReleased = true;
        }
        else if (this.tiles.countLiving() === 0)
        {
            //stage clear, next stage
            //introText.visible = true;
            this.nextStage();
        }
        else if (lives <= 0 && this.balls.countLiving() === 0)
        {
            //game over screen, reset game on down
            lives = 3;
            this.livesText.text = "" + lives;
            if (BREAKOUT.score > BREAKOUT.highScore) {
                BREAKOUT.highScore = BREAKOUT.score;
            }
            BREAKOUT.score = 0;
            this.scoreText.text = "" + BREAKOUT.score;
            BREAKOUT.currentLevel = 0;
            this.removeGame();
            this.startStage();
        }
        else if (ballReleased == false)
        {
            ballReleased = true;
            var ball = this.balls.children[0];
            ball.body.velocity.y = -300;
            ball.body.velocity.x = -75;
            //introText.visible = false;
            this.introText.destroy();
        }
    },

    ballLost: function (_ball) {
        _ball.destroy();
        if (this.balls.countLiving() === 0) {
            lives--;
            this.livesText.text = "" + lives;
            if (lives <= 0) {
                //game over!
                this.introText = this.add.bitmapText(this.world.centerX, this.world.centerY, 'myFont', 'YOU LOSE', 50);
                this.introText.anchor.set(0.5, 0.5);
            } else {
                paddle.frame = 0;
                this.addBall(paddle.x - 13, paddle.y - 13, 7);
            }
        }
    },

    ballHitWall: function (_ball, _wall){
        //add a bounce sound effect here maybe
    },

    ballHitTile: function (_ball, _tile) {
        this.addScore(10 * this.balls.countLiving());
        var tx = _tile.x;
        var ty = _tile.y;
        var tFrame = _tile.frame;

        //there is no dark grey ball. make light grey
        if (tFrame > 7) tFrame = 7;

        _tile.lives--;
        if (_tile.lives > 0) {
            //Metal block goes darker after getting hit once
            _tile.frame = 8;
        }
        else
        {
            _tile.kill();
            if (this.tiles.countLiving() > 0) {
                //spawn a random new ball?
                var rand = Math.random();
                if (ballChance > rand) {
                    this.addBall(tx, ty, tFrame);
                }
            } else {
                BREAKOUT.currentLevel++;
                this.addScore(1000);
                if (BREAKOUT.currentLevel > maps.length) {
                    //clocked!
                    this.introText = this.add.bitmapText(this.world.centerX, this.world.centerY, 'myFont', 'YOU WIN', 50);
                    this.introText.anchor.set(0.5, 0.5);
                    gameComplete = true;
                } else {
                    //next stage
                    this.nextStage();
                }
            }
        }
    },

    ballHitPaddle: function (_paddle, _ball) {
        var diff = 0;
        _paddle.frame = _ball.frame + 1;
        if (_ball.x < _paddle.x)
        {
            diff = _paddle.x - _ball.x;
            _ball.body.velocity.x = (-10 * diff);
        }
        else if (_ball.x > _paddle.x)
        {
            diff = _ball.x -_paddle.x;
            _ball.body.velocity.x = (10 * diff);
        }
        else
        {
            _ball.body.velocity.x = 2 + Math.random() * 8;
        }
    },
    
    addScore: function (_value) {
        BREAKOUT.score += _value;
        this.scoreText.text = "" + BREAKOUT.score;
        if (BREAKOUT.score > BREAKOUT.highScore) {
            BREAKOUT.highScore = BREAKOUT.score;
            this.highText.text = "" + BREAKOUT.highScore;
        }
    },

    //Removal and transitions
    nextStage: function () {
        this.removeGame();
        this.startStage();
    },
    removeGame: function () {
        if(this.introText) this.introText.destroy();
        paddle.destroy();
        this.balls.destroy();
        this.tiles.destroy();
        this.input.onDown.remove(this.downResponse, this);
	}
};