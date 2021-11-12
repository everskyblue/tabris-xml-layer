const {tojs, extractID, saveID, replacePath} = require('./build.js');
const {watch, readFileSync, writeFileSync} = require('fs');
const path = require('path');

const options = process.argv.slice(2);
const dirs = [
  abs('view'),
  abs('menu'),
  abs('values'),
];

function abs(dir) {
  return path.join(process.cwd(), 'res', dir);
}

if (options.length && options[0] === '-w') {
  dirs.forEach(dir => {
    watch(dir, (type, filename) => {
      try {
        let file = path.join(dir, filename);
        let json = tojs(readFileSync(file, 'utf-8'))
        file = replacePath(file);
        writeFileSync(file, JSON.stringify(json),'utf-8');
        extractID(json);
        saveID();
        console.log(`created! ${file}\n`)
      } catch(e) {
        console.log(e)
      }
    })
  })

  setInterval(function() {}, 10000)
}
