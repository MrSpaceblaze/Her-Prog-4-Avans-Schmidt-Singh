const db = require('../database/db')
const auth = require('../authentication/authentication')

module.exports={
	getAll: (req,res)=>{
		let query = {
			sql: 'SELECT * FROM view_delers WHERE categorieID = ? AND spullenID = ?',
			values: [req.params.categorieID, req.params.spullenID],
			timeout:30000
		}
		db.query(query,(err,rows,fields)=>{
			if(err){
				res.status(500).json(err).end()
            }
            if(rows.length == 0) {
                let json = {
                    message: 'Niet gevonden (categorieId of spullenId bestaat niet)',
                    code: 404,
                    datetime: Date.now()
                }
                res.status(404).json(json).end()
            } else {
			    res.status(200).json(json).end()                
            }
		})
    },
    
	postNew: (req,res)=>{
        var token = request.get('Authorization')
        var subUserID = token.substr(7)
        var decodedUserID = auth.decodeToken(subUserID)

		db.query('SELECT * FROM view_delers WHERE categorieID = ? AND spullenID = ?', [req.params.categorieID, req.params.spullenID], (err, rows, fields) => {
            if(err) {
                res.status(500).json(err).end()
            }

            if(rows.length == 0) {
                let json = {
                    message: 'Niet gevonden (categorieId of spullenId bestaat niet)',
                    code: 404,
                    datetime: Date.now()
                }
                res.status(404).json(json).end()
            } else {
                db.query('SELECT * FROM view_delers WHERE categorieID = ? AND spullenID = ? AND UserID = ?', [req.params.categorieID, req.params.spullenID, decodedUserID], (err, rows, fields) => {
                    if(rows.length !== 0) {
                        let json = {
                            message: 'Conflict (Gebruiker is al aangemeld)',
                            code: 409,
                            datetime: Date.now()
                        } 
                        res.status(409).json(json).end()
                    } else {
                        db.query('INSERT INTO delers VALUES (?, ?, ?)', [req.params.categorieID, req.params.spullenID, decodedUserID], (err, rows, fields) => {
                            if(err) {
                                res.status(500).json(err).end()
                            } else {
                                db.query('SELECT Voornaam, Achternaam, Email FROM User WHERE ID = ?', [decodedUserID], (err, rows, fields) => {
                                    if(err) {
                                        res.status(500).json(err).end()
                                    } else {
                                        res.status(200).json(rows).end()
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    },
    
    deleteByID: (req, res)=>{
        var token = request.get('Authorization')
        var subUserID = token.substr(7)
        var decodedUserID = auth.decodeToken(subUserID)

        db.query('SELECT * FROM view_delers WHERE categorieID = ? AND spullenID = ?', [req.params.categorieID, req.params.spullenID], (err, rows, fields) => {
            if(err) {
                res.status(500).json(err).end()
            }
            if(rows.length == 0) {
                let json = {
                    message: 'Niet gevonden (categorieId of spullenId bestaat niet)',
                    code: 404,
                    datetime: Date.now()
                }
                res.status(404).json(json).end()
            } else {
                db.query('SELECT * FROM view_delers WHERE categorieID = ? AND spullenID = ? AND UserID = ?', [req.params.categorieID, req.params.spullenID, decodedUserID], (err, rows, fields) => {
                    if(err) {
                        res.status(500).json(err).end()
                    } else {
                        if(rows.length == 0) {
                            let json = {
                                message: 'Conflict (Gebruiker mag deze data niet verwijderen)',
                                code: 409,
                                datetime: Date.now()
                            }
                            res.status(409).json(json).end()
                        } else {
                            db.query('DELETE * FROM delers WHERE UserID = ?', [decodedUserID], (err, rows, fields) => {
                                if(err) {
                                    res.status(500).json(err).end()
                                } else {
                                    let json = {
                                        message: 'Verwijdering geslaagd',
                                        code: 200,
                                        datetime: Date.now()
                                    }
                                    res.status(200).json(json).end()
                                }
                            })
                        }
                    }
                })
            }
        })
    }
}