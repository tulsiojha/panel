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

    $scope.colorBold = "hsl(216, 98%, 52%)";
    $scope.colorLight = "hsl(216, 98%, 52%, 40%)";


    var colors = [
      "hsl(115, 100%, 39%)",
      "hsl(340, 100%, 39%)",
      "hsl(190, 100%, 24%)",
      "hsl(235, 100%, 39%)",
      "hsl(285, 100%, 39%)",
      "hsl(16, 100%, 39%)",
    ];

    $scope.mediaIcons = {
      mp3: "music.png",
      wav: "music.png",
      mp4: "video.png",
      mpg: "video.png",
      mpeg: "video.png",
      mkv: "video.png",
      png: "image.png",
      jpg: "image.png",
      jpeg: "image.png",
      gif: "image.png",
      bmp: "image.png",
      svg: "image.png",
      pdf: "pdf.png",
      zip: "zip.png",
      "7z": "zip.png",
      others: "other.png",
    };

    $scope.parseColorBold = function (color) {
      return colors[color];
    };

    $scope.parseColorLight = function (color) {
      return getColorWithAlpha(colors[color], 83);
    };

    const init = () => {
      databaseHandler.listFormWithTemplate(async function (result) {

        for (let i = 0; i < result.rows.length; i++) {
          await loadValues(result.rows.item(i));
        }

        $scope.$apply();
        // console.log("formWithTemplate", $scope.templates);
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


      $scope.templates.push({templateName:item.name, templateId:item.formTemplateId ,formJson:jsonArray});
      console.log($scope.templates);

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
 
 
    $scope.getExtension = function (file) {
      return file.slice(((file.lastIndexOf(".") - 1) >>> 0) + 2);
    };

    $scope.getIcon = function (extension) {
      return $scope.mediaIcons[extension]
        ? $scope.mediaIcons[extension]
        : $scope.mediaIcons["others"];
    };

    $scope.formatName = function (fileName) {
      return fileName.length > 50 ? fileName.substring(0, 49) : fileName;
    };



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
