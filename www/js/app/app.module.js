var routerApp = angular.module("Home", ['ui.router','builder','form','controls','templates']);

routerApp.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/templates');
  
    $stateProvider
      .state('templates',{
        url:'/templates',
        template:'<templates></templates>'
      })
      .state('builder',{
        url:'/builder/:id',
        template:'<builder></builder>',
        params:{
          color:0
        }
        // controller:'builderController'
      })
      .state('form',{
        url:'/form',
        template:"<form></form>",
        // deepStateRedirect: { default: { state: 'dashboard.home.main' } },
      })
      .state('New Form',{
        url:'/controls',
        template:"<controls></controls>",
        // deepStateRedirect: { default: { state: 'dashboard.home.main' } },
      })
  }]);


routerApp.controller("mainCtrl", ['$scope','$timeout' ,function ($scope) {

  $scope.title = "hello"
  var offCanvas = null;
    document.addEventListener("deviceready",function() {
      databaseHandler.init();
      var myOffcanvas = document.getElementById('offcanvasNavbar')
      offCanvas = new bootstrap.Offcanvas(myOffcanvas)
      // offCanvas.show()
      console.log("databaseinit");
  },false)


  $scope.hideOffCanvas = function() {
    offCanvas.hide()
    
    console.log(bsOffcanvas);
  }
}])
