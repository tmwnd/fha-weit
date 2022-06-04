const db = require('./../modules/database.js')

const express = require('express')

/* Hier wird Sicherheit groß geschrieben */
// bcrypt.hash('pEmKq._lz3U8c9AW2TCc', 8).then(pwd => console.log(pwd))     // tmwnd  $2b$08$OwZUPOnYNxT32fkjXoTg4.UMWGHjd4ZOYpJvuWz1h9XCcZGrn64SG
// bcrypt.hash('docker+arch+ultrawide=<3', 8).then(pwd => console.log(pwd)) // paddel $2b$08$oMH287Kjl6bdEBWvxgKgtOpNqUNHfVizTn2fADmckuX5MXlRaeVZm
// bcrypt.hash('wirliebenayaka', 8).then(pwd => console.log(pwd))           // juwupp $2b$08$Rup1qiFWCd9Mc2/D5o.Xt.8oobUEH06sENm0sRvdtyL85Ycw9ABuu

module.exports = express.Router()
    // Ein SELECT-Statement mit Platzhaltern vorbereiten
    // Die Platzhalter mit den übertragenen Werten aus req.body (dafür muss beim Abschicken des HTML-Formulars die Methode POST gewählt sein) füllen
    // Das SELECT-Statement ausführen und auf eine Variable [...] speichern
    .post('/user', (req, res) => db.nonquery('INSERT INTO users VALUES (?, ?, ?)', [req.body.username, req.body.password, req.body.note], result => result
        .then(() => {
            res.type('plain/text')
            res.send('OK')
        })
        .catch(err => {
            res.type('plain/text')
            res.status(500).send(err)
        })
    ))
    .post('/user_data', (req, res) => db.query('SELECT * FROM users WHERE username = ?', [req.body.username], result => result
        .then(result => res.send(result))
        .catch(err => {
            res.type('plain/text')
            res.status(500).send(err)
        })
    ))
    .post('/admin', (req, res) => db.query('SELECT * FROM users', [], result => result
        .then(result => res.send(result))
        .catch(err => {
            res.type('plain/text')
            res.status(500).send(err)
        })
    ))