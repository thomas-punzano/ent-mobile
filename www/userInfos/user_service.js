angular.module('ent.user', [])

.service('SkinFactory', function($http, domainENT){
  this.getSkin = function(){
    return  $http.get(domainENT+"/theme");
  }
})

.service('UserFactory', function(domainENT, $http){

  this.whoAmI= function (userId) {
    return $http.get(domainENT+"/userbook/api/person?id="+userId);
  }

  this.getCurrentUser = function () {
    return $http.get(domainENT+'/auth/oauth2/userinfo');
  }

  this.getTranslation = function () {
    return $http.get(domainENT+'/userbook/i18n');
  }
})

.controller('UserCtrl', function(UserFactory, $scope, $rootScope){

  getUser();
  getTraduction();

  function getTraduction(){
    UserFactory.getTranslation().then(function(result){
      $scope.translationUser = result.data;
    }), function errorCallback(response) {
      $scope.showAlertError();
    };
  }

  function getUser(){
    UserFactory.getCurrentUser().then(function(res){
      UserFactory.whoAmI(res.data.userId).then(function(response) {
        $rootScope.myUser = response.data.result[0];
        $rootScope.myUser.photo = setProfileImage($scope.myUser.photo, res.data.userId);
        $rootScope.myUser.type = "directory."+$rootScope.myUser.type[0];
        console.log($rootScope.myUser);
      })
    }), function errorCallback(response) {
    $scope.showAlertError();
    };
  }
})
