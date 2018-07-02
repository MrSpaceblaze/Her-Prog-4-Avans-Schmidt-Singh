let routes = require('express').Router()
let controller = require('../controller/spullen_controller')

routes.get('/categorie/:categorieID/spullen',controller.getAll)
routes.post('/categorie/:categorieID/spullen',controller.postNew)

routes.get('/categorie/:categorieID/spullen/:spullenID',controller.getBySpullenID)
routes.put('/categorie/:categorieID/spullen/:spullenID',controller.putBySpullenID)
routes.delete('/categorie/:categorieID/spullen/:spullenID',controller.deleteBySpullenID)

module.exports=routes