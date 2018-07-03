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
function decodeTokens(token){
	try{
		return jwt.decode(token,config.secret)
	} catch(err){
		console.log(err)
	}
}



module.exports = {
    encodeToken,
    decodeToken,
	decodeTokens
}