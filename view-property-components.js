import tabris from 'tabris'

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
  _object;
  _event;
  _props = {};
  _type = {
    text: tabris.Action,
    search: tabris.SearchAction
  }
  
  icon(image) {
    this._props.image = image;
  }
  
  showAsAction(action) {
    if ('ifRoom' === action) this._props.placement = 'default';
    else if ('hidden' === action) this._props.placement = 'overflow';
    else throw new Error(`show action ${action} not valid`);
  }
  
  type(type) {
    if(!(type in this._type)) throw new Error(`action type ${typeAction} not valid`);
    this._object = this._type[type];
  }
  
  actionViewClass(classString) {
    this._event = require(classString.replace('.', '/'));
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