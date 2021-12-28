"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Views = __importStar(require("./view-components"));
const utils_1 = require("./utils");
const tabris_1 = __importDefault(require("tabris"));
function getInstance(name_component, attrs, context) {
    return (name_component in Views) ? Views[name_component].createContext(attrs, context) : new tabris_1.default[name_component](attrs);
}
function appendChilds(parent, child) {
    if (!isViewGroup(child)) {
        parent.append(child);
    }
}
function isViewGroup(obj) {
    return (obj instanceof Views.ViewGroup);
}
function addParentViewGroup(instance, parent) {
    if (isViewGroup(instance)) {
        instance.addTo(parent);
    }
}
function createStructView(object_view, model, context) {
    for (let name_component in object_view) {
        let values = object_view[name_component];
        values = (0, utils_1.toArray)(values);
        const doc = createStructView.getDoc(values);
        for (var i = 0; i < doc.length; i++) {
            let instance = getInstance(name_component, doc[i].attrs, context);
            appendChilds(model, instance);
            createStructView(doc[i].childs, instance, context);
            addParentViewGroup(instance, model);
        }
    }
}
createStructView.getDoc = values => {
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
};
exports.default = createStructView;
