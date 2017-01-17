module.exports = function (grunt) {

// Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // Banner
        banner: 'Copyright:  Z-Wave Europe, Created: <%= grunt.template.today("dd-mm-yyyy HH:MM:ss") %>',
        // Clean dir
        clean: {
            options: {force: true},
            build: ["dist/"]
        },
        // NG templates
        ngtemplates: {
            app: {
                options: {
                    standalone: true,
                    module: 'myAppTemplates',
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true,
                        removeComments: true, // Only if you don't use comment directives!
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    }
                },
                src: 'app/views/**/*.html',
                dest: 'dist/app/js/templates.js'
            }
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
                    'vendor/jquery/jquery-1.11.1.min.js',
                    'vendor/underscore/underscore-1.8.3/underscore-min.js',
                    'vendor/routemap/d3.v4.min.js',
                    'vendor/routemap/data.js',
                    'vendor/routemap/ZWaveAnalytics.min.js',
                    'vendor/routemap/ZWaveRouteMapDraw.min.js',
                    'vendor/cytoscape/cytoscape.js',
                    'vendor/upload/angular-file-upload-shim.js',
                    'vendor/alertify/alertify.min.js',
                    // Angular
                    'vendor/angular/angular-1.2.14/angular.min.js',
                    'vendor/upload/angular-file-upload.js',
                    'vendor/angular/angular-1.2.14/angular-route.min.js',
                    'vendor/angular/angular-1.2.14/angular-resource.min.js',
                    'vendor/angular/angular-1.2.14/angular-cookies.min.js',
                    // Bootstrap
                    'vendor/bootstrap/bootstrap.min.js',
                    // XML
                    'vendor/xml/xml2json.js',
                    // Z-Wave old ExpertU
                    'vendor/zwave/pyzw.js',
                    'vendor/zwave/pyzw_zwave_ui.js',
                    // CANVAS JS
                    'vendor/canvasjs/canvasjs.min.js',
                    // APP
                    'app/app.js',
                    'app/routes.js',
                    'dist/app/js/templates.js',
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
                    'app/controllers/expert_config.js',
                    'app/controllers/auth.js',
                    'app/controllers/settings.js',
                    'app/controllers/settings.js',
                    'app/controllers/switch.js',
                    'app/controllers/sensor.js',
                    'app/controllers/meter.js',
                    'app/controllers/thermostat.js',
                    'app/controllers/lock.js',
                    'app/controllers/notification.js',
                    'app/controllers/status.js',
                    'app/controllers/battery.js',
                    'app/controllers/type.js',
                    'app/controllers/association.js',
                    'app/controllers/control.js',
                    'app/controllers/statistics.js',
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
                    'app/controllers/routemap.js',
                    'app/controllers/networkmap.js',
                    'app/controllers/home.js',
                    'app/controllers/configuration.js',
                    'app/controllers/configuration_interview.js',
                    'app/controllers/configuration_configuration.js',
                    'app/controllers/configuration_commands.js',
                    'app/controllers/configuration_association.js',
                    'app/controllers/configuration_firmware.js',
                    'app/controllers/configuration_health.js',
                    'app/controllers/configuration_postfix.js',
                    'app/jquery/jquery-app.js'

                ],
                dest: 'dist/app/js/build.js'
            }
        },
        json_generator: {
            target: {
                dest: "app/info.json",
                options: {
                    name: 'Expert UI',
                    built: '<%= grunt.template.today("dd-mm-yyyy HH:MM:ss") %>',
                    timestamp: '<%= Math.floor(Date.now() / 1000) %>'
                }
            }
        },
        // Copy
        copy: {
            main: {
                files: [
                    {
                        src: [
                            'app/images/**',
                            //'app/views/**',
                            'app/lang/**'
                        ], dest: 'dist/'
                    },
                    {src:[ 'storage/**'],dest: 'dist/'},
                    {expand: true, src: ['app/config.js'], dest: 'dist/app/js/', flatten: true}
                    /*{src: ['storage/img/**'], dest: 'dist/'},
                     {src: ['storage/demo/**'], dest: 'dist/'},
                     {src: ['storage/data/**'], dest: 'dist/'}*/
                ]
            },
            info: {
                files: [
                    {src: ['app/info.json'], dest: 'dist/app/info.json'}
                ]
            },
            fonts: {
                files: [
                    {expand: true, src: ['app/fonts/*'], dest: 'dist/app/fonts/', flatten: true}
                ]
            },
            angmap: {
                files: [
                    {expand: true, src: ['vendor/angular/angular-1.2.14/angular-cookies.min.js.map'], dest: 'dist/app/js/', flatten: true},
                    {expand: true, src: ['vendor/angular/angular-1.2.14/angular.min.js.map'], dest: 'dist/app/js/', flatten: true},
                    {expand: true, src: ['vendor/angular/angular-1.2.14/angular-route.min.js.map'], dest: 'dist/app/js/', flatten: true}
                ]
            },
            licence: {
                files: [
                    {src: ['LICENCE.md'], dest: 'dist/LICENCE.md'}
                ]
            }
        },
        //CSSS min
        cssmin: {
            my_target: {
                options: {
                    banner: '/* <%= banner %> */',
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
        },
        usebanner: {
            jscss: {
                options: {
                    position: 'top',
                    banner: '/* <%= banner %> */'
                },
                files: {
                    src: [ 'dist/app/js/templates.js','dist/app/js/config.js','dist/app/js/build.js']
                }
            },
            html: {
                options: {
                    position: 'top',
                    banner: '<!-- <%= banner %> -->'
                },
                files: {
                    src: [ 'dist/index.html']
                }
            }
        }
    });
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-json-generator');

    // Default task(s).
    //grunt.registerTask('default', ['clean','concat','copy','cssmin','string-replace']);
    grunt.registerTask('default', ['clean', 'ngtemplates','concat', 'json_generator','copy', 'cssmin','usebanner']);
};