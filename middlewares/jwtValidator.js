const { response } = require('express')
const jwt = require('jsonwebtoken')
const jwtValidator = (req, res = response, next) => {
    
    const token = req.header('x-token')

    if ( !token ){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la solicitud.'
        })
    }

    try {
        
        const payload = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        ) 
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido.'
        })
    }

    next()
}

module.exports = {
    jwtValidator
}