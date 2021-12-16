angular.module("datasetform").component("datasetform", {
  templateUrl: "./js/app/datasetform/datasetform.template.html",
  controller: function ($scope, $state, $stateParams, panelUtils) {
    $scope.panelUtils = panelUtils;

    $scope.datasetFormId = $stateParams.id;
    $scope.dataset = {
      name: "",
      attribute1: "",
      attribute2: "",
      attribute3: "",
      attribute4: "",
      displayfieldname: "",
      keyfieldname: ""
    }

    $scope.errorMessage = "";

    var errorModal = new bootstrap.Modal(
      document.getElementById("errorModal"),
      {}
    );


    const init = () => {
      if ($scope.datasetFormId > 0) {
        databaseHandler.listDatasetsByID($scope.datasetFormId, function (result) {
          console.log(result.rows.item(0));
          $scope.dataset = result.rows.item(0)
          $scope.$apply()
        })
      }

      var errorModal = document.getElementById('errorModal')

      
      errorModal.addEventListener('shown.bs.modal', function () {
        panelUtils.errorModalIsOpened = true;
      })

      errorModal.addEventListener('show.bs.modal', function () {
        panelUtils.errorModalIsOpened = true;
      })

      errorModal.addEventListener('hidden.bs.modal', function () {
        panelUtils.errorModalIsOpened = false;
      })
    }



    document.addEventListener(
      "deviceready",
      function () {
        databaseHandler.init();
        init();
      },
      false
    );


    const checkDatasetName = (callback)=> {
      console.log("checkDatasetName");
      databaseHandler.listDatasetsByName($scope.dataset.name, function (result) {
        console.log(result);
        if (result.rows.length > 0 && $scope.dataset.id != result.rows.item(0).id) {
          callback(false)
        } else {
          callback(true)
        }
      })
    }

    $scope.saveDataset = function () {
      if ($scope.dataset.name === "") {
          $scope.errorMessage = "Field name is empty!"
          errorModal.show()
          return
      }
      checkDatasetName(function(shouldProceed) {
        console.log(shouldProceed);
        if (shouldProceed) {
          proceedSaving()
        }else{
          $scope.errorMessage = "Dataset name already exist!. Please enter unique name."
          $scope.$apply()
          errorModal.show()
        }
      })
      
    };
  const proceedSaving = ()=>{
    console.log($scope.dataset);
      $scope.errorMessage = "";
      var shouldProceed = true;
      for (const data in $scope.dataset) {
        console.log($scope.dataset[data]);
        if ($scope.dataset[data] === "") {
          console.log("empty: ", data);
          $scope.errorMessage = "Field " + data + " is empty."
          shouldProceed = false;
           $scope.$apply()
          break;
        }
      }

      if (!shouldProceed) {
        errorModal.show()
        return
      }

      if ($scope.datasetFormId > 0) {
        databaseHandler.updateDataset($scope.datasetFormId, $scope.dataset.name, $scope.dataset.attribute1, $scope.dataset.attribute2, $scope.dataset.attribute3, $scope.dataset.attribute4, $scope.dataset.displayfieldname, $scope.dataset.keyfieldname, function (result) {
          console.log("updated...");
          $state.go("datasets")
        })
      } else {
        databaseHandler.insertDataset($scope.dataset.name, $scope.dataset.attribute1, $scope.dataset.attribute2, $scope.dataset.attribute3, $scope.dataset.attribute4, $scope.dataset.displayfieldname, $scope.dataset.keyfieldname, function (result) {
          // console.log("Inserted dataset: ",result.rows.insertId);
          $state.go("datasets")
        })
      }
  }
  
  
  document.addEventListener("backbutton", function(e) {
    console.log("backPressed");
    
    if (panelUtils.errorModalIsOpened) {
      panelUtils.getErrorModal().hide()
      e.preventDefault()
      return
    }else{
      if ($state.is("datasetform")) {
        console.log("move to datasets");
        $state.go("datasets", {})  
      }        
    }
    console.log();
  },false)
},
});
