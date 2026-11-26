const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')
const scoreEl = document.getElementById('score')
const statusEl = document.getElementById('status')

const GRID = 20
const CELL = canvas.width / GRID

let snake, direction, food, score, running, timer
let finalScore = 0

function init() {
    snake = [{x: 10, y: 10}]
    direction = {x: 0, y: 0}
    score = 0
    running = false
    scoreEl.textContent = '0'
    statusEl.textContent = '按方向键开始'
    spawnFood()
    draw()
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * GRID),
        y: Math.floor(Math.random() * GRID)
    }
    if (snake.some(s => s.x === food.x && s.y === food.y)) spawnFood()
}

function draw() {
    //清空画布
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    //画蛇
    snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0? '#00ff88' : '#00cc6a'
        ctx.fillRect(seg.x * CELL + 1,seg.y * CELL + 1, CELL - 2, CELL - 2)
    })

    //画食物
    ctx.fillStyle = '#ff4757'
    ctx.fillRect(food.x * CELL + 1, food.y * CELL + 1, CELL - 2, CELL - 2)
}

function step() {
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    }

    //撞墙或撞自己
    if (head.x < 0 || head.x >= GRID ||
        head.y < 0 || head.y >= GRID ||
        snake.some(s => s.x == head.x && s.y === head.y)) {
            running = false
            finalScore = score
            statusEl.textContent = `游戏结束！最终成绩：${score}`
            document.getElementById('score-form').style.display = 'block'
            clearInterval(timer)
            return
        }
    snake.unshift(head)

    //吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10
        scoreEl.textContent = score
        spawnFood()
    }else {
        snake.pop()
    }

    draw()
}

document.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName === 'INPUT') return

    if (!running && direction.x === 0 && direction.y === 0) {
        running = true
        statusEl.textContent = '游戏中...'
        timer = setInterval(step, 120)
    }
    switch (e.key) {
        case 'ArrowUp': if (direction.y !== 1) direction = {x: 0, y: -1}; break
        case 'ArrowDown': if (direction.y !== -1) direction = {x: 0, y: 1}; break
        case 'ArrowRight': if (direction.x !== -1) direction = {x: 1, y: 0}; break
        case 'ArrowLeft': if (direction.x !== 1) direction = {x: -1, y: 0}; break
    }
})

document.getElementById('restart').addEventListener('click', (e) => {
    e.preventDefault()
    clearInterval(timer)
    document.getElementById('score-form').style.display = 'none'
    init()
})

init()