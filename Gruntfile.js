module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			build: 'build/'
		},
		copy: {
			js: {
				expand: true,
				flatten: true,
				isFile: true,
				src: ['source/*.js'],
				dest: 'build/'
			},
			examples: {
				expand: true,
				cwd: 'source/examples/',
				src: ['**'],
				dest: 'build/examples/'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'* <%= pkg.homepage %>/\n' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>; Licensed <%= pkg.license %> */\n',
				mangle: {
					except: ['_super']
				}
			},
			dist: {
				files: {
					'build/Class.min.js': ['build/Class.js'],
					'build/Class.polyfills.min.js': ['build/Class.polyfills.js']
				}
			}
		},
		jshint: {
			files: ['Gruntfile.js', 'source/**/*.js'],
			options: {
				globals: {
					eqeqeq: true
				}
			}
		},
		mochacov: {
			test: {}, // Run with the spec testrunner
			coverage: {
				options: {
					coveralls: {
						serviceName: 'travis-ci'
					}
				}
			},
			options: {
				reporter: 'spec',
				ignoreLeaks: false,
				files: 'test/*.js'
			}
		},
		watch: {
			files: ['source/**', 'test/**'],
			tasks: ['jshint', 'test']
		},
		benchmark: {
			all: {
				src: ['benchmarks/*.js'],
				dest: 'build/testResults.csv'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-mocha-cov');
	grunt.loadNpmTasks('grunt-benchmark');
	
	grunt.registerTask('travis', [ 'jshint', 'mochacov:coverage', 'benchmark' ]);
	grunt.registerTask('test', [ 'jshint', 'mochacov:test' ]);
	grunt.registerTask('default', [ 'clean', 'test', 'copy', 'uglify' ]);
};
