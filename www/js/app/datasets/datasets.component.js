angular.module("datasets").component("datasets", {
  templateUrl: "./js/app/datasets/datasets.template.html",
  controller: function ($scope, $state, $http, panelUtils) {
    $scope.panelUtils = panelUtils;
    $scope.datasets = [];
    // console.log($scope.$parent.$parent.title);
    $scope.form_name = "Datasets";

    // console.log($scope.$parent.$parent.title);


    const init = () => {
      databaseHandler.listDatasets(function (result) {
        // var temp = []
        for (let i = 0; i < result.rows.length; i++) {
          $scope.datasets.push(result.rows.item(i));
        }

        $scope.$apply();

        console.log($scope.datasets);
      });
    };

    document.addEventListener(
      "deviceready",
      function () {
        databaseHandler.init();
        init();
      },
      false
    );




    $scope.openDataset = function (index) {
      $state.go("datasetform",{id:$scope.datasets[index].id});
      // console.log($scope.templates);
    };

    $scope.createDataset = function () {
      $state.go("datasetform",{id:-1});
      // console.log($scope.templates);
    };


    document.addEventListener("backbutton", function(e) {
      console.log("backPressed");
      if ($state.is("datasets")) {
        console.log("exit app");
        navigator.app.exitApp()  
      }
      console.log();
    },false)
  },
});
