const error = (msg) => {
    alert(msg);
    throw msg;
};

const el = (tag, attr={}) => Object.entries(attr).reduce((el, v) => {
    typeof el[v[0]] === 'function' ? el[v[0]](v[1]) : (el[v[0]] = v[1]);
    return el;
}, document.createElement(tag));
