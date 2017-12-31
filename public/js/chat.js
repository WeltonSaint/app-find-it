var app = angular.module('app', []);
app.controller('chatCtrl', function ($window, $scope, $http) {
    $(".button-collapse").sideNav({
    closeOnClick: true, 
    draggable: true
  });
  $('.modal').modal();
  $('.content-messages').scrollTop($('.content-messages')[0].scrollHeight);
  
  /*  
  $scope.init = function () {
    $http({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      url: '/getLoggedUser/'
    }).then(function (response) {
      response = response.data;
      if(response.codigoCliente){
          $scope.profileImgUser = (response.linkFotoCliente)
           ? response.linkFotoCliente : "/images/profile.png";
          $scope.nameUser = response.nomeCliente;
          $scope.emailUser = response.emailCliente;
          $scope.userID = response.codigoCliente;
          $http.get("/item/all/"+$scope.userID)
          .then(function(response) {
              $scope.items = response.data;
          });
        }
    }, function error(response) {          
      $scope.msgTitle = "Erro";
      $scope.msgContent = response.statusText;
      $('#modalMessage').modal('open');
    });
  };*/
});
