(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.teaser')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "WIDGETS.TEASER.DESCRIPTION": "Displays a carousel with images and text.",
          "WIDGETS.TEASER.NAME": "Teaser",
          "WIDGETS.TEASER.SETTINGS.CONFIG.CONTEXT.TITLE": "Options",
          "WIDGETS.TEASER.SETTINGS.CONFIG.CONTEXT.DOWN": "Move down",
          "WIDGETS.TEASER.SETTINGS.CONFIG.CONTEXT.UP": "Move up",
          "WIDGETS.TEASER.SETTINGS.CONFIG.IMAGE.LABEL": "Image",
          "WIDGETS.TEASER.SETTINGS.CONFIG.IMAGE.HELP": "Background image for the current slide",
          "WIDGETS.TEASER.SETTINGS.CONFIG.HEADLINE.LABEL": "Headline",
          "WIDGETS.TEASER.SETTINGS.CONFIG.HEADLINE.HELP": "Headline for the current slide",
          "WIDGETS.TEASER.SETTINGS.CONFIG.HEADLINE.SLIDE.NEW": "Create slide",
          "WIDGETS.TEASER.SETTINGS.CONFIG.HEADLINE.SLIDE.EDIT": "Edit slide",
          "WIDGETS.TEASER.SETTINGS.CONFIG.HEADLINE.SLIDES": "Slides",
          "WIDGETS.TEASER.SETTINGS.CONFIG.HEADLINE.SIZE": "Size",
          "WIDGETS.TEASER.SETTINGS.CONFIG.SUBHEADLINE.LABEL": "Subheadline",
          "WIDGETS.TEASER.SETTINGS.CONFIG.SUBHEADLINE.HELP": "Subheadline for the current slide",
          "WIDGETS.TEASER.SETTINGS.CONFIG.BUTTON.CREATE": "Create",
          "WIDGETS.TEASER.SETTINGS.CONFIG.BUTTON.EDIT": "Save changes",
          "WIDGETS.TEASER.SETTINGS.CONFIG.BUTTON.NEW": "New slide",
          "WIDGETS.TEASER.SETTINGS.CONFIG.TAB.HELP": "Open link in new tab",
          "WIDGETS.TEASER.SETTINGS.CONFIG.TAB.LABEL": "New tab",
          "WIDGETS.TEASER.SETTINGS.CONFIG.URL.HELP": "Link opened at a click on the slide",
          "WIDGETS.TEASER.SETTINGS.CONFIG.URL.LABEL": "Url",
          "WIDGETS.TEASER.SETTINGS.CONFIG.URL.PLACEHOLDER": "http://",
          "WIDGETS.TEASER.SETTINGS.SLIDES.LABEL": "Slides",
          "WIDGETS.TEASER.SETTINGS.SLIDES.LABEL.DEFAULT.ONE.HEADLINE": "Green company",
          "WIDGETS.TEASER.SETTINGS.SLIDES.LABEL.DEFAULT.ONE.SUBHEADLINE": "We are one of the most environment-friendly companies in the world",
          "WIDGETS.TEASER.SETTINGS.SLIDES.LABEL.DEFAULT.TWO.HEADLINE": "Celebration",
          "WIDGETS.TEASER.SETTINGS.SLIDES.LABEL.DEFAULT.TWO.SUBHEADLINE": "Cloud storage now available for our customers",
          "WIDGETS.TEASER.SETTINGS.SLIDES.LABEL.DEFAULT.THREE.HEADLINE": "New client",
          "WIDGETS.TEASER.SETTINGS.SLIDES.LABEL.DEFAULT.THREE.SUBHEADLINE": "Since monday a new client is using our services"
        });
        /* eslint-enable quotes */
      });
})(angular);
