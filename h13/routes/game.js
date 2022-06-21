const fs = require('fs')
const request = require('request')

const express = require('express')
const Mustache = require('mustache')

const GAMEMODE_TPL = fs.readFileSync('./views/partials/gesture.html').toString()

const API_ROUTE_URL = 'https://weit.tmwnd.de/h13/api/'
const GESTURES = require('./../modules/gamemodes.js')

const format = (player, id) => `${player}#${('0000' + id).slice(-4)}`

module.exports = express.Router()
    .post('/', async (req, res) => {
        let rendered_gestures = ''

        let name = req.body.name
        let gamemode = req.body.gamemode

        let oppenent = req.body.opponent

        if (oppenent) {
            oppenent = oppenent.split(' | ')
            gamemode = oppenent[1]
            oppenent = oppenent[0]
        }

        if (!oppenent || !oppenent.startsWith('bot_')) {
            let id = await new Promise(resolve => request(API_ROUTE_URL + 'player', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'name': name, 'gamemode': gamemode, 'available': (req.body.opponent == undefined) })
            }, (html_err, html_res, body) => {
                resolve(body)
            }))
            name = format(name, id)
        }

        GESTURES[gamemode].gestures.forEach(gamemode => {
            rendered_gestures += Mustache.render(GAMEMODE_TPL, { 'name': gamemode }) + '\n'
        })

        res.render('game.html', { 'gamemode': gamemode, 'name': name, 'opponent': oppenent, 'gestures': rendered_gestures })
    })