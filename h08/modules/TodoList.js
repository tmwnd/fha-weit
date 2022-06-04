class Todo {
    id
    title
    done

    constructor(id, title, done) {
        this.id = id
        this.title = title
        this.done = done
    }

    toString() {
        return `- (id:${this.id}) [${(this.done) ? 'X' : ' '}] ${this.title}`
    }
}

// Es bietet sich an eine Klasse zu implementieren, um die TodoList zu verwalten. -> wenn schon oop, dann komplett, deswegen Todo
// Sie dürfen folgende Klasse verwenden. -> nah
// Legen Sie diese im Ordner modules ab. -> ok
module.exports = class TodoList extends Array {
    last_id = 0;

    constructor() { super() }

    addTodo(title) {
        let todo = new Todo(this.last_id++, title, false)
        this.push(todo)
        return todo
    }

    getTodo(id) {
        return this.reduce((ret, todo) => {
            if (todo.id == id)
                return todo
            return ret
        }, undefined)
    }

    getAllTodos() {
        return this
    }

    removeTodo(id) {
        let todo = this.getTodo(id)
        this.where(element => element != todo)
        return todo
    }

    where(condition) {
        this.remove(element => !condition(element))
    }

    remove(condition) {
        this.filter(condition).forEach(element => {
            this.splice(this.indexOf(element), 1)
        })
        if (this.length == 0)
            this.last_id = 0
    }
}