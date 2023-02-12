(function () {
  'use strict';

  angular
      .module('commons.ui')
      .directive('oyocValidateFileLibraryAppLock', ValidateFileLibararyAppLock);

  /**
   * @ngdoc directive
   * @name commons.ui.oyocValidateFileLibraryAppLock:oyocValidateFileLibraryAppLock
   * @element ANY
   * @restrict A
   *
   * @description
   * Validator for commons.ui.coyoFilePicker directive to be used in 'folder' selection mode.
   * The associated form field will be invalid if any app other than the one provided has obtained a lock
   * on the given folder.
   *
   * @requires $q
   * @required $parse
   * @required commons.resource.FolderModel
   */
  function ValidateFileLibararyAppLock($q, $parse, FolderModel) {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ctrl) {
        ctrl.$asyncValidators.appLock = function (folder) {
          var app = $parse(attrs.oyocValidateFileLibraryAppLock)(scope);
          return $q(function (resolve, reject) {
            if (folder && app.senderId) {
              FolderModel.getSettings(app.senderId, folder.id).then(function (folderSettings) {
                if (folderSettings.appLockId && folderSettings.appLockId !== app.id) {
                  reject();
                } else {
                  resolve();
                }
              });
            } else {
              resolve();
            }
          });
        };
      }
    };
  }
})();
