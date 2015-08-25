var path = require('path');
var fs = require('fs');
var util = require('util');
var Promise = require('bluebird');
var tsd = require('tsd');
var rmdir = require('rimraf');
var dir = process.cwd() + '/tmp-process';
function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function (file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory() && file != '.git';
    });
}
function listToMatrix(list, elementsPerSubArray) {
    var matrix = [], i, k;
    for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }
        matrix[k].push(list[i]);
    }
    return matrix;
}
function getAPI() {
    var api = tsd.getAPI(process.cwd() + '/conf/tsd.json', false);
    return api;
}
function getDefinitionInfo(source) {
    return getAPI().readConfig(process.cwd() + '/conf/tsd.json', false).then(function () {
        var opts = new tsd.Options();
        var query = new tsd.Query();
        opts.history = true;
        query.addNamePattern(source);
        query.parseInfo = true;
        return getAPI().select(query, opts).progress(function (note) {
            console.log('-> note: ' + note.message);
        });
    });
}
function normalizeObjectData(selection) {
    return selection.definitions.sort(tsd.DefUtil.defCompare).map(function (def) {
        var ret = {
            project: def.project,
            name: def.name,
            path: def.path,
            semver: null,
            info: null
        };
        if (def.semver) {
            ret.semver = def.semver;
        }
        if (def.head.info) {
            ret.info = def.head.info;
        }
        return ret;
    });
}
function writeDefinitionInfoFile(content) {
    fs.writeFileSync(dir + '/' + content[0].name, util.inspect(content[0], false, 5, false));
    return content;
}
function main() {
    rmdir(dir, function (error) {
        console.log(error);
    });
    setTimeout(function () {
        fs.mkdirSync(dir);
        var files = getDirectories(process.cwd() + '/node_modules/DefinitelyTyped');
        var groups = listToMatrix(files, 10);
        Promise.map(groups, function (group) {
            return Promise.map(group, function (target) {
                return getDefinitionInfo(target).then(normalizeObjectData).then(writeDefinitionInfoFile);
            });
        });
    }, 500);
}
main();
