const fs = require('fs')
const request = require('request')

const express = require('express')
const Mustache = require('mustache')

const API_ROUTE_URL = 'https://weit.tmwnd.de/h13/api/'

const GAMEMODE_TPL = fs.readFileSync('./views/partials/gamemode.html').toString()
const LOBBY_TPL = fs.readFileSync('./views/partials/lobby.html').toString()
const PLAYER_TPL = fs.readFileSync('./views/partials/player.html').toString()

const BOTS = ['tim', 'paddel', 'jupp', 'felix', 'murloc']
const GAMEMODES = require('./../modules/gamemodes.js')

const format = (player, id) => `${player}#${('0000' + id).slice(-4)}`

module.exports = express.Router()
    .get('/', async (req, res) => {
        let rendered_gamemodes = ''
        let rendered_players = ''

        let players = await new Promise(resolve => request(API_ROUTE_URL + 'players', {}, (html_err, html_res, body) => {
            resolve(JSON.parse(body))
        }))

        let bots = Array.from(BOTS)

        for (let gamemode in GAMEMODES) {
            rendered_gamemodes += Mustache.render(GAMEMODE_TPL, { 'name': gamemode }) + '\n'
            rendered_players += Mustache.render(LOBBY_TPL, { 'name': gamemode }) + '\n'

            for (let id in players) {
                let player = players[id]

                if (player.available && player.gamemode == gamemode) {
                    rendered_players += Mustache.render(PLAYER_TPL, { 'name': format(player.name, id), 'gamemode': gamemode }) + '\n'
                    delete players[id]
                }
            }

            let bot = bots.splice(Math.floor(Math.random() * bots.length), 1)

            rendered_players += Mustache.render(PLAYER_TPL, { 'name': `bot_${bot}`, 'gamemode': gamemode }) + '\n'
        }

        res.render('index.html', { 'gamemodes': rendered_gamemodes, 'players': rendered_players })
    })