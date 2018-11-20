const Github = class {
    constructor(id, repo) {
        this._base = `https://api.github.com/repos/${id}/${repo}/contents/`;
    }

    load(path) {
        return new Promise((res, rej) => {
            const id = 'callback' + Github._id++;
            const f = Github[id] = ({data: { content }}) => {
                delete Github[id];
                document.head.removeChild(s);
                res(content);
            };
            const s = document.createElement('script');
            s.src = `${this._base + path}?callback=Github.${id}`;
            document.head.appendChild(s);
        });
    }
};

Github._id = 0;
