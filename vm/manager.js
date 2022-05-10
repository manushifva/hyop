const { fork } = require('child_process')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const path = require('path')
const chalk = require('chalk')

class vmManager {
    constructor() {
        this.port = 0
        this.url = null
        this.token = null
    }

    start(app, user) {
        return new Promise(resolve => {
            var secret = crypto.randomBytes(64).toString('hex')
            this.token = jwt.sign(user, secret)

            this.forked = fork(path.join(__dirname, 'engine'), {silent: true})
            this.forked.send({app: app, secret: secret})

            var t = this
            this.forked.on('message', function(msg) {
                if (msg.status == 'success') {
                    activeVM[msg.port.toString()] = {vm: t, user: user}

                    t.port = msg.port
                    t.url = msg.url

                    t.forked.stdout.on('data', function(data) {
                        console.log(`${chalk.blue(`[APP ${msg.port} CONSOLE]`)} ${data.toString().replaceAll('\n', ' ')}`)
                    })

                    resolve({status: 'success', port: t.port, url: t.url, token: t.token})
                } else {
                    console.log(chalk.red(`Failed start the app: ${msg.message}`))

                    resolve({status: 'failed', message: msg.message})
                }
            })

            this.forked.on('exit', function(code) {
                if (t.port != 0) {
                    console.log(chalk.green(`[APP ${t.port} SHUTDOWNED GRACEFULLY]`))
                    delete activeVM[t.port]
                } else {
                    console.log(chalk.yellow(`[PRESTARTED ${app} APP SHUTDOWNED BEFORE STARTED]`))
                    console.log('This log is not an error, but maybe there is something wrong with it.')
                    delete activeVM[t.port]
                }
            })

            this.forked.stderr.on('data', function(data) {
                console.log(`${chalk.red(`[ERROR]`)} ${data.toString()}`)
                resolve({status: 'failed', message: data.toString()})
            })
        })
    }

    async kill() {
        this.forked.kill('SIGINT')
    }
}

module.exports = vmManager