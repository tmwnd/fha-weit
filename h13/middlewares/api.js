const express = require('express')

module.exports = express.Router()
    .all('/', (req, res, next) => {
        res.type('application/json')
        next()
    })