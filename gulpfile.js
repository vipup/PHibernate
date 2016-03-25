/******************************************************************************
 * Gulpfile
 * Be sure to run `npm install` for `gulp` and the following tasks to be
 * available from the command line. All tasks are run using `gulp taskName`.
 ******************************************************************************/
var gulp = require('gulp'),
    del = require('del'),
    gulp_jspm = require('gulp-jspm'),
    sourcemaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch'),
    argv = process.argv,
    Q = require('q')
    ;

/******************************************************************************
 * watch
 * Build the app and watch for source file changes.
 ******************************************************************************/
gulp.task('watch', ['copy-app-source'], function (done) {
    watch('app/**/*.ts', function () {
        gulp.start('copy-app-source');
    });
    var deferred = Q.defer();
    setTimeout(function () {
        deferred.resolve();
    }, 1000);
    return deferred.promise;
});


/******************************************************************************
 * build
 * Build the app once, without watching for source file changes.
 ******************************************************************************/
gulp.task('build', ['copy-app-source'], function (done) {
    bundle(done);
});


gulp.task('copy-app-source', function () {
    return gulp.src('app/**/*.ts')
        .pipe(gulp.dest('www/build'));
});


/******************************************************************************
 * clean
 * Delete previous build files.
 ******************************************************************************/
gulp.task('clean', function (done) {
    del(['www/build/core'], done);
});


/******************************************************************************
 * Bundle
 * Transpiles source files and bundles them into build directory using JSPM.
 ******************************************************************************/
function bundle(watch, cb) {
    // prevent gulp calling done callback more than once when watching
    var firstTime = true;

    gulp.src('www/build/app.ts')
        .pipe(sourcemaps.init())
        .pipe(gulp_jspm({selfExecutingBundle: true}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('www/build/js'));
    // compiler.run(compileHandler);
    compileHandler();

    function compileHandler(err, stats) {
        if (firstTime) {
            firstTime = false;
            cb();
        }
        // print build stats and errors
        // console.log(stats.toString(statsOptions));
    }

    return true;
}

/**
 * Ionic hooks
 * Add ':before' or ':after' to any Ionic project command name to run the specified
 * tasks before or after the command.
 */
gulp.task('serve:before', ['watch']);
gulp.task('emulate:before', ['build']);
gulp.task('deploy:before', ['build']);

// we want to 'watch' when livereloading
var shouldWatch = argv.indexOf('-l') > -1 || argv.indexOf('--livereload') > -1;
gulp.task('run:before', [shouldWatch ? 'watch' : 'build']);
