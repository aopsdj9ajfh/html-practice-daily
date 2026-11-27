const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')
const scoreEl = document.getElementById('score')
const statusEl = document.getElementById('status')

let player, bullets, enemies, score,running, animId

function init() {
    player = {
        x: canvas.width/2 - 20,
        y: canvas.height - 60,
        width: 40,
        height: 60,
        speed: 6
    }
    bullets = []
    enemies = []
    score = 0
    running = false
    scoreEl.textContent = '0'
    statusEl.textContent = '按空格键开始'
    document.getElementById('score-form').style.display = 'none'
    draw()
}

function draw() {
    // 星空背景
    ctx.fillStyle = '#111174'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    // 画玩家飞机
    ctx.fillStyle = '#00ff00' 
    ctx.fillRect(player.x, player.y, player.width, player.height)
    // 机头
    ctx.fillStyle = '#00aa00'
    ctx.fillRect(player.x + 15, player.y - 10, 10, 15)
    // 画子弹
    ctx.fillStyle = '#e3e317'
    bullets.forEach(b => ctx.fillRect(b.x, b.y, 4, 12))
    // 画敌机
    ctx.fillStyle = '#ff4757'
    enemies.forEach(e => ctx.fillRect(e.x, e.y, e.width, e.height))
}

function update() {
    if (!running) return
    // 移动子弹
    bullets.forEach(b => b.y -= 8)
    bullets = bullets.filter(b => b.y > -12)
    // 生成敌机
    if (Math.random() < 0.03) {enemies.push({
        x: Math.random() * (canvas.width - 30),
        y: -30,
        width: 30,
        height: 30,
        speed: 2 + Math.random() * 2
    })}
    // 移动敌机
    enemies.forEach(e => e.y += e.speed)
    enemies = enemies.filter(e => e.y < canvas.height + 30)
    // 碰撞检测:子弹打敌机
    bullets = bullets.filter(b => {
        const hit = enemies.findIndex(e => 
            b.x < e.x + e.width && b.x > e.x &&
            b.y < e.y + e.height && b.y + 12 > e.y
        )
        if (hit !== -1) {
            enemies.splice(hit, 1)
            score += 10
            scoreEl.textContent = score
            return false
        }
        return true
    })
    // 碰撞检测: 玩家撞敌机
    const crashed = enemies.some(e => 
        player.x < e.x + e.width && player.x + player.width > e.x &&
        player.y < e.y + e.height && player.y + player.height > e.y
    ) 
    if (crashed) {
        running = false
        statusEl.textContent = `游戏结束！最终得分：${score}`
        document.getElementById('score-form').style.display = 'flex'
        return
    }
    draw()
    
}

const keys = {}
document.addEventListener('keydown', (e) => {
    if (e.key == ' ') {
        e.preventDefault()
        if (!running) {
            running = true
            statusEl.textContent = '游戏中...'
            update()
        }
    }
    keys[e.key] = true
})
document.addEventListener('keyup', (e) => {
    keys[e.key] = false
})
//移动玩家（每帧调用）
function movePlayer() {
    if (!running) return
    if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += player.speed
    if (keys['ArrowUp'] && player.y > 0) player.y -= player.speed
    if (keys['ArrowDown'] && player.y < canvas.height - player.height) player.y += player.speed
    if (keys[' ']) {
        if (bullets.length === 0 || bullets[bullets.length - 1].y < player.y - 60) {
            bullets.push({x: player.x + player.width/2 - 2, y: player.y})
        }
    }
}
//主循环
function gameLoop() {
    if (running) {
        movePlayer()
        update()
    }
    requestAnimationFrame(gameLoop)
}

document.getElementById('restart').addEventListener('click', () => {
    cancelAnimationFrame(animId)
    init()
})

init()
gameLoop()