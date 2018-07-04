const db = require('../database/db')
const auth = require('../authentication/authentication')
const ApiError = require('../models/ApiError')
const DelerResponse = require('../models/DelerResponse')

module.exports={
	getDelers: (req,res)=>{
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
                res.status(404).json(new ApiError('Niet gevonden (categorieId of spullenId bestaat niet)', 404)).end()
            } else {
                let delerArray = [];
                for(let i = 0; i < rows.length; i++) {
                    delerArray.push(new DelerResponse(rows[i].Voornaam, rows[i].Achternaam, rows[i].Email))
                }
			    res.status(200).json(delerArray).end()                
            }
		})
    },
    
	postDeler: (req,res)=>{
        var token = request.get('Authorization')
        var subUserID = token.substr(7)
        var decodedUserID = auth.decodeToken(subUserID)

		db.query('SELECT * FROM view_delers WHERE categorieID = ? AND spullenID = ?', [req.params.categorieID, req.params.spullenID], (err, rows, fields) => {
            if(err) {
                res.status(500).json(err).end()
            }

            if(rows.length == 0) {
                res.status(404).json(new ApiError('Niet gevonden (categorieId of spullenId bestaat niet)', 404)).end()
            } else {
                db.query('SELECT * FROM view_delers WHERE categorieID = ? AND spullenID = ? AND UserID = ?', [req.params.categorieID, req.params.spullenID, decodedUserID], (err, rows, fields) => {
                    if(rows.length !== 0) {
                        res.status(409).json(new ApiError('Conflict (Gebruiker is al aangemeld)', 409)).end()
                    } else {
                        db.query('INSERT INTO delers VALUES (?, ?, ?)', [req.params.categorieID, req.params.spullenID, decodedUserID], (err, rows, fields) => {
                            if(err) {
                                res.status(500).json(err).end()
                            } else {
                                db.query('SELECT Voornaam, Achternaam, Email FROM User WHERE ID = ?', [decodedUserID], (err, rows, fields) => {
                                    if(err) {
                                        res.status(500).json(err).end()
                                    } else {
                                        res.status(200).json(new DelerResponse(rows[0].Voornaam, rows[0].Achternaam, rows[0].Email)).end()
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    },
    
    deleteDeler: (req, res)=>{
        var token = request.get('Authorization')
        var subUserID = token.substr(7)
        var decodedUserID = auth.decodeToken(subUserID)

        db.query('SELECT * FROM view_delers WHERE categorieID = ? AND spullenID = ?', [req.params.categorieID, req.params.spullenID], (err, rows, fields) => {
            if(err) {
                res.status(500).json(err).end()
            }
            if(rows.length == 0) {
                res.status(404).json(new ApiError('Niet gevonden (categorieId of spullenId bestaat niet)', 404)).end()
            } else {
                db.query('SELECT * FROM view_delers WHERE categorieID = ? AND spullenID = ? AND UserID = ?', [req.params.categorieID, req.params.spullenID, decodedUserID], (err, rows, fields) => {
                    if(err) {
                        res.status(500).json(err).end()
                    } else {
                        if(rows.length == 0) {
                            res.status(409).json(new ApiError('Conflict (Gebruiker mag deze data niet verwijderen)', 409)).end()
                        } else {
                            db.query('DELETE * FROM delers WHERE UserID = ?', [decodedUserID], (err, rows, fields) => {
                                if(err) {
                                    res.status(500).json(err).end()
                                } else {
                                    res.status(200).json(new ApiError('Verwijdering geslaagd', 200)).end()
                                }
                            })
                        }
                    }
                })
            }
        })
    }
}