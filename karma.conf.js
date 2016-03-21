var webpack = require('webpack');
var path = require('path');

module.exports = function(config) {
    config.set({

        files: [
            // all files ending in 'test'
            './node_modules/phantomjs-polyfill/bind-polyfill.js',
            'test/index.js'
            // each file acts as entry point for the webpack configuration
        ],

        // frameworks to use
        frameworks: [ 'mocha' ],

        preprocessors: {
            'test/index.js': [ 'webpack', 'sourcemap' ]
        },

        reporters: [ 'spec' ],//, 'coverage'],

        // coverageReporter: {
        //     type: 'html',
        //     dir: 'build/coverage/'
        // },

        webpack: {
            devtool: 'inline-source-map',

            module: {
                loaders: [{
                    test: /\.jsx?$/,
                    loaders: [ 'babel' ],
                    include: [ path.join(__dirname, 'source'), path.join(__dirname, 'test') ]
                }],
                // postLoaders: [{
                //     test: /\.jsx?$/,
                //     exclude: /(test|node_modules|bower_components)/,
                //     loader: 'istanbul-instrumenter'
                // }]
            },
            resolve: {
                modulesDirectories: [
                    '',
                    'node_modules'
                ],
                alias: {
                    'faramir': path.join(__dirname, 'source')
                },
                extensions: ['', '.js', '.jsx']
            }
        },

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            noInfo: true
        },

        plugins: [
            require('karma-webpack'),
            require('karma-sourcemap-loader'),
            //require('istanbul-instrumenter-loader'),
            require('karma-mocha'),
            //require('karma-coverage'),
            require('karma-phantomjs-launcher'),
            require('karma-spec-reporter')
        ],

        browsers: [ 'PhantomJS' ]
    });
};