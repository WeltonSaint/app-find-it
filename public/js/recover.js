var app = angular.module("app", []);
app.controller("recoverCtrl", function ($window, $scope, $http) {
  $scope.isActive = function (path) {
    if ($route.current && $route.current.regexp) {
        return $route.current.regexp.test(path);
    }
    return false;
  };
  $(".modal").modal();
  $scope.data = {};
  $scope.msgTitle = "";
  $scope.msgContent = "";

  $scope.submitRecover = function (isValid) {
    if($scope.data.repeatPassword != $scope.data.password){
        $scope.msgTitle = "Erro";
        $scope.msgContent = "As senhas devem ser iguais!";
        $("#modalMessage").modal("open");
    } else if(isValid){
      $http({
        method: "POST",
        data: {
          token: $scope.data.email,
          senhaCliente: $scope.data.password
        },
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        url: "/recoverPassword/"
      }).then(function (response) {
            response = response.data;
            if(response.error){
              $scope.msgTitle = "Erro";
              $scope.msgContent = response.message;
              $("#modalMessage").modal("open");
            } else {
              $window.location.href = "/";
            }
        }, function error(response) {          
          $scope.msgTitle = "Erro";
          $scope.msgContent = response.statusText;
          $("#modalMessage").modal("open");
      });
    }
  }

  $scope.closeMessage = function (){
    $("#modalMessage").modal("close");
  }
});