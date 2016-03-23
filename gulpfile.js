/******************************************************************************
 * Gulpfile
 * Be sure to run `npm install` for `gulp` and the following tasks to be
 * available from the command line. All tasks are run using `gulp taskName`.
 ******************************************************************************/
var gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  del = require('del'),
  gulp_jspm = require('gulp-jspm'),
  sass = require('gulp-sass'),
  sassResolver = require('./gulp/sassresolver.js'),
  sourcemaps = require('gulp-sourcemaps'),
  watch = require('gulp-watch')
// webpack = require('webpack')
  ;


var IONIC_DIR = "node_modules/ionic-angular/";

var sassComponentOptions = {
  errLogToConsole: true,
  includePaths: [
    IONIC_DIR,
    'node_modules/ionicons/dist/scss'
  ],
  outputStyle: 'expanded'
};

var logError = function (err) {
  console.error(err.message);
  this.emit('end');
};


/******************************************************************************
 * watch
 * Build the app and watch for source file changes.
 ******************************************************************************/
gulp.task('watch', ['sass', 'copy.fonts', 'copy.html', 'copy-app-source', 'copy-component-source'], function (done) {
  watch('app/**/*.scss', function () {
    gulp.start('sass-app');
  });
  watch('theme/**/*.scss', function () {
    gulp.start('sass-components');
  });
  watch('app/**/*.html', function () {
    gulp.start('copy.html');
  });
  watch('app/**/*.ts', function () {
    gulp.start('copy-app-source');
  });
  watch('components/**/*.ts', function () {
    gulp.start('copy-component-source');
  });
  bundle(true, done);
});


/******************************************************************************
 * build
 * Build the app once, without watching for source file changes.
 ******************************************************************************/
gulp.task('build', ['sass', 'copy.fonts', 'copy.html', 'copy-app-source', 'copy-component-source'], function (done) {
  bundle(false, done);
});


/******************************************************************************
 * sass
 * Convert Sass files to a single bundled CSS file. Uses auto-prefixer
 * to automatically add required vendor prefixes when needed.
 ******************************************************************************/
gulp.task('sass-app', function () {
  var autoprefixerOpts = {
    browsers: [
      'last 2 versions',
      'iOS >= 7',
      'Android >= 4',
      'Explorer >= 10',
      'ExplorerMobile >= 11'
    ],
    cascade: false
  };

  return gulp.src('theme/app.+(ios|md).scss')
    .pipe(sass({
      includePaths: [
        IONIC_DIR,
        'node_modules/ionicons/dist/scss'
      ]
    }))
    .on('error', logError)
    .pipe(autoprefixer(autoprefixerOpts))
    .pipe(gulp.dest('www/build/css'))
});

gulp.task('sass-components', function () {
  return gulp.src(['./components/**/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(sassResolver({systemConfig: './www/system.config.js'}))
    .pipe(sass(sassComponentOptions)
      .on('error', logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('www/components'))
});


// Default task; start local server & watch for changes.
gulp.task('sass', ['sass-app', 'sass-components']);


/******************************************************************************
 * copy.fonts
 * Copy Ionic font files to build directory.
 ******************************************************************************/
gulp.task('copy.fonts', function () {
  return gulp.src(IONIC_DIR + 'fonts/**/*.+(ttf|woff|woff2)')
    .pipe(gulp.dest('www/build/fonts'));
});


/******************************************************************************
 * copy.html
 * Copy html files to build directory.
 ******************************************************************************/
gulp.task('copy.html', function () {
  return gulp.src('app/**/*.html')
    .pipe(gulp.dest('www/build'));
});

gulp.task('copy-app-source', function () {
  return gulp.src('app/**/*.ts')
    .pipe(gulp.dest('www/build'));
});

gulp.task('copy-component-source', function () {
  return gulp.src('components/**/*.ts')
    .pipe(gulp.dest('www/components'));
});


/******************************************************************************
 * clean
 * Delete previous build files.
 ******************************************************************************/
gulp.task('clean', function (done) {
  del(['www/build'], done);
});


/******************************************************************************
 * Bundle
 * Transpiles source files and bundles them into build directory using webpack.
 ******************************************************************************/
function bundle(watch, cb) {
  // prevent gulp calling done callback more than once when watching
  var firstTime = true;

  // load webpack config
  // var config = require('./webpack.config.js');

  // https://github.com/webpack/docs/wiki/node.js-api#statstojsonoptions
  // var statsOptions = {
  //   'colors': true,
  //   'modules': false,
  //   'chunks': false,
  //   'exclude': ['node_modules']
  // };

  // var compiler = webpack(config);
  if (watch) {
    // compiler.watch(null, compileHandler);
  } else {
    gulp.src('www/build/app.ts')
      .pipe(sourcemaps.init())
      .pipe(gulp_jspm({selfExecutingBundle: true}))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('www/build/js'));
    // compiler.run(compileHandler);
    compileHandler();
  }

  function compileHandler(err, stats) {
    if (firstTime) {
      firstTime = false;
      cb();
    }

    // print build stats and errors
    // console.log(stats.toString(statsOptions));
  }
}
