var fs = require('fs');
var Promise = require('bluebird');
var tsd = require('tsd');
var rmdir = require('rimraf');
var dir = process.cwd() + '/tmp-process';
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
    fs.writeFileSync(dir + '/' + content[0].name + '.json', JSON.stringify(content[0]));
    return content;
}
var def = process.argv[2].substring(31);
if ('|CONTRIBUTING.md|CONTRIBUTORS.md|package.json|npm-shrinkwrap.json|'.indexOf('|' + def + '|') === -1) {
    console.log(def);
    getDefinitionInfo(def).then(normalizeObjectData).then(writeDefinitionInfoFile);
}
