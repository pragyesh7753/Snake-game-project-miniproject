// Game Constants & Variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 5;
let lastPaintTime = 0;
let score = 0;
let snakeArr = [{ x: 13, y: 15 }];
food = { x: 6, y: 7 };

// isPaused declared globally
let isPaused = false;

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);

    if (isPaused) return; // Correct pause check

    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    if (snake[0].x >= 19 || snake[0].x <= 0 || snake[0].y >= 19 || snake[0].y <= 0) {
        return true;
    }
}

function gameEngine() {
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert("Game Over. Press 'ok' to play again!");
        snakeArr = [{ x: 13, y: 15 }];
        musicSound.play();
        score = 0;
    }

    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: 2 + Math.round(a + (b - a) * Math.random()), y: 2 + Math.round(a + (b - a) * Math.random()) };
    }

    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add('snake');
        if (index === 0) {
            snakeElement.classList.add('head');
        }
        board.appendChild(snakeElement);
    });

    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Main logic starts here
let hiscore = localStorage.getItem("hiscore");
let hiscoreval; // Declare hiscoreval here
if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscore;
}

window.requestAnimationFrame(main);

window.addEventListener('keydown', e => {
    inputDir = { x: 0, y: 1 };
    musicSound.play();
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "ArrowDown":
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case "ArrowLeft":
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "ArrowRight":
            inputDir.x = 1;
            inputDir.y = 0;
            break;
    }
});


document.getElementById('upBtn').addEventListener('click', () => {
    inputDir.x = 0;
    inputDir.y = -1;
    moveSound.play();
});

document.getElementById('downBtn').addEventListener('click', () => {
    inputDir.x = 0;
    inputDir.y = 1;
    moveSound.play();
});

document.getElementById('leftBtn').addEventListener('click', () => {
    inputDir.x = -1;
    inputDir.y = 0;
    moveSound.play();
});

document.getElementById('rightBtn').addEventListener('click', () => {
    inputDir.x = 1;
    inputDir.y = 0;
    moveSound.play();
});

document.getElementById('pauseBtn').addEventListener('click', () => {
    isPaused = !isPaused; // Toggle the global isPaused

    if (isPaused) {
        musicSound.pause();
    } else {
        musicSound.play();
    }
});

// Speed control
let savedSpeed = localStorage.getItem('speed');
if (savedSpeed !== null) {
    speed = parseInt(savedSpeed);
    document.getElementById('speedSelect').value = savedSpeed;
} else {
    localStorage.setItem('speed', speed);
}

document.getElementById('speedSelect').addEventListener('change', (event) => {
    speed = parseInt(event.target.value);
    localStorage.setItem('speed', speed);
});