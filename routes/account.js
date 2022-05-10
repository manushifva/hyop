require('dotenv').config()

const router = require('koa-router')
const eta = require('eta')
const vmManager = require('../vm/manager')
const user = require('../helper/user')
const db = require('../helper/db')
const ratelimit = require('koa2-ratelimit').RateLimit

const userAuth = new user()
const r = router()

const limiter = ratelimit.middleware({
    interval: 60000, // 1 minute
    max: 10,
    prefixKey: 'get/account/login' // to allow the bdd to Differentiate the endpoint 
})

r.post('/account/login', limiter, async function(ctx) {
    var body = ctx.request.body

    await userAuth.login(body.username, body.password).then(function(data) {
        if (data.status == 'success') {
            ctx.session.user = body.username
            ctx.body = {status: 'success'}
        } else {
            ctx.body = {status: 'failed', message: data.message}
        }
    })
})

r.get('/account/logout', async function(ctx) {
    delete ctx.session.user
    ctx.body = {status: 'success'}
})

r.post('/account/startapp', async function(ctx) {
    var body = ctx.request.body

    if (ctx.session.user) {
        var app = new vmManager()
        await app.start(body.app, ctx.session.user).then(function(data) {
            if (data.status == 'success') {
                ctx.body = {status: 'success', url: `${data.url}?user=${ctx.session.user}&auth=${data.token}`, port: data.port}
            } else {
                ctx.body = data
            }
        })
    } else {
        ctx.status = 403
    }
})

r.post('/account/stopapp', async function(ctx) {
    var body = ctx.request.body

    if (ctx.session.user) {
        var app = activeVM[body.port]
        if (app.user == ctx.session.user) {
            app.vm.kill()
            ctx.body = {status: 'success'}
        } else {
            ctx.status = 403
        }
    } else {
        ctx.status = 403
    }
})

r.get('/partial/:name', async function(ctx) {
    var name = ctx.params.name

    switch (name) {
        case 'start':
            await db.app.get(function() {return true}).then(async function(data) {
                ctx.body = await eta.renderFile('start.html', {list: data})
            })
    }
})

module.exports = r