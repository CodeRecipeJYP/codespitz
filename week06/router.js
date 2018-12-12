const Router = class extends Map {
    constructor() {
        super();
    }

    route(key, ...arg) {
        this.get(key).action(...arg);
    }
};

const router = new Router;
router.set('index', new Index(router));
router.set('folder', new Folder(router));
router.route('index');
