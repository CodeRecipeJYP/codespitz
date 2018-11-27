const Task = class {
    // private constructor?
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
        this.notifyListener();
    }

    notifyListener() {
        if (this._onToggleListener) {
            this._onToggleListener(this._isComplete);
        }
    }

    setOnToggleListener(listener) {
        if (typeof listener !== 'function') {
            error("invalid listener");
            return;
        }

        this._onToggleListener = listener;
    }

    // 유일한 생성점, 진입점이 필요함. 자기참조무결성?
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

const el = (tag, attr={}) => Object.entries(attr).reduce((el, v) => {
    typeof el[v[0]] === 'function' ? el[v[0]](v[1]) : (el[v[0]] = v[1]);
    return el;
}, document.createElement(tag));

const DomRenderer = class {
    constructor(parent) {
        this._parent = parent;
    }

    render(data) {
        const {
            task: {
                _title: title,
            },
            list,
        } = data;

        const {
            task,
        } = data;

        const parent = document.querySelector(this._parent);
        parent.innerHTML = '';

        const titleElement = el('h1');
        task.setOnToggleListener((isComplete) => {
            titleElement.style['text-decoration'] = isComplete ? "line-through" : "";
        });

        titleElement.appendChild(el('input', { type: "checkbox", id: "", onclick: getOnTaskCheckedFunc(task) }));
        titleElement.append(title);
        parent.appendChild(titleElement);
        parent.appendChild(this._render(el('ul'), list));
    }

    _render(parent, list) {
        list.forEach(({ task, list }) => {
            const li = parent.appendChild(el('li'));
            const titleElement = el('div');
            titleElement.append(el('input', { type: "checkbox", id: "", onclick: getOnTaskCheckedFunc(task) }));
            task.setOnToggleListener((isComplete) => {
                titleElement.style['text-decoration'] = isComplete ? "line-through" : "";
            });
            titleElement.append(task._title);
            li.appendChild(titleElement);

            if (list.length > 0) {
                li.appendChild(this._render(el('ul'), list));
            }
        });

        return parent;
    }
};


const getOnTaskCheckedFunc = (task) => {
    return () => {
        task.toggle();
    };
};

const list1 = new Task('bside');
list1.add("지라설치");
list1.add("지라zmffkdnemwjqthr");

const list2 = new Task('s3-4');
list2.add("2강 답안 작성");
list2.add("3강 답안 작성");

const list = list2.byDate();
const childrenTask = list.list[1].task;
childrenTask.add("코드정리");
childrenTask.add("다이어그램정리");

const renderer1 = new DomRenderer("#b");
const renderer2 = new DomRenderer("#c");
renderer1.render(list1.byDate());
renderer2.render(list2.byDate());
