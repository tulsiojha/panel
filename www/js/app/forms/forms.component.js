angular.module("forms").component("forms", {
  templateUrl: "./js/app/forms/forms.template.html",
  controller: function ($scope, $state, $http) {
    $scope.templates = [];

    $scope.form_name = "Forms";

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
      databaseHandler.listFormWithTemplate(function (result) {
        for (let i = 0; i < result.rows.length; i++) {
          $scope.templates.push({
            templateName: result.rows.item(i).name,
            formJson: JSON.parse(result.rows.item(i).formJson),
          });
        }
        $scope.$apply();
        console.log("formWithTemplate", $scope.templates);
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

    // $scope.createTemplate=function() {
    //   var random = Math.floor((Math.random() * 6) + 1)-1
    //   $state.go("form",{id:-1,color:random})
    //   // console.log($scope.templates);
    // }
  },
});
