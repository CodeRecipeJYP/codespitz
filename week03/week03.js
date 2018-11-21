const Sort = class {
    static title = (a, b) => a.sortTitle(b);
    static date = (a, b) => a.sortDate(b);

    sortTitle(task) {
        error('override');
    }

    sortDate(task) {
        error('override');
    }
};

const Task = class extends Sort {
    static get(title, date = null) {
        return new Task(title, date);
    }

    // private constructor?
    constructor (title, date) {
        super();
        if (!title) {
            error("invalid title");
        }
        this._title = title;
        this._date = date;
        this._isComplete = false;
    }

    isComplete() {
        return this._isComplete;
    }

    toggle() {
        this._isComplete = !this._isComplete;
    }

    sortTitle(task) {
        return this._title > task._title;
    }

    sortDate(task) {
        return this._date > task._date;
    }
};
