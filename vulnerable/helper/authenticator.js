const jwt = require('jsonwebtoken')

module.exports = function(a) {
    var authed = 0
    var auther = a

    return async function (ctx, next) {
        query = ctx.request.query
    
        ctx.session.user = undefined
        if (!ctx.session.user) {
            if (query.user && query.auth) {
                try {
                    if (jwt.verify(query.auth, auther)) {
                        ctx.session.user = query.user
                        if (process.env.ALLOW_MULTI_AUTH == 'false') {
                            auther = undefined
                            await next()
                        } else {
                            var limit = parseInt(process.env.MULTI_AUTH_NUMBER)
    
                            authed += 1
                            if (limit <= authed && limit != 0) {
                                auther = undefined
                            }
    
                            await next()
                        }
                    } else {
                        ctx.status = 403
                        return
                    }
                } catch (err) {
                    if (err.name == 'JsonWebTokenError') {
                        ctx.status = 403
                        return
                    } else {
                        console.log(err)
                    }
                }
            } else {
                ctx.status = 403
                return
            }
        } else {
            await next()
        }
    }
}