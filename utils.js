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