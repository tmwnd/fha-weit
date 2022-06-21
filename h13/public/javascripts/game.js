let API_ROUTE_URL = '/h13/api/'

let socket

function set_winner(winner) {
    switch (winner) {
        case '-1':
            winner = 'draw'
            break
        case '0':
            winner = document.getElementById('player').textContent
            document.getElementById('player_wins').textContent = parseInt(document.getElementById('player_wins').textContent) + 1
            break
        case '1':
            winner = document.getElementById('opponent').textContent
            document.getElementById('opponent_wins').textContent = parseInt(document.getElementById('opponent_wins').textContent) + 1
            break
    }

    document.getElementById('winner').textContent = winner
}

function add_socket() {
    if (document.getElementById('opponent').textContent.startsWith('bot_'))
        return

    socket = new WebSocket('wss://weit.tmwnd.de/h13/websockets')

    socket.onopen = () => {
        console.log('connected')

        let name = document.getElementById('player').textContent
        let opponent = document.getElementById('opponent').textContent
        let gamemode = document.getElementById('gamemode').textContent

        if (opponent)
            socket.send(`ADD ${name} | ${opponent}`)
        else {
            socket.send(`ADD ${name}`)
            socket.send(`GAMEMODE ${name} | ${gamemode}`)
        }
    }

    socket.onmessage = (message) => {
        message = message.data

        if (message.startsWith('OPPONENT '))
            document.getElementById('opponent').textContent = message.replace('OPPONENT ', '')
        else if (message.startsWith('OPPONENT_GESTURE '))
            document.getElementById('opponent_gesture').textContent = message.replace('OPPONENT_GESTURE', '')
        else if (message.startsWith('WINNER '))
            set_winner(message.replace('WINNER ', ''))
        else
            console.log(message)
    }
}

function set_radio_listener() {
    Array
        .from(document.getElementsByClassName('gesture'))
        .forEach(gesture => gesture.addEventListener('click', event => {
            document.getElementById('btn_select').disabled = false
        }))
}

function set_select_listener() {
    document.getElementById('btn_select').addEventListener('click', async event => {
        let gesture = Array
            .from(document.getElementById('gestures').children)
            .filter(gesture => Array.from(gesture.getElementsByClassName('gesture'))[0].checked)[0]

        let name = document.getElementById('player').textContent
        let gamemode = document.getElementById('gamemode').textContent

        gesture = Array
            .from(gesture.getElementsByClassName('name'))[0]
            .textContent

        document.getElementById('player_gesture').textContent = gesture

        if (socket)
            socket.send(`SELECT ${name} | ${gesture}`)
        else {
            let bot_gesture = await fetch(API_ROUTE_URL + 'random', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'gamemode': gamemode })
            })
                .then(response => response.text())

            document.getElementById('opponent_gesture').textContent = bot_gesture

            let winner = await fetch(API_ROUTE_URL + 'winner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'gamemode': gamemode,
                    'gesture1': gesture,
                    'gesture2': bot_gesture
                })
            })
                .then(response => response.text())

            set_winner(winner)
        }
    })
}

window.onload = () => {
    add_socket()
    set_radio_listener()
    set_select_listener()
}