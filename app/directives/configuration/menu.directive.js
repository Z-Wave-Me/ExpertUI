angApp.directive('zWaveConfigurationMenu', ['dataHolderService', '$route', '$location',
  function (dataHolderService, $route, $location) {
  return{
    restrict: 'E',
    replace: true,
    template: `
    <div>
     <div ng-if="type === 'drop'" class="dropdown col-xs-4" style="padding-bottom: calc(var(--space) * 2); padding-left: 0; margin-left: 15px">
        <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
          <span style="padding-right: var(--space)">{{name()}}</span>
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenu" style="width: 100%"> 
          <li ng-repeat="item in deviceList track by $index" title="(#{{item.id}})   {{item.name}}"
          ng-class="{'active': item.id == param}">
            <a ng-href="#" ng-click="redirect($event, item)" 
            style="overflow: hidden; text-overflow: ellipsis;"
            >(#{{item.id}})   {{item.name}}</a>
          </li>
        </ul>
      </div>
      <ul ng-if="type === 'list'" class="dropdown-menu" style="width: 100%; display: block; position: unset"> 
          <li ng-repeat="item in deviceList track by $index" title="(#{{item.id}})   {{item.name}}"
          ng-class="{'active': item.id == param}">
            <a ng-href="#" ng-click="redirect($event, item)" 
            style="overflow: hidden; text-overflow: ellipsis;"
            >(#{{item.id}})   {{item.name}}</a>
          </li>
        </ul>
      </div>
`,
    scope: {
      type: '@'
    },
    link: function (scope, element, attrs) {
      scope.param = $route.current.params.nodeId;
      scope.redirect = function (event, node) {
        event.preventDefault();
        $location.path($location.url().replace(scope.param, node.id));
      }

      scope.deviceList = dataHolderService.deviceList();
      if (!scope.deviceList) {
        const subscription = scope.$on('configuration-data:loaded', function () {
          scope.deviceList = dataHolderService.deviceList();
          subscription();
        })
      }
      scope.name = function () {
        // console.warn(typeof scope.param);
        const item = scope.deviceList?.find(({id}) => id === +scope.param);
        if (item) {
          return `(#${item.id}) ${item.name}  `;
        }
        return '...'
      }
    }
  }
}])
