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

const R = {
  view: ResourceManager('res/view'),
  menu: ResourceManager('res/menu'),
  style: ResourceManager('res/values/styles.json'),
  color: ResourceManager('res/values/colors.json'),
  string: ResourceManager('res/values/strings.json'),
  attr: ResourceManager('res/values/attrs.json')
}

export default R;