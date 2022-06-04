const path = require('path')
const request = require('request')
const Mustache = require('mustache')

const express = require('express')

module.exports = express.Router()
    .get('/', (req, res) => res.render('./../views/login.html', {}))
    .get('/register', (req, res) => res.render('./../views/register.html', {}))
    .post('/register', (req, res) => res.redirect(307, req.baseUrl + '/user'))
    .post('/user', (req, res) => request.post('https://weit.tmwnd.de/h11/api/user_data', { form: { 'username': req.body.user } }, (html_err, html_res, body) => new Promise((resolve, reject) => {
        if (html_res.statusCode == 500)
            reject(body)

        resolve((JSON.parse(body)))
    })
        .then(users => users[0])
        .then(user => res.render('./../views/user.html', { 'user': user.username, 'note': user.note }))
        .catch(err => res.status(500).send('ERR'))
    ))
    .get('/admin', (req, res) => request.post('https://weit.tmwnd.de/h11/api/admin', (html_err, html_res, body) => new Promise((resolve, reject) => {
        if (html_res.statusCode == 500)
            reject(body)

        resolve((JSON.parse(body)))
    })
        .then(users => {
            users.forEach(user => {
                console.log(Mustache.render('{{user}} spends {{note}}', { 'user': user.username, 'note': user.note }))
            })
        })
    ))
    .use('/', express.static(path.join(__dirname, '/../public')))