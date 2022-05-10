const cb = require('cakebase')
const path = require('path')

var dbs = {}
dbs.app = cb(path.join(__dirname, '../db/app.json'))
dbs.user = cb(path.join(__dirname, '../db/user.json'))

module.exports = dbs 