const gulp = require('gulp');
const ts = require("gulp-typescript");
const server = require('gulp-server-livereload');
const gnf = require('gulp-npm-files');

const paths = {
    src: "src/",
    srcFiles: ["src/**/*.ts", "src/**/*.html", "src/**/*.css"],
    srcTsFiles: "src/**/*.ts",
    srcHtmlFiles: "src/**/*.html",
    srcCssFiles: "src/**/*.css",
    index: "src/index.html",
    dist: "dist/",
    tmp: "tmp/"
};


var tsProject = ts.createProject('tsconfig.json');

gulp.task('build', function() {
    // Copy NPM dependencies
    gulp
        .src(gnf(null, './package.json'), {base:'./'})
        .pipe(gulp.dest(paths.dist));

    // Compile Typescript
    tsProject.src()
        .pipe(ts(tsProject)).js
        .pipe(gulp.dest(paths.dist));

    // Copy CSS
    gulp.src(paths.srcCssFiles)
        .pipe(gulp.dest(paths.dist));

    // Copy HTML
    return gulp.src(paths.srcHtmlFiles)
        .pipe(gulp.dest(paths.dist))

});

gulp.task("watch", function() {
    gulp.watch(paths.srcFiles, ['build']);
});

gulp.task('webserver', ['build', 'watch'], () =>
    gulp.src(paths.dist)
        .pipe(server({
            livereload: true,
            directoryListing: false,
            open: true
        }))
);

gulp.task("default", ["build", "webserver"]);