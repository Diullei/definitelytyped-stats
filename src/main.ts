/// <reference path="../typings/tsd.d.ts"/>

import fs = require('fs');
import util = require('util');

var ProgressBar = require('progress');
var tsd = require('tsd');
var rmdir = require('rimraf');

var dir = process.cwd() + '/tmp-process';



function getAPI() {
	return tsd.getAPI(process.cwd() + '/conf/tsd.json', false);
}


function normalizeObjectData(def) {
    var ret = {
        project: def.project,
        name: def.name,
        path: def.path,
        semver: null,
        info: null,
        dependencies: null
    };

    if (def.semver) {
        ret.semver = def.semver;
    }

    if (def.head.info) {
        ret.info = def.head.info;
    }

    if (def.head.dependencies) {
        ret.info.references = def.head.dependencies.map((def) => def.name);
    }

    return ret;
}


function writeDefinitionInfoFile(content) {
    fs.writeFileSync(dir + '/' + content.name, JSON.stringify(content, null, 4));
    return content;
}


function main() {
    rmdir(dir, function(error) {
        if (error) {
            return console.log(error);
        }

        var api = tsd.getAPI(process.cwd() + '/conf/tsd.json');
        fs.mkdirSync(dir);

        console.log('\nFetching index...');
        api.core.index.getIndex().then((defIndex) => {
            var bar = new ProgressBar('Export [:bar] :percent :etas', { width:20, total:defIndex.list.length });

            defIndex.list.forEach(function(def) {
                api.core.parser.parseDefInfo(def.head)
                    .then((file) => api.core.resolver.resolveDeps(file))
                    .then((file) => {
                        var info = normalizeObjectData(def);
                        writeDefinitionInfoFile(info);

                        bar.tick();
                        if (bar.complete) {
                            console.log('\nFinished!\n');
                        }
                    }
                );
            });
        }).catch((e) => {
            console.error('\n\n' + e.stack + '\n');
        });
    });
}


main();
