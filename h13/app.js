const path = require('path')

const bodyParser = require('body-parser')

const express = require('express')
const app = express()

const consolidate = require('consolidate')
app.engine('html', consolidate.mustache)
app.set('views', __dirname + '/views')

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use('/h13/javascripts/mustache', express.static(path.join(__dirname, 'node_modules/mustache')))

app.use('/h13/api', require('./middlewares/api.js'))

app.use('/h13', express.static(path.join(__dirname, 'websockets')))
app.use('/h13', express.static(path.join(__dirname, 'public')))
app.use('/h13/game', require('./routes/game.js'))

app.use('/h13/api', require('./rest/players.js'))

const server = app.listen(3013)

const ws = require('ws')
const wss = new ws.Server({ server })

wss.on('connection', require('./websockets/connection.js'))