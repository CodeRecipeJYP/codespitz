const getExtention = filename => {
    return filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
};

const Loader = class {
    constructor() {
        this._repo = new Map;
    }

    addRepo(key, id, repo) {
        if (this._repo.has(key)) {
            error(`Repo key [${key}] already exists.`);
            return;
        }
        this._repo.set(key, new Repo(new Github(id, repo)))
    }

    addRouter(key, extentions, parser) {
        if (!this._repo.has(key)) {
            error(`Repo key [${key}] doesn't exist.`);
            return;
        }

        const repo = this._repo.get(key);
        extentions
            .split(',')
            .forEach(extention => repo.addParser(extention, parser));
    }

    load(repoKey, filename) {
        if (!this._repo.has(repoKey)) {
            error(`Call addRepo(${repoKey}, ...) first.`);
            return;
        }
        const repo = this._repo.get(repoKey);

        const extention = getExtention(filename);
        if (!extention) {
            error(`invalid extention. filename=[${filename}]`);
        }

        repo.parse(extention, filename)
    }
};
