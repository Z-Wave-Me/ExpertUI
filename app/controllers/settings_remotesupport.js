/**
 * @overview The controller that renders and handles remote access data.
 * @author Martin Vach
 */

/**
 * The controller that renders and handles remote access data.
 * @class ManagementRemoteController
 */
appController.controller('SettingsRemoteController', function ($scope, $q, $window, dataService, deviceService) {
    $scope.remoteAccess = {
        remoteId: null,
        alert: {message: false, status: 'is-hidden', icon: false},
        show: false,
        instance: {},
        params: {}
    };

    /**
     * Load all promises
     */
    $scope.allRemoteAccessSettled = function () {
        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('loading')};
        var promises = [
            dataService.getApi('instances', '/RemoteAccess', true),
            dataService.getApi('remoteId')
        ];

        $q.allSettled(promises).then(function (response) {
            $scope.loading = false;
            var instance = response[0];
            var remoteId = response[1];

            var message = "";

            // Success - api data
            if (instance.state === 'fulfilled') {
                if (!instance.value.data.data[0].active) {
                    $scope.remoteAccess.alert = {message: $scope._t('remote_access_not_active'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                } else {
                    $scope.remoteAccess.alert = false;
                }

                $scope.remoteAccess.instance = instance.value.data.data[0];
                $scope.remoteAccess.params = instance.value.data.data[0].params;

                $scope.remoteAccess.show = true;
            } else if (instance.state === 'rejected') {
                $scope.remoteAccess.alert = {message: $scope._t('remote_access_not_active'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
            }

            // Success - remoteId
            if (remoteId.state === 'fulfilled') {
                // remoteId
                if (remoteId.value.data.data.remote_id) {
                    $scope.remoteAccess.remoteId = remoteId.value.data.data.remote_id;
                } else {
                    $scope.remoteAccess.alert = {message: $scope._t('remote_access_error'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                }
            } else if (instance.state === 'rejected') {
                $scope.remoteAccess.alert = {message: $scope._t('remote_access_error'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
            }
        });
    };
    $scope.allRemoteAccessSettled();

    /**
     * PUT Remote access
     */
    $scope.putRemoteAccess = function (input) {
        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('updating')};
        dataService.putApi('instances', input.instance.id, input.instance).then(function (response) {
            $scope.loading = false;
            deviceService.showNotifier({message: $scope._t('success_updated')});
        }, function (error) {
            alertify.alertError($scope._t('error_update_data'));
            $scope.loading = false;
        });

    };

    /**
     * Create instance
     */
    $scope.createInstance = function() {
        var inputData = {
            "moduleId":"RemoteAccess",
            "active":"true",
            "title":"Remote Access",
            "params":{  
                "path": "",
                "userId": "",
                "actStatus": true,
                "sshStatus": false,
                "zbwStatus": "",
                "pass": ""
            }
        };

        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('updating')};
        dataService.postApi('instances', inputData).then(function (response) {
            $scope.loading = false
            deviceService.showNotifier({message: $scope._t('reloading_page')});
            $window.location.reload();
        }, function (error) {
            alertify.alertError($scope._t('error_update_data'));
            alertify.dismissAll();
            $scope.loading = false;
        });
    }

    /**
     * Activate cloud backup
     */
    $scope.activateRemoteAccess = function (input, activeStatus) {

        if(_.isEmpty(input)) {
            $scope.createInstance();
        } else {
            input.active = activeStatus;
            $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('updating')};
            if (input.id) {
                dataService.putApi('instances', input.id, input).then(function (response) {
                    deviceService.showNotifier({message: $scope._t('success_updated')});
                    $scope.loading = false;
                    $scope.allRemoteAccessSettled();
                }, function (error) {
                    alertify.alertError($scope._t('error_update_data'));
                    alertify.dismissAll();
                    $scope.loading = false;
                });
            }
        }
    };
});