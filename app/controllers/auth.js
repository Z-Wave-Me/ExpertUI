/**
 * @overview This controller handles authentication process.
 * @author Martin Vach
 */
/**
 * Auth default controller
 * @class AuthController
 *
 */
appController.controller('AuthController', function ($location, $window, $timeout) {
    $location.path('/home');
    $timeout(function() {
        $window.location.reload();
    }, 1);
});