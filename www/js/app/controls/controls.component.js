angular.module("controls").component("controls", {
  templateUrl: "./js/app/controls/controls.template.html",
  controller: function ($scope, $state, $http) {
    $scope.templates = [];

    $scope.form_name = "New Form";

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
      $state.go("derived", {
        id: $scope.templates[index].id,
        color: $scope.templates[index].color,
      });
      // console.log($scope.templates);
    };

    // $scope.createTemplate=function() {
    //   var random = Math.floor((Math.random() * 6) + 1)-1
    //   $state.go("form",{id:-1,color:random})
    //   // console.log($scope.templates);
    // }



    document.addEventListener("backbutton", function(e) {
      console.log("backPressed");
      if ($state.is("New Form")) {
        console.log("exit app");
        navigator.app.exitApp()  
      }
      console.log();
    },false)
  },
});
