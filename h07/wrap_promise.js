function getFalafel() {
    const falafel = "Falafel"
    console.log(falafel + " aus dem Kühlschrank geholt")
    return falafel
}

function fryFalafel(falafel) {
    return new Promise(resolve => {
        setTimeout(function () {
            const friedFalafel = "Frittierte " + falafel
            console.log(falafel + " frittiert")
            resolve(friedFalafel)
        }, 300);
    })
}

function getWrap() {
    const wrap = "Wrap"
    console.log(wrap + " aus dem Schrank geholt")
    return wrap;
}

function assembleFalafelWrap(wrap, friedFalafel) {
    const falafelwrap = "Falafel-Wrap"
    console.log(friedFalafel + " in " + wrap + " gewickelt")
    return falafelwrap
}

function prepareFalafelWrap() {
    Promise.all([
        new Promise(resolve => resolve(getFalafel()))
            .then(falafel => fryFalafel(falafel)),
        getWrap()
    ])
        .then(([friedFalafel, wrap]) => assembleFalafelWrap(wrap, friedFalafel))
        .then(falafelwrap => serve(falafelwrap))
}

function serve(meal) {
    console.log(meal + " serviert")
}

prepareFalafelWrap()