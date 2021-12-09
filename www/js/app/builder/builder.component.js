angular.module("builder").component("builder", {
  templateUrl: "./js/app/builder/builder.template.html",
  controller: function ($scope, $state, $stateParams, $http, $window) {
    $scope.form_name = "Builder";
    $scope.errorMessage = "";

    $scope.controls = [
      { name: "input", bg: "btn-primary" },
      { name: "select", bg: "btn-secondary" },
      { name: "file", bg: "btn-danger" },
      { name: "image", bg: "btn-success" },
      { name: "sign", bg: "btn-warning" },
    ];

    $scope.multipleNames = [];
    $scope.emptyNames = [];

    $scope.form_name = "";
    $scope.elementsToRender = [];
    $scope.currentElement;

    $scope.colorBold = "hsl(216, 98%, 52%)";
    $scope.colorLight = "hsl(216, 98%, 52%, 40%)";

    $scope.selectedWidth = { id: "0", value: "col-1" };
    $scope.width = [
      { id: "0", value: "col-1" },
      { id: "1", value: "col-2" },
      { id: "2", value: "col-3" },
      { id: "3", value: "col-4" },
      { id: "4", value: "col-5" },
      { id: "5", value: "col-6" },
      { id: "6", value: "col-7" },
      { id: "7", value: "col-8" },
      { id: "8", value: "col-9" },
      { id: "9", value: "col-10" },
      { id: "10", value: "col-11" },
      { id: "11", value: "col-12" },
    ];

    $scope.formTemplateId = $stateParams.id;

    var errorModal = new bootstrap.Modal(
      document.getElementById("progressModal"),
      {}
    );

    var myCollapse = document.getElementById("collapseProperties");
    var bsCollapse = new bootstrap.Collapse(myCollapse, { toggle: false });

    var templateNameCollapseElement = document.getElementById(
      "collapseTemplateName"
    );
    var templateNameCollapse = new bootstrap.Collapse(
      templateNameCollapseElement,
      { toggle: false }
    );

    var contentCollapseElement = document.getElementById("collapseContent");
    var contentCollapse = new bootstrap.Collapse(contentCollapseElement, {
      toggle: false,
    });

    $scope.selection = function (name) {
      // $scope.values["id_"+$scope.elementsToRender.length] = ''
      $scope.elementsToRender.push({
        name: name,
        type: name,
        element_id: "id_" + $scope.elementsToRender.length,
        width: $scope.width[5],
        class: $scope.width[5].value,
      });
      var id = "#id_" + ($scope.elementsToRender.length - 1);

      $scope.currentElement = $scope.elementsToRender.length - 1;
      $scope.selectedWidth =
        $scope.elementsToRender[$scope.currentElement].width;

      contentCollapse.show();
    };

    $scope.selectedElement = function ($index) {
      $scope.currentElement = $index;
      console.log($scope.currentElement);

      $scope.selectedWidth =
        $scope.elementsToRender[$scope.currentElement].width;

      console.log($scope.selectedWidth);

      bsCollapse.show();
    };

    $scope.onChangeWidth = function () {
      var tempElements = [...$scope.elementsToRender];
      console.log(tempElements[$scope.currentElement]);
      tempElements[$scope.currentElement].class = $scope.selectedWidth.value;
      tempElements[$scope.currentElement].width = $scope.selectedWidth;
      $scope.elementsToRender = [...tempElements];
    };

    const checkFormTemplateName = (callback) => {
      databaseHandler.listFormTemplateByName(
        $scope.form_name,
        function (result) {
          console.log(result.rows);
          if (
            result.rows.length > 0 &&
            result.rows.item(0).id != $scope.formTemplateId
          ) {
            callback(true);
          } else {
            callback(false);
          }
        }
      );
    };

    $scope.onSaveClicked = function () {
      $scope.multipleNames = [];
      $scope.emptyNames = [];

      var result = $scope.elementsToRender.filter(
        (element) => element.name === ""
      );
      console.log(result);
      if (result.length > 0) {
        $scope.emptyNames.push([...result]);
      }

      $scope.controls.forEach((control) => {
        var result = $scope.elementsToRender.filter(
          (element) => element.name.toLowerCase() === control.name.toLowerCase()
        );
        console.log(result);
        if (result.length > 1) {
          $scope.multipleNames.push(control);
        }
      });

      console.log("errors", $scope.emptyNames);
      if ($scope.multipleNames.length > 0) {
        $scope.errorMessage =
          "Multiple element has same name. Please enter unique name for each element.";
        errorModal.show();
        return;
      }

      if ($scope.emptyNames.length > 0) {
        $scope.errorMessage =
          "Some fields has empty name. Please enter unique name for each element.";
        errorModal.show();
        return;
      }

      if ($scope.form_name === "") {
        $scope.errorMessage = "Please Enter form template name.";
        errorModal.show();
        return;
      }

      checkFormTemplateName(function (exist) {
        if (exist) {
          console.log("already");
          $scope.errorMessage =
            "Form Template name already exist. Please enter new name.";
          $scope.$apply();
          errorModal.show();
          return;
        } else {
          if ($scope.formTemplateId <= 0) {
            console.log("form template id is less than 0");
            databaseHandler.insertFormTemplate(
              $scope.form_name,
              "test desc",
              $stateParams.color,
              function (result) {
                console.log("formtemplateid ", result.insertId);
                $scope.formTemplateId = result.insertId;
                $scope.$apply();
                recursiveSaving(0);
              }
            );
          } else {
            databaseHandler.updateFormTemplates(
              $scope.form_name,
              "test desc",
              $scope.formTemplateId,
              function (result) {
                console.log("update template");
                recursiveSaving(0);
              }
            );
          }
        }
      });
    };

    const recursiveSaving = (i) => {
      console.log(i);
      if (i === $scope.elementsToRender.length) {
        $state.go("templates");
        return;
      }
      console.log("reached", $scope.elementsToRender.length);
      const element = $scope.elementsToRender[i];

      if (element.id && element.id > 0) {
        databaseHandler.updateFieldDefinition(
          element.name,
          element.type,
          JSON.stringify(element.width),
          element.element_id,
          element.class,
          element.id,
          function (results) {
            recursiveSaving(i + 1);
          }
        );
      } else {
        console.log(
          element.name,
          element.type,
          JSON.stringify(element.width),
          element.element_id,
          element.class,
          $scope.formTemplateId
        );
        databaseHandler.insertFieldDefinition(
          element.name,
          element.type,
          JSON.stringify(element.width),
          element.element_id,
          element.class,
          $scope.formTemplateId,
          function (results) {
            recursiveSaving(i + 1);
          }
        );
      }
    };

    const init = () => {
      $scope.elementsToRender = [];
      if ($scope.elementsToRender.length > 0) {
        $scope.$apply();
      }
      // $scope.$apply()
      databaseHandler.listFormTemplateByID(
        $scope.formTemplateId,
        function (result) {
          $scope.form_name = result.rows.item(0).name;
        }
      );
      databaseHandler.listFieldDefinitionByID(
        $scope.formTemplateId,
        function (result) {
          console.log(result);
          for (let i = 0; i < result.rows.length; i++) {
            const element = result.rows.item(i);
            $scope.elementsToRender.push({
              name: element.name,
              type: element.type,
              id: element.id,
              width: JSON.parse(element.width),
              class: element.element_class,
              element_id: element.element_id,
            });
          }
          $scope.$apply();
          console.log($scope.elementsToRender);
        }
      );
    };

    init();
  },
});
