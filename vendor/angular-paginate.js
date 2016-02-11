angular.module('angular-paginate', [])

.factory('stateService', function(){
    
    var numberPerPage;
    var results;
    var currentPage;
    var pageMax;
    var pageContent;
    
    return {
        
        setNumberPerPage: function(_numberPerPage_){
            numberPerPage = parseInt(_numberPerPage_);
        },

        getNumberPerPage: function(){
            return numberPerPage;
        },

        setResults: function(_results_) {
            results = _results_.slice(0);
            console.log(results);
        },

        getResults: function(){
            return results;
        },

        setCurrentPage: function(_currentPage_){
            currentPage = _currentPage_;
        },

        getCurrentPage: function(){
            return currentPage;
        },

        setPageMax: function(_pageMax_){
            pageMax = _pageMax_;
        },

        getPageMax: function(){
            return pageMax;
        },

        setPageContent: function(_pageContent_){
            pageContent = _pageContent_;
        },

        getPageContent: function(){
            return pageContent;
        }
    };
})

.controller('PaginationController', ['$scope', 'stateService', function($scope, stateService){
        
    $scope.setPageMax = function(pageMax){
        stateService.setPageMax(pageMax);
    };

    $scope.getPageMax = function(){
        return stateService.getPageMax();
    }

    $scope.isFirstPage = function(){
        return ($scope.getCurrentPage() === 1) ? true : false;
    };

    $scope.isLastPage = function(){
        return ($scope.getCurrentPage() == $scope.getPageMax()) ? true : false;
    };

    $scope.getCurrentPage = function(){
        return stateService.getCurrentPage();
    }

    $scope.setCurrentPage = function(currentPage){
        stateService.setCurrentPage(currentPage);
    }

    $scope.setNumberPerPage = function(numberPerPage){
        stateService.setNumberPerPage(numberPerPage);
    }

    $scope.setResults = function(results){
        stateService.setResults(results);
    }
    
    $scope.getResults = function() {
        return stateService.getResults();
    }

    $scope.setPageContent = function(pageContent){
        stateService.setPageContent(pageContent);
    }
    
    $scope.getPageContent = function(page){
        
        var numberPerPage = stateService.getNumberPerPage();
        var results = stateService.getResults();
        var startIndex = numberPerPage * page - numberPerPage;
        var pageContent = stateService.getPageContent();

        while(pageContent.length > 0) pageContent.pop();      // clear previous page content 
        
        
        if(results){
            // if there are less results than number per page, display all results in pageContent
            if((startIndex + numberPerPage - 1) > results.length){
                for(var i = startIndex; i < results.length; i++){
                    pageContent.push(results[i]);
                }
            } else {
                for(var i = startIndex; i < (numberPerPage + startIndex); i++){
                    pageContent.push(results[i]);
                    if(i === (results.length - 1)) break;
                };  
            };
        };
        
        //console.log(pageContent);
        
    };
    
    
}])


// connect with MainCtrl, initalize all parameter
.directive("createPages", function($http,stateService) {
    
    return {
        scope:{
            numberPerPage: "@",
            pages: "=",
            pageContent: "=",
            pageLimit: "@", 
        },
        controller: 'PaginationController',
        link: function(scope,elem,attrs) {
                        
                scope.setNumberPerPage(scope.numberPerPage);

                // set page content variable, bind stateVariable pageContent with MainCtrl
                scope.setPageContent(scope.pageContent);

                for (var i=1;i<=scope.pageLimit;i++) {
                    scope.pages.push(i);
                }
                        
            
                scope.setPageMax(scope.pageLimit);
            
                scope.setCurrentPage(1);
            
                $http.get('api/apartments.json').success(function(response) {
                     stateService.setResults(response.data);
                    
                    // update pageContent with page 1
                     scope.getPageContent(1);
                     console.log(response.data);
                     console.log("success");
                });
            
        }
    }
    
    
})

// pagination, paginationLeft, paginationRight both connect with PaginationCtrl
.directive("pagination", function(){
    return {
        restrict: "A",
        scope: {
            page: "@"
        },
        controller: "PaginationController",
        link: function(scope, elem, attrs){
            elem.bind("click", function(){

                // set current page (for styles)
                scope.setCurrentPage(parseInt(scope.page));

                // get content for selected page
                scope.getPageContent(parseInt(scope.page));

                scope.$apply();         // apply changes
            }); 
        }
    };
})

.directive("paginationLeft", function(){
    return {
        restrict: "A",
        scope: {},
        controller: "PaginationController",
        link: function(scope, elem, attrs){
            elem.bind("click", function(){
                var currentPage = scope.getCurrentPage();
                
                if(currentPage > 1){
                    
                    console.log(currentPage);
                    
                    scope.setCurrentPage( --currentPage );          // move to previous page
                    scope.getPageContent(currentPage);              // reset content to previous page
                    scope.$apply();                                 // apply changes
                };
            });
        }
    };
})

.directive("paginationRight", function(){
    return {
        restrict: "A",
        scope: {},
        controller: "PaginationController",
        link: function(scope, elem, attrs){
            elem.bind("click", function(){
                var currentPage = scope.getCurrentPage();
                
                if(currentPage < scope.getPageMax()){
                        
                        scope.setCurrentPage(++currentPage);        // move to next page
                        scope.getPageContent(currentPage);          // reset contents to next page
                        scope.$apply();                             // apply changes
                }
            });
        }
    };
})

.directive("sortOption", function() {
    
    return {
        scope: {},
        controller: "PaginationController",
        replace: true,
        templateUrl: 'templates/sortButton.html',
        link:function(scope,elem,attrs) {
            scope.views = ['price','popularity'];
            scope.condition = '';
            
            scope.sortByAttr = function(attr) {
                                
                 scope.condition = attr;
                 var results = scope.getResults();
                                                
                 results.sort(function(a,b) {
                     
                   var keyA = a[attr];
                   var keyB = b[attr];
        
                     
                   if (keyA > keyB) return -1;
                   else if (keyA < keyB) return 1;
                   else return 0;
                 });
                
                 scope.setCurrentPage(1);
                 scope.getPageContent(scope.getCurrentPage());
                 
                 //console.log(results);
            };
            
            scope.getCurrentCond = function() {
                return scope.condition;
            };
            
            
            //console.log(scope);
               
        }
    };

})
