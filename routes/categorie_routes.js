let routes = require('express').Router()
let controller = require('../controllers/categorie_controller')

routes.get('*',controller.getAll)
routes.post('*',controller.postNew)

routes.get('/:categorieID',controller.getByID)
routes.put('/:categorieID',controller.changeByID)
routes.delete('/:categorieID',controller.deleteByID)

module.exports = routes