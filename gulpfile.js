const gulp = require('gulp');
const browserSync = require('browser-sync').create();

// ========== ОСНОВНЫЕ ЗАДАЧИ ==========

function copyAll() {
    return gulp.src(['src/**/*'], { encoding: false })
        .pipe(gulp.dest('dist/'));
}

function reload(done) {
    browserSync.reload();
    done();
}

function serve(done) {
    copyAll();
    browserSync.init({
        server: { baseDir: 'dist/' }
    });
    
    gulp.watch('src/**/*', { encoding: false }).on('change', gulp.series(copyAll, reload));
    done();
}

// ========== ЭКСПОРТ ЗАДАЧ ==========
exports.default = serve;
exports.build = copyAll;