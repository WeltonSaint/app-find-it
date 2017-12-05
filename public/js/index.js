var app = angular.module('app', []);
app.controller('indexCtrl', function ($window, $scope, $http) {
  $(".button-collapse").sideNav();
  $('.modal').modal();
  $scope.option= "Todos os Itens";
  $scope.userID = -1;
  
  $scope.init = function () {
    $http({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      url: '/getLoggedUser/'
    }).then(function (response) {
      response = response.data;      
      if(response[0].codigoCliente){
          $scope.profileImgUser = (response[0].linkFotoCliente)
           ? response[0].linkFotoCliente : "/images/profile.png";
          $scope.nameUser = response[0].nomeCliente;
          $scope.emailUser = response[0].emailCliente;
          $scope.userID = response[0].codigoCliente;
          $http.get("/item/"+$scope.userID)
          .then(function(response) {
              $scope.items = response.data;
          });
        }
    }, function error(response) {          
      $scope.msgTitle = "Erro";
      $scope.msgContent = response.statusText;
      $('#modalMessage').modal('open');
    });
  };
});
