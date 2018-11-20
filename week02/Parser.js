

const d64 = v => {
    return decodeURIComponent(
        atob(v)
            .split('')
            .map(c => '%' + ('00' +c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
};

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
