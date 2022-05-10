const fs = require('fs')
const path = require('path')
const db = require('../helper/db')
const { exec } = require('child_process')
const async = require('async')

class appManager {
    constructor() {

    }

    async install(name) {
        await exec(`cd ${path.join(__dirname, `../vulnerable/${name}`)}; npm i`)
        await this.scan(name)
    }

    uninstall(name) {

    }

    about(name) {
        return db.app.get(obj => obj.name === name)
    }

    async scan(name = null) {
        function read(app, cb = null) {
            fs.readFile(path.join(__dirname, `../vulnerable/${app}/about.json`), 'utf-8', async function(err, data) {
                if (!err) {
                    var parsed = JSON.parse(data)
                    await db.app.get(function(isAdded) {if (isAdded.name === parsed.name) return true}).then(async function(result) {
                        await fs.exists(path.join(__dirname, `../vulnerable/${app}/node_modules`), async function(isInstalled) {
                            parsed.installed = isInstalled
                            if (result.length == 0) {
                                await db.app.set(parsed)
                                if (cb != null) {
                                    await cb()
                                }
                            } else {
                                await db.app.update(function(isAdded) {if (isAdded.name === parsed.name) return true}, parsed)
                                if (cb != null) {
                                    await cb()
                                }
                            }
                        })
                    }) 
                }
            })
        }

        if (name == null) {
            await db.app.clear()
            await fs.readdir('../vulnerable', { withFileTypes: true }, function(err, data) {
                var dir = data.filter(function(files) {if (files.isDirectory() && files.name != '.temp') return true}).map(dirent => dirent.name)
                async.eachSeries(dir, function(app, next) {
                    read(app, function() {next()})
                })
            })
        } else {
            await read(name)
        }
    }
}

var manager = new appManager()
manager.scan()