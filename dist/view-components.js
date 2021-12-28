"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationDrawer = exports.RootView = exports.ViewGroup = exports.root = exports.HorizontalScrollView = exports.FlexView = exports.View = exports.Page = exports.include = void 0;
const view_property_components_1 = require("./view-property-components");
const object_view_1 = __importDefault(require("./object-view"));
const r_1 = __importDefault(require("./r"));
const tabris_1 = __importDefault(require("tabris"));
const store_1 = __importDefault(require("./store"));
/**
 * @param {string} orientation
 * @param {object} orientationProperty
 */
function existsOrThrowOrientation(orientation, orientationProperty) {
    if (orientation in orientationProperty) {
        return true;
    }
    throw new Error(`orientation ${orientation} not exists`);
}
include.createContext = props => include(props);
function include({ view }) {
    return object_view_1.default.from(r_1.default.view[view]).getView().shift();
}
exports.include = include;
class Page extends tabris_1.default.Page {
    constructor(props, AppContext) {
        super(props);
        this.context = AppContext;
        this.on('appear', () => {
            //onsole.log('ppe');
            if (store_1.default.has(AppContext)) {
                $(tabris_1.default.NavigationView).only().append(store_1.default.get(AppContext));
            }
        });
        this.on('disappear', () => {
            // console.log(30007);
            if (store_1.default.has(AppContext)) {
                store_1.default.get(AppContext).detach();
            }
        });
    }
    static createContext(props, AppContext) {
        return new this(props, AppContext);
    }
}
exports.Page = Page;
class View extends tabris_1.default.Composite {
    constructor(props, AppContext) {
        super(props);
        this.context = null;
        this.align_orientation = null;
        this.context = AppContext;
    }
    append(widgets) {
        let childs = Array.isArray(widgets) ? widgets : [widgets];
        if (this.align_orientation)
            childs.forEach(widget => widget.set(this.align_orientation));
        return super.append(childs);
    }
    static createContext(props, context) {
        const attrs = Object.assign({}, props);
        delete props.orientation;
        delete props.view_width;
        delete props.view_height;
        if (attrs.view_width && attrs.view_width in view_property_components_1.ViewProperties.view_width) {
            props = Object.assign(props, view_property_components_1.ViewProperties.view_width[attrs.view_width]);
        }
        if (attrs.view_height && attrs.view_height in view_property_components_1.ViewProperties.view_height) {
            props = Object.assign(props, view_property_components_1.ViewProperties.view_height[attrs.view_height]);
        }
        const view = new this(props, context);
        if (attrs.orientation && existsOrThrowOrientation(attrs.orientation, view_property_components_1.ViewProperties.orientation)) {
            view.align_orientation = view_property_components_1.ViewProperties.orientation[attrs.orientation];
        }
        return view;
    }
}
exports.View = View;
class FlexView extends View {
    static createContext(attrs, context) {
        if ('orientation' in attrs && existsOrThrowOrientation(attrs.orientation, view_property_components_1.ViewProperties.flex_orientation)) {
            Object.assign(attrs, view_property_components_1.ViewProperties.flex_orientation[attrs.orientation]);
            delete attrs.orientation;
        }
        return super.createContext(attrs, context);
    }
}
exports.FlexView = FlexView;
class HorizontalScrollView extends tabris_1.default.ScrollView {
    constructor(props) {
        super(Object.assign({ direction: 'horizontal' }, props));
    }
    static createContext(attrs) {
        return new this(attrs);
    }
}
exports.HorizontalScrollView = HorizontalScrollView;
exports.root = FlexView.createContext({
    orientation: 'vertical',
    view_width: 'fill_width',
    view_height: 'fill_height'
});
class ViewGroup {
    constructor(_, AppContext) {
        this.childs = [];
        this.context = AppContext;
    }
    addTo(parent) {
        parent.append(this.childs);
    }
    append(widget) {
        this.childs.push(widget);
    }
    static createContext(props, context) {
        return new this(props, context);
    }
}
exports.ViewGroup = ViewGroup;
class RootView extends ViewGroup {
    constructor(props) {
        super();
        this.props = props;
    }
    addTo() {
        super.addTo(exports.root);
    }
}
exports.RootView = RootView;
class NavigationDrawer extends ViewGroup {
    constructor({ menu }, ctx) {
        super();
        this.res = menu;
        this.context = ctx;
    }
    addTo() {
        const menu = require(`../res/menu/${this.res}.json`)[0].menu;
        const items = [];
        menu.forEach(item => {
            if (Array.isArray(item.item)) {
                let findIndex = items.findIndex(it => it.isGroup);
                if (findIndex == -1)
                    findIndex = items.length;
                items.splice(findIndex, 0, item.attributes);
            }
            else {
                items.push({ isGroup: true, title: item.attributes.title }, ...item.group.map(item => item.attributes));
            }
        });
        let collection = new tabris_1.default.CollectionView({
            left: 0,
            top: 'prev() 10',
            right: 0,
            bottom: 0,
            itemCount: items.length,
            cellType: index => items[index].isGroup,
            cellHeight: (_, type) => type ? 48 : 38,
            createCell(isGroup) {
                return isGroup ? new tabris_1.default.TextView({
                    padding: 10,
                    textColor: 'gray'
                }) : FlexView.createContext({
                    orientation: 'horizontal',
                    view_width: 'fill_width',
                    highlightOnTouch: true,
                    padding: 10,
                });
            },
            updateCell: (view, i) => {
                let item = items[i];
                if (view instanceof tabris_1.default.TextView) {
                    view.text = item.title.toUpperCase();
                }
                else {
                    if (item.icon) {
                        view.append(new tabris_1.default.ImageView({
                            image: item.icon,
                            centerY: true
                        }));
                    }
                    view.append(new tabris_1.default.TextView(Object.assign({ centerY: true, text: item.title, left: (item.icon ? 10 : 30) }, (item.id ? { id: item.id } : {}))));
                    view.onTap(() => {
                        tabris_1.default.drawer.close();
                        setTimeout(() => this.context.onActionItemSelected(), 500);
                    });
                }
            }
        });
        this.append(collection);
        super.addTo(tabris_1.default.drawer);
    }
}
exports.NavigationDrawer = NavigationDrawer;
