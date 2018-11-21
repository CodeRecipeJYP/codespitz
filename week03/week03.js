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
        return {
            task: this,
            list: !stateGroup ? [...list].sort(sortFunc) : [
                ...list.filter(v => !v.isComplete()).sort(sortFunc),
                ...list.filter(v => v.isComplete()).sort(sortFunc),
            ]
        };
    }
};


const list1  = new Task('bside');
list1.add("지라설치");
list1.add("지라zmffkdnemwjqthr");

const list2  = new Task('s3-4');
list2.add("2강 답안 작성");
list2.add("3강 답안 작성");

const list = list2.byDate();
list[1].task.add("코드정리");
list[1].task.add("다이어그램정리");
