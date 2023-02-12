(function (angular) {
  'use strict';

  angular.module('commons.ui')
      .factory('userChooserModalService', userChooserModalService)
      .controller('UserChooserModalController', UserChooserModalController);

  /**
   * @ngdoc service
   * @name commons.ui.userChooserModalService
   *
   * @description
   * This service provides a method to open a modal in which users and/or groups can be selected. In order to find the
   * user/group to select, a user can filter and text search for users/groups in the system. Selected users/groups are
   * returned in a result object containing a 'users' array and a 'groups' array.
   *
   * @requires modalService
   * @requires $q
   * @requires $uibModalInstance
   * @requires UserModel
   * @requires GroupModel
   * @requires Pageable
   * @requires users
   * @requires groups
   * @requires settings
   */
  function userChooserModalService(modalService) {
    return {
      open: open
    };

    /**
     * @ngdoc method
     * @name commons.ui.userChooserModalService#open
     * @methodOf commons.ui.userChooserModalService
     *
     * @description
     * Opens the chooser modal.
     *
     * @param {object} ngModel The model of already selected user's and the object to store the selected user's in. You
     * have to pass user IDs as ngModel into the service.
     * @param {object} settings The settings of the user chooser.
     * @param {boolean} [settings.usersOnly=false] Set this parameter to only select users in the chooser.
     * @param {boolean} [settings.groupsOnly=false] Set this parameter to only select groups in the chooser.
     * @param {boolean} [settings.usersField=userIds|users] The field name to store the selected users/userIDs in.
     * @param {boolean} [settings.groupsField=groupIds|groups] The field name to store the selected groups/groupIDs in.
     * @param {boolean} [settings.single=false] Set this parameter to force that users can select only one user/group
     * @returns {object} A result object containing the selected users and groups.
     */
    function open(ngModel, settings) {
      var fullSettings = angular.extend({
        usersOnly: false,
        groupsOnly: false,
        usersField: 'userIds',
        groupsField: 'groupIds',
        single: false
      }, settings);
      return modalService.open({
        size: 'lg',
        resolve: {
          users: /*@ngInject*/ function () {
            var users = _.get(ngModel, fullSettings.usersField) || [];
            return users;
          },
          groups: /*@ngInject*/ function (GroupModel) {
            var groups = _.get(ngModel, fullSettings.groupsField) || [];
            return GroupModel.query({groupIds: groups.join(), status: 'ACTIVE'});
          },
          profileFieldGroups: /*@ngInject*/ function (profileFieldsService) {
            return profileFieldsService.getGroups();
          },
          settings: function () {
            return fullSettings;
          }
        },
        templateUrl: 'app/commons/ui/components/user-chooser/user-chooser-modal.html',
        controller: 'UserChooserModalController'
      }).result.then(function (selection) {
        var result = {};
        if (!fullSettings.groupsOnly) {
          result[fullSettings.usersField] = selection.users;
        }
        if (!fullSettings.usersOnly) {
          result[fullSettings.groupsField] = selection.groups;
        }
        return result;
      });
    }
  }

  function UserChooserModalController($q, $uibModalInstance, UserModel, GroupModel, Pageable, users, groups, settings, profileFieldGroups) {
    var vm = this;

    var smallPageSize = 36;
    var bigPageSize = 72;

    vm.title = 'USER_CHOOSER.TITLE';
    vm.tab = (users.length || groups.length) ? 0 : 1;
    vm.settings = settings;

    vm.users = {
      list: [],
      term: '',
      page: {},
      loading: false,
      filters: [],
      aggregations: []
    };
    vm.groups = {
      list: [],
      term: '',
      page: {},
      loading: false
    };

    vm.save = save;

    vm.loadUsers = loadUsers;
    vm.countUsers = _.partial(_count, 'users');
    vm.searchUsers = _.partial(_search, 'users', loadUsers);
    vm.toggleSelectionUser = _.partial(_toggleSelection, 'users');
    vm.loadNextSelectedPage = loadNextSelectedPage;
    vm.canLoadMoreSelected = false;
    vm.isFilteredUser = _.partial(_isFiltered, 'users');
    vm.toggleFilterUser = _.partial(_toggleFilter, 'users', loadUsers);
    vm.userSelectionType = _.partial(_getSelectionType, 'users');

    vm.loadGroups = loadGroups;
    vm.countGroups = _.partial(_count, 'groups');
    vm.searchGroups = _.partial(_search, 'groups', loadGroups);
    vm.toggleSelectionGroup = _.partial(_toggleSelection, 'groups');
    vm.groupSelectionType = _.partial(_getSelectionType, 'groups');

    // ----------

    /**
     * Closes this modal and returns the current selection.
     */
    function save() {
      $uibModalInstance.close({
        users: vm.selection.users.ids,
        groups: vm.selection.groups.ids
      });
    }

    /**
     * Loads the next page of users.
     *
     * @param {boolean} [reset=false] 'true' if the current list of users should be reset.
     * @returns {promise} An $http promise.
     */
    function loadUsers(reset) {
      if (vm.users.loading) {
        return $q.reject();
      }

      if (reset === true) {
        vm.users.page = {};
        vm.users.list = [];
      }

      if (!vm.users.page || !vm.users.page.last) {
        vm.users.loading = true;
        var aggregations = {department: 5, location: 5};
        var searchFields = ['displayName', 'properties.department', 'properties.location'];
        var pageable = new Pageable((vm.users.page ? vm.users.page.number + 1 : 0), smallPageSize, 'lastname.sort,firstname.sort');
        var filters = {};
        _.forEach(vm.users.filters, function (filter) {
          if (!filters[filter.field]) {
            filters[filter.field] = [];
          }
          filters[filter.field].push(filter.key);
        });

        return UserModel.searchWithFilter(vm.users.term, pageable, filters, searchFields, aggregations).then(function (result) {
          vm.users.page = result;
          vm.users.list = vm.users.list.concat(result.content);
          vm.users.aggregations = {
            department: _.sortBy(_.get(result.aggregations, 'department', []), 'key'),
            location: _.sortBy(_.get(result.aggregations, 'location', []), 'key')
          };
        }).finally(function () {
          vm.users.loading = false;
        });
      }

      return $q.reject();
    }

    /**
     * Loads the next page of groups.
     *
     * @param {boolean} [reset=false] 'true' if the current list of groups should be reset.
     * @returns {promise} An $http promise.
     */
    function loadGroups(reset) {
      if (vm.groups.loading) {
        return $q.reject();
      }

      if (reset === true) {
        vm.groups.page = {};
        vm.groups.list = [];
      }

      if (!vm.groups.page || !vm.groups.page.last) {
        vm.groups.loading = true;
        var status = 'ACTIVE';
        var pageable = new Pageable((vm.groups.page ? vm.groups.page.number + 1 : 0), smallPageSize, 'displayName');
        return GroupModel.search(vm.groups.term, status, pageable).then(function (result) {
          vm.groups.page = result;
          vm.groups.list = vm.groups.list.concat(result.content);
        }).finally(function () {
          vm.groups.loading = false;
        });
      }

      return $q.reject();
    }

    // ----------

    /**
     * Returns the number of total items available for the current term and filters.
     *
     * @param {string} data The data store to be used, either "users" or "groups".
     * @returns {number} The number of total items or '0' if none.
     * @private
     */
    function _count(data) {
      return vm[data].page.totalElements || 0;
    }

    /**
     * Resets the current results and searches for items with the given criteria (search term and selected filters).
     *
     * @param {string} data The data store to be used, either "users" or "groups".
     * @param {function} callback The callback to perform the actual search operation.
     * @param {string} term The search term to use for the search. Items are always searched for by their display name.
     * If no term is set, all items are returned.
     * @private
     */
    function _search(data, callback, term) {
      vm[data].term = term;
      callback(true);
    }

    /**
     * Checks whether an item is selected.
     *
     * @param {string} data The data store to be used, either "users" or "groups".
     * @param {object} item The item to be checked. The item must have a property 'id'.
     * @returns {boolean} 'true' if the passed item is selected.
     * @private
     */
    function _isSelected(data, item) {
      return _.includes(vm.selection[data].ids, item.id);
    }

    function _getSelectionType(data, item) {
      if (_.some(vm.selection[data].newly, {id: item.id})) {
        return 'NEW';
      }
      if (_.includes(vm[data].existingIds, item.id)) {
        return _isSelected(data, item) ? 'EXISTING' : 'REMOVED';
      }
      return 'NONE';
    }

    /**
     * Toggle an items's selection state by pushing it into an array of selections or removing the item if already
     * contained.
     *
     * @param {string} data The data store to be used, either "users" or "groups".
     * @param {object} item The item which state should be toggled. The item must have a property 'id'.
     * @private
     */
    function _toggleSelection(data, item) {
      if (_isSelected(data, item)) {
        _.pull(vm.selection[data].ids, item.id);
      } else if (vm.settings.single) {
        _initSelection();
        vm.selection[data].ids.push(item.id);
      } else {
        vm.selection[data].ids.push(item.id);
      }

      if (!_.includes(vm[data].existingIds, item.id)) {
        if (_.some(vm.selection[data].newly, {id: item.id})) {
          _.remove(vm.selection[data].newly, {id: item.id});
        } else {
          vm.selection[data].newly.push(item);
        }
      }
    }

    /**
     * Checks whether a filter is selected.
     *
     * @param {string} data The data store to be used, either "users" or "groups".
     * @param {string} field The field / category of the filter, e.g. "department". Must not be empty.
     * @param {object} filter The filter object that contains the value as "key" property, e.g. "IT". Must not be empty.
     * @returns {boolean} 'true' if the filter is currently selected.
     * @private
     */
    function _isFiltered(data, field, filter) {
      return _.some(vm[data].filters, {field: field, key: filter.key});
    }

    /**
     * Toggles whether a filter is active or not. Active filters get deactivated and vice versa. This function triggers
     * a new search.
     *
     * @param {string} data The data store to be used, either "users" or "groups".
     * @param {function} callback The callback to perform the actual search operation.
     * @param {string} field The field / category of the filter, e.g. "department". Must not be empty.
     * @param {object} filter The filter object that contains the value as "key" property, e.g. "IT". Must not be empty.
     * @private
     */
    function _toggleFilter(data, callback, field, filter) {
      if (_isFiltered(data, field, filter)) {
        _.remove(vm[data].filters, {field: field, key: filter.key});
      } else {
        vm[data].filters.push(_.merge(filter, {'field': field}));
      }
      callback(true);
    }

    function loadNextSelectedPage() {
      if (vm.selection.users.loading || !vm.canLoadMoreSelected) {
        return;
      }
      var from = vm.selection.users.page * bigPageSize;
      var to = from + bigPageSize;
      var users = vm.users.existingIds.slice(from, to);
      vm.selection.users.loading = true;
      vm.canLoadMoreSelected = _canLoadMoreSelected();
      UserModel.query({userIds: users.join()}).then(function (result) {
        result.forEach(function (elem) {
          vm.selection.users.existing.push(elem);
        });
        vm.selection.users.page++;
        vm.selection.users.loading = false;
        vm.canLoadMoreSelected = _canLoadMoreSelected();
      });
    }

    function _canLoadMoreSelected() {
      return !vm.selection.users.loading && vm.users.existingIds && (vm.selection.users.page * bigPageSize) < vm.users.existingIds.length;
    }

    function _initSelection() {
      vm.selection = {
        users: {
          page: 0,
          loading: false,
          ids: [],
          newly: [],
          existing: []
        },
        groups: {
          ids: [],
          newly: [],
          existing: []
        }
      };
    }

    (function activate() {
      _initSelection();
      if (groups.length) {
        vm.selection.groups.ids = _.map(groups, 'id');
        vm.groups.existingIds = _.map(groups, 'id');
        vm.selection.groups.existing = angular.copy(groups);
      }
      if (users.length) {
        vm.selection.users.ids = users;
        vm.users.existingIds = angular.copy(users);
        vm.canLoadMoreSelected = true;
        loadNextSelectedPage();
      }
      vm.profileFields = _(profileFieldGroups)
          .flatMap('fields')
          .filter({userChooser: true})
          .value();
    })();
  }

})(angular);
