(function () {
  'use strict';

  angular.module('coyo.apps.list.fields')
      .provider('fieldTypeRegistry', fieldTypeRegistry);

  /**
   * @ngdoc service
   * @name coyo.apps.list.fields.fieldTypeRegistryProvider
   *
   * @description
   * With this provider new field types for the list app can be registered to the system. A field type consists at
   * least of a key, an icon, a title and a description. After registering a field type, it gets available in the
   * field selection of the list app.
   */

  /**
   * @ngdoc service
   * @name coyo.apps.list.fields.fieldTypeRegistry
   *
   * @description
   * Provides methods to retrieve registered field types. Field types consist of all information to describe a type of
   * a field like text fields, number fields etc. Field types have a unique key, title, description, icon and optionally
   * additional settings. The additional settings are provided as a combination of template and controller which render
   * a form for these settings.
   *
   * @requires $filter
   */
  function fieldTypeRegistry() {
    var fieldTypes = [];

    return {
      $get: function ($filter) {

        return {
          getAll: getAllTypes,
          get: get,
          getRenderProperty: getRenderProperty,
          getInlineEditProperty: getInlineEditProperty
        };

        /**
         * @ngdoc method
         * @name coyo.apps.list.fields.fieldTypeRegistry#getAllTypes
         * @methodOf coyo.apps.list.fields.fieldTypeRegistry
         *
         * @description
         * Returns all registered field types. Returned field types are ordered by their translated title.
         *
         * @returns {array} Returns a list of all registered field types ordered alphabetically by their translated
         * title.
         */
        function getAllTypes() {
          var sortedFieldTypes = angular.copy(fieldTypes);
          return _.orderBy(sortedFieldTypes, function (type) {
            return $filter('translate')(type.title);
          });
        }

        /**
         * @ngdoc method
         * @name coyo.apps.list.fields.fieldTypeRegistry#get
         * @methodOf coyo.apps.list.fields.fieldTypeRegistry
         *
         * @description
         * Returns the field type definition with the given key. If no field type could be found ´undefined´ is
         * returned.
         *
         * @param {string} key The key of the field type to return (e.g. "text"). Must not be empty or undefined.
         * @returns {object} the field type with the given key or ´undefined´ if none could be found.
         */
        function get(key) {
          return _.find(fieldTypes, {key: key});
        }

        function getRenderProperty(key) {
          return get(key).render;
        }

        function getInlineEditProperty(key) {
          return get(key).inlineEdit;
        }
      },
      register: register
    };

    /**
     * @ngdoc method
     * @name coyo.apps.list.fields.fieldTypeRegistryProvider#register
     * @methodOf coyo.apps.list.fields.fieldTypeRegistryProvider
     *
     * @description
     * Registers a new field type to the system. A field type consists at least of a key, an icon, a title and a
     * description. If one of those properties is missing an error is thrown and the registration is canceled.
     * Optionally a controller and a template for custom settings can be registered along with the field. After
     * registering a field type, it gets available in the field selection of the list app.
     *
     * @param {object} fieldTypeDefinition
     * The definition of the field type to register.
     *
     * @param {string} fieldTypeDefinition.key
     * The key to identify the new field type. The key needs to be unique among fields.
     *
     * @param {string} fieldTypeDefinition.icon
     * An icon for the new field type which is displayed in the field selection of the list app. The icon is defined
     * by a zmdi icon class name.
     *
     * @param {object=} fieldTypeDefinition.settings
     * One can provide a template and a controller for additional settings. Generally fields have three settings that
     * are the same for all fields and can't be changed: name, required and hidden.
     *
     * <ul>
     *   <li><b>name:</b> The name of the field</li>
     *   <li><b>required:</b> Defines whether a field is required and must be set by the user when creating list
     *   entries.</li>
     *   <li><b>hidden:</b> Defines whether a field is hidden in overview and only visible in the entry's detail view.
     *   </li>
     * </ul>
     *
     * @param {string=} fieldTypeDefinition.settings.templateUrl
     * A developer can specify a template url to display additional settings for a field. This is a usually an html
     * form.
     *
     * @param {object=} fieldTypeDefinition.settings.controller
     * A developer can add a controller for the given templateUrl
     *
     * @param {string=} fieldTypeDefinition.settings.controllerAs
     * A developer can specify the variable name under which the controller is accessible within the template. It is
     * strongly recommended to set this value if templateUrl and controller are used.
     *
     * @param {string} fieldTypeDefinition.render.templateUrl
     * A developer can specify a template url to display the value for a field.
     *
     * @param {object=} fieldTypeDefinition.render.controller
     * A developer can add a controller for the given render template to implement custom functionality.
     *
     */
    function register(fieldTypeDefinition) {
      _assert(fieldTypeDefinition.key, 'Config property "key" is required', fieldTypeDefinition);
      _assert(fieldTypeDefinition.icon, 'Config property "icon" is required', fieldTypeDefinition);
      _assert(fieldTypeDefinition.title, 'Config property "title" is required', fieldTypeDefinition);
      _assert(fieldTypeDefinition.description, 'Config property "description" is required', fieldTypeDefinition);
      _assert(fieldTypeDefinition.render && fieldTypeDefinition.render.templateUrl,
          'Config property "render" with "templateUrl" is required', fieldTypeDefinition);

      fieldTypes.push(fieldTypeDefinition);
    }

    function _assert(condition, message, config) {
      if (!condition) {
        if (config) {
          console.error('[fieldTypeRegistry] Invalid config', config); //eslint-disable-line
        }
        console.log('[fieldTypeRegistry] ' + message); //eslint-disable-line
        throw new Error('[fieldTypeRegistry] ' + message);
      }
    }

  }

})();
