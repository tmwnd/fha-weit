const Student = require('./../modules/student.js')

const express = require('express')

var studentFactory_route = express.Router()
studentFactory_route.get('/', function (req, res) {
    res.set('Content-Type', 'text/plain')

    var studentFactory = (name) => {
        var student = new Student(name)
        student.note = 5
        return student
    }

    res.send(studentFactory('Max').toString())
})

module.exports = studentFactory_route