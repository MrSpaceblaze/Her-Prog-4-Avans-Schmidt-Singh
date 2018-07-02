const auth = require('../authentication/authentication');
const db = require('../database/db')
var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

module.exports = {

    login: function (request, response) {

        let email = request.body.email;
        let password = request.body.password;

        db.query('SELECT email, password FROM user WHERE email = ?', [email], function (error, rows, fields) {
            if (error) {
                response.status(500).json(error)
            }

            console.log(rows)

            if (email == rows[0].email && password == rows[0].password) {
                let token = auth.encodeToken(email);
                response.status(200).json({
                    "msg": token,
                    "status": 200,
                    "parameters": response.body
                });
            } else {
                if (!rows[0]) {
                    response.status(412).json({
						"msg":"Invallid error",
						"code":412
						"parameters":response.body
					})
                } else if (email == rows[0].email && password == rows[0].password) {
                    var token = auth.encodeToken(email);
                    response.status(200).json({
                        "msg": token,
                        "code": 200,
                        "parameters": response.body
                    })
                } else if (!re.test(email)) {
                    response.status(412).json({
						"msg":"Invallid error",
						"parameters":response.body
					})
                } else {
                    error.invalidCredentials(response)
                }
            }
        })
    },

    register: function (request, response) {
        var body = request.body
        var firstname = request.body.firstname
        var lastname = request.body.lastname
        var email = request.body.email
        var password = request.body.password

        query = {
            sql: 'INSERT INTO `user`(Voornaam, Achternaam, Email, Password) VALUES (?, ?, ?, ?)',
            values: [firstname, lastname, email, password],
            timeout: 3000
        }

        db.query("SELECT Email FROM user WHERE Email = ?", [email], function (err, result) {
            if (result.length > 0) {
                error.emailTaken(response)
                return
            } else {
                if (firstname == '' || lastname == '' || email == '' || password == '') {
                    error.missingProperties(response)
                    return
                }

                if (firstname.length < 2 || lastname.length < 2) {
                    error.missingProperties(response)
                    return
                }

                if (!re.test(email)) {
                    error.emailInvalid(response)
                    return
                }

                db.query(query, function (error, rows, field) {
                    if (error) {
                        response.status(500).json({
                            "msg": error,
                            "status": 500,
                            "parameters": request.body
                        })
                    } else {
                        response.status(200).json({
                            "msg": "User has been registered",
                            "status": 200,
                            "parameters": request.body
                        })
                    }
                })
            }
        })

    },
	validateToken(req, res, next) {
        let token = req.header("x-access-token") || ''
        let body = req.body
        if (token === '') {
            res.status(401).json({
				"message":"no token supplied"
			}).end()
            return;
        }

        auth.decodeToken(token, (err, payload) => {
            if (err) {
                res.status(401).json(err)
            } else {
                let query = ("SELECT isAdmin FROM customer WHERE customerID = ?")
                let values = [payload.sub]
                db.query(query, values, function (error, rows, fields) {
                    if (error) {
                        next(error)
                    } else if (rows.length > 0) {
                        req.user = payload.sub
                        req.admin = rows[0].isAdmin
                        next()
                    } else {
                        res.status(401).json({'message':'access denied','code':401,'datetime':new Date().toLocaleString()})
                    }
                })
            }
        })
    }
}