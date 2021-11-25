var routerApp = angular.module("Home", []);

routerApp.controller("mainCtrl", ['$scope','$timeout' ,function ($scope,$timeout) {
    $scope.elementsToRender=[] 
    $scope.currentElement;
    $scope.selectedWidth = {id:'0',value:'col-1'};
    $scope.width = [{id:'0',value:'col-1'},{id:'1',value:'col-2'},{id:'2',value:'col-3'},{id:'3',value:'col-4'},{id:'4',value:'col-5'},{id:'5',value:'col-6'},{id:'6',value:'col-7'},{id:'7',value:'col-8'},{id:'8',value:'col-9'},{id:'9',value:'col-10'},{id:'10',value:'col-11'},{id:'11',value:'col-12'}]

    $scope.selection = function(name, type) {
        $scope.elementsToRender.push({name:name,type:type, id:"id_"+$scope.elementsToRender.length, width:$scope.width[2], class:$scope.width[2].value})
        var id = "#id_"+($scope.elementsToRender.length-1);
        
        $scope.currentElement = $scope.elementsToRender.length-1;
        $scope.selectedWidth = $scope.elementsToRender[$scope.currentElement].width
    }
    $scope.selectedElement = function($index) {
        $scope.currentElement = $index;
        console.log($scope.currentElement);

        $scope.selectedWidth = $scope.elementsToRender[$scope.currentElement].width
        
        console.log($scope.selectedWidth)
        // console.log($scope.currentElement);
    }

    $scope.onChangeWidth = function() {

        var tempElements = [...$scope.elementsToRender];
        console.log(tempElements[$scope.currentElement]);
        tempElements[$scope.currentElement].class = $scope.selectedWidth.value
        $scope.elementsToRender = [...tempElements]
    }

    document.addEventListener("deviceready",function() {
        databaseHandler.init();
        databaseHandler.insertData("tulsi","this is test",5);
        databaseHandler.listFieldDefinition(function(result) {
            for (let i = 0; i < result.rows.length; i++) {
                console.log("Row: ",result.rows.item(i).name,result.rows.item(i).description,result.rows.item(i).formtemplateid);
            }    
        });
    },false)
}])
