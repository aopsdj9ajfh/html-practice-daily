const rankList = document.getElementById('rank-list')
const scoreForm = document.getElementById('score-form')
const playerNameInput = document.getElementById('player-name')


//页面加载时拉起排行榜
async function LoadLeaderboard() {
    try {
        const res = await fetch('/api/leaderboard')
        const data = await res.json()
        rankList.innerHTML = ''
        data.forEach((item, i) => {
            const li = document.createElement('li')
            li.textContent = `${item.name} - ${item.score}分 (${item.time})`
            rankList.appendChild(li)
        })
    } catch(err) {
        console.error('排行榜加载失败', err)
    }
}

//提交分数
scoreForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const name = playerNameInput.value.trim()
    if (!name) return
    try {
        await fetch('/api/score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({name, score: finalScore})
        })
    } catch (err) {
        console.error('提交分数失败', err)
        alert('分数保存失败！')
        return
    }
    playerNameInput.value = ''
    scoreForm.style.display = 'none'
    await LoadLeaderboard()
})

LoadLeaderboard()