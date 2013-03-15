//credits: https://gist.github.com/mattbanks/5143298

'use strict';

var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var folderMount = function folderMount(connect, point) {
  return connect.static(path.resolve(point));
};

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // live reload, in case you want to change the port or anything
    connect: {
      livereload: {
        options: {
          port: 9000,
          middleware: function(connect, options) {
            return [lrSnippet, folderMount(connect, '.')];
          }
        }
      }
    },

    // javascript linting with jshint
    jshint: {
      options: {
        'node': true,
        'browser': true,
        'es5': true,
        'esnext': true,
        'bitwise': true,
        'camelcase': true,
        'curly': true,
        'eqeqeq': true,
        'immed': true,
        'indent': 2,
        'latedef': true,
        'newcap': true,
        'noarg': true,
        'quotmark': 'single',
        'regexp': true,
        'undef': true,
        'unused': true,
        'strict': true,
        'trailing': true,
        'smarttabs': true,
        'jquery': true,
        'globals': {
          'angular': false
        }
      },
      all: [
        'js/*.js'
      ]
    },

    // uglify to concat, minify, and make source maps
    uglify: {
      dist: {
        files: {
          'js/main.min.js': [
            'js/main.js'
          ]
        }
      }
    },

    // compass and scss
    compass: {
      dist: {
        options: {
          config: 'config.rb',
          force: true
        }
      }
    },

    // regarde to watch for changes and trigger compass, jshint, uglify and live reload
    regarde: {
      compass: {
        files: 'sass/*',
        tasks: ['compass', 'livereload']
      },
      js: {
        files: '<%= jshint.all %>',
        tasks: ['jshint', 'uglify', 'livereload']
      }
    },

    // image optimization
    imagemin: {
      dist: {
        options: {
          optimizationLevel: 7,
          progressive: true
        },
        files: [{
          expand: true,
          cwd: 'img/',
          src: '**/*',
          dest: 'img/'
        }]
      }
    }
  });

  // load tasks
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // register task
  grunt.registerTask('server', [
    //'livereload-start',
    'jshint',
    'compass',
    'uglify',
    'connect',
    'regarde'
  ]);
};