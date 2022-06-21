function set_default_gamemode() {
    Array.from(
        Array
            .from(document
                .getElementById('gamemodes')
                .children)[0]
            .children
    )[0].checked = true
}

window.onload = () => {
    set_default_gamemode()
}