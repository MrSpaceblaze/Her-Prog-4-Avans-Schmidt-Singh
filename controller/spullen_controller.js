const db = require('../database/db')
const auth = require('../authentication/authentication')

module.exports={
	getAll: (req,res)=>{
		db.query('SELECT Naam,Beschrijving,Merk,Soort,Bouwjaar,categorieID FROM spullen',(err,rows,fields)=>{
			if(err){
				res.status(500).json(err).end()
			}
			let json = []
			console.log(rows)
			console.log(req.params)
			rows.forEach((row)=>{
				if (row.categorieID == req.params.categorieID){
					json.push(row)
				}
			})
			res.status(200).json(json).end()
		})
	},
	postNew: (req,res)=>{
		var token = req.get('Authorization')
        var subUserID = token.substr(7)
        var decodedUserID = auth.decodeTokens(subUserID)
		var body = req.body
		if (body.naam==null,body.beschrijving==null,body.merk==null,body.soort==null,body.bouwjaar==null){
			res.status(412).json({
				"message":"Missing Parameters",
				"code":412,
				"datetime":Date.now()
			})
		}
		db.query('SELECT ID FROM categorie WHERE ID = ?',[req.params.categorieID],(err, rows, fields)=>{
			if(req.params.categorieID!=rows[0].ID){
				res.status(404).json({
					"message":"Niet gevonden",
					"code":404,
					"datetime":Date.now()
				}).end()
			}
		})
		db.query('INSERT INTO spullen(Naam,Beschrijving,Merk,Soort,Bouwjaar,categorieID,userID) VALUES(?,?,?,?,?,?)',[body.naam,body.beschrijving,body.merk,body.soort,body.bouwjaar,req.params.categorieID,decodedUserID.sub],(err,rows,fields)=>{
			if (err){
				res.status(500).json({
					"message":"Internal server error",
					"code":500,
					"datetime":Date.now()
				})
			}
			db.query('SELECT ID,Naam,Beschrijving,Merk,Soort,Bouwjaar FROM spullen WHERE categorieID = ? AND Naam = ? AND Beschrijving = ? AND Merk = ? AND Bouwjaar = ? AND userID = ?',[req.params.categorieID,body.naam,body.beschrijving,body.bouwjaar,decodedUserID.sub],(err,rows,fields)=>{
				if (err){
					res.status(500).json({
						"message":"Internal server error",
						"code":500,
						"datetime":Date.now()
					})
				}
				res.status(200).json(rows).end()
			})
		})
		
	},
	getBySpullenID: (req,res)=>{
		db.query('SELECT * FROM spullen WHERE categorie = ? AND ID = ?',[req.params.categorieID,req.params.spullenID],(err,rows,fields)=>{
			if (rows[0]==null){
				res.status(404).json({
					"message":"Niet gevonden",
					"code":404,
					"datetime":Date.now()
				}).end()
			}
			res.status(200).json(rows[0]).end()
		})
	},
	putBySpullenID: (req, res)=>{
		if (body.naam==null,body.beschrijving==null,body.merk==null,body.soort==null,body.bouwjaar==null){
			res.status(412).json({
				"message":"Missing Parameters",
				"code":412,
				"datetime":Date.now()
			})
		}
		db.query('UPDATE spullen SET Naam = ?, Beschrijving = ?, Merk = ?, Soort = ?,Bouwjaar=? WHERE categorieID=? AND ID = ?',[req.body.naam,req.body.beschrijving,req.body.merk,req.body.soort,req.body.bouwjaar,req.params.categorieID,req.params.spullenID],(err,rows,fields)=>{
			if (err){
				res.status(500).json({
						"message":"Internal server error",
						"code":500,
						"datetime":Date.now()
					})
			}
			db.query('SELECT * FROM spullen WHERE categorie = ? AND ID = ?',[req.params.categorieID,req.params.spullenID],(err,rows,fields)=>{
				if (rows[0]==null){
					res.status(404).json({
						"message":"Niet gevonden",
						"code":404,
						"datetime":Date.now()
					}).end()
				}
				res.status(200).json(rows[0]).end()
			})
		})
	},
	deleteBySpullenID: (req,res)=>{
		var token = req.get('Authorization')
        var subUserID = token.substr(7)
        var decodedUserID = auth.decodeTokens(subUserID)
		db.query('SELECT userID FROM spulllen WHERE categorieID = ?,ID = ?',[req.params.categorieID,req.params.spullenID],(err,rows,fields)=>{
			if (err){
				res.status(500).json({
						"message":"Internal server error",
						"code":500,
						"datetime":Date.now()
					})
			}
			if (rows[0]==null){
				res.status(404).json({
					"message":"categorieID or spullenID not found",
					"code":404,
					"datetime":Date.now()
				})
			}
			if (rows[0].userID==decodedUserID.sub){
				db.query('DELETE FROM spullen WHERE categorieID = ?,ID = ?',[req.params.categorieID,req.params.spullenID],(err,rows,fields)=>{
					if (err){
						res.status(500).json({
							"message":"Internal server error",
							"code":500,
							"datetime":Date.now()
						})
					}
					res.status(200).end()
				})
			} else {
				res.status(409).json({
					"message":"Gebruiker mag deze data niet verwijderen",
					"code":409,
					"datetime":Date.now()
				})
			}
		})
	}
}