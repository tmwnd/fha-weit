class Student {
    name
    note

    static noten = {
        1: "sehr gut",
        2: "gut",
        3: "befriedigend",
        4: "ausreichend",
        5: "mangelhaft",
        6: "ungenügend"
    }

    static getNotenBewertung(n) {
        return (n in Student.noten) ? Student.noten[n] : `Keine Note ${n} gefunden`
    }

    constructor(name) {
        this.name = name
    }

    toString() {
        return this.name + ((this.note != undefined) ? ` (${Student.getNotenBewertung(this.note)})` : "")
    }
}

module.exports = Student