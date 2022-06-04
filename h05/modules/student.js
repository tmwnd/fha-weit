// Kopieren Sie nun Ihren Quellcode der vorherigen Aufgabe in das neue Projekt.

// Im Normalfall möchte man Teile der Anwendungslogik wie zum Beispiel hier die Verwaltung der Studenten auf Serverseite ausführen.
// Die Studenten-Klasse soll auf Client-Seite nicht bekannt sein.
// Überlegen Sie, in welchem Verzeichnis die Datei student.js sinnvollerweise liegen sollte und verschieben Sie diese in den entsprechenden Ordner. 

// Erstellen Sie eine Klasse Student. Speichern Sie die Klasse in einer Datei mit dem Namen student.js.
class Student {
    // Die Klasse Student sollte die Attribute name und note enthalten.
    name
    note

    // Es sollen außerdem Getter und Setter für den Namen und die Note geben. 
    // Hinweis: Es gilt als gängige Praxis die Attributnamen mit einem führenden Underscore zu versehen, um anzudeuten, dass diese nicht zur direkten Manipulation vorgesehen sind.
    // name und note sind public. Dementsprechend benötige ich keine getter und setter, und der Unterstrich wäre missverständlich für eventuelle Lesende.
    // Wieso sollte ich getName() haben, wenn ich sowieso nur den Namen zurückgebe???

    static noten = {
        1: "sehr gut",
        2: "gut",
        3: "befriedigend",
        4: "ausreichend",
        5: "mangelhaft",
        6: "ungenügend"
    }

    // Erstellen Sie eine neue Datei app.js. Schreiben Sie in dieser eine Funktion getNotenBewertung, die als Parameter eine Note (Zahl) erhält und entsprechend der Zahl einen String zurückgibt.
    // Was wäre eine sinnvolle Reaktion bzw. ein sinnvoller Rückgabewert für eine ungültige Zahl? Implementieren Sie diese. Es gibt hierfür mehrere sinnvolle Lösungsmöglichkeiten. -> Da sowieso ein string erwartet wird bzw. mit strings versucht wird zu arbeiten, möchte ich keinen nicht-string zurückgeben. Demnach gebe ich hier eine textuelle Beschreibung zurück.
    // Machen Sie anschließend die Funktion getNotenBewertung zu einer statischen Funktion der Klasse Student. Diese sollte sich anschließend in der student.js befinden und nicht mehr in der app.js.
    static getNotenBewertung(n) {
        return (n in Student.noten) ? Student.noten[n] : `Keine Note ${n} gefunden`
    }

    // Der Konstruktor der Klasse erhält den Namen des Studenten.
    constructor(name) {
        this.name = name
    }

    // Schreiben Sie in der Klasse Student anschließend eine weitere Funktion toString die Namen und Note eines Studenten als String zurückgibt. Nutzen Sie hierfür die Funktion getNotenBewertung.
    toString() {
        return this.name + ((this.note != undefined) ? ` (${Student.getNotenBewertung(this.note)})` : "")
    }
}

// Modifzieren Sie die Studentenklasse so, dass diese in der app.js eingebunden werden kann.
module.exports = Student