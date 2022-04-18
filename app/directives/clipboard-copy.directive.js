angApp.directive('zWaveCommandsClipboard', function () {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      setFn: '&'
    },
    template: `<div class="highlight-command">
                <i class="far fa-copy clickable fa-lg" style="align-self: center;" ng-click="copy()"></i>
                <span ng-transclude class="enable-user-select"></span>
               </div>`,
    controller: ['$scope','$element', function ($scope, $element) {
      function findParent() {
        let s = $scope;
        while (s && s.$parent) {
          if ( '_t' in s) {
            return s._t;
          }
          s = s.$parent;
        }
        return function (text) {
          return text;
        }
      }
      $scope.updateMap = function() {
        $scope.copy();
      }
      $scope.setFn({theDirFn: $scope.updateMap});
      const _t = findParent();
      function selectText(container) {
        const range = document.createRange();
        range.selectNodeContents(container);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
      }
      $scope.copy = function () {
        alertify.set('notifier', 'position', 'top-right');
        try {
          selectText($element.find('.enable-user-select')[0])
          document.execCommand('copy');
          alertify.notify(_t('copy_to_clipboard_success'), 'success', 5);
        } catch (_) {
          alertify.notify(_t('copy_to_clipboard_error'), 'error', 5);
        } finally {
          window.getSelection().removeAllRanges();
        }
      }
    }]
  }
})

angApp.directive('zWaveClipboard', function () {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: `<div class="highlight-command"><<i class="far fa-copy clickable fa-lg" style="align-self: center;" ng-click="copy()"></i>><span ng-transclude class="enable-user-select"></span></div>`,
    controller: ['$scope','$element', function ($scope, $element) {
      function findParent() {
        let s = $scope;
        while (s && s.$parent) {
          if ( '_t' in s) {
            return s._t;
          }
          s = s.$parent;
        }
        return function (text) {
          return text;
        }
      }
      const _t = findParent();
      function selectText(container) {
        const range = document.createRange();
        range.selectNodeContents(container);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
      }
      $scope.copy = function () {
        alertify.set('notifier', 'position', 'top-right');
        try {
          selectText($element.find('.enable-user-select')[0])
          document.execCommand('copy');
          alertify.notify(_t('copy_to_clipboard_success'), 'success', 5);

        } catch (_) {
          alertify.notify(_t('copy_to_clipboard_error'), 'error', 5);
        } finally {
          window.getSelection().removeAllRanges();
        }
      }
    }]
  }
})

angApp.directive('zWaveClipboardMini', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      text: '='
    },
    template: `<i class="far fa-copy clickable" ng-click="copy()"></i>`,
    controller: ['$scope','$element', function ($scope) {
      function findParent() {
        let s = $scope;
        while (s && s.$parent) {
          if ( '_t' in s) {
            return s._t;
          }
          s = s.$parent;
        }
        return function (text) {
          return text;
        }
      }
      const _t = findParent();
      function selectText(container) {
        const range = document.createRange();
        range.selectNodeContents(container);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
      }
      $scope.copy = function () {
        alertify.set('notifier', 'position', 'top-right');
        const element = angular.element('<span>' + $scope.text + '</span>')[0];
        try {
          document.body.append(element);
          selectText(element);
          document.execCommand('copy');
          alertify.notify(_t('copy_to_clipboard_success'), 'success', 5);
        } catch (_) {
          alertify.notify(_t('copy_to_clipboard_error'), 'error', 5);
        } finally {
          window.getSelection().removeAllRanges();
          element.remove();
        }
      }
    }]
  }
})
