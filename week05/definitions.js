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
    constructor(processor) {
        this.p = processor;
        processor.setObserver(this);
    }

    observe(type) {
        if (type == 'rerender') {
            this.rerender();
        }
    }

    rerender() {
        if (this.oldList) {
            this.render(this.oldList);
        }
    }

    render(list) {
        this.oldList = list;
        const {
            task,
            list: sublist,
        } = list;

        this.p.folder(task);
        this.p.parent(task);
        this.subTask(sublist);
    }

    subTask(list) {
        list.forEach(({task, list}) => {
            this.p.task(task);
            if (list.length) {
                this.p.parent(task);
                this.subTask(list);
            }
        });
    }
};

Renderer.Processor = class {
    constructor() {
        this.prop = Object.create(null);
        this._tv = TaskView.base;
    }

    observe(msg) {
        this.notify(msg);
    }

    setObserver(v) {
        this.observer = v;
    }

    notify(msg) {
        this.observer && this.observer.observe(msg);
    }

    taskView(...tv) {
        tv.forEach(eachTv => {
            eachTv.set(this._tv);
            this._tv = eachTv;
        });
    }

    folder(task) {
        error('override');
    }

    task(task) {
        error('override');
    }

    parent(task) {
        error('override');
    }

    taskRender(task) {
        this._tv.setObserver(this);
        return this._tv.task(this.prop.ptask, task);
    }
};

const Dom = class extends Renderer.Processor {
    constructor(parent) {
        super();
        this._p  = parent;
        this._tv = TaskView.base;
    }

    folder({_title: title}) {
        const parent = document.querySelector(this._p);
        parent.innerHTML = "";
        parent.appendChild(el('h1', {innerHTML: title}));
        this.prop.parent = parent;
    }

    task(task) {
        const li = el('li', {
            innerHTML: this.taskRender(task)
            // innerHTML: this._tv.task(this.prop.ptask, task)
        });
        // li.appendChild(el('div', {innnerHTML: task._title}));
        this.prop.parent.appendChild(li);
        this.prop.parent = li;
    }

    parent(task) {
        const ul = el('ul');
        this.prop.parent.appendChild(ul);
        this.prop.parent = ul;
        this.prop.ptask = task;
    }
};

const TaskView = class {
    setObserver(v) {
        this.observer = v;
    }

    notify(msg) {
        if (this.observer) {
            this.observer.observe(msg);
        }
    }

    set(tv) {
        this._tv = tv;
    }

    task(parent, task) {
        this.result = this._prev ? this._tv.task(parent, task) : task._title;
        return this._task(parent, task);
    }

    _task(parent, task) {
        error("override");
    }
};

TaskView.base = new (class extends TaskView {
    _task(parent, task) {
        return this.result;
    }
});

const Priority = class extends TaskView {
    _task(parent, task) {
        return this.result.replace(
            /\[(urgent|high|normal|low)\]/gi, '<span class="$1">$1</span>'
        );
    }
};

const Member = class extends TaskView {
    constructor(...members) {
        super();
        this._reg = new RegExp(`@(${members.join('|')})`, 'g');
    }

    _task(task, parent, prev) {
        return this.result.replace(
            this._reg, '<a href="member/$1">$1</a>'
        );
    }
};

const Remove = class extends TaskView {
    _task(parent, task) {
        const id = Remove.id++;
        Remove[id] = (_) => {
            delete Remove[id];
            parent.remove(task);
            this.notify('rerender');
        };

        return this.result + ` <a onclick="Remove[${id}]()">X</a>`;
    }
};
Remove.id = 0;
