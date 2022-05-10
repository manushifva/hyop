require('dotenv').config()

const koa = require('koa')
const session = require('koa-session')
const static = require('koa-static')
const body = require('koa-body')
const eta = require('eta')
const path = require('path')
const fs = require('fs')
const hyopCL = require('./helper/hyopcl')

eta.configure({
    //cache: true, // Make Eta cache templates
    views: path.join(__dirname, "views")
})

// cli
const cli = new hyopCL(cleanup)

// vm configuration
global.activeVM = {}

// main server here
const app = new koa()

// koa session
app.keys = ['some secret hurr']
const config = {
    key: 'koa.sess', /** (string) cookie key (default is koa.sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
    secure: false, /** (boolean) secure cookie*/
    sameSite: null, /** (string) session cookie sameSite options (default null, don't set it) */
}

app.use(session(config, app))
app.use(body())

// adding routes
app.use(require('./routes/main').routes())
app.use(require('./routes/account').routes())

// adding statics
app.use(static(path.join(__dirname, '/static')))

app.listen(process.env.PORT || 3000, function() {
    cli.start()
    console.log(`Server listening at ${process.env.PORT || 3000}`)
})

// on shutdown
function cleanup() {
    var keys = Object.keys(activeVM)
    for (x = 0; x <= keys.length - 1; x++) {
        activeVM[keys[x]].vm.kill()
    }

    fs.rm(path.join(__dirname, '/vulnerable/.temp'), { recursive: true }, (err) => {    
        fs.mkdir(path.join(__dirname, '/vulnerable/.temp'), function() {
            console.log('Successfully reset the .temp directory.')
            console.log('Shutdown done.')
            process.exit(0)
        })
    })
}