// Erstellen Sie in der app.js eine Funktion, die eine Studenten-Factory erstellt.
// Die Funktion erwartet als Übergabe eine Zahl (Note), welche anschließend von der Studenten-Factory benutzt wird.
// Die Studenten-Factory erstellt ein Objekt des Typs Student und setzt die Note anschließend auf die vorher übergebene Zahl.
function createStudentFactory(n) {
    return function (name) {
        var student = new Student(name)
        student.note = n
        return student
    }
}

let studentFactory = createStudentFactory(5)

// Erstellen Sie anschließend drei Objekte der Klasse Student und speichern Sie diese in einem Array.
// Erzeugen Sie anschließend mit Hilfe einer Factory mehrere Benutzer und speichern Sie diese in einem Array.
var studierende = [
    studentFactory("Paddel"),
    studentFactory("Tim"),
    studentFactory("Finn Driedinger"),
    studentFactory("Jupp Bruns")
]

// Lassen Sie sich das Array ausgeben.
// Alle Benutzer, die mit der gleichen Factory erstellt wurden, müssen die gleiche Note haben.
studierende.forEach(student => {
    console.log(student.toString())
});

// Ändern Sie die Noten der Studierenden.
console.log("--- Anpassen der Note ---")
studierende[1].note = 1;
studierende[0].note = 2;

// Geben Sie das Array einmal vor und einmal nach Sortierung aus. 
studierende.forEach(student => {
    console.log(student.toString())
});

// Erstellen Sie in der app.js eine anonyme Funktion, die anschließend zum Sortieren des Arrays genutzt werden soll
var sort = function (s1, s2) {
    if (s1.note == undefined)
        return -1
    if (s2.note == undefined)
        return 1
    return s1.note - s2.note
}

console.log("--- sort ---")
studierende.sort(sort)

// Geben Sie das Array einmal vor und einmal nach Sortierung aus. 
studierende.forEach(student => {
    console.log(student.toString())
});