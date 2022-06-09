const ROOT_URL = 'https://weit.tmwnd.de'

const express = require('express')
const app = express()

app.use('/', (req, res) => res.redirect(ROOT_URL + req.url.replace('/h12', '/h11')))

app.listen(3012)