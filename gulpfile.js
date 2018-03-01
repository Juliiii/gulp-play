const gulp = require('gulp');
const del = require('del');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const htmlreplace = require('gulp-html-replace');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const runSequence = require('run-sequence');
const htmlMin = require('gulp-html-minify');
const eslint = require('gulp-eslint');
const plumder = require('gulp-plumber');
const gulpIf = require('gulp-if');

const src = {
  js: './app/**/*.js',
  css: './app/**/*.scss',
  html: './app/index.html',
  images: './app/images/*.{gif, jpg, jpeg, png}'
};

const dest = {
  dist: './dist',
  js: `./dist/js`,
  css: `./dist/css`,
  images: `./dist/images`,
  html: `./dist/index.html`
};

const clean = (callback) => del(dest.dist, callback);

const jsBuild = () => gulp
  .src(src.js)
  .pipe(plumder())
  .pipe(sourcemaps.init())
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(gulpIf(process.env.NODE_ENV === 'production', eslint.failAfterError()))
  .pipe(babel())
  .pipe(uglify())
  .pipe(concat('main.min.js'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(dest.js))
  .pipe(reload({stream: true}));

const stylesBuild = () => gulp
  .src(src.css)
  .pipe(plumder())
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(cleanCSS({
    keepSpecialComments: '*',
    compatibility: 'ie7'
  }))
  .pipe(concat('main.min.css'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(dest.css))
  .pipe(reload({stream: true}));

const htmlBuild = () => gulp
  .src(src.html)
  .pipe(plumder())
  .pipe(htmlreplace({
    'css': `/css/main.min.css`,
    'js': `/js/main.min.js`
  }))
  .pipe(htmlMin())
  .pipe(gulp.dest(dest.dist))
  .pipe(reload({stream: true}));

gulp.task('jsBuild', jsBuild);

gulp.task('stylesBuild', stylesBuild);

gulp.task('htmlBuild', htmlBuild);

gulp.task('clean', clean);

gulp.task('build', (callback) => {
  runSequence(
    'clean',
    ['jsBuild', 'stylesBuild'],
    'htmlBuild',
    callback);
});

gulp.task('dev', ['build'], () => {
  browserSync.init({
    server: {
      baseDir: dest.dist
    }
  });

  gulp.watch(src.css, ['stylesBuild']);
  gulp.watch(src.js, ['jsBuild']);
  gulp.watch(src.html, ['htmlBuild']);
  gulp.watch(src.images, ['imagesBuild']);
});
