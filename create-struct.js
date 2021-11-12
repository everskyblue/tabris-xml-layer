import * as Views from './view-components'
import * as tabris from 'tabris'

function getInstance(name_component, attrs, context) {
  return (name_component in Views) ? Views[name_component].createContext(attrs, context) : new tabris[name_component](attrs);
}

function appendChilds(parent, child) {
  if (!isViewGroup(child)) {
    parent.append(child);
  }
}

function isViewGroup(obj) {
  return (obj instanceof Views.ViewGroup);
}

function addParentViewGroup(instance, parent) {
  if (isViewGroup(instance)) {
    instance.addTo(parent);
  }
}

function createStructView(object_view, model, context) {
  for (let name_component in object_view) {
    let values = object_view[name_component];
    values = Array.isArray(values) ? values : [(values.toString() === '[object Object]' ? values : {})];
    const doc = createStructView.getDoc(values);
    for (var i = 0; i < doc.length; i++) {
      let instance = getInstance(name_component, doc[i].attrs, context);
      appendChilds(model, instance);
      createStructView(doc[i].childs, instance, context);
      addParentViewGroup(instance, model);
    }
  }
}

createStructView.getDoc = values => {
  const doc = [];

  values.forEach(values => {
    const body = {
      attrs: {},
      childs: {}
    };
    for (let key in values) {
      let value = values[key];
      if (value.isAttribute)
        body.attrs[key] = value.value;
      else
        body.childs[key] = value;
    }
    doc.push(body);
  });

  return doc;
};

createStructView.normalizeAttribute = obj => {
  let attrs = {};
  for (let key in obj) {
    let prop = obj[key];
    if (prop.isAttribute) attrs[key] = prop.value;
  }
  return attrs;
}

export default createStructView;