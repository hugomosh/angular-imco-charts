module.exports = function(config) {
    config.set({
        files: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/d3/d3.js',
            'src/*.js',
            'test/spec/*.js'
        ],
        basePath: '',
        exclude: [],

        // test results reporter to use
        // possible values: dots || progress || growl
        frameworks: ['jasmine'],
        reporters: ['progress'],
        browsers: ['Chrome'],
        logLevel: config.LOG_INFO,
        autoWatch: false,
        singleRun: true,
        colors: true,
        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },
        captureTimeout: 5000,
        // cli runner port
        runnerPort: 9100,
    });

    if (process.env.TRAVIS) {
        config.browsers = ['Chrome_travis_ci'];
    }
};
