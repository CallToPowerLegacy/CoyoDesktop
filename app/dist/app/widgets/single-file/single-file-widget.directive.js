(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.singlefile')
      .directive('coyoSingleFileWidget', singleFileWidget)
      .controller('SingleFileWidgetController', SingleFileWidgetController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.singlefile:coyoSingleFileWidget
   * @restrict E
   * @scope
   *
   * @description
   * Renders the widget to show a single file
   *
   * @param {object} widget
   * The widget configuration
   */
  function singleFileWidget() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/single-file/single-file-widget.html',
      scope: {},
      bindToController: {
        widget: '=',
        editMode: '<'
      },
      controller: 'SingleFileWidgetController',
      controllerAs: '$ctrl'
    };
  }

  function SingleFileWidgetController($scope, $filter, $q, DocumentModel, FileModel, SenderModel, backendUrlService,
                                      fileDetailsModalService, widgetStatusService, coyoEndpoints) {
    var vm = this;
    vm.showDetails = showDetails;
    vm.loadFile = loadFile;
    vm.previewUrl = coyoEndpoints.sender.preview;

    widgetStatusService.refreshOnSettingsChange($scope);

    // Load file information
    function loadFile() {
      var senderId = vm.widget.settings._senderId;
      var fileId = vm.widget.settings._fileId;
      return $q.all([SenderModel.get(senderId), FileModel.get({senderId: senderId, id: fileId})]).then(function (results) {
        vm.sender = results[0];
        vm.file = results[1];
        vm.downloadLink = _getDownloadUrl(senderId, fileId);
        vm.fileTypeText = $filter('fileTypeName')(vm.file.contentType);
        return results;
      }).finally(function () {
        vm.lastUpdate = new Date().getTime();
      });
    }

    // show file details
    function showDetails() {
      fileDetailsModalService.open(vm.widget.settings._senderId, vm.widget.settings._fileId);
    }

    // Get download-url
    function _getDownloadUrl(senderId, fileId) {
      return backendUrlService.getUrl() + DocumentModel.$url({
        senderId: senderId,
        id: fileId
      });
    }
  }
})(angular);
