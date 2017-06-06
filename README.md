# 基于 Express+Gulp+BrowserSync 搭建一套高性能的前端开发环境
Express 是比较经典的，也是最常用的 Nodejs Web框架。
### 一、Express 快速构建一个web应用程序或架
#### 1、首先用全局安装 express-generator!
```javascript
npm install express-generator -g
```
#### 2、生成项目
```javascript
express express-gulp
```
#### 3、执行
运行项目之前，先安装依赖包。在项目根目录下运行：
```javascript
npm install
```
安装完成之后，启动服务器：
```javascript
npm start
```
#### 4、打开浏览器浏览 http://localhost:3000/，就可以访问了！
基本的应用框架搭好了，但是每次文件修改后，必须在浏览器中刷新（F5），才能看到最新修改后的效果，每次这样的操作，是不是很繁琐呢？如何无刷新监控文件变化呢？这个时候自动化构建工具 grunt、gulp 就派上用场了！这里只讨论 gulp ！

### 二、加入 Gulp 自动化

#### 1、安装gulp，进入项目目录，执行命令：(ps:gulp 首先需全局安装一次)
```bash
npm install gulp --save-dev 
```
#### 2、安装所需的 gulp 插件
```bash   
npm install gulp-uglify --save -dev             // js压缩插件
npm install gulp-autoprefixer --save -dev       // css3文件前缀
npm install gulp-nodemon --save -dev            // 项目自动重启
npm install gulp-rename --save -dev             // 重命名
npm install del --save -dev                     // 文件删除模块
npm install node-sass -dev                      // gulp-sass 依赖于此  
npm install gulp-sass -dev                      // 构建编译sass
npm install gulp-sourcemaps -dev                // sassmaps，生成的css文件下面会加上这个
```
这里需要注意，在安装 gulp-sass 的时候，需要先安装 node-sass，并且在安装的时候，有可能会安装失败，这个时候，可以用 cnpm 试一下
```bash
cnpm node-sass gulp-sass --save-dev
```
### 3、安装 browser-sync 
```bash
npm install browser-sync --save-dev
```
browser-sync 是重头戏，可以监控文件的变化实现自动刷新，具体的API用法可以参考(官方文档)[http://www.browsersync.cn/docs/gulp/]！
### 4、配置gulpfile.js
```bash
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
```
### 运行
```javascript
gulp 
```
运行完命令，会自动打开浏览器，大功告成！