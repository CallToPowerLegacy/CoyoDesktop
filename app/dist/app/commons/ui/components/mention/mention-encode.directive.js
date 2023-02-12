(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoMentionEncode', mentionEncode);

  var cache = {};
  var requests = [];

  /**
   * @ngdoc directive
   * @name commons.ui.coyoMentionEncode:coyoMentionEncode
   * @restrict 'A'
   * @element ANY
   *
   * @description
   * Evaluates the expression and inserts the resulting HTML into the element in a secure way. Any mentions contained in
   * the expression are resolved asynchronously and replaced with a sender link using the sender's display name. Senders
   * are loaded in bulk per digest cycle and cached globally until the next successful state change.
   *
   * @requires $sce
   * @requires $parse
   * @requires $compile
   * @requires $rootScope
   * @requires $q
   * @requires coyo.domain.SenderModel
   * @requires $sanitize
   * @requires $timeout
   */
  function mentionEncode($sce, $parse, $compile, $q, SenderModel, $sanitize, $timeout, $transitions) {
    return {
      restrict: 'A',
      compile: function mentionEncodeCompile(tElem, tAttrs) {
        var mentionEncodeGetter = $parse(tAttrs.coyoMentionEncode);
        var mentionEncodeWatch = $parse(tAttrs.coyoMentionEncode, function sceValueOf(val) {
          return $sce.valueOf(val);
        });

        return function mentionEncodeLink(scope, elem) {
          scope.mentions = {};

          scope.$watch(mentionEncodeWatch, function ngBindHtmlWatchAction() {
            var value = mentionEncodeGetter(scope);

            value = value ? value.replace(/([\s|>|^])@([-0-9a-zA-Z]+)/g, function (mention, prefix, slug) {
              if (!cache[slug]) {
                var deferred = $q.defer();
                requests.push({slug: slug, deferred: deferred});
                cache[slug] = deferred.promise;
                $timeout(function () {
                  if (requests.length) {
                    var requestsInProgress = angular.copy(requests);
                    requests = [];
                    SenderModel.get(undefined, {slug: _.map(requestsInProgress, 'slug')}).then(function (result) {
                      requestsInProgress.forEach(function (req) {
                        if (result[req.slug]) {
                          req.deferred.resolve(result[req.slug]);
                        } else {
                          req.deferred.reject();
                        }
                      });
                    });
                  }
                });
              }

              cache[slug].then(function (result) {
                scope.mentions[slug] = result;
                var link = $compile('<a coyo-sender-link=":: mentions[\'' + slug + '\']">{{:: mentions[\'' + slug + '\'].displayName }}</a>')(scope);
                elem.find('.mention-' + slug).first().replaceWith(link);
              }).catch(function () {
                elem.find('.mention-' + slug).first().replaceWith('@' + slug);
              });

              return prefix + '<span class="mention mention-' + slug + '">@' + slug + '</span>';
            }) : value;

            var trustedHtml = $sce.getTrustedHtml(value) || '';
            elem.html($sanitize(trustedHtml));
          });

          var deregisterHook = $transitions.onSuccess({}, function () {
            cache = {};
          });
          scope.$on('$destroy', deregisterHook);
        };
      }
    };
  }

})(angular);
