import gulp from "gulp";
import plumber from "gulp-plumber";
import sourcemap from "gulp-sourcemaps";
import sass from "gulp-dart-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import sync from "browser-sync";
import htmlmin from "gulp-htmlmin";
import csso from "postcss-csso";
import rename from "gulp-rename";
import terser from "gulp-terser";
import imagemin from "gulp-imagemin";
import webp from "gulp-webp";
import svgo from "gulp-svgmin";
import svgstore from "gulp-svgstore";
import del from "del";

// Styles

export const csscreate = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"));
}

/* CSS не минимизированный */

export const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

/* HTML */

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"))
    .pipe(sync.stream());
}

/* Скрипты */

const scripts = () => {
  return gulp.src("source/js/main.js")
    .pipe(terser())
    .pipe(rename("main.min.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

/* Картинки */

const optimizeImages = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
  .pipe(imagemin([
    imagemin.mozjpeg({ quality: 75, progressive: true }),
    imagemin.optipng({ optimizationLevel: 6 }),
    imagemin.svgo()
  ]))
    .pipe(gulp.dest("build/img"));
}

const copyImages = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(gulp.dest("build/img"));
}

const createWebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"))
}

// SVG

const svg = () =>
  gulp.src('source/img/*.svg')
    .pipe(svgo())
    .pipe(gulp.dest('build/img'));

const sprite = () => {
  return gulp.src('source/img/icon/*.svg')
    .pipe(svgo())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
}

/* Шрифты, фавиконки, svg */

const copy = (done) => {
  gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/*.{ico,webmanifest}",
    //"source/img/**/*.svg",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
}

/* Удаление папки build */

export const clean = () => {
  return del("build");
};

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  sync.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(styles));
  gulp.watch('source/*.html', gulp.series(html, reload));
  gulp.watch("source/js/*.js", gulp.series(scripts));
}

/* Автоматизация для готового проекта */

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    //svg,
    sprite,
    createWebp
  ),
);

/* Автоматизация для разработки */

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    //sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  ));
