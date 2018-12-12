const Model = class extends Set {
    constructor(prop) {
        super();
        this._prop = Object.assign(Object.create(null), prop);
    }

    add() {
        error("override");
    }

    delete() {
        error("override");
    }

    has() {
        error("override");
    }

    listen() {
        error("override");
    }

    addListener(c) {
        super.add(c);
    }

    removeListener(c) {
        super.delete(c);
    }

    notify() {
        this.forEach(v => v.listen(this));
    }
};

const Task = class extends Model {
    constructor(title) {
        super({
            title,
            isComplete: false,
            list: [],
        });
    }

    listen() {
        this.notify();
    }

    get title() {
        return this._prop.title;
    }

    get isComplete() {
        return this._prop.isComplete;
    }

    toggle() {
        this._prop.isComplete = !this._prop.isComplete;
        this.notify();
    }

    add(title) {
        const task = new Task(title);
        this._prop.list.push(task);
        task.addListener(this);
        this.notify();

        return task;
    }

    remove(task) {
        const list = this._prop.list;
        if (!list.includes(task)) {
            return;
        }

        list.splice(list.indexOf(task), 1);
        task.removeListener(this);
        this.notify();
    }

    list() {
        const list = this._prop.list.map(task => task.list());
        return {
            task: this,
            list,
        }
    }
};
