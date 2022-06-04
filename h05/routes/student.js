var studierende = require('./../modules/student_factory.js')

const express = require('express')

var student_route = express.Router()
student_route.get('/', function (req, res) {
    res.set('Content-Type', 'text/plain')

    studierende.forEach(student => {
        res.write(student.toString() + "\n")
    });

    res.send()
})

module.exports = student_route