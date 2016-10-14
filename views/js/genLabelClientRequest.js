"use strict";

var app=angular.module("genLabel", []);
 console.log("loaded genLabelClientRequest.js");
 
 app.controller("GenLabelController", function($scope, $http, $window) {
  $scope.master = {};
  
  $scope.requestPDF = function(label) {
   console.log(label);
   $window.open('/genLabel?docTitle=' + label.docTitle + "&docPayload=" + label.docPayload);
   /*$http({
    method: 'GET',
    url: '/genLabel',
    data: ('?docTitle=' + label.docTitle + '&docPayload=' + label.docPayload),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
   }); */
  }
  });
 

