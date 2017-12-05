var app = angular.module("app", []);
app.controller("authCtrl", function ($window, $scope, $http) {
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

  this.$onInit = function () {
    $http({
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      url: "/isLogged/"
    }).then(function (response) {
        response = response.data;
        if(response.value)
          $window.location.href = "/";
    }, function error(response) {          
      $scope.msgTitle = "Erro";
      $scope.msgContent = response.statusText;
      $("#modalMessage").modal("open");
    });
  };

  $scope.submitLogin = function (isValid) {
    if(isValid){
      $http({
        method: "POST",
        data: {
          emailCliente: $scope.data.email,
          senhaCliente: $scope.data.password,
          continuarLogado: $scope.data.continueLogged
        },
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        url: "/users/"
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