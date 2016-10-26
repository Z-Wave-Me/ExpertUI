module.exports = function (grunt) {

// Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // Clean dir
        clean: {
            options: {force: true},
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
                    'app/css/main.css'
                ],
                dest: 'dist/app/css/build.css'
            },
            js: {
                src: [
                    // Vendors
                    'app/vendor/jquery/jquery-1.11.1.min.js',
                    'app/vendor/underscore/underscore-1.8.3/underscore-min.js',
                    'app/vendor/cytoscape/cytoscape.js',
                    'app/vendor/upload/angular-file-upload-shim.js',
                    'app/vendor/alertify/alertify.min.js',
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
                    // Z-Wave old ExpertU
                    'app/vendor/zwave/pyzw.js',
                    'app/vendor/zwave/pyzw_zwave_ui.js',
                    // CANVAS JS
                    'app/vendor/canvasjs/canvasjs.min.js',
                    // APP
                    'app/app.js',
                    'app/modules/qAllSettled.js',
                    'app/directives/directives.js',
                    'app/directives/angular-slider.js',
                    'app/directives/dir-pagination.js',
                    'app/filters/filters.js',
                    'app/factories/factories.js',
                    'app/services/services.js',
                    // Controllers
                    'app/controllers/base.js',
                    'app/controllers/controllers.js',
                    'app/controllers/settings.js',
                    'app/controllers/switch.js',
                    'app/controllers/sensor.js',
                    'app/controllers/meter.js',
                    'app/controllers/thermostat.js',
                    'app/controllers/lock.js',
                    'app/controllers/status.js',
                    'app/controllers/battery.js',
                    'app/controllers/type.js',
                    'app/controllers/association.js',
                    'app/controllers/controll.js',
                    'app/controllers/routing.js',
                    'app/controllers/reorganization.js',
                    'app/controllers/timing.js',
                    'app/controllers/controllerinfo.js',
                    'app/controllers/queue.js',
                    'app/controllers/interviewcommand.js',
                    'app/controllers/license.js',
                    'app/controllers/uzb.js',
                    'app/controllers/zniffer.js',
                    'app/controllers/spectrum.js',
                    'app/controllers/networkmap.js',
                    'app/controllers/home.js',
                    'app/controllers/configuration.js',
                    'app/controllers/assoc.js',
                    'app/jquery/jquery-app.js'

                ],
                dest: 'dist/app/build.js'
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
                            'app/lang/**'
                        ], dest: 'dist/'
                    },
                    {src:[ 'storage/**'],dest: 'dist/'},
                    {expand: true, src: ['app/config.js'], dest: 'dist/app/', flatten: true}
                    /*{src: ['storage/img/**'], dest: 'dist/'},
                     {src: ['storage/demo/**'], dest: 'dist/'},
                     {src: ['storage/data/**'], dest: 'dist/'}*/
                ]
            },
            fonts: {
                files: [
                    {expand: true, src: ['app/fonts/*'], dest: 'dist/app/fonts/', flatten: true}
                ]
            },
            angmap: {
                files: [
                    {expand: true, src: ['app/vendor/angular/angular-1.2.14/angular-cookies.min.js.map'], dest: 'dist/app/', flatten: true},
                    {expand: true, src: ['app/vendor/angular/angular-1.2.14/angular.min.js.map'], dest: 'dist/app/', flatten: true},
                    {expand: true, src: ['app/vendor/angular/angular-1.2.14/angular-route.min.js.map'], dest: 'dist/app/', flatten: true}
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
    grunt.registerTask('default', ['clean', 'concat', 'copy', 'cssmin']);
};