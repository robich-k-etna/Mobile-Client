angular.module('shunt', ['shunt.controllers', 'shunt.directives'])
.config(function ($compileProvider, $routeProvider) {

    $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

    $routeProvider
    .when('/', {
        controller: 'DownloadsCtrl',
        templateUrl: 'partials/downloads.html'
    })
    .when('/config', {
        controller: 'ConfigCtrl',
        templateUrl: 'partials/config.html'
    })
    .when('/browser', {
        controller: 'DownloadsCtrl',
        templateUrl: 'partials/browser.html'
    })
    .otherwise({
        redirectTo: '/'
    });
});
