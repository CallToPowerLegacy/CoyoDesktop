(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.downloads')
      .directive('coyoDownloadsWidget', downloadsWidget)
      .controller('DownloadsWidgetController', DownloadsWidgetController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.downloads:coyoDownloadsWidget
   * @element ANY
   * @restrict E
   * @scope
   *
   * @description
   * Renders the widget to show a list of download files
   *
   * @param {object} widget
   * The widget configuration
   */
  function downloadsWidget() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/downloads/downloads-widget.html',
      scope: {},
      bindToController: {
        widget: '<',
        editMode: '<'
      },
      controller: 'DownloadsWidgetController',
      controllerAs: '$ctrl'
    };
  }

  function DownloadsWidgetController($scope, DocumentModel, errorService, FileModel, widgetStatusService, backendUrlService) {
    var vm = this;
    vm.loading = true;
    var numberOfFilesToBeChecked = 0;

    vm.getDownloadUrl = getDownloadUrl;

    widgetStatusService.refreshOnSettingsChange($scope);

    function getDownloadUrl(senderId, id) {
      // Deliver false as id in response body instead of an empty fileId,
      // because otherwise it will get all files of the sender
      var fileId = id ? id : false;
      return FileModel.get({senderId: senderId, id: fileId}).then(function () {
        return backendUrlService.getUrl() + DocumentModel.$url({
          senderId: senderId,
          id: fileId
        });
      });
    }

    function _getFile(element, index, array) {
      // check whether file can be load
      FileModel.get({senderId: element.senderId, id: element.id}).then(function () {
        --numberOfFilesToBeChecked;
        vm.widget.settings._files.push(array[index]);
        if (numberOfFilesToBeChecked <= 0) {
          vm.loading = false;
        }
      }).catch(function (errorResponse) {
        --numberOfFilesToBeChecked;
        if (errorResponse.status === 404) {
          errorService.suppressNotification(errorResponse);
        }
        if (numberOfFilesToBeChecked <= 0) {
          vm.loading = false;
        }
      });
    }

    (function _init() {
      if (vm.widget.settings._files) {
        var arrayFiles = vm.widget.settings._files;
        numberOfFilesToBeChecked = arrayFiles.length;
        vm.widget.settings._files = [];
        _.forEach(arrayFiles, _getFile);
      } else {
        vm.loading = false;
      }
    })();
  }
})(angular);
