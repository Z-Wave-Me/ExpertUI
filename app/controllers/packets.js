appController.controller('PacketsController', function ($scope, dataService, $filter, ) {
    $scope.statistics = [];
    $scope.statisticsHead = []
    $scope.stats = {}
    const TIMEOUT = 5;
    let time;

    function extractPackages(data) {
        return Object.fromEntries(Object.entries(data
            .filter(el => !el.returnRSSI)
            .reduce((acc, cur) => {
                const extract = {updateTime: cur.updateTime}
                const last = acc[cur.nodeId]?.at(-1)
                const node = +cur.nodeId
                if (last) {
                    if ((cur.updateTime - last.at(-1).updateTime) < TIMEOUT) {
                        last.push(extract)
                    } else {
                        acc[node].push([extract])
                    }
                } else {
                    acc[node] = [[extract]]
                }
                return acc
            }, {}))
            .map(([id, data]) => ([
                id,
                {period: (data.at(-1).at(0).updateTime - data.at(0).at(0).updateTime) / (data.length - 1),}
            ])))
    }

    function extractRSSI(data) {
        return Object.fromEntries(Object.entries(data
            .filter(el => !el.returnRSSI)
            .reduce((acc, cur) => {
                const rssi = cur.RSSI > 127 ? cur.RSSI - 256 : cur.RSSI;
                if ([125, 126, 127].includes(rssi) || !cur.hops)
                    return acc;
                const node = +(cur.hops.at(-1) ?? cur.nodeId);
                if (node in acc) {
                    acc[node].rssi.push(rssi);
                    if (cur.duplicate)
                        ++acc[node].duplicate;
                } else
                    acc[node] = {rssi: [rssi], duplicate: 0, explore: 0};
                if (cur.frameType === 'Explore Frame') {
                    const node = +cur.nodeId;
                    if (node in acc) {
                            ++acc[node].explore;
                    } else
                        acc[node] = {rssi: [], duplicate: 0, explore: 1};
                }
                return acc;
            }, {}))
            .map(([id, data]) => ([
                id, {
                    packetsIn: data.rssi.length,
                    rssi: data.rssi.reduce((acc, cur) => acc + cur, 0) / data.rssi.length,
                    duplicate: data.duplicate / data.rssi.length,
                    explore: data.explore / data.rssi.length
                }
            ])))
    }
    function outgoingStatistics(data) {
        return Object.fromEntries(Object.entries(data
            .filter(el => el.returnRSSI)
            .reduce((acc, cur) => {
                const node = +cur.nodeId ;
                if (!(node in acc)) {
                    acc[node] = {total: 0, delivered: 0, rerouted: 0}
                }
                if (cur.delivered)
                    ++acc[node].delivered;
                if (cur.tries > 1)
                    ++acc[node].rerouted;
                ++acc[node].total;
                return acc;
            }, {}))
            .map(([id, data]) => ([
                id,
                {
                    packetsOut: data.total,
                    delivered: data.delivered / data.total,
                    rerouted: data.rerouted/ data.total,
                }
            ])))
    }
    (function () {
        Promise.all([ dataService.getApi('packet_log', '', true), dataService.loadZwaveApiData()])
            .then(([response, ZWaveAPIData]) => {
                return [response.data.data, ZWaveAPIData.devices]
            }).then(function ([data, devices]) {
            time = performance.now()
            $scope.stats.packetsNum = data.length;
            $scope.stats.gatheringPeriod = ((data.at(-1).updateTime - data.at(0).updateTime) / 60 / 60).toFixed(0)
            const packages  =  extractPackages(data);
            const outgoing = outgoingStatistics(data);
            const rssi =  extractRSSI(data);
            $scope.statistics = Object.entries(packages).map(([id, pack]) => ({
                id: +id,
                name:  $filter('deviceName')(id, devices[id]),
                ...rssi[id],
                ...outgoing[id],
                ...pack
            }))
            $scope.statisticsHead = Object.keys($scope.statistics.at(0) ?? {})
        })
            .catch(console.error)
            // .finally(() => {
            //     console.log('Used ', (performance.now() - time).toFixed(2), ' ms')
            // })
    })()
})
