"use strict"

const config = require("./config");
const DAOUsers = require("./DAOUsers");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { timeStamp } = require("console");

// Create Server
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded( { extended: false }));

// Create pool's connections to the database
const pool = mysql.createPool(config.mysqlConfig);

// Create a DAOUsers instance
const daoUser = new DAOUsers(pool);

app.get("/", (request, response) => {
    response.status(200);
    response.redirect("/login");
});

// Init Windows
app.get("/login", (request, response) => {
    response.status(200);
    response.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/newAccount", (request, response) => {
    response.status(200);
    response.sendFile(path.join(__dirname, "public", "newAccount.html"));
});

// Technical
app.get("/Technical", (request, response) => {
    response.status(200);
    response.render("technical");
});

app.get("/Tecnico", (request, response) => {
    response.status(200);
    response.redirect("/Technical");
});

// User
app.get("/User", (request, response) => {
    response.status(200);
    daoUser.getNotices("jaimji01@ucm.es", (err, notices) => {
        if (err) console.log(err);
        else {
            console.log(notices);
            response.render("user", { notices : notices });
        }
    });
});

app.get("/Usuario", (request, response) => {
    response.status(200);
    response.redirect("/User");
});

// log in
app.post("/loginUser", (request, response) => {
    response.status(200);
    console.log(request.body.email + "@ucm.es");
    console.log(request.body.password);
    daoUser.login(request.body.email + "@ucm.es", request.body.password, (err, result) => {
        if (err) console.log(err);
        else if (result === undefined) {
            console.log("Usuario no existe");
        }
        else response.redirect("/User");
    });
});

// New Account
app.post("/newAccount", (request, response) => {
    response.status(200);
    let user = {
        name : request.body.name,
        email : request.body.email,
        password : request.body.password,
        confirmPass : request.body.confirmPass,
        profile : request.body.profile,
        date : "2022-12-12"
    }

    daoUser.insertUser(user, (err) => {
        if (err) console.log(err);
        else {
            response.redirect("/login");
        }
    });
});

daoUser.getNotices("jaimji01@ucm.es", (err, notices) => {
    if (err) console.log(err);
    else console.log(notices);
});

app.get("/myNotices", (request, response) => {
    response.status(200);
    console.log("Hola");
});

app.listen(3000, () => {
    console.log("Server listening in 3000 port");
});

