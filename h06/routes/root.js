// Schreiben Sie eine Middleware, die einen Cookie setzt.
const express = require('express')

module.exports = express.Router().use('/', (req, res) => {
    // In der Route müssen Sie nun nur noch res.render aufrufen
    res.render('./../views/index_tpl.html', {
        // Schicken Sie nun anstelle der Konsolenausgabe den Inhalt des Cookies an den Browser. 
        cookie_data: req.cookies.last_visit ?? 'Erster Besuch!'
    })
})