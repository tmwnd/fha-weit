const express = require('express')

const TodoList = require('../modules/todo.model.js')

function printTodo(id, getTodo, res) {
    let todo = getTodo(id)
    if (todo !== undefined)
        res.send(todo) // ?? `Kein Todo mit der id ${id} gefunden`) -> mimimi ich will json
    else {
        res.type('plain/text');
        res.send(`Kein Todo mit der id ${id} gefunden`)
    }
}

let route_todos = express.Router()

var todos = new TodoList()
todos.addTodo('Geschenk fuer Jupp kaufen')
todos.addTodo('FitX mit den Bres')
todos.addTodo('WEIT ueben... lol') // das ist jetzt aber WEIT hergeholt

// GET: /todos | gibt alle Todos zurück
route_todos.get('/', (req, res) => {
    res.send(todos.filter(element => Object.entries(req.query).reduce((filter, [key, value]) => filter && (element[key]?.toString() == value ?? false), true)))
})

// PATCH: /todos/{id} | markiert das Todo mit der id {id} als erledigt
// PATCH: /todos/{id} | markiert das Todo mit der id {id} als nicht erledigt
// Kennzeichnen eines existierenden ToDos als erledigt
// Kennzeichnen eines existierenden ToDos als nicht erledigt -> 2 Methoden??
route_todos.patch('/:id', (req, res, next) => {
    var todo = todos.getTodo(parseInt(req.params.id))
    todo.done = !todo.done

    req.method = 'GET'; // ich weiß, das ist schmutzig, aber tbh schon irgendwie nice
    next()
})

// GET: /todos/{id} | gibt Todo mit der id {id} zurück
route_todos.get('/:id', (req, res) => {
    printTodo(
        parseInt(req.params.id),
        todos.getTodo.bind(todos),
        res
    )
})

// POST: /todos | fügt neues Todo hinzu
// Anlegen eines neuen ToDos
route_todos.post('/', (req, res) => {
    if (req.body["title"] == "")
        return
    res.send(todos.addTodo(req.body["title"]))
})

// DELETE: /todos?done=true | löscht alle erledigten Todos
// DELETE: /todos | löscht alle Todos
// Löschen aller erledigten ToDos -> das hier funktioniert auch, wenn man keine query angibt, da default löschen ist
route_todos.delete('/', (req, res) => {
    todos.where(element => Object.entries(req.query).reduce((filter, [key, value]) => filter || (element[key]?.toString() != value ?? true), false))
    res.send(todos.getAllTodos()) // todos = getAllTodos() -> getAllTodos() { return this } aber falls getAllTodos() anders implementiert wäre, hier der Vollständigkeit halber
})

// DELETE: /todos/{id} | löscht Todo mit der id {id}
// Löschen eines ToDos
route_todos.delete('/:id', (req, res) => {
    printTodo(
        parseInt(req.params.id),
        todos.removeTodo.bind(todos),
        res
    )
})

module.exports = route_todos