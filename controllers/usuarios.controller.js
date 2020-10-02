const { response } = require('express');
const encriptar = require('bcryptjs');

const Usuario = require('../models/usuario.model');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {
    const usuarios = await Usuario.find({}, 'nombre email role google');

    res.json({
        OK: true,
        usuarios
    });
}

const crearUsuario = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptamos
        const salt = encriptar.genSaltSync();
        usuario.password = encriptar.hashSync(password, salt);

        await usuario.save()

        // Generar el token - JWT
        const token = await generarJWT(usuario.id);

        res.json({
            OK: true,
            usuario: usuario
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Revisad logs. ' + error
        });
    }

}

const actualizarUsuario = async (req, res = response) => {
    // TODO: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario en la base de datos'
            });
        }

        // Quito password y google
        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {
            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Ya existe usuario con dicho mail'
                });
            }
        }

        campos.email = email;


        // new: true para devolver el objeto actualizado. Si no se pasa devuelve el objeto anterior antes de la actualización
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });


        res.json({
            ok: true,
            uid,
            usuarioActualizado
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Revisad logs. ' + error
        });
    }
}

// Eliminar usuario

const eliminarUsuario = async (req, res = response) => {
    // TODO: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario en la base de datos'
            });
        }

        // new: true para devolver el objeto actualizado. Si no se pasa devuelve el objeto anterior antes de la actualización
        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Revisad logs. ' + error
        });
    }
}
module.exports = { getUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario }