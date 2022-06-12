const exec = require('child_process').exec

const express = require('express')

let path = `/var/www/virtual/tmwnd/weit.tmwnd.de`

function start(week, res, action = 'start') {
    exec(`ls ${path}`, (error, stdout, stderr) => {
        if (stdout.split('\n').includes(week)) {
            exec(`ls ${path}/${week}`, (error, stdout, stderr) => {
                stdout = stdout.split('\n')
                if (stdout.includes('package.json') && stdout.includes('node_modules')) {
                    exec(`node ${path}/${week}/.`)
                    res.send(`done: ${action} ${week}`)
                } else
                    res.status(500).send(`err: ${week} ist not a nodejs module`)
            })
        } else
            res.status(500).send(`err: ${week} does not exist`)
    })
}

function restart(week, res, action = 'restart') {
    exec('supervisorctl status', (error, stdout, stderr) => {
        if (stdout
            .split('\n')
            .filter(service => service != '')
            .map(service => service.split(' ', 2)[0])
            .includes(week)
        ) {
            exec(`supervisorctl restart ${week}`)
            res.send(`done: restart ${week}`)
        }
        else {
            exec('uberspace web backend list', (error, stdout, stderr) => {
                stdout = stdout
                    .split('\n')
                    .filter(backend => backend.includes(' => '))
                    .filter(backend => backend.split(' => ')[1].split(', ')[0] == 'OK')
                if (stdout
                    .map(backend => backend.split(' ', 2)[0].replace('weit.tmwnd.de/', ''))
                    .filter(backend => backend != '')
                    .includes(week)
                ) {
                    let pid = stdout
                        .filter(backend => backend.split(' ', 2)[0].replace('weit.tmwnd.de/', '') == week)[0]
                        .split(' PID ')[1]
                        .split(', ', 2)[0]

                    exec(`kill ${pid}`)
                    start(week, res, action)
                } else
                    res.status(500).send(`err: ${week} is not running`)
            })
        }
    })
}

module.exports = express.Router()
    .get('/start/:id', (req, res) => start(req.params.id, res))
    .get('/restart/:id', (req, res) => restart(req.params.id, res))