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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuProperties = exports.ViewProperties = void 0;
const tabris_1 = __importStar(require("tabris"));
class ViewProperties {
}
exports.ViewProperties = ViewProperties;
ViewProperties.view_width = {
    fill_width: {
        left: 0,
        right: 0
    },
    wrap_content: {
        left: 'auto',
        right: 'auto'
    }
};
ViewProperties.view_height = {
    fill_height: {
        top: 0,
        bottom: 0
    },
    wrap_content: {
        top: 'auto',
        bottom: 'auto'
    }
};
ViewProperties.orientation = {
    vertical: {
        top: tabris_1.default.Constraint.prev
    },
    horizontal: {
        left: tabris_1.default.Constraint.prev
    }
};
ViewProperties.flex_orientation = {
    vertical: {
        layout: new tabris_1.default.StackLayout()
    },
    horizontal: {
        layout: new tabris_1.default.RowLayout()
    }
};
class MenuProperties {
    constructor() {
        this._props = {};
        this._type = {
            text: tabris_1.default.Action,
            search: tabris_1.default.SearchAction
        };
    }
    icon(image) {
        this._props.image = image;
    }
    showAsAction(action) {
        if ('ifRoom' === action)
            this._props.placement = 'default';
        else if ('hidden' === action)
            this._props.placement = 'overflow';
        else
            throw new Error(`show action ${action} not valid`);
    }
    type(type) {
        if (!(type in this._type))
            throw new Error(`action type ${typeAction} not valid`);
        this._object = this._type[type];
    }
    actionViewClass(classString) {
        this._event = tabris_1.Module.execute(tabris_1.Module.load(classString + '.js'), classString + '.js');
        if (typeof this._event !== 'function')
            throw new Error(`not and exported function ${classString}`);
    }
    get Intent() {
        return this._event;
    }
    get objectAction() {
        if (typeof this._object === 'function')
            this._object = new this._object(this._props);
        return this._object;
    }
    set objectAction(object) {
        if (!(object instanceof this._type.text) || !(object instanceof this._type.search))
            throw new ReferenceError('isn\'t instance of type Action or SearchAction');
        this._object = object;
    }
}
exports.MenuProperties = MenuProperties;
