const express = require('express')
const path = require('path')

const app = express()
const PORT = 3001

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

let leaderboard = []

app.post('/api/score', (req, res) => {
    const {name, score} = req.body
    if (!name || typeof score != 'number'){
        return res.status(400).json({ok: false, message: '姓名或分数无效'})
    }
    leaderboard.push({name, score, time: new Date().toLocaleString('zh-CN')})
    leaderboard.sort((a,b) => b.score - a.score)
    leaderboard = leaderboard.slice(0, 10)
    res.json({ok: true})
})
    app.get('/api/leaderboard', (req, res) => {
        res.json(leaderboard)
    })
    app.listen(PORT, () => {
        console.log(`贪吃蛇服务已启动: http://localhost:${PORT}`)
    })