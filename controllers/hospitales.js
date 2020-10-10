const { response } = require('express');

const Hospital = require('../models/hospital');


const getHospitales = async (req, res = response) => {

    const hospitales = await Hospital.find()
        .populate('usuario', 'nombre img');

    res.json({
        ok: true,
        hospitales
    })
}

const crearHospital = async (req, res = response) => {

    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try {

        const hospitalDB = await hospital.save();


        res.json({
            ok: true,
            hospital: hospitalDB
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }



}

const actualizarHospital = async (req, res = response) => {
    const id = req.params.id;

    try {
        const hospital = await Hospital.findById(id);
        const uid = req.uid;

        if (!hospital) {
            res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado por ID'
            })
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, { new: true });

        res.json({
            ok: true,
            hospital: hospitalActualizado
        })
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error no controlado ' + error
        })
    }
}

const borrarHospital = async (req, res = response) => {
    const id = req.params.id;

    try {
        const hospital = await Hospital.findById(id);

        if (!hospital) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado'
            })
        }

        await Hospital.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'borrarHospital con éxito'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'borrarHospital error no controlado'
        })
    }
}



module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}