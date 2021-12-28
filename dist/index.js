"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Intent = exports.ViewManager = exports.Searchable = exports.R = void 0;
const view_components_1 = require("./view-components");
const view_property_components_1 = require("./view-property-components");
const object_view_1 = __importDefault(require("./object-view"));
const store_1 = __importDefault(require("./store"));
const tabris_1 = __importDefault(require("tabris"));
var r_1 = require("./r");
Object.defineProperty(exports, "R", { enumerable: true, get: function () { return __importDefault(r_1).default; } });
var Searchable_1 = require("./Searchable");
Object.defineProperty(exports, "Searchable", { enumerable: true, get: function () { return __importDefault(Searchable_1).default; } });
const navigation = new tabris_1.default.NavigationView({
    layoutData: 'stretch'
}).appendTo(view_components_1.root);
tabris_1.default.contentView.append(view_components_1.root);
class Menu {
    constructor(appContext) {
        this.appContext = appContext;
        this.actions = [];
    }
    add(options) {
        let optionMenu = new view_property_components_1.MenuProperties();
        if (!options.type)
            options.type = 'text';
        Object.keys(options).forEach(key => {
            if (key in optionMenu) {
                optionMenu[key](options[key]);
                delete options[key];
            }
        });
        optionMenu.objectAction.set(options).onSelect(() => {
            this.appContext.onActionItemSelected(options.id);
            if (typeof optionMenu.Intent === 'function') {
                Intent(optionMenu.Intent);
            }
        });
        this.actions.push(optionMenu.objectAction);
    }
    inflate([resource]) {
        if (resource.menu.findIndex(item => !!item.group) >= 0) {
            throw new Error('the menu in the toolbar does not support groups');
        }
        resource.menu.forEach(item => this.add(item.attributes));
    }
    getActions() {
        return new tabris_1.default.WidgetCollection(this.actions);
    }
}
class EventView {
    onActionItemSelected(item) { }
}
class ViewManager extends EventView {
    constructor() {
        super();
        this.onCreateMenuItems(new Menu(this));
    }
    /**
     * @param {object[]} menus
     */
    onCreateMenuItems(menu) {
        const collectionActions = menu.getActions();
        if (!store_1.default.has(this)) {
            store_1.default.set(this, collectionActions);
        }
        navigation.append(collectionActions);
    }
    setContentView(view) {
        object_view_1.default.from(this, view, navigation);
    }
    drawer(view_xml) {
        tabris_1.default.drawer.enabled = true;
        (object_view_1.default.from(this, view_xml, tabris_1.default.drawer));
    }
    setToolbarVisible(visible) {
        this.toolbarVisible = visible;
    }
    setIconDrawerVisible(visible) {
        this.iconDrawerVisible = visible;
    }
    set iconDrawerVisible(visible) {
        navigation.drawerActionVisible = visible;
    }
    get iconDrawerVisible() {
        return navigation.drawerActionVisible;
    }
    set toolbarVisible(visible) {
        navigation.toolbarVisible = visible;
    }
    get toolbarVisible() {
        return navigation.toolbarVisible;
    }
}
exports.ViewManager = ViewManager;
function Intent(ClassView) {
    if (!store_1.default.has(ClassView)) {
        store_1.default.set(ClassView, new ClassView());
    }
    const object = store_1.default.get(ClassView);
    if (object instanceof ViewManager)
        object.onCreate();
    return object;
}
exports.Intent = Intent;
