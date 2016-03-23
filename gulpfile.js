/// <binding AfterBuild='libs, rxjs, templates, appCopy' Clean='clean' />
var gulp = require('gulp');
var rimraf = require('rimraf');
var concat = require('gulp-concat');
var tap = require('gulp-tap');
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var exec = require('child_process').exec;
var connect = require('gulp-connect');

var paths = {
    npm: "./node_modules/",
    lib: "./wwwroot/lib/",
    componentTemplates: "./wwwroot/components/",
    compiledTS: "./dist/",
    appjs: "./wwwroot/js/",
	beatcss: "./scripts/beatcode/wwwroot/css/"
};

var libs = [
    "scripts/beatcode/scripts/jQuery.js",
    "scripts/beatcode/scripts/jQuery-ui.min.js",
    "scripts/beatcode/scripts/pqgrid.min.js",
	"scripts/beatcode/beatcode.js",
    paths.npm + "angular2/bundles/angular2.js",
    paths.npm + "angular2/bundles/router.js",
    paths.npm + "angular2/bundles/http.js",
    paths.npm + "angular2/bundles/angular2-polyfills.js",
    paths.npm + "es6-shim/es6-shim.js",
    paths.npm + "zone.js/dist/zone.js",
    paths.npm + "moment/moment.js",
    paths.npm + "reflect-metadata/reflect.js",
    paths.npm + "systemjs/dist/system.js",
    paths.npm + "systemjs/dist/system-polyfills.js",
    paths.npm + "ng2-bootstrap/bundles/ng2-bootstrap.js"
];

gulp.task("libs", function () {
    gulp.src(libs).pipe(gulp.dest(paths.lib));
});

gulp.task("appCopy", function () {
    gulp.src("foodapp.js").pipe(gulp.dest(paths.appjs));
});

gulp.task('rxjs', function () {
    return gulp.src(paths.npm + 'rxjs/**/*.js').pipe(gulp.dest(paths.lib + 'rxjs/'));
});

gulp.task('beatcss', function () {
    return gulp.src(paths.beatcss + '**/*.*').pipe(gulp.dest('./wwwroot/css/'));
});

gulp.task('templates', function () {
    return gulp.src('./scripts/components/**/*.html').pipe(gulp.dest(paths.componentTemplates));
});

gulp.task("clean", function (callback) {
    var dummyFun = function (x) { };

    rimraf(paths.appjs, dummyFun);
    rimraf(paths.compiledTS, dummyFun);
    rimraf(paths.lib, callback);
});

gulp.task('default', ['libs', 'templates', 'rxjs', 'appCopy', 'beatcss'], function () {
	// nothing
});

gulp.task('webserver', function() {
  connect.server({
    root: 'wwwroot',
	port: 8888,
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./wwwroot/*.html')
    .pipe(connect.reload());
});
 
gulp.task('watch', function () {
  gulp.watch(['./wwwroot/*.html'], ['html']);
});
