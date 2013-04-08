'use strict';

module.exports = function (grunt) {

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    clean: {
      files: ['dist']
    },
    cssmin: {
      compress: {
        options: {
          banner: '<%= banner %>'
        },
        files: {
          "dist/uni-form.css": ["css/uni-form.css", "css/style.uni-form.css"]
        }
      },
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['src/uni-form.jquery.js'],
        dest: 'dist/uni-form.jquery.js'
      },
      dist_validation: {
        src: ['src/uni-form-validation.jquery.js', 'src/validators.js'],
        dest: 'dist/uni-form-validation.jquery.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/uni-form.jquery.min.js'
      },
      dist_validation: {
        src: '<%= concat.dist_validation.dest %>',
        dest: 'dist/uni-form-validation.jquery.min.js'
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: 'src/.jshintrc'
        },
        src: ['src/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      }
    },
    watch: {
      css: {
        files: 'css/*.css',
        tasks: ['cssmin']
      },
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'concat', 'uglify', 'qunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint','qunit', 'clean', 'concat', 'cssmin', 'uglify']);

  grunt.registerTask('travis', ['jshint', 'qunit']);

  // Alias this to make it standard across my repos. (Jasmine v. QUnit)
  grunt.registerTask('test', ['qunit']);

};
