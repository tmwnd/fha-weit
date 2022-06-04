// Bisher haben wir einfachen Javascript-Code geschrieben, den wir durch Einbindung in eine index.html per Browser ausführen konnten.
// Durch die Verwendung des Node.js-Interpreters benötigen wir nun die index.html nicht mehr.
// Wir können unsere app.js direkt mit Node.js ausführen. 

// Um Teile der Anwendungslogik wie zum Beispiel hier die Verwaltung der Studenten mittels Node auf Serverseite auszuführen, müssen wir den Inhalt unserer app.js mit einer Webserver-Funktionalität versehen.
// Node in Kombination mit dem in der Vorlesung vorgestellten express-Framework bietet die Möglichkeit einen Webserver zu erstellen.
// D.h. XAMPP benötigen wir also ab jetzt nicht mehr! -> besser ist's

const express = require('express');
var app = express();

var h05_route = express.Router()

// Erstellen Sie in Ihrem bestehenden Projekt eine Seite index.html mit einem Formular.
// Da es sich dabei um ein statisches File handelt, legen Sie dieses in den Ordner public -> Da ich hier in Unterordnern arbeite, musste ich ein bisschen kreativ werden. Dementsprechend sorry für die Abweichung zur Anleitung
h05_route.use('/', express.static(__dirname + '/public'))

// Sorgen Sie dafür, dass Formulardaten geparsed werden und dem Request hinzugefügt werden, indem Sie die built-in Middleware express.urlencoded benutzen:
app.use(express.urlencoded({ extended: true }))

// Formulare können sowohl per GET als auch per POST abgeschickt werden.
// Wir wollen hier beide Varianten unterstützen, d.h. definieren Sie hierfür in der app.js zwei Routen /print (eine, die auf POST reagiert und eine zweite, die auf GET reagiert), die jeweils die geschickten Formulardaten als Text zurücksendet und im Browser anzeigt.
// Achten Sie darauf, dass Sie die Routen innerhalb der app.js nach der urlencoded-Middleware definieren.
var print_route = express.Router()
print_route.use('/', require('./routes/print.js').print_route_get)
print_route.use('/', require('./routes/print.js').print_route_post)
h05_route.use('/print', print_route)

// require('./routes/print.js').forEach(route => {
//     app.use('/h05', route)
// });

// und eine Route '/student' zur Verfügung stellt, die die von Ihnen erstellten Studenten sortiert und anschließend ausliefert (Verwendung der toString()-Methode) und somit beim Aufruf per Browser als Text ausgibt.
h05_route.use('/student', require('./routes/student.js'))
// Eine zweite Route '/studentFactory' soll die Studenten-Factory studentFactory erzeugen (siehe Code vorherige Übung) und mit dieser den Studenten Max mit der Note 5 anlegen und ausliefern.
h05_route.use('/studentFactory', require('./routes/studentFactory.js'))

app.use('/h05', h05_route)

// Schreiben Sie nun mit express einen Server, der auf Port 3000 lauscht
app.listen(3005)