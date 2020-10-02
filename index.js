const cors = require('cors');
const express = require('express');
require('dotenv').config();

const { dbConnection } = require('./database/config');

// Servidor express
const app = express();

// Aceptar conexiones desde cualquier lugar - CORS -
app.use(cors());

// Lectura y parseo del Body
app.use(express.json());

// Base de datos
dbConnection();

//Usuarios
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/login', require('./routes/login.routes'));

app.listen(process.env.PORT, () => {
    console.log('servidor corriendo en puerto ' + process.env.PORT);
})