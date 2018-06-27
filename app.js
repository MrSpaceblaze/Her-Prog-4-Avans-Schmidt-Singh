// Require
const express = require('express')
const app = express()
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));

app.all('*', auth_controller.validateToken);

app.all("*", (req, res) => {
    res.status(404).json({
        error: "Endpoint not found"
    }).end()
})
// Listen
let server = app.listen(8082, function () {
    let host = server.address().address
    let port = server.address().port

    console.log("Listening on port " + port)
})


module.exports = server