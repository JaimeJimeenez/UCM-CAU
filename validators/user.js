'use strict'

const { check, validationResult } = require('express-validator');

const signUpValidator = [
    check('email', 'Dirección de correo no válido').isEmail().custom((value, {request}) => {
        if (!value.endsWith('@ucm.es')) throw new Error('El correo no corresponde a uno de la UCM');
        return true;
    }),
    check('name', 'Nombre vacío').notEmpty(),
    check('password', 'Tamaño no válido').isLength({ min : 6, max : 8}).custom((value, {request}) => {
        let rg = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/);
        if (value.test(rg)) throw new Error('La contraseña no es válida');
        return true;
    }),
    check('confirmPass').custom((value, { request }) => {
        if (value != request.body.password) throw new Error('Las contraseñas no coinciden');
        return true;
    }),
    check('profile').custom((value, { request }) => {
        if (!value) throw new Error('Introduce el perfil de usuario');
        return true;
    }),
    check('nEmployee').custom((value, { request}) => {
        if (request.body.technical && value.isEmpty()) throw new Error('Se necesita un número de empleado para el técnico');
        return true;
    }).custom((value , { request }) => {
        let rg = new RegExp();
        if (value.test(rg)) throw new Error('El número de empleado no es válido');
        return true;
    }),
    (request, response, next) => {
        next();
    }
];

module.exports = { signUpValidator };