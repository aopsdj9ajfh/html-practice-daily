const rankList = document.getElementById('rank-list')
const scoreForm = document.getElementById('score-form')
const playerNameInput = document.getElementById('player-name')

async function loadLeaderboard() {
    try {
        const res = await fetch('/api/plane-leaderboard')
        const data = await res.json()
        rankList.innerHTML = ''
        data.forEach((item, i) => {
            const li = document.createElement('li')
            li.textContent = `${item.name} - ${item.score}分 (${item.time})`
            rankList.append(li)
        })
    }catch (err) {
        console.error('排行榜加载失败', err)
    }
}

scoreForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const name = playerNameInput.value.trim()
    if (!name) return

    const submitBtn = scoreForm.querySelector('button[type="submit"]')
    submitBtn.disabled = true
    try {
        const res = await fetch('/api/plane-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, score: parseInt(scoreEl.textContent, 10) })
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok || !data.ok) {
            throw new Error(data.message || `HTTP ${res.status}`)
        }

        playerNameInput.value = ''
        scoreForm.style.display = 'none'
        await loadLeaderboard()
    } catch (err) {
        console.error('保存失败', err)
        statusEl.textContent = `保存失败：${err.message}`
    } finally {
        submitBtn.disabled = false
    }
})


loadLeaderboard()