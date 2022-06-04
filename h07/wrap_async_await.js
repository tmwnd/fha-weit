function getFalafel() {
    const falafel = "Falafel"
    console.log(falafel + " aus dem Kühlschrank geholt")
    return /* Promise.resolve(...) */ falafel
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
    return /* Promise.resolve(...) */ wrap
}

function assembleFalafelWrap(wrap, friedFalafel) {
    const falafelwrap = "Falafel-Wrap"
    console.log(friedFalafel + " in " + wrap + " gewickelt")
    return /* Promise.resolve(...) */ falafelwrap
}

async function prepareFalafelWrap() {
    // Da ausschließlich fryFalafel nicht synchron läuft, kann man sich die Promises bzw await in den Methoden sparen.
    var [friedFalafel, wrap] = await Promise.all([
        fryFalafel(/*await*/ getFalafel()),
        getWrap()
    ])
    var falafelwrap = /*await*/ assembleFalafelWrap(wrap, friedFalafel)
    serve(falafelwrap)
}

function serve(meal) {
    console.log(meal + " serviert")
}

prepareFalafelWrap()