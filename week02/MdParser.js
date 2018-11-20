const MdParser = class extends Parser {
    _parseMD(v) {
        return this._d64(v)
            .split('\n')
            .map(v => {
                let i = 3;
                while(i--) {
                    if(v.startsWith('#'.repeat(i + 1))) {
                        return `<h${i + 1}>${v.substr(i + 1)}</h${i + 1}>`;
                    }
                }
                return v;
            })
            .join('<br>');
    }

    _d64(v) {
        return decodeURIComponent(
            atob(v)
                .split('')
                .map(c => '%' + ('00' +c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
    }

    parse(content) {
        this._parent.innerHTML = this._parseMD(content);
    }
};
