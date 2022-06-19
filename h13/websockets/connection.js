let players = {}

module.exports = (socket, req) => {
    socket.on('message', (message) => {
        message = message.toString()

        if (message.startsWith('ADD ')) {
            message = message.replace('ADD ', '').split(' | ')

            players[message[0]] = socket

            let player1 = players[message[0]]
            let player2 = players[message[1]]

            if (message[1]) {
                player1.oppenent = player2
                player2.oppenent = player1

                player2.send(`OPPONENT ${message[0]}`)

                player1.send('START')
                player2.send('START')
            }
        } else if (message.startsWith('CHOOSE ')) {
            message = message.replace('CHOOSE ', '').split(' | ')

            let player = message[0]
            let selection = message[1]

            console.log(message)

        } else {
            console.log(message)
        }
    })

    socket.on('close', () => {
        //TODO redirect
        console.log('guna')
    })
}