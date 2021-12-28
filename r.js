const R = Object.freeze({
  view: ResourceManager('res/view'),
  menu: ResourceManager('res/menu'),
  style: ResourceManager('res/values/styles.json'),
  color: ResourceManager('res/values/colors.json'),
  string: ResourceManager('res/values/strings.json'),
  attr: ResourceManager('res/values/attrs.json')
});

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
        const resource = target[path].shift().resource;
        const first_resource = resource.find(element => {
          return (key in element.attributes);
        });
        
        if (!first_resource) throw new Error(`not find resource name ${key}`);
        
        return first_resource;
      }
      
      return (target[key] = require(`../${path}/${key}.json`));
    }
  })
}

export default R;