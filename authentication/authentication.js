const jwt = require('jwt-simple')
const config = require('../config.json')

function encodeToken(id) {

    const payload = {
        sub: id
    }

    return jwt.encode(payload, config.secret)
}

function decodeToken(token, callback) {

    try {
        const payload = jwt.decode(token, config.secret);
        callback(null, payload)
    } catch (err) {
        callback(err, null)
    }
}



module.exports = {
    encodeToken,
    decodeToken,
	
}