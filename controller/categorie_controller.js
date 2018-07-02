const db = require('../database/db')
const auth = require('../authentication/authentication')

module.exports={
	getAll: (req,res)=>{
		db.query('SELECT categorie.ID,categorie.Naam,categorie.Beschrijving,user.Voornaam,user.Achternaam,Email FROM categorie JOIN user On user.ID = categorie.UserID',(err,rows,fields)=>{
			if(err){
				res.status(500).json(err).end()
			}
			let json = []
			rows.forEach((row)=>{
				json.push({
					"ID":row.ID,
					"naam":row.Naam,
					"beschrijving":row.Beschrijving,
					"beheerder":row.Voornaam+" "+row.Achternaam,
					"email":row.email
				})
			})
			res.status(200).json(json).end()
		})
	},
	postNew: (req,res)=>{
		var token = req.get('Authorization')
        var subUserID = token.substr(7)
        var decodedUserID = auth.decodeTokens(subUserID)
        var decodedUserID = auth.decodeTokens(subUserID)
		
		if(req.body.naam==null||req.body.beschrijving==null){
			res.status(412).json({
				"message":"Een of meer properties in de request body ontbreken of zijn foutief",
				"code":412,
				"datetime": new Date().toLocaleString()
			}).end()
		}
		let query = {
			sql: 'INSERT INTO categorie(Naam,Beschrijving,UserID) VALUES (?,?,?)',
			values: [req.body.naam,req.body.beschrijving,decodedUserID.sub],
			timeout:30000
		}
		db.query(query,(err,rows,fields)=>{
			if(err){
				res.status(500).json(err).end()
			}
			
			query = {
				sql: 'SELECT categorie.ID,categorie.Naam,categorie.Beschrijving,user.Voornaam,user.Achternaam,Email FROM categorie JOIN user On user.ID = categorie.UserID WHERE Naam = ? AND Beschrijving = ? AND UserID = ?',
				values: [req.body.naam,req.body.beschrijving,decodedUserID.sub],
				timeout:30000
			}
			db.query(query,(err,rows,fields)=>{
				let body = rows[0]
				let returnJSON = {
					"ID":body.ID,
					"naam":body.Naam,
					"beschrijving":body.Beschrijving,
					"beheerder": body.Voornaam + " " + body.Achternaam,
					"email": body.Email
				}
				res.status(200).json(returnJSON).end()
			})
		})
	},
	
	getByID: (req,res)=>{
		var token = req.get('Authorization')
        var subUserID = token.substr(7)
        var decodedUserID = auth.decodeTokens(subUserID)
		query = {
				sql: 'SELECT categorie.ID,categorie.Naam,categorie.Beschrijving,user.Voornaam,user.Achternaam,Email FROM categorie JOIN user On user.ID = categorie.UserID WHERE categorie.ID = ?',
				values: [req.params.categorieID],
				timeout:30000
			}
			db.query(query,(err,rows,fields)=>{
				let body = rows[0]
				if (body == null){
					res.status(404).json({
				"message":"Een of meer properties in de request body ontbreken of zijn foutief",
				"code":404,
				"datetime": new Date().toLocaleString()
			}).end()
				}
				let returnJSON = {
					"ID":body.ID,
					"naam":body.Naam,
					"beschrijving":body.Beschrijving,
					"beheerder": body.Voornaam + " " + body.Achternaam,
					"email": body.Email
				}
				res.status(200).json(returnJSON).end()
			})
	},
	changeByID: (req,res)=>{
		var token = req.get('Authorization')
        var subUserID = token.substr(7)
        var decodedUserID = auth.decodeTokens(subUserID)
		let body = req.body
		if(req.body.naam==null||req.body.beschrijving==null){
			res.status(412).json({
				"message":"Een of meer properties in de request body ontbreken of zijn foutief",
				"code":412,
				"datetime": new Date().toLocaleString()
			}).end()
		}
		let query = {
			sql: 'SELECT UserID FROM categorie WHERE ID = ?',
			values: [req.params.categorieID],
			timeout: 30000
		}
		db.query(query,(err,rows,fields)=>{
			if (rows[0]==null){
				res.status(404).json({
				"message":"Een of meer properties in de request body ontbreken of zijn foutief",
				"code":404,
				"datetime": new Date().toLocaleString()
			}).end()
			}
			if (rows[0].UserID != decodedUserID.sub){
				res.status(409).json({
				"message":"Een of meer properties in de request body ontbreken of zijn foutief",
				"code":409,
				"datetime": new Date().toLocaleString()
			}).end()
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
					res.status(404).json({
				"message":"Een of meer properties in de request body ontbreken of zijn foutief",
				"code":412,
				"datetime": new Date().toLocaleString()
			}).end()
				}
				let returnJSON = {
					"ID":body.ID,
					"naam":body.Naam,
					"beschrijving":body.Beschrijving,
					"beheerder": body.Voornaam + " " + body.Achternaam,
					"email": body.Email
				}
				res.status(200).json(returnJSON).end()
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
			if (rows[0]==null){
				res.status(404).json({
				"message":"Een of meer properties in de request body ontbreken of zijn foutief",
				"code":404,
				"datetime": new Date().toLocaleString()
			}).end()
			}
			if (rows[0].UserID != decodedUserID.sub){
				res.status(409).json({
				"message":"Een of meer properties in de request body ontbreken of zijn foutief",
				"code":412,
				"datetime": new Date().toLocaleString()
			}).end()
			}
			query={
				sql: 'DELETE FROM categorie WHERE ID = ?',
				values: [req.params.categorieID],
				timeout: 30000
			}
			db.query(query,(err,rows,fields)=>{
				
			})
		})
	}
}