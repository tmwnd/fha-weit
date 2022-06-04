function getFalafel(next) {
    const falafel = "Falafel"
    console.log(falafel + " aus dem Kühlschrank geholt")
    next(falafel)
}

function fryFalafel(falafel, next) {
    setTimeout(function () {
        const friedFalafel = "Frittierte " + falafel
        console.log(falafel + " frittiert")
        next(friedFalafel)
    }, 1000);
}

function getWrap(friedFalafel, next) {
    const wrap = "Wrap"
    console.log(wrap + " aus dem Schrank geholt")
    next(wrap, friedFalafel)
}

function assembleFalafelWrap(wrap, friedFalafel, next) {
    const falafelwrap = "Falafel-Wrap"
    console.log(friedFalafel + " in " + wrap + " gewickelt")
    next(falafelwrap)
}

function prepareFalafelWrap() {
    getFalafel((falafel) => {
        fryFalafel(falafel, (friedFalafel) => {
            getWrap(friedFalafel, (wrap, friedFalafel) => {
                assembleFalafelWrap(wrap, friedFalafel, (falafelwrap) => {
                    serve(falafelwrap)
                })
            })
        })
    })
}

function serve(meal) {
    console.log(meal + " serviert")
}

prepareFalafelWrap()