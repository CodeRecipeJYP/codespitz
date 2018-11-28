const Task = class {
    constructor (title, date) {
        if (!title) {
            error("invalid title");
        }
        this._title = title;
        this._date = date;
        this._isComplete = false;
        this._list = [];
    }

    isComplete() {
        return this._isComplete;
    }

    toggle() {
        this._isComplete = !this._isComplete;
    }

    add(title, date = null) {
        this._list.push(new Task(title, date));
    }

    remove(task) {
        const list = this._list;
        if (list.includes(task)) {
            list.splice(list.indexOf(task), 1);
        }
    }

    byTitle(stateGroup = true) {
        return this.list('title', stateGroup);
    }

    byDate(stateGroup = true) {
        return this.list('date', stateGroup);
    }

    list(sort, stateGroup = true) {
        if (!(sort === 'title' || sort === 'date')) {
            error('invalid param');
            return;
        }

        const list = this._list;
        const sortFunc = (a, b) => a['_' + sort] > b['_' + sort];
        const mapFunc = task => task.list(sort, stateGroup);

        return {
            task: this,
            list: (!stateGroup ? [...list].sort(sortFunc) : [
                ...list.filter(v => !v.isComplete()).sort(sortFunc),
                ...list.filter(v => v.isComplete()).sort(sortFunc),
            ]).map(mapFunc)
        };
    }
};

const Renderer = class {
    render({task, list}) {
        const v = this._folder(task);
        this.subTask(this._parent(v, task), list);
    }

    subTask(parent, list) {
        list.forEach(({task, list}) => {
            const v = this._task(parent, task);
            this.subTask(this._parent(v, this), list);
        });
    }

    // template-method pattern
    _folder(task) {
        error("override");
    }

    _parent(v, task) {
        error("override");
    }

    _task(v, task) {
        error("override");
    }
};

const DomRenderer = class extends Renderer {
    constructor(parent) {
        super();
        this._p = parent;
    }

    _folder({ _title: title}) {
        const parent = document.querySelector(this._p);
        parent.innerHTML = '';
        parent.appendChild(el('h1', {innerHTML: title}));
        return parent;
    }

    _parent(v, _) {
        return v.appendChild(el('ul'));
    }

    _task(v, {_title: title}) {
        const li = v.appendChild(el('li'));
        li.appendChild(el('div', {innerHTML: title}));
        return li;
    }
};

const ConsoleRenderer = class extends Renderer {
    _folder({ _title: title}) {
        console.log('-------------');
        console.log('folder:', title);
        return '';
    }

    _parent(v, _) {
        return v;
    }

    _task(v, {_title: title}) {
        console.log(v, title);
        return v + '-';
    }
};

// lexical == 변수라고 간주
