const cors = require('cors');
const express = require('express');
require('dotenv').config();

const { dbConnection } = require('./database/config');

// Servidor express
const app = express();

// Aceptar conexiones desde cualquier lugar - CORS -
app.use(cors());

// Base de datos
dbConnection();

//Rutas
app.get('/', (req, res) => {
    console.log('Entrando al inicio del servidor');
    res.status(400).json({
        OK: true,
        msg: 'Hola mundo'
    })
});

app.listen(process.env.PORT, () => {
    console.log('servidor corriendo en puerto ' + process.env.PORT);
})