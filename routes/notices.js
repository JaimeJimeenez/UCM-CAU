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

router.use(express.json());
router.use((request, response, next) => {
    response.locals.user = request.session.user;
    next();
}); 

router.get('/myNotices', userRouter.yetLogIn, (request, response, next) => {
    response.status(200);
    daoUser.getNotices(request.session.user.email, (err, notices) => {
        if (err) next(err);
        else {
            notices.map(notice => notice.Date = moment(notice.Date).format('DD/MM/YYYY'));
            response.render('myNotices', { notices : notices} );
        }
    });
});

router.get('/noticesHistory', userRouter.yetLogIn, (request, response, next) => {
    response.status(200);
    daoUser.getNotices(request.session.user.email, (err, notices) => {
        if (err) next(err);
        else {
            notices.map(notice => notice.Date = moment(notice.Date).format('DD/MM/YYYY'));
            response.locals.notices = notices;
            response.render('noticesHistory');
        }
    });
});

router.get('/incomingNotices', userRouter.yetLogIn, (request, response, next) => {
    response.status(200);
    daoUser.getNotices(request.session.user.email, (err, notices) => {
        if (err) next(err);
        else {
            notices.map(notice => notice.Date = moment(notice.Date).format('DD/MM/YYYY'));
            daoNotice.getIncomingNotices((err, incomingNotices) => {
                if (err) next(err);
                else daoUser.getTechnicals((err, technicals) => {
                    if (err) next(err);
                    else {
                        incomingNotices.map(notice => notice.Date = moment(notice.Date).format('DD/MM/YYYY'));
                        response.render('incomingNotices', { notices : notices, incomingNotices : incomingNotices, technicals : technicals });
                    }
                });
            });
        }
    });
});

router.get('/getNotice/:id', userRouter.yetLogIn, (request, response, next) => {
    response.status(200);
    let id = Number(request.params.id);
    if (!isNaN(id) && id >= 0) {
        daoNotice.getNotice(id, (err, notice) => {
            if (err) next(err);
            else daoNotice.getTechnicalByNotice(id, (err, technical) => {
                if (err) next(err);
                else {
                    notice.Date = moment(notice.Date).format('DD/MM/YYYY');
                    response.json( { notice : notice, technical : technical });
                }
            });
        });
    } else {
        response.status(400);
        response.end();
    }
});

router.get('/search', userRouter.yetLogIn, (request, response, next) => {
    response.status(200);
    daoUser.getNotices(request.session.user.email, (err, notices) => {
        if (err) next(err);
        else if (request.query.hasOwnProperty('user')) daoUser.search(request.session.user.id, request.query.search, (err, search) => {
            if (err) next(err);
            else {
                notices.map(notice => notice.Date = moment(notice.Date).format('DD/MM/YYYY'));
                search.map(search => search.Date = moment(search.Date).format('DD/MM/YYYY'));
                response.render('search', { notices : notices, search : search, searchUser : true });
            } 
        });
        else daoNotice.search(request.query.search, (err, search) => {
            if (err) next(err);
            else {
                notices.map(notice => notice.Date = moment(notice.Date).format('DD/MM/YYYY'));
                search.map(search => search.Date = moment(search.Date).format('DD/MM/YYYY'));
                response.render('search', { search : search, searchUser : false });
            }
        });
    });
});

router.post('/newNotice', userRouter.yetLogIn, (request, response, next) => {
    response.status(200);
    let notice = {
        type : request.body.type,
        function : request.body.function,
        functionType : request.body.hasOwnProperty('typeFunction') ? request.body.typeFunction : null,
        text : request.body.noticeContent,
        date : moment().format('YY-MM-DD'),
    }

    daoNotice.newNotice(request.session.user.email, notice, (err) => {
        if (err) next(err);
        else response.redirect('/notices/myNotices');
    });
});

router.post('/assignNotice', userRouter.yetLogIn, (request, response, next) => {
    response.status(200);

    daoNotice.assignNotice(request.body.technicals, request.body.numberNotice, (err) => {
        if (err) next(err);
        else response.redirect('/notices/incomingNotices');
    });
});

router.post('/finishNotice', userRouter.yetLogIn, (request, response, next) => {
    response.status(200);
    console.log(request.body);
    let id = request.body.numberNotice;
    let comment = request.body.commentNotice;
    
    daoNotice.finishNotice(id, comment, (err) => {
        if (err) next(err);
        else response.redirect('/notices/myNotices');
    });
});

router.post('/deleteNotice', userRouter.yetLogIn, (request, response, next) => {
    response.status(200);
    let id = request.body.numberNotice;
    let comment = request.body.commentNotice;
    
    daoNotice.deleteNotice(request.session.user.email, id, comment, (err) => {
        if (err) next(err);
        else response.redirect('/notices/incomingNotices');
    });
});

module.exports = { router };