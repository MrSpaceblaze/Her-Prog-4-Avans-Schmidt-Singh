const db = require('../database/db')
const auth = require('../authentication/authentication')
const ApiError = require('../models/ApiError')
const Categorie = require('../models/Categorie')
const CategorieResponse = require('../models/CategorieResponse')

module.exports={
	getAll: (req,res)=>{
		db.query('SELECT * FROM categorie',(err,rows,fields)=>{
			if(err){
				res.status(500).json(new ApiError("Internal Server error",500)).end()
			}
			res.status(200).json(rows).end()
		})
	},
	postNew: (req,res)=>{
		var token = request.get('Authorization')
        var subUserID = token.substr(7)
        var decodedUserID = auth.decodeToken(subUserID)
		
		if(req.body.naam==null||req.body.beschrijving==null){
			res.status(412).json(new ApiError(
				"Een of meer properties in de request body ontbreken of zijn foutief",
				412)).end()
		}
		let query = {
			sql: 'INSERT INTO categorie(Naam,Beschrijving,UserID) VALUES (?,?,?)',
			values: [req.body.naam,req.body.beschrijving,decodedUserID.sub],
			timeout:30000
		}
		db.query(query,(err,rows,fields)=>{
			if(err){
				res.status(500).json(new ApiError("Internal Server error",500)).end()
			}
			
			query = {
				sql: 'SELECT categorie.ID,categorie.Naam,categorie.Beschrijving,user.Voornaam,user.Achternaam,Email FROM categorie JOIN user On user.ID = categorie.UserID WHERE Naam = ? AND Beschrijving = ? AND UserID = ?',
				values: [req.body.naam,req.body.beschrijving,decodedUserID.sub],
				timeout:30000
			}
			db.query(query,(err,rows,fields)=>{
				if (err){
					res.status(500).json(new ApiError("Internal Server error",500)).end()
				}
				let body = rows[0]
				res.status(200).json(new Categorie(body.ID,body.Naam,body.Beschrijving,body.Voornaam+" "+body.Achternaam,body.Email)).end()
			})
		})
	},
	getByID: (req,res)=>{
		console.log(req.params.categorieID)
		var token = req.get('Authorization')
        var subUserID = token.substr(7)
        var decodedUserID = auth.decodeTokens(subUserID)
		query = {
				sql: 'SELECT categorie.ID,categorie.Naam,categorie.Beschrijving,user.Voornaam,user.Achternaam,Email FROM categorie JOIN user On user.ID = categorie.UserID WHERE categorie.ID = ?',
				values: [req.params.categorieID],
				timeout:30000
			}
			console.log(query)
			db.query(query,(err,rows,fields)=>{
				
				let body = rows[0]
				if (body == null){
					res.status(404).json(new ApiError(
				"categorie niet gevonden",
				404
				)).end()
				}
				console.log(body)
				res.status(200).json(new CategorieResponse(body.ID,body.Naam,body.Beschrijving,body.Voornaam+" "+body.Achternaam,body.Email)).end()
			})
	},
	changeByID: (req,res)=>{
		var token = req.get('Authorization')
        var subUserID = token.substr(7)
        var decodedUserID = auth.decodeTokens(subUserID)
		let body = req.body
		if(req.body.naam==null||req.body.beschrijving==null){
			res.status(412).json(new ApiError(
				"Een of meer properties in de request body ontbreken of zijn foutief",
				412
				)).end()
		}
		let query = {
			sql: 'SELECT UserID FROM categorie WHERE ID = ?',
			values: [req.params.categorieID],
			timeout: 30000
		}
		db.query(query,(err,rows,fields)=>{
			if (rows[0]==null){
				res.status(404).json(new ApiError(
				"categorie niet gevonden",
				404
				)).end()
			}
			if (rows[0].UserID != decodedUserID.sub){
				res.status(409).json(new ApiError(
				"Je mag deze data niet wijzigen",
				409
				)).end()
			}else{
				query = {
					sql: 'Update categorie SET Naam = ?, Beschrijving = ? WHERE UserID = ? AND ID = ?',
					values: [body.naam,body.beschrijving,decodedUserID.sub,req.params.categorieID],
					timeout: 30000
				}
				db.query(query,(err,rows,fields)=>{
					query = {
					sql: 'SELECT categorie.ID,categorie.Naam,categorie.Beschrijving,user.Voornaam,user.Achternaam,Email FROM categorie JOIN user On user.ID = categorie.UserID WHERE Naam = ? AND Beschrijving = ? AND UserID = ?',
					values: [req.body.naam,req.body.beschrijving,decodedUserID.sub],
					timeout:30000
					}
					db.query(query,(err,rows,fields)=>{
						let body = rows[0]
						if (body == null){
							res.status(404).json(new ApiError(
								"Categorie niet gevonden",
								404
								)).end()
						}
						res.status(200).json(
							new CategorieResponse(body.ID,body.Naam,body.Beschrijving,body.Voornaam+" "+body.Achternaam,body.Email
							)).end()
					})
				})
			}
		})
	},
	deleteByID: (req,res)=>{
		var token = req.get('Authorization')
        var subUserID = token.substr(7)
        var decodedUserID = auth.decodeTokens(subUserID)
		let query = {
			sql: 'SELECT UserID FROM categorie WHERE ID = ?',
			values: [req.params.categorieID],
			timeout: 30000
		}
		db.query(query,(err,rows,fields)=>{
			if (rows.length == 0){
				res.status(404).json(new ApiError("categorie niet gevonden",
				404)
			).end()
			}
			if (rows[0].UserID != decodedUserID.sub){
				res.status(409).json(
				new ApiError("Deze gebruiker mag deze data niet wijzigen",
				409)
			).end()
			}
			query={
				sql: 'DELETE FROM categorie WHERE ID = ?',
				values: [req.params.categorieID],
				timeout: 30000
			}
			db.query(query,(err,rows,fields)=>{
				res.status(200).json({}).end()
			})
		})
	}
}