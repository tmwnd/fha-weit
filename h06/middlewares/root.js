const express = require('express')

const date_formatter = require('./../modules/date_formatter.js')

module.exports = express.Router().use('/', (req, res, next) => {
    res.cookie('last_visit', date_formatter(new Date()), { maxAge: 900000 })
    // Geben Sie in der Konsole per Cookie aus, wann Sie die Seite das letzte Mal besucht haben.
    // console.log(req.cookies.last_visit) // 1. undefined
    next();
})