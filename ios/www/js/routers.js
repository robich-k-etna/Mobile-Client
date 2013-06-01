angular.module('shunt', [])
.config(function ($compileProvider){
    $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})
.config(function ($routeProvider) {

    $routeProvider
    .when('/', {
        controller: DownloadsCtrl,
        templateUrl: 'partials/downloads.html'
    })
    .when('/config', {
        controller: ConfigCtrl,
        templateUrl: 'partials/config.html'
    })
    .when('/browser', {
        controller: DownloadsCtrl,
        templateUrl: 'partials/browser.html'
    });
});
