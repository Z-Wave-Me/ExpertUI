/**
 * Application factories
 * @author Martin Vach
 */
var appFactory = angular.module('appFactory', ['ngResource']);
 
 // Get a complete JSON from the directory
appFactory.factory('TestFactory', function($resource) {
   return {
        all: $resource('storage/demo/all.json', {}, {
            query: {method: 'GET', params: {}, isArray: false}
        })
    };
});

// Get a devices JSON
appFactory.factory('FirmwareFactory', function($resource) {
   return {
        all: $resource('storage/demo/all.json', {}, {
            query: {method: 'GET', params: {}, isArray: false}
        })
    };
});

appFactory.factory('Phones', function($http) {
    return {
        getPhones: function(callback) {
            $http.get('storage/phones/phones.json').success(callback);
        }
    };
});

//vadesServices.factory('Phones', ['$resource',
//  function($resource){
//    return $resource('phones/:phoneId.json', {}, {
//      query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
//    });
//  }]);

//vadesServices.factory('Phone', ['$resource',
//    function($resource) {
//        return $resource('phones/:phoneId.json', {}, {
//            query: {method: 'GET', params: {phoneId: 'phones'}, isArray: true}
//        });
//    }]);

appFactory.factory('Phone', function($resource) {
//    return $resource('phones/:phoneId.json', {}, {
//        query: {method: 'GET', params: {phoneId: 'phones'}, isArray: true}
//    });
    return {
        all: $resource('storage/phones/phones.json', {}, {
            query: {method: 'GET', params: {}, isArray: true}
        }),
        find: $resource('storage/phones/:phoneId.json', {}, {
            query: {method: 'GET', params: {phoneId: 'phones'}, isArray: true}
        })
    };
});

//angular.module('myApp.services', ['ngResource']).
//        factory("geoProvider", function($resource) {
//            return {
//                states: $resource('../data/states.json', {}, {
//                    query: {method: 'GET', params: {}, isArray: false}
//                }),
//                countries: $resource('../data/countries.json', {}, {
//                    query: {method: 'GET', params: {}, isArray: false}
//                })
//            };
//        });