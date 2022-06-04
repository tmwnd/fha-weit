// Erstellen Sie nun den clientseitigen JavaScript-Code in der Datei todos.js (Ordner public/javascripts)
const todo_tpl = fetch("./templates/todo.tpl.html").then(file => file.text())

const url = 'https://weit.tmwnd.de/h10/'
const todo_root_url = 'https://weit.tmwnd.de/h08/todos' // ich habe mal h08 recycelt hoffe das ist ok

var get_id = element => element.id.replace(element.tagName.toLowerCase() + '_', '')
// Zusätzlich müssen asynchrone Aufrufe zum Server mittels fetch-API durchgeführt werden um die Daten zu speichern/anzufordern
var post_todo = title => fetch(todo_root_url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 'title': title })
})
    .then(() =>
        fetch(todo_root_url)
            .then(response => response.json())
            .then(todos => todos.slice(-1)[0])
            .then(todo => add_todo(todo))
    )

async function set_submit_listener(submit) {
    // Zusätzlich müssen asynchrone Aufrufe zum Server mittels fetch-API durchgeführt werden um die Daten zu speichern/anzufordern
    await fetch(todo_root_url + '/' + get_id(submit))
        .then(response => response.json())
        .then(todo => submit.checked = todo.done)

    // Hier sind Event-Handler notwendig, die an das DOM gebunden werden und selbiges anschließend manipulieren
    submit.addEventListener('click', () => {
        fetch(todo_root_url + '/' + get_id(submit), { method: 'PATCH' })
    })
}

function set_button_listener(button) {
    // Hier sind Event-Handler notwendig, die an das DOM gebunden werden und selbiges anschließend manipulieren
    button.addEventListener('click', () => {
        // Zusätzlich müssen asynchrone Aufrufe zum Server mittels fetch-API durchgeführt werden um die Daten zu speichern/anzufordern
        fetch(todo_root_url + '/' + get_id(button), { method: 'DELETE' })

        var div = button.parentElement
        div.parentElement.removeChild(div)
    })
}

async function add_todo(
    todo_json,
    tpl = null,
    dynamic_todos = document.getElementById('dynamic_todos')
) {
    if (tpl == null)
        tpl = await todo_tpl  // kann ich irgendwie sagen, dass todo_tpl const ist, jedoch ebenfalls awaited wird?

    dynamic_todos.insertAdjacentHTML('beforeend', Mustache.render(tpl, todo_json))

    set_submit_listener(document.getElementById('input_' + todo_json.id))
    set_button_listener(document.getElementById('button_' + todo_json.id))
}

function set_submit_todo_listener() {
    // Hier sind Event-Handler notwendig, die an das DOM gebunden werden und selbiges anschließend manipulieren
    document.getElementById('submit').addEventListener('click', () => {
        let input_todo = document.getElementById('input_todo')

        post_todo(input_todo.value)
        input_todo.value = ''
    })
}

async function set_todos() {
    // sollte man mal mehr todos haben, würde ich zumindest dynamic_todos zwischenspeichern
    let tpl = await todo_tpl
    let dynamic_todos = document.getElementById('dynamic_todos')

    // Zusätzlich müssen asynchrone Aufrufe zum Server mittels fetch-API durchgeführt werden um die Daten zu speichern/anzufordern
    await fetch(todo_root_url)
        .then(response => response.json())
        .then(todos => todos.forEach(todo => add_todo(todo, tpl, dynamic_todos)))
}

function set_rem_done_listener() {
    // Hier sind Event-Handler notwendig, die an das DOM gebunden werden und selbiges anschließend manipulieren
    document.getElementById('del_done').addEventListener('click', () =>
        Array.from(document.getElementsByClassName('del'))
            .filter(element => element.tagName == 'BUTTON')
            .filter(button => document.getElementById('input_' + get_id(button)).checked)
            .forEach(button => button.click()) // ich könnte vermutlich ebenfalls die Route aus h08 nutzen, aber müsste sowieso meine view anpassen, also ist dies mMn. sinnvoller
    )
}

var set_reset_listener = () => document.getElementById('reset')
    .addEventListener('click', async () =>
        fetch(todo_root_url, { method: 'DELETE' })
            .then(() => Promise.resolve())
            .then(() => ['Geschenk fuer Jupp kaufen', 'FitX mit den Bres', 'WEIT ueben... lol']
                .forEach(todo => post_todo(todo))
            )
            .then(() => document.getElementById('dynamic_todos').innerHTML = '')
            .then(set_todos)
            .then(() => location.reload())
    ) // reset

fetch(url)
    .then(set_submit_todo_listener)
    .then(set_todos)
    .then(set_rem_done_listener)
    .then(set_reset_listener)