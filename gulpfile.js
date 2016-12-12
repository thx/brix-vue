/* global require */
/* global console */

var gulp = require('gulp')
var connect = require('gulp-connect')
var jshint = require('gulp-jshint')
var webpack = require('webpack')

gulp.task('connect', function() {
    connect.server({
        port: 4248
    })
})

gulp.task('__lint', function() {
    return gulp.src(['src/**/*.js', 'test/*.js', 'gulpfile.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
})
gulp.task('lint', ['__lint'], function( /*cb*/ ) {
    return gulp.watch(['src/**/*.js', 'test/*.js', 'gulpfile.js'], ['__lint'])
})

gulp.task("__webpack", function( /*cb*/ ) {
    webpack({
        entry: './src/brix/vue/decorator.js',
        output: {
            path: './dist',
            filename: 'vue.decorator-debug.js',
            library: 'VueDecorator',
            libraryTarget: 'umd'
        },
        externals: ['vue', 'brix/loader', 'jquery', 'underscore'],
    }, function(err /*, stats*/ ) {
        if (err) throw err
    })
    webpack({
        entry: './src/brix/vue/decorator.js',
        output: {
            path: './dist',
            filename: 'vue.decorator.js',
            library: 'VueDecorator',
            libraryTarget: 'umd'
        },
        externals: ['vue', 'brix/loader', 'jquery', 'underscore'],
        devtool: 'source-map',
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                minimize: true
            })
        ]
    }, function(err /*, stats*/ ) {
        if (err) throw err
    })

})
gulp.task("webpack", ['__webpack'], function( /*cb*/ ) {
    return gulp.watch(['src/**/*.js'], ['__webpack'])
})

// https://github.com/pahen/madge
gulp.task('madge', function( /*cb*/ ) {
    var exec = require('child_process').exec
    exec('madge --format amd ./src/',
        function(error, stdout /*, stderr*/ ) {
            if (error) console.log('exec error: ' + error)
            console.log('module dependencies:')
            console.log(stdout)
        }
    )
    exec('madge --format amd --image ./doc/dependencies.png ./src/',
        function(error /*, stdout, stderr*/ ) {
            if (error) console.log('exec error: ' + error)
        }
    )
})

gulp.task('default', ['lint', 'webpack'])