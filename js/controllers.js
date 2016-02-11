angular.module("app").controller('MainCtrl',function($scope) {
   
    $scope.pages = [];
    $scope.pageContent = [];
    $scope.nPage = 5;
    $scope.pageMax = 3;
    
    
    console.log($scope);
    // $scope...
    
    $scope.highlightedItem = '';
    $scope.onClick = function(apartment) {

        $scope.highlightedItem = apartment;
        
    };
});


angular.module("app").controller('DetailCtrl',function($scope,$stateParams) {

    $scope.imageId = $stateParams.imageId;
    $scope.imgSrc = 'api/' + $stateParams.imgSrc;
    $scope.imgName = $stateParams.imgName;
    
    
    
});

angular.module("app").controller('ContactCtrl', function($scope,stateService) {
    
});

