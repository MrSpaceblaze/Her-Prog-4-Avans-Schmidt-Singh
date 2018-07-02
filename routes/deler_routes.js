let routes = require('express').Router()
let controller = require('../controller/deler_controller')

routes.get('/:categorieID/spullen/spullenID/delers', controller.getDelers)
routes.post('/:categorieID/spullen/spullenID/delers', controller.postDeler)
routes.get('/:categorieID/spullen/spullenID/delers', controller.deleteDeler)

module.exports=routes