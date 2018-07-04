const db = require('../database/db')
const auth = require('../authentication/authentication')
const ApiError = require('../models/ApiError')
const Ding = require('../models/Ding')
const DingResponse = require('../models/DingResponse')

module.exports={
	getAll: (req,res)=>{
		db.query('SELECT Naam,Beschrijving,Merk,Soort,Bouwjaar,categorieID FROM spullen',(err,rows,fields)=>{
			if(err){
				res.status(500).json(err).end()
			}
			let dingArray = []
			rows.forEach((row)=>{
				if (row.categorieID == req.params.categorieID){
					dingArray.push(new DingResponse(row.categorieID, row.naam, row.beschrijving, row.merk, row.soort, row.bouwjaar))
				}
			})
			res.status(200).json(dingArray).end()
		})
	},
	postNew: (req,res)=>{
		var token = req.get('Authorization')
        var subUserID = token.substr(7)
        var decodedUserID = auth.decodeTokens(subUserID)
		var body = req.body
		if (body.naam==null,body.beschrijving==null,body.merk==null,body.soort==null,body.bouwjaar==null){
			res.status(412).json(new ApiError('Missing Parameters', 412))
		}
		db.query('SELECT ID FROM categorie WHERE ID = ?',[req.params.categorieID],(err, rows, fields)=>{
			if(req.params.categorieID!=rows[0].ID){
				res.status(404).json(new ApiError('Niet gevonden', 404))
			}
		})
		db.query('INSERT INTO spullen(Naam,Beschrijving,Merk,Soort,Bouwjaar,categorieID,userID) VALUES(?,?,?,?,?,?)',[body.naam,body.beschrijving,body.merk,body.soort,body.bouwjaar,req.params.categorieID,decodedUserID.sub],(err,rows,fields)=>{
			if (err){
				res.status(500).json(new ApiError('Internal server error', 500))
			}
			db.query('SELECT ID,Naam,Beschrijving,Merk,Soort,Bouwjaar FROM spullen WHERE categorieID = ? AND Naam = ? AND Beschrijving = ? AND Merk = ? AND Bouwjaar = ? AND userID = ?',[req.params.categorieID,body.naam,body.beschrijving,body.bouwjaar,decodedUserID.sub],(err,rows,fields)=>{
				if (err){
					res.status(500).json(new ApiError('Internal server error', 500))
				}
				res.status(200).json(new DingResponse(rows[0].ID, rows[0].naam, rows[0].beschrijving, rows[0].merk, rows[0].soort, rows[0].bouwjaar)).end()
			})
		})
		
	},
	getBySpullenID: (req,res)=>{
		db.query('SELECT * FROM spullen WHERE categorie = ? AND ID = ?',[req.params.categorieID,req.params.spullenID],(err,rows,fields)=>{
		if (rows.length==0||rows==null||err){
				res.status(404).json(new ApiError('Niet gevonden', 404))
			}
			res.status(200).json(new DingResponse(rows[0].ID, rows[0].naam, rows[0].beschrijving, rows[0].merk, rows[0].soort, rows[0].bouwjaar)).end()
		})
	},
	putBySpullenID: (req, res)=>{
		if (body.naam==null,body.beschrijving==null,body.merk==null,body.soort==null,body.bouwjaar==null){
			res.status(412).json(new ApiError('Missing Parameters', 412))
		}
		db.query('UPDATE spullen SET Naam = ?, Beschrijving = ?, Merk = ?, Soort = ?,Bouwjaar=? WHERE categorieID=? AND ID = ?',[req.body.naam,req.body.beschrijving,req.body.merk,req.body.soort,req.body.bouwjaar,req.params.categorieID,req.params.spullenID],(err,rows,fields)=>{
			if (err){
				res.status(500).json(new ApiError('Internal server error', 500))
			}
			db.query('SELECT * FROM spullen WHERE categorie = ? AND ID = ?',[req.params.categorieID,req.params.spullenID],(err,rows,fields)=>{
				if (rows[0]==null){
					res.status(404).json(new ApiError('Niet gevonden', 404))
				}
				res.status(200).json(new DingResponse(rows[0].ID, rows[0].naam, rows[0].beschrijving,rows[0].merk, rows[0].soort, rows[0].bouwjaar)).end()
			})
		})
	},
	deleteBySpullenID: (req,res)=>{
		var token = req.get('Authorization')
        var subUserID = token.substr(7)
        var decodedUserID = auth.decodeTokens(subUserID)
		db.query('SELECT userID FROM spulllen WHERE categorieID = ?,ID = ?',[req.params.categorieID,req.params.spullenID],(err,rows,fields)=>{
			if (err){
				res.status(500).json(new ApiError('Internal server error', 500))
			}
			if (rows[0]==null){
				res.status(404).json(new ApiError('Niet gevonden', 404))
			}
			if (rows[0].userID==decodedUserID.sub){
				db.query('DELETE FROM spullen WHERE categorieID = ?,ID = ?',[req.params.categorieID,req.params.spullenID],(err,rows,fields)=>{
					if (err){
						res.status(500).json(new ApiError('Internal server error', 500))
					}
					res.status(200).json(new ApiError('Verwijdering geslaagd')).end()
				})
			} else {
				res.status(409).json(new ApiError('Gebruiker mag deze data niet verwijderen', 409))
			}
		})
	}
}