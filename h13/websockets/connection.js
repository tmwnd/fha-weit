let players = {}

const GESTURES = require('./../modules/gamemodes.js')

module.exports = (socket, req) => {
    socket.on('message', (message) => {
        message = message.toString()

        if (message.startsWith('ADD ')) {
            message = message.replace('ADD ', '').split(' | ')

            players[message[0]] = {}
            players[message[0]].socket = socket

            let player1 = players[message[0]]

            if (message[1]) {
                let player2 = players[message[1]]

                player1.oppenent = player2
                player2.oppenent = player1

                player1.gamemode = player2.gamemode

                player2.socket.send(`OPPONENT ${message[0]}`)

                player1.socket.send('START')
                player2.socket.send('START')
            }
        } else if (message.startsWith('GAMEMODE ')) {
            message = message.replace('GAMEMODE ', '').split(' | ')

            let player = message[0]
            let gamemode = message[1]

            players[player].gamemode = gamemode
        } else if (message.startsWith('SELECT ')) {
            message = message.replace('SELECT ', '').split(' | ')

            let player = players[message[0]]
            let gesture = message[1]

            if (player.socket == socket && !player.gesture) {
                player.gesture = gesture

                if (player.oppenent.gesture) {
                    let gamemode = player.gamemode
                    let oppenent_gesture = player.oppenent.gesture

                    player.socket.send(`OPPONENT_GESTURE ${oppenent_gesture}`)
                    player.oppenent.socket.send(`OPPONENT_GESTURE ${gesture}`)

                    let logic = GESTURES[gamemode].logic

                    player.socket.send(`WINNER ${-1 + logic[gesture].includes(oppenent_gesture) + 2 * logic[oppenent_gesture].includes(gesture)}`)
                    player.oppenent.socket.send(`WINNER ${-1 + logic[oppenent_gesture].includes(gesture) + 2 * logic[gesture].includes(oppenent_gesture)}`)
                }
            }
        } else if (message.startsWith('RESTART')) {
            let player = players[message.replace('RESTART ', '')]

            if (player.socket == socket) {
                delete player.gesture
                delete player.oppenent.gesture

                player.oppenent.socket.send('RESTART ')
            }
        } else {
            console.log(message)
        }
    })

    socket.on('close', () => {
        //TODO delete player
        console.log('guna')
    })
}