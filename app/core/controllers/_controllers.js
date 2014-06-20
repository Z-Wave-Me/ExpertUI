/**
 * Application bcontrollers
 * @author Martin Vach
 */
var appController = angular.module('appController', []);

// Home controller
appController.controller('HomeController', function($scope) {
    $scope.add_ = function() {
        $scope.message = 'The content comes here';
    };
    $scope.message = 'The content comes here';

});
appController.controller('ProductController', function($scope, $routeParams, $log,Phone) {
//    $scope.list = function() {
//        console.log($routeParams.phoneId);
//        $scope.phones = Phone.all.query();
//    
//    };
//    $scope.detail = function() {
//        $scope.phoneee = Phone.find.get({phoneId: $routeParams.phoneId}, function(phoneee) {
//        $scope.mainImageUrl = phoneee.images[0];
//        });
//    };
    
    if($routeParams.phoneId){
          $log.info('SomeCtrl - starting up, yeah!');
         $scope.phoneee = Phone.find.get({phoneId: $routeParams.phoneId}, function(phoneee) {
        $scope.mainImageUrl = phoneee.images[0];
        });
    }else{
         $scope.phones = Phone.all.query();
    }
    
    
//    Phones.getPhones(function(results) {
//        $scope.phones = results;
//  });
    //$scope.phones = Phones.getPhones();
//      $scope.phoneee = Phone.get({phoneId: $routeParams.phoneId}, function(phoneee) {
//        $scope.mainImageUrl = phoneee.images[0];
//        });

    $scope.orderProp = 'age';

});
appController.controller('ListController', function($scope, Phone) {

    $scope.phones = Phone.query();

    $scope.orderProp = 'age';

});
appController.controller('DetailController_', function($scope, $routeParams, Phone) {
    $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
        $scope.mainImageUrl = phone.images[0];
    });
    $scope.phoneId = $routeParams.phoneId;

    $scope.message = 'This is DETAIL screen';

});


//angApp.controller('ListController', function($scope) {
//
//    $scope.message = 'This is LIST screen';
//
//});



//vadesControllers.controller('PhoneListCtrl', ['$scope', '$http',
//    function($scope, $http) {
//        $http.get('phones/phones.json').success(function(data) {
//            $scope.phones = data;
//        });
//
//        $scope.orderProp = 'age';
//    }]);
