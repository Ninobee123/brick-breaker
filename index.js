document.body.innerHTML = `



<div id="score">0</div>
<div id="lives">Lives: 3</div>
<div class="grid"></div>

`;

//play music on collision
const blockHitSound = new Audio('blockHit.mp3');
const userHitSound = new Audio('paddleSound.mp3');
const winSound = new Audio('youWin.mp3');
const loseSound = new Audio('youLoose.mp3');

const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector("#score");
const livesDisplay = document.querySelector("#lives");
const blockWidth = 100;
const blockHeight = 20;
const boardWidth = 560;
const userStart = [230, 10];
let currentPosition = userStart;
const ballStart = [270, 40];
let ballCurrentPosition = ballStart;
const ballDiameter = 20;
const boardHeight = 300;
let user;
let timerId;
let xDirection = -2;
let yDirection = 2;
let score = 0;
let lives = 3; // for lives

// Create the Block class
class Block {
  constructor(x, y) {
    this.bottomLeft = [x, y];
    this.bottomRight = [x + blockWidth, y];
    this.topLeft = [x, y + blockHeight];
    this.topRight = [x + blockWidth, y + blockHeight];
  }
}

// Creating all the blocks
const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),

  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),

  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
];

// Draw all the blocks
function addBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.left = blocks[i].bottomLeft[0] + "px";
    block.style.bottom = blocks[i].bottomLeft[1] + "px";
    grid.appendChild(block);
  }
}
addBlocks();

// Add user
function addUser() {
  user = document.createElement("div");
  user.classList.add("user");
  drawUser();
  grid.appendChild(user);
}
addUser();

// Draw the user
function drawUser() {
  user.style.left = currentPosition[0] + "px";
  user.style.bottom = currentPosition[1] + "px";
}

// Draw the ball
function drawBall() {
  ball.style.left = ballCurrentPosition[0] + "px";
  ball.style.bottom = ballCurrentPosition[1] + "px";
}

// Move user
function moveUser(e) {
  switch (e.key) {
    case "a":
      if (currentPosition[0] > 0) {
        currentPosition[0] -= 10;
        drawUser();
      }
      break;

    case "d":
      if (currentPosition[0] < boardWidth - blockWidth) {
        currentPosition[0] += 10;
        drawUser();
      }
      break;
  }
}

document.addEventListener("keydown", moveUser);

// Create ball
const ball = document.createElement("div");
ball.classList.add("ball");
drawBall();
grid.appendChild(ball);

// Move the ball
function moveBall() {
  ballCurrentPosition[0] += xDirection;
  ballCurrentPosition[1] += yDirection;
  drawBall();
  checkForCollision();
  checkForGameOver();

  // Speed increase every 5 blocks hit
   if (score % 5 === 0 && score > 0) {
     xDirection *= 1.1;   //Increase speed by 10%
     yDirection *= 1.1;
   }
}
timerId = setInterval(moveBall, 20); // controls the game speed

//animation explosion
function createExplosion(x, y) {
  const explosion = document.createElement("div");
  explosion.classList.add("explosion");
  explosion.style.left = x + "px";
  explosion.style.bottom = y + "px";
  grid.appendChild(explosion);
  
  setTimeout(() => explosion.remove(), 500); // Remove explosion after 500ms
}

// Check for collision
function checkForCollision() {
  // Check for block collision
  for (let i = 0; i < blocks.length; i++) {
    if (
      ballCurrentPosition[0] >= blocks[i].bottomLeft[0] &&
      ballCurrentPosition[0] < blocks[i].bottomRight[0] &&
      (ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] &&
      ballCurrentPosition[1] < blocks[i].topLeft[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll('.block'));
      createExplosion(blocks[i].bottomLeft[0], blocks[i].bottomLeft[1]); // Create explosion on block hit
      allBlocks[i].classList.remove('block');
      blocks.splice(i, 1);
      changeDirection();
      score++;
      scoreDisplay.innerHTML = score;

      // Play block collision sound
      blockHitSound.play();

      ball.style.background = 'linear-gradient(90deg, #ff4500, #ff8c00, #ffd700, #ffffff)';

      // Check for win
      if (blocks.length === 0) {
        scoreDisplay.innerHTML = `YOU WIN! Congratulations!!!`;
        winSound.play();
        clearInterval(timerId);
        document.removeEventListener('keydown', moveUser);
      }
    }
  }

  // Check for wall collision
  if (
    ballCurrentPosition[0] >= boardWidth - ballDiameter ||
    ballCurrentPosition[1] >= boardHeight - ballDiameter ||
    ballCurrentPosition[0] <= 0
  ) {
    createExplosion(ballCurrentPosition[0], ballCurrentPosition[1]); // Create explosion on wall collision
    changeDirection();
    userHitSound.play();
  }

  // Check for user collision
  if (
    ballCurrentPosition[0] > currentPosition[0] &&
    ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
    ballCurrentPosition[1] > currentPosition[1] &&
    ballCurrentPosition[1] < currentPosition[1] + blockHeight
  ) {
    createExplosion(currentPosition[0], currentPosition[1]); // Create explosion near the paddle
    changeDirection();
  }
}

// Check for game over
function checkForGameOver() {
  if (ballCurrentPosition[1] <= 0) {
    lives--;
    livesDisplay.innerHTML = `Lives: ${lives}`;

    if (lives === 0) {
      clearInterval(timerId);
      scoreDisplay.innerHTML = `YOU LOSE!!`;
      loseSound.play();
      document.removeEventListener("keydown", moveUser);
    } else {
      // Reset ball position and continue
      ballCurrentPosition = ballStart;
      drawBall();
    }
  }
}

// Change direction
function changeDirection() {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2;
    return;
  }
  if (xDirection === 2 && yDirection === -2) {
    xDirection = -2;
    return;
  }
  if (xDirection === -2 && yDirection === -2) {
    yDirection = 2;
    return;
  }
  if (xDirection === -2 && yDirection === 2) {
    xDirection = 2;
    return;
  }
}
