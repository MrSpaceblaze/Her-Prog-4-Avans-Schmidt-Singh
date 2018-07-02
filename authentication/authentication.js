const jwt = require('jwt-simple')
const config = require('../config.json')

function encodeToken(id) {

    const payload = {
        sub: id
    }

    return jwt.encode(payload, config.secret)
}

function decodeToken(token, callback) {
	console.log(token)
	let jtoken = token.substring(7)
    try {
        const payload = jwt.decode(jtoken, config.secret);
        callback(null, payload)
    } catch (err) {
		console.log(err)
        callback(err, null)
    }
}



module.exports = {
    encodeToken,
    decodeToken
	
}