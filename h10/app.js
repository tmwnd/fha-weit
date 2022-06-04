const path = require('path')

const express = require('express')
const app = express()

var h10_route = express.Router()

// Mustache müssen Sie nun in Ihrer Node-App ausliefern: -> kein Fan
h10_route.use('/javascripts/mustache', express.static(path.join(__dirname, 'node_modules/mustache'))) // mhh -_-
// Verwenden Sie nun die Middleware express.static, um statische Dateien im Ordner public auszuliefern, damit nach Starten Ihrer App Ihre Website beim Aufruf von http://localhost:port angezeigt wird.
h10_route.use('/', express.static(path.join(__dirname, 'public')))

app.use('/h10', h10_route)

app.listen(3010)