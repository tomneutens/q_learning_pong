// The pong game is represented by a grid world with 16 rows and 32 columns.
// The game is played by two players, each controlling a paddle. 
// One paddle is controlled by the computer and always moves towards the ball.
// The other paddle is controlled by the agent that learns to play the game using q-learning.

// The pong object represents the game state, the grid starts in the top-left corner.
let pong = {
    world: {
        rows: 16,
        cols: 32,
    },
    ball: { row: 0, col: 0, x_dir: 0, y_dir: 0, speed: 1 },
    computerPaddle: { row: 0, col: 0, length: 3 },
    rlPaddle: { row: 0, col: 0, length: 3 },
    score: 0,
    gameOver: false
}

// Reset the game state
function reset() {
    // Reset the ball at a random position around the center of the grid
    pong.ball.row = Math.floor(pong.world.rows / 2) + Math.floor(Math.random() * 5);
    pong.ball.col = Math.floor(pong.world.cols / 2) + Math.floor(Math.random() * 5);
    pong.ball.x_dir = Math.random() < 0.5 ? 1 : -1;
    pong.ball.y_dir = Math.random() < 0.5 ? 1 : -1;
    pong.ball.speed = 1;
    pong.computerPaddle.row = Math.floor(pong.world.rows / 2);
    pong.computerPaddle.col = pong.world.cols - 1;
    pong.rlPaddle.row = Math.floor(pong.world.rows / 2);
    pong.rlPaddle.col = 0;
    pong.score = 0;
    pong.gameOver = false;
}

// Move the computer paddle
function moveComputerPaddle() {
    if (pong.ball.row < pong.computerPaddle.row + Math.floor(pong.computerPaddle.length / 2)) {
        pong.computerPaddle.row--;
    } else if (pong.ball.row > pong.computerPaddle.row + pong.computerPaddle.length - 1 - Math.floor(pong.computerPaddle.length / 2)) {
        pong.computerPaddle.row++;
    }
}

function moveComputerPaddleUp() {
    if (pong.computerPaddle.row > 0) {
        pong.computerPaddle.row--;
    }
}

function moveComputerPaddleDown() {
    if (pong.computerPaddle.row < pong.world.rows - pong.computerPaddle.length) {
        pong.computerPaddle.row++;
    }
}


// Move the rl paddle using arrow keys
function moveRLPaddleUp() {
    if (pong.rlPaddle.row > 0) {
        pong.rlPaddle.row--;
    }
}

function moveRLPaddleDown() {
    if (pong.rlPaddle.row < pong.world.rows - pong.rlPaddle.length) {
        pong.rlPaddle.row++;
    }
}

// Move the ball
function moveBall() {
    pong.ball.row += pong.ball.y_dir * pong.ball.speed;
    pong.ball.col += pong.ball.x_dir * pong.ball.speed;
    // Bounce from top and bottom
    if (pong.ball.row <= 0 || pong.ball.row >= pong.world.rows - 1) {
        pong.ball.y_dir *= -1;
    }
    // Check if rl player has lost
    if (pong.ball.col == 0) {
        pong.gameOver = true;
    }
    // Check for collision with rl paddle
    if (pong.ball.col == pong.rlPaddle.col + 1 && pong.ball.row >= pong.rlPaddle.row && pong.ball.row < pong.rlPaddle.row + pong.rlPaddle.length) {
        pong.ball.x_dir *= -1;
        pong.score++;
    }

    // Check if computer player has lost
    if (pong.ball.col == pong.world.cols - 1) {
        pong.gameOver = true;
    }
    // Check for collision with computer paddle
    if (pong.ball.col == pong.computerPaddle.col - 1 && pong.ball.row >= pong.computerPaddle.row && pong.ball.row < pong.computerPaddle.row + pong.computerPaddle.length) {
        pong.ball.x_dir *= -1;
    }
}

// Get the canvas
let canvas = document.getElementById('pong');
let ctx = canvas.getContext('2d');


// Draw the game on the canvas with id pong
function draw() {
    // Draw a grid on the canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'white';
    for (let i = 0; i <= pong.world.rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * canvas.height / pong.world.rows);
        ctx.lineTo(canvas.width, i * canvas.height / pong.world.rows);
        ctx.stroke();
    }
    for (let i = 0; i <= pong.world.cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * canvas.width / pong.world.cols, 0);
        ctx.lineTo

        (i * canvas.width / pong.world.cols, canvas.height);
        ctx.stroke();
    }

    // Draw the ball
    ctx.fillStyle = 'white';
    ctx.fillRect(pong.ball.col * canvas.width / pong.world.cols, pong.ball.row * canvas.height / pong.world.rows, canvas.width / pong.world.cols, canvas.height / pong.world.rows);

    // Draw the computer paddle
    ctx.fillStyle = 'white';
    ctx.fillRect(pong.computerPaddle.col * canvas.width / pong.world.cols, pong.computerPaddle.row * canvas.height / pong.world.rows, canvas.width / pong.world.cols, pong.computerPaddle.length * canvas.height / pong.world.rows);

    // Draw the rl paddle
    ctx.fillStyle = 'white';
    ctx.fillRect(pong.rlPaddle.col * canvas.width / pong.world.cols, pong.rlPaddle.row * canvas.height / pong.world.rows, canvas.width / pong.world.cols, pong.rlPaddle.length * canvas.height / pong.world.rows);

    // Draw the score
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('Score: ' + pong.score, 10, 30);

    // Draw the game over message
    if (pong.gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '60px Arial';
        ctx.fillText('Game Over', 100, 300);
    }

}

// Read user input
keys = {
    ArrowUp: false,
    ArrowDown: false
};
document.addEventListener('keydown', function (event) {
    if (event.code in keys) {
        keys[event.code] = true;
    }
});
document.addEventListener('keyup', function (event) {
    if (event.code in keys) {
        keys[event.code] = false;
    }
});

// Reset the game state
reset();

// Reset the game state on spacebar
document.addEventListener('keydown', function (event) {
    if (event.code == 'Space') {
        reset();
    }
});

// The game loop
// function game(){
//     if (!pong.gameOver) {
//         // Read user input
//         if (keys.ArrowUp) {
//             console.log("up");
//             moveRLPaddleUp();
//         }
//         if (keys.ArrowDown) {
//             console.log("down")
//             moveRLPaddleDown();
//         }
//         moveBall();
//         moveComputerPaddle();
//     }
//     draw();
// }

// Run the game loop at 1 frame per second
// setInterval(function () {
//     game();
// }, 300 / 1);



// The learning rate
let alpha = 0.1;

// The discount factor
let gamma = 0.9;

// The exploration rate
let epsilon = 0.1;

// The number of episodes
let episodes = 10;

// The number of steps per episode
let steps = 1000;

// The reward for losing the game
let reward_for_loss = -100;
// The reward for hitting the ball
let reward_for_hit = 10;

// Clear the canvas
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = 'white';
ctx.font = '60px Arial';
ctx.fillText('Pong', 300, 100);




// Disable play button
document.getElementById('play').disabled = true;
document.getElementById('stopPlaying').disabled = true;

// Start game when the start button is clicked
document.getElementById('start').onclick = function () {
    // Disable play agains ai button
    document.getElementById('play').disabled = true;
    // Read the values from alpha, gamma, epsilon, episodes, and steps from the input fields
    alpha = parseFloat(document.getElementById('alpha').value);
    gamma = parseFloat(document.getElementById('gamma').value);
    epsilon = parseFloat(document.getElementById('epsilon').value);
    episodes = parseInt(document.getElementById('episodes').value);
    steps = parseInt(document.getElementById('steps').value);

    // Show the values on the canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText("Training with the following parameters:", 100, 100);
    ctx.fillText('Alpha: ' + alpha, 100, 150);
    ctx.fillText('Gamma: ' + gamma, 100, 180);
    ctx.fillText('Epsilon: ' + epsilon, 100, 210);
    ctx.fillText('Episodes: ' + episodes, 100, 240);
    ctx.fillText('Steps: ' + steps, 100, 270);

    // Disable the start button
    document.getElementById('start').disabled = true;

    window.setTimeout(learn, 2000);
    
};

// The q-learning game loop
function game(q, opponentIsComputer=true) {
    if (!pong.gameOver) {
        let state = pong.ball.row /*+ ',' + pong.ball.x_dir*/ + ',' + pong.rlPaddle.row;
        let action = q[state].indexOf(Math.max(...q[state]));

        if (action == 0) {
            moveRLPaddleUp();
        } else if (action == 2) {
            moveRLPaddleDown();
        }

        if (opponentIsComputer) {
            moveComputerPaddle();
        } else {
            if (keys.ArrowUp) {
                moveComputerPaddleUp();
            }
            if (keys.ArrowDown) {
                moveComputerPaddleDown();
            }
        }
        moveBall();
        draw();
    }
} 

// Create a Q-table that maps states to actions
// The table has the following states:
// - the row of the ball
// - the direction of the ball
// - the row of the rl paddle

// The table has the following actions:
// - move up
// - stay
// - move down
let q = {};

function learn(){
    // Initialize the Q-table with zeros
    for (let ball_row = 0; ball_row < pong.world.rows; ball_row++) {
        //for (let ball_dir = -1; ball_dir <= 1; ball_dir += 2) {
            for (let paddle_row = 0; paddle_row < pong.world.rows - pong.rlPaddle.length + 1; paddle_row++) {
                q[ball_row /*+ ',' + ball_dir*/ + ',' + paddle_row] = [0, 0, 0];
            }
        //}
    }

    let prevScore = 0;

    // The q-learning algorithm
    for (let episode = 0; episode < episodes; episode++) {
        reset();
        let ball_row = pong.ball.row;
        let ball_dir = pong.ball.x_dir;
        let paddle_row = pong.rlPaddle.row;
        for (let step = 0; step < steps; step++) {
            let state = ball_row /*+ ',' + ball_dir */+ ',' + paddle_row;
            let action;
            if (Math.random() < epsilon) {
                action = Math.floor(Math.random() * 3);
            } else {
                action = q[state].indexOf(Math.max(...q[state]));
            }
            if (action == 0) {
                moveRLPaddleUp();
            } else if (action == 2) {
                moveRLPaddleDown();
            }
            moveBall();
            moveComputerPaddle();
            let next_state = pong.ball.row /*+ ',' + pong.ball.x_dir*/ + ',' + pong.rlPaddle.row;
            let reward = 0;
            if (pong.gameOver) {
                reward = reward_for_loss;
            } else if (pong.score > prevScore) {
                prevScore = pong.score
                reward = reward_for_hit;
            }
            q[state][action] = q[state][action] + alpha * (reward + gamma * Math.max(...q[next_state]) - q[state][action]);
            ball_row = pong.ball.row;
            ball_dir = pong.ball.x_dir;
            paddle_row = pong.rlPaddle.row;
            if (pong.gameOver) {
                break;
            }
        }
    }


  

    // Reset the game and play based on the q-table
    reset();

    // Print the text "Playing" game against the computer
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '60px Arial';
    ctx.fillText('Playing', 300, 100);

    // Print the text "AI: left, Computer: right" on the canvas
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('AI: left', 200, 200);
    ctx.fillText('Computer: right', 400, 200);


    setTimeout(function(){
        // Enable stop button
        document.getElementById('stopPlaying').disabled = false;
        // Run the game loop at 10 frames per second, stop when the game is over
        let interval = setInterval(function () {
            game(q);
            if (pong.gameOver) {
                clearInterval(interval);
                // Enable start and play buttons
                document.getElementById('start').disabled = false;
                document.getElementById('play').disabled = false
                document.getElementById('stopPlaying').disabled = true;
            }
        }, 1000 / 10);
    }, 2000)
        
}

document.getElementById('stopPlaying').onclick = function () {
    pong.gameOver = true;
}

// Play against the trained AI when train button is clicked
document.getElementById('play').onclick = function () {
    // Reset the game state
    reset();
    // Disable the play and train buttons
    document.getElementById('play').disabled = true;
    document.getElementById('start').disabled = true;

    // Run the game loop at 5 frames per second, stop when the game is over
    let interval = setInterval(function () {
        game(q, false);
        if (pong.gameOver) {
            clearInterval(interval);
            // Enable the play and train buttons
            document.getElementById('play').disabled = false;
            document.getElementById('start').disabled = false;
        }
    }, 100
    );
}
