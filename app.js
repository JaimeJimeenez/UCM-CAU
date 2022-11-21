"use strict"

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded( { extended: true }));

app.get("/", (request, response) => {
    response.redirect("/login");
});

// Init Windows
app.get("/login", (request, response) => {
    response.status = 200;
    response.redirect("login.html");
});

app.get("/newAccount", (request, response) => {
    response.status(200);
    response.redirect("newAccount.html");
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
    response.render("user");
});

app.get("/Usuario", (request, response) => {
    response.status(200);
    response.redirect("/User");
});

app.listen(3000, () => {
    console.log("Server listening in 3000 port");
});