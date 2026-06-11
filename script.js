const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let box = 20;
let snake = [{ x: 10, y: 10 }];
let dir = "RIGHT";
let food = randomFood();
let score = 0;
let highscore = Number(localStorage.getItem("snakehigh") || 0);
document.getElementById("score").innerText = score;
document.getElementById("high").innerText = highscore;

function randomFood() {
  return {
    x: Math.floor(Math.random() * 20),
    y: Math.floor(Math.random() * 20),
  };
}

function drawBox(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * box, y * box, box, box);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw food
  drawBox(food.x, food.y, "#ff4d4d");

  // draw snake
  snake.forEach((segment, index) => {
    drawBox(segment.x, segment.y, index === 0 ? "#00ffae" : "#0f766e");
  });
}

function updateScore() {
  document.getElementById("score").innerText = score;
  if (score > highscore) {
    highscore = score;
    localStorage.setItem("snakehigh", highscore);
    document.getElementById("high").innerText = highscore;
  }
}

function hitsWall(head) {
  return head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20;
}

function hitsSelf(head) {
  return snake.some(
    (segment, index) =>
      index !== 0 && segment.x === head.x && segment.y === head.y,
  );
}

function moveSnake() {
  const head = { ...snake[0] };

  if (dir === "LEFT") head.x -= 1;
  if (dir === "RIGHT") head.x += 1;
  if (dir === "UP") head.y -= 1;
  if (dir === "DOWN") head.y += 1;

  if (hitsWall(head) || hitsSelf(head)) {
    resetGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 1;
    updateScore();
    food = randomFood();

    // avoid food spawning on the snake
    while (
      snake.some((segment) => segment.x === food.x && segment.y === food.y)
    ) {
      food = randomFood();
    }
  } else {
    snake.pop();
  }
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  dir = "RIGHT";
  score = 0;
  food = randomFood();
  document.getElementById("score").innerText = score;
}

function gameLoop() {
  moveSnake();
  draw();
}

function handleKey(e) {
  const key = e.key;
  if (key === "ArrowLeft" && dir !== "RIGHT") dir = "LEFT";
  if (key === "ArrowRight" && dir !== "LEFT") dir = "RIGHT";
  if (key === "ArrowUp" && dir !== "DOWN") dir = "UP";
  if (key === "ArrowDown" && dir !== "UP") dir = "DOWN";
}

window.addEventListener("keydown", handleKey);
setInterval(gameLoop, 120);

draw();
