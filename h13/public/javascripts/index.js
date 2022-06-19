const player_tpl = fetch("/h13/templates/partials/player.html").then(file => file.text())
const gamemode_tpl = fetch("/h13/templates/partials/gamemode.html").then(file => file.text())

const bots = ['tim', 'paddel', 'jupp', 'felix', 'murloc']
const gamemodes = ['Stein-Schere-Papier (Klassisch)', '+Brunnen', 'Stein-Schere-Papier-Echse-Spock']

let format = (player, id) => `${player}#${('0000' + id).slice(-4)}`
let post_player = (name, oppenent) => {
    fetch('/h13/api/player', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'name': name, 'mode': 'default', 'available': false })
    })
        .then(response => response.json())
        .then(player => {
            let form = document.createElement('form')
            form.method = 'POST'
            form.action = '/h13/game'

            form.hidden = true
            document.body.appendChild(form)

            let input_name = document.createElement('input')
            input_name.name = 'name'
            input_name.value = format(document.getElementById('name').value, player.id)
            form.appendChild(input_name)

            if (oppenent) {
                let input_opponent = document.createElement('input')
                input_opponent.name = 'opponent'
                input_opponent.value = oppenent
                form.appendChild(input_opponent)
            }

            form.submit()
        })
}

async function add_gamemodes() {
    let tpl = await gamemode_tpl

    let rendered_gamemodes = ''
    gamemodes.forEach(gamemode => {
        rendered_gamemodes += Mustache.render(tpl, { 'name': gamemode }) + '\n'
    })
    document.getElementById('gamemode').innerHTML = rendered_gamemodes
}

function add_ki() {
    fetch('/h13/api/player', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'name': `bot_${bots[Math.floor(Math.random() * bots.length)]}`, 'mode': 'default' })
    })
}

async function fill_player() {
    let tpl = await player_tpl

    await fetch('/h13/api/players')
        .then(response => response.json())
        .then(players => {
            let rendered_list = ''
            for (let id in players) {
                rendered_list += Mustache.render(tpl, { 'name': format(players[id].name, id) }) + '\n'
            }
            return rendered_list
        })
        .then(rendered_list => document.getElementById('dynamic_players').innerHTML = rendered_list)
}

function set_submit_listener() {
    document.getElementById('btn_submit').addEventListener('click', event => {
        let name = document.getElementById('name').value

        if (name == '')
            return event.preventDefault()

        post_player(name)
    })
}

function set_challenge_listener() {
    console.log(document.getElementsByClassName('challenge').length)
    Array.from(document.getElementsByClassName('challenge')).forEach(challenge => challenge.addEventListener('click', event => {
        let name = document.getElementById('name').value

        if (name == '')
            return event.preventDefault()

        post_player(name, event.target.parentNode.getElementsByClassName('name')[0].textContent)
    }))
}

window.addEventListener("load", event => {
    Promise.resolve()
        .then(add_gamemodes)
        .then(add_ki)
        .then(fill_player)
        .then(set_submit_listener)
        .then(set_challenge_listener)
})