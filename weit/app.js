const path = require('path')

const express = require('express')
app = express()

const consolidate = require('consolidate')
app.engine('html', consolidate.mustache)
app.set('views', __dirname + '/views')

app.use(require('./routes/index.js'))
app.use('/actions', require('./routes/actions.js'))

let statics = (['h01', 'h03', 'h04'])
statics.forEach(week => app.use(`/${week}/`, express.static(path.join(__dirname, `../${week}`))))

app.use(express.static(path.join(__dirname, 'public')))

app.listen(3004)