angular.module('ent.auth', [])
.controller('LoginCtrl', function($scope, $http, $cordovaInAppBrowser, $state, domainENT) {

  document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady() {
    login();
  }

  $scope.doLogin= function(){
    login();
  }

  function login(){
    if(!localStorage.getItem('access_token')){
      ref = window.open(domainENT+'/auth/oauth2/auth?response_type=code&state=blip&scope=userinfo&client_id=mobile-ong&redirect_uri='+domainENT,'_blank','location=no','toolbar=no', 'clearcache=yes', 'clearsessioncache=yes');
      ref.addEventListener('loadstart', function(event) {
        var url = event.url;
        if(url.startsWith(domainENT+"/?code=")) {
          localStorage.setItem('code', url.substring(url.indexOf("code=")+5, url.lastIndexOf("&")));
          ref.close();
          getToken();
        }
      });
    } else {
    //  alert('token déjà enregistré: '+  localStorage.getItem('access_token'));
      $state.go('app.actualites');
    }
  }

  // document.addEventListener("deviceready", onDeviceReady, false);
  //
  // var ref;
  // function onDeviceReady() {
  //   if(!localStorage.getItem('access_token')){
  //     ref = window.open('https://recette-leo.entcore.org/auth/oauth2/auth?response_type=code&state=blip&scope=userinfo&client_id=mobile-ong&redirect_uri=https://recette-leo.entcore.org','_blank','location=no','toolbar=no', 'clearcache=yes', 'clearsessioncache=yes');
  //     ref.addEventListener('loadstart', function(event) {
  //       var url = event.url;
  //       if(url.startsWith("https://recette-leo.entcore.org/?code=")) {
  //         localStorage.setItem('code', url.substring(url.indexOf("code=")+5, url.lastIndexOf("&")));
  //         getToken();
  //       }
  //     });
  //   } else {
  //     alert('token déjà enregistré: '+  localStorage.getItem('access_token'));
  //     $state.go('app.actualites');
  //   }
  // }

  function getToken(){

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $http.defaults.headers.post['Accept'] = 'application/json; charset=UTF-8';
    $http.defaults.headers.common.Authorization = 'Basic bW9iaWxlLW9uZzptb2JpbGUtb25nLXNlcmNyZXQ=';

    $http({
      method: "post",
      url: domainENT+"/auth/oauth2/token",
      data: "redirect_uri="+domainENT+"&grant_type=authorization_code&code=" + localStorage.getItem('code')
    }).then(function successCallback(response) {
    //  alert('new token: '+response.data.access_token);
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);

      $state.go('app.actualites');

    }, function errorCallback(response) {
      alert('Erreur '+response.status+' '+response.data.error);
    });
  }
})
