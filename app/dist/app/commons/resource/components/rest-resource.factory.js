(function (angular) {
  'use strict';

  angular
      .module('commons.resource')
      .factory('restResourceFactory', restResourceFactory);

  /**
   * @ngdoc service
   * @name commons.resource.restResourceFactory
   *
   * @description
   * The factory creating the REST resources. In addition to the default
   * {@link https://github.com/FineLinePrototyping/angularjs-rails-resource angularjs-rails-resource} this factory
   * handles paging by utilizing Pageable and Page objects. In addition dynamic permissions are supported for the
   * methods `query` and `get`. For custom methods `applyPermissions` can be used to add permissions.
   *
   * ### Permissions Support ###
   *
   * If permissions should be available in the result of a request, they need to be requested. This can be achieved by
   * passing a comma separated string of permissions along with the GET parameter `_permissions`. For example, if you
   * want the permissions 'manage' and 'manageApps' to be in the result of list of pages, you would add the following
   * GET parameter:
   *
   * ```
   * GET /pages?_permission=manage,manageApps
   * ```
   *
   * Since you don't want to specify these parameters explicitly all the time when permissions are needed, this factory
   * is supporting you with this task. For all default `get`, `query`, `pagedQuery`, `create`, `save` and `update`
   * methods, there is a xxxWithPermissions method which appends the permissions parameter accordingly.
   *
   * If you need this behavior for custom methods, you need to call the method applyPermissions on the queryParams
   * inside your custom resource method beforehand.
   *
   * ```
   * myCustomGetMethod: function(queryParams) {
   *    ...
   *    Resource.applyPermissions(['manage', 'manageApps'], queryParams);
   *    ...
   * }
   * ```
   *
   * @requires railsResourceFactory
   * @requires commons.resource.Page
   * @requires commons.resource.Pageable
   * @requires $log
   */
  function restResourceFactory(railsResourceFactory, Pageable, Page, $log) {
    return function (config) {
      var Resource = railsResourceFactory(config);

      angular.extend(Resource.prototype, {

        /**
         * @ngdoc method
         * @name commons.resource.restResourceFactory#get
         * @methodOf commons.resource.restResourceFactory
         * @instance
         *
         * @description
         * Instance method which refreshes the instance from the server.
         *
         * @param {string=} customUrl
         * Uses the custom url to fetch this resource from the server.
         *
         * @param {object=} queryParams
         * Optional query params to update this resource.
         *
         * @returns {promise} A promise that will be resolved with the instance itself
         */
        get: function (customUrl, queryParams) {
          return Resource.$get(this.$url(customUrl), queryParams);
        },

        /**
         * @ngdoc method
         * @name commons.resource.restResourceFactory#getWithPermissions
         * @methodOf commons.resource.restResourceFactory
         * @instance
         *
         * @description
         * Instance method which refreshes the instance from the server. This method supports permissions.
         *
         * @param {string=} customUrl
         * Uses the custom url to fetch this resource from the server.
         *
         * @param {object=} queryParams
         * Optional query params to update this resource.
         *
         * @param {string[]} permissions
         * An array of permission strings that should be added to the resource in the response.
         *
         * @returns {promise} A promise that will be resolved with the instance itself
         */
        getWithPermissions: function (customUrl, queryParams, permissions) {
          var params = Resource.applyPermissions(permissions, queryParams);
          return Resource.$get(this.$url(customUrl), params);
        },

        /**
         * @ngdoc method
         * @name commons.resource.restResourceFactory#createWithPermissions
         * @methodOf commons.resource.restResourceFactory
         *
         * @description
         * Overrides the default `create` method from angular-rails-resource and adds permission support.
         * The default method submits the resource instance to the resource's base URL (e.g. /books) using a POST.
         *
         * @param {string[]} permissions
         * An array of permission strings that should be added to the resource in the response.
         *
         * @returns {object} A promise that will be resolved with the instance itself.
         */
        createWithPermissions: function (permissions) {
          var params = Resource.applyPermissions(permissions);
          return this.$post(this.$url(), this, params);
        },

        /**
         * @ngdoc method
         * @name commons.resource.restResourceFactory#updateWithPermissions
         * @methodOf commons.resource.restResourceFactory
         *
         * @description
         * Overrides the default `update` method from angular-rails-resource and adds permission support.
         * The default method submits the resource instance to the resource's URL (e.g. /books/1234) using a PUT or
         * PATCH.
         *
         * @param {string[]} permissions
         * An array of permission strings that should be added to the resource in the response.
         *
         * @returns {object} A promise that will be resolved with the instance itself
         */
        updateWithPermissions: function (permissions) {
          var params = Resource.applyPermissions(permissions);
          return this['$' + this.constructor.config.updateMethod](this.$url(), this, params);
        },

        /**
         * @ngdoc method
         * @name commons.resource.restResourceFactory#saveWithPermissions
         * @methodOf commons.resource.restResourceFactory
         *
         * @description
         * Overrides the default `save` method from angular-rails-resource and adds permission support. Calls
         * `createWithPermissions` if `isNew` returns true, otherwise it calls `updateWithPermissions`.
         *
         * @param {string[]} permissions
         * An array of permission strings that should be added to the resource in the response.
         *
         * @returns {object} A promise that will be resolved with the instance itself
         */
        saveWithPermissions: function (permissions) {
          if (this.isNew()) {
            return this.createWithPermissions(permissions);
          } else {
            return this.updateWithPermissions(permissions);
          }
        }
      });

      angular.extend(Resource, {

        /**
         * @ngdoc method
         * @name commons.resource.restResourceFactory#queryWithPermissions
         * @methodOf commons.resource.restResourceFactory
         *
         * @description
         * Overrides the default query method from angular-rails-resource and adds permission support.
         * The default method executes a GET request against the resource's base url (e.g. /pages).
         *
         * @param {object=} params
         * An map of strings or objects that are passed to $http to be turned into query parameters
         *
         * @param {*} context
         * A context object that is used during url evaluation to resolve expression variables
         *
         * @param {string[]} permissions
         * An array of permission strings that should be added to the resource in the response.
         *
         * @returns {promise} A promise that will be resolved with an array of new Resource instances
         */
        queryWithPermissions: function (params, context, permissions) {
          params = Resource.applyPermissions(permissions, params);
          return Resource.query(params, context);
        },

        /**
         * @ngdoc method
         * @name commons.resource.restResourceFactory#getWithPermissions
         * @methodOf commons.resource.restResourceFactory
         *
         * @description
         * Overrides the default get method from angular-rails-resource and adds permission support.
         * The default method executes a GET request against the resource's url (e.g. /pages/1234).
         *
         * @param {object=} params
         * An map of strings or objects that are passed to $http to be turned into query parameters
         *
         * @param {*} context
         * A context object that is used during url evaluation to resolve expression variables. If you are using a
         * basic url this can be an id number to append to the url.
         *
         * @param {string[]} permissions
         * An array of permission strings that should be added to the resource in the response.
         *
         * @returns {promise} A promise that will be resolved with a new instance of the Resource
         */
        getWithPermissions: function (context, params, permissions) {
          params = Resource.applyPermissions(permissions, params);
          return Resource.get(context, params);
        },

        /**
         * @ngdoc method
         * @name commons.resource.restResourceFactory#pagedQuery
         * @methodOf commons.resource.restResourceFactory
         *
         * @description
         * Executes a GET request with paging against a resource's base url (e.g. /pages). The result contains paging
         * information, which can be used to implement paging or endless scrolling.
         *
         * @param {object} pageable
         * A pageable object containing the paging information, like page number, page size, offset or sorting.
         *
         * @param {object=} queryParams
         * Additional query parameter to use for this GET request.
         *
         * @param {*=} context
         * A context object that is used during url evaluation to resolve expression variables
         *
         * @param {string=} customUrlParameter
         * A custom URl parameter (optional)
         *
         * @param {string=} nested
         * A field name for a nested page (optional)
         *
         * @returns {promise} A promise that will be resolved with a Page of new Resource instances and paging
         * information.
         */
        pagedQuery: function (pageable, queryParams, context, customUrlParameter, nested) {
          pageable = (pageable || new Pageable());
          queryParams = (queryParams || {});

          var params = pageable.getParams();
          angular.extend(params, queryParams);

          var url = this.$url(context, customUrlParameter);
          return Resource.$get(url, params).then(function (response) {
            var data = nested ? response[nested] : response;
            var page = new Page(data, queryParams, {
              url: url,
              resultMapper: function (item) {
                return new Resource(item);
              }
            });
            return nested ? _.set(response, nested, page) : page;
          });
        },

        /**
         * @ngdoc method
         * @name commons.resource.restResourceFactory#pagedQueryWithPermissions
         * @methodOf commons.resource.restResourceFactory
         *
         * @description
         * Executes a GET request with paging against a resource's base url (e.g. /pages). The result contains paging
         * information, which can be used to implement paging or endless scrolling. This method considers permissions.
         *
         * @param {object} pageable
         * A pageable object containing the paging information, like page number, page size, offset or sorting.
         *
         * @param {object=} queryParams
         * Additional query parameter to use for this GET request.
         *
         * @param {*} context
         * A context object that is used during url evaluation to resolve expression variables.
         *
         * @param {string[]} permissions
         * An array of permission strings that should be added to the resource in the response.
         *
         * @param {string} customUrlParameter
         * A custom URl parameter (optional)
         *
         * @param {string=} nested
         * A field name for a nested page (optional)
         *
         * @returns {promise} A promise that will be resolved with a Page of new Resource instances and paging
         * information.
         */
        pagedQueryWithPermissions: function (pageable, queryParams, context, permissions, customUrlParameter, nested) {
          queryParams = Resource.applyPermissions(permissions, queryParams);
          return Resource.pagedQuery(pageable, queryParams, context, customUrlParameter, nested);
        },

        /**
         * @ngdoc method
         * @name commons.resource.restResourceFactory#applyPermissions
         * @methodOf commons.resource.restResourceFactory
         *
         * @description
         * Applies permissions to the given query parameters or creates a new query parameter object. If an error
         * occurs, the query parameters are returned unmodified.
         *
         * @param {object=} params
         * Query parameter if existing. If no query params are passed an empty object is created and the configured
         * permissions will be added to this object.
         *
         * @param {string[]} permissions
         * An array of permission strings that should be added to the resource in the response. The list is
         * added the query parameter `_permissions` as a comma separated list.
         *
         * @returns {object} The modified query params object containing the `_permission` parameter or the unmodified
         * params if an error occurred.
         */
        applyPermissions: function (permissions, params) {
          params = params || {};
          if (!permissions) {
            $log.error('No permissions passed. Permissions must not be empty.');
            return params;
          }

          if (!_.isArray(permissions)) {
            $log.error('Invalid permissions passed. Permissions need to be passed as an array. Was: "' + permissions + '".');
            return params;
          }

          if (params._permissions) {
            $log.error('Params already contain permissions. Ignore sending permissions [' + permissions + '].');
            return params;
          }

          angular.extend(params, {'_permissions': _.join(permissions)});
          return params;
        }

      });

      return Resource;
    };
  }

})(angular);
