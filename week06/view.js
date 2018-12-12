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
        document.querySelector('#newTask').onkeyup = e => {
            e.stopImmediatePropagation();
            const {
                keyCode,
                target,
            } = e;

            if (keyCode !== KEY.ENTER) {
                return;
            }

            controller.addNew(target.value);
            target.value = '';
        };
    }

    render({ task, list }) {
        this.p.innerHTML = `<h2>${task.title}</h2>`;
        this.subTask(this.p.appendChild(el('ul')), task, list);
    }

    subTask(ul, parent, list) {
        list.forEach(({ task, list }) => {
            const li = ul.appendChild(el('li'));
            const title = li.appendChild(el('span', { innerHTML: task.title }));
            if (task.isComplete) {
                title.style.textDecoration = 'line-through';
            }
            const x = li.appendChild(el('span', { innerHTML: 'X'}));

            x.onclick = _ => this.controller.remove(parent, task);
            const input = li.appendChild(el('input'));
            input.onclick = e => e.stopImmediatePropagation();
            input.onkeyup = e => {
                e.stopImmediatePropagation();
                const {keyCode, target} = e;
                if (keyCode !== KEY.ENTER) {
                    return;
                }
                this.controller.add(task, target.value);
                target.value = '';
            };
            li.onclick = e => {
                e.stopImmediatePropagation();
                this.controller.toggle(task);
            };

            if (list.length) {
                this.subTask(li.appendChild(el('ul')), task, list);
            }
        });
    }
};
