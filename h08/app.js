// Erstellen Sie analog zu den bisherigen Aufgaben eine geeignete Verzeichnisstruktur für das Projekt. -> /routes -> /rest, weil routen dienen als rest schnittstelle oder so 
const express = require('express')
const { check } = require('express-validator')

var app = express()
app.use(express.json())

var h08_route = express.Router()

h08_route.use('/', require('./middlewares/todos.js'))
// h08_route.use('/', require('./rest/todos.js'))
h08_route.use('/', [check('title').escape(), check('id').toInt()], require('./routes/todos.routes.js'))

app.use('/h08/todos', h08_route)

app.listen(3008)