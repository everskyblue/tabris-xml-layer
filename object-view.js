import * as Views from './view-components'
import tabris from 'tabris'

export default class ObjectView {
  #mainView;
  #viewGroup;
  
  inflate(context, group_view, inner_object) {
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
  
  #convertToObject(context, resource, inner_object) {
    let group = [];
    for (let struct of resource) {
      let [nameView, _] = Object.keys(struct);
      let childs = struct[nameView];
      let instance = this.#getInstance(nameView, struct.attributes, context);
      if (typeof inner_object === 'object') {
        this.#appendChilds(inner_object, instance);
      } else {
        group.push(instance);
      }
      this.inflate(context, childs, instance);
    }
    return group;
  }
  
  static from(context, resource, inner_object) {
    return (new ObjectView()).inflate(context, resource, inner_object);
  }
}
