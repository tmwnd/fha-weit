function set_action_listener() {
    Array.from(document.getElementsByClassName('praktikum_action'))
        .filter(action => action.disabled == true)
        .forEach(action => {
            console.log(action.textContent)
            if (action.textContent != '') {
                action.disabled = false
                action.addEventListener('click', event => {
                    fetch(`https://weit.tmwnd.de/actions/${event.target.textContent}/${event.target.id.replace('btn_', '')}`)
                    location.reload()
                })
            }
        })
}

fetch('/')
    .then(set_action_listener)