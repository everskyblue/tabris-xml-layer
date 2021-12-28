"use strict";
const { tojs, getResource, replacePath } = require('./build');
const { watch, readFileSync, writeFileSync } = require('fs');
const path = require('path');
const options = process.argv.slice(2);
const dirs = [
    getResource('view'),
    getResource('menu'),
    getResource('values'),
];
if (options.length && options[0] === '-w') {
    dirs.forEach(dir => {
        watch(dir, (type, filename) => {
            try {
                let file = path.join(dir, filename);
                let json = tojs(readFileSync(file, 'utf-8'));
                file = replacePath(file);
                writeFileSync(file, JSON.stringify(json), 'utf-8');
                console.log(`created! ${file}\n`);
            }
            catch (e) {
                console.log(e);
            }
        });
    });
    setInterval(function () { }, 10000);
}
