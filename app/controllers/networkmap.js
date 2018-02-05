/**
 * NetworkMapController
 * @author Martin Vach
 */
appController.controller('NetworkMapController', function ($scope, $interval, $filter, cfg, dataService, myCache, _) {
    $scope.networkmap = {
        ctrlNodeId: 1,
        cytoscape: {
            container: document.getElementById('cy'),
            boxSelectionEnabled: false,
            autounselectify: true,
            style: cytoscape.stylesheet()
                    .selector('node')
                    .css({
                        'content': 'data(id)'
                    })
                    .selector('edge')
                    .css({
                        'target-arrow-shape': 'triangle',
                        'width': 4,
                        'line-color': '#ddd',
                        'target-arrow-color': '#ddd',
                        'curve-style': 'bezier'
                    })
                    .selector('.highlighted')
                    .css({
                        'background-color': '#61bffc',
                        'line-color': '#61bffc',
                        'target-arrow-color': '#61bffc',
                        'transition-property': 'background-color, line-color, target-arrow-color',
                        'transition-duration': '0.5s'
                    })
                    .selector('#1')
                    .css({
                        'background-color': '#2A6496'
                    }),
            elements: {
                nodes: [],
                edges: []
            },
            layout: {
//                 name: 'cose',
//            idealEdgeLength: 100,
//            nodeOverlap: 20,
            
                name: 'breadthfirst',
                directed: true,
                // roots: '#1',
                padding: 10
            }
        }
    };

    /**
     * Load zwave API
     */
    $scope.loadZwaveApi = function () {
        dataService.loadZwaveApiData().then(function (ZWaveAPIData) {
            $scope.networkmap.cytoscape.elements = setCyElements(ZWaveAPIData);
            var cy = cytoscape($scope.networkmap.cytoscape);
        });
    };
    $scope.loadZwaveApi();

    /// --- Private functions --- ///
    /**
     * Set cytoscape elements
     * @param {type} ZWaveAPIData
     * @returns {obj}
     */
    function setCyElements(ZWaveAPIData) {
        var edges = {};
        var obj = {
            nodes: [],
            edges: []
        };
        var ctrlNodeId = ZWaveAPIData.controller.data.nodeId.value;
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {
            var neighbours = $filter('hasNode')(node.data, 'neighbours.value');

            obj.nodes.push({data: {
                    id: nodeId,
                    name: 'Device_' + nodeId
                }});
            if (nodeId != ctrlNodeId && neighbours) {
                edges[nodeId] = neighbours;

            }

        });
        obj.edges = setCyEdges(edges);
        return obj;
    }
    /**
     * Set cytoscape edges
     * @param {type} edges
     * @returns {Array}
     */
    function setCyEdges(edges) {
        var obj = [];
        var cnt = 0;
        var blackList = [];
        angular.forEach(edges, function (node, nodeId) {
            angular.forEach(node, function (v, k) {
                blackList.push(v + nodeId);
                if (blackList.indexOf(nodeId + v) === -1) {
                    obj[cnt] ={data: {
                            id: nodeId + v,
                            source: nodeId,
                            target: v.toString()
                        }};
                      cnt++;
                }

            });

        });
        return obj;
    }
});