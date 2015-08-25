var path = require('path');
var fs = require('fs');
var utilities = require('./util');
var tsdjson = require(process.cwd() + '/tsd.json');
var dir = process.cwd() + '/tmp-process';
var files = utilities.getFiles(dir);
var json = { urls: {}, updatedAt: null, count: null, content: [] };
json.urls = {
    def: 'https://github.com/' + tsdjson.repo + '/blob/' + tsdjson.ref + '/{path}'
};
var data = null;
files.forEach(function (file) {
    console.log(path.join(dir, file));
    data = require(path.join(dir, file));
    json.content.push(data);
});
json.updatedAt = Date.now();
json.count = json.content.length;
fs.writeFileSync('definition-index.json', JSON.stringify(json, null, 4));
