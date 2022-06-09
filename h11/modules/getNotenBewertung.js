let noten = {
    1: "sehr gut",
    2: "gut",
    3: "befriedigend",
    4: "ausreichend",
    5: "mangelhaft",
    6: "ungenügend"
}

function getNotenBewertung(n) {
    return (n in noten) ? noten[n] : `Keine Note ${n} gefunden`
}

module.exports = getNotenBewertung