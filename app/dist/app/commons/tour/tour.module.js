(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name commons.tour
   *
   * @description
   * This modules contains components to display the user tour.
   */
  angular
      .module('commons.tour', [
        'coyo.base',
        'bm.uiTour'
      ])
      .constant('tourConfig', {
        templates: {
          tour: 'app/commons/tour/views/tour.html'
        }
      })
      .config(configureTour)
      .run(bootstrapTour);

  /**
   * Adds some global configuration parameter to the tour framework.
   */
  function configureTour(TourConfigProvider, tourConfig) {
    TourConfigProvider.set('appendToBody', true);
    TourConfigProvider.set('backdrop', true);
    TourConfigProvider.set('useHotkeys', true);
    TourConfigProvider.set('templateUrl', tourConfig.templates.tour);
  }

  /**
   * Initializes the tour. The tour then starts itself if steps are available.
   */
  function bootstrapTour(tourService) {
    tourService.init();
  }

})(angular);
