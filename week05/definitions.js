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
        tv.forEach(tv => this._tv = v.set(this._tv));
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
        this._tv.task(this.prop.ptask, task);
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
        this.prop.parennt.appendChild(li);
        this.prop.parennt = li;
    }

    parent(task) {
        const ul = el('ul');
        this.prop.parent.appendChild(ul);
        this.prop.parent = ul;
        this.prop.ptask = task;
    }

    taskView(...tv) {
        tv.forEach(tv => this._tv = v.set(this._tv));
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
        return this;
    }

    task(parennt, task) {
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
    constructor(render) {
        super();
        this._render = render;
    }

    _task(parent, task) {
        const id = Remove.id++;
        Remove[id] = (_) => {
            delete Remove[id];
            parent.remove(task);
            this.notify('rerender');
        };

        return this.result + `<a onclick="Remove[${id}]()">X</a>`;
    }
};
Remove.id = 0;
