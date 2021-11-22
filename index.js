import {root} from './view-components'
import {MenuProperties} from './view-property-components'
import ObjectView from './object-view'
import store from './store'
import tabris from 'tabris'

const navigation = new tabris.NavigationView({
  layoutData: 'stretch'
}).appendTo(root);

tabris.contentView.append(root);

function ResourceManager(path) {
  const target = {};
  const isFile = path.endsWith('.json');
  if (isFile) {
    target[path] = require(`../${path}`);
  }
  return new Proxy(target, {
    get(target, key) {
      if (key in target) {
        return target[key];
      }
      
      if (isFile){
        return (target[path][key]);
      }
      
      return (target[key] = require(`../${path}/${key}.json`));
    }
  })
}

export function Intent(ClassView) {
  if (!store.has(ClassView)) {
    store.set(ClassView, new ClassView());
  }
  const object = store.get(ClassView);
  if (object instanceof ViewManager)
    object.onCreate();
  return object;
}

export const R = {
  view: ResourceManager('res/view'),
  menu: ResourceManager('res/menus'),
  style: ResourceManager('res/values/styles.json'),
  color: ResourceManager('res/values/colors.json'),
  string: ResourceManager('res/values/strings.json'),
  attr: ResourceManager('res/values/attrs.json')
}

class Menu {
  constructor(appContext) {
    this.appContext = appContext;
    this.actions = [];
  }
  
  add(options) {
    let optionMenu = new MenuProperties();
    
    if (!options.type) options.type = 'text';
    
    Object.keys(options).forEach(key => {
      if (key in MenuProperties) {
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
  
  inflate(resource) {
    if (resource.menu.group) {
      throw new Error('the menu in the toolbar does not support groups');
    }
    toArray(resource.menu).forEach(item => this.add(normalizeAttribute(item)));
  }
  
  getActions() {
    return new tabris.WidgetCollection(this.actions);
  }
}

class EventView {
  onActionItemSelected(item) {}
}

export class ViewManager extends EventView {
  constructor() {
    super();
    this.onCreateMenuItems(new Menu(this));
    this.onCreate();
  }
  
  /**
   * @param {object[]} menus
   */
  onCreateMenuItems(menu) {
    const collectionActions = menu.getActions();
    if (!store.has(this)) {
      store.set(this, collectionActions);
    }
    navigation.append(collectionActions);
  }
  
  setContentView(view) {
    createStructView(view, navigation, this);
  }
  
  drawer(view_xml) {
    tabris.drawer.enabled = true;
    (ObjectView.from(this, view_xml, tabris.drawer));
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