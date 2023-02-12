/*! modernizr 3.5.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-bloburls-canvas-contenteditable-cookies-flexbox-history-localstorage-mediaqueries-sessionstorage-websockets-setclasses !*/
!function(e,t,r){function o(e,t){return typeof e===t}function n(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):C?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function i(e){return e.replace(/([a-z])-([a-z])/g,function(e,t,r){return t+r.toUpperCase()}).replace(/^-/,"")}function s(e,r,o,i){var s,a,l,u,d="modernizr",c=n("div"),p=function(){var e=t.body;return e||(e=n(C?"svg":"body"),e.fake=!0),e}();if(parseInt(o,10))for(;o--;)l=n("div"),l.id=i?i[o]:d+(o+1),c.appendChild(l);return s=n("style"),s.type="text/css",s.id="s"+d,(p.fake?p:c).appendChild(s),p.appendChild(c),s.styleSheet?s.styleSheet.cssText=e:s.appendChild(t.createTextNode(e)),c.id=d,p.fake&&(p.style.background="",p.style.overflow="hidden",u=b.style.overflow,b.style.overflow="hidden",b.appendChild(p)),a=r(c,e),p.fake?(p.parentNode.removeChild(p),b.style.overflow=u,b.offsetHeight):c.parentNode.removeChild(c),!!a}function a(e,t){return!!~(""+e).indexOf(t)}function l(e,t){return function(){return e.apply(t,arguments)}}function u(e){return e.replace(/([A-Z])/g,function(e,t){return"-"+t.toLowerCase()}).replace(/^ms-/,"-ms-")}function d(t,r,o){var n;if("getComputedStyle"in e){n=getComputedStyle.call(e,t,r);var i=e.console;if(null!==n)o&&(n=n.getPropertyValue(o));else if(i){i[i.error?"error":"log"].call(i,"getComputedStyle returning null, its possible modernizr test results are inaccurate")}}else n=!r&&t.currentStyle&&t.currentStyle[o];return n}function c(t,o){var n=t.length;if("CSS"in e&&"supports"in e.CSS){for(;n--;)if(e.CSS.supports(u(t[n]),o))return!0;return!1}if("CSSSupportsRule"in e){for(var i=[];n--;)i.push("("+u(t[n])+":"+o+")");return i=i.join(" or "),s("@supports ("+i+") { #modernizr { position: absolute; } }",function(e){return"absolute"==d(e,null,"position")})}return r}function p(e,t,s,l){function u(){p&&(delete P.style,delete P.modElem)}if(l=!o(l,"undefined")&&l,!o(s,"undefined")){var d=c(e,s);if(!o(d,"undefined"))return d}for(var p,f,m,y,h,v=["modernizr","tspan","samp"];!P.style&&v.length;)p=!0,P.modElem=n(v.shift()),P.style=P.modElem.style;for(m=e.length,f=0;m>f;f++)if(y=e[f],h=P.style[y],a(y,"-")&&(y=i(y)),P.style[y]!==r){if(l||o(s,"undefined"))return u(),"pfx"!=t||y;try{P.style[y]=s}catch(e){}if(P.style[y]!=h)return u(),"pfx"!=t||y}return u(),!1}function f(e,t,r,n,i){var s=e.charAt(0).toUpperCase()+e.slice(1),a=(e+" "+z.join(s+" ")+s).split(" ");return o(t,"string")||o(t,"undefined")?p(a,t,n,i):(a=(e+" "+T.join(s+" ")+s).split(" "),function(e,t,r){var n;for(var i in e)if(e[i]in t)return!1===r?e[i]:(n=t[e[i]],o(n,"function")?l(n,r||t):n);return!1}(a,t,r))}function m(e,t,o){return f(e,r,r,t,o)}var y=[],h=[],v={_version:"3.5.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var r=this;setTimeout(function(){t(r[e])},0)},addTest:function(e,t,r){h.push({name:e,fn:t,options:r})},addAsyncTest:function(e){h.push({name:null,fn:e})}},g=function(){};g.prototype=v,(g=new g).addTest("cookies",function(){try{t.cookie="cookietest=1";var e=-1!=t.cookie.indexOf("cookietest=");return t.cookie="cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT",e}catch(e){return!1}}),g.addTest("history",function(){var t=navigator.userAgent;return(-1===t.indexOf("Android 2.")&&-1===t.indexOf("Android 4.0")||-1===t.indexOf("Mobile Safari")||-1!==t.indexOf("Chrome")||-1!==t.indexOf("Windows Phone")||"file:"===location.protocol)&&(e.history&&"pushState"in e.history)});var w=!1;try{w="WebSocket"in e&&2===e.WebSocket.CLOSING}catch(e){}g.addTest("websockets",w),g.addTest("localstorage",function(){var e="modernizr";try{return localStorage.setItem(e,e),localStorage.removeItem(e),!0}catch(e){return!1}}),g.addTest("sessionstorage",function(){var e="modernizr";try{return sessionStorage.setItem(e,e),sessionStorage.removeItem(e),!0}catch(e){return!1}});var b=t.documentElement,C="svg"===b.nodeName.toLowerCase();g.addTest("canvas",function(){var e=n("canvas");return!(!e.getContext||!e.getContext("2d"))}),g.addTest("contenteditable",function(){if("contentEditable"in b){var e=n("div");return e.contentEditable=!0,"true"===e.contentEditable}});var S=function(){var t=e.matchMedia||e.msMatchMedia;return t?function(e){var r=t(e);return r&&r.matches||!1}:function(t){var r=!1;return s("@media "+t+" { #modernizr { position: absolute; } }",function(t){r="absolute"==(e.getComputedStyle?e.getComputedStyle(t,null):t.currentStyle).position}),r}}();v.mq=S,g.addTest("mediaqueries",S("only all"));var x="Moz O ms Webkit",z=v._config.usePrefixes?x.split(" "):[];v._cssomPrefixes=z;var M=function(t){var o,n=prefixes.length,i=e.CSSRule;if(void 0===i)return r;if(!t)return!1;if(t=t.replace(/^@/,""),(o=t.replace(/-/g,"_").toUpperCase()+"_RULE")in i)return"@"+t;for(var s=0;n>s;s++){var a=prefixes[s];if(a.toUpperCase()+"_"+o in i)return"@-"+a.toLowerCase()+"-"+t}return!1};v.atRule=M;var T=v._config.usePrefixes?x.toLowerCase().split(" "):[];v._domPrefixes=T;var k={elem:n("modernizr")};g._q.push(function(){delete k.elem});var P={style:k.elem.style};g._q.unshift(function(){delete P.style}),v.testAllProps=f,v.testAllProps=m,g.addTest("flexbox",m("flexBasis","1px",!0));var E=(v.prefixed=function(e,t,r){return 0===e.indexOf("@")?M(e):(-1!=e.indexOf("-")&&(e=i(e)),t?f(e,t,r):f(e,"pfx"))})("URL",e,!1);E=E&&e[E],g.addTest("bloburls",E&&"revokeObjectURL"in E&&"createObjectURL"in E),function(){var e,t,r,n,i,s,a;for(var l in h)if(h.hasOwnProperty(l)){if(e=[],(t=h[l]).name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(r=0;r<t.options.aliases.length;r++)e.push(t.options.aliases[r].toLowerCase());for(n=o(t.fn,"function")?t.fn():t.fn,i=0;i<e.length;i++)s=e[i],1===(a=s.split(".")).length?g[a[0]]=n:(!g[a[0]]||g[a[0]]instanceof Boolean||(g[a[0]]=new Boolean(g[a[0]])),g[a[0]][a[1]]=n),y.push((n?"":"no-")+a.join("-"))}}(),function(e){var t=b.className,r=g._config.classPrefix||"";if(C&&(t=t.baseVal),g._config.enableJSClass){var o=new RegExp("(^|\\s)"+r+"no-js(\\s|$)");t=t.replace(o,"$1"+r+"js$2")}g._config.enableClasses&&(t+=" "+r+e.join(" "+r),C?b.className.baseVal=t:b.className=t)}(y),delete v.addTest,delete v.addAsyncTest;for(var _=0;_<g._q.length;_++)g._q[_]();e.Modernizr=g}(window,document);var Browser={isPartiallySupported:function(){return Modernizr.bloburls&&Modernizr.cookies&&Modernizr.flexbox&&Modernizr.localstorage&&Modernizr.mediaqueries&&Modernizr.sessionstorage&&Modernizr.websockets},isFullySupported:function(){return this.isPartiallySupported()&&Modernizr.canvas&&Modernizr.contenteditable&&Modernizr.history},showErrorBar:function(){console.log("[Browser Support] ",Modernizr);var e=document.body.getAttribute("class");document.body.setAttribute("class","browser-error-bar "+(e||""));var t=document.body.innerHTML;document.body.innerHTML='<p class="browser-warning" onclick="this.parentNode.removeChild(this)"><span>You are using an outdated browser that is only partially supported by Coyo. Please update your browser to avoid any runtime problems. For more information visit <a href="https://www.coyoapp.com/">https://www.coyoapp.com/</a> or contact the <a href="https://support.mindsmash.com">Support Center</a>.</span></p>'+t},showErrorPage:function(){console.log("[Browser Support] ",Modernizr),document.body.setAttribute("class","browser-error-page"),document.body.removeAttribute("ng-class"),document.body.innerHTML='<h1>:(</h1><p>You are using an outdated browser that is not supported by Coyo. Please update your browser and try again. For more information about visit <a href="https://www.coyoapp.com/">https://www.coyoapp.com/</a> or contact the <a href="https://support.mindsmash.com">Support Center</a>.</p><p><small>User Agent: '+window.navigator.userAgent+"</small></p>"}};!function(){Browser.isPartiallySupported()?(Browser.isFullySupported()||Browser.showErrorBar(),angular.element(document).ready(function(){window.cordova?(console.log('Running in Cordova, starting the application once "deviceready" event fires.'),document.addEventListener("deviceready",function(){console.log('"deviceready" event has fired, starting Coyo now.'),angular.bootstrap(document,["coyo.app"],{strictDi:!0})},!1)):(console.log("Running in browser, starting Coyo now."),angular.bootstrap(document.body,["coyo.app"],{strictDi:!0}))})):Browser.showErrorPage()}();
//# sourceMappingURL=../maps/scripts/index-7f1ca15c92.js.map