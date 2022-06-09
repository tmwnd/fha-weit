const bcrypt = require('bcrypt')
const request = require('request')

const express = require('express')

// Anstatt eine etwaige Fehlermeldung (z.B. "keine Note zwischen 1 und 6" oder "Username oder Passwort fehlt!") in der Konsole auszugeben, soll die Fehlermeldung stattdessen im Browser auf der Registrier-Seite angezeigt werden.
// Dafür benutzen wir wieder Templates.
function cancel(res, err = '') {
    res.render('register.html', { 'err': err })
}

module.exports = express.Router()
    .post('/', (req, res, next) => {
        if (req.body.user == '')
            return cancel(res, 'no username entered')

        if (req.body.pw == '')
            return cancel(res, 'no password entered')

        let note = req.body.note

        if (isNaN(note))
            return cancel(res, 'grade NaN or note entered')

        // Stellen Sie sicher, dass die übergebene Note eine Zahl zwischen 1 und 6 ist [...]
        if (note > 6 || note < 1 || ![0, 3, 7].includes(Math.round((note % 1) * 10)))
            return cancel(res, `${note} invalid grade`)

        request.post('https://weit.tmwnd.de/h11/api/user_data', { form: { 'username': req.body.user } }, (html_err, html_res, body) => new Promise((resolve, reject) => {
            if (html_res.statusCode == 500)
                reject(body)

            resolve((JSON.parse(body)))
        })
            .catch(async err => {
                switch (err) {
                    case 'empty set':
                        let enc_pw = await bcrypt.hash(req.body.pw, 8)

                        request.post('https://weit.tmwnd.de/h11/api/user', { form: { 'username': req.body.user, 'password': enc_pw, 'note': req.body.note } }, (html_err, html_res, body) => new Promise((resolve, reject) => {
                            if (html_res.statusCode == 500)
                                reject(body)
                            resolve()
                        })
                            .then(() => {
                                req.session.user = req.body.user
                                next()
                            })
                            .catch(err => cancel(res, err))
                        )
                        break
                    default:
                        cancel(res, err)
                }
            })

        )


    })