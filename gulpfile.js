///// Gulp Dependencies /////
var path = require('path');
var gulp = require('gulp');
var	sass = require('gulp-sass');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var bust = require('gulp-buster');
var spawn = require('child_process').spawn;
var fs = require('fs');
var node, env = process.env;

////// Build Tasks ///////
gulp.task('build-sass', function () {
	gulp.src(path.join(__dirname, '/scss/*.scss'))
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(path.join(__dirname,'/scss/temp')))			//build them here first
		.pipe(concat('main.css'))									//concat them all
		.pipe(gulp.dest(path.join(__dirname, '/public/css')))
		.pipe(cleanCSS())											//minify
		.pipe(rename('main.min.css'))
		.pipe(gulp.dest(path.join(__dirname,'/public/css')))		//dump it here
		.pipe(rename('singlecsshash'))
		.pipe(bust({fileName: 'busters_css.json'}))					//cache bust
		.pipe(gulp.dest('.'));										//dump busters_css.json
});

gulp.task('build-js-hash', function () {
	gulp.src(path.join(__dirname,'/public/js/*.js'))
		.pipe(concat('singlejshash'))								//concat them all
		.pipe(bust({fileName: 'busters_js.json'}))					//cache bust
		.pipe(gulp.dest('.'));										//dump busters_js.json
});

////// Run Server Task ///////
gulp.task('server', function() {
	if(node) node.kill();
	node = spawn('node', ['app.js'], {env: env, stdio: 'inherit'});			//command, file, options
});

////// Watch Tasks //////
gulp.task('watch-sass', ['build-sass'], function () {
	gulp.watch(path.join(__dirname, '/scss/*.scss'), ['build-sass']);
});

gulp.task('watch-js', ['build-js-hash'], function () {
	gulp.watch(path.join(__dirname,'/public/js/*.js'), ['build-js-hash']);
});

gulp.task('watch-server', ['server'], function () {
	gulp.watch(path.join(__dirname, '/routes/**/*.js'), ['server']);
	gulp.watch([path.join(__dirname, '/utils/*.js')], ['server']);
	gulp.watch([path.join(__dirname, '/utils/marbles_cc_lib/*.js')], ['server']);
	gulp.watch(path.join(__dirname, '/app.js'), ['server']);
});

////// Tasks //////
gulp.task('default', ['watch-js', 'watch-sass', 'watch-server']);
gulp.task('marbles', ['start_marbles', 'default']);
gulp.task('united_marbles', ['start_mtc1', 'default']);
gulp.task('marble_market', ['start_mtc2', 'default']);
gulp.task('emarbles', ['start_mtc3', 'default']);

//generic marbles
gulp.task('start_marbles', function () {
	env['creds_filename'] = 'mycreds.json';
	console.log('\n[International Marbles Trading Consortium]\n');
});

// MTC Member 1
gulp.task('start_mtc1', function () {
	console.log('\n[International Marbles Trading Consortium] - Member "United Marbles"\n');
	env['creds_filename'] = 'creds_united_marbles.json';
});

// MTC Member 2
gulp.task('start_mtc2', function () {
	console.log('\n[International Marbles Trading Consortium] - Member "Marble Market"\n');
	env['creds_filename'] = 'creds_marble_market.json';
});

// MTC Member 3
gulp.task('start_mtc3', function () {
	console.log('\n[International Marbles Trading Consortium] - Member "eMarbles"\n');
	env['creds_filename'] = 'creds_emarbles.json';
});
