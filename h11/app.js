// Verwenden Sie bei den asynchronen Funktionen die async/await-Syntax (also keine Callbacks und thens). -> nö
// Habe das gerade erst gelesen und kurz überlegt den Code umzuschreiben. Aber brauche .catch und callbacks sind schon nice

// Erstellen Sie als Einstiegspunkt die Datei app.js (mit Webserver-Funktionalität)

const { check } = require('express-validator')
const bodyParser = require('body-parser')
// Damit der Login persistent bleibt, verwenden wir Sessions. Installieren Sie dafür das Modul express-session.
const session = require('express-session')

const express = require('express')
const app = express()
// Legen Sie in Ihrer app.js eine Session an, indem Sie die Session-Middleware benutzen.
app.use(session({ secret: 'weit', cookie: { maxAge: 60000 }}))

const consolidate = require('consolidate')
app.engine('html', consolidate.mustache)
app.set('views', __dirname + '/views');

// Um in Ihrer Route /check_login Formulardaten aus dem Body auslesen zu können, müssen Sie die Middleware-Funktion urlencoded benutzen
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))

const h11_route = express.Router()

// [...] und escapen Sie unerwünschte Zeichen im Usernamen zum Schutz vor Cross-Site-Scripting-Attacken
h11_route.post('/info', [check('user').escape(), check('pw').escape()])
h11_route.post('/register', [check('user').escape(), check('pw').escape(), check('note').toFloat()])
h11_route.use('/api', require('./middlewares/api.js'))

h11_route.use('/info', require('./middlewares/check_login.js'))
h11_route.use('/register', require('./middlewares/handle_register.js'))

// [...], damit dieser anschließend in Ihrer Hauptapplikation app.js mit dem Kommando app.use('/users', users) eingebunden werden kann
h11_route.use(require('./routes/users.js'))
h11_route.use('/api', require('./rest/users.js'))

// Legen Sie nun einen neuen User mittels Ihrer Applikation an und testen Sie den Login -> ok
app.use('/h11', h11_route)

app.listen(3011)