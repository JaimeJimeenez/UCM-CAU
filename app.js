"use strict"

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

app.set("view-engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded( { extended: true }));

app.get("/", (request, response) => {
    response.redirect("/login");
});

app.get("/login", (request, response) => {
    response.status = 200;
    response.sendFile(path.join(__dirname, "public", "login.html"));
})

app.listen(3000, () => {
    console.log("Server listening in 3000 port");
});