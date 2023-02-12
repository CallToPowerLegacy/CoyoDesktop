(function (angular) {
  'use strict';

  angular.module('coyo.admin.userManagement')
      .directive('coyoSelectRoles', selectRoles);

  /**
   * @ngdoc directive
   * @name coyo.admin.userManagement.coyoSelectRoles:coyoSelectRoles
   * @restrict 'E'
   * @scope
   *
   * @description
   * Renders a (user) role multi select widget.
   *
   * @requires components.ui.selectFactoryModel
   * @requires coyo.domain.RoleModel
   * @requires Pageable
   *
   * @param {array} ng-model (required) roles (coyo.domain.RoleModel)
   * @param {string} placeholder (optional) translation key for the input field placeholder
   */
  function selectRoles(selectFactoryModel, RoleModel, Pageable) {
    return selectFactoryModel({
      refresh: refresh,
      multiple: true,
      minSelectableItems: 6,
      mobile: true,
      mobileIcon: 'zmdi-lock',
      mobileModalTitle: 'ADMIN.USER_MGMT.ROLES.SELECT_ROLES.MOBILE',
      mobileAddText: 'ADMIN.USER_MGMT.ROLES.OPTIONS.ADD.MOBILE',
      emptyText: 'ADMIN.USER_MGMT.ROLES.SELECT_ROLES.EMPTY',
      pageSize: 50
    });

    function refresh(pageable, search) {
      return RoleModel.pagedQuery(new Pageable(pageable.page, pageable.size), {'displayName': search})
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
