(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.api')
      .directive('coyoWidgetLayout', widgetLayout);

  /**
   * @ngdoc directive
   * @name coyo.widgets.api.coyoWidgetLayout:coyoWidgetLayout
   * @restrict E
   * @scope
   *
   * @description
   * This directive renders a widget layout and its editing features.
   *
   * @param {string} name
   * The name of the layout. This name must be unique within the whole system.
   *
   * @param {boolean} canManage
   * A boolean determining whether the current user can manage the layout. This might (but not always does) depend on
   * the parent this layout belongs to.
   *
   * @param {boolean=} globalEvents
   * Specifies whether the layout should react to global events (default) or to local events only.
   *
   * @param {object=} parent
   * The parent of this layout if there is one. This is needed in case there is a parent the given layout belongs
   * to. E.g. layouts for a page or a workspace need to be passed as parent so we can make sure, that the layout is only
   * shown for this particular page / workspace.
   *
   * @param {string} parent.id
   * If a parent is provided it needs an id to be identified.
   *
   * @param {string} parent.typeName
   * If a parent is provided it needs a `typeName` so the type can be resolved (e.g. `page` or `workspace`).
   *
   * @param {string} renderStyle
   * The style of the widget slots in this layout. The following styles are available: `plain` (no additional styling),
   * `panel` (slot is rendered inside of a panel), `panels` (each widget is rendered inside of a panel).
   * Defaults to `plain`.
   *
   * @param {boolean=} createMode
   * Set this to true if the layout does not yet exist in the backend (e.g. on a page in create mode), so no backend
   * call is made to load the layout.
   *
   * @param {boolean=} copyMode
   * If true, then the layout and all contained existing widgets will not be updated but new versions are created on save.
   * This requires that the name of the layout is changed between loading and saving.
   * Useful to persist multiple versions of the layout and it's content.
   *
   * @param {boolean=} simpleMode
   * If true the layout is initially presented in "simple" mode, i.e. the layout options are hidden.
   *
   * @param {object=} options
   * Additional options.
   *
   * @param {boolean=} addInitialWidget
   * If true a default text widget will be added to the slot if there are not widgets present.
   */
  function widgetLayout() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/api/components/widget-layout/widget-layout.html',
      scope: {},
      replace: true,
      bindToController: {
        name: '@',
        canManage: '<',
        globalEvents: '<?',
        parent: '<?',
        renderStyle: '@',
        createMode: '<?',
        copyMode: '<?',
        simpleMode: '<?',
        options: '<?',
        addInitialWidget: '<?'
      },
      controller: 'WidgetLayoutController',
      controllerAs: '$ctrl'
    };
  }

})(angular);
