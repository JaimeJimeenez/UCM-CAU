'use strict'

const express = require('express');
const router = express.Router();

router.get('/', (request, response, next) => {
    response.redirect('/user');
});

module.exports = router;