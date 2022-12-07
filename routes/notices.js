'use strict'

// File's Modules
const config = require('../config');
const DAOUser = require('../DAOs/DAOUser');
const DAONotice = require('../DAOs/DAONotice');

const express = require('express');
//const multer = require('multer');
const moment = require('moment');
const userRouter = require('./user');
const router = express.Router();

// DAO's Instances
const daoUser = new DAOUser(userRouter.pool);
const daoNotice = new DAONotice(userRouter.pool);

// Log out from Notices Router
router.get('/logout', userRouter.yetLogIn, (request, response) => {
    response.status(200);
    response.redirect('/user/logout');
});

router.post('/newNotice', userRouter.yetLogIn, (request, response, next) => {
    response.status(200);
    console.log(request.body);

    let notice = {
        type : request.body.type,
        text : request.body.noticeContent,
        typeFunction : request.body.typeFunction,
        function : request.body.function,
        date : moment().format('YY-MM-DD')
    }

    daoNotice.newNotice(request.session.user.Email, notice, (err) => {
        if (err) next(err);
        else response.redirect('/user/main');
    });
});

router.get('/myNotices', (request, response, next) => {
    response.status(200);
    daoUser.getNotices(request.session.currentUser, (err, notices) => {
        if (err) next(err);
        else response.render('myNotices', { notices : notices });
    });
});

router.get('/search', userRouter.yetLogIn, (request, response, next) => {
    let search = request.query.search;
    let user = request.query.user === 'on' ? true : false;

    daoNotice.search(search, (err, notices) => {
        if (err) next(err);
        else {
            response.locals.notices = notices;
            response.redirect('/user/main');
        }
    });
});

module.exports = { router };