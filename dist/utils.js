"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bridge = exports.separateObjectTypes = exports.normalizeAttribute = exports.toArray = void 0;
function toArray(value) {
    return Array.isArray(value) ? value : (value.toString() === '[object Object]' ? [value] : []);
}
exports.toArray = toArray;
function normalizeAttribute(obj) {
    let attrs = {};
    for (let key in obj) {
        let prop = obj[key];
        if (prop.isAttribute)
            attrs[key] = prop.value;
    }
    return attrs;
}
exports.normalizeAttribute = normalizeAttribute;
function separateObjectTypes(values) {
    const doc = [];
    values.forEach(values => {
        const body = {
            attrs: {},
            childs: {}
        };
        for (let key in values) {
            let value = values[key];
            if (value.isAttribute)
                body.attrs[key] = value.value;
            else
                body.childs[key] = value;
        }
        doc.push(body);
    });
    return doc;
}
exports.separateObjectTypes = separateObjectTypes;
;
function Bridge(ctx) {
    function FakeConstructor() { }
    FakeConstructor.prototype = new Proxy(ctx, {
        get(t, k) {
            return t[k];
        },
        set(t, k, v) {
            t[k] = v;
            return this;
        }
    });
    return new Proxy(FakeConstructor, {
        constructor: function (Construct) {
            return new Construct();
        }
    });
}
exports.Bridge = Bridge;
