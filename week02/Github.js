const Github = class {
    constructor(id, repo) {
        this._base = `https://api.github.com/repos/${id}/${repo}/contents/`;
    }

    load(path) {
        if (!this._parser) {
            return;
        }
        const id = 'callback' + Github._id++;
        const f = Github[id] = ({data: { content }}) => {
            delete Github[id];
            document.head.removeChild(s);
            this._parser.parse(content);
        };
        const s = document.createElement('script');
        s.src = `${this._base + path}?callback=Github.${id}`;
        document.head.appendChild(s);
    }

    setParser(parser) {
        if (!(parser instanceof Parser)) {
            error(`setParser: invalid argument parser=[${parser}]`);
            return;
        }
        this._parser = parser;
    }
};

Github._id = 0;
