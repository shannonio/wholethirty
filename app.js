angular.module('nomnom', ['ui.utils','ui.router']);

angular.module('nomnom').config(function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('dashboard', {
        url: '/',
        templateUrl: 'partial/dashboard/dashboard.html'
    });
    /* Add New States Above */
    $urlRouterProvider.otherwise('/');

});

angular.module('nomnom').run(function($rootScope) {

    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

});
