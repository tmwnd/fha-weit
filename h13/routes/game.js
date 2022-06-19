const express = require('express')

module.exports = express.Router()
    .post('/', (req, res) => res.render('game.html', { 'name': req.body.name, opponent: req.body.opponent }))