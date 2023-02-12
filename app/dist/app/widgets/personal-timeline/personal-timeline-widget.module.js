(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.personal-timeline', [
        'coyo.widgets.api',
        'commons.i18n'
      ])
      .config(registerPersonalTimelineWidget);

  function registerPersonalTimelineWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      key: 'personal-timeline',
      name: 'WIDGET.PERSONAL_TIMELINE.NAME',
      description: 'WIDGET.PERSONAL_TIMELINE.DESCRIPTION',
      icon: 'zmdi-comment-list',
      categories: 'personal',
      directive: 'coyo-personal-timeline-widget',
      renderOptions: {
        panels: {
          noPanel: true
        }
      }
    });
  }

})(angular);
