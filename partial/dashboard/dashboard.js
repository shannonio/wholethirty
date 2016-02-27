angular.module('nomnom').controller('DashboardCtrl',function($scope, $http){
  $http.get('plannedmeals.json').then(function(response) {
    $scope.data = response.data;
  });

});
