const express = require('express');
const consolidate = require('consolidate')
const cookieParser = require('cookie-parser') // Verwenden [...] Sie hierfür die Middleware cookie-parser. 
const { check } = require('express-validator') // Benutzen Sie hierfür die Middleware express-validator

var app = express();

// Über consolidate.js kann Mustache direkt in express eingebunden werden. Dafür müssen Sie bei der Initiliaisierung folgende Punkte beachten:
app.engine('html', consolidate.mustache)
// app.set('view engine', 'html') // Standard-View-Engine auf html setzen (dadurch kann beim Rendern die Endung .html der Template-Datei weggelassen werden) -> warum sollte ich dies weglassen wollen???
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

var h06_route = express.Router()

// Sie haben bereits eine Middlerware geschrieben, die den Cookie setzt.
h06_route.all('/', require('./middlewares/root.js'))
// Schreiben Sie nun unterhalb dieser eine Route /, die den Inhalt des Cookies auf Ihrer index.html-Seite ausgibt. -> wieder / -> /h06
h06_route.all('/', require('./routes/root.js'))
h06_route.use(
    '/print',
    // [...] um req.body und req.query zu bereinigen (Speziell hier den Namen und die Note).
    // Überlegen Sie sich anhand der Liste an Sanitizern (ggf. auch Validatorn), welche für den Namen und die Note sinnvoll sind und wenden Sie diese anschließend bei der Route /print (POST/GET) an.
    // Achten Sie nun darauf nicht mehr den kompletten Body/Query an den Browser zurückzuschicken, sondern nur die gefilterten Daten. -> Sanitizers manipulieren req selber
    [check('user').escape(), check('note').toInt()],
    require('./routes/print.js')
)

app.use('/h06', h06_route)

app.listen(3006)