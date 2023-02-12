(function (angular) {
  'use strict';

  angular
      .module('coyo.search')
      .controller('SearchController', SearchController);

  /**
   * Controller for the full search
   */
  function SearchController($rootScope, $scope, $http, $httpParamSerializer, $q, $state, $stateParams, $translate,
                            coyoConfig, coyoEndpoints, targetService, Page) {
    var vm = this;

    vm.isEmpty = isEmpty;
    vm.getType = getType;
    vm.openResult = openResult;
    vm.openSender = openSender;
    vm.toggleFilter = toggleFilter;
    vm.clearFilter = clearFilter;
    vm.search = search;

    function isEmpty(object) {
      return _.size(object) === 0;
    }

    function getType(typeName) {
      return coyoConfig.entityTypes[typeName] || coyoConfig.entityTypes.default;
    }

    function openResult(result) {
      if (result.canLinkToResult) {
        targetService.go(result.target);
      }
    }

    function openSender(result) {
      if (result.sender && result.canLinkToSender) {
        targetService.go(result.sender.target);
      }
    }

    function toggleFilter(key, value, singleSelect) {
      var filter = $rootScope.search.filter[key];
      if (singleSelect || !filter) {
        $rootScope.search.filter[key] = [value];
      } else if (filter.indexOf(value) < 0) {
        $rootScope.search.filter[key] = _.concat(filter, value);
      } else if (filter.length > 1) {
        $rootScope.search.filter[key] = _.without(filter, value);
      } else {
        delete $rootScope.search.filter[key];
      }
      return search(0, true);
    }

    function clearFilter(key) {
      delete $rootScope.search.filter[key];
      return search(0, true);
    }

    function search(page, writeToUrl) {
      if (vm.loading || !$rootScope.search.term) {
        return $q.reject();
      }
      vm.loading = true;

      // write params to URL
      if (writeToUrl) {
        $state.transitionTo('main.search', angular.extend({
          term: $rootScope.search.term
        }, _.mapKeys($rootScope.search.filter, function (value, key) {
          return key + '[]';
        })), {notify: false});
      }

      // execute search
      return $http({
        method: 'GET',
        url: coyoEndpoints.search.query.replace('{page}', page).replace('{pageSize}', 20),
        params: {
          term: $rootScope.search.term,
          filters: $httpParamSerializer($rootScope.search.filter),
          aggregations: $httpParamSerializer({type: 10, modified: '', sender: 5})
        }
      }).then(function (result) {
        vm.currentPage = new Page(result.data, {
          _page: page,
          _pageSize: 20
        });

        // permission checks
        _.forEach(result.data.content, function (result) {
          targetService.onCanLinkTo(result.target, function (canLink) {
            result.canLinkToResult = canLink;
          });
          if (result.sender) {
            targetService.onCanLinkTo(result.sender.target, function (canLink) {
              result.canLinkToSender = canLink;
            });
          }
        });

        vm.typeAggregationTotal = _.sumBy(vm.currentPage.aggregations.type, 'count');

        // set sender labels
        _.forEach(vm.currentPage.aggregations.sender, function (aggregation) {
          aggregation.label = aggregation.data.displayName;
        });
        // set modified labels
        _.forEach(vm.currentPage.aggregations.modified, function (aggregation) {
          aggregation.label = aggregation.data.total;
        });
        // set type labels
        _.forEach(vm.currentPage.aggregations.type, function (aggregation) {
          aggregation.label = $translate.instant(getType(aggregation.key).label);
        });

        vm.loading = false;
      });
    }

    // ================================

    (function _init() {
      // extract search params from URL
      $rootScope.search = angular.extend($rootScope.search || {}, {
        visible: true,
        term: $stateParams.term,
        filter: _.chain($stateParams).pickBy(function (value, key) {
          return _.endsWith(key, '[]') && !!value;
        }).mapKeys(function (value, key) {
          return key.slice(0, -2);
        }).value()
      });

      // execute first search request
      search(0, false);
    })();
  }

})(angular);
