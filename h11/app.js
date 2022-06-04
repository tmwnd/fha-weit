const { check } = require('express-validator')
const bodyParser = require('body-parser')

const express = require('express')
const app = express()

const consolidate = require('consolidate')
app.engine('html', consolidate.mustache)

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))

const h11_route = express.Router()

h11_route.post('/user', [check('user').escape(), check('pw').escape()])
h11_route.post('/register', [check('user').escape(), check('pw').escape(), check('note').toFloat()])
h11_route.use('/api', require('./middlewares/api.js'))

h11_route.use('/user', require('./middlewares/check_login.js'))
h11_route.use('/register', require('./middlewares/handle_register.js'))

h11_route.use(require('./routes/users.js'))
h11_route.use('/api', require('./rest/users.js'))

app.use('/h11', h11_route)

app.listen(3011)