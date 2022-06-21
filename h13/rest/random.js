const express = require('express')

const GESTURES = require('./../modules/gamemodes.js')

module.exports = express.Router()
    .post('/random', (req, res) => {
        res.type('plain/text')

        let gestures = GESTURES[req.body.gamemode].gestures

        res.send(gestures[Math.floor(Math.random() * Array.from(gestures).length)])
    })