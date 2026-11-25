const express = require('express')
const path = require('path')

const app = express()
const PORT = 3000

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/api/articles', (req, res) => {
    res.json([
        {id: 1, title: '前端入门', tag: '前端'},
        {id: 2, title: 'Node.js接口', tag: '后端'},
        {id: 3, title: 'fetch', tag: '前后端'}
    ])
})

app.post('/api/messages', (req, res) => {
    const {name, content} = req.body
    if (!name || !content) return res.status(400).json({ok: false, message: '姓名和内容不能为空'})
    res.json({ok: true, message:`${name}说:${content}`})
})

app.listen(PORT, () => {console.log(`服务已启动: http://localhost:${PORT}`)})