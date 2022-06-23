let API_ROUTE_URL = '/h13/api/'

let socket

function restart() {
    let btn_select = document.getElementById('btn_select')
    btn_select.disabled = true

    player_gesture.textContent = ''
    Array.from(player_gesture.classList).forEach(gesture => player_gesture.classList.remove(gesture))
    Array.from(opponent_gesture.classList).forEach(gesture => opponent_gesture.classList.remove(gesture))

    Array
        .from(document.getElementById('gestures').children)
        .forEach(gesture => {
            gesture = Array.from(gesture.getElementsByClassName('gesture'))[0]
            gesture.checked = false
            gesture.disabled = false
        })

    document.getElementById('gestures').classList.remove('hidden')

    btn_select.textContent = 'select'
}

function set_winner(winner) {
    let name = document.getElementById('player').textContent

    switch (winner) {
        case '-1':
            winner = 'draw'
            break
        case '0':
            winner = document.getElementById('player').textContent
            document.getElementById('player_wins').textContent = parseInt(document.getElementById('player_wins').textContent) + 1
            document.getElementById('player_gesture').classList.add('winner')
            break
        case '1':
            winner = document.getElementById('opponent').textContent
            document.getElementById('opponent_wins').textContent = parseInt(document.getElementById('opponent_wins').textContent) + 1
            document.getElementById('opponent_gesture').classList.add('winner')
            break
    }

    setTimeout(() => {
        let btn_select = document.getElementById('btn_select')
        btn_select.textContent = 'restart'
        btn_select.disabled = false
    }, 1500)
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

        if (message.startsWith('OPPONENT ')) {
            document.getElementById('opponent').textContent = message.replace('OPPONENT ', '')

            Array
                .from(document.getElementById('gestures').children)
                .forEach(gesture => Array.from(gesture.getElementsByClassName('gesture'))[0].disabled = false)
        }
        else if (message.startsWith('OPPONENT_GESTURE ')) {
            document.getElementById('gestures').classList.add('hidden')

            let opponent_gesture = document.getElementById('opponent_gesture')
            opponent_gesture.textContent = message.replace('OPPONENT_GESTURE ', '')
            opponent_gesture.classList.add(message.replace('OPPONENT_GESTURE ', ''))
        }
        else if (message.startsWith('WINNER '))
            set_winner(message.replace('WINNER ', ''))
        else if (message.startsWith('RESTART '))
            restart()
        else
            console.log(message)
    }
}

function set_radio_listener() {
    let oppenent = document.getElementById('opponent').textContent
    Array
        .from(document.getElementsByClassName('gesture'))
        .forEach(gesture => {
            if (!socket || oppenent != '')
                gesture.disabled = false

            gesture.addEventListener('click', event => {
                document.getElementById('btn_select').disabled = false
            })
        })
}

function set_select_listener() {
    document.getElementById('btn_select').addEventListener('click', async event => {
        let player_gesture = document.getElementById('player_gesture')
        let opponent_gesture = document.getElementById('opponent_gesture')

        switch (event.target.textContent) {
            case 'select':
                event.target.disabled = true

                Array
                    .from(document.getElementById('gestures').children)
                    .forEach(gesture => Array.from(gesture.getElementsByClassName('gesture'))[0].disabled = true)

                let gesture = Array
                    .from(document.getElementById('gestures').children)
                    .filter(gesture => Array.from(gesture.getElementsByClassName('gesture'))[0].checked)[0]

                let name = document.getElementById('player').textContent
                let gamemode = document.getElementById('gamemode').textContent

                gesture = Array
                    .from(gesture.getElementsByClassName('name'))[0]
                    .textContent

                player_gesture.textContent = gesture
                player_gesture.classList.add(gesture)

                if (socket)
                    socket.send(`SELECT ${name} | ${gesture}`)
                else {
                    document.getElementById('gestures').classList.add('hidden')

                    let bot_gesture = await fetch(API_ROUTE_URL + 'random', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 'gamemode': gamemode })
                    })
                        .then(response => response.text())

                    opponent_gesture.textContent = bot_gesture
                    opponent_gesture.classList.add(bot_gesture)

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
                break
            case 'restart':
                restart()

                if (socket)
                    socket.send(`RESTART ${document.getElementById('player').textContent}`)

                break;
        }
    })
}

window.onload = () => {
    add_socket()
    set_radio_listener()
    set_select_listener()
}