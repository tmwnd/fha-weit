function add_socket() {
    let socket = new WebSocket('wss://weit.tmwnd.de/h13/websockets')

    socket.onopen = () => {
        console.log('connected')

        let name = document.getElementById('player').textContent
        let opponent = document.getElementById('opponent').textContent

        if (opponent)
            socket.send(`ADD ${name} | ${opponent}`)
        else
            socket.send(`ADD ${name}`)
    }

    socket.onmessage = (message) => {
        message = message.data

        if (message.startsWith('OPPONENT '))
            document.getElementById('opponent').textContent = message.replace('OPPONENT ', '')
        else
            console.log(message)
    }
}

window.onload = () => {
    add_socket()
}