const getNotenBewertung = require('../modules/getNotenBewertung.js')

const fs = require('fs');
const path = require('path')
const request = require('request')
const Mustache = require('mustache')

const express = require('express')

// Mit der Klasse express.Router lassen sich modular einbindbare Routenhandler erstellen.
// Wir wollen diese benutzen, um unsere Applikation modular zu gestalten: Routen für den Login/die Registrierung soll in eine separate Datei users.js in den Ordner routes ausgelagert werden.
// Achten Sie darauf, den Router zu exportieren
// Was spricht in diesem Fall gegen die Übermittlung per GET-Aufruf? -> ja! ich liebe urls mit klartext passwörtern
// Definieren Sie nun in Ihrer users.js eine zweite Route (z.B. /register), um die Daten entegegenzunehmen, den Benutzer in der Datenbank zu speichern und anschließend eine Bestätigung auszugeben.
module.exports = express.Router()
    // Falls Sie das Login-Template direkt beim Aufruf von http://localhost:3000 angezeigt bekommen wollen, definieren Sie in der app.js eine Route /, in der Sie eine Weiterleitung auf /users/login programmieren.
    .get('/', (req, res) => res.redirect('https://weit.tmwnd.de/h11/login'))
    .get('/login', (req, res) => {
        // Ändern Sie die Route /login in der users.js so ab, dass der Benutzer automatisch zur /info-Route umgeleitet wird, falls er schon eingeloggt ist.
        if (req.session.user)
            res.redirect('https://weit.tmwnd.de/h11/info')
        else
            res.render('login.html', {})
    })
    // Erstellen Sie in users.js eine neue Route /logout [...]
    .all('/logout', (req, res) => {
        // Beim Aufruf sollen alle Sitzungsdaten gelöscht und der Benutzer somit ausgeloggt werden.
        req.session.destroy()
        // Anschließend soll eine Umleitung auf  / stattfinden.
        res.redirect('https://weit.tmwnd.de/h11')
    })
    // Definieren Sie in der users.js die GET-Route /register zum Ausliefern des Registrier-Templates und denken Sie daran entsprechend den Link in Ihrer login.html auf die Route (/users/register) anzupassen.
    .get('/register', (req, res) => res.render('register.html', {}))
    // Schaffen Sie nun eine Möglichkeit, um einen Benutzer in die Datenbank einzupflegen.
    .post('/register', (req, res) => res.redirect(307, req.baseUrl + '/info'))
    // Rückgabe verarbeiten
    // Bei einem erfolgreichen Login, senden Sie eine entsprechende Text-Response an den Browser.
    .all('/info', (req, res) => request.post('https://weit.tmwnd.de/h11/api/user_data', {
        form: { 'username': req.session.user }
    }, (html_err, html_res, body) => new Promise((resolve, reject) => {
        if (html_res.statusCode == 500)
            reject(body)

        resolve((JSON.parse(body)))
    })
        .then(users => users[0])
        .then(user => res.render('info.html', { 'user': user.username, 'note': user.note, 'note_str': getNotenBewertung(user.note) }))
        .catch(err => res.status(500).send('ERR'))
    ))
    .get('/admin', (req, res) => request.post('https://weit.tmwnd.de/h11/api/admin', (html_err, html_res, body) => new Promise((resolve, reject) => {
        if (html_res.statusCode == 500)
            reject(body)

        resolve((JSON.parse(body)))
    })
        .then(users => {
            let tpl = fs.readFileSync(__dirname + '/../views/single_user.html').toString()
            let table = ''
            users.forEach(user => table += Mustache.render(tpl, {
                'user': user.username, 'note': user.note, 'note_str': getNotenBewertung(user.note)
            }) + '\n')
            res.render('./../views/admin.html', { 'table': table })
        })
    ))
    // Um die login.html vom Webserver ausliefern zu lassen, müssen Sie wieder die von express mitgelieferte Middleware express.static verwenden, um statische Inhalte auszuliefern
    .use('/', express.static(path.join(__dirname, '/../public')))