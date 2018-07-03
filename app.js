// Require
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const auth_controller = require('./controller/auth_controller')
const categorie = require('./routes/categorie_routes');
const spullen = require('./routes/spullen_routes')
const delers = require('./routes/deler_routes')
const port = process.env.PORT || 8082

app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));

app.post('/api/login',auth_controller.login)
app.post('/api/register',auth_controller.register)
app.all('*', auth_controller.validateToken);
app.use('/api/categorie',delers)
app.use('/api',spullen)
app.use('/api/categorie',categorie)
app.all("*", (req, res) => {
    res.status(404).json({
        error: "Endpoint not found"
    }).end()
})

// Listen
console.log(port)
let server = app.listen(8082, function () {
    let host = server.address().address
    let port = server.address().port

    console.log("Listening on port " + port)
})


module.exports = server