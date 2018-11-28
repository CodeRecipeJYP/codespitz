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
    constructor(visitor) {
        this.visitor = visitor;
    }

    render({task, list}) {
        const v = this.visitor.folder(task);
        this.subTask(this.visitor.parent(v, task), list);
    }

    subTask(parent, list) {
        list.forEach(({task, list}) => {
            const v = this.visitor.task(parent, task);
            this.subTask(this.visitor.parent(v, this), list);
        });
    }
};

// #1 dom비지터를 기반으로 정렬과 각 태스크별 완료 체크를 할수있게 구현하시오.
// app renderer 수준을 만들어서 todo app 전체렌더러를만드는것도방법이다?
// #2

// lexical == 변수라고 간주

// 전략객체지만 recursive 내에서 역할을 수행함.
// for문 안에 있는 역할을 위임할수있다면
const Visitor = class {
    folder(task) {
        error("override");
    }

    parent(v, task) {
        error("override");
    }

    task(v, task) {
        error("override");
    }
};

const DomVisitor = class extends Visitor {
    constructor(parent) {
        super();
        this._p = parent;
    }

    folder({ _title: title}) {
        const parent = document.querySelector(this._p);
        parent.innerHTML = '';
        parent.appendChild(el('h1', {innerHTML: title}));
        return parent;
    }

    parent(v, _) {
        return v.appendChild(el('ul'));
    }

    task(v, {_title: title}) {
        const li = v.appendChild(el('li'));
        li.appendChild(el('div', {innerHTML: title}));
        return li;
    }
};

const ConsoleVisitor = class extends Visitor {
    folder({ _title: title}) {
        console.log('-------------');
        console.log('folder:', title);
        return '';
    }

    parent(v, _) {
        return v;
    }

    task(v, {_title: title}) {
        console.log(v, title);
        return v + '-';
    }
};
