(function (angular) {
  'use strict';

  angular
      .module('coyo.colleagues')
      .controller('ColleaguesMainController', ColleaguesMainController);

  function ColleaguesMainController($rootScope, $scope, $q, $sessionStorage, UserModel, Pageable, currentUser, colleaguesConfig, profileFieldGroups) {
    var vm = this;

    vm.currentUser = currentUser;
    vm.maxDepartments = 10;

    vm.search = search;
    vm.moreDepartments = moreDepartments;
    vm.clearDepartments = clearDepartments;
    vm.toggleDepartment = _.partial(_toggleFilter, 'department');
    vm.toggleSubscribedTo = _.partial(_toggleFilter, 'subscribedTo', true);
    vm.toggleSubscribedBy = _.partial(_toggleFilter, 'subscribedBy', true);

    vm.params = angular.extend({
      searchTerm: undefined,
      department: currentUser.properties.department ? [currentUser.properties.department] : [],
      subscribedBy: [],
      subscribedTo: []
    }, $sessionStorage.colleagueList);

    function _loadColleagues() {
      if (vm.loading) {
        return $q.reject();
      }
      vm.loading = true;

      var sort = vm.params.searchTerm ? ['_score,DESC', 'lastname.sort,firstname.sort'] : 'lastname.sort,firstname.sort';
      var pageable = new Pageable(0, colleaguesConfig.paging.pageSize, sort);
      var filter = _.omit(vm.params, 'searchTerm');
      var searchFields = ['displayName', 'email', 'properties.department', 'properties.jobTitle'];
      var aggregations = {department: 0, subscribedTo: '', subscribedBy: ''};
      return UserModel.searchWithFilter(vm.params.searchTerm, pageable, filter, searchFields, aggregations).then(function (page) {
        $sessionStorage.colleagueList = vm.params;

        vm.currentPage = page;

        // sort departments by:
        //   1. department of current user at the top
        //   2. department count descending
        //   3. department name ascending
        vm.departments = _.orderBy(page.aggregations.department,
            [{key: currentUser.properties.department}, 'count', 'key'],
            ['desc', 'desc', 'asc']);

        // set active state for every department
        vm.departmentsFilterAllActive = vm.params.department.length === 0;
        vm.departments.forEach(function (department) {
          department.active = vm.params.department.indexOf(department.key) >= 0;
        });

        // calculate total departments count
        vm.departmentsCount = _.sumBy(vm.departments, 'count');

        // save subscription aggregations
        vm.subscribedBy = page.aggregations.subscribedBy[0];
        vm.subscribedBy.active = vm.params.subscribedBy.length > 0;
        vm.subscribedTo = page.aggregations.subscribedTo[0];
        vm.subscribedTo.active = vm.params.subscribedTo.length > 0;
      }).finally(function () {
        vm.loading = false;
      });
    }

    function search(term) {
      vm.params.searchTerm = term;
      vm.params.department = [];
      vm.params.subscribedTo = [];
      vm.params.subscribedBy = [];
      return _loadColleagues();
    }

    function clearDepartments() {
      vm.params.department = [];
      return _loadColleagues();
    }

    function moreDepartments() {
      vm.maxDepartments += 10;
    }

    function _toggleFilter(aggregation, key) {
      var idx = vm.params[aggregation].indexOf(key);
      if (idx >= 0) {
        vm.params[aggregation].splice(idx, 1);
      } else {
        vm.params[aggregation].push(key);
      }
      return _loadColleagues();
    }

    (function _init() {
      _loadColleagues();
      vm.profileGroups = profileFieldGroups;
      var unsubscribe = $rootScope.$on('currentUser.follow:update', function (event, subscription) {
        vm.subscribedTo.count = (subscription.follow) ? ++vm.subscribedTo.count : --vm.subscribedTo.count;
      });
      $scope.$on('$destroy', unsubscribe);
    })();

  }

})(angular);
