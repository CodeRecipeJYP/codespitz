const Repo = class {
    constructor(github) {
        this._git = github;
        this._router = new Map;
    }

    addParser(extention, parser) {
        if (!extention) {
            error(`invalid extention=[${extention}]`);
            return;
        }
        if (!parser instanceof Parser) {
            error(`invalid parser=[${parser}]`);
            return;
        }
        if (this._router.has(extention)) {
            error(`Parser of extention=[${extention}] already exists.`);
            return;
        }

        this._router.set(extention, parser)
    }

    parse(extention, path) {
        if (!this._router.has(extention)) {
            error(`Extention [${extention}] parser doesn't exist.`);
            return;
        }
        const parser = this._router.get(extention);

        this._git.load(path)
            .then(content => {
                parser.parse(content);
            })
            .catch(err => {
                error(`Git load failed. err=${err}`);
            });
    }
};

