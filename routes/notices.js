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

router.get('/myNotices', (request, response, next) => {
    response.status(200);
    daoUser.getNotices(request.session.currentUser, (err, notices) => {
        if (err) next(err);
    });
    console.log(response.locals);
    response.redirect('/user/main');
});

module.exports = { router };