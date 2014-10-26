var gulp = require('gulp'),
    shell = require('gulp-shell'),
    del = require('del'),
    bower = require('gulp-bower'),
    react = require('gulp-react'),
    filter = require('gulp-filter');


gulp.task('watch',function(){
    gulp.watch('public/**/*.html', ['reload-chrome']);
    gulp.watch('src/jsx/**/*.jsx', ['react','reload-chrome']);
});
gulp.task('default',['clean', 'bower', 'react'], function(){ 
});

gulp.task('reload-chrome', shell.task(
        ['chrome-cli list links \
        | grep localhost:'+process.env.PORT+' \
        | sed -E "s/\\[([0-9]+:)?(.*)\\](.*)/\\2/" \
        | xargs -L1 chrome-cli reload -t']));

gulp.task('clean', function(cb) { del(['public/build', 'public/bower'], cb); });
gulp.task('bower', function() { 
    var jsFilter = filter('**/*.js');
    var cssFilter = filter('**/*.css');
    bower()
        .pipe(cssFilter)
        .pipe(gulp.dest('public/bower')) 

    return bower()
        .pipe(jsFilter)
        .pipe(gulp.dest('public/bower')) 
});
gulp.task('react', function(){
    return gulp.src('src/jsx/**/*.jsx')
        .pipe(react())
        .pipe(gulp.dest('public/build'))
});
