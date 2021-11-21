import * as Views from './view-components'
import {toArray, normalizeAttribute, separateObjectTypes} from './utils'


export default class ObjectView {
  #mainView;
  #viewGroup;
  
  inflate(context, object_view, inner_object) {
    this.#mainView = inner_object;
    this.#viewGroup = this.#convertToObject(context, object_view, inner_object)
    return this;
  }
  
  getView() {
    return this.#mainView || this.#viewGroup;
  }
  
  #getInstance(name_component, attrs, context) {
    return (name_component in Views) ? Views[name_component].createContext(attrs, context) : new tabris[name_component](attrs);
  }
  
  #appendChilds(parent, child) {
    if (!this.#isViewGroup(child)) {
      parent.append(child);
    } else {
      parent.addTo(child);
    }
  }
  
  #isViewGroup(obj) {
    return (obj instanceof Views.ViewGroup);
  }
  
  #convertToObject(context, object_view, inner_object) {
    let group = [];
    for (let name_component in objec_view) {
      let doc = separateObjectTypes(toArray(object_view[name_component]));
      for (var i = 0; i < doc.length; i++) {
        let instance = this.#getInstance(name_component, doc[i].attrs, context);
        if (typeof inner_object === 'object') {
          this.#appendChilds(inner_object, instance);
        } else {
          group.push(instance);
        }
        this.inflate(context, doc[i].childs, instance);
      }
    }
    return group;
  }
  
  static from(context, resource) {
    return (new ObjectView()).inflate(context, resource)
  }
}
