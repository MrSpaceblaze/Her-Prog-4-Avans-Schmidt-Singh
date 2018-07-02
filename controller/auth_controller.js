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
						"code":412,
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
                    response.status(401).json({"messsage":"niet geauthoriseerd (geen vallid token)","code":401})
                }
            }
        })
    },

    register: function (request, response) {
        let body = request.body
        let firstname = request.body.firstname
        let lastname = request.body.lastname
        let email = request.body.email
        let password = request.body.password

        query = {
            sql: 'INSERT INTO `user`(Voornaam, Achternaam, Email, Password) VALUES (?, ?, ?, ?)',
            values: [firstname, lastname, email, password],
            timeout: 3000
        }

        db.query("SELECT Email FROM user WHERE Email = ?", [email], function (err, result) {
            if (result.length > 0) {
                response.status(412).json({"messsage":"Email is al gebruikt","code":412})
                return
            } else {
		if (firstname == '' || lastname == '' || email == '' || password == '' || firstname == null || lastname == null || email == null || password == null) {
                    response.status(412).json({"messsage":"mist een aantal properties","code":412})
                    return
                }

                if (firstname.length < 2 || lastname.length < 2) {
                    response.status(412).json({"messsage":"mist een aantal properties","code":412})
                    return
                }

                if (!re.test(email)) {
                    response.status(412).json({"messsage":"Email klopt niet","code":412})
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
	validateToken(req, response, next) {
        let token = req.get('Authorization')||''
        let body = req.body
        if (token === '') {
            response.status(401).json({
				"message":"no token supplied"
			}).end()
            return;
        }

        auth.decodeToken(token, (err, payload) => {
            if (err) {
                response.status(401).json({"message":err})
            } else{
				next()
			}
        })
    }
}