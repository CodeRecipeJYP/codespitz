const MdParser = class extends Parser {
    _parseMD(v) {
        return d64(v)
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

    parse(content) {
        this._parent.innerHTML = this._parseMD(content);
    }
};
