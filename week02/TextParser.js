const TextParser = class extends Parser {
    parse(content) {
        this._parent.innerHTML = d64(content);
    }
};
