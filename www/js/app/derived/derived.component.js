angular.module("derived").component("derived", {
  templateUrl: "./js/app/derived/derived.template.html",
  controller: function ($scope, $rootScope, $state, $stateParams, panelUtils) {
    $scope.form_name = "";

    $scope.panelUtils = panelUtils;

    $scope.elementsToRender = [];
    $scope.currentElement;
    $scope.signature = "";
    $scope.marker;
    // $scope.image="";
    $scope.colorBold = "hsl(216, 98%, 52%)";
    $scope.colorLight = "hsl(216, 98%, 52%, 40%)";

    $scope.files = [];
    $scope.formJson = [{}];
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

    $scope.values = {};

    var signaturePad = new SignaturePad(
      document.getElementById("signature-pad"),
      {
        minWidth: 1,
        maxWidth: 1,
        backgroundColor: "rgba(255, 255, 255, 0)",
        penColor: "rgb(0, 0, 0)",
      }
    );

    // 1

    var progressModal = new bootstrap.Modal(
      document.getElementById("progressModal"),
      {}
    );

    var mapModal = new bootstrap.Modal(
      document.getElementById("mapModal"),
      {keyboard: false}
    );

    var errorModal = new bootstrap.Modal(
      document.getElementById("errorModal"),
      {}
    );

    const onPhotoURISuccess = (response, pos) => {
      $scope.values[$scope.elementsToRender[pos].name] = {
        name: $scope.elementsToRender[pos].name,
        type: "image",
        id: $scope.elementsToRender[pos].id + "_" + Date.now(),
        data: "data:image/jpeg;base64," + response,
      };
      console.log($scope.values);
      $scope.$apply();
    };

    const onImageFailed = () => {
      console.log("Image loading failed!!!");
    };

    $scope.chooseImage = function (pos) {
      navigator.camera.getPicture(
        (response) => {
          onPhotoURISuccess(response, pos);
        },
        onImageFailed,
        {
          quality: 20,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
          encodingType: Camera.EncodingType.JPEG,
        }
      );
    };

    $scope.chooseFiles = async function (pos) {
      getPermissionStatus(function (exist) {
        if (exist) {
          fileChooser.open(async function (uri) {
            console.log(JSON.parse(uri));
            var tempFiles = [];

            await Promise.all(
              JSON.parse(uri).map(async (file) => {
                // const fileUri = await resolveFilePath(file);
                const fileUri = await resolveFilePathTest(file);
                tempFiles.push(fileUri);
              })
            );
            console.log("file uris...: ", tempFiles);
            $scope.values[$scope.elementsToRender[pos].name] = {
              name: $scope.elementsToRender[pos].name,
              id: $scope.elementsToRender[pos].id + "_" + Date.now(),
              type: "file",
              data: tempFiles,
            };
            $scope.$apply();
          });
        }
      });
    };
    const resolveFilePathTest = async (file) => {
      return new Promise((resolve, reject) => {
        filecopy.resolveName(file, function (success) {
          resolve({ uri: file, name: success })
        }, function (error) {
          resolve(null)
        })
      });
    };
    const resolveFilePath = async (file) => {
      return new Promise((resolve, reject) => {
        window.FilePath.resolveNativePath(
          file,
          function (result) {
            window.resolveLocalFileSystemURL(
              result,
              function (entry) {
                resolve({ uri: entry.nativeURL, name: entry.name });
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
      });
    };

    $scope.inputChanged = (data, pos) => {
      $scope.values[$scope.elementsToRender[pos].name] = {
        name: $scope.elementsToRender[pos].name,
        id: $scope.elementsToRender[pos].id + "_" + Date.now(),
        type: "input",
        data: data,
      };
    };

    $scope.selectChanged = (data, pos) => {
      $scope.values[$scope.elementsToRender[pos].name] = {
        name: $scope.elementsToRender[pos].name,
        id: $scope.elementsToRender[pos].id + "_" + Date.now(),
        type: "select",
        data: data,
      };
    };

    const getPermissionStatus = (callback) => {
      var permissions = cordova.plugins.permissions;

      const list = [
        permissions.READ_EXTERNAL_STORAGE,
        permissions.WRITE_EXTERNAL_STORAGE,
      ];

      permissions.checkPermission(
        list,
        function (status) {
          console.log("permission already exist: ", status);
          if (!status.hasPermission) {
            permissions.requestPermissions(
              list,
              function (s) {
                if (!s.hasPermission) {
                  callback(false);
                } else {
                  callback(true);
                }
              },
              function (error) {
                console.log("permission denied: ", error);
                callback(false);
              }
            );
          } else {
            callback(true);
          }
        },
        function (error) {
          console.log("Permission is not allowed: ", error);
        }
      );
    };
    $scope.saveData = () => {
      // getPermissionStatus(function (exist) {
      //   console.log(exist);
      //   if (exist) {
      //     saveNext();
      //   }
      // });
      saveNext();
    };

    const handlePictures = async (json) => { };

    const saveNext = async () => {
      // progressModal.show()
      var tempJson = JSON.parse(JSON.stringify($scope.values));

      console.log("verify tempJson: ", tempJson);
      // tempJson = Object.assign({}, $scope.values);
      var shouldForward = true;
      $scope.elementsToRender.forEach((item) => {
        if (tempJson[item.name] && tempJson[item.name].data) {
          if (
            tempJson[item.type] === "file" &&
            tempJson[item.name].data.length > 0
          ) {
          } else if (tempJson[item.name].data != "") {
          } else {
            $scope.errorMessage =
              "Field " +
              item.name +
              " of type " +
              item.type +
              " is empty. Please enter required value.";
            shouldForward = false;
            errorModal.show();
            return;
          }
        } else {
          $scope.errorMessage =
            "Field " +
            item.name +
            " of type " +
            item.type +
            " is empty. Please enter required value.";
          shouldForward = false;
          errorModal.show();
          return;
        }
      });

      if (!shouldForward) {
        console.log("shouldForward1");
        return;
      }

      console.log("shouldForward2");

      for (let [key, value] of Object.entries(tempJson)) {
        console.log(key, value.type);

        if (value.type === "sign" || value.type === "image") {
          const name = await saveDataFile(value.type, value.data, value.id);
          tempJson[key].data = name;
          console.log("finished...", value.type);
        } else if (value.type === "file") {
          var tempFile = [];
          await Promise.all(
            value.data.map(async (file) => {
              if (file != null) {
                console.log(typeof file, file);
                if (file.uri.startsWith("content://")) {
                  const fileName = await copyFileTest(file.uri);
                  if (fileName != null) {
                    tempFile.push({ uri: fileName, name: fileName });
                  }
                } else {
                  tempFile.push(file);
                }
              }

              // console.log("resolved files: ", fileName);
            })
          );
          tempJson[key].data = [...tempFile];
        }
      }

      // databaseHandler.updateForm(
      //   JSON.stringify(tempJson),
      //   $scope.formTemplateId,
      //   function (result) {
      //     console.log("update or insert...");
      //     if (result.rowsAffected === 0) {
      //       databaseHandler.insertForm(
      //         $scope.formTemplateId,
      //         JSON.stringify(tempJson),
      //         function (result) {
      //           console.log("insert form..");
      //           // progressModal.hide()
      //           $state.go("New Form");
      //         }
      //       );
      //     } else {
      //       console.log("updated form....");
      //       $state.go("New Form");
      //       // }, 1000);
      //     }
      //   }
      // );

      databaseHandler.insertForm(
        $scope.formTemplateId,
        JSON.stringify(tempJson),
        function (result) {
          console.log("insert form..");
          // progressModal.hide()
          $state.go("New Form");
        }
      );
    };

    const saveDataFile = async (name, data, id) => {
      return new Promise((resolve, reject) => {
        fileHandler.init(function (rootDirEntry) {
          fileHandler.createDirectory(
            "files",
            rootDirEntry,
            function (subRootDirEntry) {
              fileHandler.createDirectory(
                "template_" + $scope.formTemplateId,
                subRootDirEntry,
                function (dirEntry) {
                  fileHandler.createFile(
                    name + id,
                    dirEntry,
                    function (fileEntry) {
                      fileHandler.fileWrite(
                        data,
                        fileEntry,
                        function () {
                          console.log(fileEntry.name);
                          resolve(fileEntry.name);
                        },
                        function (error) {
                          console.log(error);
                          resolve(null);
                        }
                      );
                    },
                    function (error) {
                      console.log("Error creating file signature: ", error);
                      resolve(null);
                    }
                  );
                },
                function (error) {
                  console.log("Error creating folder template: ", error);
                  resolve(null);
                }
              );
            },
            function (e) {
              console.log("Error getting File: ", e);
              resolve(null);
            }
          );
        });
      });
    };

    const copyFile = async (filePath) => {
      return new Promise(async (resolve, reject) => {
        console.log("getFilePath", filePath);
        fileHandler.init(function (entry) {
          fileHandler.createDirectory(
            "files",
            entry,
            function (subDirEntry) {
              fileHandler.createDirectory(
                "template_" + $scope.formTemplateId,
                subDirEntry,
                function (templateDir) {
                  var fileTransfer = new FileTransfer();
                  var uri = encodeURI(filePath);
                  window.resolveLocalFileSystemURL(filePath, (fileEntry) => {
                    fileTransfer.download(
                      uri,
                      templateDir.nativeURL + "/" + fileEntry.name,
                      function (entry) {
                        console.log("download complete: ", entry);
                        resolve(entry.name);
                      },
                      function (error) {
                        console.log("download error source " + error.source);
                        console.log("download error target " + error.target);
                        console.log("download error code" + error.code);
                        console.log(error);
                        resolve(null);
                      }
                    );
                  });
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
        });
      });
    };

    const copyFileTest = async (filePath) => {
      return new Promise(async (resolve, reject) => {
        console.log("getFilePath", filePath);
        fileHandler.init(function (entry) {
          fileHandler.createDirectory(
            "files",
            entry,
            function (subDirEntry) {
              fileHandler.createDirectory(
                "template_" + $scope.formTemplateId,
                subDirEntry,
                function (templateDir) {
                  filecopy.copyFile(filePath, templateDir.nativeURL, function (success) {
                    resolve(success)
                  }, function (error) {
                    resolve(null)
                  })
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
        });
      });
    };

    $scope.onCloseSignatureModal = function () {
      signaturePad.clear();
    };

    $scope.signIndex = -1;

    $scope.onEditSignClicked = function (index) {
      $scope.signIndex = index;
    };

    $scope.onSaveSignatureModal = function () {
      var data = signaturePad.toDataURL("image/png");
      $scope.values[$scope.elementsToRender[$scope.signIndex].name] = {
        name: $scope.elementsToRender[$scope.signIndex].name,
        id: $scope.elementsToRender[$scope.signIndex].id + "_" + Date.now(),
        type: $scope.elementsToRender[$scope.signIndex].type,
        data: data,
      };
      console.log($scope.values);
    };

    $scope.onFileChanges = function (e) {
      console.log(e);
      for (let i = 0; i < e.files.length; i++) {
        $scope.files.push(e.files[i].name);
      }

      $scope.$apply();
      console.log($scope.files);
      // console.log(e.files);
    };

    const init = () => {
      $scope.elementsToRender = [];
      if ($scope.elementsToRender.length > 0) {
        $scope.$apply();
      }

      databaseHandler.listFormTemplateByID(
        $scope.formTemplateId,
        function (result) {
          $scope.form_name = result.rows.item(0).name;
          $scope.$parent.$parent.subtitle = $scope.form_name;
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

      // databaseHandler.listFormByFormTemplateID(
      //   $scope.formTemplateId,
      //   function (result) {
      //     if (result.rows.length > 0) {
      //       loadValues(result.rows.item(0));
      //     }
      //   }
      // );

      var myModal = document.getElementById('mapModal')
      myModal.addEventListener('shown.bs.modal', function () {
        $scope.onInit()
        console.log("mapModal Show");
        setTimeout(function () {
          $scope.map.invalidateSize();
        }, 1);
      })

    };

    const loadValues = async (item) => {
      const values = JSON.parse(item.formJson);
      for (let [key, value] of Object.entries(values)) {
        console.log(key, value.type);

        if (value.type === "sign" || value.type === "image") {
          const name = await loadFile(value.data, "template_", value.id);
          values[key].data = name;
        }
      }
      console.log(values);

      $scope.values = JSON.parse(JSON.stringify(values));
      $scope.$apply();
    };

    const loadFile = async (fileName, dirName, callback) => {
      return new Promise((resolve, reject) => {
        fileHandler.init(function (rootDirEntry) {
          fileHandler.createDirectory(
            "files",
            rootDirEntry,
            function (subRootDirEntry) {
              fileHandler.createDirectory(
                dirName + $scope.formTemplateId,
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

    init();





    $scope.onScanClicked = function (index) {
      cordova.plugins.barcodeScanner.scan(
        function (result) {

          console.log(result);
          $scope.values[$scope.elementsToRender[index].name] = {
            name: $scope.elementsToRender[index].name,
            id: $scope.elementsToRender[index].id + "_" + Date.now(),
            type: $scope.elementsToRender[index].type,
            data: { text: result.text, format: result.format },
          };

          $scope.$apply()
        },
        function (error) {
          alert("Scanning failed: " + error);
        },
        {
          preferFrontCamera: false, // iOS and Android
          showFlipCameraButton: true, // iOS and Android
          showTorchButton: true, // iOS and Android
          torchOn: false, // Android, launch with the torch switched on (if available)
          saveHistory: true, // Android, save scan history (default false)
          prompt: "Place a barcode inside the scan area", // Android
          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          // formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
          disableAnimations: true, // iOS
          disableSuccessBeep: false // iOS and Android
        }
      );
    }

    $scope.onCancelClicked = function () {
      $state.go("New Form");
    };

    $scope.mapIndex = -1;

    $scope.onEditMapClicked = function (index) {
      $scope.mapIndex = index;
    };

    $scope.onSaveMap = function () {

      console.log($scope.marker.getLatLng());
      $scope.values[$scope.elementsToRender[$scope.mapIndex].name] = {
        name: $scope.elementsToRender[$scope.mapIndex].name,
        id: $scope.elementsToRender[$scope.mapIndex].id + "_" + Date.now(),
        type: $scope.elementsToRender[$scope.mapIndex].type,
        data: { lat: $scope.marker.getLatLng().lat, lng: $scope.marker.getLatLng().lng },
      };
    }



    document.addEventListener("deviceready", function () {

      // $scope.map;
      // $scope.map.invalidateSize();
      //  onDeviceReady()

    }, false)


    $scope.onInit = function () {
      // if(!$scope.map)
      try {
        $scope.map = L.map('map').setView([0, 0], 13);
      } catch (error) {
        console.log(error);
      }
      console.log("init map");
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo($scope.map);
      onDeviceReady()

      // setTimeout(function () {
      //   $scope.map.invalidateSize();
      // }, 1);
    }




    function onDeviceReady() {
      cordova.plugins.locationAccuracy.request(function (success) {
        console.log("Successfully requested accuracy: " + success.message);
        handleSuccess();
      }, function (error) {
        console.error("Accuracy request failed: error code=" + error.code + "; error message=" + error.message);
        if (error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
          if (window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")) {
            cordova.plugins.diagnostic.switchToLocationSettings();
          }
        }
      }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
    }

    var onGetLocation = function (position) {
      // position.coords.latitude + "&lon=" + position.coords.longitude
      
      if(!$scope.marker){
        $scope.map.flyTo([position.coords.latitude, position.coords.longitude], 13)
        $scope.marker = L.marker([position.coords.latitude, position.coords.longitude], { draggable: 'true', autoPan: true }).addTo($scope.map);
      }else{
        $scope.map.flyTo([$scope.marker.getLatLng().lat, $scope.marker.getLatLng().lng], 13)
      }
        


      $scope.map.on("click", function (e) {
        $scope.marker.setLatLng([e.latlng.lat, e.latlng.lng], { draggable: 'true', autoPan: true });
      });
    };




    // onError Callback receives a PositionError object
    //
    var onLocationFailed = function (error) {
      alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
    }


    const handleSuccess = () => {
      navigator.geolocation.getCurrentPosition(onGetLocation, onLocationFailed);
    }

  },
});
