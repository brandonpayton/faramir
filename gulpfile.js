var gulp = require('gulp');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');

var paths = {
    source: 'source/**/*.js',
    distribution: 'distribution'
}

gulp.task('build', function () {
    return gulp.src(paths.source)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.distribution));
});