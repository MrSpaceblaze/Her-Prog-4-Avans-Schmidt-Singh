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
    try {
        const payload = jwt.decode(token, config.secret);
        callback(null, payload)
    } catch (err) {
		console.log(err)
        callback(err, null)
    }
}
function decodeTokens(token){
	try {
        const payload = jwt.decode(token, config.secret);
        return payload
    } catch (err) {
		console.log(err)
		return null;
    }
}



module.exports = {
    encodeToken,
    decodeToken,
	decodeTokens
	
}