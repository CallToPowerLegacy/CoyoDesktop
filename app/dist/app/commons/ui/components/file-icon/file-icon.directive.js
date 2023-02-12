(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoFileIcon', fileIcon)
      .controller('FileIconController', FileIconController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoFileIcon:coyoFileIcon
   * @restrict 'E'
   * @element OWN
   * @scope
   *
   * @description
   * Serves icons for different file types.
   *
   * @param {object} file File, which an icon should be found to.
   */
  function fileIcon() {
    return {
      restrict: 'E',
      replace: false,
      templateUrl: 'app/commons/ui/components/file-icon/file-icon.html',
      scope: {},
      bindToController: {
        file: '<'
      },
      controller: 'FileIconController',
      controllerAs: '$ctrl'
    };
  }

  function FileIconController() {
    var vm = this;

    vm.getFileIcons = getFileIcons;

    function getFileIcons() {

      if (!vm.file) {
        return ['zmdi-coyo zmdi-coyo-file'];
      }
      if (vm.file.folder) {
        return (vm.file.appRoot) ? ['zmdi-folder-outline', 'zmdi-lock'] : ['zmdi-folder-outline'];
      } else if (vm.file.uploadFailed) {
        return ['zmdi-alert-circle-o upload-failed'];
      } else if (!vm.file.contentType) {
        return ['zmdi-coyo zmdi-coyo-file'];
      }

      // Microsoft Office document types
      if (vm.file.contentType.indexOf('officedocument') >= 0) {
        if (vm.file.contentType.indexOf('word') >= 0) {
          return ['zmdi-coyo zmdi-coyo-word'];
        }

        if (vm.file.contentType.indexOf('sheet') >= 0) {
          return ['zmdi-coyo zmdi-coyo-excel'];
        }

        if (vm.file.contentType.indexOf('presentation') >= 0) {
          return ['zmdi-coyo zmdi-coyo-powerpoint'];
        }
      }

      // Images
      if (vm.file.contentType.indexOf('image') >= 0) {
        return ['zmdi-coyo zmdi-coyo-image'];
      }

      // Videos
      if (vm.file.contentType.indexOf('video') >= 0) {
        return ['zmdi-coyo zmdi-coyo-video'];
      }

      // PDF
      if (vm.file.contentType.indexOf('pdf') >= 0) {
        return ['zmdi-coyo zmdi-coyo-pdf'];
      }

      // Plain text
      if (vm.file.contentType.indexOf('plain') >= 0) {
        return ['zmdi-coyo zmdi-coyo-text'];
      }

      // Zip
      if (vm.file.contentType.indexOf('application') >= 0) {
        if (vm.file.contentType.indexOf('zip') >= 0) {
          return ['zmdi-coyo zmdi-coyo-zip'];
        }
      }

      // Default
      return ['zmdi-coyo zmdi-coyo-file'];

    }
  }

})(angular);
