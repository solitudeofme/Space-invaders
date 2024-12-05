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
  requestAnimationFrame(update);
  document.addEventListener("keydown", moveShip);
});
const update = () => {
  requestAnimationFrame(update);
  context.clearRect(0, 0, board.width, board.height);
  context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
};

const moveShip = (e) => {
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
      };
    }
  }
};
