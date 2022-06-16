import gulp from 'gulp';
const { src, dest, watch } = gulp;

import sass from 'gulp-dart-sass';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';

import htmlmin from 'gulp-htmlmin';

import libsquoosh from 'gulp-libsquoosh';

import rename from 'gulp-rename';
import del from 'del';
import browser from 'browser-sync';

import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import webpackConfig from './webpack.config.js';

//Styles

const styles = () => {
    return src('src/sass/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(rename('styles.min.css'))
        .pipe(dest('dist/css'))
        .pipe(browser.stream());
}

const scripts = () => {
  return src('src/js/main.js')
      .pipe(webpackStream(webpackConfig, webpack))
      .pipe(dest('dist/js'))
}


//Clean

const clean = () => {
    return del('dist')
}

//HTML

const html = () => {
    return src('src/index.html')
        .pipe(htmlmin({
            sortAttributes: true,
            removeComments: true,
            collapseWhitespace: true
        }))
        .pipe(dest('dist'));
}

//Images

const images = () => {
    return src('src/images/*.{jpg,png,svg}')
        .pipe(libsquoosh())
        .pipe(dest('dist/img'))
}

//WebP

const webp = () => {
    return src('src/images/*.{jpg,png}')
        .pipe(libsquoosh({
            webp: {}
        }))
        .pipe(dest('dist/img/'))
}

//Copy

const copy = () => {
    return src('src/fonts/*.{woff2,woff}', {
        base: 'src',
        allowEmpty: true
    })
        .pipe(dest('dist'))
}

// Server

const server = (done) => {
    browser.init({
        server: {
            baseDir: 'dist'
        },
        cors: true,
        notify: false,
        ui: false,
    });
    done();
}

// Reload

const reload = (done) => {
    browser.reload();
    done();
}

//Watcher

const watcher = () => {
    watch('src/**/*.scss', gulp.series(styles));
    watch('src/*.html', gulp.series(html, reload));
    watch('src/images/*.{jpg,png}', gulp.series(images));
    watch('src/**/*.js', gulp.series(scripts, reload));
}

//Default

export default gulp.series(
    clean,
    copy,
    gulp.parallel(
        images,
        webp,
        styles,
        html,
        scripts
    ),
    gulp.series(
        server,
        watcher
    )
)
