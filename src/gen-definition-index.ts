/// <reference path="../typings/tsd.d.ts"/>

import path = require('path');
import fs = require('fs');
import util = require('util');
import utilities = require('./util');

var tsdjson = require(process.cwd() + '/tsd.json');

var dir = process.cwd() + '/tmp-process';

var files = utilities.getFiles(dir);

var json = { urls: {}, updatedAt: null, count: null, content:[] };

json.urls = {
	def: 'https://github.com/' + tsdjson.repo + '/blob/' + tsdjson.ref + '/{path}'
};

var data = null;
files.forEach((file) => {
    console.log(path.join(dir, file));
    json.content.push(JSON.parse(fs.readFileSync(path.join(dir, file),  { encoding:'utf8'})));
});

json.updatedAt = Date.now();
json.count = json.content.length;

fs.writeFileSync('definition-index.json', JSON.stringify(json, null, 4));
