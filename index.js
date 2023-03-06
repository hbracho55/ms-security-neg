const express = require('express')
const cors = require('cors')
const { dbConnection } = require('./database/config')
require('dotenv').config()
const app = express()

//Database
dbConnection()

//CORS
app.use(cors())

//Directorio publico
app.use( express.static('public') )

//Lectura y parseo del body
app.use( express.json() )

//Rutas
app.use('/api/auth', require('./routes/auth'))
//TODO: CRUD eventos

app.listen( process.env.PORT, () => {
    console.log(`Servidor iniciado ${ process.env.PORT }`)

})