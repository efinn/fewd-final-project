

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('treat', 'assets/treat.png');
    game.load.spritesheet('cat2', 'assets/cat2.png', 32, 48);
}


var player;
var platforms;
var cursors;

var treats;
var score = 0;
var scoreText;


function create() {

    //  Enable physics - Arcade Physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    //  Add background
    game.add.sprite(0, 0, 'sky');
    
    //  Add platforms (ground and ledges) and enable physics for the group
    platforms = game.add.group();
    platforms.enableBody = true;
    
    // Define and add ground & ledges
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;
    
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    // Define player & enable physics
    player = game.add.sprite(32, game.world.height - 150, 'cat2');
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.1;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    // Add treats
    treats = game.add.group();
    treats.enableBody = true;

    for (var i = 0; i < 5; i++) {
        var treat = treats.create(i * 70, 0, 'treat');
        treat.body.gravity.y = 300;
        treat.body.bounce.y = 0.3 + Math.random() * 0.2;
        }

    // Add score
    scoreText = game.add.text(15, 15, 'score: 0', {fontSize: '32px', fill: '#000'});
    
    // Add controls
    cursors = game.input.keyboard.createCursorKeys();

}


function update() {

    // Enable collision between player and platforms
    var hitPlatform = game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(treats, platforms);
    game.physics.arcade.overlap(player, treats, collectStar, null, this);

    // Define movement
    player.body.velocity.x = 0;
    if (cursors.left.isDown)
        {
            player.body.velocity.x = - 150;
            player.animations.play('left');
        }
    else if (cursors.right.isDown)
        { 
            player.body.velocity.x = 150;
            player.animations.play('right');
        }
    else
        {
            player.animations.stop();
            player.frame = 4;
        }

    if (cursors.up.isDown && player.body.touching.down && hitPlatform)
    {
        player.body.velocity.y = -350;
    }


    function collectStar (player, treat) {
        //treat removed from screen
        treat.kill();

        //update score
        score += 1;
        scoreText.text = 'Score: ' + score;
    }
}   