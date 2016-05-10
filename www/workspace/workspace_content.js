angular.module('ent.workspace',['ent.workspace_service', 'ent.workspace_trash','ent.workspace_folder_depth'])

.controller('WorkspaceFolderContentCtlr', function($scope, $rootScope, $stateParams, $state, WorkspaceService, $ionicLoading, MimeTypeFactory){

  $scope.filter = getFilter($stateParams.nameWorkspaceFolder);
  console.log($scope.filter);

  getData();

  $scope.gotInDepthFolder = function(folder){
    $state.go('app.workspace_folder_depth', {filtre:$scope.filter, parentFolderName: folder.name})
  }

  $scope.doRefresh = function(){
    getData()
    $scope.$broadcast('scroll.refreshComplete')
    $scope.$apply()
  }

  $scope.getTitle = function(){
    return $rootScope.translationWorkspace[$stateParams.nameWorkspaceFolder]
  }

  function getData(){
    $ionicLoading.show({
      template: '<ion-spinner icon="android"/>'
    });
    WorkspaceService.getDocumentsByFilter($scope.filter).then(function(result){
      $scope.documents = []
      for(var i=0; i<result.data.length;i++){
        $scope.documents.push(MimeTypeFactory.setIcons(result.data[i]));
      }
      console.log("files: "+$scope.documents.length);
      if($scope.filter!="appDocuments"){
        getFolders($scope.filter)
      }
      $ionicLoading.hide()
    }, function(err){
      $ionicLoading.hide()
      $scope.showAlertError()
    });
  }

  function getFolders(filter){
    WorkspaceService.getFoldersByFilter(filter).then(function(res){
      $scope.folders = res.data
      console.log("folders: "+$scope.folders.length)
    })
  }


})

function getFilter(nameWorkspaceFolder){
  var filter ="";

  switch(nameWorkspaceFolder){
    case "documents":
      filter="owner";
      break;
      case "trash":
        filter="owner";
        break;
        default:
          filter = nameWorkspaceFolder;
          break;
        }

        return filter;
      }
