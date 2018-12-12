const KEY = {
    ENTER: 13
};

const View = class {
    constructor(controller) {
        this.controller = controller;
    }

    render(m) {
        error("override");
    }
};

const IndexView = class extends View {
    constructor(controller) {
        super(controller);
        this.p = document.querySelector('#folders');
        document.querySelector('#newFolder').onkeyup = e => {
            e.stopImmediatePropagation();
            const {
                keyCode,
                target,
            } = e;

            if (keyCode !== KEY.ENTER) {
                return;
            }

            controller.add(target.value);
            target.value = '';
        };
    }

    render({ list }) {
        this.p.innerHTML = '';
        list.forEach(({ task }) => {
            const li = this.p.appendChild(el('li', { innerHTML: task.title }));
            list.onclick = _ => this.controller.select(task);
        });
    }
};

const FolderView = class extends View {
    constructor(controller) {
        super(controller);
        this.p = document.querySelector('#folder');
        this.h2 = this.p.appendChild(el('h2'));
        this.ul = this.p.appendChild(el('ul'));
        this.newTask = document.querySelector('#newTask');
    }

    setNewTask(f) {
        this.newTask.onkeyup = e => {
            e.stopImmediatePropagation();
            const {
                keyCode,
                target,
            } = e;

            if (keyCode !== KEY.ENTER) {
                return;
            }

            f(target.value);
            target.value = '';
        };
    }

    setTitle(title) {
        this.h2.innerHTML = title;
    }

    setRemove(f) {
        this.remove = f;
    }

    setToggle(f) {
        this.toggle = f;
    }

    setAdd(f) {
        this.add = f;
    }

    setList({ task, list }) {
        this.subTask(this.ul, task, list);
    }

    subTask(ul, parent, list) {
        list.forEach(({ task, list }) => {
            const li = ul.appendChild(el('li'));
            const title = li.appendChild(el('span', { innerHTML: task.title }));
            if (task.isComplete) {
                title.style.textDecoration = 'line-through';
            }
            const x = li.appendChild(el('span', { innerHTML: 'X'}));

            x.onclick = _ => {
                if (this.remove) {
                    this.remove(parent, task);
                }
            };
            const input = li.appendChild(el('input'));
            input.onclick = e => e.stopImmediatePropagation();
            input.onkeyup = e => {
                e.stopImmediatePropagation();
                const {keyCode, target} = e;
                if (keyCode !== KEY.ENTER) {
                    return;
                }
                if (this.add) {
                    this.add(task, target.value);
                }
                target.value = '';
            };
            li.onclick = e => {
                e.stopImmediatePropagation();
                if (this.toggle) {
                    this.toggle(task);
                }
            };

            if (list.length) {
                this.subTask(li.appendChild(el('ul')), task, list);
            }
        });
    }
};
