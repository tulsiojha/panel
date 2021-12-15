angular.module("formview").component("formview", {
  templateUrl: "./js/app/formview/formview.template.html",
  controller: function ($scope, $state, $stateParams, $http, panelUtils) {
    $scope.formTemplateId=-1;
    $scope.formId = $stateParams.id
    $scope.panelUtils = panelUtils;

    $scope.template = {};


    $scope.form_name = "Form View";

    $scope.loading = true;

    const init = () => {
      console.log("form id: ",$scope.formId);
      databaseHandler.listFormWithTemplateByID($scope.formId, async function (result) {

        if(result.rows.length >0){
          await loadValues(result.rows.item(0));
          $scope.loading = false;
          $scope.$apply();
        }
        
        // console.log("formWithTemplate", $scope.template);
      });
    };

    const loadValues = async (item) => {
      console.log(item);
      var jsonArray = []
      const values = JSON.parse(item.formJson);
      for (let [key, value] of Object.entries(values)) {
        console.log(key, value.type);

        if (value.type === "sign" || value.type === "image") {
          const name = await loadFile(value.data, "template_", item.formTemplateId);
          values[key].data = name;
        console.log(name);

        }

        jsonArray.push({name:key, json:value})

      }

      $scope.formTemplateId = item.formTemplateId;
      $scope.template = {templateName:item.name, templateId:item.formTemplateId ,formJson:jsonArray};
      console.log($scope.template);

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
    //   // console.log($scope.template);
    // }


    $scope.editData = function() {
      $state.go("derived",{id:$scope.formTemplateId,edit:true, formId:$scope.formId})
    }


    const loadFile = async (fileName, dirName, id) => {
      return new Promise((resolve, reject) => {
        fileHandler.init(function (rootDirEntry) {
          fileHandler.createDirectory(
            "files",
            rootDirEntry,
            function (subRootDirEntry) {
              fileHandler.createDirectory(
                dirName + id,
                subRootDirEntry,
                function (dirEntry) {
                  fileHandler.createFile(
                    fileName,
                    dirEntry,
                    function (fileEntry) {
                      var url = fileEntry.toURL();
                      fileHandler.readFile(
                        fileEntry,
                        function (file) {
                          resolve(file);
                        },
                        function (error) {
                          resolve(null);
                        }
                      );
                    },
                    function (error) {
                      resolve(null);
                    }
                  );
                },
                function (error) {
                  resolve(null);
                }
              );
            },
            function (e) {
              resolve(null);
            }
          );
        });
      });
    };
  },
});
