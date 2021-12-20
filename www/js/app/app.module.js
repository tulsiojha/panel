var routerApp = angular.module("Home", [
  "ui.router",
  "builder",
  "derived",
  "controls",
  "templates",
  "forms",
  "formview",
  "datasets",
  "datasetform"

]);

routerApp.config([
  "$stateProvider",
  "$urlRouterProvider",
  function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/templates");

    $stateProvider
      .state("templates", {
        url: "/templates",
        template: "<templates></templates>",
      })
      .state("builder", {
        url: "/builder/:id",
        template: "<builder></builder>",
        params: {
          color: 0,
        },
        // controller:'builderController'
      })
      .state("derived", {
        url: "/derived/:id",
        template: "<derived></derived>",
        // cache:false,
        params: {
          edit: false,
          formId: -1
        },
        // deepStateRedirect: { default: { state: 'dashboard.home.main' } },
      })
      .state("New Form", {
        url: "/controls",
        // cache:false,
        template: "<controls></controls>",
        // deepStateRedirect: { default: { state: 'dashboard.home.main' } },
      })
      .state("forms", {
        url: "/froms",
        template: "<forms></forms>",
        // deepStateRedirect: { default: { state: 'dashboard.home.main' } },
      })
      .state("formview", {
        url: "/formview/:id",
        template: "<formview></formview>",
        // deepStateRedirect: { default: { state: 'dashboard.home.main' } },
      })
      .state("datasets", {
        url: "/datasets",
        template: "<datasets></datasets>",
        // deepStateRedirect: { default: { state: 'dashboard.home.main' } },
      })
      .state("datasetform", {
        url: "/datasetform/:id",
        template: "<datasetform></datasetform>",
        // deepStateRedirect: { default: { state: 'dashboard.home.main' } },
      });
  },
]);

routerApp.controller("mainCtrl", [
  "$scope",
  "$rootScope",
  "$http",
  "panelUtils",
  function ($scope, $rootScope, $http, panelUtils) {
    $scope.title = "hello";
    $scope.subtitle = "hello";

    $scope.syncSuccess = false;

    var offCanvas = null;
    document.addEventListener(
      "deviceready",
      function () {
        databaseHandler.init();
        var myOffcanvas = document.getElementById("offcanvasNavbar");
        offCanvas = new bootstrap.Offcanvas(myOffcanvas);
        // offCanvas.show()
        console.log("databaseinit");




        window.FirebasePlugin.getToken(token => {
          console.log(`token: ${token}`);
          window.FirebasePlugin.subscribe("latest_news", function () {
            console.log("Subscribed to topic");
            window.FirebasePlugin.onMessageReceived((message) => {
              console.log(message);
            })
          }, function (error) {
            console.error("Error subscribing to topic: " + error);
          });

        })
      },
      false
    );



    $scope.hideOffCanvas = function () {
      offCanvas.hide();
    };

    $scope.forms = [];
    $scope.datasets = [];

    $scope.syncData = function () {
      $scope.syncSuccess = false;
      $scope.hideOffCanvas();
      panelUtils.getProgressModal().show();

      $scope.forms = [];
      $scope.datasets = [];

      databaseHandler.listForm(function (forms) {
        for (let form = 0; form < forms.rows.length; form++) {
          $scope.forms.push(forms.rows.item(form));
        }

        databaseHandler.listDatasets(async function (datasets) {
          for (let dataset = 0; dataset < datasets.rows.length; dataset++) {
            $scope.datasets.push(datasets.rows.item(dataset));
          }
          $scope.$apply();
          console.log("forms: ", $scope.forms);
          console.log("datasets: ", $scope.datasets);
          await callFormApi();
          console.log("finished updating forms...");
          await callDatasetApi();
          console.log('finished updating datasets....');
          setTimeout(() => {
            $scope.syncSuccess = true;
            $scope.$apply();
          }, 1000);

        })
      })
    }

    const callFormApi = async () => {
      await Promise.all($scope.forms.map(async (form) => {
        const exist = await httpPostMiddle("http://192.168.1.12:3000/form/getformbyformid/", "POST", { formId: form.id });
        console.log(exist.data);
        if (exist.data.data.message.length === 0) {
          const data = { formId: form.id, formTemplateId: form.formTemplateId, formJson: form.formJson };
          const result = await httpPostMiddle("http://192.168.1.12:3000/form/addform", "POST", data);
          if (result.error != null) {
            return
          }
          console.log("Insert form: ", result);
        }
        else {
          const data = { formId: form.id, formTemplateId: form.formTemplateId, formJson: form.formJson };
          const result = await httpPostMiddle("http://192.168.1.12:3000/form/updateform/" + exist.data.data.message[0].id, "PUT", data);
          if (result.error != null) {
            return
          }
          console.log("Update form: ", result);
        }
      }));
    }

    // const data = {name:dataset.name, attribute1:dataset.attribute1, attribute2:dataset.attribute2, attribute3:dataset.attribute3, attribute4:dataset.attribute4, displayfieldname:dataset.displayfieldname, keyfieldname:dataset.keyfieldname};
    const callDatasetApi = async () => {
      await Promise.all($scope.datasets.map(async (dataset) => {
        const exist = await httpPostMiddle("http://192.168.1.12:3000/dataset/getdatasetbyname/", "POST", { name: dataset.name });
        console.log(exist.data);
        if (exist.data.data.message.length === 0) {
          const data = { name: dataset.name, attribute1: dataset.attribute1, attribute2: dataset.attribute2, attribute3: dataset.attribute3, attribute4: dataset.attribute4, displayfieldname: dataset.displayfieldname, keyfieldname: dataset.keyfieldname };
          const result = await httpPostMiddle("http://192.168.1.12:3000/dataset/adddataset", "POST", data);
          if (result.error != null) {
            return
          }
          console.log("Insert dataset success: ", result);
        } else {
          const data = { name: dataset.name, attribute1: dataset.attribute1, attribute2: dataset.attribute2, attribute3: dataset.attribute3, attribute4: dataset.attribute4, displayfieldname: dataset.displayfieldname, keyfieldname: dataset.keyfieldname };
          const result = await httpPostMiddle("http://192.168.1.12:3000/dataset/updatedataset/" + exist.data.data.message[0].id, "PUT", data);
          if (result.error != null) {
            return
          }
          console.log("Update dataset success: ", result);
        }


      }));
    }

    const httpPostMiddle = (url, method, data) => {
      return new Promise((resolve, reject) => {
        $http({
          method: method,
          url: url,
          data: data,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }).then(function (result) {
          resolve({ error: null, data: result })
        }, function (error) {
          resolve({ error: error, data: null })
        });
      })
    }

  },
]);
