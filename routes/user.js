'use strict'

// File's Modules
const config = require('../config');
const DAOUser = require('../DAOs/DAOUser');
const DAONotice = require('../DAOs/DAONotice');
//const signUpValidator = require('../validators/user');

const express = require('express');
const mysql = require('mysql');
const path = require('path');
const multer = require('multer');
const moment = require('moment');

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
                date : user.Date,
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

router.get('/signUp', alreadyLogIn, (request, response) => {
    response.status(200);
    response.render('signUp');
});

router.post('/newAccount', multerFactory.single('image'), (request, response, next) => {
    response.status(200);

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

router.get('/getTechnicals', yetLogIn, (request, response, next) => {
    response.status(200);

    daoUser.getTechnicals((err, technicals) => {
        if (err) {
            response.status(400);
            response.end();
        }
        else response.json({ technicals : technicals });
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