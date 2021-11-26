import tabris, {Module} from 'tabris'
import R from './json-resource'

export class ViewProperties {
  static view_width = {
    fill_width: {
      left: 0,
      right: 0
    },
    wrap_content: {
      left: 'auto',
      right: 'auto'
    }
  }
  
  static view_height = {
    fill_height: {
      top: 0,
      bottom: 0
    },
    wrap_content: {
      top: 'auto',
      bottom: 'auto'
    }
  }
  
  static orientation = {
    vertical: {
      top: tabris.Constraint.prev
    },
    horizontal: {
      left: tabris.Constraint.prev
    }
  };
  
  static flex_orientation = {
    vertical: {
      layout: new tabris.StackLayout()
    },
    horizontal: {
      layout: new tabris.RowLayout()
    }
  }
}

export class MenuProperties {
  #object;
  #event;
  #props = {};
  #type = {
    text: tabris.Action,
    search: tabris.SearchAction
  }
  
  icon(image) {
    this.#props.image = image;
  }
  
  showAsAction(action) {
    if ('ifRoom' === action) this.#props.placement = 'default';
    else if ('hidden' === action) this.#props.placement = 'overflow';
    else throw new Error(`show action ${action} not valid`);
  }
  
  type(type) {
    if(!(type in this.#type)) throw new Error(`action type ${typeAction} not valid`);
    this.#object = this.#type[type];
  }
  
  actionViewClass(classString) {
    this.#event = Module.execute(Module.load(classString+'.js'), classString+'.js');
    if (typeof this.#event !== 'function') throw new Error(`not an exported function ${classString}`)
  }
  
  getType() {
    return this.#type;
  }
  
  get Intent() {
    return this.#event;
  }
  
  get objectAction() {
    if (typeof this.#object === 'function')
      this.#object = new this._object(this.#props);
    return this.#object;
  }
  
  set objectAction(object) {
    if (!(object instanceof this.#type.text) || !(object instanceof this.#type.search))
      throw new ReferenceError('isn\'t instance of type Action or SearchAction');
    this.#object = object;
  }
}