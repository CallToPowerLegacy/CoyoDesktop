(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.subscriptions')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGET.SUBSCRIPTIONS.DESCRIPTION": "Zeigt die Abonnements des aktuellen Benutzers für Seiten und Workspaces an.",
          "WIDGET.SUBSCRIPTIONS.NAME": "Abonnements",
          "WIDGET.SUBSCRIPTIONS.PAGE": "Meine Seiten",
          "WIDGET.SUBSCRIPTIONS.WORKSPACE": "Meine Workspaces",
          "WIDGET.SUBSCRIPTIONS.EMPTY": "Du hast keine Seiten oder Workspaces abonniert."
        });
        /* eslint-enable quotes */
      });
})(angular);
