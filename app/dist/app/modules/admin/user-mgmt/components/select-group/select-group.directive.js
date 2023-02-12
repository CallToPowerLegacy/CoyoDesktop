(function (angular) {
  'use strict';

  angular.module('coyo.admin.userManagement')
      .directive('coyoSelectGroups', selectGroups);

  /**
   * @ngdoc directive
   * @name coyo.admin.userManagement.coyoSelectGroups:coyoSelectGroups
   * @restrict 'E'
   * @scope
   *
   * @description
   * Renders a (user) group multi select widget.
   *
   * @requires components.ui.selectFactoryModel
   * @requires coyo.domain.GroupModel
   * @requires Pageable
   *
   * @param {array} ng-model (required) groups (coyo.domain.GroupModel)
   * @param {string} placeholder (optional) translation key for the input field placeholder
   */
  function selectGroups(selectFactoryModel, GroupModel, Pageable) {
    return selectFactoryModel({
      refresh: refresh,
      multiple: true,
      minSelectableItems: 6,
      mobile: true,
      mobileIcon: 'zmdi-lock',
      mobileModalTitle: 'ADMIN.USER_MGMT.GROUPS.SELECT_GROUPS.MOBILE',
      mobileAddText: 'ADMIN.USER_MGMT.GROUPS.OPTIONS.ADD.MOBILE',
      emptyText: 'ADMIN.USER_MGMT.GROUPS.SELECT_GROUPS.EMPTY',
      pageSize: 50
    });

    function refresh(pageable, search) {
      return GroupModel.pagedQuery(new Pageable(pageable.page, pageable.size), {'displayName': search, 'status': 'ACTIVE'})
          .then(function (response) {
            return angular.extend(response.content, {
              meta: {
                last: response.last,
                number: response.number
              }
            });
          });
    }
  }

})(angular);
