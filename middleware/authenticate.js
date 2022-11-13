const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {
    try{
        const token = req.headers.authorization.split('Bearer ')[1]
        const decode = jwt.verify(token, 'shh')

        req.user = decode
        //console.log(req.user)
        next()
    }
    catch(error){
        res.statusCode = 401;
        res.json({
            status_code : res.statusCode,
            message_user : 'Authentication Failed!'
        })
    }
}

module.exports = authenticate