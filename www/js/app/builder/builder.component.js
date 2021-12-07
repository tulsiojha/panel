angular.
  module('builder').
  component('builder', { 
    templateUrl:'./js/app/builder/builder.template.html',
    controller: function($scope, $state, $stateParams, $http, $window) {
      
      $scope.$parent.$parent.title = $state.current.name
      
      $scope.form_name= "Untitled"
      $scope.elementsToRender=[] 
      $scope.currentElement;
      $scope.signature="";
      // $scope.image="";
      var colors = ['hsl(115, 100%, 39%)','hsl(340, 100%, 39%)','hsl(190, 100%, 24%)','hsl(235, 100%, 39%)','hsl(285, 100%, 39%)','hsl(16, 100%, 39%)']
    

      const getColorWithAlpha = (color, alpha) => {
        var hsl = color.replace("hsl(", "").replace(")", "").split(",");
        var h = hsl[0],
          s = hsl[1],
          l = hsl[2];
        l = alpha;
        hsl = "hsl(" + h + "," + s + "," + l + "%)";
        return hsl;
      };

      $scope.colorBold = colors[$stateParams.color];
      $scope.colorLight = getColorWithAlpha($scope.colorBold, 83)

      $scope.files=[];
      $scope.formJson = [{}]
      $scope.selectedWidth = {id:'0',value:'col-1'};
      $scope.width = [{id:'0',value:'col-1'},{id:'1',value:'col-2'},{id:'2',value:'col-3'},{id:'3',value:'col-4'},{id:'4',value:'col-5'},{id:'5',value:'col-6'},{id:'6',value:'col-7'},{id:'7',value:'col-8'},{id:'8',value:'col-9'},{id:'9',value:'col-10'},{id:'10',value:'col-11'},{id:'11',value:'col-12'}]

      $scope.formTemplateId = $stateParams.id;

      $scope.values = {}
      
      var signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
        minWidth: 1,
        maxWidth: 1,
        backgroundColor: 'rgba(255, 255, 255, 0)',
        penColor: 'rgb(0, 0, 0)'
      });

      // 1

      var errorModal = new bootstrap.Modal(document.getElementById('progressModal'),{});
    
      

      var myCollapse = document.getElementById('collapseProperties')
      var bsCollapse = new bootstrap.Collapse(myCollapse,{toggle:false})

      var templateNameCollapseElement = document.getElementById('collapseTemplateName')
      var templateNameCollapse = new bootstrap.Collapse(templateNameCollapseElement,{toggle:false})
      
      var contentCollapseElement = document.getElementById('collapseContent')
      var contentCollapse = new bootstrap.Collapse(contentCollapseElement,{toggle:false})



      
      const onPhotoURISuccess = (response, pos)=>{
        
        $scope.values[$scope.elementsToRender[pos].element_id] = "data:image/jpeg;base64,"+response
        console.log($scope.values);
        $scope.$apply()
      }

      const onImageFailed = ()=>{
        console.log("Image loading failed!!!")
      }

      $scope.chooseImage = function(pos) {
        navigator.camera.getPicture((response)=>{onPhotoURISuccess(response, pos)}, onImageFailed, { quality: 20,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
          encodingType : Camera.EncodingType.JPEG });  
      }





      $scope.selection = function(name, type) {
          $scope.values["id_"+$scope.elementsToRender.length] = ''
          $scope.elementsToRender.push({name:name, type:type, element_id:"id_"+$scope.elementsToRender.length, width:$scope.width[2], class:$scope.width[2].value})
          var id = "#id_"+($scope.elementsToRender.length-1);
          
          $scope.currentElement = $scope.elementsToRender.length-1;
          $scope.selectedWidth = $scope.elementsToRender[$scope.currentElement].width
          
          contentCollapse.show()
          
      }
      $scope.selectedElement = function($index) {
          $scope.currentElement = $index;
          console.log($scope.currentElement);
  
          $scope.selectedWidth = $scope.elementsToRender[$scope.currentElement].width
          
          console.log($scope.selectedWidth)

          bsCollapse.show()
          // console.log($scope.currentElement);
      }
  
      $scope.selectChanged = function(index) {
        console.log('changed',index);
      }
      $scope.onChangeWidth = function() {
  
          var tempElements = [...$scope.elementsToRender];
          console.log(tempElements[$scope.currentElement]);
          tempElements[$scope.currentElement].class = $scope.selectedWidth.value
          tempElements[$scope.currentElement].width = $scope.selectedWidth
          $scope.elementsToRender = [...tempElements]
      }
  

      const checkFormTemplateName = (callback) =>{
        databaseHandler.listFormTemplateByName($scope.form_name, function(result) {
          console.log(result.rows);
          if (result.rows.length>0 && (result.rows.item(0).id != $scope.formTemplateId)) {
            callback(true)
          }else{
            callback(false)
          }
        })
      }
      $scope.onSaveClicked = function() {

        checkFormTemplateName(function(exist) {
          if (!exist) {
            if ($scope.formTemplateId<=0) {
              console.log("form template id is less than 0");
              databaseHandler.insertFormTemplate($scope.form_name, "test desc", $stateParams.color,function(result) {
                console.log("formtemplateid ",result.insertId);
                $scope.formTemplateId = result.insertId;
                $scope.$apply()
                recursiveSaving(0)
                
                
              })
            }else{
              databaseHandler.updateFormTemplates($scope.form_name, "test desc",$scope.formTemplateId,function(result) {
                // $scope.formTemplateId = result.insertId;
                recursiveSaving(0)
                // progressModal.toggle()
                
              })
            }
          }else{
            templateNameCollapse.show()
            errorModal.show()
          }
        })
        // progressModal.show()
        



          
          
          // copyFile($scope.image, "template_",function(name) {
          //   console.log("copy image");
          //   var json = {image:name}
          //   if ($stateParams.id<=0) {
          //     databaseHandler.insertForm($scope.formTemplateId, JSON.stringify(json),function() {
          //       console.log("insert form");
          //       // saveSignature()  
          //       $state.go("templates")  
          //     })
          //   }else{
          //     databaseHandler.updateForm(JSON.stringify(json), $scope.formTemplateId,function () {
          //       console.log("update form")
          //       $state.go("templates")  
          //     })
          //   }
          // })

          
          
      }


      const recursiveSaving = (index) =>{
        console.log(index);
        if ($scope.elementsToRender.length === index) {
            // progressModal.hide()
            console.log("finished");
          $state.go('templates')
          return
        }
        const element = $scope.elementsToRender[index]


        console.log(element.id, element.name, element.type, element.width, element.element_id, element.class);
        if (element.id && element.id>0) {
          console.log("update");
          databaseHandler.updateFieldDefinition(element.name, element.type, JSON.stringify(element.width), element.element_id, element.class, element.id, function(results) {
            
            if($scope.values[element.element_id]){
              if (element.type === "image") {
                saveImage("image_",$scope.values[element.element_id],element.element_id,function(fileName) {
                  var tempId = element.element_id;
                  var tempJson = {[tempId]:{name:fileName, type:'image'}}
                  databaseHandler.updateForm(JSON.stringify(tempJson),$scope.formTemplateId, element.id, function (result) {
                    if (result.rowsAffected === 0) {
                      databaseHandler.insertForm($scope.formTemplateId, element.id, JSON.stringify(tempJson), function(result) {
                        console.log("insert form:....",result);
                        recursiveSaving(index+1)
                      })
                    }else{
                      recursiveSaving(index+1)
                    }
                  })
                })  
              }else if (element.type === "sign") {
                saveSignature($scope.values[element.element_id], element.element_id, function(fileName) {
                  var tempId = element.element_id;
                  var tempJson = {[tempId]:{name:fileName, type:'sign'}}
                  databaseHandler.updateForm(JSON.stringify(tempJson),$scope.formTemplateId, element.id, function (result) {
                    if (result.rowsAffected === 0) {
                      databaseHandler.insertForm($scope.formTemplateId, element.id, JSON.stringify(tempJson), function(result) {
                        console.log("insert form:....",result);
                        recursiveSaving(index+1)
                      })
                    }else{
                      recursiveSaving(index+1)
                    }
                  })
                  
                })
              }else if (element.type === "select" || element.type === "input") {
                const tempJson = {[element.element_id]:{name:$scope.values[element.element_id],type:element.type}}
                databaseHandler.updateForm(JSON.stringify(tempJson),$scope.formTemplateId, element.id, function (result) {
                  if (result.rowsAffected === 0) {
                    databaseHandler.insertForm($scope.formTemplateId, element.id, JSON.stringify(tempJson), function(result) {
                      console.log("insert form:....",result);
                      recursiveSaving(index+1)
                    })
                  }else{
                    recursiveSaving(index+1)
                  }
                })
              }
              
            }else{
              // progressModal.hide()
            }

          })              
        }else{
          databaseHandler.insertFieldDefinition(element.name, element.type, JSON.stringify(element.width), element.element_id, element.class, $scope.formTemplateId,function(results) {
            console.log("insert Element", element.type, results.insertId, $scope.values[element.element_id]);
            if($scope.values[element.element_id]){
              console.log(element.type);
              if (element.type === "image") {
                saveImage("image_",$scope.values[element.element_id],element.element_id,function(fileName) {
                var tempId = element.element_id;
                var tempJson = {[tempId]:{name:fileName, type:'image'}}
                databaseHandler.updateForm(JSON.stringify(tempJson),$scope.formTemplateId, results.insertId, function (result) {
                  if (result.rowsAffected === 0) {
                    databaseHandler.insertForm($scope.formTemplateId, results.insertId, JSON.stringify(tempJson), function(result) {
                      console.log("insert form:....",result);
                      recursiveSaving(index+1)
                    })
                  }else{
                    recursiveSaving(index+1)
                  }
                })
              })
            }else if (element.type === "sign") {
              saveSignature($scope.values[element.element_id], element.element_id, function(fileName) {
                var tempId = element.element_id;
                var tempJson = {[tempId]:{name:fileName, type:'sign'}}
                databaseHandler.updateForm(JSON.stringify(tempJson),$scope.formTemplateId, results.insertId, function (result) {
                  if (result.rowsAffected === 0) {
                    databaseHandler.insertForm($scope.formTemplateId, results.insertId, JSON.stringify(tempJson), function(result) {
                      console.log("insert form:....",result);
                      recursiveSaving(index+1)
                    })
                  }else{
                    recursiveSaving(index+1)
                  }
                })
                
              })
            }else if (element.type === "select" || element.type === "input") {
              console.log("updating: select form");
              console.log("runnnn");
              const tempJson = {[element.element_id]:{name:$scope.values[element.element_id],type:element.type}}
              console.log('tempJson',tempJson);
              databaseHandler.updateForm(JSON.stringify(tempJson),$scope.formTemplateId, results.insertId, function (result) {
                if (result.rowsAffected === 0) {
                  databaseHandler.insertForm($scope.formTemplateId, results.insertId, JSON.stringify(tempJson), function(result) {
                    console.log("insert form:....",result);
                    recursiveSaving(index+1)
                  })
                }else{
                  recursiveSaving(index+1)
                }
              })
              console.log("inserted select");
            }
            }else{
              // init()
              // progressModal.hide()
            }
          })
        }
      }

      const saveNextStage = ()=>{
        console.log('template id: ',$scope.formTemplateId);
        // if ($stateParams.id >= 0) {
          $scope.elementsToRender.forEach((element) => {
            console.log(element.id, element.name, element.type, element.width, element.element_id, element.class);
            if (element.id && element.id>0) {
              console.log("update");
              databaseHandler.updateFieldDefinition(element.name, element.type, JSON.stringify(element.width), element.element_id, element.class, element.id, function(results) {
                
                if($scope.values[element.element_id]){
                  if (element.type === "image") {
                    saveImage("image_",$scope.values[element.element_id],element.element_id,function(fileName) {
                      var tempId = element.element_id;
                      var tempJson = {[tempId]:{name:fileName, type:'image'}}
                      databaseHandler.updateForm(JSON.stringify(tempJson),$scope.formTemplateId, element.id, function (result) {
                        if (result.rowsAffected === 0) {
                          databaseHandler.insertForm($scope.formTemplateId, element.id, JSON.stringify(tempJson), function(result) {
                            console.log("insert form:....",result);
                            // progressModal.hide()
                          })
                        }else{
                          
                        }
                      })
                    })  
                  }else if (element.type === "sign") {
                    saveSignature($scope.values[element.element_id], element.element_id, function(fileName) {
                      var tempId = element.element_id;
                      var tempJson = {[tempId]:{name:fileName, type:'sign'}}
                      databaseHandler.updateForm(JSON.stringify(tempJson),$scope.formTemplateId, element.id, function (result) {
                        if (result.rowsAffected === 0) {
                          databaseHandler.insertForm($scope.formTemplateId, element.id, JSON.stringify(tempJson), function(result) {
                            console.log("insert form:....",result);
                            // progressModal.hide()
                          })
                        }else{
                          
                        }
                      })
                      
                    })
                  }else if (element.type === "select" || element.type === "input") {
                    const tempJson = {[element.element_id]:{name:$scope.values[element.element_id],type:element.type}}
                    databaseHandler.updateForm(JSON.stringify(tempJson),$scope.formTemplateId, element.id, function (result) {
                      if (result.rowsAffected === 0) {
                        databaseHandler.insertForm($scope.formTemplateId, element.id, JSON.stringify(tempJson), function(result) {
                          console.log("insert form:....",result);
                          // progressModal.hide()
                        })
                      }else{
                        
                      }
                    })
                  }
                  
                }else{
                  // progressModal.hide()
                }

              })              
            }else{
              databaseHandler.insertFieldDefinition(element.name, element.type, JSON.stringify(element.width), element.element_id, element.class, $scope.formTemplateId,function(results) {
                console.log("insert Element", element.type, results.insertId, $scope.values[element.element_id]);
                if($scope.values[element.element_id]){
                  console.log(element.type);
                  if (element.type === "image") {
                  saveImage("image_",$scope.values[element.element_id],element.element_id,function(fileName) {
                    var tempId = element.element_id;
                    var tempJson = {[tempId]:{name:fileName, type:'image'}}
                    databaseHandler.updateForm(JSON.stringify(tempJson),$scope.formTemplateId, results.insertId, function (result) {
                      if (result.rowsAffected === 0) {
                        databaseHandler.insertForm($scope.formTemplateId, results.insertId, JSON.stringify(tempJson), function(result) {
                          console.log("insert form:....",result);
                          // progressModal.hide()
                        })
                      }else{
                        
                      }
                    })
                  })
                }else if (element.type === "sign") {
                  saveSignature($scope.values[element.element_id], element.element_id, function(fileName) {
                    var tempId = element.element_id;
                    var tempJson = {[tempId]:{name:fileName, type:'sign'}}
                    databaseHandler.updateForm(JSON.stringify(tempJson),$scope.formTemplateId, results.insertId, function (result) {
                      if (result.rowsAffected === 0) {
                        databaseHandler.insertForm($scope.formTemplateId, results.insertId, JSON.stringify(tempJson), function(result) {
                          console.log("insert form:....",result);
                          // progressModal.hide()
                        })
                      }else{
                        
                      }
                    })
                    
                  })
                }else if (element.type === "select" || element.type === "input") {
                  console.log("updating: select form");
                  console.log("runnnn");
                  const tempJson = {[element.element_id]:{name:$scope.values[element.element_id],type:element.type}}
                  console.log('tempJson',tempJson);
                  databaseHandler.updateForm(JSON.stringify(tempJson),$scope.formTemplateId, results.insertId, function (result) {
                    if (result.rowsAffected === 0) {
                      databaseHandler.insertForm($scope.formTemplateId, results.insertId, JSON.stringify(tempJson), function(result) {
                        console.log("insert form:....",result);
                        // progressModal.hide()
                      })
                    }else{
                      
                    }
                  })
                  console.log("inserted select");
                }
                }else{
                  // init()
                  // progressModal.hide()
                }
              })
            }
          console.log('finished');

          })
      }

      const saveSignature = (data, id, callback)=>{
        fileHandler.init(function(rootDirEntry) {
          fileHandler.createDirectory("files",rootDirEntry,function(subRootDirEntry) {
            fileHandler.createDirectory("template_"+$scope.formTemplateId,subRootDirEntry, function(dirEntry) {
              fileHandler.createFile("signature_"+id,dirEntry,function(fileEntry) {
                fileHandler.fileWrite(data, fileEntry, function() {
                  console.log(fileEntry.name);
                  callback(fileEntry.name)
                },function(error) {
                  // alert("error saving file: ",error)
                })
              },function(error) {
                console.log("Error creating file signature: ",error);
              })
            },function(error) {
              console.log("Error creating folder template: ",error);
            })
          },function(e) {
            console.log("Error getting File: ",e);
          })
        })
      }


      const saveImage = (name,data, id, callback)=>{
        fileHandler.init(function(rootDirEntry) {
          fileHandler.createDirectory("files",rootDirEntry,function(subRootDirEntry) {
            fileHandler.createDirectory("template_"+$scope.formTemplateId,subRootDirEntry, function(dirEntry) {
              fileHandler.createFile(name+id,dirEntry,function(fileEntry) {
                fileHandler.fileWrite(data, fileEntry, function() {
                  console.log(fileEntry.name);
                  callback(fileEntry.name)
                },function(error) {
                  // alert("error saving file: ",error)
                })
              },function(error) {
                console.log("Error creating file signature: ",error);
              })
            },function(error) {
              console.log("Error creating folder template: ",error);
            })
          },function(e) {
            console.log("Error getting File: ",e);
          })
        })
      }


      const loadFile = (fileName, dirName, callback)=>{
        fileHandler.init(function(rootDirEntry) {
          fileHandler.createDirectory("files",rootDirEntry,function(subRootDirEntry) {
            fileHandler.createDirectory(dirName+$scope.formTemplateId,subRootDirEntry, function(dirEntry) {
              fileHandler.createFile(fileName,dirEntry,function(fileEntry) {
                var url = fileEntry.toURL()
                fileHandler.readFile(fileEntry,function(file) {
                  
                  callback(file, url)
                },function(error) {
                  alert("error loading file: ",error)
                })
              },function(error) {
                console.log("Error creating file signature: ",error);
              })
            },function(error) {
              console.log("Error creating folder template: ",error);
            })
          },function(e) {
            console.log("Error getting File: ",e);
          })
        })
      }


      const copyFile = (filePath, dirName,callback) =>{
        console.log('getFilePath',filePath);
        fileHandler.copyFileInit(filePath, function(entry, dirEntry) {
          
          fileHandler.createDirectory("files",dirEntry,function(rootEntry) {
            fileHandler.createDirectory(dirName+$scope.formTemplateId, rootEntry, function(subEntry) {
              entry.copyTo(subEntry, entry.name,function(response) {
                console.log("copied",entry.name);
                callback(entry.name)
              },function(error) {
                callback(entry.name)
                console.log("Error copying file: ",error);
              })
            },function(error) {
              console.log("Error getting or createing template folder: ",error);
            })
          },function(error) {
            console.log("Error getting folder file: ",error);
          })
        },function(error) {
          console.log("Error init copy file: ",error);
        })
      }

      $scope.onCloseSignatureModal = function() {
        signaturePad.clear();
      }

      $scope.signIndex = -1;

      $scope.onEditSignClicked = function(index) {
        $scope.signIndex = index;
      }

      $scope.onSaveSignatureModal = function() {
        var data = signaturePad.toDataURL("image/png")
        $scope.values[$scope.elementsToRender[$scope.signIndex].element_id] = data
        console.log($scope.values);

      }


      $scope.onFileChanges = function(e) {
        console.log(e);
        for (let i = 0; i < e.files.length; i++) {
          $scope.files.push(e.files[i].name)
        }

        $scope.$apply()
        console.log($scope.files);
        // console.log(e.files);
      }


      const init = ()=> {
        
        $scope.elementsToRender=[]
        if ($scope.elementsToRender.length>0) {
          $scope.$apply()
        }
        // $scope.$apply()
        databaseHandler.listFormTemplateByID($scope.formTemplateId,function(result) {
          $scope.form_name = result.rows.item(0).name
          
        })
        databaseHandler.listFieldDefinitionByID($scope.formTemplateId,function(result) {
          console.log(result);
          for (let i = 0; i < result.rows.length; i++) {
            const element = result.rows.item(i);
            $scope.elementsToRender.push({name:element.name,type:element.type, id:element.id, width:JSON.parse(element.width), class:element.element_class, element_id:element.element_id})
          }
          $scope.$apply()
          console.log($scope.elementsToRender);
        })

        // loadFile("profile.jpg","template_", function(file, url) {
        //   $scope.image = url;  
        //   $scope.$apply()
        //   console.log($scope.image);
        //   loadFile("signature","template_", function(file, url) {
        //     $scope.signature = file;  
        //     $scope.$apply()
        //   })
        // })
        
        databaseHandler.listFormByFormTemplateID($scope.formTemplateId,function(result) {
          
          loadValues(result, 0)
          console.log("init values: ",$scope.values);
        })
        
        
        const loadValues = (result, i)=>{
          console.log(i, i === result.rows.length, result.rows.length);
          if (i === result.rows.length) {
            return
          }
          jsonObject = JSON.parse(result.rows.item(i).formJson)
          console.log(jsonObject);
          if (Object.values(jsonObject)[0].type === "select" || Object.values(jsonObject)[0].type === "input") {
            $scope.values[[Object.keys(jsonObject)[0]]] = Object.values(jsonObject)[0].name;
            loadValues(result, i+1)
          }else{
            loadFile(Object.values(jsonObject)[0].name, "template_", function(file, url) {
              console.log('url',url,Object.keys(jsonObject)[0]);
              $scope.values[[Object.keys(jsonObject)[0]]]=file
              
              $scope.$apply()
              loadValues(result, i+1)
            })
          }
          $scope.$apply()
        }
        
      }

      init()
    }
  });