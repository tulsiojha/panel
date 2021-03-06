angular.module("templates").component("templates", {
  templateUrl: "./js/app/templates/templates.template.html",
  controller: function ($scope, $state, $http) {
    $scope.templates = [];
    // console.log($scope.$parent.$parent.title);
    $scope.form_name = "Templates";

    // console.log($scope.$parent.$parent.title);

    const getColorWithAlpha = (color, alpha) => {
      var hsl = color.replace("hsl(", "").replace(")", "").split(",");
      var h = hsl[0],
        s = hsl[1],
        l = hsl[2];
      l = alpha;
      hsl = "hsl(" + h + "," + s + "," + l + "%)";
      return hsl;
    };

    var colors = [
      "hsl(115, 100%, 39%)",
      "hsl(340, 100%, 39%)",
      "hsl(190, 100%, 24%)",
      "hsl(235, 100%, 39%)",
      "hsl(285, 100%, 39%)",
      "hsl(16, 100%, 39%)",
    ];

    $scope.parseColorBold = function (color) {
      return colors[color];
    };

    $scope.parseColorLight = function (color) {
      return getColorWithAlpha(colors[color], 83);
    };

    const init = () => {
      databaseHandler.listFormTemplates(function (result) {
        // var temp = []
        for (let i = 0; i < result.rows.length; i++) {
          $scope.templates.push(result.rows.item(i));
        }

        $scope.$apply();

        console.log($scope.templates);
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




    $scope.openTemplate = function (index) {
      $state.go("builder", {
        id: $scope.templates[index].id,
        color: $scope.templates[index].color,
      });
      console.log($scope.templates);
    };

    $scope.createTemplate = function () {
      var random = Math.floor(Math.random() * 6 + 1) - 1;
      $state.go("builder", { id: -1, color: random });
      // console.log($scope.templates);
    };


    document.addEventListener("backbutton", function(e) {
      console.log("backPressed");
      if ($state.is("templates")) {
        console.log("exit app");
        navigator.app.exitApp()  
      }
      console.log();
    },false);
  },
});
