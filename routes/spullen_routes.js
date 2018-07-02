let routes = require('express').Router()
let controller = require('../controller/spullen_controller')

routes.get('',controller.getAll)
routes.post('',controller.postNew)

routes.get('/:spullenID',controller.getBySpullenID)
routes.put('/:spullenID',controller.putBySpullenID)
routes.delete('/:spullenID',controller.deleteBySpullenID)

module.exports=routes