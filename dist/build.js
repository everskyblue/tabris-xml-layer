"use strict";
const fs = require("fs");
const path = require("path");
const { XMLParser } = require('fast-xml-parser');
const parser = new XMLParser({
    ignoreAttributes: false,
    allowBooleanAttributes: true,
    attributeNamePrefix: '',
    preserveOrder: true
});
let files_loaded = [];
const replacePath = file => file.replace(process.cwd(), __dirname).replace('.xml', '.json');
const tojs = xml => parser.parse(xml);
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
            fs.mkdirSync(path.dirname(newfile), { recursive: true });
        }
        fs.writeFileSync(newfile, JSON.stringify(js), 'utf-8');
    });
});
module.exports = {
    tojs,
    replacePath,
    getResource
};
