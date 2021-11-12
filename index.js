import {root} from './view-components'
import createStructView from './create-struct'
import * as tabris from 'tabris'

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
    this.actions.push(
      new Action(options)
      .onSelect(()=> this.appContext.onActionItemSelected(options.i))
    );
  }
}

class EventView {
  onActionItemSelected(item) {}
}

export class ViewManager extends EventView {
  constructor() {
    super()
    this.onCreateMenuItems(new Menu(this));
  }
  
  /**
   * @param {object[]} menus
   */
  onCreateMenuItems(menu) {
    navigation.append(menus.actions);
  }
  
  setContentView(view) {
    createStructView(view, navigation, this);
  }
  
  drawer(view_xml) {
    tabris.drawer.enabled = true;
    createStructView(view_xml, tabris.drawer, this);
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