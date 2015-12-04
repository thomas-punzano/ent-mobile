angular.module('ent.infos', [])

.controller('InfosCtrl', function ($scope, $http,$ionicPopover, $state) {
  $http.get("https://recette-leo.entcore.org/actualites/infos").then(function(resp){
    $scope.infos = resp.data;
    console.log('success: '+$scope.infos);
  }, function(err){
    alert('ERR:'+ err);
  });

  $scope.goThreads = function(){
    $state.go("app.threads");
  }
  $ionicPopover.fromTemplateUrl('templates/popover_actualites.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };

  $scope.closePopover = function() {
    $scope.popover.hide();
  };

  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });

  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });

  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });
})
