const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss')
const sourcemaps = require('gulp-sourcemaps')
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const terser = require('gulp-terser-js');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin'); // Minificar imagenes 
const notify = require('gulp-notify');
const cache = require('gulp-cache');
const clean = require('gulp-clean');
const webp = require('gulp-webp');
const avif = require('gulp-avif');
var htmlmin = require('gulp-htmlmin');

const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    imagenes: 'src/img/**/*.*'
}

function css() {
    return src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        // .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'));
}

function javascript() {
    return src(paths.js)
      .pipe(sourcemaps.init())
      .pipe(concat('bundle.js'))
      .pipe(terser())
      .pipe(sourcemaps.write('.'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(dest('./build/js'))
}

function imagenes() {
    return src(paths.imagenes)
        .pipe(cache(imagemin({ optimizationLevel: 3 })))
        .pipe(dest('build/img'))
        .pipe(notify({ message: 'Imagen Completada' }));
}

function versionWebp() {
    const opciones = {
        quality: 50
    };
    return src(paths.imagenes)
        .pipe(webp(opciones))
        .pipe(dest('build/img'))
        .pipe(notify({ message: 'Imagen Completada' }));
}
function versionAvif() {
    const opciones = {
        quality: 50
    };
    return src(paths.imagenes)
        .pipe(avif(opciones))
        .pipe(dest('build/img'))
        .pipe(notify({ message: 'Imagen Completada' }));
}



function collapse(){
    return src('page/**/*.html')
     .pipe(htmlmin({collapseWhitespace: true,minifyCSS:true,minifyJS:true}))
     .pipe(dest('CODIGO-PUBLIC'));
   };

   function copiar(){
    return src('build/**/*.*')
    .pipe(dest('CODIGO-PUBLIC/build'));
   }


function watchArchivos() {
    watch(paths.scss, css);
    watch(paths.js, javascript);
    watch(paths.imagenes, imagenes);
    watch(paths.imagenes, versionWebp);
    watch(paths.imagenes, versionAvif);
    watch('page/**/*.html', collapse);
    watch('build/**/*.*', copiar);
}

exports.css = css;
exports.watchArchivos = watchArchivos;
exports.default = parallel(css, javascript, imagenes, versionWebp, versionAvif, watchArchivos,collapse,copiar);








