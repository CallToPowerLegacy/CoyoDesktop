(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoFileLibraryTrigger', CoyoFileLibraryTrigger);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoFileLibraryTrigger:coyoFileLibraryTrigger
   * @scope
   * @restrict 'A'
   * @element ANY
   *
   * @description
   * Adds a click listener which opens the file library for browsing and uploading files in a modal. The upload mode is
   * always set to 'multiple' files upload.
   *
   * @param {object=} sender
   * A sender can be passed along with this directive. In this case the file library is opened with this sender being
   * the active view.
   *
   * @requires commons.ui.fileLibraryModalService
   * @requires commons.auth.authService
   */
  function CoyoFileLibraryTrigger(fileLibraryModalService, authService) {
    return {
      restrict: 'A',
      scope: {
        sender: '<?'
      },
      link: function (scope, element) {
        var _onClick = function () {
          fileLibraryModalService.open(scope.sender, {
            uploadMultiple: true
          }, {});
        };

        authService.onGlobalPermissions('ACCESS_FILES', function (permission) {
          if (permission) {
            element.on('click', _onClick);
          } else {
            element.off('click', _onClick);
          }
          element[permission ? 'removeClass' : 'addClass']('global-permissions-hidden');
        }, true);
      }
    };
  }

})(angular);
