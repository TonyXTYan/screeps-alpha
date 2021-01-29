module.exports = function(grunt) {
    require('time-grunt')(grunt);
    
    var config = require('./.screeps.json')
    var branch = grunt.option('branch') || config.branch;
    var email = grunt.option('email') || config.email;
    var token = grunt.option('token') || config.token;
    var ptr = grunt.option('ptr') ? true : config.ptr
    // e.g. grunt screeps --ptr=true --branch=development
    
    grunt.loadNpmTasks('grunt-screeps');
    grunt.loadNpmTasks('grunt-contrib-concat'); // ????
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-file-append');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    var currentdate = new Date(); 
    // Output the current date and branch.
    grunt.log.subhead('Task Start: ' + currentdate.toLocaleString())
    grunt.log.writeln('Branch: ' + branch)
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        screeps: {
            options: {
                email: email,
                token: token,
                branch: branch,
                ptr: ptr
                //server: 'season'
            },
            dist: {
                src: ['dist/*.js']
                // src: ['src/*.js']
            }
        },
        
        // Remove all files from the dist folder.
        clean: {
            'dist': ['dist'], 
        }, 
        
        concat: {
            // options: {
            // }, 
            dist: {
                src: ['src/**/*.js'],
                dest: 'dist/main.js'
            },
        },
        
        // Copy all source files into the dist folder, flattening the folder structure by converting path delimiters to underscores
        copy: {
            // Pushes the game code to the dist folder so it can be modified before being send to the screeps server.
            screeps: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: '**',
                    dest: 'dist/',
                    filter: 'isFile',
                    rename: function (dest, src) {
                        // Change the path name utilize underscores for folders
                        return dest + src.replace(/\//g,'_');
                    }
                }],
            }
        },
        
        // Add version variable using current timestamp.
        file_append: {
            versioning: {
                files: [
                    {
                        //   append: "\nglobal.SCRIPT_VERSION = " + currentdate.getTime() + "\n",
                        append: '\nbasic\n',
                        input: 'dist/version.js',
                    }
                    // function () { return {
                    //     append: "\nglobal.SCRIPT_VERSION = "+ currentdate.getTime() + "\n",
                    //     input: 'dist/version.js',
                    // }}
                ]
            }
        },
        
        // Apply code styling
        jsbeautifier: {
            modify: {
                src: ["src/**/*.js"],
                options: {
                    config: '.jsbeautifyrc'
                }
            },
            verify: {
                src: ["src/**/*.js"],
                options: {
                    mode: 'VERIFY_ONLY',
                    config: '.jsbeautifyrc'
                }
            }
        },
        
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js']
        },

        watch: {
            files: 'src/**/*.js',
            tasks: ['clean', 'copy:screeps', 'screeps']
        },
        
    });
    
    // file_append doesn't work
    // grunt.registerTask('default',  ['clean', 'copy:screeps', 'file_append:versioning', 'screeps']);
    
    
    grunt.registerTask('default',  ['clean', 'copy:screeps', 'screeps']);
    grunt.registerTask('test',     ['jsbeautifier:verify']);
    grunt.registerTask('pretty',   ['jsbeautifier:modify']);
    
    // grunt.registerTask('jshint',   ['jshint']);
}