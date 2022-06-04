// Erstellen Sie nun die JavaScript-Datei register_frontend.js, legen diese im Ordner public/javascripts ab
// Schreiben Sie bitte den kompletten JavaScript-Code in die register-frontend.js

const url = 'https://weit.tmwnd.de/h09/'

// Erstellen Sie in der register_frontend.js eine Funktion getColorCode(), die nach einer übergebenen Note einen Farbcode (als String) zurückliefert.
function getColorCode(note) {
    switch (note) {
        case '1':
        case '2': return '#5cb85c'
        case '3':
        case '4': return '#f0ad4e'
        case '5':
        case '6': return '#d9534f'
        default: return ''
    }
}

function getNote(note) {
    switch (note) {
        case '1': return 'sehr gut'
        case '2': return 'gut'
        case '3': return 'befriedigend'
        case '4': return 'ausreichend'
        case '5': return 'mangelhaft'
        case '6': return 'ungenügend'
        default: return ''
    }
}

// Die Hintergrundfarbe des Submit-Buttons soll nun abhängig von der ausgewählten Note verändert werden.
async function setColorListener(value, color) {
    await Promise.all([value, color])

    value.addEventListener('input', event => {
        if (event.target.value == '') // js erkennt '+' als ''
            event.target.value = '' // falls fälschlicherweise == '', setze auf ''
        else if (getColorCode(event.target.value) == '')
            event.target.value = event.target.old_value ?? '' // wenn etwas fehlerhaftes eingegeben wird...

        // Rufen Sie die Funktion getColorCode mit dem ausgewählten Wert auf und ändern Sie anschließend die Farbe des Buttons.
        color.style.backgroundColor = getColorCode(event.target.value)

        event.target.old_value = event.target.value
    })
}

// Beim Absenden des Formulars soll überprüft werden, ob Name und Passwort angegeben wurden.
// Können Sie nun serverseitig davon ausgehen, dass die Werte immer gesetzt sind? -> Nein.
// > Man kann von gar nichts ausgehen. Weder, wenn die Aufgabe diesen Wert zu setzen bei etwaigen KundInnen liegt, da jene unbeabsichtigt/ beabsichtigt Fehler machen können/ werden, noch, wenn man mit js arbeitet und sowieso nichts fest ist.
// Wie kann der Benutzer die Abfrage umgehen? Macht es überhaupt Sinn clientseitig entsprechende Checks durchzuführen?
async function setSubmitListener(submit, username, password, output) {
    await Promise.all([submit, username, password, output])

    submit.addEventListener('click', event => {
        // Nur wenn beide Werte angegeben sind, darf das Formular abgesendet werden.
        if (username.value == '' || password.value == '') {
            // Falls dies nicht der Fall ist, soll eine entsprechende Fehlermeldung in dem div-Container angezeigt werden.
            output.innerHTML = 'Kein Username oder Passwort angegeben'
            // D.h. im fehlerhaften Fall muss das Event abgebrochen werden.
            event.preventDefault()
        } else {
            output.innerHTML = ''
        }
    })
}

// [...] der bei einem Klick die Inhalte der drei Formularfelder ausgibt
async function setButtonListener(button, username, password, note, output) {
    await Promise.all([button, username, password, note, output])

    button.addEventListener('click', event => {
        output.innerHTML = '' // clear output

        // Erstellen Sie hierzu mit JavaScript eine Tabelle
        const table = document.createElement('table')

        let trs = [username, password, note] // [...].forEach() ging nicht :/
        trs.forEach(element => {
            const tr = document.createElement('tr')

            // anpassen der Werte unter betimmten Bedingungen
            switch (element.id) {
                case 'inputPasswort': value = element.value.replace(/./g, "*"); break // pw im Klartext... lol
                case 'inputNote': value = getNote(element.value); break // recyceln der Methode aus h05?
                default: value = element.value; break
            }

            // Die linke Spalte soll den Namen des input-Feldes enthalten.
            // Die rechte Spalte soll den Inhalt des Feldes beinhalten.
            let tds = [element.placeholder + ": ", value]
            tds.forEach(value => {
                let td = document.createElement('td')
                td.innerHTML = value
                tr.append(td)
            })

            table.append(tr)
        })

        // [...] die Sie anschließend in das div-Element mit der ID output einfügen
        output.append(table)
    })
}

fetch(url)
    // Versuchen Sie mit der Funktion alert den Text des Registrier-Buttons mit der ID submit als Popup-Fenster auf dem Bildschirm auszuzeigen
    // Sie sollten jetzt erstmal kein Popup sehen. Stattdessen finden Sie in den Developer Tools eine Exception vor: -> hat mit fetch funktioniert. Eventuell macht das bei größeren Seiten Probleme, denke aber fetch wartet, bis das DOM Objekt erstellt wurde
    // Das alert aus dem vorherigen Aufgabenteil dürfen Sie auskommentieren.
    // .then(() => alert(document.getElementById('submit').textContent))
    // Hierzu müssen Sie einen Event-Handler an den input-Knoten der Note binden.
    .then(() => setColorListener(
        document.getElementById('inputNote'),
        document.getElementById('submit')
    ))
    // Binden Sie zu diesem Zweck einen Submit-Eventhandler an das Formular.
    .then(() => setSubmitListener(
        document.getElementById('submit'),
        document.getElementById('inputName'),
        document.getElementById('inputPasswort'),
        document.getElementById('output'),
    ))
    .then(() => setButtonListener(
        document.getElementById('button'),
        document.getElementById('inputName'),
        document.getElementById('inputPasswort'),
        document.getElementById('inputNote'),
        document.getElementById('output')
    ))
