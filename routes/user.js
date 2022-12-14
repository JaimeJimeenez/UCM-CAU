'use strict'

// File's Modules
const config = require('../config');
const DAOUser = require('../DAOs/DAOUser');
const DAONotice = require('../DAOs/DAONotice');

const express = require('express');
const mysql = require('mysql');
const path = require('path');
const multer = require('multer');
const moment = require('moment');
const { check, validationResult } = require('express-validator');

const multerFactory = multer( { storage : multer.memoryStorage() });
const router = express.Router();

const pool = mysql.createPool(config.mysqlConfig);

// Dao's Instances
const daoUser = new DAOUser(pool);
const daoNotice = new DAONotice(pool);

// Middlewares
const yetLogIn = (request, response, next) => {
    if (!request.session.user) response.redirect('/user/login');
    else next();
};

const alreadyLogIn = (request, response, next) => {
    if (request.session.user) response.redirect('/notices/myNotices');
    else next();
};

// Checks Validators
const isAnUCMEmail = (param) => {
    console.log(param);
    return param.endsWith('@ucm.es');
};

// --------------------------
router.use((request, response, next) => {
    response.locals.user = request.session.user;
    next();
});

router.get('/', (request, response) => {
    response.status(200);
    response.redirect('/user/login');
});

router.get('/login', alreadyLogIn, (request, response) => {
    response.status(200);
    response.render('login', { errorMsg : null });
});

router.post('/login', alreadyLogIn, (request, response, next) => {
    response.status(200);
    daoUser.login(request.body.email + '@ucm.es', request.body.password, (err, user) => {
        if (err) next(err);
        else if (user.Active) {
            let currentUser = {
                id : user.Id,
                name : user.Name,
                email : user.Email,
                password : user.Password,
                profile : user.Profile,
                employee : user.Employee,
                date : moment(user.Date).format('DD/MM/YYYY'),
                image : user.Image
            };

            request.session.user = currentUser;
            response.redirect('/notices/myNotices');
        } else if (!user.Active) {
            response.status(401);
            response.render('login', { errorMsg : 'El usuario ha sido eliminado. Contacta con el centro para más información.' });
        }
        else {
            response.status(401);
            response.render('login', { errorMsg : 'Email y/o contraseña incorrectos' });
        }
    });
});

router.get('/logout', yetLogIn, (request, response) => {
    request.session.destroy();
    response.redirect('/user/login');
});

router.get('/signIn', alreadyLogIn, (request, response) => {
    response.status(200);
    response.render('signIn', { errors : [] });
});

router.post('/signIn', multerFactory.single('image'), (request, response) => {
    let user = {
        email : request.body.email,
        name : request.body.name,
        password: request.body.password,
        profile : request.body.profile,
        image : null,
        date: moment().format('YY-MM-DD')
    };
    
    if (request.file) user.image = request.file.buffer;
    if (request.body.technical === 'on') user.employee = request.body.nEmployee;

    daoUser.insertUser(user, (err) => {
        if (err) console.log(err);
        else response.redirect('/user/login');
    }); 
});

router.get('/image', yetLogIn, (request, response, next) => {
    let id = request.session.user.id;
    if (isNaN(id)) {
        response.status(400);
        response.end('Petición incorrecta');
    } else daoUser.getImage(id, (err, image) => {
        if (err) next(err);
        else if (image) response.end(image);
    });
});

router.get('/managementUsers', yetLogIn, (request, response, next) => {
    response.status(200);

    daoUser.getNotices(request.session.user.email, (err, notices) => {
        if (err) next(err);
        else daoUser.getUsers(request.session.user.email, (err, users) => {
            if (err) next(err);
            else { 
                notices.map(notice => notice.Date = moment(notice.Date).format('DD/MM/YYYY'));
                users.map(user => user.Date = moment(user.Date).format('DD/MM/YYYY'));
                response.render('managementUsers', { notices : notices, users : users });
            }
        });
    });
});

router.get('/deleteUser/:id', yetLogIn, (request, response, next) => {
    response.status(200);

    daoUser.deleteUser(request.params.id, (err) => {
        if (err) next(err);
        else response.redirect('/user/managementUsers');
    });
});

module.exports = { router, pool, yetLogIn };