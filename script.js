"use strict";

//========== board ======
const tileSize = 32;
const rows = 16;
const cols = 16;

let board;
const boardWidth = cols * tileSize;
const boardHeight = rows * tileSize;
let context;
//============ ship =====
let shipImg;
const shipWidth = tileSize * 2;
const shipHeight = tileSize;
let shipX = (tileSize * cols) / 2 - tileSize;
let shipY = tileSize * rows - 2 * tileSize;
const ship = {
  x: shipX,
  y: shipY,
  width: shipWidth,
  height: shipHeight,
};
let shipVelocityX = tileSize;

//========== alien ==========
let alienArray = [];
const alienWidth = tileSize * 2;
const alienHeight = tileSize;
const alienX = tileSize;
const alienY = tileSize;
let alienImg;
let alienRows = 2;
let alienCols = 3;
let alienCounts = 0;
let alienVelocityX = 1;

//========= bullets ======
let bulletsArray = [];
let bulletsVelocityY = -10;
let score = 0;
let highScore = 0;
let gameOver = false;

window.addEventListener("load", () => {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  board.style.border = "7px solid white";
  context = board.getContext("2d");

  shipImg = new Image();
  shipImg.src = "./images/ship.png";
  shipImg.addEventListener("load", () => {
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
  });

  alienImg = new Image();
  alienImg.src = "./images/alien.png";
  createAliens();
  requestAnimationFrame(update);
  document.addEventListener("keydown", moveShip);
  document.addEventListener("keyup", shoot);
});

const update = () => {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);
  context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

  for (let i = 0; i < alienArray.length; i++) {
    let alien = alienArray[i];
    if (alien.alive) {
      alien.x += alienVelocityX;
      if (alien.x + alien.width >= board.width || alien.x <= 0) {
        alienVelocityX *= -1;
        alien.x += alienVelocityX * 2;
        for (let j = 0; j < alienArray.length; j++) {
          alienArray[j].y += alien.height;
        }
      }
      context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);
      if (alien.y >= ship.y) {
        gameOver = true;
        if (score > highScore) {
          highScore = score;
        }
      }
    }
  }

  for (let i = 0; i < bulletsArray.length; i++) {
    let bullet = bulletsArray[i];
    bullet.y += bulletsVelocityY;
    context.fillStyle = "white";
    context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

    for (let j = 0; j < alienArray.length; j++) {
      let alien = alienArray[j];
      if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
        bullet.used = true;
        alien.alive = false;
        alienCounts--;
        score += 100;
      }
    }
  }
  while (
    bulletsArray.length > 0 &&
    (bulletsArray[0].used || bulletsArray[0].y < 0)
  ) {
    bulletsArray.shift();
  }
  if (alienCounts === 0) {
    alienCols = Math.min(alienCols + 1, cols / 2 - 2);
    alienRows = Math.min(alienRows + 1, rows - 4);
    alienVelocityX += 0.2;
    alienArray = [];
    bulletsArray = [];
    createAliens();
  }
  context.fillStyle = "white";
  context.font = "20px courier";
  context.fillText(score, 5, 20);
  context.fillText("HIGH SCORE:", board.width - 200, 20);
  context.fillText(highScore, board.width - 70, 20);
};

const moveShip = (e) => {
  if (gameOver) {
    return;
  }
  if (e.code === "ArrowLeft" && ship.x - shipVelocityX >= 0) {
    ship.x -= shipVelocityX;
  } else if (
    e.code === "ArrowRight" &&
    ship.x + ship.width + shipVelocityX <= board.width
  ) {
    ship.x += shipVelocityX;
  }
};

const createAliens = () => {
  for (let c = 0; c < alienCols; c++) {
    for (let r = 0; r < alienRows; r++) {
      let alien = {
        img: alienImg,
        x: alienX + c * alienWidth,
        y: alienY + r * alienHeight,
        width: alienWidth,
        height: alienHeight,
        alive: true,
      };
      alienArray.push(alien);
    }
  }
  alienCounts = alienArray.length;
};

const shoot = (e) => {
  if (gameOver) {
    return;
  }
  if (e.code === "Space") {
    let bullet = {
      x: ship.x + (ship.width * 15) / 32,
      y: ship.y,
      width: tileSize / 8,
      height: tileSize / 2,
      used: false,
    };
    bulletsArray.push(bullet);
  }
};

const detectCollision = (a, b) => {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
};

const againBtn = document.getElementById("again");
againBtn.addEventListener("click", () => {
  score = 0;
  gameOver = false;
  bulletsArray = [];
  alienArray = [];
  alienRows = 1;
  alienCols = 2;
  alienCounts = 0;
  alienVelocityX = 1;
  ship.x = shipX;
});
