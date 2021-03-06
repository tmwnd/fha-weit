// Wir wollen nun eine Webanwendung mit Login- und Registrier-Funktionalität unter Hinzunahme einer Datenbank implementieren.
// Wir benutzen für das Praktikum eine SQLite-Datenbank (Achtung! Nicht beliebig skalierbar!). -> Wie auf offiziellen Wegen besprochen, hier via mariaDB

// Legen Sie eine Datenbank [...] und eine Tabelle users an
// Dort sollen alle Informationen aus dem Formular (Benutzername, Passwort und Note als Zahl) gespeichert werden.
// Verwenden Sie id als primary key (PK) mit auto increment (AI). Der Benutzername soll unique (U) sein. Legen Sie in der Tabelle drei Testdatensätze an.

/*
    Author: Tim Wende
    Version: 1.0

    Singleton sql database API.
*/

const fs = require('fs');
const mysql = require('mysql');

class db {
    static instance = new db();

    sql;

    constructor() {
        if (this.db != null)
            return;

        // Eine Verbindung mit der Datenbank aufbauen
        Promise.resolve()
            .then(this.init())
            .then(this.connect())
    }

    resolve() { return Promise.resolve(this.sql) }

    init() {
        let db_config = JSON.parse(fs.readFileSync(__dirname + '/db_config.json'))
        this.sql = mysql.createConnection({
            host: db_config.host ?? 'localhost',
            database: db_config.database ?? 'tmwnd_h11',
            user: db_config.username,
            password: db_config.password
        })
    }

    connect() { this.sql.connect() }

    // Ein SELECT-Statement mit Platzhaltern vorbereiten
    query(qry, val = [], callback = console.log) {
        this.resolve()
            .then(sql => sql.query(qry, val, (err, result) => callback(new Promise((resolve, reject) => {
                if (err)
                    switch (err.code) {
                        case 'ER_NO_SUCH_TABLE': reject(`table ${qry.split('FROM ', 2)[1].split(' ', 2)[0]} does not exist`)
                        default: reject(err.code)
                    }

                if (result.length == 0)
                    reject('empty set')

                resolve(result)
            }))))
    }

    // Ein Insert-Statement mit Platzhaltern vorbereiten
    nonquery(qry, val = [], callback = console.log) {
        this.resolve()
            .then(sql => sql.query(qry, val, err => callback(new Promise((resolve, reject) => {
                if (err)
                    switch (err.code) {
                        case 'ER_NO_SUCH_TABLE': reject(`table ${qry.split('INTO ', 2)[1].split(' ', 2)[0]} does not exist`)
                        case 'ER_PARSE_ERROR': reject(`cant insert invalid values ${val} into ${qry.split('INTO ', 2)[1].split(' ', 2)[0]}`)
                        case 'ER_DUP_ENTRY': reject('cant insert duplicate primary key')
                        default: reject(err.code)
                    }

                resolve()
            }))))
    }
}

module.exports = db.instance