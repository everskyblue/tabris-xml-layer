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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _ObjectView_instances, _ObjectView_mainView, _ObjectView_viewGroup, _ObjectView_getInstance, _ObjectView_appendChilds, _ObjectView_isViewGroup, _ObjectView_convertToObject;
Object.defineProperty(exports, "__esModule", { value: true });
const Views = __importStar(require("./view-components"));
const tabris_1 = __importDefault(require("tabris"));
class ObjectView {
    constructor() {
        _ObjectView_instances.add(this);
        _ObjectView_mainView.set(this, void 0);
        _ObjectView_viewGroup.set(this, void 0);
    }
    inflate(context, group_view, inner_object) {
        __classPrivateFieldSet(this, _ObjectView_mainView, inner_object, "f");
        __classPrivateFieldSet(this, _ObjectView_viewGroup, __classPrivateFieldGet(this, _ObjectView_instances, "m", _ObjectView_convertToObject).call(this, context, group_view, inner_object), "f");
        return this;
    }
    getView() {
        return __classPrivateFieldGet(this, _ObjectView_mainView, "f") || __classPrivateFieldGet(this, _ObjectView_viewGroup, "f");
    }
    static from(context, resource, inner_object) {
        return (new ObjectView()).inflate(context, resource, inner_object);
    }
}
exports.default = ObjectView;
_ObjectView_mainView = new WeakMap(), _ObjectView_viewGroup = new WeakMap(), _ObjectView_instances = new WeakSet(), _ObjectView_getInstance = function _ObjectView_getInstance(name_component, attrs, context) {
    return (name_component in Views) ? Views[name_component].createContext(attrs, context) : new tabris_1.default[name_component](attrs);
}, _ObjectView_appendChilds = function _ObjectView_appendChilds(parent, child) {
    if (!__classPrivateFieldGet(this, _ObjectView_instances, "m", _ObjectView_isViewGroup).call(this, child) && parent) {
        parent.append(child);
    }
    else if (__classPrivateFieldGet(this, _ObjectView_instances, "m", _ObjectView_isViewGroup).call(this, child) && parent) {
        child.addTo(parent);
    }
}, _ObjectView_isViewGroup = function _ObjectView_isViewGroup(obj) {
    return (obj instanceof Views.ViewGroup);
}, _ObjectView_convertToObject = function _ObjectView_convertToObject(context, resource, inner_object) {
    let group = [];
    for (let struct of resource) {
        let [nameView, _] = Object.keys(struct);
        let childs = struct[nameView];
        let instance = __classPrivateFieldGet(this, _ObjectView_instances, "m", _ObjectView_getInstance).call(this, nameView, struct.attributes, context);
        __classPrivateFieldGet(this, _ObjectView_instances, "m", _ObjectView_convertToObject).call(this, context, childs, instance);
        __classPrivateFieldGet(this, _ObjectView_instances, "m", _ObjectView_appendChilds).call(this, inner_object, instance);
        group.push(instance);
    }
    return group;
};
