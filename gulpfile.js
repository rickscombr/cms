'use strict';


//=================
//   DEPENDENCIAS
//=================	

const gulp = require('gulp'),
    sass = require('gulp-sass'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    include = require('gulp-html-tag-include'),
    htmlmin = require('gulp-htmlmin'),
    plumber = require('gulp-plumber'),
    imagemin = require('gulp-imagemin'),
    cleanCSS = require('gulp-clean-css'),
    condition = require('gulp-if'),
    browserSync = require('browser-sync').create(),
    runSequence = require('run-sequence'),
    mocha = require('gulp-mocha'),
    utils = require('gulp-util'),
    autoprefixer = require('gulp-autoprefixer'),
    eventStream = require('event-stream');



//=================
//  VARS
//=================

let build = false;



//=================
//  TASKS
//=================

// REMOVE DIST
gulp.task('clean', function() {
    return gulp.src('./dist')
        .pipe(clean());
});

// TAREFA CRIADA PARA CÓPIA DE ARQUIVOS COMUNS COMO PDFS, FONTS E XMLS PARA A DIST
gulp.task('sync-files', function() {
    gulp.src(['app/assets/font/**/*'])
        .pipe(plumber())
        .pipe(gulp.dest('dist/assets/font'));
});


// TAREFA CRIADA PARA CÓPIA DE ARQUIVOS COMUNS COMO PDFS, FONTS E XMLS PARA A DIST
gulp.task('copy-error-files', function() {
    gulp.src(['app/assets/error/**/*'])
  .pipe(plumber())
  .pipe(gulp.dest('dist/assets/error'));
});


// TAREFAS PARA COPIAR TODAS AS IMAGES DO PROJETO
gulp.task('copy-images', function() {
    return gulp.src([
            './app/assets/images/**/**/*.png',
            './app/assets/images/**/**/*.jpg',
            './app/assets/images/**/**/*.gif',
            './app/assets/images/**/**/*.jpeg'
        ])
        .pipe(gulp.dest('./dist/assets/images'));
});

// TAREFAS PARA COPIAR ARQUIVOS DE DADOS, USADOS PARA TESTE
gulp.task('copy-data', function() {
    gulp.src(['app/data/**/*'])
        .pipe(plumber())
        .pipe(gulp.dest('dist/data'));
});

// TAREFAS PARA COPIAR EM UM UNICO ARQUIVO TODOS OS SCRIPTS EXTERNOS
// OBS: FAVOR NÃO MUDAR A ORDEM DOS ITENS ABAIXO
gulp.task('require', function() {
    return eventStream.merge([
            gulp.src(
                [
                    'bower_components/jquery/dist/jquery.js',
                    'app/assets/js/geral/jqueryAutocomplete/jqueryAutocomplete.min.js',
                    'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
                    'bower_components/owl.carousel/dist/owl.carousel.js',
                    'node_modules/moment/moment.js',
                    'app/assets/js/geral/datepicker/datepicker.js',
                    'node_modules/requirejs/require.js'
                ]
            )
        ])
        .pipe(concat('require.js'))
        .pipe(condition(build, uglify()))
        .pipe(gulp.dest('./dist/assets/js/vendor'));
});

gulp.task('app', function() {
    return eventStream.merge([
            gulp.src(['./app/assets/js/geral/*.js'])
        ])
        .pipe(concat('app.js'))
        .pipe(condition(build, uglify()))
        .pipe(gulp.dest('./dist/assets/js'));
});

gulp.task('inject', function() {
    return eventStream.merge([
            gulp.src(['./app/assets/js/components/**/*.js', ])
        ])
        .pipe(condition(build, uglify()))
        .pipe(gulp.dest('./dist/assets/js/components'));
});


// TAREFA PARA TRANSFORMAR TODOS ESTILOS SASS EM CSS
gulp.task('sass', function() {
    return gulp.src(
            [
                './app/assets/scss/*.scss',
                './app/assets/scss/**/*.scss',
                'bower_components/owl.carousel/dist/assets/owl.carousel.css',
                './app/assets/scss/common/font-awesome.css'
            ]
        ).pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({ browsers: ['last 10 versions'], cascade: true }))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./dist/assets/css'))
        .pipe(browserSync.stream());
});

// TAREFA PARA TRATAR O LIVE RELOAD APOS ALTERACAO DE UM SCRIPT
gulp.task('js-watch', ['app', 'inject', 'require'], function(done) {
    browserSync.reload();
    done();
});

// TAREFA PARA TRATAR INCLUDES ( HEADER E FOOTER )
gulp.task('html-include', function() {
    return gulp.src('./app/*.html')
        .pipe(include())
        .pipe(gulp.dest('./dist'));
});

// TAREFA PARA TRATAR O LIVE RELOAD DE ACORDO COM AS ALTERACOES NOS ARQUIVOS DO AMBIENTE DE DESENVOLVIMENTO
gulp.task('serve-dev', function() {
    browserSync.init({
        server: './dist'
    });
    gulp.watch('./app/assets/scss/**/*.scss', ['sass']);
    gulp.watch('./app/assets/js/**/*.js', ['js-watch']);
    gulp.watch('./app/**/*.html', ['html-include']);
    gulp.watch("./app/**/*.html").on('change', browserSync.reload);
});

// TAREFAS DO AMBIENTE DE PRODUCAO
// TAREFA PARA MINIFICAR TODOS OS ESTILOS
gulp.task('css-minify', function() {
    return gulp.src([
            './dist/assets/css/main.css',
            'bower_components/owl.carousel/dist/assets/owl.carousel.css'
        ])
        .pipe(concat('main.css'))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest('./dist/assets/css'));
});

// TAREFA PARA MINIFICAR O HTML
gulp.task('html-minify', function() {
    return gulp.src('./dist/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist'));
});

// TAREFA PARA OTIMIZAR TODAS AS IMAGENS
gulp.task('images-minify', function() {
    return gulp.src('./app/assets/images/**/*')
        .pipe(imagemin([imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({ plugins: [{ removeViewBox: true }] })
        ]))
        .pipe(gulp.dest('./dist/assets/images'));
});


gulp.task('test', function() {
    return gulp.src(['test/**/*.js'], { read: false })
        .pipe(mocha({
            reporter: 'mocha-junit-reporter',
            reporterOptions: {
                mochaFile: 'temp/report.xml'
            }
        }))
        .once('end', function() {
            process.exit();
        }),
        process.env.NODE_ENV = "https://www.claro.com.br";
});

gulp.task('test-dev', function() {
    return gulp.src(['test/**/*.js'], { read: false })
        .pipe(mocha({
            reporter: 'spec'
        }))
        .once('end', function() {
            process.exit();
        }),
        /*process.env.NODE_ENV = "http://cms.devclaro.amxdev.net";*/

        process.env.NODE_ENV = "https://www.claro.com.br";
});



gulp.task('watch-dev', function() {
    gulp.watch(['test/**'], ['test']);
});



// TAREFA PARA SUBIR O SERVIDOR COM OS ARQUIVOS DO BUILD DE PRODUCAO
gulp.task('serve-build', function() {
    browserSync.init({
        server: './dist',
        port: '4000'
    });
});


//======================
//  TAREFA DEV
//======================

gulp.task('dev', function() {
    runSequence(
        'clean', ['sync-files', 'copy-error-files','copy-images', 'copy-data', 'sass', 'require', 'app', 'inject', 'html-include'],
        'serve-dev'
    )
});


//======================
//  TAREFA BUILD/PROD
//======================

gulp.task('build', function() {
    build = true;

    runSequence(
        'clean', ['sync-files', 'copy-error-files', 'images-minify', 'copy-data', 'sass', 'html-include', 'require', 'app', 'inject'], ['html-minify', 'css-minify']
    )
});


//======================
//  TAREFA DE TESTES
//======================

// gulp.task('test', runSequence(['test']));