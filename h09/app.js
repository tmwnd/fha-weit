const path = require('path')

const express = require('express')
const app = express()

app.use('/h09', express.static(path.join(__dirname, 'public')))

app.listen(3009)