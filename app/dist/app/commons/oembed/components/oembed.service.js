(function (angular) {
  'use strict';

  angular
      .module('commons.oembed')
      .factory('oembedVideoService', oembedVideoService);

  /**
   * @ngdoc service
   * @name commons.oembed.oembedVideoService
   *
   * @description
   * Matches different online video services by url pattern and renders a video inside a iFrame or html5 video element with
   * specific settings
   */
  function oembedVideoService(VideoInfoModel) {
    var regex = {
      youtube: /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/,
      instagram: /(?:www\.|\/\/)instagram\.com\/p\/(.[a-zA-Z0-9_-]*)/,
      vine: /\/\/vine\.co\/v\/([a-zA-Z0-9]+)/,
      vimeo: /\/\/(player\.)?vimeo\.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/,
      dailymotion: /.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/,
      youku: /\/\/v\.youku\.com\/v_show\/id_(\w+)=*\.html/,
      mp4: /^.+.(mp4|m4v)$/,
      ogg: /^.+.(ogg|ogv)$/,
      webm: /^.+.(webm)$/,
      videoCdn: /e\.video-cdn\.net\/(video|embed)\?video-id=.+&player-id=.+$/
    };

    /* eslint-disable no-undef */

    /* eslint-disable angular/angularelement */
    function createByUrl(url, container) {

      // video url patterns(youtube, instagram, vimeo, dailymotion, youku, mp4, ogg, webm)
      // SOURCE: https://github.com/summernote/summernote/blob/develop/dist/summernote.js
      var ytMatch = url.match(regex.youtube);
      var igMatch = url.match(regex.instagram);
      var vMatch = url.match(regex.vine);
      var vimMatch = url.match(regex.vimeo);
      var dmMatch = url.match(regex.dailymotion);
      var youkuMatch = url.match(regex.youku);
      var mp4Match = url.match(regex.mp4);
      var oggMatch = url.match(regex.ogg);
      var webmMatch = url.match(regex.webm);
      var cdnMatch = url.match(regex.videoCdn);
      var element = '';
      var urlToTrust = '';

      if (ytMatch && ytMatch[1].length === 11) {
        var youtubeId = ytMatch[1];
        urlToTrust = '//www.youtube.com/embed/' + youtubeId;
        element = $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
            .attr('frameborder', 0)
            .attr('src', urlToTrust)
            .attr('width', container.clientWidth)
            .attr('height', container.clientWidth * 0.56);
      } else if (igMatch && igMatch[0].length) {
        urlToTrust = 'https://instagram.com/p/' + igMatch[1] + '/embed/';
        element = $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
            .attr('frameborder', 0)
            .attr('src', urlToTrust)
            .attr('width', container.clientWidth)
            .attr('height', container.clientWidth * 1.16)
            .attr('scrolling', 'no')
            .attr('allowtransparency', 'true');
      } else if (vMatch && vMatch[0].length) {
        urlToTrust = vMatch[0] + '/embed/simple';
        element = $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
            .attr('frameborder', 0)
            .attr('src', urlToTrust)
            .attr('width', container.clientWidth)
            .attr('height', container.clientWidth)
            .attr('class', 'vine-embed');
      } else if (vimMatch && vimMatch[3].length) {
        urlToTrust = '//player.vimeo.com/video/' + vimMatch[3];
        element = $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
            .attr('frameborder', 0)
            .attr('src', urlToTrust)
            .attr('width', container.clientWidth)
            .attr('height', container.clientWidth * 0.56);
      } else if (dmMatch && dmMatch[2].length) {
        urlToTrust = '//www.dailymotion.com/embed/video/' + dmMatch[2];
        element = $('<iframe>')
            .attr('frameborder', 0)
            .attr('src', urlToTrust)
            .attr('width', container.clientWidth)
            .attr('height', container.clientWidth * 0.56);
      } else if (youkuMatch && youkuMatch[1].length) {
        urlToTrust = '//player.youku.com/embed/' + youkuMatch[1];
        element = $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
            .attr('frameborder', 0)
            .attr('height', container.clientWidth)
            .attr('width', container.clientWidth * 1.2)
            .attr('src', urlToTrust);
      } else if (cdnMatch && cdnMatch[0].length) {
        urlToTrust = 'https://' + cdnMatch[0];
        element = $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
            .attr('frameborder', 0)
            .attr('width', container.clientWidth)
            .attr('height', container.clientWidth * 0.56)
            .attr('src', urlToTrust);
      } else if (mp4Match || oggMatch || webmMatch) {
        urlToTrust = url;
        element = $('<video controls>')
            .attr('src', urlToTrust)
            .attr('width', container.clientWidth)
            .attr('height', container.clientWidth * 0.56);
      }

      return element;
    }

    /* eslint-enable no-undef */

    /* eslint-enable angular/angularelement */

    function getEmbedCode(url, container) {
      return VideoInfoModel.generateVideoInfo(url).then(function (videoInfo) {
        return createEmbedCode(videoInfo, container);
      }).catch(function () {
        return createByUrl(url, container);
      });
    }

    function createEmbedCode(videoInfo, container) {
      if (!videoInfo.width) {
        videoInfo.width = 1920;
      }
      if (!videoInfo.height) {
        videoInfo.height = 1080;
      }
      var embedCode = angular.element('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
          .attr('frameborder', 0)
          .attr('width', container.clientWidth)
          .attr('height', container.clientWidth * (videoInfo.height / videoInfo.width))
          .attr('src', videoInfo.videoUrl);
      return embedCode;
    }

    function isVideoUrl(url) {
      return !!getEmbedCode(url, angular.element('<div>'));
    }

    function getHeightPercentage(embedCode) {
      return Math.ceil(embedCode.attr('height') / embedCode.attr('width') * 100);
    }

    return {
      createByUrl: createByUrl,
      getEmbedCode: getEmbedCode,
      createEmbedCode: createEmbedCode,
      isVideoUrl: isVideoUrl,
      getHeightPercentage: getHeightPercentage
    };
  }

})(angular);
