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
  speed: 25,  // 우주선의 속도
  bulletSpeed: 25 // 총알의 속도
};

let bullets = [];
let enemies = [];
let enemySpeed = 1.5;  // 적군의 속도
let score = 0;  // 점수 변수 추가
let boss = null;  // 보스 변수 추가
let bossSpawned = false;  // 보스가 등장했는지 여부를 체크하는 변수

// 점수 그리기
function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText('점수: ' + score, 10, 30);  // 점수 화면에 표시
}

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

// 보스 그리기
function drawBoss() {
  if (boss) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
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
        score += 1;  // 적을 잡을 때마다 점수 1점 증가

        if (score % 10 === 0 && !bossSpawned) {  // 점수가 10의 배수일 때 보스 추가
          addBoss();
          bossSpawned = true;  // 보스가 등장했다고 설정
        }
        break;
      }
    }

    // 총알과 보스 충돌 검사
    if (boss && bullet.x < boss.x + boss.width && bullet.x + 5 > boss.x && bullet.y < boss.y + boss.height && bullet.y + 10 > boss.y) {
      boss.health -= 1;  // 보스의 체력을 1 줄입니다.
      bullets = bullets.filter(b => b !== bullet);
      if (boss.health <= 0) {
        boss = null;  // 보스가 죽으면 보스 제거
        bossSpawned = false;  // 보스가 제거되었으므로 다시 적군 생성 시작
        score += 50;  // 보스를 처치하면 점수를 50점 추가
      }
    }
  }
}

// 적군 이동
function moveEnemies() {
  for (let enemy of enemies) {
    enemy.y += enemySpeed;  // 적군의 이동 속도 조절
  }
  // 적군이 화면 밖으로 나가면 게임 오버
  if (enemies.some(e => e.y > canvas.height)) {
    alert('게임 오버! 최종 점수는 ' + score + '점입니다.');
    document.location.reload();
  }
}

// 보스 이동
function moveBoss() {
  if (boss) {
    boss.y += enemySpeed * 0.5;  // 보스는 적군보다 느리게 이동
    // 보스가 화면 밖으로 나가면 게임 오버
    if (boss.y > canvas.height) {
      alert('게임 오버! 최종 점수는 ' + score + '점입니다.');
      document.location.reload();
    }
  }
}

// 보스 추가
function addBoss() {
  if (!boss) {  // 보스가 이미 존재하면 추가하지 않음
    boss = {
      x: canvas.width / 2 - 50,
      y: -100,
      width: 100,  // 보스의 너비
      height: 100,  // 보스의 높이
      health: 25   // 보스의 체력
    };
  }
}

// 게임 루프
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSpaceship();
  drawBullets();
  drawEnemies();
  drawBoss();  // 보스 그리기
  drawScore();  // 점수 그리기
  moveEnemies();
  moveBoss();  // 보스 이동
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
    bullet.y -= spaceship.bulletSpeed;  // 동적으로 총알의 속도를 설정합니다.
  }
  // 화면 밖으로 나간 총알 제거
  bullets = bullets.filter(b => b.y > 0);
}

setInterval(moveBullets, 1000 / 30);

// 적군 생성
function createEnemies() {
  if (!boss) {  // 보스가 존재하지 않을 때만 적군을 생성
    for (let i = 0; i < 5; i++) {
      enemies.push({
        x: Math.random() * (canvas.width - 50),
        y: Math.random() * -500
      });
    }
  }
}

createEnemies();
setInterval(createEnemies, 5000);

gameLoop();
