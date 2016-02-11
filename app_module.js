// run could only inject instances and constants
// great place to put any event handlers at root level, like "main method"

var myApp = angular.module('app',['angular-paginate','ui.router','ngRoute','ngMessages']);

myApp.config(['$stateProvider', '$urlRouterProvider',
              function($stateProvider,$urlRouterProvider) {
       
    $urlRouterProvider.otherwise('/');
                  
    $stateProvider
                  
     .state('home', {
        url: '/home',
        templateUrl:'pages/home.html',
        controller:'MainCtrl'
     })   
    
     .state('contact', {
        url:'/contact',
        templateUrl:'pages/detail.html',
        controller:'ContactCtrl'
    })
    
    .state('detail', {
        url:'/detail?imgId&imgSrc&imgName',
        templateUrl: 'pages/apartment.detail.html',
        controller: 'DetailCtrl'
    })
       
}]);


myApp.run(function($rootScope,$location,$templateRequest) {
     
   /*
    $templateRequest("templates/editor.html");
    
    $rootScope.$on('$routeChangeStart',function(event,next,current) {
         console.log($location.url());
        //console.log(next,"kema");
        //console.log(current,"joy");
    });
*/
    
});

