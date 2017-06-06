var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var nodemon = require('gulp-nodemon');
var sourcemaps = require('gulp-sourcemaps');
var jade = require('gulp-jade');
var rename = require('gulp-rename');
var del = require('del');
var uglify = require('gulp-uglify');
// dev task start DONE can not compile the sass or less file
gulp.task('sass', function() {
    return gulp
        .src(['./sass/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'compact'
        }).on('error', sass.logError))
        .pipe(prefix('last 2 versions', '> 1%', 'ie8', 'Android 2'))
        .pipe(sourcemaps.write())
        .pipe(rename({                      // Renames the merged CSS file
            basename: 'style',              // The file name
            extname: '.css'                 // The file extension
        }))
        .pipe(gulp.dest('./public/stylesheets/'))
        .pipe(reload({
            stream: true
        }));
});
gulp.task('sass-watch', ['sass'], browserSync.reload);
gulp.task('browser-sync', ['nodemon', 'sass'], function() {
    browserSync.init(null, {
        proxy: 'http://localhost:3000',
        files: [
            'public/**/*.*', 'views/**/*.*', 'routes/*.*', 'sass/*.*'
        ],
        browser: 'chrome',
        notify: false,
        port: 5000
    });
    gulp.watch('sass/*.scss', ['sass-watch']);
});

gulp.task('js', function() {
    return gulp.src(['routes/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('nodemon', function(cb) {
    var called = false;
    return nodemon({
        script: 'bin/www'
    }).on('start', function() {
        if (!called) {
            cb();
            called = true;
        }
    });
});

gulp.task('clean', function(cb) {
    del(['./dist'], cb)
});


//build task start DONE add build task
gulp.task('jade', function() {
    return gulp
        .src(['views/**/*.jade', '!views/layout/**/*.jade', '!views/includes/**/*.jade'])
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('./dist/views'));
});

gulp.task('dist', ['jade', 'js']);

gulp.task('default', ['browser-sync']);