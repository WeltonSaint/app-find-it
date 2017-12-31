var app = angular.module('app', []);
app.controller('indexCtrl', function ($window, $scope, $http) {
  $(".button-collapse").sideNav({
    closeOnClick: true, 
    draggable: true
  });
  $('.carousel').carousel();
  $('.materialboxed').materialbox();
  $('.modal').modal();
});
