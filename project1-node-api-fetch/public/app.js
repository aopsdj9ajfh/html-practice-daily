const loadBtn = document.getElementById('load-btn')
const articleList = document.getElementById('article-list')
const statusEl = document.getElementById('status') 

async function LoadArticles() {
    statusEl.textContent = '加载中...'
    articleList.innerHTML = ''

    try {
        const res = await fetch('/api/articles')
        if (!res.ok) throw new Error('接口请求失败')
        
        const articles = await res.json()

        articles.forEach((item) => {
            const li = document.createElement('li')
            li.innerHTML = `${item.title} <span class="tag">${item.tag}</span>`
            articleList.appendChild(li)
        })

        statusEl.textContent = `成功获取${articles.length}条数据`
    } catch (err){
    statusEl.textContent = `加载失败: ${err.message}`
    }
}

loadBtn.addEventListener('click', LoadArticles)

const messageForm = document.getElementById('message-form')
const resultEl = document.getElementById('result')

messageForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    const name = document.getElementById('name').value.trim();
    const content = document.getElementById('content').value.trim();

    const res = await fetch(`/api/messages`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, content})
    })

    try {
        const data = await res.json()

        if (!res.ok) {
            resultEl.textContent = data.message || '提交失败'
            return
        }

        resultEl.textContent = data.message
        messageForm.reset()
    } catch (err) {
        resultEl.textContent = `请求出错: ${err.message}`
    }
})