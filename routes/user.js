'use strict'

// File's Modules
const config = require('../config');
const DAOUser = require('../DAOs/DAOUser');
const DAONotice = require('../DAOs/DAONotice');

const express = require('express');
const expressValidator = require('express-validator');
const mysql = require('mysql');
const path = require('path');
//const multer = require('multer');
const moment = require('moment');
const router = express.Router();

router.use(expressValidator());

const pool = mysql.createPool(config.mysqlConfig);

const yetLogIn = (request, response, next) => {
    if (!request.session.currentUser) response.redirect('/user/login');
    else next();
};

const alreadyLogIn = (request, response, next) => {
    if (request.session.currentUser) response.redirect('/user/main');
    else next();
}

// DAO's Instances
const daoUser = new DAOUser(pool);

router.get('/', (request, response, next) => {
    response.status(200);
    response.redirect('/user/login');
});

// Log in, Create Account and Logout
router.get('/login', alreadyLogIn, (request, response) => {
    response.status(200);
    response.render('login', { errorMsg : null });
});

router.post('/login', (request, response, next) => {
    daoUser.login(request.body.email + '@ucm.es', request.body.password, (err, user) => {
        if (err) next();
        else if (user) {
            request.session.currentUser = request.body.email + '@ucm.es';
            if (user['employee'] !== null) response.render('technical'); // TODO
            else response.redirect('/user/main');
        } else {
            response.status(401);
            response.render('login', { errorMsg : "Email y/o contraseña incorrectos"});
        }
    });
});

router.get('/logout', yetLogIn, (request, response) => {
    response.status(200);
    request.session.destroy();
    response.redirect('/user/login');
});

router.get('/newAccount', alreadyLogIn, (request, response) => {
    response.status(200);
    response.render('newAccount', { errorMsg : null });
});

router.post('/newAccount', (request, response, next) => {
    let user = {
        name : request.body.name,
        email : request.body.email,
        password : request.body.password,
        confirmPass : request.body.confirmPass,
        image: request.body.image,
        date : moment().format('YY/MM/DD')
    };

    if (!request.body.technical) user.profile = request.body.profile;
    else user.employee = request.body.employee;

    daoUser.insertUser(user, (err) => {
        if (err) next(err);
        else {
            request.session.currentUser = user.email;
            response.locals.user = user;
            if (user.hasOwnProperty('employee')) response.render('technical', { notices : []});
            else response.redirect('/user/main');
        }
    });

});

// Main Window
router.get('/main', yetLogIn, (request, response, next) => {
    daoUser.getNotices(request.session.currentUser, (err, notices) => {
        if (err) next(err);
        else daoUser.getUser(request.session.currentUser, (err, user) => {
            if (err) next(err);
            else {               
                const congrats = notices.filter(notice => notice.Type === 'Felicitación');
                const suggest = notices.filter(notice => notice.Type === 'Sugerencia');
                const incident = notices.filter(notice => notice.Type === 'Incidencia');

                response.locals.user = {
                    name: user.Name,
                    email : user.Email,
                    password: user.Password,
                    profile: user.Employee === null ? 'Usuario' : 'Técnico',
                    date : user.Date // Format DD-MM-YY HH-MM
                }

                response.locals.notices = notices;
                response.locals.congrats = congrats.length;
                response.locals.suggests = suggest.length;
                response.locals.incidents = incident.length;

                if (user['Employee']) response.render('technical');
                else response.render('user');
            } 
            
        });
    });
});

module.exports = { router, pool, yetLogIn };