const express = require('express')

let players = {}

let id = 0

module.exports = express.Router()
    .get('/player', (req, res) => {
        res.send(players[req.query.id])
    })
    .get('/players', (req, res) => {
        res.send(players)
    })
    .post('/player', (req, res) => {
        players[id] = req.body

        if (players[id].available == undefined)
            players[id].available = true

        res.send({ 'id': id })

        id++
    })