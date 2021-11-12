const fs = require("fs");
const path = require("path");
const parser = require('fast-xml-parser');

let files_loaded = [];
let ids = {};

const replacePath = file => file.replace(process.cwd(), __dirname).replace('.xml', '.json');

const tojs = xml => parser.parse(xml, {
  allowBooleanAttributes: true,
  arrayMode: false,
  textNodeName: '#text',
  ignoreAttributes: false,
  parseAttributeValue: true,
  attributeNamePrefix: '',
  attrValueProcessor(value, attr) {
    return {
      isAttribute: true,
      value
    }
  }
}, true);

function saveID() {
  fs.writeFileSync(path.join(__dirname, 'res', 'R.json'), JSON.stringify(ids),'utf-8');
  ids = {};
}

function extractID(json) {
  for (let tag in json) {
    let body = json[tag];
    if (body.toString() === '[object Object]') {
      filter(tag, body);
    } else if (Array.isArray(body)) {
      for (let child of body) {
        filter(tag, child);
      }
    }
  }
}

function filter(tag, body) {
  for (let key in body) {
    if (!body[key].isAttribute && body[key]) {
      extractID({[key]:body[key]})
    }
    if ('id' === key) {
      setID(tag,body)
    }
  }
}

function getValID(obj) {
  if (('id' in obj) && obj.id.isAttribute) {
    return obj.id.value;
  }
  return false;
}

function setID(tag, body) {
  let idv = getValID(body);
  if (idv && !(idv in ids)) {
    ids[idv] = tag;
  }
}

function getResource(file) {
  return path.resolve(process.cwd(), 'res', file);
}


[
  {
    type: 'menu',
    files: fs.readdirSync(getResource('menu'), 'utf-8')
  },
  {
    type: 'view',
    files: fs.readdirSync(getResource('view'), 'utf-8')
  },
  {
    type: 'values',
    files: fs.readdirSync(getResource('values'), 'utf-8')
  }
].forEach(def => {
  def.files.forEach(file => {
    const root = getResource(`${def.type}/${file}`);
    const newfile = replacePath(root);
    const js = tojs(fs.readFileSync(root, 'utf-8'));
    if (!fs.existsSync(path.dirname(newfile))) {
      fs.mkdirSync(path.dirname(newfile), {recursive:true})
    }
    fs.writeFileSync(newfile, JSON.stringify(js),'utf-8');
    extractID(js)
  })
})

saveID();

module.exports = {
  saveID,
  extractID,
  tojs,
  replacePath
}