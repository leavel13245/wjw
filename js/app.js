const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let spaceship = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  color: 'white',
  speed: 5
};

let bullets = [];
let enemies = [];
let enemySpeed = 2;

// 우주선 그리기
function drawSpaceship() {
  ctx.fillStyle = spaceship.color;
  ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

// 총알 그리기
function drawBullets() {
  ctx.fillStyle = 'red';
  for (let bullet of bullets) {
    ctx.fillRect(bullet.x, bullet.y, 5, 10);
  }
}

// 적군 그리기
function drawEnemies() {
  ctx.fillStyle = 'green';
  for (let enemy of enemies) {
    ctx.fillRect(enemy.x, enemy.y, 50, 50);
  }
}

// 총알과 적군 충돌 검사
function checkCollision() {
  for (let bullet of bullets) {
    for (let enemy of enemies) {
      if (
        bullet.x < enemy.x + 50 &&
        bullet.x + 5 > enemy.x &&
        bullet.y < enemy.y + 50 &&
        bullet.y + 10 > enemy.y
      ) {
        enemies = enemies.filter(e => e !== enemy);
        bullets = bullets.filter(b => b !== bullet);
        break;
      }
    }
  }
}

// 적군 이동
function moveEnemies() {
  for (let enemy of enemies) {
    enemy.y += enemySpeed;
  }
// 적군이 화면 밖으로 나가면 게임 오버
  if (enemies.some(e => e.y > canvas.height)) {
    alert('게임 오버!');
    document.location.reload();
  }
}

// 게임 루프
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSpaceship();
  drawBullets();
  drawEnemies();
  moveEnemies();
  checkCollision();

  requestAnimationFrame(gameLoop);
}

// 키보드 이벤트 처리
document.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowLeft') {
    spaceship.x = Math.max(spaceship.x - spaceship.speed, 0);
  } else if (event.code === 'ArrowRight') {
    spaceship.x = Math.min(spaceship.x + spaceship.speed, canvas.width - spaceship.width);
  } else if (event.code === 'Space') {
    bullets.push({ x: spaceship.x + spaceship.width / 2 - 2.5, y: spaceship.y });
  }
});

// 총알 이동
function moveBullets() {
  for (let bullet of bullets) {
    bullet.y -= 5;
  }
// 화면 밖으로 나간 총알 제거
  bullets = bullets.filter(b => b.y > 0);
}

setInterval(moveBullets, 1000 / 30);

// 적군 생성
function createEnemies() {
  for (let i = 0; i < 5; i++) {
    enemies.push({
      x: Math.random() * (canvas.width - 50),
      y: Math.random() * -500
    });
  }
}

createEnemies();
setInterval(createEnemies, 5000);

gameLoop();
