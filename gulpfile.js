/// <binding AfterBuild='default' Clean='clean' />
var gulp = require('gulp');
var rimraf = require('rimraf');
var concat = require('gulp-concat');
var tap = require('gulp-tap');
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var exec = require('child_process').exec;
var connect = require('gulp-connect');
var chokidar = require('chokidar');
var batch = require('gulp-batch');
var http = require('http');
var fs = require('fs');
// var gcallback = require('gulp-callback')

var compileTS = require('gulp-typescript');
var projects = [
        {name: 'beatcode', files: 'scripts/beatcode/scripts/beatcode', project: compileTS.createProject('scripts/beatcode/tsconfig.json'), rootDir: 'scripts/beatcode/'},
        {name: 'foodapp', files: 'scripts/foodorder', project: compileTS.createProject('tsconfig.json'), rootDir: ''}
];

var paths = {
    npm: "./node_modules/",
    lib: "./wwwroot/lib/",
    componentTemplates: "./wwwroot/templates/",
    compiledTS: "./dist/",
    appjs: "./wwwroot/js/",
	beatcss: "./scripts/beatcode/wwwroot/css/"
};

var libs = [
    "scripts/beatcode/scripts/jQuery.js",
    "scripts/beatcode/scripts/jQuery-ui.min.js",
    "scripts/beatcode/scripts/pqgrid.min.js",
    "scripts/beatcode/scripts/bootstrap.min.js",
    "scripts/beatcode/scripts/kendo.all.min.js",
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

var lastChangeID = 1;
var busyBuild = false;

function buildProject(tsProject, path, cb) {
    lastChangeID++;
    var currChange = lastChangeID;
    setTimeout(function() {
        if (currChange == lastChangeID && !busyBuild) {
            busyBuild = true;
            log(`Build of ${tsProject.name} initiated from ${path}`);
            exec('cd "' + tsProject.rootDir  + '" & ' + 'tsc', function (err, stdout, stderr) {
                console.log(stdout);
                console.log(stderr);
                if (cb) {
                    cb(tsProject.name);
                }
                log(`Build of ${tsProject.name} completed`);
                busyBuild = false;
            });
/*            tsProject.project.src().pipe(compileTS(tsProject.project))
                .js
                .pipe(gulp.dest('output'))
                .pipe(gcallback(function() {
                    if (cb) {
                        cb(tsProject.name);
                    }
                    log(`Build of ${tsProject.name} completed`);
                    busyBuild = false;
                }));
*/
        }
    }, 1000);
}

gulp.task('compile-ts', function() {
    return projects.map(tsProject => { buildProject(tsProject, 'compile-ts') });
});

var log = console.log.bind(console);

function watchInner(cb) {
    projects.map(tsProject => {
        chokidar.watch(tsProject.files + '/**/*.ts')
            .on('add', path => buildProject(tsProject, path, cb))
            .on('change', path => buildProject(tsProject, path, cb));
    });
}

gulp.task('watcher', function () {
    watchInner();
});

gulp.task("libs", function () {
    gulp.src(libs).pipe(gulp.dest(paths.lib));
});

gulp.task("appCopy", function () {
    gulp.src("foodapp.js").pipe(gulp.dest(paths.appjs));
    gulp.src("scripts/beatcode/beatcode.js").pipe(gulp.dest(paths.lib));
    gulp.src(paths.beatcss + '**/*.*').pipe(gulp.dest('./wwwroot/css/'));
});

gulp.task("appCopyWithCompile", ['compile-ts', 'appCopy'], function () {
});

gulp.task('rxjs', function () {
    return gulp.src(paths.npm + 'rxjs/**/*.js').pipe(gulp.dest(paths.lib + 'rxjs/'));
});

gulp.task('templates', function () {
    return gulp.src('./scripts/**/*.html').pipe(gulp.dest(paths.componentTemplates));
});

gulp.task("clean", function (callback) {
    var dummyFun = function (x) { };

    rimraf(paths.appjs, dummyFun);
    rimraf(paths.compiledTS, dummyFun);
    rimraf(paths.lib, callback);
    rimraf(paths.componentTemplates, callback);
});

gulp.task('default', ['libs', 'templates', 'rxjs', 'appCopy'], function () {
	// nothing
});

gulp.task('webserver', function() {
  connect.server({
    root: 'wwwroot',
	port: 8888
  });
});

gulp.task('webserver-live', function() {
    connect.server({
        root: 'wwwroot',
        port: 8888,
        livereload: true
    });
    http.createServer(function (req, res) {
        var method = req.method;
        var body = [];
        var headers = {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'http://localhost:8888',
                        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                        'Access-Control-Allow-Credentials': 'true',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept'
                    };
                    
        if (method == "POST") {
            req.on('data', function(chunk) {
                body.push(chunk);
            }).on('end', function() {
                body = Buffer.concat(body).toString();
                res.writeHead(200, headers);
                res.end('Saved!');
                fs.writeFile('localStorage.dat', body);
                log(body);
            });
        } else if (method == "OPTIONS") {
            res.writeHead(200, headers);
            res.end('');
            log('CORS option request');
        } else {
            fs.readFile('localStorage.dat', (err, data) =>  {
                if (err) {
                    res.writeHead(400, headers);
                    res.end(err.message);
                    log(err.message);
                } else {
                    res.writeHead(200, headers);
                    res.end(data);
                    log('Local data storage requested and sent!');
                }
            });
        }
    }).listen(3456);

  // gulp.start('watch-wwwroot');
  watchInner(function(projectName) {
    gulp.start('appCopy', function () {
        log('AppCopy completed');
    });
  });
});

gulp.task('htmlreload', function () {
  gulp.src('./wwwroot/**/*.html')
    .pipe(connect.reload());
});

gulp.task('jsreload', function () {
  gulp.src('./wwwroot/**/*.js')
    .pipe(connect.reload());
});

gulp.task('watch-wwwroot', function () {
  gulp.watch(['./wwwroot/**/*.html'], ['htmlreload']);
  gulp.watch(['./wwwroot/**/*.js'], ['jsreload']);
});
