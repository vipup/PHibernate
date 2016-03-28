require('typescript-require');
require('./gulpfile.ts');
/**
 * Created by Papa on 3/23/2016.
 */
var gulp = require('gulp');
var tsc = require('gulp-tsc');
var shell = require('gulp-shell');
var runseq = require('run-sequence');
var paths = {
    tscripts: {
        src: [
            './server.ts',
            'app/**/*.ts',
            'public/**/*.ts',
            'Scripts/**/*.ts'
        ],
        dest: './'
    }
};
gulp.task('default', ['buildrun']);
// Run
gulp.task('run', shell.task([
    'node ./server.js'
]));
gulp.task('buildrun', function (cb) {
    runseq('build', ['run'], cb);
});
// Compile
gulp.task('build', ['compile:typescript']);
gulp.task('compile:typescript', function () {
    return gulp
        .src(paths.tscripts.src)
        .pipe(tsc({
        module: "CommonJS",
        sourcemap: true,
        emitError: false
    }))
        .pipe(gulp.dest(paths.tscripts.dest));
});
