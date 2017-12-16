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

  $scope.submitSignUp = function (isValid) {    
    if($scope.data.repeatPassword != $scope.data.password){
        $scope.msgTitle = "Erro";
        $scope.msgContent = "As senhas devem ser iguais!";
        $("#modalMessage").modal("open");
    } else if(isValid){
      $http({
        method: "POST",
        data: {
          nomeCliente: $scope.data.name,
          emailCliente: $scope.data.email,
          senhaCliente: $scope.data.password,
        },
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        url: "/signup/"
      }).then(function (response) {
            response = response.data;
            if(response.error){
              $scope.msgTitle = "Erro";
              $scope.msgContent = response.message;
              $("#modalMessage").modal("open");
            } else {
              $scope.msgTitle = "Sucesso";
              $scope.msgContent = response.message;
              $("#modalMessage").modal("open");
              $scope.closeMessage = function (){
                $window.location.href = "/login";
              }
            }
        }, function error(response) {          
          $scope.msgTitle = "Erro";
          $scope.msgContent = response.statusText;
          $("#modalMessage").modal("open");
      });
    }
  }

  $scope.submitForgot = function (isValid) {
    if(isValid){
      $http({
        method: "POST",
        data: {
          emailCliente: $scope.data.email,
        },
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        url: "/forgot/"
      }).then(function (response) {
            response = response.data;
            if(response.error){
              $scope.msgTitle = "Erro";
              $scope.msgContent = response.message;
              $("#modalMessage").modal("open");
            } else {
              $scope.msgTitle = "Sucesso";
              $scope.msgContent = response.message;
              $("#modalMessage").modal("open");
              $scope.closeMessage = function (){
                $window.location.href = "/login";
              }
            }
        }, function error(response) {          
          $scope.msgTitle = "Erro";
          $scope.msgContent = response.statusText;
          $("#modalMessage").modal("open");
      });
    }
  }

  $scope.submitRecover = function (isValid) {    
    if($scope.data.repeatPassword != $scope.data.password){
        $scope.msgTitle = "Erro";
        $scope.msgContent = "As senhas devem ser iguais!";
        $("#modalMessage").modal("open");
    } else if(isValid){      
      $http({
        method: "POST",
        data: {
          token: document.getElementById('token').value,
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
              $scope.msgTitle = "Sucesso";
              $scope.msgContent = response.message;
              $("#modalMessage").modal("open");
              $scope.closeMessage = function (){
                $window.location.href = "/login";
              }
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