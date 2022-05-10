const bcrypt = require('bcrypt')

const db = require('../helper/db')

class user {
    constructor() {
        
    }

    async login(username, password) {
        return new Promise(resolve => {
            db.user.get(obj => obj.username === username).then(function(data) {
                if (data.length != 0) {
                    data = data[0]
                    bcrypt.compare(password, data.password).then(function(isValid) {
                        if (isValid) {
                            delete data.password
                            resolve({status: 'success', data: data})
                        } else {
                            resolve({status: 'failed', message: 'Wrong password.'})
                        }
                    })
                } else {
                    resolve({status: 'failed', message: 'Wrong username.'})
                }
            })
        })
    }

    async register(username, password) {
        return new Promise(resolve => {
            if (username && password.length >= 8) {
                db.user.get(obj => obj.username === username).then(function(data) {
                    if (data.length == 0) {
                        bcrypt.hash(password, 8).then(function(result) {
                            db.user.set({username: username, password: result})
                            resolve({status: 'success'})
                        })
                    } else {
                        resolve({status: 'failed', message: 'Username already used.'})
                    }
                })
            } else {
                resolve({status: 'failed', message: 'Requirements not met.'})
            }
        })
    }

    async unregister(username) {
        return new Promise(resolve => {
            db.user.remove(obj => obj.username === username)
            resolve({status: 'success'})
        })
    }

    async list() {
        return new Promise(resolve => {
            db.user.get(function() {return true}).then(function(data) {
                resolve({status: 'success', result: data})
            })
        })
    }
}

module.exports = user