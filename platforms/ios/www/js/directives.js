angular
.module('shunt.directives', [])
.directive('currentLink', ['$location', function ($location) {
    var obj = {
        retrict: 'A',
        link: function($scope, el, attrs) {
            var clazz = attrs.currentLink;
            var path = '';
            if (el.tagName == 'A') {
                attrs.$observe('href', function(value) {
                    path = value.substring(1);
                });
            }
            else {
                path = el.children('a').attr('href').substring(1);
            }

            $scope.$location = $location;
            $scope.$watch('$location.path()', function(value) {
                if (value == path) {
                    el.addClass(clazz);
                }
                else {
                    el.removeClass(clazz);
                }
            });
        }
    };
    return obj;
}])
