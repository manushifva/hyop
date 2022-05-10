require('dotenv').config()

const koa = require('koa')
const router = require('koa-router')
const body = require('koa-body')
const session = require('koa-session')
const views = require('koa-views')
const authenticator = require('../helper/authenticator')
const path = require('path')

const app = new koa({keys: ['hurr']})
const r = router()

app.use(body())
app.use(views(path.join(__dirname, 'views'), {extension: 'html'}))
app.use(session(app))
app.use(authenticator(process.env.AUTHER))

// main routes start here
r.get('/', async function(ctx) {
    await ctx.render('login')
})

r.post('/', async function(ctx) {
    var body = ctx.request.body
    if (body.username == 'admin' && body.password == 'hello') {
        ctx.body = 'You pass this challange!'
    } else {
        ctx.body = 'Wrong username/password'
    }
})

app.use(r.routes())
app.listen(process.env.PORT, function(err, data) {
    console.log(`App started at ${process.env.PORT}`)
})