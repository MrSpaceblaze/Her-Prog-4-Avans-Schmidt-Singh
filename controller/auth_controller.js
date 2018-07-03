const auth = require('../authentication/authentication');
const db = require('../database/db')
var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

module.exports = {

    login: function (request, response) {

        let email = request.body.email;
        let password = request.body.password;

        db.query('SELECT email, password FROM user WHERE email = ?', [email], function (error, rows, fields) {
            if (error) {
                response.status(500).json(new ApiError("Internal Server error",500))
            }

            console.log(rows)

            if (email == rows[0].email && password == rows[0].password) {
                let token = auth.encodeToken(email);
                response.status(200).json(new ValidToken(token,email)));
            } else {
                if (!rows[0]) {
                    response.status(412).json(new ApiError(
				"Een of meer properties in de request body ontbreken of zijn foutief",
				412)
					)
                } else if (email == rows[0].email && password == rows[0].password) {
                    var token = auth.encodeToken(email);
                    response.status(200).json(new ValidToken(token,email))
                } else if (!re.test(email)) {
                    response.status(412).json(new ApiError(
				"Verkeerde Email",
				412)
					})
                } else {
                    response.status(401).json(new ApiError(
				"Not Authorised",
				401))
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
                response.status(412).json(new ApiError("Email is al gebruikt",412))
                return
            } else {
		if (firstname == '' || lastname == '' || email == '' || password == '' || firstname == null || lastname == null || email == null || password == null) {
                    response.status(412).json(new ApiError(
				"Een of meer properties in de request body ontbreken of zijn foutief",
				412))
                    return
                }

                if (firstname.length < 2 || lastname.length < 2) {
                    response.status(412).json(new ApiError(
				"Een of meer properties in de request body ontbreken of zijn foutief",
				412))
                    return
                }

                if (!re.test(email)) {
                    response.status(412).json(new ApiError(
				"Een of meer properties in de request body ontbreken of zijn foutief",
				412))
                    return
                }

                db.query(query, function (error, rows, field) {
                    if (error) {
                        response.status(500).json(new ApiError("Internal Server error",500))
                    } else {
                        response.status(200).json(new UserRegisterJSON(firstname,lastname,email,password))
                    }
                })
            }
        })

    },
	validateToken(req, response, next) {
        let token = req.get('Authorization')||''
        let body = req.body
        if (token === '') {
            response.status(401).json(new ApiError("no token supplied",401)).end()
            return;
        }

        auth.decodeToken(token, (err, payload) => {
            if (err) {
                response.status(401).json(new ApiError(err,401))
            } else{
				next()
			}
        })
    }
}