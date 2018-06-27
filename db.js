const mysql = require('mysql')
const config = require('./config/config')

const connectionSettings = {
    host: process.env.DB_HOST || config.dbHost,
    user: process.env.DB_USER || config.dbUser,
    password: config.dbPassword || process.env.DB_PASSWORD ,
    database: process.env.DB_DATABASE || config.dbDatabase,
    port: config.dbPort,
    debug: false
}

console.log(config.dbHost, config.dbPassword, config.dbUser, config.dbPort)
const reconnectTimeout = 2000

let connection

// http://sudoall.com/node-js-handling-mysql-disconnects/
function handleDisconnect() {
    connection = mysql.createConnection(connectionSettings)

    connection.connect(function (error) {
        if (error) {
            console.error('Error connecting to database ' + connectionSettings.database + ' on ' + connectionSettings.host + ': ' + error.message)
            connection.end()
            setTimeout(handleDisconnect, reconnectTimeout)
        } else {
            console.log('Connected to database ' + connectionSettings.database + ' on ' + connectionSettings.host + ', state = ' + connection.state)
        }
    })
    connection.on('error', function (error) {
        if (error.code === 'ECONNRESET') {
            console.error('Connection state = ' + connection.state + ' - reconnecting')
            connection.end()
            handleDisconnect()
        } else {
            console.error('Connection ERROR - database ' + connectionSettings.database + ' on ' + connectionSettings.host + ': ' + error.message)
            connection.end()
            handleDisconnect()
        }
    })
}

handleDisconnect()

module.exports = connection
