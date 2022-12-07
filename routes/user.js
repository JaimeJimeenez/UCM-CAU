'use strict'

// File's Modules
const config = require('../config');
const DAOUser = require('../DAOs/DAOUser');
const DAONotice = require('../DAOs/DAONotice');

const express = require('express');
const expressValidator = require('express-validator');
const mysql = require('mysql');
const path = require('path');
const multer = require('multer');
const moment = require('moment');
const router = express.Router();

const multerFactory = multer({ storage : multer.memoryStorage() });

router.use(expressValidator());
router.use(express.json());
router.use()
router.use((request, response, next) => {
    response.locals.user = request.session.user;
    next();
});

const pool = mysql.createPool(config.mysqlConfig);

const yetLogIn = (request, response, next) => {
    if (!request.session.user) response.redirect('/user/login');
    else next();
};

const alreadyLogIn = (request, response, next) => {
    if (request.session.user) response.redirect('/user/main');
    else next();
}

// DAO's Instances
const daoUser = new DAOUser(pool);
const daoNotice = new DAONotice(pool);

// ------------------------------------------
router.get('/', (request, response) => {
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
        if (err) next(err);
        else if (user) {
            request.session.user = user;
            response.redirect('/user/main');
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

router.post('/newAccount', multerFactory.single('image'), (request, response, next) => {
    let user = {
        Name : request.body.name,
        Email : request.body.email,
        Password : request.body.password,
        ConfirmPass : request.body.confirmPass,
        Image: null,
        Date : moment().format('YY/MM/DD')
    };

    if (request.file) user.Image = request.file.buffer;

    if (!request.body.technical) user.Profile = request.body.profile;
    else user.Employee = request.body.employee;

    daoUser.insertUser(user, (err, id) => {
        if (err) next(err);
        else {
            user.Id = id;
            request.session.user = user;
            response.redirect('/user/main');
        }
    });

});

router.get('/image/:id', (request, response) => {
    let id = Number(request.params.id);
    if (isNaN(id)) {
        response.status(400);
        response.end('Petición incorrecta');
    } else {
        daoUser.getImage(id, (err, image) => {
            if (image) response.end(image);
            else {
                response.status(404);
                response.end('Not found');
            }
        });
    }
});

// Main Window
router.get('/main', yetLogIn, (request, response, next) => {
    response.status(200);
    daoUser.getUser(request.session.user.Email, (err, user) => {
        if (err) next(err);
        else {
            daoUser.getNotices(user.Email, (err, notices) => {
                const congrats = notices.filter(notice => notice.Type === 'Felicitación');
                const suggests = notices.filter(notice => notice.Type === 'Sugerencia');
                const incidents = notices.filter(notice => notice.Type === 'Incidencia');

                response.locals.notices = notices;
                response.locals.congrats = congrats.length;
                response.locals.suggests = suggests.length;
                response.locals.incidents = incidents.length;

                if (user['Employee'] === null) response.render('user');
                else response.render('technical');
            });
        }
    });
});

// Management Users
router.get('/managementUser', yetLogIn, (request, response, next) => {
    response.status(200);
    daoUser.getUsers((err, users) => {
        if (err) next(err);
        else {
            console.log(users);
            response.render('technical', { users : users });
        }
    }) 
});

module.exports = { router, pool, yetLogIn };