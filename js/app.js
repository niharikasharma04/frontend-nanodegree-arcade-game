var allEnemies = [],
    TILE_WIDTH = 100,
    TILE_HEIGHT = 80,
    Player, player, Entity;

/**
 * Superclass representing the entities on the screen: Enemy, Player
 * Could be used to add more items like gems in future
 */
Entity = function(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/' + sprite + '.png';
    this.width = 101;
    this.height = 171;
    
};

Entity.prototype.setSprite = function(sprite) {
    this.sprite = sprite;
};

/**Renders entities using given images on game canvas
*/
Entity.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};

// Enemies our player must avoid
var Enemy = function(x, y, sprite) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    

    this.speed = Math.floor((Math.random() * 400) + 50);
    this.sprite = 'images/enemy-bug.png';
    Entity.call(this, x, y, sprite);
};
/**
 * Set up prototype chain so that Enemy inherits from the Entity prototype.
 */
Enemy.prototype = Object.create(Entity.prototype);

Enemy.prototype.constructor = Enemy;

enemy = new Enemy(-2, 60, 'enemy-bug');

Enemy.prototype.createCollection = function(x, yArray, sprite, newCollection) {
    yArray.forEach(function(val, ind, arr) {
        newCollection.push(new Enemy(x, val, sprite));
    });
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

Enemy.prototype.update = function(dt) {
    /* You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    //Check if enemy has reached end of the canvas. If yes, reset it to some random 
    //negative number, so that enemy starts again from left of the canvas.
    */
    this.x = this.x < 550 ? this.x + this.speed * dt : -(Math.floor(Math.random() * 50) + 30);
    this.checkCollision(player.x, player.y, this.x, this.y);
    
};
//Store enemy objects in allEnemies array
enemy.createCollection(-2, [60, 150, 220, 150], 'enemy-bug', allEnemies);

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Check if player hits a bug. Reduce a life and reset player's position
Enemy.prototype.checkCollision = function(playerX, playerY, enemyX, enemyY) {
    // if within 40 x and 20 y of each other, collision happened
    if ((playerX >= enemyX - 40 && playerX <= enemyX + 40) &&
        (playerY >= enemyY - 20 && playerY <= enemyY + 20)) {
        player.renew(-1);
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
/**In future, user could be provided with alternate player images to choose from
*/
Player = function(x, y, sprite) {
    Entity.call(this, x, y, sprite);
    this.sprite = 'images/char-boy.png';
    this.isMoving = false;
    this.direction = 'up';
    this.score = 0;
    this.lives = 5;
    this.status = 'playing'; // Possible: "lostGame", "won", "died"
};
Player.prototype = Object.create(Entity.prototype);

Player.prototype.constructor = Player;

player = new Player(200, 380, 'images/char-boy.png');

//Reset player's position after collision
Player.prototype.reset = function() {
    this.x = 200;
    this.y = 380;
    this.isMoving = false;
    this.status = 'playing';
    
};

//Displays player's remaining lives as hearts on top of screen
Player.prototype.displayLives = function() {
    var parentDiv = document.getElementById('lives'),
        span2 = document.getElementById('hearts'),
        span1 = document.createElement('span'),
        img;
    span1.id = 'hearts';
    console.log('BparentDiv=' + parentDiv);
    console.log('span1=' + span1);
    console.log('span2=' + span2);
    for (var i = 0, j = this.lives; i < j; i++) {
        img = new Image(); // HTML5 Constructor
        img.src = 'images/Heart.png';
        img.id = 'life';
        img.alt = 'Lives';
        span1.appendChild(img);
    }
    console.log('parentDiv=' + parentDiv);
    parentDiv.replaceChild(span1, span2);
};

/**Calculate score and display status whenever something happens in the game.
** Like when player reaches the water, display 'won' and adjust the scoreboard.
*/
Player.prototype.renew = function(life) {
    this.lives += life;
    this.displayLives();

    if (life > 0) {
        this.status = 'won';
        this.calculateScore(40);
    } else if (this.lives === 0) {
        this.lostGame();
        return false;
    } else {
        this.status = 'died';
        this.calculateScore(-20);
    }

    this.displayStatus();
    this.reset();  
};

Player.prototype.lostGame = function() {
    this.status = 'lost game';
    this.displayStatus();
    this.calculateScore(-50);
    this.lives = 5; //After losing game, player is reset with 5 new lives.
    this.displayLives();
    this.reset(); // Player's x & y are set to initial value
};

/**Based on current game situation display a message on top of screen. 
*/
Player.prototype.displayStatus = function() {
    var msg,
        msgDiv;


    switch (this.status) {
        case 'playing':
            msg = 'Game on!';
            break;
        case 'lost game':
            msg = 'You lost.';
            break;
        case 'won':
            msg = 'You won!';
            break;
        case 'died':
            msg = 'You died!';
            break;

    }
    msgDiv = document.getElementById('displayStatus');
    msgDiv.textContent = msg;
};
player.displayStatus();
Player.prototype.calculateScore = function(points) {
    this.score += points;
    this.displayScore();
};

Player.prototype.displayScore = function() {
    document.getElementById('score').textContent = 'Your score: ' + this.score;
};

/**Update player's location, so that player seems to be moving when user
** presses the arrow keys. Also, take care that player should not fall off
** the canvas.
*/
Player.prototype.update = function() {
    //console.log('in playr updt');
    var futureX = this.x,
        futureY = this.y;
    // Here we set futureY or futureX value
    if (this.isMoving) {
        switch (this.direction) {
            case 'up':
                futureY -= futureY === 60 && this.status !== 'won' ? 59 : TILE_HEIGHT;
                break;
            case 'right':
                futureX += TILE_WIDTH;
                break;
            case 'down':
                futureY += TILE_HEIGHT;
                break;
            case 'left':
                futureX -= TILE_WIDTH;
                break;
        }
        // Now update player
        if (futureY > 402 || futureY < 0) { // Will fall off top of canvas, so don't move.
            this.isMoving = false;
            return false;
        } else if (futureX > 400 || futureX < 0) { // Will fall off sides of canvas, so don't move.
            this.isMoving = false;
            return false;
        } else if (futureY === 1) { // Player reached water and has won!
            this.y = futureY;
            this.renew(1); 
        } else { // Otherwise, they can be moved, so update location.
            this.x = futureX;
            this.y = futureY;
            this.isMoving = false;
        }
    }
};




player.displayLives();

player.displayStatus();

Player.prototype.handleInput = function(keyDirection) {
    this.isMoving = true;
    this.direction = keyDirection;
};



// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
console.log('in app end');