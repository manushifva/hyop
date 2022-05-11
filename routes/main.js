const router = require('koa-router')
const eta = require('eta')

const r = router()

r.get('/', async function(ctx) {
    ctx.body = await eta.renderFile('index.html')
})

r.get('/panel', async function(ctx) {
    ctx.redirect('/panel/home')
})

r.get('/panel/:partial', async function(ctx) {
    if (ctx.session.user) {
        ctx.body = await eta.renderFile('panel.html')
    } else {
        ctx.redirect('/login')
        return
    }
})

r.get('/login', async function(ctx) {
    if (ctx.session.user) {
        ctx.redirect('/panel')
        return
    } else {
        ctx.body = await eta.renderFile('login.html')
    }
})

r.get('/qna', async function(ctx) {
    ctx.body = await eta.renderFile('qna.html')
})

module.exports = r