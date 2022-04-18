const dataHolderModule = angular.module('dataHolderModule', ['appFactory']);


dataHolderModule.service('dataHolderService',['dataService', 'deviceService', function (dataService, deviceService) {
    this.devices = {};
    this.controller = {};
    this.update = function () {
      return dataService.loadZwaveApiData().then(ZWaveAPIData => {
        this.devices = ZWaveAPIData.devices
        this.controller = ZWaveAPIData.controller.data;
        return ZWaveAPIData;
      });
    }
    this.loadJoined = function () {
      return dataService.loadJoinedZwaveData();
    }

    this.deviceList = function () {
      return deviceService.getNavConfig(this.devices, this.controller.nodeId.value);
    }
    this.getRealNodeById = function (id) {
      const device = this.devices[id];
      if (id !== 255 && device && !device.data.isVirtual.value)
        return device;
      return null
    }
}])
