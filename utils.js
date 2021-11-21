export function toArray(value) {
  return Array.isArray(value) ? value : (value.toString() === '[object Object]' ? [value] : [])
}

export function normalizeAttribute(obj) {
  let attrs = {};
  for (let key in obj) {
    let prop = obj[key];
    if (prop.isAttribute) attrs[key] = prop.value;
  }
  return attrs;
}

export function separateObjectTypes(values) {
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

export function Bridge(ctx) {
  function FakeConstructor() {}
  FakeConstructor.prototype = new Proxy(ctx, {
    get(t, k){
      return t[k];
    },
    set(t, k, v){
      t[k] = v;
      return this;
    }
  });
  
  return new Proxy(FakeConstructor, {
    constructor: function (Construct) {
      return new Construct();
    }
  });
}