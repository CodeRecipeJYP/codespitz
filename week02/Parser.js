const Parser = class {
    constructor(parent) {
        if (typeof parent != 'string' || !parent) {
            error("invalid param");
        }
        this._parent = document.querySelector(parent);
    }

    parse(content) {
        error("parse must overrided");
    }
};
