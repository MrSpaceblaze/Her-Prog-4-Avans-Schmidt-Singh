const db = require('../database/db')
const auth = require('../authentication/authentication')

module.exports={
	getAll: (req,res)=>{
		let query = {
			sql: 'SELECT * FROM spullen WHERE categorieID = ?',
			values: [req.params.categorieID],
			timeout:30000
		}
		db.query(query,(err,rows,fields)=>{
			if(err){
				res.status(500).json(err).end()
			}
			let json = []
			rows.forEach((row)=>{
				json.push({
					"naam":row.Naam,
					"beschrijving":row.Beschrijving,
					"merk":row.Merk,
					"soort":row.Soort,
					"bouwjaar":row.BouwJaar
				})
			})
			res.status(200).json(json).end()
		})
	},
	postNew: (req,res)=>{
		
	}
}