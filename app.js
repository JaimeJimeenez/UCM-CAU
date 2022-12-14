"use strict"

// Core's Modules
const path = require("path");
const fs = require("fs");

// Package's Modules
const mysql = require('mysql');
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const mysqlSession = require('express-mysql-session');

// File's Modules
const config = require('./config');
const index = require('./routes/index');
const user = require('./routes/user');
const notices = require('./routes/notices');

// ---------- Middleware session ----------
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore(config.mysqlConfig);

const middlewareSession = session( {
    saveUninitialized: false,
    secret: 'UCM-CAU',
    resave: false,
    store: sessionStore
});

// Create Server
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded( { extended: true }));
app.use(morgan("dev"));
app.use(express.json());

// Routes and Middlewares
app.use(middlewareSession);
app.use('/', index);
app.use('/user', user.router);
app.use('/notices', notices.router);

app.listen(config.port, () => {
    console.log("Server listening in 3000 port");
});
