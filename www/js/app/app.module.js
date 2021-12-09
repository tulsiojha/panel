var routerApp = angular.module("Home", [
  "ui.router",
  "builder",
  "derived",
  "controls",
  "templates",
  "forms",
]);

routerApp.config([
  "$stateProvider",
  "$urlRouterProvider",
  function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/templates");

    $stateProvider
      .state("templates", {
        url: "/templates",
        template: "<templates></templates>",
      })
      .state("builder", {
        url: "/builder/:id",
        template: "<builder></builder>",
        params: {
          color: 0,
        },
        // controller:'builderController'
      })
      .state("derived", {
        url: "/derived/:id",
        template: "<derived></derived>",
        params: {
          color: 0,
        },
        // deepStateRedirect: { default: { state: 'dashboard.home.main' } },
      })
      .state("New Form", {
        url: "/controls",
        template: "<controls></controls>",
        // deepStateRedirect: { default: { state: 'dashboard.home.main' } },
      })
      .state("forms", {
        url: "/froms",
        template: "<forms></forms>",
        // deepStateRedirect: { default: { state: 'dashboard.home.main' } },
      });
  },
]);

routerApp.controller("mainCtrl", [
  "$scope",
  "$rootScope",
  function ($scope, $rootScope) {
    $scope.title = "hello";
    $scope.subtitle = "hello";

    $scope.showButtons = function () {
      if (
        $scope.title === "New Form" ||
        $scope.title === "builder" ||
        $scope.title === "templates"
      )
        return false;
      else return true;
    };

    var offCanvas = null;
    document.addEventListener(
      "deviceready",
      function () {
        databaseHandler.init();
        var myOffcanvas = document.getElementById("offcanvasNavbar");
        offCanvas = new bootstrap.Offcanvas(myOffcanvas);
        // offCanvas.show()
        console.log("databaseinit");
      },
      false
    );

    $scope.hideOffCanvas = function () {
      offCanvas.hide();

      console.log(bsOffcanvas);
    };

    $scope.saveClicked = function () {
      $rootScope.$emit("DerivedOnSave", {});
    };

    $scope.cancelClicked = function () {
      $rootScope.$emit("DerivedOnCancel", {});
    };
  },
]);
