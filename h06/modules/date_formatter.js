function pad(n) {
    return n.toString().padStart(2, '0')
}

// (Uhrzeit im Format hh:mm:ss)
module.exports = (date) => {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}