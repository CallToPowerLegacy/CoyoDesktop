(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('WorkspaceModel', WorkspaceModel);

  /**
   * @ngdoc service
   * @name coyo.domain.WorkspaceModel
   *
   * @description
   * Provides the Coyo workspace model.
   *
   * @requires $httpParamSerializer
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   * @requires commons.resource.Page
   */
  function WorkspaceModel($httpParamSerializer, restResourceFactory, coyoEndpoints, Page) {
    var WorkspaceModel = restResourceFactory({
      url: coyoEndpoints.workspace.workspaces
    });

    function _getWorkspaceMembers(resource, status, pageable) {
      var url = resource.$url(status);
      return WorkspaceModel.$get(url, pageable.getParams()).then(function (response) {
        return new Page(response, pageable.getParams(), {
          url: url
        });
      });
    }

    // class members
    angular.extend(WorkspaceModel, {

      /**
       * @ngdoc function
       * @name coyo.domain.WorkspaceModel#searchWithFilter
       * @methodOf coyo.domain.WorkspaceModel
       *
       * @description
       * Workspace elastic search with filter.
       *
       * @param {string} term search term
       * @param {object} pageable The paging information. If not set an offset of 0 and a page size of 20 will be used.
       * @param {object} [filters] search filters
       * @param {string} [searchFields] list of fields to search in
       * @param {object} [aggregations] search aggregations
       * @param {boolean} [inclUnassignedProtected=false] whether to include unassigned protected workspaces
       *
       * @returns {promise} An $http promise
       */
      searchWithFilter: function (term, pageable, filters, searchFields, aggregations, inclUnassignedProtected) {
        var url = WorkspaceModel.$url();
        var params = angular.extend({
          term: term ? term.toLowerCase() : undefined,
          filters: filters ? $httpParamSerializer(filters) : undefined,
          searchFields: searchFields ? searchFields.join(',') : undefined,
          aggregations: aggregations ? $httpParamSerializer(aggregations) : undefined,
          inclUnassignedProtected: !!inclUnassignedProtected
        }, pageable.getParams());
        return WorkspaceModel.$get(url, params).then(function (response) {
          return new Page(response, params, {
            url: url,
            resultMapper: function (item) {
              return new WorkspaceModel(item);
            }
          });
        });
      }
    });

    // instance members
    angular.extend(WorkspaceModel.prototype, {

      /**
       * @ngdoc function
       * @name coyo.domain.WorkspaceModel#getMembers
       * @methodOf coyo.domain.WorkspaceModel
       *
       * @description
       * Returns the members of a workspace.
       *
       * @param {object=} pageable
       * The paging information. If not set an offset of 0 and a page size of 20 will be used.
       *
       * @returns {promise} An $http promise
       */
      getMembers: function (pageable) {
        return _getWorkspaceMembers(this, 'members', pageable);
      },

      /**
       * @ngdoc function
       * @name coyo.domain.WorkspaceModel#getInvited
       * @methodOf coyo.domain.WorkspaceModel
       *
       * @description
       * Returns the invited users of a workspace.
       *
       * @param {object=} pageable
       * The paging information. If not set an offset of 0 and a page size of 20 will be used.
       *
       * @returns {promise} An $http promise
       */
      getInvited: function (pageable) {
        return _getWorkspaceMembers(this, 'invited', pageable);
      },

      /**
       * @ngdoc function
       * @name coyo.domain.WorkspaceModel#getRequested
       * @methodOf coyo.domain.WorkspaceModel
       *
       * @description
       * Returns the list of users who requested to join the workspace.
       *
       * @param {object=} pageable
       * The paging information. If not set an offset of 0 and a page size of 20 will be used.
       *
       * @returns {promise} An $http promise
       */
      getRequested: function (pageable) {
        return _getWorkspaceMembers(this, 'requested', pageable);
      },

      /**
       * @ngdoc function
       * @name coyo.domain.WorkspaceModel#countRequested
       * @methodOf coyo.domain.WorkspaceModel
       *
       * @description
       * Returns the count of users who requested to join the workspace.
       *
       * @returns {promise} An $http promise
       */
      countRequested: function () {
        return WorkspaceModel.$get(this.$url('requested/count'));
      },

      /**
       * @ngdoc function
       * @name coyo.domain.WorkspaceModel#promote
       * @methodOf coyo.domain.WorkspaceModel
       *
       * @description
       * Promotes the given user from Member to Admin
       *
       * @returns {promise} An $http promise
       */
      promote: function (userId) {
        return WorkspaceModel.$put(this.$url('users/' + userId + '/promote'));
      },

      /**
       * @ngdoc function
       * @name coyo.domain.WorkspaceModel#demote
       * @methodOf coyo.domain.WorkspaceModel
       *
       * @description
       * Demotes the given user from Admin to Member
       *
       * @returns {promise} An $http promise
       */
      demote: function (userId) {
        return WorkspaceModel.$put(this.$url('users/' + userId + '/demote'));
      },

      /**
       * @ngdoc function
       * @name coyo.domain.WorkspaceModel#join
       * @methodOf coyo.domain.WorkspaceModel
       *
       * @description
       * Joins a workspace.
       *
       * @returns {promise} An $http promise
       */
      join: function () {
        return WorkspaceModel.$put(this.$url('users/join'));
      },

      /**
       * @ngdoc function
       * @name coyo.domain.WorkspaceModel#leave
       * @methodOf coyo.domain.WorkspaceModel
       *
       * @description
       * Leaves a workspace.
       *
       * @returns {promise} An $http promise
       */
      leave: function () {
        return WorkspaceModel.$put(this.$url('users/leave'));
      },

      /**
       * @ngdoc function
       * @name coyo.domain.WorkspaceModel#inviteAdmins
       * @methodOf coyo.domain.WorkspaceModel
       *
       * @description
       * Invites additional admins to a workspace.
       *
       * @param {array} userAndGroupIds.userIds
       * An array of string with user ids to invite as admins. Can be empty but not null.
       *
       * @param {array} userAndGroupIds.groupIds
       * An array of string with group ids. All users belonging to those groups are invited as admins. Can be empty
       * but not null.
       *
       * @returns {promise} An $http promise
       */
      inviteAdmins: function (userAndGroupIds) {
        return WorkspaceModel.$put(this.$url('users/invite/admin'), userAndGroupIds);
      },

      /**
       * @ngdoc function
       * @name coyo.domain.WorkspaceModel#inviteMembers
       * @methodOf coyo.domain.WorkspaceModel
       *
       * @description
       * Invites additional members to a workspace. Users can also invited via their group.
       *
       * @param {array} userAndGroupIds.userIds
       * An array of string with user ids to invite. Can be empty but not null.
       *
       * @param {array} userAndGroupIds.groupIds
       * An array of string with group ids. All users belonging to those groups are invited. Can be empty but not null.
       *
       * @returns {promise} An $http promise
       */
      inviteMembers: function (userAndGroupIds) {
        return WorkspaceModel.$put(this.$url('users/invite/user'), userAndGroupIds);
      },

      /**
       * @ngdoc function
       * @name coyo.domain.WorkspaceModel#approveMember
       * @methodOf coyo.domain.WorkspaceModel
       *
       * @description
       * Approves a member for a workspace.
       *
       * @returns {promise} An $http promise
       */
      approveMember: function (userId) {
        return WorkspaceModel.$put(this.$url('users/' + userId + '/approve'));
      },

      /**
       * @ngdoc function
       * @name coyo.domain.WorkspaceModel#removeMember
       * @methodOf coyo.domain.WorkspaceModel
       *
       * @description
       * Removes a member from a workspace.
       *
       * @returns {promise} An $http promise
       */
      removeMember: function (userId) {
        return WorkspaceModel.$put(this.$url('users/' + userId + '/remove'));
      }
    });

    return WorkspaceModel;
  }

})(angular);
