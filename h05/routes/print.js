const Student = require('./../modules/student.js')

var studentFactory = (name) => {
    var student = new Student(name)
    student.note = 5
    return student
}

const express = require('express')

function print(params, res) {
    res.set('Content-Type', 'text/plain')

    if (params.pw != "geheim") {
        res.send("Bitte verwenden Sie das richtige Passwort: 'geheim'")
        return
    }

    var studierender = studentFactory(params.user)
    studierender.note = parseInt(params.note)

    res.send(studierender.toString())
}

var print_route_post = express.Router()
print_route_post.post('/', function (req, res) {
    // Greifen Sie innerhalb der Routen auf die übergebenen Formulardaten zu.
    print(req.body, res)
})

var print_route_get = express.Router()
print_route_get.get('/', function (req, res) {
    // Greifen Sie innerhalb der Routen auf die übergebenen Formulardaten zu.
    print(req.query, res)
})

module.exports = { print_route_post, print_route_get }