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
                    }),
            elements: {
                nodes: [
//                    {data: {id: '1'}},
//                    {data: {id: '2'}},
//                    {data: {id: '3'}},
//                    {data: {id: '7'}},
//                    {data: {id: '8'}},
//                    {data: {id: '9'}}
                ],
                edges: [
                    {data: {id: '21', source: '2', target: '1'}},
                    {data: {id: '31', source: '3', target: '1'}},
                    {data: {id: '71', source: '7', target: '1'}},
                    {data: {id: '81', source: '8', target: '1'}},
                    {data: {id: '91', source: '9', target: '1'}},
                    {data: {id: '78', source: '7', target: '8'}},
                    {data: {id: '89', source: '8', target: '9'}},
                    {data: {id: '38', source: '3', target: '8'}},
                    {data: {id: '92', source: '9', target: '2'}},
                    //{data: {id: '19', source: '1', target: '9'}},
                ]
//                   nodes: [
//                    {data: {id: '1'}},
//                    {data: {id: 'b'}},
//                    {data: {id: 'c'}}
//                ],
//                edges: [
//                    {data: {id: '1"c', source: '1', target: 'c'}},
//                    {data: {id: '1b', source: '1', target: 'b'}},
//                    {data: {id: 'b', source: 'b', target: 'c'}}
//                ]

//                nodes: [
//                    {data: {id: 'a'}},
//                    {data: {id: 'b'}},
//                    {data: {id: 'c'}},
//                    {data: {id: 'd'}},
//                    {data: {id: 'e'}}
//                ],
//                edges: [
//                    {data: {id: 'a"e', weight: 1, source: 'a', target: 'e'}},
//                    {data: {id: 'ab', weight: 3, source: 'a', target: 'b'}},
//                    {data: {id: 'be', weight: 4, source: 'b', target: 'e'}},
//                    {data: {id: 'bc', weight: 5, source: 'b', target: 'c'}},
//                    {data: {id: 'ce', weight: 6, source: 'c', target: 'e'}},
//                    {data: {id: 'cd', weight: 2, source: 'c', target: 'd'}},
//                    {data: {id: 'de', weight: 7, source: 'd', target: 'e'}}
//                ]
            },
            layout: {
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
            $scope.networkmap.cytoscape.elements = getNodes(ZWaveAPIData);
            var cy = cytoscape($scope.networkmap.cytoscape);
        }, function (error) {
            alertify.alertError($scope._t('error_load_data'));
            return;
        });
    };
    $scope.loadZwaveApi();

    /// --- Private functions --- ///
    function getNodes(ZWaveAPIData) {
        //var nodes = [];
        var edges = {};
        var obj = {
            nodes: [],
            edges: [
                {data: {id: '21', source: '2', target: '1'}},
                {data: {id: '31', source: '3', target: '1'}},
                {data: {id: '71', source: '7', target: '1'}},
                {data: {id: '81', source: '8', target: '1'}},
                {data: {id: '91', source: '9', target: '1'}},
                {data: {id: '78', source: '7', target: '8'}},
                {data: {id: '89', source: '8', target: '9'}},
                {data: {id: '38', source: '3', target: '8'}},
                {data: {id: '92', source: '9', target: '2'}},
            ]
        };
        var ctrlNodeId = ZWaveAPIData.controller.data.nodeId.value;
        angular.forEach(ZWaveAPIData.devices, function (node, nodeId) {
            var neighbours = $filter('hasNode')(node.data, 'neighbours.value');

            obj.nodes.push({data: {
                    id: nodeId
                }});
            if (nodeId != ctrlNodeId && neighbours) {
                edges[nodeId] = neighbours;
                //console.log(nodeId, ': ', $filter('hasNode')(node.data, 'neighbours.value'))
                //etEdges(neighbours,nodeId)
               //angular.extend(obj.edges, getEdges(neighbours,nodeId));
                
            }

        });
        //console.log(edges)
        obj.edges = getEdges(edges);
        return obj;
    }
    function getEdges(edges) {
       var obj = [];
         var cnt = 0;
        angular.forEach(edges, function (node, nodeId) {
           
             angular.forEach(node, function (v, k) {
                 //console.log('ID: ',nodeId + v)
                    obj[cnt] = {data: {
                            id: nodeId + v,
                            source:  nodeId,
                            target: v.toString()
                        }};
                    cnt++;
                     //console.log(obj[k].data)

                });
//                    obj.push({data: {
//                            id: k + v,
//                            source: k,
//                            target: v
//                        }});
                     //console.log(obj[k].data)

                });
              console.log(obj)
             
              var obj_ =  [
                {data: {id: '21', source: '2', target: '1'}},
                {data: {id: '31', source: '3', target: '1'}},
                {data: {id: '71', source: '7', target: '1'}},
                {data: {id: '81', source: '8', target: '1'}},
                {data: {id: '91', source: '9', target: '1'}},
                {data: {id: '78', source: '7', target: '8'}},
                {data: {id: '89', source: '8', target: '9'}},
                {data: {id: '38', source: '3', target: '8'}},
                {data: {id: '92', source: '9', target: '2'}},
            ];
             console.log(obj)
         return obj;
       
    }




});