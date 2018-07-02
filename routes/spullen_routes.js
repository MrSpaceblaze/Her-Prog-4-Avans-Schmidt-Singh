let routes = require('express').Router()
let controller = require('../controllers/spullen_controller')

routes.get('',controller.getAll)
routes.post('',controller.postNew)

routes.get('/:spullenID',controller.getBySpullenID)
routes.put('/:spullenID',controller.putBySpullenID)
routes.delete('/:spullenID',controller.deleteBySpullenID)