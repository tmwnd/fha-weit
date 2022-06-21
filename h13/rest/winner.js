const express = require('express')

const GESTURES = require('./../modules/gamemodes.js')

module.exports = express.Router()
    .post('/winner', (req, res) => {
        res.type('plain/text')

        let gestures = GESTURES[req.body.gamemode].gestures
        let logic = GESTURES[req.body.gamemode].logic

        let gesture1 = req.body.gesture1
        let gesture2 = req.body.gesture2

        if (gesture2 == 'random')
            gesture2 = gestures[Math.floor(Math.random() * Array.from(gestures).length)]

        res.send(`${-1 + logic[gesture1].includes(gesture2) + 2 * logic[gesture2].includes(gesture1)}`)
    })