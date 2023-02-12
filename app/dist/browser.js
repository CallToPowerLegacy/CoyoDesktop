/*! modernizr 3.5.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-bloburls-canvas-contenteditable-cookies-flexbox-history-localstorage-mediaqueries-sessionstorage-websockets-setclasses !*/
!function(e,t,n){function r(e,t){return typeof e===t}function o(){var e,t,n,o,i,s,a;for(var l in S)if(S.hasOwnProperty(l)){if(e=[],t=S[l],t.name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(o=r(t.fn,"function")?t.fn():t.fn,i=0;i<e.length;i++)s=e[i],a=s.split("."),1===a.length?Modernizr[a[0]]=o:(!Modernizr[a[0]]||Modernizr[a[0]]instanceof Boolean||(Modernizr[a[0]]=new Boolean(Modernizr[a[0]])),Modernizr[a[0]][a[1]]=o),C.push((o?"":"no-")+a.join("-"))}}function i(e){var t=_.className,n=Modernizr._config.classPrefix||"";if(T&&(t=t.baseVal),Modernizr._config.enableJSClass){var r=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(r,"$1"+n+"js$2")}Modernizr._config.enableClasses&&(t+=" "+n+e.join(" "+n),T?_.className.baseVal=t:_.className=t)}function s(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):T?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function a(e){return e.replace(/([a-z])-([a-z])/g,function(e,t,n){return t+n.toUpperCase()}).replace(/^-/,"")}function l(){var e=t.body;return e||(e=s(T?"svg":"body"),e.fake=!0),e}function u(e,n,r,o){var i,a,u,f,c="modernizr",d=s("div"),p=l();if(parseInt(r,10))for(;r--;)u=s("div"),u.id=o?o[r]:c+(r+1),d.appendChild(u);return i=s("style"),i.type="text/css",i.id="s"+c,(p.fake?p:d).appendChild(i),p.appendChild(d),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(t.createTextNode(e)),d.id=c,p.fake&&(p.style.background="",p.style.overflow="hidden",f=_.style.overflow,_.style.overflow="hidden",_.appendChild(p)),a=n(d,e),p.fake?(p.parentNode.removeChild(p),_.style.overflow=f,_.offsetHeight):d.parentNode.removeChild(d),!!a}function f(e,t){return!!~(""+e).indexOf(t)}function c(e,t){return function(){return e.apply(t,arguments)}}function d(e,t,n){var o;for(var i in e)if(e[i]in t)return n===!1?e[i]:(o=t[e[i]],r(o,"function")?c(o,n||t):o);return!1}function p(e){return e.replace(/([A-Z])/g,function(e,t){return"-"+t.toLowerCase()}).replace(/^ms-/,"-ms-")}function m(t,n,r){var o;if("getComputedStyle"in e){o=getComputedStyle.call(e,t,n);var i=e.console;if(null!==o)r&&(o=o.getPropertyValue(r));else if(i){var s=i.error?"error":"log";i[s].call(i,"getComputedStyle returning null, its possible modernizr test results are inaccurate")}}else o=!n&&t.currentStyle&&t.currentStyle[r];return o}function v(t,r){var o=t.length;if("CSS"in e&&"supports"in e.CSS){for(;o--;)if(e.CSS.supports(p(t[o]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var i=[];o--;)i.push("("+p(t[o])+":"+r+")");return i=i.join(" or "),u("@supports ("+i+") { #modernizr { position: absolute; } }",function(e){return"absolute"==m(e,null,"position")})}return n}function h(e,t,o,i){function l(){c&&(delete N.style,delete N.modElem)}if(i=r(i,"undefined")?!1:i,!r(o,"undefined")){var u=v(e,o);if(!r(u,"undefined"))return u}for(var c,d,p,m,h,y=["modernizr","tspan","samp"];!N.style&&y.length;)c=!0,N.modElem=s(y.shift()),N.style=N.modElem.style;for(p=e.length,d=0;p>d;d++)if(m=e[d],h=N.style[m],f(m,"-")&&(m=a(m)),N.style[m]!==n){if(i||r(o,"undefined"))return l(),"pfx"==t?m:!0;try{N.style[m]=o}catch(g){}if(N.style[m]!=h)return l(),"pfx"==t?m:!0}return l(),!1}function y(e,t,n,o,i){var s=e.charAt(0).toUpperCase()+e.slice(1),a=(e+" "+E.join(s+" ")+s).split(" ");return r(t,"string")||r(t,"undefined")?h(a,t,o,i):(a=(e+" "+P.join(s+" ")+s).split(" "),d(a,t,n))}function g(e,t,r){return y(e,n,n,t,r)}var C=[],S=[],x={_version:"3.5.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){S.push({name:e,fn:t,options:n})},addAsyncTest:function(e){S.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=x,Modernizr=new Modernizr,Modernizr.addTest("cookies",function(){try{t.cookie="cookietest=1";var e=-1!=t.cookie.indexOf("cookietest=");return t.cookie="cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT",e}catch(n){return!1}}),Modernizr.addTest("history",function(){var t=navigator.userAgent;return-1===t.indexOf("Android 2.")&&-1===t.indexOf("Android 4.0")||-1===t.indexOf("Mobile Safari")||-1!==t.indexOf("Chrome")||-1!==t.indexOf("Windows Phone")||"file:"===location.protocol?e.history&&"pushState"in e.history:!1});var b=!1;try{b="WebSocket"in e&&2===e.WebSocket.CLOSING}catch(w){}Modernizr.addTest("websockets",b),Modernizr.addTest("localstorage",function(){var e="modernizr";try{return localStorage.setItem(e,e),localStorage.removeItem(e),!0}catch(t){return!1}}),Modernizr.addTest("sessionstorage",function(){var e="modernizr";try{return sessionStorage.setItem(e,e),sessionStorage.removeItem(e),!0}catch(t){return!1}});var _=t.documentElement,T="svg"===_.nodeName.toLowerCase();Modernizr.addTest("canvas",function(){var e=s("canvas");return!(!e.getContext||!e.getContext("2d"))}),Modernizr.addTest("contenteditable",function(){if("contentEditable"in _){var e=s("div");return e.contentEditable=!0,"true"===e.contentEditable}});var k=function(){var t=e.matchMedia||e.msMatchMedia;return t?function(e){var n=t(e);return n&&n.matches||!1}:function(t){var n=!1;return u("@media "+t+" { #modernizr { position: absolute; } }",function(t){n="absolute"==(e.getComputedStyle?e.getComputedStyle(t,null):t.currentStyle).position}),n}}();x.mq=k,Modernizr.addTest("mediaqueries",k("only all"));var O="Moz O ms Webkit",E=x._config.usePrefixes?O.split(" "):[];x._cssomPrefixes=E;var z=function(t){var r,o=prefixes.length,i=e.CSSRule;if("undefined"==typeof i)return n;if(!t)return!1;if(t=t.replace(/^@/,""),r=t.replace(/-/g,"_").toUpperCase()+"_RULE",r in i)return"@"+t;for(var s=0;o>s;s++){var a=prefixes[s],l=a.toUpperCase()+"_"+r;if(l in i)return"@-"+a.toLowerCase()+"-"+t}return!1};x.atRule=z;var P=x._config.usePrefixes?O.toLowerCase().split(" "):[];x._domPrefixes=P;var L={elem:s("modernizr")};Modernizr._q.push(function(){delete L.elem});var N={style:L.elem.style};Modernizr._q.unshift(function(){delete N.style}),x.testAllProps=y,x.testAllProps=g,Modernizr.addTest("flexbox",g("flexBasis","1px",!0));var j=x.prefixed=function(e,t,n){return 0===e.indexOf("@")?z(e):(-1!=e.indexOf("-")&&(e=a(e)),t?y(e,t,n):y(e,"pfx"))},A=j("URL",e,!1);A=A&&e[A],Modernizr.addTest("bloburls",A&&"revokeObjectURL"in A&&"createObjectURL"in A),o(),i(C),delete x.addTest,delete x.addAsyncTest;for(var R=0;R<Modernizr._q.length;R++)Modernizr._q[R]();e.Modernizr=Modernizr}(window,document);

var Browser = {

  /**
   * Checks if the current browser is at least partially supported by the Coyo application.
   *
   * @return {boolean} True, if and only if the current browser is partially or fully supported.
   */
  isPartiallySupported: function () {
    return Modernizr.bloburls
        && Modernizr.cookies
        && Modernizr.flexbox
        && Modernizr.localstorage
        && Modernizr.mediaqueries
        && Modernizr.sessionstorage
        && Modernizr.websockets;
  },

  /**
   * Checks if the current browser is fully supported by the Coyo application.
   *
   * @return {boolean} True, if and only if the current browser is fully supported.
   */
  isFullySupported: function () {
    return this.isPartiallySupported()
        && Modernizr.canvas
        && Modernizr.contenteditable
        && Modernizr.history;
  },

  /**
   * Displays an error bar for partially supported browsers.
   */
  showErrorBar: function () {
    console.log('[Browser Support] ', Modernizr);
    var cls = document.body.getAttribute('class');
    document.body.setAttribute('class', 'browser-error-bar ' + (cls || ''));
    var ctn = document.body.innerHTML;
    document.body.innerHTML = '<p class="browser-warning" onclick="this.parentNode.removeChild(this)">' +
        '<span>You are using an outdated browser that is only partially supported by Coyo. ' +
        'Please update your browser to avoid any runtime problems. For more information ' +
        'visit <a href="https://www.coyoapp.com/">https://www.coyoapp.com/</a> or contact the ' +
        '<a href="https://support.mindsmash.com">Support Center</a>.</span></p>' + ctn;
  },

  /**
   * Displays an error page for unsupported browsers.
   */
  showErrorPage: function () {
    console.log('[Browser Support] ', Modernizr);
    document.body.setAttribute('class', 'browser-error-page');
    document.body.removeAttribute('ng-class');
    document.body.innerHTML = '<h1>:(</h1>' +
        '<p>You are using an outdated browser that is not supported by Coyo. ' +
        'Please update your browser and try again. For more information about ' +
        'visit <a href="https://www.coyoapp.com/">https://www.coyoapp.com/</a> or contact the ' +
        '<a href="https://support.mindsmash.com">Support Center</a>.</p>' +
        '<p><small>User Agent: ' + window.navigator.userAgent + '</small></p>';
  }
};
