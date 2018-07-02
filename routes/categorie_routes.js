let routes = require('express').Router()
let controller = require('../controller/categorie_controller')



routes.get('/:categorieID',controller.getByID)
routes.put('/:categorieID',controller.changeByID)
routes.delete('/:categorieID',controller.deleteByID)
routes.get('',controller.getAll)
routes.post('',controller.postNew)

module.exports = routes