const mysql = require('mysql2')
require('dotenv').config()

const connection = mysql.createConnection(process.env.DATABASE_URL)

connection.connect((err) => {
    if (err) {
        console.error("Connection failed ")
        return;
    }
    console.log('MySql connected')
})



module.exports = connection