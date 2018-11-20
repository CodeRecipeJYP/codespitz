const ImageParser = class extends Parser {
    parse(content) {
        this._parent.src = 'data:text/plain;base64,' + content;
    }
};
