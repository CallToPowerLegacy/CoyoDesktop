(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.userDirectories')
      .directive('coyoSelectUserDirectory', selectUserDirectory);
  /**
   * @ngdoc directive
   * @name coyo.admin.userDirectories.coyoSelectUserDirectory:coyoSelectUserDirectory
   * @element ANY
   * @restrict E
   * @scope
   *
   * @description
   * Renders a UI select field for a user directory.
   *
   */
  function selectUserDirectory(selectFactoryModel, UserDirectoryModel, userDirectoryTypeRegistry, $translate, $filter) {

    var userDirectories = null;

    return selectFactoryModel({
      refresh: _refresh,
      sublines: ['type'],
      emptyText: 'ADMIN.USER_DIRECTORIES.NO_USER_DIRECTORIES_FOUND'
    });

    function _refresh(pageable, search) {
      if (userDirectories === null) {
        userDirectories = UserDirectoryModel.query().then(function (response) {
          return _.map(response, function (userDirectory) {
            var type = userDirectoryTypeRegistry.get(userDirectory.type);
            return {
              id: userDirectory.id,
              displayName: userDirectory.name,
              type: $translate.instant(type.name)
            };
          });
        });
      }

      return userDirectories.then(function (data) {
        var filtered = search ? $filter('filter')(data, function (item) {
          return item.displayName.toLowerCase().includes(search.toLowerCase()) ||
              item.type.toLowerCase().includes(search.toLowerCase());
        }) : data;
        return angular.extend(filtered, {
          meta: {
            last: true,
            number: 0
          }
        });
      });
    }
  }

})(angular);
