class Filling {
    name
    constructor(name) { this.name = name }
    toString() { return this.name }
}
class Fryable extends Filling {
    status = "roh"
    fry_time
    constructor(name, fry_time = 1000) { super(name); this.fry_time = fry_time }
    fry() { this.status = "gebraten" }
    toString() { return `${this.name} (${this.status})` }
}

class Wrap {
    filling = []
    fill(filling) { this.filling.push(filling) }
    toString() {
        var ret = "Erhaltener Wrap mit:\n"
        this.filling.forEach(filling => {
            ret += "- " + filling.toString() + "\n"
        })
        return ret
    }
}

var get_falafel = () => {
    console.log("Falafel aus dem Kühlschrank geholt")
    return new Fryable("Falafel")
}
var get_wrap = () => {
    console.log("Wrap aus dem Schrank geholt")
    return new Wrap()
}

var fry = fryable => {
    return new Promise(function (resolve) {
        setTimeout(() => {
            console.log(fryable + " frittiert")
            fryable.fry()
            resolve(fryable)
        }, fryable.fry_time)
    })
}

var fill = (wrap, fillings) => {
    fillings.forEach(filling => {
        console.log(filling.toString() + " in Wrap gewickelt")
        wrap.fill(filling)
    })
}

var serve = (wrap) => {
    console.log("Falafel-Wrap serviert:\n")
    console.log(wrap.toString())
}

var prepare_falafel_wrap = async () => {
    var [hühnchen, falafel, wrap] = await Promise.all([
        fry(new Fryable("veganes Hühnchen", 3000)),
        fry(get_falafel()),
        get_wrap()
    ])

    fill(wrap, [
        falafel,
        hühnchen,
        await fry(new Fryable("vegane Dinonuggets")), // zuerst vergessen, mussten noch schnell gemacht werden
        new Filling("Veta"), // Feta in lecker
        new Filling("Zwiebeln"),
        new Filling("Zwiebeln"),
        new Filling("Zwiebeln"),
        new Fryable("Paprika"), // roh und gebraten essbar
        new Filling("Tomaten"),
        new Filling("Gurke"),
        new Filling("Mais"),
        new Filling("Oliven"),
        new Filling("Rote Bete"),
        new Filling("veganer Käse"),
    ])

    fill(wrap, [
        new Filling("vegane Mayo"),
        /* new Filling("Avocado"), */
        new Filling("Hela Gewürz Ketchup Knoblauch pikant"),
        new Filling("Pommessalz") // ein bisschen oben drüber streuen
    ])

    serve(wrap)
}

prepare_falafel_wrap()