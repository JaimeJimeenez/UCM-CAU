"use strict"

const config = require("./config");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");
const morgan = require("morgan");

const fs = require("fs");

// File's modules
const DAONotices = require("./DAO's/DAONotices");
const DAOUser = require("./DAO's/DAOUser");

// Middleware session
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore(config.mysqlConfig);

const middlewareSession = session( {
    saveUninitialized: false,
    secret: "UCM-CAU",
    resave: false,
    store: sessionStore
});

// Create Server
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded( { extended: false }));
app.use(morgan("dev"))
app.use(middlewareSession);

// Create pool's connections to the database
const pool = mysql.createPool(config.mysqlConfig);

// Create a DAOUsers instance
const daoUser = new DAOUser(pool);
const daoNotice = new DAONotices(pool);

app.get("/", (request, response) => {
    response.status(200);
    response.redirect("/login");
});

// Init Windows
app.get("/login", (request, response) => {
    response.status(200);
    response.render("login", { errorMsg : null });
});

app.get("/newAccount", (request, response) => {
    response.status(200);
    response.render("newAccount");
});

//---------- Technical and Users views ----------

// Technical
app.get("/Technical", (request, response) => {
    response.status(200);
    response.render("technical", { user : request.session.currentUser, notices : [] });
});

// User
app.get("/User", (request, response) => {
    response.status(200);
    daoUser.getNotices(request.session.currentUser, (err, notices) => {
        if (err) console.log(err);
        else response.render("user", { user: request.session.currentUser, notices : notices });
    });
});

// ---------- Log in and New Account -----------

// Log in
app.post("/loginUser", (request, response) => {
    response.status(200);

    daoUser.login(request.body.email + "@ucm.es", request.body.password, (err, result) => {
        if (err) console.log(err);
        else if (result === undefined) response.render("login", { errorMsg : "Email y/o contraseña no válidos" });
        else {
            request.session.currentUser = request.body.email + "@ucm.es";
            response.redirect("/User");
        }
    });
});

app.get("/logout", (request, response) => {
    request.session.destroy();
    response.redirect("/login");
});

// New Account
app.post("/newAccount", (request, response) => {
    response.status(200);
    console.log(request.body);
    let user = {
        name : request.body.name,
        email : request.body.email,
        password : request.body.password,
        confirmPass : request.body.confirmPass,
        profile : request.body.profile,
        date : moment().format("YY/MM/DD")
    }

    daoUser.insertUser(user, (err) => {
        if (err) console.log(err);
        else if (user.hasOwnProperty("technical")) response.redirect("/Technical");
        else response.redirect("/User");
    });
});


// --------- Notices ---------

app.get("/myNotices", (request, response) => {
    response.status(200);
});

// New Notice
app.post("/newNotice", (request, response) => {
    response.status(200);
    console.log(request.body.newNotice);
    response.redirect("/User");
});

// View Notice
app.get("/viewNotice/:id", (request, response) => {
    response.status(200);
    console.log(request.params.id);
    daoNotice.getNotice(request.params.id, (err, notice) => {
        console.log(notice);
        if (err) console.log(err);
        else response.render("user", { notice : notice } );
    });
});

// Incoming Notices
app.get("/incomingNotices", (request, response) => {
    console.log("Hola");
    response.redirect("/Technical");
});

app.listen(3000, () => {
    console.log("Server listening in 3000 port");
});

