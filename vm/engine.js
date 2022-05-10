require('dotenv').config()

var os = require('os')
const vm2 = require('vm2').NodeVM
const path = require('path')
const fs = require('fs')
const sfs = require('sandboxed-fs')
const xfs = require('fs-extra')
const rport = require('random-port')

process.on('message', (msg) => {
    rport(async function(p) {
        var app = msg.app
        var sfsPath = path.join(__dirname, `../vulnerable/.temp/${app}-${p}`)

        fs.mkdir(sfsPath, async function (err) {
            if (err) {throw err}
            vm = new vm2({
                sandbox: {},
                require: {
                    root: [path.join(__dirname, `../vulnerable/${app}/`), path.join(__dirname, `../vulnerable/helper/`)],
                    external: true,
                    builtin: ['fs', 'path'],
                    mock: {
                        fs: sfs.bind(sfsPath),
                    }
                }, 
                env: {
                    PORT: p,
                    AUTHER: msg.secret,
                    ALLOW_MULTI_AUTH: process.env.ALLOW_MULTI_AUTH,
                    MULTI_AUTH_NUMBER: process.env.MULTI_AUTH_NUMBER
                }
            })

            if (vm) {
                await fs.readFile(path.join(__dirname, `../vulnerable/${app}/about.json`), 'utf-8', async function(err, data) {
                    parsed = JSON.parse(data)
                    await fs.readFile(path.join(__dirname, `../vulnerable/${app}/${parsed.root}`), 'utf8', async function(err, data) {
                        if (data) {                    
                            xfs.copy(path.join(__dirname, app), sfsPath, async function() {
                                var url = `http://${os.networkInterfaces().lo[0].address}:${p}${parsed.default_page}`
                                await process.send({status: 'success', port: p, url: url})

                                vm.run(data, path.join(__dirname, `../vulnerable/${app}/node_modules`))    
                            })                
                        } else {
                            process.send({status: 'failed', message: 'Failed to read the root file.'})
                            process.exit(0)
                        }
                    })
            })
            }
        })
    })
})