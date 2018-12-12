const Controller = class {
    constructor(router) {
        // app == router(남의 컨트롤러를 아는 유일한 존재)
        this.router = router;
    }

    action(...arg) {
        // router가 Controller에게 일을시키는 체널
        error("override");
    }

    listen(m) {
        error("override");
    }
};

const Index = class extends Controller {
    constructor(router) {
        super(router);
        this.model = Task.root || (Task.root = new Task("root"));
        this.model.addListener(this);
        this.view = new IndexView(this);
    }

    action(...arg) {
        this.view.render(this.model.list());
    }

    listen(m) {
        this.action();
    }

    add(title) {
        this.model.add(title);
    }

    select(task) {
        this.router.route("folder", task);
    }
};

const Folder = class extends Controller {
    constructor(router) {
        super(router);
        this.view = new FolderView(this);
    }

    action(...arg) {
        this.model = arg[0];
        this.model.addListener(this);
        this.view.render(this.model.list(this.sort));
    }

    listen(m) {
        this.view.render(this.model.list());
    }

    addNew(title) {
        this.model.add(title);
    }

    add(parent, title) {
        parent.add(title);
    }

    remove(parent, task) {
        parent.remove(task);
    }

    toggle(task) {
        task.toggle();
    }
};
