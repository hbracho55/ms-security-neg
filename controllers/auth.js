const { response } = require('express')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const User = require('../models/User')
const { generateJWT } = require('../helpers/jwt')

const createUser = async(req, res = response) => {

    const { email, password } = req.body

    try {
        
        let user = await User.findOne({ email })
        if ( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Email registrado.'
            })
        }
    
        user = new User( req.body )
        //Encriptar password
        const salt = bcrypt.genSaltSync()
        user.password = bcrypt.hashSync( password, salt )
        await user.save()
    
        //Generar JWT
        const token = await generateJWT( user.id, user.name )

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error al registrar.'
        })
    }
}

const loginUser = async(req, res = response) => {

    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })
        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no registrado.'
            })
        }

        //confirmar password
        const validPassword = bcrypt.compareSync( password, user.password ) 
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto.'
            })
        }

        //Generar JWT
        const token = await generateJWT( user.id, user.name )

        res.status(200).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error en login.'
        })
    }

    
}

const renewToken = async(req, res = response) => {

    const { uid, name } = req

    //Generar Token
    const token = await generateJWT( uid, name )

    res.json({
        ok: true,
        token
    })
}

module.exports = {
    createUser,
    loginUser,
    renewToken
}