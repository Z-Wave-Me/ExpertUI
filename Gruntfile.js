module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // Clean dir
        clean: {
            options: { force: true },
            build: ["dist/"]
        },
        
        // Concat
        concat: {
            indexhtml: {
                src: ['index.tpl.html'],
                dest: 'dist/index.html'
            },
             css: {
                src: [
                    'app/css/bootstrap/bootstrap.css',
                    'app/css/main.css',
                    'app/css/font-awesome-4.1.0/css/font-awesome.min.css',
                    'app/css/angular-slider.css',
                    'app/css/main-responsive.css'
                ],
                dest: 'dist/app/css/build.css'
            },
            js: {
                src: [
                    // Vendors
                    'app/vendor/jquery/jquery-1.11.1.min.js',
                    'app/vendor/upload/angular-file-upload-shim.js',
                    // Angular
                    'app/vendor/angular/angular-1.2.14/angular.min.js',
                    'app/vendor/upload/angular-file-upload.js',
                    'app/vendor/angular/angular-1.2.14/angular-route.min.js',
                    'app/vendor/angular/angular-1.2.14/angular-resource.min.js',
                    'app/vendor/angular/angular-1.2.14/angular-cookies.min.js',
                     // Bootstrap
                    'app/vendor/bootstrap/bootstrap.min.js',
                     // XML
                     'app/vendor/xml/xml2json.js',
                      // Z-Wave uld ExpertU
                     'app/vendor/zwave/pyzw.js',
                     'app/vendor/zwave/pyzw_zwave_ui.js',
                    // APP
                    'app/core/app.js',
                    //'app/core/config.js',
                    'app/core/directives/directives.js',
                    'app/core/directives/angular-slider.js',
                    'app/core/filters/filters.js',
                    'app/core/factories/factories.js',
                    'app/core/services/services.js',
                    'app/core/controllers/controllers.js',
                    //'app/core/controllers/configuration-controller.js',
                    'app/core/controllers/configuration.js',
                    'app/core/jquery/jquery-app.js',
                    
                ],
                dest: 'dist/app/core/build.js'
            }
        },
        // Copy
        copy: {
            main: {
                files: [
                    {
                        src: [
                           'app/images/**',
                            'app/views/**',
                            'app/core/lang/**'
                        ], dest: 'dist/'
                    },
                     {expand:true,src: ['app/core/config.js'], dest: 'dist/app/core/',flatten: true}
                    /*{src: ['storage/img/**'], dest: 'dist/'},
                    {src: ['storage/demo/**'], dest: 'dist/'},
                    {src: ['storage/data/**'], dest: 'dist/'}*/
                ]
            },
            fonts: {
                files: [
                    {expand:true,src: ['app/css/font-awesome-4.1.0/fonts/*'], dest: 'dist/app/fonts/',flatten: true}
                ]
            },
            angmap: {
                files: [
                    {expand:true,src: ['app/vendor/angular/angular-1.2.14/angular-cookies.min.js.map'], dest: 'dist/app/core/',flatten: true},
                     {expand:true,src: ['app/vendor/angular/angular-1.2.14/angular.min.js.map'], dest: 'dist/app/core/',flatten: true},
                      {expand:true,src: ['app/vendor/angular/angular-1.2.14/angular-route.min.js.map'], dest: 'dist/app/core/',flatten: true}
                ]
            }
        },
        
        //CSSS min
        cssmin: {
            my_target: {
                options: {
                    banner: '/* Minified css file */',
                    keepSpecialComments: 0
              },
              files: [
                  {
                    expand: true,
                    cwd: 'dist/app/css/',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist/app/css/',
                    ext: '.css'
                }
               ]
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-string-replace');

    // Default task(s).
    //grunt.registerTask('default', ['clean','concat','copy','cssmin','string-replace']);
    grunt.registerTask('default', ['clean','concat','copy','cssmin']);

};