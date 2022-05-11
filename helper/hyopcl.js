process.stdout.write('\x1Bc')

const chalk = require('chalk')
const serverline = require('serverline')
const user = require('../helper/user')

class hyopCL {
    constructor (cb = null) {
        this.cb = cb
        this.commandList = [
            {
                name: 'help', 
                description: 'Displaying this text.'
            },
            {
                name: 'install',
                description: 'Installing app.',
                usage: 'install [app name]'
            }, 
            {
                name: 'uninstall',
                description: 'Uninstalling app.',
                usage: 'uninstall [app name]'
            },
            {
                name: 'listapp',
                description: 'List all of the apps.',
                usage: 'listapp [options]',
                options: [
                    {'all': 'List all of the available apps.'},
                    {'installed': 'List all of the installed apps.'},
                    {'uninstalled': 'List all of the uninstalled apps.'}
                ]
            },
            {
                name: 'listuser',
                description: 'List all of the users.',
                usage: 'listuser'
            }, 
            {
                name: 'clear',
                description: 'Clear the console.',
                usage: 'clear'
            },
            {
                name: 'register',
                description: 'Register an user.',
                usage: 'register [username] [password]'
            }, 
            {
                name: 'unregister',
                description: 'Unregister an user.',
                usage: 'unregister [username]'
            },
            {
                name: 'active',
                description: 'Get informations about active apps.',
                usage: 'active'
            }
        ]

        /*
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
        */

        this.userAuth = new user()

        var t = this
        process.on('SIGINT', function () {
            t.cb()
            process.exit(0)
        })
    }

    log(string) {
        console.log(string)
    }

    start() {
        this.log(`Welcome to ${chalk.blue('HYOP')} console.`)
        this.log(`Type ${chalk.yellow('help')} for further information.`)
        // this.listen()

        serverline.init()
        serverline.setPrompt(chalk.blue('> '))

        var t = this
        serverline.on('line', function(input) {
            if (input == 'exit') {                
                t.exit()
            } else {
                t.execute(input)
            }
          
            if (serverline.isMuted())
            serverline.setMuted(false)
        })
    }
    
    async execute(input) {
        var splitted = input.split(' ')
        var command = splitted[0]
    
        switch (command) {
            case '':
                this.log('hello')
                break
            case 'help':
                this.log(this.help())
                this.log(`\nYou also able to get more information about the usage by typing ${chalk.yellow('help [command name]')}.`)
                break
            case 'active':
                this.log(Object.keys(activeVM).length)
                break
            case 'register':
                if (splitted.length == 3) {
                    await this.userAuth.register(splitted[1], splitted[2]).then(function(data) {
                        console.log(`${data.status} registering ${splitted[1]}.`)
                    })
                } else {
                    this.log('Invalid parameter(s).')
                }
                break
            case 'unregister':
                if (splitted.length == 2) {
                    await this.userAuth.unregister(splitted[1]).then(function(data) {
                        console.log(`${data.status} unregistering ${splitted[1]}.`)
                    })
                } else {
                    this.log('Invalid parameter.')
                }
                break
            case 'listuser':
                this.userAuth.list().then(function(data) {
                    data.result.forEach(user => {
                        console.log(user.username)
                    })
                })
                break
            case 'clear':
                process.stdout.write('\x1Bc')
        }
    }

    help() {
        var result = []

        this.commandList.forEach(command => {
            result.push(`${chalk.yellow(command.name.padEnd(16))}: ${command.description}`)
        })

        return result.join('\n')
    }

    exit() {
        if (typeof this.cb == 'function') {
            this.cb()
        }
    }
}

module.exports = hyopCL