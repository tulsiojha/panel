angular.module("forms").component("forms", {
  templateUrl: "./js/app/forms/forms.template.html",
  controller: function ($scope, $state, $http, panelUtils) {
    
    $scope.panelUtils = panelUtils;

    $scope.templates = [];


    $scope.form_name = "Forms";
    
    $scope.loading = true;


    const init = () => {
      databaseHandler.listFormWithTemplate(async function (result) {

        for (let i = 0; i < result.rows.length; i++) {
          console.log("forms: ",result.rows.item(i));
          await loadValues(result.rows.item(i));
        }
        $scope.loading = false;
        $scope.$apply();
        // console.log("formWithTemplate", $scope.templates);
      });
    };

    const loadValues = async (item) => {
      // console.log(item);
      var jsonArray = []
      const values = JSON.parse(item.formJson);
      for (let [key, value] of Object.entries(values)) {
        console.log(key, value.type);

        if (value.type === "sign" || value.type === "image") {
          const name = await loadFile(value.data, "template_", item.formTemplateId);
          values[key].data = name;
        // console.log(name);

        }

        jsonArray.push({name:key, json:value})
        console.log(jsonArray);
      }


      $scope.templates.push({templateName:item.name, id:item.id, templateId:item.formTemplateId ,formJson:jsonArray});
      // console.log(item);

    };

    document.addEventListener(
      "deviceready",
      function () {
        databaseHandler.init();
        init();
      },
      false
    );


    $scope.onFormClicked = function(index){
      console.log("form clicked..",index,{id:$scope.templates[index].id});
      // console.log();
      $state.go("formview",{id:$scope.templates[index].id})
    }
    // $scope.createTemplate=function() {
    //   var random = Math.floor((Math.random() * 6) + 1)-1
    //   $state.go("form",{id:-1,color:random})
    //   // console.log($scope.templates);
    // }



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
    document.addEventListener("backbutton", function(e) {
      console.log("backPressed");
      if ($state.is("forms")) {
        console.log("exit app");
        navigator.app.exitApp()  
      }
      console.log();
    },false);
  },
});
