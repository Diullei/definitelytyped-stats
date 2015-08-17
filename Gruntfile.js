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
                src: ['src/**/*.ts', 'test/**/*.ts'],
                options: {
                    target: 'es3',
                    module: 'commonjs',
                    sourceMap: false,
                    declaration: false,
                    removeComments: true,
                    compiler: './node_modules/typescript/bin/tsc'
                },
            }
        },

        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'src/', src: ['**/*.js'], dest: 'dist/'}
                ]
            }
        }
    });

    grunt.registerTask('default', ['clean', 'ts:build', 'copy']);
};
