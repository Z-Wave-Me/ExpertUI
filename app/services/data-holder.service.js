const dataHolderModule = angular.module('dataHolderModule', ['appFactory']);


dataHolderModule.service('dataHolderService',['dataService', 'deviceService', '$rootScope', 'cfg','$interval','$http', '$filter', function (dataService, deviceService, $rootScope, cfg, $interval, $http, $filter) {
    this.cache = {
      _loaded: {},
      get loaded() {
        return this._loaded;
      },
      set loaded([path, value]) {
        const valuePath = path.split('.');
        const last = valuePath.pop();
        valuePath.reduce((o, k) => o[k] = o[k] || {}, this._loaded)[last] = value;
      },
      updateTime: 0
    };
    const self = this;
    this.update = function () {
      return dataService.loadZwaveApiData().then(ZWaveAPIData => {
        const {updateTime, ...data} = ZWaveAPIData;
        this.cache._loaded = data;
        this.cache.updateTime = updateTime;
        return ZWaveAPIData;
      });
    }

    this.deviceList = function () {
      return deviceService.getNavConfig(this.cache.loaded.devices, this.cache.loaded.controller.data.nodeId.value);
    }
    this.getRealNodeById = function (id) {
      const device = this.cache.loaded.devices[id];
      if (id !== 255 && device && !device.data.isVirtual.value)
        return device;
      return null
    }



    function updateZWaveData() {
        if ($rootScope.$$listenerCount['configuration-commands:z-wave-data:update']) {
          $http({
            method: 'post',
            url: cfg.server_url + cfg.update_url + self.cache.updateTime,
          }).then(function (response) {
            const {updateTime, ...data} = response.data;
            self.cache.updateTime = updateTime;
            if (Object.keys(data).length) {
              const ids = new Set(Object.entries(data).map(entry => {
                self.cache.loaded = entry;
                return entry[0].split('.')[1];
              }).filter(id => !isNaN(+id)));
              $rootScope.$broadcast('configuration-commands:z-wave-data:update', {data: self.cache.loaded, ids});
            }
          });
        }
    }
    $interval(updateZWaveData, cfg.interval)
}])
