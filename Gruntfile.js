'use strict';
module.exports = function(grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        clean: {
            dist: ['dist']
        },
        ts: {
            build: {
                files: [
                    // { src: ['test/**/*.ts'], dest: 'test/' }
                    { src: ['src/**/*.ts'],  dest: 'dist/' }
                ],
                options: {
                    fast: 'never',
                    target: 'es3',
                    module: 'commonjs',
                    sourceMap: false,
                    declaration: false,
                    removeComments: true,
                    compiler: './node_modules/typescript/bin/tsc',
                    outDir: 'dist'
                }
            }
        }
    });

    grunt.registerTask('default', ['clean', 'ts:build']);
};
