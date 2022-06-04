const bcrypt = require('bcrypt')
const request = require('request')

const express = require('express')

function cancel(res, err = '') {
    res.render('./../views/login.html', { 'err': err })
}

module.exports = express.Router()
    .post('/', (req, res, next) => {
        if (req.body.user == '')
            return cancel(res, 'no username entered')

        if (req.body.pw == '')
            return cancel(res, 'no password entered')

        request.post('https://weit.tmwnd.de/h11/api/user_data', { form: { 'username': req.body.user } }, (html_err, html_res, body) => new Promise((resolve, reject) => {
            if (html_res.statusCode == 500)
                reject(body)

            resolve((JSON.parse(body)))
        })
            .then(users => users[0])
            .then(async user => {
                if (!(await bcrypt.compare(req.body.pw, user.password))) {
                    throw 'pw dont match'
                }
            })
            .then(next)
            .catch(err => {
                switch (err) {
                    case 'pw dont match':
                        err = (`wrong password for ${req.body.user} entered`)
                        break
                    case 'empty set':
                        err = (`no user ${req.body.user} found`)
                        break
                }
                cancel(res, err)
            })

        )
    })