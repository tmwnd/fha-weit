const fs = require('fs')
const exec = require('child_process').exec
const Mustache = require('mustache')

const express = require('express')

module.exports = express.Router()
    .get('/', (req, res) => {
        exec('uberspace web backend list', (error, stdout, stderr) => {
            let tpl = fs.readFileSync(__dirname + '/../views/partials/praktikum.html').toString()
            let rendered = ''

            let statics = (['h01', 'h03', 'h04'])
            statics.forEach(week =>
                rendered += Mustache.render(tpl, {
                    'week': `${week}`,
                    'link': `https://weit.tmwnd.de/${week}`,
                    'status': 'HTML'
                }) + '\n')

            stdout
                .split("\n")
                .filter(backend => backend.startsWith("weit.tmwnd.de/h"))
                .sort()
                .forEach(backend => {
                    let status = backend.split(' => ')[1].split(', ')[0]
                    let link = 'https://' + backend.split(' ', 2)[0]
                    let week = link.replace('https://weit.tmwnd.de/', '')
                    let action = (status == 'OK') ? 'restart' : 'start'

                    rendered += Mustache.render(tpl, {
                        'week': week,
                        'link': link,
                        'status': status,
                        'action': action
                    }) + '\n'
                })

            res.render('index.html', {
                'praktika': rendered
            })
        })
    })