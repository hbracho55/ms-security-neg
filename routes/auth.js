/*
    Rutas de usuarios / auth
    host + /api/auth
*/
const { Router } = require('express')
const { check } = require('express-validator')
const router = Router()

const { createUser, loginUser, renewToken } = require('../controllers/auth')
const { fieldsValidator } = require('../middlewares/fieldsValidator')
const { jwtValidator } = require('../middlewares/jwtValidator')

router.post(
    '/register',
    [//middleware para el endpoint
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de al menos 6 caracteres').isLength({ min: 6 }),
        fieldsValidator
    ], 
    createUser
)

router.post(
    '/',
    [//middleware para el endpoint
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de al menos 6 caracteres').isLength({ min: 6 }),
        fieldsValidator
    ], 
    loginUser
)

router.get('/renew', jwtValidator, renewToken)

module.exports = router