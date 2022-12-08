'use strict'

// File's Modules
const config = require('../config');
const DAOUser = require('../DAOs/DAOUser');
const DAONotice = require('../DAOs/DAONotice');

const express = require('express');
const moment = require('moment');
const userRouter = require('./user');

const router = express.Router();

// DAO's Intances
const daoUser = new DAOUser(userRouter.pool);
const daoNotice = new DAONotice(userRouter.pool);

router.use((request, response, next) => {
    response.locals.user = request.session.user;
    next();
}); 

router.get('/myNotices', userRouter.yetLogIn, (request, response, next) => {
    response.status(200);
    daoUser.getNotices(request.session.user.email, (err, notices) => { 
        if (err) next(err);
        else response.render('myNotices', { notices : notices} );
    });
});

router.get('/noticesHistory', userRouter.yetLogIn, (request, response, next) => {
    response.status(200);
    daoUser.getNotices(request.session.user.email, (err, notices) => {
        if (err) next(err);
        else response.render('noticesHistory', { notices : notices });
    });
});

router.get('/incomingNotices', userRouter.yetLogIn, (request, response, next) => {
    response.status(200);
    daoUser.getNotices(request.session.user.email, (err, notices) => {
        if (err) next(err);
        else daoNotice.getIncomingNotices((err, incomingNotices) => {
            if (err) next(err);
            else response.render('incomingNotices', { incomingNotices : incomingNotices, notices : notices});
        });
    });
});

router.get('/search', userRouter.yetLogIn, (request, response, next) => {
    response.status(200);
    console.log(request.query);
    daoUser.getNotices(request.session.user.email, (err, notices) => {
        if (err) next(err);
        else if (request.query.hasOwnProperty('user')) daoUser.search(request.session.user.id, request.query.search, (err, search) => {
            if (err) next(err);
            else response.render('search', { notices : notices, search : search, searchUser : true });
        });
        else daoNotice.search(request.query.search, (err, search) => {
            if (err) next(err);
            else response.render('search', { notices : notices, search : search, searchUser : false });
        });
    });
});

module.exports = { router };