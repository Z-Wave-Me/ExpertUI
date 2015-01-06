/*! jQuery v1.11.1 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */
!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=c.slice,e=c.concat,f=c.push,g=c.indexOf,h={},i=h.toString,j=h.hasOwnProperty,k={},l="1.11.1",m=function(a,b){return new m.fn.init(a,b)},n=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,o=/^-ms-/,p=/-([\da-z])/gi,q=function(a,b){return b.toUpperCase()};m.fn=m.prototype={jquery:l,constructor:m,selector:"",length:0,toArray:function(){return d.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:d.call(this)},pushStack:function(a){var b=m.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a,b){return m.each(this,a,b)},map:function(a){return this.pushStack(m.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(d.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:f,sort:c.sort,splice:c.splice},m.extend=m.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||m.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(e=arguments[h]))for(d in e)a=g[d],c=e[d],g!==c&&(j&&c&&(m.isPlainObject(c)||(b=m.isArray(c)))?(b?(b=!1,f=a&&m.isArray(a)?a:[]):f=a&&m.isPlainObject(a)?a:{},g[d]=m.extend(j,f,c)):void 0!==c&&(g[d]=c));return g},m.extend({expando:"jQuery"+(l+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===m.type(a)},isArray:Array.isArray||function(a){return"array"===m.type(a)},isWindow:function(a){return null!=a&&a==a.window},isNumeric:function(a){return!m.isArray(a)&&a-parseFloat(a)>=0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},isPlainObject:function(a){var b;if(!a||"object"!==m.type(a)||a.nodeType||m.isWindow(a))return!1;try{if(a.constructor&&!j.call(a,"constructor")&&!j.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}if(k.ownLast)for(b in a)return j.call(a,b);for(b in a);return void 0===b||j.call(a,b)},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?h[i.call(a)]||"object":typeof a},globalEval:function(b){b&&m.trim(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(o,"ms-").replace(p,q)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b,c){var d,e=0,f=a.length,g=r(a);if(c){if(g){for(;f>e;e++)if(d=b.apply(a[e],c),d===!1)break}else for(e in a)if(d=b.apply(a[e],c),d===!1)break}else if(g){for(;f>e;e++)if(d=b.call(a[e],e,a[e]),d===!1)break}else for(e in a)if(d=b.call(a[e],e,a[e]),d===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(n,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(r(Object(a))?m.merge(c,"string"==typeof a?[a]:a):f.call(c,a)),c},inArray:function(a,b,c){var d;if(b){if(g)return g.call(b,a,c);for(d=b.length,c=c?0>c?Math.max(0,d+c):c:0;d>c;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,b){var c=+b.length,d=0,e=a.length;while(c>d)a[e++]=b[d++];if(c!==c)while(void 0!==b[d])a[e++]=b[d++];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,f=0,g=a.length,h=r(a),i=[];if(h)for(;g>f;f++)d=b(a[f],f,c),null!=d&&i.push(d);else for(f in a)d=b(a[f],f,c),null!=d&&i.push(d);return e.apply([],i)},guid:1,proxy:function(a,b){var c,e,f;return"string"==typeof b&&(f=a[b],b=a,a=f),m.isFunction(a)?(c=d.call(arguments,2),e=function(){return a.apply(b||this,c.concat(d.call(arguments)))},e.guid=a.guid=a.guid||m.guid++,e):void 0},now:function(){return+new Date},support:k}),m.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(a,b){h["[object "+b+"]"]=b.toLowerCase()});function r(a){var b=a.length,c=m.type(a);return"function"===c||m.isWindow(a)?!1:1===a.nodeType&&b?!0:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var s=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+-new Date,v=a.document,w=0,x=0,y=gb(),z=gb(),A=gb(),B=function(a,b){return a===b&&(l=!0),0},C="undefined",D=1<<31,E={}.hasOwnProperty,F=[],G=F.pop,H=F.push,I=F.push,J=F.slice,K=F.indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(this[b]===a)return b;return-1},L="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",N="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",O=N.replace("w","w#"),P="\\["+M+"*("+N+")(?:"+M+"*([*^$|!~]?=)"+M+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+O+"))|)"+M+"*\\]",Q=":("+N+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+P+")*)|.*)\\)|)",R=new RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),S=new RegExp("^"+M+"*,"+M+"*"),T=new RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),U=new RegExp("="+M+"*([^\\]'\"]*?)"+M+"*\\]","g"),V=new RegExp(Q),W=new RegExp("^"+O+"$"),X={ID:new RegExp("^#("+N+")"),CLASS:new RegExp("^\\.("+N+")"),TAG:new RegExp("^("+N.replace("w","w*")+")"),ATTR:new RegExp("^"+P),PSEUDO:new RegExp("^"+Q),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:new RegExp("^(?:"+L+")$","i"),needsContext:new RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},Y=/^(?:input|select|textarea|button)$/i,Z=/^h\d$/i,$=/^[^{]+\{\s*\[native \w/,_=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ab=/[+~]/,bb=/'|\\/g,cb=new RegExp("\\\\([\\da-f]{1,6}"+M+"?|("+M+")|.)","ig"),db=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)};try{I.apply(F=J.call(v.childNodes),v.childNodes),F[v.childNodes.length].nodeType}catch(eb){I={apply:F.length?function(a,b){H.apply(a,J.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function fb(a,b,d,e){var f,h,j,k,l,o,r,s,w,x;if((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,d=d||[],!a||"string"!=typeof a)return d;if(1!==(k=b.nodeType)&&9!==k)return[];if(p&&!e){if(f=_.exec(a))if(j=f[1]){if(9===k){if(h=b.getElementById(j),!h||!h.parentNode)return d;if(h.id===j)return d.push(h),d}else if(b.ownerDocument&&(h=b.ownerDocument.getElementById(j))&&t(b,h)&&h.id===j)return d.push(h),d}else{if(f[2])return I.apply(d,b.getElementsByTagName(a)),d;if((j=f[3])&&c.getElementsByClassName&&b.getElementsByClassName)return I.apply(d,b.getElementsByClassName(j)),d}if(c.qsa&&(!q||!q.test(a))){if(s=r=u,w=b,x=9===k&&a,1===k&&"object"!==b.nodeName.toLowerCase()){o=g(a),(r=b.getAttribute("id"))?s=r.replace(bb,"\\$&"):b.setAttribute("id",s),s="[id='"+s+"'] ",l=o.length;while(l--)o[l]=s+qb(o[l]);w=ab.test(a)&&ob(b.parentNode)||b,x=o.join(",")}if(x)try{return I.apply(d,w.querySelectorAll(x)),d}catch(y){}finally{r||b.removeAttribute("id")}}}return i(a.replace(R,"$1"),b,d,e)}function gb(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function hb(a){return a[u]=!0,a}function ib(a){var b=n.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function jb(a,b){var c=a.split("|"),e=a.length;while(e--)d.attrHandle[c[e]]=b}function kb(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||D)-(~a.sourceIndex||D);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function lb(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function mb(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function nb(a){return hb(function(b){return b=+b,hb(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function ob(a){return a&&typeof a.getElementsByTagName!==C&&a}c=fb.support={},f=fb.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=fb.setDocument=function(a){var b,e=a?a.ownerDocument||a:v,g=e.defaultView;return e!==n&&9===e.nodeType&&e.documentElement?(n=e,o=e.documentElement,p=!f(e),g&&g!==g.top&&(g.addEventListener?g.addEventListener("unload",function(){m()},!1):g.attachEvent&&g.attachEvent("onunload",function(){m()})),c.attributes=ib(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ib(function(a){return a.appendChild(e.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=$.test(e.getElementsByClassName)&&ib(function(a){return a.innerHTML="<div class='a'></div><div class='a i'></div>",a.firstChild.className="i",2===a.getElementsByClassName("i").length}),c.getById=ib(function(a){return o.appendChild(a).id=u,!e.getElementsByName||!e.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if(typeof b.getElementById!==C&&p){var c=b.getElementById(a);return c&&c.parentNode?[c]:[]}},d.filter.ID=function(a){var b=a.replace(cb,db);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(cb,db);return function(a){var c=typeof a.getAttributeNode!==C&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return typeof b.getElementsByTagName!==C?b.getElementsByTagName(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return typeof b.getElementsByClassName!==C&&p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=$.test(e.querySelectorAll))&&(ib(function(a){a.innerHTML="<select msallowclip=''><option selected=''></option></select>",a.querySelectorAll("[msallowclip^='']").length&&q.push("[*^$]="+M+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+M+"*(?:value|"+L+")"),a.querySelectorAll(":checked").length||q.push(":checked")}),ib(function(a){var b=e.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+M+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=$.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ib(function(a){c.disconnectedMatch=s.call(a,"div"),s.call(a,"[s!='']:x"),r.push("!=",Q)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=$.test(o.compareDocumentPosition),t=b||$.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===e||a.ownerDocument===v&&t(v,a)?-1:b===e||b.ownerDocument===v&&t(v,b)?1:k?K.call(k,a)-K.call(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,f=a.parentNode,g=b.parentNode,h=[a],i=[b];if(!f||!g)return a===e?-1:b===e?1:f?-1:g?1:k?K.call(k,a)-K.call(k,b):0;if(f===g)return kb(a,b);c=a;while(c=c.parentNode)h.unshift(c);c=b;while(c=c.parentNode)i.unshift(c);while(h[d]===i[d])d++;return d?kb(h[d],i[d]):h[d]===v?-1:i[d]===v?1:0},e):n},fb.matches=function(a,b){return fb(a,null,null,b)},fb.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(U,"='$1']"),!(!c.matchesSelector||!p||r&&r.test(b)||q&&q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return fb(b,n,null,[a]).length>0},fb.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},fb.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&E.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},fb.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},fb.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=fb.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=fb.selectors={cacheLength:50,createPseudo:hb,match:X,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(cb,db),a[3]=(a[3]||a[4]||a[5]||"").replace(cb,db),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||fb.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&fb.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return X.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&V.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(cb,db).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+M+")"+a+"("+M+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||typeof a.getAttribute!==C&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=fb.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h;if(q){if(f){while(p){l=b;while(l=l[p])if(h?l.nodeName.toLowerCase()===r:1===l.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){k=q[u]||(q[u]={}),j=k[a]||[],n=j[0]===w&&j[1],m=j[0]===w&&j[2],l=n&&q.childNodes[n];while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if(1===l.nodeType&&++m&&l===b){k[a]=[w,n,m];break}}else if(s&&(j=(b[u]||(b[u]={}))[a])&&j[0]===w)m=j[1];else while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if((h?l.nodeName.toLowerCase()===r:1===l.nodeType)&&++m&&(s&&((l[u]||(l[u]={}))[a]=[w,m]),l===b))break;return m-=e,m===d||m%d===0&&m/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||fb.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?hb(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=K.call(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:hb(function(a){var b=[],c=[],d=h(a.replace(R,"$1"));return d[u]?hb(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),!c.pop()}}),has:hb(function(a){return function(b){return fb(a,b).length>0}}),contains:hb(function(a){return function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:hb(function(a){return W.test(a||"")||fb.error("unsupported lang: "+a),a=a.replace(cb,db).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return Z.test(a.nodeName)},input:function(a){return Y.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:nb(function(){return[0]}),last:nb(function(a,b){return[b-1]}),eq:nb(function(a,b,c){return[0>c?c+b:c]}),even:nb(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:nb(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:nb(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:nb(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=lb(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=mb(b);function pb(){}pb.prototype=d.filters=d.pseudos,d.setFilters=new pb,g=fb.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){(!c||(e=S.exec(h)))&&(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=T.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(R," ")}),h=h.slice(c.length));for(g in d.filter)!(e=X[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?fb.error(a):z(a,i).slice(0)};function qb(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function rb(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=x++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j=[w,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(i=b[u]||(b[u]={}),(h=i[d])&&h[0]===w&&h[1]===f)return j[2]=h[2];if(i[d]=j,j[2]=a(b,c,g))return!0}}}function sb(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function tb(a,b,c){for(var d=0,e=b.length;e>d;d++)fb(a,b[d],c);return c}function ub(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function vb(a,b,c,d,e,f){return d&&!d[u]&&(d=vb(d)),e&&!e[u]&&(e=vb(e,f)),hb(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||tb(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:ub(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=ub(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?K.call(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=ub(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):I.apply(g,r)})}function wb(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=rb(function(a){return a===b},h,!0),l=rb(function(a){return K.call(b,a)>-1},h,!0),m=[function(a,c,d){return!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d))}];f>i;i++)if(c=d.relative[a[i].type])m=[rb(sb(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return vb(i>1&&sb(m),i>1&&qb(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(R,"$1"),c,e>i&&wb(a.slice(i,e)),f>e&&wb(a=a.slice(e)),f>e&&qb(a))}m.push(c)}return sb(m)}function xb(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,m,o,p=0,q="0",r=f&&[],s=[],t=j,u=f||e&&d.find.TAG("*",k),v=w+=null==t?1:Math.random()||.1,x=u.length;for(k&&(j=g!==n&&g);q!==x&&null!=(l=u[q]);q++){if(e&&l){m=0;while(o=a[m++])if(o(l,g,h)){i.push(l);break}k&&(w=v)}c&&((l=!o&&l)&&p--,f&&r.push(l))}if(p+=q,c&&q!==p){m=0;while(o=b[m++])o(r,s,g,h);if(f){if(p>0)while(q--)r[q]||s[q]||(s[q]=G.call(i));s=ub(s)}I.apply(i,s),k&&!f&&s.length>0&&p+b.length>1&&fb.uniqueSort(i)}return k&&(w=v,j=t),r};return c?hb(f):f}return h=fb.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=wb(b[c]),f[u]?d.push(f):e.push(f);f=A(a,xb(e,d)),f.selector=a}return f},i=fb.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(cb,db),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=X.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(cb,db),ab.test(j[0].type)&&ob(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&qb(j),!a)return I.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,ab.test(a)&&ob(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ib(function(a){return 1&a.compareDocumentPosition(n.createElement("div"))}),ib(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||jb("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ib(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||jb("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),ib(function(a){return null==a.getAttribute("disabled")})||jb(L,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),fb}(a);m.find=s,m.expr=s.selectors,m.expr[":"]=m.expr.pseudos,m.unique=s.uniqueSort,m.text=s.getText,m.isXMLDoc=s.isXML,m.contains=s.contains;var t=m.expr.match.needsContext,u=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,v=/^.[^:#\[\.,]*$/;function w(a,b,c){if(m.isFunction(b))return m.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return m.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(v.test(b))return m.filter(b,a,c);b=m.filter(b,a)}return m.grep(a,function(a){return m.inArray(a,b)>=0!==c})}m.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?m.find.matchesSelector(d,a)?[d]:[]:m.find.matches(a,m.grep(b,function(a){return 1===a.nodeType}))},m.fn.extend({find:function(a){var b,c=[],d=this,e=d.length;if("string"!=typeof a)return this.pushStack(m(a).filter(function(){for(b=0;e>b;b++)if(m.contains(d[b],this))return!0}));for(b=0;e>b;b++)m.find(a,d[b],c);return c=this.pushStack(e>1?m.unique(c):c),c.selector=this.selector?this.selector+" "+a:a,c},filter:function(a){return this.pushStack(w(this,a||[],!1))},not:function(a){return this.pushStack(w(this,a||[],!0))},is:function(a){return!!w(this,"string"==typeof a&&t.test(a)?m(a):a||[],!1).length}});var x,y=a.document,z=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,A=m.fn.init=function(a,b){var c,d;if(!a)return this;if("string"==typeof a){if(c="<"===a.charAt(0)&&">"===a.charAt(a.length-1)&&a.length>=3?[null,a,null]:z.exec(a),!c||!c[1]&&b)return!b||b.jquery?(b||x).find(a):this.constructor(b).find(a);if(c[1]){if(b=b instanceof m?b[0]:b,m.merge(this,m.parseHTML(c[1],b&&b.nodeType?b.ownerDocument||b:y,!0)),u.test(c[1])&&m.isPlainObject(b))for(c in b)m.isFunction(this[c])?this[c](b[c]):this.attr(c,b[c]);return this}if(d=y.getElementById(c[2]),d&&d.parentNode){if(d.id!==c[2])return x.find(a);this.length=1,this[0]=d}return this.context=y,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):m.isFunction(a)?"undefined"!=typeof x.ready?x.ready(a):a(m):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),m.makeArray(a,this))};A.prototype=m.fn,x=m(y);var B=/^(?:parents|prev(?:Until|All))/,C={children:!0,contents:!0,next:!0,prev:!0};m.extend({dir:function(a,b,c){var d=[],e=a[b];while(e&&9!==e.nodeType&&(void 0===c||1!==e.nodeType||!m(e).is(c)))1===e.nodeType&&d.push(e),e=e[b];return d},sibling:function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c}}),m.fn.extend({has:function(a){var b,c=m(a,this),d=c.length;return this.filter(function(){for(b=0;d>b;b++)if(m.contains(this,c[b]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=t.test(a)||"string"!=typeof a?m(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&m.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?m.unique(f):f)},index:function(a){return a?"string"==typeof a?m.inArray(this[0],m(a)):m.inArray(a.jquery?a[0]:a,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(m.unique(m.merge(this.get(),m(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function D(a,b){do a=a[b];while(a&&1!==a.nodeType);return a}m.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return m.dir(a,"parentNode")},parentsUntil:function(a,b,c){return m.dir(a,"parentNode",c)},next:function(a){return D(a,"nextSibling")},prev:function(a){return D(a,"previousSibling")},nextAll:function(a){return m.dir(a,"nextSibling")},prevAll:function(a){return m.dir(a,"previousSibling")},nextUntil:function(a,b,c){return m.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return m.dir(a,"previousSibling",c)},siblings:function(a){return m.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return m.sibling(a.firstChild)},contents:function(a){return m.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:m.merge([],a.childNodes)}},function(a,b){m.fn[a]=function(c,d){var e=m.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=m.filter(d,e)),this.length>1&&(C[a]||(e=m.unique(e)),B.test(a)&&(e=e.reverse())),this.pushStack(e)}});var E=/\S+/g,F={};function G(a){var b=F[a]={};return m.each(a.match(E)||[],function(a,c){b[c]=!0}),b}m.Callbacks=function(a){a="string"==typeof a?F[a]||G(a):m.extend({},a);var b,c,d,e,f,g,h=[],i=!a.once&&[],j=function(l){for(c=a.memory&&l,d=!0,f=g||0,g=0,e=h.length,b=!0;h&&e>f;f++)if(h[f].apply(l[0],l[1])===!1&&a.stopOnFalse){c=!1;break}b=!1,h&&(i?i.length&&j(i.shift()):c?h=[]:k.disable())},k={add:function(){if(h){var d=h.length;!function f(b){m.each(b,function(b,c){var d=m.type(c);"function"===d?a.unique&&k.has(c)||h.push(c):c&&c.length&&"string"!==d&&f(c)})}(arguments),b?e=h.length:c&&(g=d,j(c))}return this},remove:function(){return h&&m.each(arguments,function(a,c){var d;while((d=m.inArray(c,h,d))>-1)h.splice(d,1),b&&(e>=d&&e--,f>=d&&f--)}),this},has:function(a){return a?m.inArray(a,h)>-1:!(!h||!h.length)},empty:function(){return h=[],e=0,this},disable:function(){return h=i=c=void 0,this},disabled:function(){return!h},lock:function(){return i=void 0,c||k.disable(),this},locked:function(){return!i},fireWith:function(a,c){return!h||d&&!i||(c=c||[],c=[a,c.slice?c.slice():c],b?i.push(c):j(c)),this},fire:function(){return k.fireWith(this,arguments),this},fired:function(){return!!d}};return k},m.extend({Deferred:function(a){var b=[["resolve","done",m.Callbacks("once memory"),"resolved"],["reject","fail",m.Callbacks("once memory"),"rejected"],["notify","progress",m.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return m.Deferred(function(c){m.each(b,function(b,f){var g=m.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&m.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?m.extend(a,d):d}},e={};return d.pipe=d.then,m.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=d.call(arguments),e=c.length,f=1!==e||a&&m.isFunction(a.promise)?e:0,g=1===f?a:m.Deferred(),h=function(a,b,c){return function(e){b[a]=this,c[a]=arguments.length>1?d.call(arguments):e,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(e>1)for(i=new Array(e),j=new Array(e),k=new Array(e);e>b;b++)c[b]&&m.isFunction(c[b].promise)?c[b].promise().done(h(b,k,c)).fail(g.reject).progress(h(b,j,i)):--f;return f||g.resolveWith(k,c),g.promise()}});var H;m.fn.ready=function(a){return m.ready.promise().done(a),this},m.extend({isReady:!1,readyWait:1,holdReady:function(a){a?m.readyWait++:m.ready(!0)},ready:function(a){if(a===!0?!--m.readyWait:!m.isReady){if(!y.body)return setTimeout(m.ready);m.isReady=!0,a!==!0&&--m.readyWait>0||(H.resolveWith(y,[m]),m.fn.triggerHandler&&(m(y).triggerHandler("ready"),m(y).off("ready")))}}});function I(){y.addEventListener?(y.removeEventListener("DOMContentLoaded",J,!1),a.removeEventListener("load",J,!1)):(y.detachEvent("onreadystatechange",J),a.detachEvent("onload",J))}function J(){(y.addEventListener||"load"===event.type||"complete"===y.readyState)&&(I(),m.ready())}m.ready.promise=function(b){if(!H)if(H=m.Deferred(),"complete"===y.readyState)setTimeout(m.ready);else if(y.addEventListener)y.addEventListener("DOMContentLoaded",J,!1),a.addEventListener("load",J,!1);else{y.attachEvent("onreadystatechange",J),a.attachEvent("onload",J);var c=!1;try{c=null==a.frameElement&&y.documentElement}catch(d){}c&&c.doScroll&&!function e(){if(!m.isReady){try{c.doScroll("left")}catch(a){return setTimeout(e,50)}I(),m.ready()}}()}return H.promise(b)};var K="undefined",L;for(L in m(k))break;k.ownLast="0"!==L,k.inlineBlockNeedsLayout=!1,m(function(){var a,b,c,d;c=y.getElementsByTagName("body")[0],c&&c.style&&(b=y.createElement("div"),d=y.createElement("div"),d.style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px",c.appendChild(d).appendChild(b),typeof b.style.zoom!==K&&(b.style.cssText="display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1",k.inlineBlockNeedsLayout=a=3===b.offsetWidth,a&&(c.style.zoom=1)),c.removeChild(d))}),function(){var a=y.createElement("div");if(null==k.deleteExpando){k.deleteExpando=!0;try{delete a.test}catch(b){k.deleteExpando=!1}}a=null}(),m.acceptData=function(a){var b=m.noData[(a.nodeName+" ").toLowerCase()],c=+a.nodeType||1;return 1!==c&&9!==c?!1:!b||b!==!0&&a.getAttribute("classid")===b};var M=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,N=/([A-Z])/g;function O(a,b,c){if(void 0===c&&1===a.nodeType){var d="data-"+b.replace(N,"-$1").toLowerCase();if(c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:M.test(c)?m.parseJSON(c):c}catch(e){}m.data(a,b,c)}else c=void 0}return c}function P(a){var b;for(b in a)if(("data"!==b||!m.isEmptyObject(a[b]))&&"toJSON"!==b)return!1;return!0}function Q(a,b,d,e){if(m.acceptData(a)){var f,g,h=m.expando,i=a.nodeType,j=i?m.cache:a,k=i?a[h]:a[h]&&h;
if(k&&j[k]&&(e||j[k].data)||void 0!==d||"string"!=typeof b)return k||(k=i?a[h]=c.pop()||m.guid++:h),j[k]||(j[k]=i?{}:{toJSON:m.noop}),("object"==typeof b||"function"==typeof b)&&(e?j[k]=m.extend(j[k],b):j[k].data=m.extend(j[k].data,b)),g=j[k],e||(g.data||(g.data={}),g=g.data),void 0!==d&&(g[m.camelCase(b)]=d),"string"==typeof b?(f=g[b],null==f&&(f=g[m.camelCase(b)])):f=g,f}}function R(a,b,c){if(m.acceptData(a)){var d,e,f=a.nodeType,g=f?m.cache:a,h=f?a[m.expando]:m.expando;if(g[h]){if(b&&(d=c?g[h]:g[h].data)){m.isArray(b)?b=b.concat(m.map(b,m.camelCase)):b in d?b=[b]:(b=m.camelCase(b),b=b in d?[b]:b.split(" ")),e=b.length;while(e--)delete d[b[e]];if(c?!P(d):!m.isEmptyObject(d))return}(c||(delete g[h].data,P(g[h])))&&(f?m.cleanData([a],!0):k.deleteExpando||g!=g.window?delete g[h]:g[h]=null)}}}m.extend({cache:{},noData:{"applet ":!0,"embed ":!0,"object ":"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(a){return a=a.nodeType?m.cache[a[m.expando]]:a[m.expando],!!a&&!P(a)},data:function(a,b,c){return Q(a,b,c)},removeData:function(a,b){return R(a,b)},_data:function(a,b,c){return Q(a,b,c,!0)},_removeData:function(a,b){return R(a,b,!0)}}),m.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=m.data(f),1===f.nodeType&&!m._data(f,"parsedAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=m.camelCase(d.slice(5)),O(f,d,e[d])));m._data(f,"parsedAttrs",!0)}return e}return"object"==typeof a?this.each(function(){m.data(this,a)}):arguments.length>1?this.each(function(){m.data(this,a,b)}):f?O(f,a,m.data(f,a)):void 0},removeData:function(a){return this.each(function(){m.removeData(this,a)})}}),m.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=m._data(a,b),c&&(!d||m.isArray(c)?d=m._data(a,b,m.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=m.queue(a,b),d=c.length,e=c.shift(),f=m._queueHooks(a,b),g=function(){m.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return m._data(a,c)||m._data(a,c,{empty:m.Callbacks("once memory").add(function(){m._removeData(a,b+"queue"),m._removeData(a,c)})})}}),m.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?m.queue(this[0],a):void 0===b?this:this.each(function(){var c=m.queue(this,a,b);m._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&m.dequeue(this,a)})},dequeue:function(a){return this.each(function(){m.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=m.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=m._data(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var S=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,T=["Top","Right","Bottom","Left"],U=function(a,b){return a=b||a,"none"===m.css(a,"display")||!m.contains(a.ownerDocument,a)},V=m.access=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===m.type(c)){e=!0;for(h in c)m.access(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,m.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(m(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},W=/^(?:checkbox|radio)$/i;!function(){var a=y.createElement("input"),b=y.createElement("div"),c=y.createDocumentFragment();if(b.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",k.leadingWhitespace=3===b.firstChild.nodeType,k.tbody=!b.getElementsByTagName("tbody").length,k.htmlSerialize=!!b.getElementsByTagName("link").length,k.html5Clone="<:nav></:nav>"!==y.createElement("nav").cloneNode(!0).outerHTML,a.type="checkbox",a.checked=!0,c.appendChild(a),k.appendChecked=a.checked,b.innerHTML="<textarea>x</textarea>",k.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue,c.appendChild(b),b.innerHTML="<input type='radio' checked='checked' name='t'/>",k.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,k.noCloneEvent=!0,b.attachEvent&&(b.attachEvent("onclick",function(){k.noCloneEvent=!1}),b.cloneNode(!0).click()),null==k.deleteExpando){k.deleteExpando=!0;try{delete b.test}catch(d){k.deleteExpando=!1}}}(),function(){var b,c,d=y.createElement("div");for(b in{submit:!0,change:!0,focusin:!0})c="on"+b,(k[b+"Bubbles"]=c in a)||(d.setAttribute(c,"t"),k[b+"Bubbles"]=d.attributes[c].expando===!1);d=null}();var X=/^(?:input|select|textarea)$/i,Y=/^key/,Z=/^(?:mouse|pointer|contextmenu)|click/,$=/^(?:focusinfocus|focusoutblur)$/,_=/^([^.]*)(?:\.(.+)|)$/;function ab(){return!0}function bb(){return!1}function cb(){try{return y.activeElement}catch(a){}}m.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,n,o,p,q,r=m._data(a);if(r){c.handler&&(i=c,c=i.handler,e=i.selector),c.guid||(c.guid=m.guid++),(g=r.events)||(g=r.events={}),(k=r.handle)||(k=r.handle=function(a){return typeof m===K||a&&m.event.triggered===a.type?void 0:m.event.dispatch.apply(k.elem,arguments)},k.elem=a),b=(b||"").match(E)||[""],h=b.length;while(h--)f=_.exec(b[h])||[],o=q=f[1],p=(f[2]||"").split(".").sort(),o&&(j=m.event.special[o]||{},o=(e?j.delegateType:j.bindType)||o,j=m.event.special[o]||{},l=m.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&m.expr.match.needsContext.test(e),namespace:p.join(".")},i),(n=g[o])||(n=g[o]=[],n.delegateCount=0,j.setup&&j.setup.call(a,d,p,k)!==!1||(a.addEventListener?a.addEventListener(o,k,!1):a.attachEvent&&a.attachEvent("on"+o,k))),j.add&&(j.add.call(a,l),l.handler.guid||(l.handler.guid=c.guid)),e?n.splice(n.delegateCount++,0,l):n.push(l),m.event.global[o]=!0);a=null}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,n,o,p,q,r=m.hasData(a)&&m._data(a);if(r&&(k=r.events)){b=(b||"").match(E)||[""],j=b.length;while(j--)if(h=_.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o){l=m.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,n=k[o]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),i=f=n.length;while(f--)g=n[f],!e&&q!==g.origType||c&&c.guid!==g.guid||h&&!h.test(g.namespace)||d&&d!==g.selector&&("**"!==d||!g.selector)||(n.splice(f,1),g.selector&&n.delegateCount--,l.remove&&l.remove.call(a,g));i&&!n.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||m.removeEvent(a,o,r.handle),delete k[o])}else for(o in k)m.event.remove(a,o+b[j],c,d,!0);m.isEmptyObject(k)&&(delete r.handle,m._removeData(a,"events"))}},trigger:function(b,c,d,e){var f,g,h,i,k,l,n,o=[d||y],p=j.call(b,"type")?b.type:b,q=j.call(b,"namespace")?b.namespace.split("."):[];if(h=l=d=d||y,3!==d.nodeType&&8!==d.nodeType&&!$.test(p+m.event.triggered)&&(p.indexOf(".")>=0&&(q=p.split("."),p=q.shift(),q.sort()),g=p.indexOf(":")<0&&"on"+p,b=b[m.expando]?b:new m.Event(p,"object"==typeof b&&b),b.isTrigger=e?2:3,b.namespace=q.join("."),b.namespace_re=b.namespace?new RegExp("(^|\\.)"+q.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=d),c=null==c?[b]:m.makeArray(c,[b]),k=m.event.special[p]||{},e||!k.trigger||k.trigger.apply(d,c)!==!1)){if(!e&&!k.noBubble&&!m.isWindow(d)){for(i=k.delegateType||p,$.test(i+p)||(h=h.parentNode);h;h=h.parentNode)o.push(h),l=h;l===(d.ownerDocument||y)&&o.push(l.defaultView||l.parentWindow||a)}n=0;while((h=o[n++])&&!b.isPropagationStopped())b.type=n>1?i:k.bindType||p,f=(m._data(h,"events")||{})[b.type]&&m._data(h,"handle"),f&&f.apply(h,c),f=g&&h[g],f&&f.apply&&m.acceptData(h)&&(b.result=f.apply(h,c),b.result===!1&&b.preventDefault());if(b.type=p,!e&&!b.isDefaultPrevented()&&(!k._default||k._default.apply(o.pop(),c)===!1)&&m.acceptData(d)&&g&&d[p]&&!m.isWindow(d)){l=d[g],l&&(d[g]=null),m.event.triggered=p;try{d[p]()}catch(r){}m.event.triggered=void 0,l&&(d[g]=l)}return b.result}},dispatch:function(a){a=m.event.fix(a);var b,c,e,f,g,h=[],i=d.call(arguments),j=(m._data(this,"events")||{})[a.type]||[],k=m.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=m.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,g=0;while((e=f.handlers[g++])&&!a.isImmediatePropagationStopped())(!a.namespace_re||a.namespace_re.test(e.namespace))&&(a.handleObj=e,a.data=e.data,c=((m.event.special[e.origType]||{}).handle||e.handler).apply(f.elem,i),void 0!==c&&(a.result=c)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&(!a.button||"click"!==a.type))for(;i!=this;i=i.parentNode||this)if(1===i.nodeType&&(i.disabled!==!0||"click"!==a.type)){for(e=[],f=0;h>f;f++)d=b[f],c=d.selector+" ",void 0===e[c]&&(e[c]=d.needsContext?m(c,this).index(i)>=0:m.find(c,this,null,[i]).length),e[c]&&e.push(d);e.length&&g.push({elem:i,handlers:e})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},fix:function(a){if(a[m.expando])return a;var b,c,d,e=a.type,f=a,g=this.fixHooks[e];g||(this.fixHooks[e]=g=Z.test(e)?this.mouseHooks:Y.test(e)?this.keyHooks:{}),d=g.props?this.props.concat(g.props):this.props,a=new m.Event(f),b=d.length;while(b--)c=d[b],a[c]=f[c];return a.target||(a.target=f.srcElement||y),3===a.target.nodeType&&(a.target=a.target.parentNode),a.metaKey=!!a.metaKey,g.filter?g.filter(a,f):a},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,d,e,f=b.button,g=b.fromElement;return null==a.pageX&&null!=b.clientX&&(d=a.target.ownerDocument||y,e=d.documentElement,c=d.body,a.pageX=b.clientX+(e&&e.scrollLeft||c&&c.scrollLeft||0)-(e&&e.clientLeft||c&&c.clientLeft||0),a.pageY=b.clientY+(e&&e.scrollTop||c&&c.scrollTop||0)-(e&&e.clientTop||c&&c.clientTop||0)),!a.relatedTarget&&g&&(a.relatedTarget=g===a.target?b.toElement:g),a.which||void 0===f||(a.which=1&f?1:2&f?3:4&f?2:0),a}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==cb()&&this.focus)try{return this.focus(),!1}catch(a){}},delegateType:"focusin"},blur:{trigger:function(){return this===cb()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return m.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):void 0},_default:function(a){return m.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c,d){var e=m.extend(new m.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?m.event.trigger(e,null,b):m.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},m.removeEvent=y.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){var d="on"+b;a.detachEvent&&(typeof a[d]===K&&(a[d]=null),a.detachEvent(d,c))},m.Event=function(a,b){return this instanceof m.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?ab:bb):this.type=a,b&&m.extend(this,b),this.timeStamp=a&&a.timeStamp||m.now(),void(this[m.expando]=!0)):new m.Event(a,b)},m.Event.prototype={isDefaultPrevented:bb,isPropagationStopped:bb,isImmediatePropagationStopped:bb,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=ab,a&&(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=ab,a&&(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=ab,a&&a.stopImmediatePropagation&&a.stopImmediatePropagation(),this.stopPropagation()}},m.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){m.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return(!e||e!==d&&!m.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),k.submitBubbles||(m.event.special.submit={setup:function(){return m.nodeName(this,"form")?!1:void m.event.add(this,"click._submit keypress._submit",function(a){var b=a.target,c=m.nodeName(b,"input")||m.nodeName(b,"button")?b.form:void 0;c&&!m._data(c,"submitBubbles")&&(m.event.add(c,"submit._submit",function(a){a._submit_bubble=!0}),m._data(c,"submitBubbles",!0))})},postDispatch:function(a){a._submit_bubble&&(delete a._submit_bubble,this.parentNode&&!a.isTrigger&&m.event.simulate("submit",this.parentNode,a,!0))},teardown:function(){return m.nodeName(this,"form")?!1:void m.event.remove(this,"._submit")}}),k.changeBubbles||(m.event.special.change={setup:function(){return X.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(m.event.add(this,"propertychange._change",function(a){"checked"===a.originalEvent.propertyName&&(this._just_changed=!0)}),m.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1),m.event.simulate("change",this,a,!0)})),!1):void m.event.add(this,"beforeactivate._change",function(a){var b=a.target;X.test(b.nodeName)&&!m._data(b,"changeBubbles")&&(m.event.add(b,"change._change",function(a){!this.parentNode||a.isSimulated||a.isTrigger||m.event.simulate("change",this.parentNode,a,!0)}),m._data(b,"changeBubbles",!0))})},handle:function(a){var b=a.target;return this!==b||a.isSimulated||a.isTrigger||"radio"!==b.type&&"checkbox"!==b.type?a.handleObj.handler.apply(this,arguments):void 0},teardown:function(){return m.event.remove(this,"._change"),!X.test(this.nodeName)}}),k.focusinBubbles||m.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){m.event.simulate(b,a.target,m.event.fix(a),!0)};m.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=m._data(d,b);e||d.addEventListener(a,c,!0),m._data(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=m._data(d,b)-1;e?m._data(d,b,e):(d.removeEventListener(a,c,!0),m._removeData(d,b))}}}),m.fn.extend({on:function(a,b,c,d,e){var f,g;if("object"==typeof a){"string"!=typeof b&&(c=c||b,b=void 0);for(f in a)this.on(f,b,c,a[f],e);return this}if(null==c&&null==d?(d=b,c=b=void 0):null==d&&("string"==typeof b?(d=c,c=void 0):(d=c,c=b,b=void 0)),d===!1)d=bb;else if(!d)return this;return 1===e&&(g=d,d=function(a){return m().off(a),g.apply(this,arguments)},d.guid=g.guid||(g.guid=m.guid++)),this.each(function(){m.event.add(this,a,d,c,b)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,m(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return(b===!1||"function"==typeof b)&&(c=b,b=void 0),c===!1&&(c=bb),this.each(function(){m.event.remove(this,a,c,b)})},trigger:function(a,b){return this.each(function(){m.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?m.event.trigger(a,b,c,!0):void 0}});function db(a){var b=eb.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}var eb="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",fb=/ jQuery\d+="(?:null|\d+)"/g,gb=new RegExp("<(?:"+eb+")[\\s/>]","i"),hb=/^\s+/,ib=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,jb=/<([\w:]+)/,kb=/<tbody/i,lb=/<|&#?\w+;/,mb=/<(?:script|style|link)/i,nb=/checked\s*(?:[^=]|=\s*.checked.)/i,ob=/^$|\/(?:java|ecma)script/i,pb=/^true\/(.*)/,qb=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,rb={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:k.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},sb=db(y),tb=sb.appendChild(y.createElement("div"));rb.optgroup=rb.option,rb.tbody=rb.tfoot=rb.colgroup=rb.caption=rb.thead,rb.th=rb.td;function ub(a,b){var c,d,e=0,f=typeof a.getElementsByTagName!==K?a.getElementsByTagName(b||"*"):typeof a.querySelectorAll!==K?a.querySelectorAll(b||"*"):void 0;if(!f)for(f=[],c=a.childNodes||a;null!=(d=c[e]);e++)!b||m.nodeName(d,b)?f.push(d):m.merge(f,ub(d,b));return void 0===b||b&&m.nodeName(a,b)?m.merge([a],f):f}function vb(a){W.test(a.type)&&(a.defaultChecked=a.checked)}function wb(a,b){return m.nodeName(a,"table")&&m.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function xb(a){return a.type=(null!==m.find.attr(a,"type"))+"/"+a.type,a}function yb(a){var b=pb.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function zb(a,b){for(var c,d=0;null!=(c=a[d]);d++)m._data(c,"globalEval",!b||m._data(b[d],"globalEval"))}function Ab(a,b){if(1===b.nodeType&&m.hasData(a)){var c,d,e,f=m._data(a),g=m._data(b,f),h=f.events;if(h){delete g.handle,g.events={};for(c in h)for(d=0,e=h[c].length;e>d;d++)m.event.add(b,c,h[c][d])}g.data&&(g.data=m.extend({},g.data))}}function Bb(a,b){var c,d,e;if(1===b.nodeType){if(c=b.nodeName.toLowerCase(),!k.noCloneEvent&&b[m.expando]){e=m._data(b);for(d in e.events)m.removeEvent(b,d,e.handle);b.removeAttribute(m.expando)}"script"===c&&b.text!==a.text?(xb(b).text=a.text,yb(b)):"object"===c?(b.parentNode&&(b.outerHTML=a.outerHTML),k.html5Clone&&a.innerHTML&&!m.trim(b.innerHTML)&&(b.innerHTML=a.innerHTML)):"input"===c&&W.test(a.type)?(b.defaultChecked=b.checked=a.checked,b.value!==a.value&&(b.value=a.value)):"option"===c?b.defaultSelected=b.selected=a.defaultSelected:("input"===c||"textarea"===c)&&(b.defaultValue=a.defaultValue)}}m.extend({clone:function(a,b,c){var d,e,f,g,h,i=m.contains(a.ownerDocument,a);if(k.html5Clone||m.isXMLDoc(a)||!gb.test("<"+a.nodeName+">")?f=a.cloneNode(!0):(tb.innerHTML=a.outerHTML,tb.removeChild(f=tb.firstChild)),!(k.noCloneEvent&&k.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||m.isXMLDoc(a)))for(d=ub(f),h=ub(a),g=0;null!=(e=h[g]);++g)d[g]&&Bb(e,d[g]);if(b)if(c)for(h=h||ub(a),d=d||ub(f),g=0;null!=(e=h[g]);g++)Ab(e,d[g]);else Ab(a,f);return d=ub(f,"script"),d.length>0&&zb(d,!i&&ub(a,"script")),d=h=e=null,f},buildFragment:function(a,b,c,d){for(var e,f,g,h,i,j,l,n=a.length,o=db(b),p=[],q=0;n>q;q++)if(f=a[q],f||0===f)if("object"===m.type(f))m.merge(p,f.nodeType?[f]:f);else if(lb.test(f)){h=h||o.appendChild(b.createElement("div")),i=(jb.exec(f)||["",""])[1].toLowerCase(),l=rb[i]||rb._default,h.innerHTML=l[1]+f.replace(ib,"<$1></$2>")+l[2],e=l[0];while(e--)h=h.lastChild;if(!k.leadingWhitespace&&hb.test(f)&&p.push(b.createTextNode(hb.exec(f)[0])),!k.tbody){f="table"!==i||kb.test(f)?"<table>"!==l[1]||kb.test(f)?0:h:h.firstChild,e=f&&f.childNodes.length;while(e--)m.nodeName(j=f.childNodes[e],"tbody")&&!j.childNodes.length&&f.removeChild(j)}m.merge(p,h.childNodes),h.textContent="";while(h.firstChild)h.removeChild(h.firstChild);h=o.lastChild}else p.push(b.createTextNode(f));h&&o.removeChild(h),k.appendChecked||m.grep(ub(p,"input"),vb),q=0;while(f=p[q++])if((!d||-1===m.inArray(f,d))&&(g=m.contains(f.ownerDocument,f),h=ub(o.appendChild(f),"script"),g&&zb(h),c)){e=0;while(f=h[e++])ob.test(f.type||"")&&c.push(f)}return h=null,o},cleanData:function(a,b){for(var d,e,f,g,h=0,i=m.expando,j=m.cache,l=k.deleteExpando,n=m.event.special;null!=(d=a[h]);h++)if((b||m.acceptData(d))&&(f=d[i],g=f&&j[f])){if(g.events)for(e in g.events)n[e]?m.event.remove(d,e):m.removeEvent(d,e,g.handle);j[f]&&(delete j[f],l?delete d[i]:typeof d.removeAttribute!==K?d.removeAttribute(i):d[i]=null,c.push(f))}}}),m.fn.extend({text:function(a){return V(this,function(a){return void 0===a?m.text(this):this.empty().append((this[0]&&this[0].ownerDocument||y).createTextNode(a))},null,a,arguments.length)},append:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=wb(this,a);b.appendChild(a)}})},prepend:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=wb(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},remove:function(a,b){for(var c,d=a?m.filter(a,this):this,e=0;null!=(c=d[e]);e++)b||1!==c.nodeType||m.cleanData(ub(c)),c.parentNode&&(b&&m.contains(c.ownerDocument,c)&&zb(ub(c,"script")),c.parentNode.removeChild(c));return this},empty:function(){for(var a,b=0;null!=(a=this[b]);b++){1===a.nodeType&&m.cleanData(ub(a,!1));while(a.firstChild)a.removeChild(a.firstChild);a.options&&m.nodeName(a,"select")&&(a.options.length=0)}return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return m.clone(this,a,b)})},html:function(a){return V(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a)return 1===b.nodeType?b.innerHTML.replace(fb,""):void 0;if(!("string"!=typeof a||mb.test(a)||!k.htmlSerialize&&gb.test(a)||!k.leadingWhitespace&&hb.test(a)||rb[(jb.exec(a)||["",""])[1].toLowerCase()])){a=a.replace(ib,"<$1></$2>");try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(m.cleanData(ub(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=arguments[0];return this.domManip(arguments,function(b){a=this.parentNode,m.cleanData(ub(this)),a&&a.replaceChild(b,this)}),a&&(a.length||a.nodeType)?this:this.remove()},detach:function(a){return this.remove(a,!0)},domManip:function(a,b){a=e.apply([],a);var c,d,f,g,h,i,j=0,l=this.length,n=this,o=l-1,p=a[0],q=m.isFunction(p);if(q||l>1&&"string"==typeof p&&!k.checkClone&&nb.test(p))return this.each(function(c){var d=n.eq(c);q&&(a[0]=p.call(this,c,d.html())),d.domManip(a,b)});if(l&&(i=m.buildFragment(a,this[0].ownerDocument,!1,this),c=i.firstChild,1===i.childNodes.length&&(i=c),c)){for(g=m.map(ub(i,"script"),xb),f=g.length;l>j;j++)d=i,j!==o&&(d=m.clone(d,!0,!0),f&&m.merge(g,ub(d,"script"))),b.call(this[j],d,j);if(f)for(h=g[g.length-1].ownerDocument,m.map(g,yb),j=0;f>j;j++)d=g[j],ob.test(d.type||"")&&!m._data(d,"globalEval")&&m.contains(h,d)&&(d.src?m._evalUrl&&m._evalUrl(d.src):m.globalEval((d.text||d.textContent||d.innerHTML||"").replace(qb,"")));i=c=null}return this}}),m.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){m.fn[a]=function(a){for(var c,d=0,e=[],g=m(a),h=g.length-1;h>=d;d++)c=d===h?this:this.clone(!0),m(g[d])[b](c),f.apply(e,c.get());return this.pushStack(e)}});var Cb,Db={};function Eb(b,c){var d,e=m(c.createElement(b)).appendTo(c.body),f=a.getDefaultComputedStyle&&(d=a.getDefaultComputedStyle(e[0]))?d.display:m.css(e[0],"display");return e.detach(),f}function Fb(a){var b=y,c=Db[a];return c||(c=Eb(a,b),"none"!==c&&c||(Cb=(Cb||m("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=(Cb[0].contentWindow||Cb[0].contentDocument).document,b.write(),b.close(),c=Eb(a,b),Cb.detach()),Db[a]=c),c}!function(){var a;k.shrinkWrapBlocks=function(){if(null!=a)return a;a=!1;var b,c,d;return c=y.getElementsByTagName("body")[0],c&&c.style?(b=y.createElement("div"),d=y.createElement("div"),d.style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px",c.appendChild(d).appendChild(b),typeof b.style.zoom!==K&&(b.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1",b.appendChild(y.createElement("div")).style.width="5px",a=3!==b.offsetWidth),c.removeChild(d),a):void 0}}();var Gb=/^margin/,Hb=new RegExp("^("+S+")(?!px)[a-z%]+$","i"),Ib,Jb,Kb=/^(top|right|bottom|left)$/;a.getComputedStyle?(Ib=function(a){return a.ownerDocument.defaultView.getComputedStyle(a,null)},Jb=function(a,b,c){var d,e,f,g,h=a.style;return c=c||Ib(a),g=c?c.getPropertyValue(b)||c[b]:void 0,c&&(""!==g||m.contains(a.ownerDocument,a)||(g=m.style(a,b)),Hb.test(g)&&Gb.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0===g?g:g+""}):y.documentElement.currentStyle&&(Ib=function(a){return a.currentStyle},Jb=function(a,b,c){var d,e,f,g,h=a.style;return c=c||Ib(a),g=c?c[b]:void 0,null==g&&h&&h[b]&&(g=h[b]),Hb.test(g)&&!Kb.test(b)&&(d=h.left,e=a.runtimeStyle,f=e&&e.left,f&&(e.left=a.currentStyle.left),h.left="fontSize"===b?"1em":g,g=h.pixelLeft+"px",h.left=d,f&&(e.left=f)),void 0===g?g:g+""||"auto"});function Lb(a,b){return{get:function(){var c=a();if(null!=c)return c?void delete this.get:(this.get=b).apply(this,arguments)}}}!function(){var b,c,d,e,f,g,h;if(b=y.createElement("div"),b.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",d=b.getElementsByTagName("a")[0],c=d&&d.style){c.cssText="float:left;opacity:.5",k.opacity="0.5"===c.opacity,k.cssFloat=!!c.cssFloat,b.style.backgroundClip="content-box",b.cloneNode(!0).style.backgroundClip="",k.clearCloneStyle="content-box"===b.style.backgroundClip,k.boxSizing=""===c.boxSizing||""===c.MozBoxSizing||""===c.WebkitBoxSizing,m.extend(k,{reliableHiddenOffsets:function(){return null==g&&i(),g},boxSizingReliable:function(){return null==f&&i(),f},pixelPosition:function(){return null==e&&i(),e},reliableMarginRight:function(){return null==h&&i(),h}});function i(){var b,c,d,i;c=y.getElementsByTagName("body")[0],c&&c.style&&(b=y.createElement("div"),d=y.createElement("div"),d.style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px",c.appendChild(d).appendChild(b),b.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",e=f=!1,h=!0,a.getComputedStyle&&(e="1%"!==(a.getComputedStyle(b,null)||{}).top,f="4px"===(a.getComputedStyle(b,null)||{width:"4px"}).width,i=b.appendChild(y.createElement("div")),i.style.cssText=b.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",i.style.marginRight=i.style.width="0",b.style.width="1px",h=!parseFloat((a.getComputedStyle(i,null)||{}).marginRight)),b.innerHTML="<table><tr><td></td><td>t</td></tr></table>",i=b.getElementsByTagName("td"),i[0].style.cssText="margin:0;border:0;padding:0;display:none",g=0===i[0].offsetHeight,g&&(i[0].style.display="",i[1].style.display="none",g=0===i[0].offsetHeight),c.removeChild(d))}}}(),m.swap=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};var Mb=/alpha\([^)]*\)/i,Nb=/opacity\s*=\s*([^)]*)/,Ob=/^(none|table(?!-c[ea]).+)/,Pb=new RegExp("^("+S+")(.*)$","i"),Qb=new RegExp("^([+-])=("+S+")","i"),Rb={position:"absolute",visibility:"hidden",display:"block"},Sb={letterSpacing:"0",fontWeight:"400"},Tb=["Webkit","O","Moz","ms"];function Ub(a,b){if(b in a)return b;var c=b.charAt(0).toUpperCase()+b.slice(1),d=b,e=Tb.length;while(e--)if(b=Tb[e]+c,b in a)return b;return d}function Vb(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=m._data(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&U(d)&&(f[g]=m._data(d,"olddisplay",Fb(d.nodeName)))):(e=U(d),(c&&"none"!==c||!e)&&m._data(d,"olddisplay",e?c:m.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}function Wb(a,b,c){var d=Pb.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function Xb(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=m.css(a,c+T[f],!0,e)),d?("content"===c&&(g-=m.css(a,"padding"+T[f],!0,e)),"margin"!==c&&(g-=m.css(a,"border"+T[f]+"Width",!0,e))):(g+=m.css(a,"padding"+T[f],!0,e),"padding"!==c&&(g+=m.css(a,"border"+T[f]+"Width",!0,e)));return g}function Yb(a,b,c){var d=!0,e="width"===b?a.offsetWidth:a.offsetHeight,f=Ib(a),g=k.boxSizing&&"border-box"===m.css(a,"boxSizing",!1,f);if(0>=e||null==e){if(e=Jb(a,b,f),(0>e||null==e)&&(e=a.style[b]),Hb.test(e))return e;d=g&&(k.boxSizingReliable()||e===a.style[b]),e=parseFloat(e)||0}return e+Xb(a,b,c||(g?"border":"content"),d,f)+"px"}m.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Jb(a,"opacity");return""===c?"1":c}}}},cssNumber:{columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":k.cssFloat?"cssFloat":"styleFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=m.camelCase(b),i=a.style;if(b=m.cssProps[h]||(m.cssProps[h]=Ub(i,h)),g=m.cssHooks[b]||m.cssHooks[h],void 0===c)return g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b];if(f=typeof c,"string"===f&&(e=Qb.exec(c))&&(c=(e[1]+1)*e[2]+parseFloat(m.css(a,b)),f="number"),null!=c&&c===c&&("number"!==f||m.cssNumber[h]||(c+="px"),k.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),!(g&&"set"in g&&void 0===(c=g.set(a,c,d)))))try{i[b]=c}catch(j){}}},css:function(a,b,c,d){var e,f,g,h=m.camelCase(b);return b=m.cssProps[h]||(m.cssProps[h]=Ub(a.style,h)),g=m.cssHooks[b]||m.cssHooks[h],g&&"get"in g&&(f=g.get(a,!0,c)),void 0===f&&(f=Jb(a,b,d)),"normal"===f&&b in Sb&&(f=Sb[b]),""===c||c?(e=parseFloat(f),c===!0||m.isNumeric(e)?e||0:f):f}}),m.each(["height","width"],function(a,b){m.cssHooks[b]={get:function(a,c,d){return c?Ob.test(m.css(a,"display"))&&0===a.offsetWidth?m.swap(a,Rb,function(){return Yb(a,b,d)}):Yb(a,b,d):void 0},set:function(a,c,d){var e=d&&Ib(a);return Wb(a,c,d?Xb(a,b,d,k.boxSizing&&"border-box"===m.css(a,"boxSizing",!1,e),e):0)}}}),k.opacity||(m.cssHooks.opacity={get:function(a,b){return Nb.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=m.isNumeric(b)?"alpha(opacity="+100*b+")":"",f=d&&d.filter||c.filter||"";c.zoom=1,(b>=1||""===b)&&""===m.trim(f.replace(Mb,""))&&c.removeAttribute&&(c.removeAttribute("filter"),""===b||d&&!d.filter)||(c.filter=Mb.test(f)?f.replace(Mb,e):f+" "+e)}}),m.cssHooks.marginRight=Lb(k.reliableMarginRight,function(a,b){return b?m.swap(a,{display:"inline-block"},Jb,[a,"marginRight"]):void 0}),m.each({margin:"",padding:"",border:"Width"},function(a,b){m.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+T[d]+b]=f[d]||f[d-2]||f[0];return e}},Gb.test(a)||(m.cssHooks[a+b].set=Wb)}),m.fn.extend({css:function(a,b){return V(this,function(a,b,c){var d,e,f={},g=0;if(m.isArray(b)){for(d=Ib(a),e=b.length;e>g;g++)f[b[g]]=m.css(a,b[g],!1,d);return f}return void 0!==c?m.style(a,b,c):m.css(a,b)},a,b,arguments.length>1)},show:function(){return Vb(this,!0)},hide:function(){return Vb(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){U(this)?m(this).show():m(this).hide()})}});function Zb(a,b,c,d,e){return new Zb.prototype.init(a,b,c,d,e)}m.Tween=Zb,Zb.prototype={constructor:Zb,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||"swing",this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(m.cssNumber[c]?"":"px")
},cur:function(){var a=Zb.propHooks[this.prop];return a&&a.get?a.get(this):Zb.propHooks._default.get(this)},run:function(a){var b,c=Zb.propHooks[this.prop];return this.pos=b=this.options.duration?m.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Zb.propHooks._default.set(this),this}},Zb.prototype.init.prototype=Zb.prototype,Zb.propHooks={_default:{get:function(a){var b;return null==a.elem[a.prop]||a.elem.style&&null!=a.elem.style[a.prop]?(b=m.css(a.elem,a.prop,""),b&&"auto"!==b?b:0):a.elem[a.prop]},set:function(a){m.fx.step[a.prop]?m.fx.step[a.prop](a):a.elem.style&&(null!=a.elem.style[m.cssProps[a.prop]]||m.cssHooks[a.prop])?m.style(a.elem,a.prop,a.now+a.unit):a.elem[a.prop]=a.now}}},Zb.propHooks.scrollTop=Zb.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},m.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2}},m.fx=Zb.prototype.init,m.fx.step={};var $b,_b,ac=/^(?:toggle|show|hide)$/,bc=new RegExp("^(?:([+-])=|)("+S+")([a-z%]*)$","i"),cc=/queueHooks$/,dc=[ic],ec={"*":[function(a,b){var c=this.createTween(a,b),d=c.cur(),e=bc.exec(b),f=e&&e[3]||(m.cssNumber[a]?"":"px"),g=(m.cssNumber[a]||"px"!==f&&+d)&&bc.exec(m.css(c.elem,a)),h=1,i=20;if(g&&g[3]!==f){f=f||g[3],e=e||[],g=+d||1;do h=h||".5",g/=h,m.style(c.elem,a,g+f);while(h!==(h=c.cur()/d)&&1!==h&&--i)}return e&&(g=c.start=+g||+d||0,c.unit=f,c.end=e[1]?g+(e[1]+1)*e[2]:+e[2]),c}]};function fc(){return setTimeout(function(){$b=void 0}),$b=m.now()}function gc(a,b){var c,d={height:a},e=0;for(b=b?1:0;4>e;e+=2-b)c=T[e],d["margin"+c]=d["padding"+c]=a;return b&&(d.opacity=d.width=a),d}function hc(a,b,c){for(var d,e=(ec[b]||[]).concat(ec["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function ic(a,b,c){var d,e,f,g,h,i,j,l,n=this,o={},p=a.style,q=a.nodeType&&U(a),r=m._data(a,"fxshow");c.queue||(h=m._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,n.always(function(){n.always(function(){h.unqueued--,m.queue(a,"fx").length||h.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[p.overflow,p.overflowX,p.overflowY],j=m.css(a,"display"),l="none"===j?m._data(a,"olddisplay")||Fb(a.nodeName):j,"inline"===l&&"none"===m.css(a,"float")&&(k.inlineBlockNeedsLayout&&"inline"!==Fb(a.nodeName)?p.zoom=1:p.display="inline-block")),c.overflow&&(p.overflow="hidden",k.shrinkWrapBlocks()||n.always(function(){p.overflow=c.overflow[0],p.overflowX=c.overflow[1],p.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],ac.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(q?"hide":"show")){if("show"!==e||!r||void 0===r[d])continue;q=!0}o[d]=r&&r[d]||m.style(a,d)}else j=void 0;if(m.isEmptyObject(o))"inline"===("none"===j?Fb(a.nodeName):j)&&(p.display=j);else{r?"hidden"in r&&(q=r.hidden):r=m._data(a,"fxshow",{}),f&&(r.hidden=!q),q?m(a).show():n.done(function(){m(a).hide()}),n.done(function(){var b;m._removeData(a,"fxshow");for(b in o)m.style(a,b,o[b])});for(d in o)g=hc(q?r[d]:0,d,n),d in r||(r[d]=g.start,q&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function jc(a,b){var c,d,e,f,g;for(c in a)if(d=m.camelCase(c),e=b[d],f=a[c],m.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=m.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function kc(a,b,c){var d,e,f=0,g=dc.length,h=m.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=$b||fc(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:m.extend({},b),opts:m.extend(!0,{specialEasing:{}},c),originalProperties:b,originalOptions:c,startTime:$b||fc(),duration:c.duration,tweens:[],createTween:function(b,c){var d=m.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?h.resolveWith(a,[j,b]):h.rejectWith(a,[j,b]),this}}),k=j.props;for(jc(k,j.opts.specialEasing);g>f;f++)if(d=dc[f].call(j,a,k,j.opts))return d;return m.map(k,hc,j),m.isFunction(j.opts.start)&&j.opts.start.call(a,j),m.fx.timer(m.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}m.Animation=m.extend(kc,{tweener:function(a,b){m.isFunction(a)?(b=a,a=["*"]):a=a.split(" ");for(var c,d=0,e=a.length;e>d;d++)c=a[d],ec[c]=ec[c]||[],ec[c].unshift(b)},prefilter:function(a,b){b?dc.unshift(a):dc.push(a)}}),m.speed=function(a,b,c){var d=a&&"object"==typeof a?m.extend({},a):{complete:c||!c&&b||m.isFunction(a)&&a,duration:a,easing:c&&b||b&&!m.isFunction(b)&&b};return d.duration=m.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in m.fx.speeds?m.fx.speeds[d.duration]:m.fx.speeds._default,(null==d.queue||d.queue===!0)&&(d.queue="fx"),d.old=d.complete,d.complete=function(){m.isFunction(d.old)&&d.old.call(this),d.queue&&m.dequeue(this,d.queue)},d},m.fn.extend({fadeTo:function(a,b,c,d){return this.filter(U).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=m.isEmptyObject(a),f=m.speed(b,c,d),g=function(){var b=kc(this,m.extend({},a),f);(e||m._data(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=m.timers,g=m._data(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&cc.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));(b||!c)&&m.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=m._data(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=m.timers,g=d?d.length:0;for(c.finish=!0,m.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),m.each(["toggle","show","hide"],function(a,b){var c=m.fn[b];m.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(gc(b,!0),a,d,e)}}),m.each({slideDown:gc("show"),slideUp:gc("hide"),slideToggle:gc("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){m.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),m.timers=[],m.fx.tick=function(){var a,b=m.timers,c=0;for($b=m.now();c<b.length;c++)a=b[c],a()||b[c]!==a||b.splice(c--,1);b.length||m.fx.stop(),$b=void 0},m.fx.timer=function(a){m.timers.push(a),a()?m.fx.start():m.timers.pop()},m.fx.interval=13,m.fx.start=function(){_b||(_b=setInterval(m.fx.tick,m.fx.interval))},m.fx.stop=function(){clearInterval(_b),_b=null},m.fx.speeds={slow:600,fast:200,_default:400},m.fn.delay=function(a,b){return a=m.fx?m.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},function(){var a,b,c,d,e;b=y.createElement("div"),b.setAttribute("className","t"),b.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",d=b.getElementsByTagName("a")[0],c=y.createElement("select"),e=c.appendChild(y.createElement("option")),a=b.getElementsByTagName("input")[0],d.style.cssText="top:1px",k.getSetAttribute="t"!==b.className,k.style=/top/.test(d.getAttribute("style")),k.hrefNormalized="/a"===d.getAttribute("href"),k.checkOn=!!a.value,k.optSelected=e.selected,k.enctype=!!y.createElement("form").enctype,c.disabled=!0,k.optDisabled=!e.disabled,a=y.createElement("input"),a.setAttribute("value",""),k.input=""===a.getAttribute("value"),a.value="t",a.setAttribute("type","radio"),k.radioValue="t"===a.value}();var lc=/\r/g;m.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=m.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,m(this).val()):a,null==e?e="":"number"==typeof e?e+="":m.isArray(e)&&(e=m.map(e,function(a){return null==a?"":a+""})),b=m.valHooks[this.type]||m.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=m.valHooks[e.type]||m.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(lc,""):null==c?"":c)}}}),m.extend({valHooks:{option:{get:function(a){var b=m.find.attr(a,"value");return null!=b?b:m.trim(m.text(a))}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],!(!c.selected&&i!==e||(k.optDisabled?c.disabled:null!==c.getAttribute("disabled"))||c.parentNode.disabled&&m.nodeName(c.parentNode,"optgroup"))){if(b=m(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=m.makeArray(b),g=e.length;while(g--)if(d=e[g],m.inArray(m.valHooks.option.get(d),f)>=0)try{d.selected=c=!0}catch(h){d.scrollHeight}else d.selected=!1;return c||(a.selectedIndex=-1),e}}}}),m.each(["radio","checkbox"],function(){m.valHooks[this]={set:function(a,b){return m.isArray(b)?a.checked=m.inArray(m(a).val(),b)>=0:void 0}},k.checkOn||(m.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var mc,nc,oc=m.expr.attrHandle,pc=/^(?:checked|selected)$/i,qc=k.getSetAttribute,rc=k.input;m.fn.extend({attr:function(a,b){return V(this,m.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){m.removeAttr(this,a)})}}),m.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(a&&3!==f&&8!==f&&2!==f)return typeof a.getAttribute===K?m.prop(a,b,c):(1===f&&m.isXMLDoc(a)||(b=b.toLowerCase(),d=m.attrHooks[b]||(m.expr.match.bool.test(b)?nc:mc)),void 0===c?d&&"get"in d&&null!==(e=d.get(a,b))?e:(e=m.find.attr(a,b),null==e?void 0:e):null!==c?d&&"set"in d&&void 0!==(e=d.set(a,c,b))?e:(a.setAttribute(b,c+""),c):void m.removeAttr(a,b))},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(E);if(f&&1===a.nodeType)while(c=f[e++])d=m.propFix[c]||c,m.expr.match.bool.test(c)?rc&&qc||!pc.test(c)?a[d]=!1:a[m.camelCase("default-"+c)]=a[d]=!1:m.attr(a,c,""),a.removeAttribute(qc?c:d)},attrHooks:{type:{set:function(a,b){if(!k.radioValue&&"radio"===b&&m.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}}}),nc={set:function(a,b,c){return b===!1?m.removeAttr(a,c):rc&&qc||!pc.test(c)?a.setAttribute(!qc&&m.propFix[c]||c,c):a[m.camelCase("default-"+c)]=a[c]=!0,c}},m.each(m.expr.match.bool.source.match(/\w+/g),function(a,b){var c=oc[b]||m.find.attr;oc[b]=rc&&qc||!pc.test(b)?function(a,b,d){var e,f;return d||(f=oc[b],oc[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,oc[b]=f),e}:function(a,b,c){return c?void 0:a[m.camelCase("default-"+b)]?b.toLowerCase():null}}),rc&&qc||(m.attrHooks.value={set:function(a,b,c){return m.nodeName(a,"input")?void(a.defaultValue=b):mc&&mc.set(a,b,c)}}),qc||(mc={set:function(a,b,c){var d=a.getAttributeNode(c);return d||a.setAttributeNode(d=a.ownerDocument.createAttribute(c)),d.value=b+="","value"===c||b===a.getAttribute(c)?b:void 0}},oc.id=oc.name=oc.coords=function(a,b,c){var d;return c?void 0:(d=a.getAttributeNode(b))&&""!==d.value?d.value:null},m.valHooks.button={get:function(a,b){var c=a.getAttributeNode(b);return c&&c.specified?c.value:void 0},set:mc.set},m.attrHooks.contenteditable={set:function(a,b,c){mc.set(a,""===b?!1:b,c)}},m.each(["width","height"],function(a,b){m.attrHooks[b]={set:function(a,c){return""===c?(a.setAttribute(b,"auto"),c):void 0}}})),k.style||(m.attrHooks.style={get:function(a){return a.style.cssText||void 0},set:function(a,b){return a.style.cssText=b+""}});var sc=/^(?:input|select|textarea|button|object)$/i,tc=/^(?:a|area)$/i;m.fn.extend({prop:function(a,b){return V(this,m.prop,a,b,arguments.length>1)},removeProp:function(a){return a=m.propFix[a]||a,this.each(function(){try{this[a]=void 0,delete this[a]}catch(b){}})}}),m.extend({propFix:{"for":"htmlFor","class":"className"},prop:function(a,b,c){var d,e,f,g=a.nodeType;if(a&&3!==g&&8!==g&&2!==g)return f=1!==g||!m.isXMLDoc(a),f&&(b=m.propFix[b]||b,e=m.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=m.find.attr(a,"tabindex");return b?parseInt(b,10):sc.test(a.nodeName)||tc.test(a.nodeName)&&a.href?0:-1}}}}),k.hrefNormalized||m.each(["href","src"],function(a,b){m.propHooks[b]={get:function(a){return a.getAttribute(b,4)}}}),k.optSelected||(m.propHooks.selected={get:function(a){var b=a.parentNode;return b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex),null}}),m.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){m.propFix[this.toLowerCase()]=this}),k.enctype||(m.propFix.enctype="encoding");var uc=/[\t\r\n\f]/g;m.fn.extend({addClass:function(a){var b,c,d,e,f,g,h=0,i=this.length,j="string"==typeof a&&a;if(m.isFunction(a))return this.each(function(b){m(this).addClass(a.call(this,b,this.className))});if(j)for(b=(a||"").match(E)||[];i>h;h++)if(c=this[h],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(uc," "):" ")){f=0;while(e=b[f++])d.indexOf(" "+e+" ")<0&&(d+=e+" ");g=m.trim(d),c.className!==g&&(c.className=g)}return this},removeClass:function(a){var b,c,d,e,f,g,h=0,i=this.length,j=0===arguments.length||"string"==typeof a&&a;if(m.isFunction(a))return this.each(function(b){m(this).removeClass(a.call(this,b,this.className))});if(j)for(b=(a||"").match(E)||[];i>h;h++)if(c=this[h],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(uc," "):"")){f=0;while(e=b[f++])while(d.indexOf(" "+e+" ")>=0)d=d.replace(" "+e+" "," ");g=a?m.trim(d):"",c.className!==g&&(c.className=g)}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):this.each(m.isFunction(a)?function(c){m(this).toggleClass(a.call(this,c,this.className,b),b)}:function(){if("string"===c){var b,d=0,e=m(this),f=a.match(E)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else(c===K||"boolean"===c)&&(this.className&&m._data(this,"__className__",this.className),this.className=this.className||a===!1?"":m._data(this,"__className__")||"")})},hasClass:function(a){for(var b=" "+a+" ",c=0,d=this.length;d>c;c++)if(1===this[c].nodeType&&(" "+this[c].className+" ").replace(uc," ").indexOf(b)>=0)return!0;return!1}}),m.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){m.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),m.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}});var vc=m.now(),wc=/\?/,xc=/(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;m.parseJSON=function(b){if(a.JSON&&a.JSON.parse)return a.JSON.parse(b+"");var c,d=null,e=m.trim(b+"");return e&&!m.trim(e.replace(xc,function(a,b,e,f){return c&&b&&(d=0),0===d?a:(c=e||b,d+=!f-!e,"")}))?Function("return "+e)():m.error("Invalid JSON: "+b)},m.parseXML=function(b){var c,d;if(!b||"string"!=typeof b)return null;try{a.DOMParser?(d=new DOMParser,c=d.parseFromString(b,"text/xml")):(c=new ActiveXObject("Microsoft.XMLDOM"),c.async="false",c.loadXML(b))}catch(e){c=void 0}return c&&c.documentElement&&!c.getElementsByTagName("parsererror").length||m.error("Invalid XML: "+b),c};var yc,zc,Ac=/#.*$/,Bc=/([?&])_=[^&]*/,Cc=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Dc=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Ec=/^(?:GET|HEAD)$/,Fc=/^\/\//,Gc=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,Hc={},Ic={},Jc="*/".concat("*");try{zc=location.href}catch(Kc){zc=y.createElement("a"),zc.href="",zc=zc.href}yc=Gc.exec(zc.toLowerCase())||[];function Lc(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(E)||[];if(m.isFunction(c))while(d=f[e++])"+"===d.charAt(0)?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function Mc(a,b,c,d){var e={},f=a===Ic;function g(h){var i;return e[h]=!0,m.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function Nc(a,b){var c,d,e=m.ajaxSettings.flatOptions||{};for(d in b)void 0!==b[d]&&((e[d]?a:c||(c={}))[d]=b[d]);return c&&m.extend(!0,a,c),a}function Oc(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===e&&(e=a.mimeType||b.getResponseHeader("Content-Type"));if(e)for(g in h)if(h[g]&&h[g].test(e)){i.unshift(g);break}if(i[0]in c)f=i[0];else{for(g in c){if(!i[0]||a.converters[g+" "+i[0]]){f=g;break}d||(d=g)}f=f||d}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function Pc(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}m.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:zc,type:"GET",isLocal:Dc.test(yc[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Jc,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":m.parseJSON,"text xml":m.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?Nc(Nc(a,m.ajaxSettings),b):Nc(m.ajaxSettings,a)},ajaxPrefilter:Lc(Hc),ajaxTransport:Lc(Ic),ajax:function(a,b){"object"==typeof a&&(b=a,a=void 0),b=b||{};var c,d,e,f,g,h,i,j,k=m.ajaxSetup({},b),l=k.context||k,n=k.context&&(l.nodeType||l.jquery)?m(l):m.event,o=m.Deferred(),p=m.Callbacks("once memory"),q=k.statusCode||{},r={},s={},t=0,u="canceled",v={readyState:0,getResponseHeader:function(a){var b;if(2===t){if(!j){j={};while(b=Cc.exec(f))j[b[1].toLowerCase()]=b[2]}b=j[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===t?f:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return t||(a=s[c]=s[c]||a,r[a]=b),this},overrideMimeType:function(a){return t||(k.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>t)for(b in a)q[b]=[q[b],a[b]];else v.always(a[v.status]);return this},abort:function(a){var b=a||u;return i&&i.abort(b),x(0,b),this}};if(o.promise(v).complete=p.add,v.success=v.done,v.error=v.fail,k.url=((a||k.url||zc)+"").replace(Ac,"").replace(Fc,yc[1]+"//"),k.type=b.method||b.type||k.method||k.type,k.dataTypes=m.trim(k.dataType||"*").toLowerCase().match(E)||[""],null==k.crossDomain&&(c=Gc.exec(k.url.toLowerCase()),k.crossDomain=!(!c||c[1]===yc[1]&&c[2]===yc[2]&&(c[3]||("http:"===c[1]?"80":"443"))===(yc[3]||("http:"===yc[1]?"80":"443")))),k.data&&k.processData&&"string"!=typeof k.data&&(k.data=m.param(k.data,k.traditional)),Mc(Hc,k,b,v),2===t)return v;h=k.global,h&&0===m.active++&&m.event.trigger("ajaxStart"),k.type=k.type.toUpperCase(),k.hasContent=!Ec.test(k.type),e=k.url,k.hasContent||(k.data&&(e=k.url+=(wc.test(e)?"&":"?")+k.data,delete k.data),k.cache===!1&&(k.url=Bc.test(e)?e.replace(Bc,"$1_="+vc++):e+(wc.test(e)?"&":"?")+"_="+vc++)),k.ifModified&&(m.lastModified[e]&&v.setRequestHeader("If-Modified-Since",m.lastModified[e]),m.etag[e]&&v.setRequestHeader("If-None-Match",m.etag[e])),(k.data&&k.hasContent&&k.contentType!==!1||b.contentType)&&v.setRequestHeader("Content-Type",k.contentType),v.setRequestHeader("Accept",k.dataTypes[0]&&k.accepts[k.dataTypes[0]]?k.accepts[k.dataTypes[0]]+("*"!==k.dataTypes[0]?", "+Jc+"; q=0.01":""):k.accepts["*"]);for(d in k.headers)v.setRequestHeader(d,k.headers[d]);if(k.beforeSend&&(k.beforeSend.call(l,v,k)===!1||2===t))return v.abort();u="abort";for(d in{success:1,error:1,complete:1})v[d](k[d]);if(i=Mc(Ic,k,b,v)){v.readyState=1,h&&n.trigger("ajaxSend",[v,k]),k.async&&k.timeout>0&&(g=setTimeout(function(){v.abort("timeout")},k.timeout));try{t=1,i.send(r,x)}catch(w){if(!(2>t))throw w;x(-1,w)}}else x(-1,"No Transport");function x(a,b,c,d){var j,r,s,u,w,x=b;2!==t&&(t=2,g&&clearTimeout(g),i=void 0,f=d||"",v.readyState=a>0?4:0,j=a>=200&&300>a||304===a,c&&(u=Oc(k,v,c)),u=Pc(k,u,v,j),j?(k.ifModified&&(w=v.getResponseHeader("Last-Modified"),w&&(m.lastModified[e]=w),w=v.getResponseHeader("etag"),w&&(m.etag[e]=w)),204===a||"HEAD"===k.type?x="nocontent":304===a?x="notmodified":(x=u.state,r=u.data,s=u.error,j=!s)):(s=x,(a||!x)&&(x="error",0>a&&(a=0))),v.status=a,v.statusText=(b||x)+"",j?o.resolveWith(l,[r,x,v]):o.rejectWith(l,[v,x,s]),v.statusCode(q),q=void 0,h&&n.trigger(j?"ajaxSuccess":"ajaxError",[v,k,j?r:s]),p.fireWith(l,[v,x]),h&&(n.trigger("ajaxComplete",[v,k]),--m.active||m.event.trigger("ajaxStop")))}return v},getJSON:function(a,b,c){return m.get(a,b,c,"json")},getScript:function(a,b){return m.get(a,void 0,b,"script")}}),m.each(["get","post"],function(a,b){m[b]=function(a,c,d,e){return m.isFunction(c)&&(e=e||d,d=c,c=void 0),m.ajax({url:a,type:b,dataType:e,data:c,success:d})}}),m.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){m.fn[b]=function(a){return this.on(b,a)}}),m._evalUrl=function(a){return m.ajax({url:a,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})},m.fn.extend({wrapAll:function(a){if(m.isFunction(a))return this.each(function(b){m(this).wrapAll(a.call(this,b))});if(this[0]){var b=m(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&1===a.firstChild.nodeType)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){return this.each(m.isFunction(a)?function(b){m(this).wrapInner(a.call(this,b))}:function(){var b=m(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=m.isFunction(a);return this.each(function(c){m(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){m.nodeName(this,"body")||m(this).replaceWith(this.childNodes)}).end()}}),m.expr.filters.hidden=function(a){return a.offsetWidth<=0&&a.offsetHeight<=0||!k.reliableHiddenOffsets()&&"none"===(a.style&&a.style.display||m.css(a,"display"))},m.expr.filters.visible=function(a){return!m.expr.filters.hidden(a)};var Qc=/%20/g,Rc=/\[\]$/,Sc=/\r?\n/g,Tc=/^(?:submit|button|image|reset|file)$/i,Uc=/^(?:input|select|textarea|keygen)/i;function Vc(a,b,c,d){var e;if(m.isArray(b))m.each(b,function(b,e){c||Rc.test(a)?d(a,e):Vc(a+"["+("object"==typeof e?b:"")+"]",e,c,d)});else if(c||"object"!==m.type(b))d(a,b);else for(e in b)Vc(a+"["+e+"]",b[e],c,d)}m.param=function(a,b){var c,d=[],e=function(a,b){b=m.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=m.ajaxSettings&&m.ajaxSettings.traditional),m.isArray(a)||a.jquery&&!m.isPlainObject(a))m.each(a,function(){e(this.name,this.value)});else for(c in a)Vc(c,a[c],b,e);return d.join("&").replace(Qc,"+")},m.fn.extend({serialize:function(){return m.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=m.prop(this,"elements");return a?m.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!m(this).is(":disabled")&&Uc.test(this.nodeName)&&!Tc.test(a)&&(this.checked||!W.test(a))}).map(function(a,b){var c=m(this).val();return null==c?null:m.isArray(c)?m.map(c,function(a){return{name:b.name,value:a.replace(Sc,"\r\n")}}):{name:b.name,value:c.replace(Sc,"\r\n")}}).get()}}),m.ajaxSettings.xhr=void 0!==a.ActiveXObject?function(){return!this.isLocal&&/^(get|post|head|put|delete|options)$/i.test(this.type)&&Zc()||$c()}:Zc;var Wc=0,Xc={},Yc=m.ajaxSettings.xhr();a.ActiveXObject&&m(a).on("unload",function(){for(var a in Xc)Xc[a](void 0,!0)}),k.cors=!!Yc&&"withCredentials"in Yc,Yc=k.ajax=!!Yc,Yc&&m.ajaxTransport(function(a){if(!a.crossDomain||k.cors){var b;return{send:function(c,d){var e,f=a.xhr(),g=++Wc;if(f.open(a.type,a.url,a.async,a.username,a.password),a.xhrFields)for(e in a.xhrFields)f[e]=a.xhrFields[e];a.mimeType&&f.overrideMimeType&&f.overrideMimeType(a.mimeType),a.crossDomain||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest");for(e in c)void 0!==c[e]&&f.setRequestHeader(e,c[e]+"");f.send(a.hasContent&&a.data||null),b=function(c,e){var h,i,j;if(b&&(e||4===f.readyState))if(delete Xc[g],b=void 0,f.onreadystatechange=m.noop,e)4!==f.readyState&&f.abort();else{j={},h=f.status,"string"==typeof f.responseText&&(j.text=f.responseText);try{i=f.statusText}catch(k){i=""}h||!a.isLocal||a.crossDomain?1223===h&&(h=204):h=j.text?200:404}j&&d(h,i,j,f.getAllResponseHeaders())},a.async?4===f.readyState?setTimeout(b):f.onreadystatechange=Xc[g]=b:b()},abort:function(){b&&b(void 0,!0)}}}});function Zc(){try{return new a.XMLHttpRequest}catch(b){}}function $c(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}m.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(a){return m.globalEval(a),a}}}),m.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),m.ajaxTransport("script",function(a){if(a.crossDomain){var b,c=y.head||m("head")[0]||y.documentElement;return{send:function(d,e){b=y.createElement("script"),b.async=!0,a.scriptCharset&&(b.charset=a.scriptCharset),b.src=a.url,b.onload=b.onreadystatechange=function(a,c){(c||!b.readyState||/loaded|complete/.test(b.readyState))&&(b.onload=b.onreadystatechange=null,b.parentNode&&b.parentNode.removeChild(b),b=null,c||e(200,"success"))},c.insertBefore(b,c.firstChild)},abort:function(){b&&b.onload(void 0,!0)}}}});var _c=[],ad=/(=)\?(?=&|$)|\?\?/;m.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=_c.pop()||m.expando+"_"+vc++;return this[a]=!0,a}}),m.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(ad.test(b.url)?"url":"string"==typeof b.data&&!(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&ad.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=m.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(ad,"$1"+e):b.jsonp!==!1&&(b.url+=(wc.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||m.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,_c.push(e)),g&&m.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),m.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||y;var d=u.exec(a),e=!c&&[];return d?[b.createElement(d[1])]:(d=m.buildFragment([a],b,e),e&&e.length&&m(e).remove(),m.merge([],d.childNodes))};var bd=m.fn.load;m.fn.load=function(a,b,c){if("string"!=typeof a&&bd)return bd.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>=0&&(d=m.trim(a.slice(h,a.length)),a=a.slice(0,h)),m.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(f="POST"),g.length>0&&m.ajax({url:a,type:f,dataType:"html",data:b}).done(function(a){e=arguments,g.html(d?m("<div>").append(m.parseHTML(a)).find(d):a)}).complete(c&&function(a,b){g.each(c,e||[a.responseText,b,a])}),this},m.expr.filters.animated=function(a){return m.grep(m.timers,function(b){return a===b.elem}).length};var cd=a.document.documentElement;function dd(a){return m.isWindow(a)?a:9===a.nodeType?a.defaultView||a.parentWindow:!1}m.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=m.css(a,"position"),l=m(a),n={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=m.css(a,"top"),i=m.css(a,"left"),j=("absolute"===k||"fixed"===k)&&m.inArray("auto",[f,i])>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),m.isFunction(b)&&(b=b.call(a,c,h)),null!=b.top&&(n.top=b.top-h.top+g),null!=b.left&&(n.left=b.left-h.left+e),"using"in b?b.using.call(a,n):l.css(n)}},m.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){m.offset.setOffset(this,a,b)});var b,c,d={top:0,left:0},e=this[0],f=e&&e.ownerDocument;if(f)return b=f.documentElement,m.contains(b,e)?(typeof e.getBoundingClientRect!==K&&(d=e.getBoundingClientRect()),c=dd(f),{top:d.top+(c.pageYOffset||b.scrollTop)-(b.clientTop||0),left:d.left+(c.pageXOffset||b.scrollLeft)-(b.clientLeft||0)}):d},position:function(){if(this[0]){var a,b,c={top:0,left:0},d=this[0];return"fixed"===m.css(d,"position")?b=d.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),m.nodeName(a[0],"html")||(c=a.offset()),c.top+=m.css(a[0],"borderTopWidth",!0),c.left+=m.css(a[0],"borderLeftWidth",!0)),{top:b.top-c.top-m.css(d,"marginTop",!0),left:b.left-c.left-m.css(d,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||cd;while(a&&!m.nodeName(a,"html")&&"static"===m.css(a,"position"))a=a.offsetParent;return a||cd})}}),m.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c=/Y/.test(b);m.fn[a]=function(d){return V(this,function(a,d,e){var f=dd(a);return void 0===e?f?b in f?f[b]:f.document.documentElement[d]:a[d]:void(f?f.scrollTo(c?m(f).scrollLeft():e,c?e:m(f).scrollTop()):a[d]=e)},a,d,arguments.length,null)}}),m.each(["top","left"],function(a,b){m.cssHooks[b]=Lb(k.pixelPosition,function(a,c){return c?(c=Jb(a,b),Hb.test(c)?m(a).position()[b]+"px":c):void 0})}),m.each({Height:"height",Width:"width"},function(a,b){m.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){m.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return V(this,function(b,c,d){var e;return m.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?m.css(b,c,g):m.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),m.fn.size=function(){return this.length},m.fn.andSelf=m.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return m});var ed=a.jQuery,fd=a.$;return m.noConflict=function(b){return a.$===m&&(a.$=fd),b&&a.jQuery===m&&(a.jQuery=ed),m},typeof b===K&&(a.jQuery=a.$=m),m});

/**!
 * AngularJS file upload shim for HTML5 FormData
 * @author  Danial  <danial.farid@gmail.com>
 * @version 1.6.5
 */
(function() {

var hasFlash = function() {
	try {
	  var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
	  if (fo) return true;
	} catch(e) {
	  if (navigator.mimeTypes["application/x-shockwave-flash"] != undefined) return true;
	}
	return false;
}

var patchXHR = function(fnName, newFn) {
	window.XMLHttpRequest.prototype[fnName] = newFn(window.XMLHttpRequest.prototype[fnName]);
};

if (window.XMLHttpRequest) {
	if (window.FormData && (!window.FileAPI || !FileAPI.forceLoad)) {
		// allow access to Angular XHR private field: https://github.com/angular/angular.js/issues/1934
		patchXHR("setRequestHeader", function(orig) {
			return function(header, value) {
				if (header === '__setXHR_') {
					var val = value(this);
					// fix for angular < 1.2.0
					if (val instanceof Function) {
						val(this);
					}
				} else {
					orig.apply(this, arguments);
				}
			}
		});
	} else {
		function initializeUploadListener(xhr) {
			if (!xhr.__listeners) {
				if (!xhr.upload) xhr.upload = {};
				xhr.__listeners = [];
				var origAddEventListener = xhr.upload.addEventListener;
				xhr.upload.addEventListener = function(t, fn, b) {
					xhr.__listeners[t] = fn;
					origAddEventListener && origAddEventListener.apply(this, arguments);
				};
			}
		}
		
		patchXHR("open", function(orig) {
			return function(m, url, b) {
				initializeUploadListener(this);
				this.__url = url;
				try {
					orig.apply(this, [m, url, b]);
				} catch (e) {
					if (e.message.indexOf('Access is denied') > -1) {
						orig.apply(this, [m, '_fix_for_ie_crossdomain__', b]);
					}
				}
			}
		});

		patchXHR("getResponseHeader", function(orig) {
			return function(h) {
				return this.__fileApiXHR ? this.__fileApiXHR.getResponseHeader(h) : orig.apply(this, [h]);
			};
		});

		patchXHR("getAllResponseHeaders", function(orig) {
			return function() {
				return this.__fileApiXHR ? this.__fileApiXHR.abort() : (orig == null ? null : orig.apply(this));
			}
		});

		patchXHR("abort", function(orig) {
			return function() {
				return this.__fileApiXHR ? this.__fileApiXHR.abort() : (orig == null ? null : orig.apply(this));
			}
		});

		patchXHR("setRequestHeader", function(orig) {
			return function(header, value) {
				if (header === '__setXHR_') {
					initializeUploadListener(this);
					var val = value(this);
					// fix for angular < 1.2.0
					if (val instanceof Function) {
						val(this);
					}
				} else {
					this.__requestHeaders = this.__requestHeaders || {};
					this.__requestHeaders[header] = value;
					orig.apply(this, arguments);
				}
			}
		});

		patchXHR("send", function(orig) {
			return function() {
				var xhr = this;
				if (arguments[0] && arguments[0].__isShim) {
					var formData = arguments[0];
					var config = {
						url: xhr.__url,
						complete: function(err, fileApiXHR) {
							if (!err && xhr.__listeners['load']) 
								xhr.__listeners['load']({type: 'load', loaded: xhr.__loaded, total: xhr.__total, target: xhr, lengthComputable: true});
							if (!err && xhr.__listeners['loadend']) 
								xhr.__listeners['loadend']({type: 'loadend', loaded: xhr.__loaded, total: xhr.__total, target: xhr, lengthComputable: true});
							if (err === 'abort' && xhr.__listeners['abort']) 
								xhr.__listeners['abort']({type: 'abort', loaded: xhr.__loaded, total: xhr.__total, target: xhr, lengthComputable: true});
							if (fileApiXHR.status !== undefined) Object.defineProperty(xhr, 'status', {get: function() {return fileApiXHR.status}});
							if (fileApiXHR.statusText !== undefined) Object.defineProperty(xhr, 'statusText', {get: function() {return fileApiXHR.statusText}});
							Object.defineProperty(xhr, 'readyState', {get: function() {return 4}});
							if (fileApiXHR.response !== undefined) Object.defineProperty(xhr, 'response', {get: function() {return fileApiXHR.response}});
							Object.defineProperty(xhr, 'responseText', {get: function() {return fileApiXHR.responseText}});
							Object.defineProperty(xhr, 'response', {get: function() {return fileApiXHR.responseText}});
							xhr.__fileApiXHR = fileApiXHR;
							if (xhr.onreadystatechange) xhr.onreadystatechange();
						},
						fileprogress: function(e) {
							e.target = xhr;
							xhr.__listeners['progress'] && xhr.__listeners['progress'](e);
							xhr.__total = e.total;
							xhr.__loaded = e.loaded;
						},
						headers: xhr.__requestHeaders
					}
					config.data = {};
					config.files = {}
					for (var i = 0; i < formData.data.length; i++) {
						var item = formData.data[i];
						if (item.val != null && item.val.name != null && item.val.size != null && item.val.type != null) {
							config.files[item.key] = item.val;
						} else {
							config.data[item.key] = item.val;
						}
					}

					setTimeout(function() {
						if (!hasFlash()) {
							throw 'Adode Flash Player need to be installed. To check ahead use "FileAPI.hasFlash"';
						}
						xhr.__fileApiXHR = FileAPI.upload(config);
					}, 1);
				} else {
					orig.apply(xhr, arguments);
				}
			}
		});
	}
	window.XMLHttpRequest.__isShim = true;
}

if (!window.FormData || (window.FileAPI && FileAPI.forceLoad)) {
	var addFlash = function(elem) {
		if (!hasFlash()) {
			throw 'Adode Flash Player need to be installed. To check ahead use "FileAPI.hasFlash"';
		}
		var el = angular.element(elem);
		if (!el.hasClass('js-fileapi-wrapper') && (elem.getAttribute('ng-file-select') != null || elem.getAttribute('data-ng-file-select') != null)) {
			if (FileAPI.wrapInsideDiv) {
				var wrap = document.createElement('div');
				wrap.innerHTML = '<div class="js-fileapi-wrapper" style="position:relative; overflow:hidden"></div>';
				wrap = wrap.firstChild;
				var parent = elem.parentNode;
				parent.insertBefore(wrap, elem);
				parent.removeChild(elem);
				wrap.appendChild(elem);
			} else {
				el.addClass('js-fileapi-wrapper');
			}
		}
	};
	var changeFnWrapper = function(fn) {
		return function(evt) {
			var files = FileAPI.getFiles(evt);
			//just a double check for #233
			for (var i = 0; i < files.length; i++) {
				if (files[i].size === undefined) files[i].size = 0;
				if (files[i].name === undefined) files[i].name = 'file';
				if (files[i].type === undefined) files[i].type = 'undefined';
			}
			if (!evt.target) {
				evt.target = {};
			}
			evt.target.files = files;
			// if evt.target.files is not writable use helper field
			if (evt.target.files != files) {
				evt.__files_ = files;
			}
			(evt.__files_ || evt.target.files).item = function(i) {
				return (evt.__files_ || evt.target.files)[i] || null;
			}
			if (fn) fn.apply(this, [evt]);
		};
	};
	var isFileChange = function(elem, e) {
		return (e.toLowerCase() === 'change' || e.toLowerCase() === 'onchange') && elem.getAttribute('type') == 'file';
	}
	if (HTMLInputElement.prototype.addEventListener) {
		HTMLInputElement.prototype.addEventListener = (function(origAddEventListener) {
			return function(e, fn, b, d) {
				if (isFileChange(this, e)) {
					addFlash(this);
					origAddEventListener.apply(this, [e, changeFnWrapper(fn), b, d]);
				} else {
					origAddEventListener.apply(this, [e, fn, b, d]);
				}
			}
		})(HTMLInputElement.prototype.addEventListener);
	}
	if (HTMLInputElement.prototype.attachEvent) {
		HTMLInputElement.prototype.attachEvent = (function(origAttachEvent) {
			return function(e, fn) {
				if (isFileChange(this, e)) {
					addFlash(this);
					if (window.jQuery) {
						// fix for #281 jQuery on IE8
						angular.element(this).bind("change", changeFnWrapper(null));
					} else {
						origAttachEvent.apply(this, [e, changeFnWrapper(fn)]);
					}
				} else {
					origAttachEvent.apply(this, [e, fn]);
				}
			}
		})(HTMLInputElement.prototype.attachEvent);
	}

	window.FormData = FormData = function() {
		return {
			append: function(key, val, name) {
				this.data.push({
					key: key,
					val: val,
					name: name
				});
			},
			data: [],
			__isShim: true
		};
	};

	(function () {
		//load FileAPI
		if (!window.FileAPI) {
			window.FileAPI = {};
		}
		if (FileAPI.forceLoad) {
			FileAPI.html5 = false;
		}
		
		if (!FileAPI.upload) {
			var jsUrl, basePath, script = document.createElement('script'), allScripts = document.getElementsByTagName('script'), i, index, src;
			if (window.FileAPI.jsUrl) {
				jsUrl = window.FileAPI.jsUrl;
			} else if (window.FileAPI.jsPath) {
				basePath = window.FileAPI.jsPath;
			} else {
				for (i = 0; i < allScripts.length; i++) {
					src = allScripts[i].src;
					index = src.indexOf('angular-file-upload-shim.js')
					if (index == -1) {
						index = src.indexOf('angular-file-upload-shim.min.js');
					}
					if (index > -1) {
						basePath = src.substring(0, index);
						break;
					}
				}
			}

			if (FileAPI.staticPath == null) FileAPI.staticPath = basePath;
			script.setAttribute('src', jsUrl || basePath + "FileAPI.min.js");
			document.getElementsByTagName('head')[0].appendChild(script);
			FileAPI.hasFlash = hasFlash();
		}
	})();
}


if (!window.FileReader) {
	window.FileReader = function() {
		var _this = this, loadStarted = false;
		this.listeners = {};
		this.addEventListener = function(type, fn) {
			_this.listeners[type] = _this.listeners[type] || [];
			_this.listeners[type].push(fn);
		};
		this.removeEventListener = function(type, fn) {
			_this.listeners[type] && _this.listeners[type].splice(_this.listeners[type].indexOf(fn), 1);
		};
		this.dispatchEvent = function(evt) {
			var list = _this.listeners[evt.type];
			if (list) {
				for (var i = 0; i < list.length; i++) {
					list[i].call(_this, evt);
				}
			}
		};
		this.onabort = this.onerror = this.onload = this.onloadstart = this.onloadend = this.onprogress = null;

		function constructEvent(type, evt) {
			var e = {type: type, target: _this, loaded: evt.loaded, total: evt.total, error: evt.error};
			if (evt.result != null) e.target.result = evt.result;
			return e;
		};
		var listener = function(evt) {
			if (!loadStarted) {
				loadStarted = true;
				_this.onloadstart && this.onloadstart(constructEvent('loadstart', evt));
			}
			if (evt.type === 'load') {
				_this.onloadend && _this.onloadend(constructEvent('loadend', evt));
				var e = constructEvent('load', evt);
				_this.onload && _this.onload(e);
				_this.dispatchEvent(e);
			} else if (evt.type === 'progress') {
				var e = constructEvent('progress', evt);
				_this.onprogress && _this.onprogress(e);
				_this.dispatchEvent(e);
			} else {
				var e = constructEvent('error', evt);
				_this.onerror && _this.onerror(e);
				_this.dispatchEvent(e);
			}
		};
		this.readAsArrayBuffer = function(file) {
			FileAPI.readAsBinaryString(file, listener);
		}
		this.readAsBinaryString = function(file) {
			FileAPI.readAsBinaryString(file, listener);
		}
		this.readAsDataURL = function(file) {
			FileAPI.readAsDataURL(file, listener);
		}
		this.readAsText = function(file) {
			FileAPI.readAsText(file, listener);
		}
	}
}

})();

/*
 AngularJS v1.2.14
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(D,T,s){'use strict';function F(b){return function(){var a=arguments[0],c,a="["+(b?b+":":"")+a+"] http://errors.angularjs.org/1.2.14/"+(b?b+"/":"")+a;for(c=1;c<arguments.length;c++)a=a+(1==c?"?":"&")+"p"+(c-1)+"="+encodeURIComponent("function"==typeof arguments[c]?arguments[c].toString().replace(/ \{[\s\S]*$/,""):"undefined"==typeof arguments[c]?"undefined":"string"!=typeof arguments[c]?JSON.stringify(arguments[c]):arguments[c]);return Error(a)}}function ub(b){if(null==b||ya(b))return!1;
var a=b.length;return 1===b.nodeType&&a?!0:E(b)||I(b)||0===a||"number"===typeof a&&0<a&&a-1 in b}function r(b,a,c){var d;if(b)if(N(b))for(d in b)"prototype"==d||("length"==d||"name"==d||b.hasOwnProperty&&!b.hasOwnProperty(d))||a.call(c,b[d],d);else if(b.forEach&&b.forEach!==r)b.forEach(a,c);else if(ub(b))for(d=0;d<b.length;d++)a.call(c,b[d],d);else for(d in b)b.hasOwnProperty(d)&&a.call(c,b[d],d);return b}function Pb(b){var a=[],c;for(c in b)b.hasOwnProperty(c)&&a.push(c);return a.sort()}function Qc(b,
a,c){for(var d=Pb(b),e=0;e<d.length;e++)a.call(c,b[d[e]],d[e]);return d}function Qb(b){return function(a,c){b(c,a)}}function Za(){for(var b=ia.length,a;b;){b--;a=ia[b].charCodeAt(0);if(57==a)return ia[b]="A",ia.join("");if(90==a)ia[b]="0";else return ia[b]=String.fromCharCode(a+1),ia.join("")}ia.unshift("0");return ia.join("")}function Rb(b,a){a?b.$$hashKey=a:delete b.$$hashKey}function t(b){var a=b.$$hashKey;r(arguments,function(a){a!==b&&r(a,function(a,c){b[c]=a})});Rb(b,a);return b}function Q(b){return parseInt(b,
10)}function Sb(b,a){return t(new (t(function(){},{prototype:b})),a)}function x(){}function za(b){return b}function $(b){return function(){return b}}function B(b){return"undefined"===typeof b}function v(b){return"undefined"!==typeof b}function X(b){return null!=b&&"object"===typeof b}function E(b){return"string"===typeof b}function vb(b){return"number"===typeof b}function La(b){return"[object Date]"===Aa.call(b)}function I(b){return"[object Array]"===Aa.call(b)}function N(b){return"function"===typeof b}
function $a(b){return"[object RegExp]"===Aa.call(b)}function ya(b){return b&&b.document&&b.location&&b.alert&&b.setInterval}function Rc(b){return!(!b||!(b.nodeName||b.prop&&b.attr&&b.find))}function Sc(b,a,c){var d=[];r(b,function(b,f,g){d.push(a.call(c,b,f,g))});return d}function ab(b,a){if(b.indexOf)return b.indexOf(a);for(var c=0;c<b.length;c++)if(a===b[c])return c;return-1}function Ma(b,a){var c=ab(b,a);0<=c&&b.splice(c,1);return a}function ba(b,a){if(ya(b)||b&&b.$evalAsync&&b.$watch)throw Na("cpws");
if(a){if(b===a)throw Na("cpi");if(I(b))for(var c=a.length=0;c<b.length;c++)a.push(ba(b[c]));else{c=a.$$hashKey;r(a,function(b,c){delete a[c]});for(var d in b)a[d]=ba(b[d]);Rb(a,c)}}else(a=b)&&(I(b)?a=ba(b,[]):La(b)?a=new Date(b.getTime()):$a(b)?a=RegExp(b.source):X(b)&&(a=ba(b,{})));return a}function Tb(b,a){a=a||{};for(var c in b)!b.hasOwnProperty(c)||"$"===c.charAt(0)&&"$"===c.charAt(1)||(a[c]=b[c]);return a}function sa(b,a){if(b===a)return!0;if(null===b||null===a)return!1;if(b!==b&&a!==a)return!0;
var c=typeof b,d;if(c==typeof a&&"object"==c)if(I(b)){if(!I(a))return!1;if((c=b.length)==a.length){for(d=0;d<c;d++)if(!sa(b[d],a[d]))return!1;return!0}}else{if(La(b))return La(a)&&b.getTime()==a.getTime();if($a(b)&&$a(a))return b.toString()==a.toString();if(b&&b.$evalAsync&&b.$watch||a&&a.$evalAsync&&a.$watch||ya(b)||ya(a)||I(a))return!1;c={};for(d in b)if("$"!==d.charAt(0)&&!N(b[d])){if(!sa(b[d],a[d]))return!1;c[d]=!0}for(d in a)if(!c.hasOwnProperty(d)&&"$"!==d.charAt(0)&&a[d]!==s&&!N(a[d]))return!1;
return!0}return!1}function Ub(){return T.securityPolicy&&T.securityPolicy.isActive||T.querySelector&&!(!T.querySelector("[ng-csp]")&&!T.querySelector("[data-ng-csp]"))}function bb(b,a){var c=2<arguments.length?ta.call(arguments,2):[];return!N(a)||a instanceof RegExp?a:c.length?function(){return arguments.length?a.apply(b,c.concat(ta.call(arguments,0))):a.apply(b,c)}:function(){return arguments.length?a.apply(b,arguments):a.call(b)}}function Tc(b,a){var c=a;"string"===typeof b&&"$"===b.charAt(0)?c=
s:ya(a)?c="$WINDOW":a&&T===a?c="$DOCUMENT":a&&(a.$evalAsync&&a.$watch)&&(c="$SCOPE");return c}function na(b,a){return"undefined"===typeof b?s:JSON.stringify(b,Tc,a?"  ":null)}function Vb(b){return E(b)?JSON.parse(b):b}function Oa(b){"function"===typeof b?b=!0:b&&0!==b.length?(b=O(""+b),b=!("f"==b||"0"==b||"false"==b||"no"==b||"n"==b||"[]"==b)):b=!1;return b}function fa(b){b=z(b).clone();try{b.empty()}catch(a){}var c=z("<div>").append(b).html();try{return 3===b[0].nodeType?O(c):c.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/,
function(a,b){return"<"+O(b)})}catch(d){return O(c)}}function Wb(b){try{return decodeURIComponent(b)}catch(a){}}function Xb(b){var a={},c,d;r((b||"").split("&"),function(b){b&&(c=b.split("="),d=Wb(c[0]),v(d)&&(b=v(c[1])?Wb(c[1]):!0,a[d]?I(a[d])?a[d].push(b):a[d]=[a[d],b]:a[d]=b))});return a}function Yb(b){var a=[];r(b,function(b,d){I(b)?r(b,function(b){a.push(ua(d,!0)+(!0===b?"":"="+ua(b,!0)))}):a.push(ua(d,!0)+(!0===b?"":"="+ua(b,!0)))});return a.length?a.join("&"):""}function wb(b){return ua(b,
!0).replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+")}function ua(b,a){return encodeURIComponent(b).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,a?"%20":"+")}function Uc(b,a){function c(a){a&&d.push(a)}var d=[b],e,f,g=["ng:app","ng-app","x-ng-app","data-ng-app"],h=/\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;r(g,function(a){g[a]=!0;c(T.getElementById(a));a=a.replace(":","\\:");b.querySelectorAll&&(r(b.querySelectorAll("."+a),c),r(b.querySelectorAll("."+
a+"\\:"),c),r(b.querySelectorAll("["+a+"]"),c))});r(d,function(a){if(!e){var b=h.exec(" "+a.className+" ");b?(e=a,f=(b[2]||"").replace(/\s+/g,",")):r(a.attributes,function(b){!e&&g[b.name]&&(e=a,f=b.value)})}});e&&a(e,f?[f]:[])}function Zb(b,a){var c=function(){b=z(b);if(b.injector()){var c=b[0]===T?"document":fa(b);throw Na("btstrpd",c);}a=a||[];a.unshift(["$provide",function(a){a.value("$rootElement",b)}]);a.unshift("ng");c=$b(a);c.invoke(["$rootScope","$rootElement","$compile","$injector","$animate",
function(a,b,c,d,e){a.$apply(function(){b.data("$injector",d);c(b)(a)})}]);return c},d=/^NG_DEFER_BOOTSTRAP!/;if(D&&!d.test(D.name))return c();D.name=D.name.replace(d,"");Ba.resumeBootstrap=function(b){r(b,function(b){a.push(b)});c()}}function cb(b,a){a=a||"_";return b.replace(Vc,function(b,d){return(d?a:"")+b.toLowerCase()})}function xb(b,a,c){if(!b)throw Na("areq",a||"?",c||"required");return b}function Pa(b,a,c){c&&I(b)&&(b=b[b.length-1]);xb(N(b),a,"not a function, got "+(b&&"object"==typeof b?
b.constructor.name||"Object":typeof b));return b}function va(b,a){if("hasOwnProperty"===b)throw Na("badname",a);}function ac(b,a,c){if(!a)return b;a=a.split(".");for(var d,e=b,f=a.length,g=0;g<f;g++)d=a[g],b&&(b=(e=b)[d]);return!c&&N(b)?bb(e,b):b}function yb(b){var a=b[0];b=b[b.length-1];if(a===b)return z(a);var c=[a];do{a=a.nextSibling;if(!a)break;c.push(a)}while(a!==b);return z(c)}function Wc(b){var a=F("$injector"),c=F("ng");b=b.angular||(b.angular={});b.$$minErr=b.$$minErr||F;return b.module||
(b.module=function(){var b={};return function(e,f,g){if("hasOwnProperty"===e)throw c("badname","module");f&&b.hasOwnProperty(e)&&(b[e]=null);return b[e]||(b[e]=function(){function b(a,d,e){return function(){c[e||"push"]([a,d,arguments]);return n}}if(!f)throw a("nomod",e);var c=[],d=[],l=b("$injector","invoke"),n={_invokeQueue:c,_runBlocks:d,requires:f,name:e,provider:b("$provide","provider"),factory:b("$provide","factory"),service:b("$provide","service"),value:b("$provide","value"),constant:b("$provide",
"constant","unshift"),animation:b("$animateProvider","register"),filter:b("$filterProvider","register"),controller:b("$controllerProvider","register"),directive:b("$compileProvider","directive"),config:l,run:function(a){d.push(a);return this}};g&&l(g);return n}())}}())}function Qa(b){return b.replace(Xc,function(a,b,d,e){return e?d.toUpperCase():d}).replace(Yc,"Moz$1")}function zb(b,a,c,d){function e(b){var e=c&&b?[this.filter(b)]:[this],m=a,k,l,n,q,p,y;if(!d||null!=b)for(;e.length;)for(k=e.shift(),
l=0,n=k.length;l<n;l++)for(q=z(k[l]),m?q.triggerHandler("$destroy"):m=!m,p=0,q=(y=q.children()).length;p<q;p++)e.push(Ca(y[p]));return f.apply(this,arguments)}var f=Ca.fn[b],f=f.$original||f;e.$original=f;Ca.fn[b]=e}function R(b){if(b instanceof R)return b;E(b)&&(b=ca(b));if(!(this instanceof R)){if(E(b)&&"<"!=b.charAt(0))throw Ab("nosel");return new R(b)}if(E(b)){var a=T.createElement("div");a.innerHTML="<div>&#160;</div>"+b;a.removeChild(a.firstChild);Bb(this,a.childNodes);z(T.createDocumentFragment()).append(this)}else Bb(this,
b)}function Cb(b){return b.cloneNode(!0)}function Da(b){bc(b);var a=0;for(b=b.childNodes||[];a<b.length;a++)Da(b[a])}function cc(b,a,c,d){if(v(d))throw Ab("offargs");var e=ja(b,"events");ja(b,"handle")&&(B(a)?r(e,function(a,c){Db(b,c,a);delete e[c]}):r(a.split(" "),function(a){B(c)?(Db(b,a,e[a]),delete e[a]):Ma(e[a]||[],c)}))}function bc(b,a){var c=b[db],d=Ra[c];d&&(a?delete Ra[c].data[a]:(d.handle&&(d.events.$destroy&&d.handle({},"$destroy"),cc(b)),delete Ra[c],b[db]=s))}function ja(b,a,c){var d=
b[db],d=Ra[d||-1];if(v(c))d||(b[db]=d=++Zc,d=Ra[d]={}),d[a]=c;else return d&&d[a]}function dc(b,a,c){var d=ja(b,"data"),e=v(c),f=!e&&v(a),g=f&&!X(a);d||g||ja(b,"data",d={});if(e)d[a]=c;else if(f){if(g)return d&&d[a];t(d,a)}else return d}function Eb(b,a){return b.getAttribute?-1<(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ").indexOf(" "+a+" "):!1}function eb(b,a){a&&b.setAttribute&&r(a.split(" "),function(a){b.setAttribute("class",ca((" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g,
" ").replace(" "+ca(a)+" "," ")))})}function fb(b,a){if(a&&b.setAttribute){var c=(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ");r(a.split(" "),function(a){a=ca(a);-1===c.indexOf(" "+a+" ")&&(c+=a+" ")});b.setAttribute("class",ca(c))}}function Bb(b,a){if(a){a=a.nodeName||!v(a.length)||ya(a)?[a]:a;for(var c=0;c<a.length;c++)b.push(a[c])}}function ec(b,a){return gb(b,"$"+(a||"ngController")+"Controller")}function gb(b,a,c){b=z(b);9==b[0].nodeType&&(b=b.find("html"));for(a=I(a)?a:[a];b.length;){for(var d=
0,e=a.length;d<e;d++)if((c=b.data(a[d]))!==s)return c;b=b.parent()}}function fc(b){for(var a=0,c=b.childNodes;a<c.length;a++)Da(c[a]);for(;b.firstChild;)b.removeChild(b.firstChild)}function gc(b,a){var c=hb[a.toLowerCase()];return c&&hc[b.nodeName]&&c}function $c(b,a){var c=function(c,e){c.preventDefault||(c.preventDefault=function(){c.returnValue=!1});c.stopPropagation||(c.stopPropagation=function(){c.cancelBubble=!0});c.target||(c.target=c.srcElement||T);if(B(c.defaultPrevented)){var f=c.preventDefault;
c.preventDefault=function(){c.defaultPrevented=!0;f.call(c)};c.defaultPrevented=!1}c.isDefaultPrevented=function(){return c.defaultPrevented||!1===c.returnValue};var g=Tb(a[e||c.type]||[]);r(g,function(a){a.call(b,c)});8>=P?(c.preventDefault=null,c.stopPropagation=null,c.isDefaultPrevented=null):(delete c.preventDefault,delete c.stopPropagation,delete c.isDefaultPrevented)};c.elem=b;return c}function Ea(b){var a=typeof b,c;"object"==a&&null!==b?"function"==typeof(c=b.$$hashKey)?c=b.$$hashKey():c===
s&&(c=b.$$hashKey=Za()):c=b;return a+":"+c}function Sa(b){r(b,this.put,this)}function ic(b){var a,c;"function"==typeof b?(a=b.$inject)||(a=[],b.length&&(c=b.toString().replace(ad,""),c=c.match(bd),r(c[1].split(cd),function(b){b.replace(dd,function(b,c,d){a.push(d)})})),b.$inject=a):I(b)?(c=b.length-1,Pa(b[c],"fn"),a=b.slice(0,c)):Pa(b,"fn",!0);return a}function $b(b){function a(a){return function(b,c){if(X(b))r(b,Qb(a));else return a(b,c)}}function c(a,b){va(a,"service");if(N(b)||I(b))b=n.instantiate(b);
if(!b.$get)throw Ta("pget",a);return l[a+h]=b}function d(a,b){return c(a,{$get:b})}function e(a){var b=[],c,d,f,h;r(a,function(a){if(!k.get(a)){k.put(a,!0);try{if(E(a))for(c=Ua(a),b=b.concat(e(c.requires)).concat(c._runBlocks),d=c._invokeQueue,f=0,h=d.length;f<h;f++){var g=d[f],m=n.get(g[0]);m[g[1]].apply(m,g[2])}else N(a)?b.push(n.invoke(a)):I(a)?b.push(n.invoke(a)):Pa(a,"module")}catch(l){throw I(a)&&(a=a[a.length-1]),l.message&&(l.stack&&-1==l.stack.indexOf(l.message))&&(l=l.message+"\n"+l.stack),
Ta("modulerr",a,l.stack||l.message||l);}}});return b}function f(a,b){function c(d){if(a.hasOwnProperty(d)){if(a[d]===g)throw Ta("cdep",m.join(" <- "));return a[d]}try{return m.unshift(d),a[d]=g,a[d]=b(d)}catch(e){throw a[d]===g&&delete a[d],e;}finally{m.shift()}}function d(a,b,e){var f=[],h=ic(a),g,k,m;k=0;for(g=h.length;k<g;k++){m=h[k];if("string"!==typeof m)throw Ta("itkn",m);f.push(e&&e.hasOwnProperty(m)?e[m]:c(m))}a.$inject||(a=a[g]);return a.apply(b,f)}return{invoke:d,instantiate:function(a,
b){var c=function(){},e;c.prototype=(I(a)?a[a.length-1]:a).prototype;c=new c;e=d(a,c,b);return X(e)||N(e)?e:c},get:c,annotate:ic,has:function(b){return l.hasOwnProperty(b+h)||a.hasOwnProperty(b)}}}var g={},h="Provider",m=[],k=new Sa,l={$provide:{provider:a(c),factory:a(d),service:a(function(a,b){return d(a,["$injector",function(a){return a.instantiate(b)}])}),value:a(function(a,b){return d(a,$(b))}),constant:a(function(a,b){va(a,"constant");l[a]=b;q[a]=b}),decorator:function(a,b){var c=n.get(a+h),
d=c.$get;c.$get=function(){var a=p.invoke(d,c);return p.invoke(b,null,{$delegate:a})}}}},n=l.$injector=f(l,function(){throw Ta("unpr",m.join(" <- "));}),q={},p=q.$injector=f(q,function(a){a=n.get(a+h);return p.invoke(a.$get,a)});r(e(b),function(a){p.invoke(a||x)});return p}function ed(){var b=!0;this.disableAutoScrolling=function(){b=!1};this.$get=["$window","$location","$rootScope",function(a,c,d){function e(a){var b=null;r(a,function(a){b||"a"!==O(a.nodeName)||(b=a)});return b}function f(){var b=
c.hash(),d;b?(d=g.getElementById(b))?d.scrollIntoView():(d=e(g.getElementsByName(b)))?d.scrollIntoView():"top"===b&&a.scrollTo(0,0):a.scrollTo(0,0)}var g=a.document;b&&d.$watch(function(){return c.hash()},function(){d.$evalAsync(f)});return f}]}function fd(){this.$get=["$$rAF","$timeout",function(b,a){return b.supported?function(a){return b(a)}:function(b){return a(b,0,!1)}}]}function gd(b,a,c,d){function e(a){try{a.apply(null,ta.call(arguments,1))}finally{if(y--,0===y)for(;C.length;)try{C.pop()()}catch(b){c.error(b)}}}
function f(a,b){(function jb(){r(A,function(a){a()});u=b(jb,a)})()}function g(){w=null;H!=h.url()&&(H=h.url(),r(Y,function(a){a(h.url())}))}var h=this,m=a[0],k=b.location,l=b.history,n=b.setTimeout,q=b.clearTimeout,p={};h.isMock=!1;var y=0,C=[];h.$$completeOutstandingRequest=e;h.$$incOutstandingRequestCount=function(){y++};h.notifyWhenNoOutstandingRequests=function(a){r(A,function(a){a()});0===y?a():C.push(a)};var A=[],u;h.addPollFn=function(a){B(u)&&f(100,n);A.push(a);return a};var H=k.href,W=a.find("base"),
w=null;h.url=function(a,c){k!==b.location&&(k=b.location);l!==b.history&&(l=b.history);if(a){if(H!=a)return H=a,d.history?c?l.replaceState(null,"",a):(l.pushState(null,"",a),W.attr("href",W.attr("href"))):(w=a,c?k.replace(a):k.href=a),h}else return w||k.href.replace(/%27/g,"'")};var Y=[],S=!1;h.onUrlChange=function(a){if(!S){if(d.history)z(b).on("popstate",g);if(d.hashchange)z(b).on("hashchange",g);else h.addPollFn(g);S=!0}Y.push(a);return a};h.baseHref=function(){var a=W.attr("href");return a?a.replace(/^(https?\:)?\/\/[^\/]*/,
""):""};var M={},aa="",U=h.baseHref();h.cookies=function(a,b){var d,e,f,h;if(a)b===s?m.cookie=escape(a)+"=;path="+U+";expires=Thu, 01 Jan 1970 00:00:00 GMT":E(b)&&(d=(m.cookie=escape(a)+"="+escape(b)+";path="+U).length+1,4096<d&&c.warn("Cookie '"+a+"' possibly not set or overflowed because it was too large ("+d+" > 4096 bytes)!"));else{if(m.cookie!==aa)for(aa=m.cookie,d=aa.split("; "),M={},f=0;f<d.length;f++)e=d[f],h=e.indexOf("="),0<h&&(a=unescape(e.substring(0,h)),M[a]===s&&(M[a]=unescape(e.substring(h+
1))));return M}};h.defer=function(a,b){var c;y++;c=n(function(){delete p[c];e(a)},b||0);p[c]=!0;return c};h.defer.cancel=function(a){return p[a]?(delete p[a],q(a),e(x),!0):!1}}function hd(){this.$get=["$window","$log","$sniffer","$document",function(b,a,c,d){return new gd(b,d,a,c)}]}function id(){this.$get=function(){function b(b,d){function e(a){a!=n&&(q?q==a&&(q=a.n):q=a,f(a.n,a.p),f(a,n),n=a,n.n=null)}function f(a,b){a!=b&&(a&&(a.p=b),b&&(b.n=a))}if(b in a)throw F("$cacheFactory")("iid",b);var g=
0,h=t({},d,{id:b}),m={},k=d&&d.capacity||Number.MAX_VALUE,l={},n=null,q=null;return a[b]={put:function(a,b){if(k<Number.MAX_VALUE){var c=l[a]||(l[a]={key:a});e(c)}if(!B(b))return a in m||g++,m[a]=b,g>k&&this.remove(q.key),b},get:function(a){if(k<Number.MAX_VALUE){var b=l[a];if(!b)return;e(b)}return m[a]},remove:function(a){if(k<Number.MAX_VALUE){var b=l[a];if(!b)return;b==n&&(n=b.p);b==q&&(q=b.n);f(b.n,b.p);delete l[a]}delete m[a];g--},removeAll:function(){m={};g=0;l={};n=q=null},destroy:function(){l=
h=m=null;delete a[b]},info:function(){return t({},h,{size:g})}}}var a={};b.info=function(){var b={};r(a,function(a,e){b[e]=a.info()});return b};b.get=function(b){return a[b]};return b}}function jd(){this.$get=["$cacheFactory",function(b){return b("templates")}]}function jc(b,a){var c={},d="Directive",e=/^\s*directive\:\s*([\d\w\-_]+)\s+(.*)$/,f=/(([\d\w\-_]+)(?:\:([^;]+))?;?)/,g=/^<\s*(tr|th|td|tbody)(\s+[^>]*)?>/i,h=/^(on[a-z]+|formaction)$/;this.directive=function k(a,e){va(a,"directive");E(a)?
(xb(e,"directiveFactory"),c.hasOwnProperty(a)||(c[a]=[],b.factory(a+d,["$injector","$exceptionHandler",function(b,d){var e=[];r(c[a],function(c,f){try{var h=b.invoke(c);N(h)?h={compile:$(h)}:!h.compile&&h.link&&(h.compile=$(h.link));h.priority=h.priority||0;h.index=f;h.name=h.name||a;h.require=h.require||h.controller&&h.name;h.restrict=h.restrict||"A";e.push(h)}catch(g){d(g)}});return e}])),c[a].push(e)):r(a,Qb(k));return this};this.aHrefSanitizationWhitelist=function(b){return v(b)?(a.aHrefSanitizationWhitelist(b),
this):a.aHrefSanitizationWhitelist()};this.imgSrcSanitizationWhitelist=function(b){return v(b)?(a.imgSrcSanitizationWhitelist(b),this):a.imgSrcSanitizationWhitelist()};this.$get=["$injector","$interpolate","$exceptionHandler","$http","$templateCache","$parse","$controller","$rootScope","$document","$sce","$animate","$$sanitizeUri",function(a,b,n,q,p,y,C,A,u,H,W,w){function Y(a,b,c,d,e){a instanceof z||(a=z(a));r(a,function(b,c){3==b.nodeType&&b.nodeValue.match(/\S+/)&&(a[c]=z(b).wrap("<span></span>").parent()[0])});
var f=M(a,b,a,c,d,e);S(a,"ng-scope");return function(b,c,d){xb(b,"scope");var e=c?Fa.clone.call(a):a;r(d,function(a,b){e.data("$"+b+"Controller",a)});d=0;for(var h=e.length;d<h;d++){var g=e[d].nodeType;1!==g&&9!==g||e.eq(d).data("$scope",b)}c&&c(e,b);f&&f(b,e,e);return e}}function S(a,b){try{a.addClass(b)}catch(c){}}function M(a,b,c,d,e,f){function h(a,c,d,e){var f,k,l,n,p,q,y;f=c.length;var L=Array(f);for(p=0;p<f;p++)L[p]=c[p];y=p=0;for(q=g.length;p<q;y++)k=L[y],c=g[p++],f=g[p++],l=z(k),c?(c.scope?
(n=a.$new(),l.data("$scope",n)):n=a,(l=c.transclude)||!e&&b?c(f,n,k,d,aa(a,l||b)):c(f,n,k,d,e)):f&&f(a,k.childNodes,s,e)}for(var g=[],k,l,n,p,q=0;q<a.length;q++)k=new Fb,l=U(a[q],[],k,0===q?d:s,e),(f=l.length?Va(l,a[q],k,b,c,null,[],[],f):null)&&f.scope&&S(z(a[q]),"ng-scope"),k=f&&f.terminal||!(n=a[q].childNodes)||!n.length?null:M(n,f?f.transclude:b),g.push(f,k),p=p||f||k,f=null;return p?h:null}function aa(a,b){return function(c,d,e){var f=!1;c||(c=a.$new(),f=c.$$transcluded=!0);d=b(c,d,e);if(f)d.on("$destroy",
bb(c,c.$destroy));return d}}function U(a,b,c,d,h){var g=c.$attr,k;switch(a.nodeType){case 1:v(b,ka(Ga(a).toLowerCase()),"E",d,h);var l,n,p;k=a.attributes;for(var q=0,y=k&&k.length;q<y;q++){var C=!1,H=!1;l=k[q];if(!P||8<=P||l.specified){n=l.name;p=ka(n);oa.test(p)&&(n=cb(p.substr(6),"-"));var A=p.replace(/(Start|End)$/,"");p===A+"Start"&&(C=n,H=n.substr(0,n.length-5)+"end",n=n.substr(0,n.length-6));p=ka(n.toLowerCase());g[p]=n;c[p]=l=ca(l.value);gc(a,p)&&(c[p]=!0);ga(a,b,l,p);v(b,p,"A",d,h,C,H)}}a=
a.className;if(E(a)&&""!==a)for(;k=f.exec(a);)p=ka(k[2]),v(b,p,"C",d,h)&&(c[p]=ca(k[3])),a=a.substr(k.index+k[0].length);break;case 3:D(b,a.nodeValue);break;case 8:try{if(k=e.exec(a.nodeValue))p=ka(k[1]),v(b,p,"M",d,h)&&(c[p]=ca(k[2]))}catch(w){}}b.sort(F);return b}function J(a,b,c){var d=[],e=0;if(b&&a.hasAttribute&&a.hasAttribute(b)){do{if(!a)throw ha("uterdir",b,c);1==a.nodeType&&(a.hasAttribute(b)&&e++,a.hasAttribute(c)&&e--);d.push(a);a=a.nextSibling}while(0<e)}else d.push(a);return z(d)}function ib(a,
b,c){return function(d,e,f,h,g){e=J(e[0],b,c);return a(d,e,f,h,g)}}function Va(a,c,d,e,f,h,g,k,p){function q(a,b,c,d){if(a){c&&(a=ib(a,c,d));a.require=G.require;if(M===G||G.$$isolateScope)a=kc(a,{isolateScope:!0});g.push(a)}if(b){c&&(b=ib(b,c,d));b.require=G.require;if(M===G||G.$$isolateScope)b=kc(b,{isolateScope:!0});k.push(b)}}function H(a,b,c){var d,e="data",f=!1;if(E(a)){for(;"^"==(d=a.charAt(0))||"?"==d;)a=a.substr(1),"^"==d&&(e="inheritedData"),f=f||"?"==d;d=null;c&&"data"===e&&(d=c[a]);d=d||
b[e]("$"+a+"Controller");if(!d&&!f)throw ha("ctreq",a,ga);}else I(a)&&(d=[],r(a,function(a){d.push(H(a,b,c))}));return d}function A(a,e,f,h,p){function q(a,b){var c;2>arguments.length&&(b=a,a=s);Ha&&(c=kb);return p(a,b,c)}var L,w,u,Y,J,U,kb={},v;L=c===f?d:Tb(d,new Fb(z(f),d.$attr));w=L.$$element;if(M){var t=/^\s*([@=&])(\??)\s*(\w*)\s*$/;h=z(f);U=e.$new(!0);aa&&aa===M.$$originalDirective?h.data("$isolateScope",U):h.data("$isolateScopeNoTemplate",U);S(h,"ng-isolate-scope");r(M.scope,function(a,c){var d=
a.match(t)||[],f=d[3]||c,h="?"==d[2],d=d[1],g,k,p,n;U.$$isolateBindings[c]=d+f;switch(d){case "@":L.$observe(f,function(a){U[c]=a});L.$$observers[f].$$scope=e;L[f]&&(U[c]=b(L[f])(e));break;case "=":if(h&&!L[f])break;k=y(L[f]);n=k.literal?sa:function(a,b){return a===b};p=k.assign||function(){g=U[c]=k(e);throw ha("nonassign",L[f],M.name);};g=U[c]=k(e);U.$watch(function(){var a=k(e);n(a,U[c])||(n(a,g)?p(e,a=U[c]):U[c]=a);return g=a},null,k.literal);break;case "&":k=y(L[f]);U[c]=function(a){return k(e,
a)};break;default:throw ha("iscp",M.name,c,a);}})}v=p&&q;W&&r(W,function(a){var b={$scope:a===M||a.$$isolateScope?U:e,$element:w,$attrs:L,$transclude:v},c;J=a.controller;"@"==J&&(J=L[a.name]);c=C(J,b);kb[a.name]=c;Ha||w.data("$"+a.name+"Controller",c);a.controllerAs&&(b.$scope[a.controllerAs]=c)});h=0;for(u=g.length;h<u;h++)try{Y=g[h],Y(Y.isolateScope?U:e,w,L,Y.require&&H(Y.require,w,kb),v)}catch(K){n(K,fa(w))}h=e;M&&(M.template||null===M.templateUrl)&&(h=U);a&&a(h,f.childNodes,s,p);for(h=k.length-
1;0<=h;h--)try{Y=k[h],Y(Y.isolateScope?U:e,w,L,Y.require&&H(Y.require,w,kb),v)}catch(ib){n(ib,fa(w))}}p=p||{};for(var w=-Number.MAX_VALUE,u,W=p.controllerDirectives,M=p.newIsolateScopeDirective,aa=p.templateDirective,v=p.nonTlbTranscludeDirective,Va=!1,Ha=p.hasElementTranscludeDirective,K=d.$$element=z(c),G,ga,t,F=e,oa,D=0,P=a.length;D<P;D++){G=a[D];var Q=G.$$start,V=G.$$end;Q&&(K=J(c,Q,V));t=s;if(w>G.priority)break;if(t=G.scope)u=u||G,G.templateUrl||(R("new/isolated scope",M,G,K),X(t)&&(M=G));ga=
G.name;!G.templateUrl&&G.controller&&(t=G.controller,W=W||{},R("'"+ga+"' controller",W[ga],G,K),W[ga]=G);if(t=G.transclude)Va=!0,G.$$tlb||(R("transclusion",v,G,K),v=G),"element"==t?(Ha=!0,w=G.priority,t=J(c,Q,V),K=d.$$element=z(T.createComment(" "+ga+": "+d[ga]+" ")),c=K[0],lb(f,z(ta.call(t,0)),c),F=Y(t,e,w,h&&h.name,{nonTlbTranscludeDirective:v})):(t=z(Cb(c)).contents(),K.empty(),F=Y(t,e));if(G.template)if(R("template",aa,G,K),aa=G,t=N(G.template)?G.template(K,d):G.template,t=lc(t),G.replace){h=
G;t=B(t);c=t[0];if(1!=t.length||1!==c.nodeType)throw ha("tplrt",ga,"");lb(f,K,c);P={$attr:{}};t=U(c,[],P);var Z=a.splice(D+1,a.length-(D+1));M&&jb(t);a=a.concat(t).concat(Z);x(d,P);P=a.length}else K.html(t);if(G.templateUrl)R("template",aa,G,K),aa=G,G.replace&&(h=G),A=O(a.splice(D,a.length-D),K,d,f,F,g,k,{controllerDirectives:W,newIsolateScopeDirective:M,templateDirective:aa,nonTlbTranscludeDirective:v}),P=a.length;else if(G.compile)try{oa=G.compile(K,d,F),N(oa)?q(null,oa,Q,V):oa&&q(oa.pre,oa.post,
Q,V)}catch($){n($,fa(K))}G.terminal&&(A.terminal=!0,w=Math.max(w,G.priority))}A.scope=u&&!0===u.scope;A.transclude=Va&&F;p.hasElementTranscludeDirective=Ha;return A}function jb(a){for(var b=0,c=a.length;b<c;b++)a[b]=Sb(a[b],{$$isolateScope:!0})}function v(b,e,f,h,g,l,p){if(e===g)return null;g=null;if(c.hasOwnProperty(e)){var q;e=a.get(e+d);for(var y=0,C=e.length;y<C;y++)try{q=e[y],(h===s||h>q.priority)&&-1!=q.restrict.indexOf(f)&&(l&&(q=Sb(q,{$$start:l,$$end:p})),b.push(q),g=q)}catch(H){n(H)}}return g}
function x(a,b){var c=b.$attr,d=a.$attr,e=a.$$element;r(a,function(d,e){"$"!=e.charAt(0)&&(b[e]&&(d+=("style"===e?";":" ")+b[e]),a.$set(e,d,!0,c[e]))});r(b,function(b,f){"class"==f?(S(e,b),a["class"]=(a["class"]?a["class"]+" ":"")+b):"style"==f?(e.attr("style",e.attr("style")+";"+b),a.style=(a.style?a.style+";":"")+b):"$"==f.charAt(0)||a.hasOwnProperty(f)||(a[f]=b,d[f]=c[f])})}function B(a){var b;a=ca(a);if(b=g.exec(a)){b=b[1].toLowerCase();a=z("<table>"+a+"</table>");var c=a.children("tbody"),d=
/(td|th)/.test(b)&&a.find("tr");c.length&&"tbody"!==b&&(a=c);d&&d.length&&(a=d);return a.contents()}return z("<div>"+a+"</div>").contents()}function O(a,b,c,d,e,f,h,g){var k=[],l,n,y=b[0],C=a.shift(),w=t({},C,{templateUrl:null,transclude:null,replace:null,$$originalDirective:C}),A=N(C.templateUrl)?C.templateUrl(b,c):C.templateUrl;b.empty();q.get(H.getTrustedResourceUrl(A),{cache:p}).success(function(p){var q,H;p=lc(p);if(C.replace){p=B(p);q=p[0];if(1!=p.length||1!==q.nodeType)throw ha("tplrt",C.name,
A);p={$attr:{}};lb(d,b,q);var u=U(q,[],p);X(C.scope)&&jb(u);a=u.concat(a);x(c,p)}else q=y,b.html(p);a.unshift(w);l=Va(a,q,c,e,b,C,f,h,g);r(d,function(a,c){a==q&&(d[c]=b[0])});for(n=M(b[0].childNodes,e);k.length;){p=k.shift();H=k.shift();var W=k.shift(),Y=k.shift(),u=b[0];if(H!==y){var J=H.className;g.hasElementTranscludeDirective&&C.replace||(u=Cb(q));lb(W,z(H),u);S(z(u),J)}H=l.transclude?aa(p,l.transclude):Y;l(n,p,u,d,H)}k=null}).error(function(a,b,c,d){throw ha("tpload",d.url);});return function(a,
b,c,d,e){k?(k.push(b),k.push(c),k.push(d),k.push(e)):l(n,b,c,d,e)}}function F(a,b){var c=b.priority-a.priority;return 0!==c?c:a.name!==b.name?a.name<b.name?-1:1:a.index-b.index}function R(a,b,c,d){if(b)throw ha("multidir",b.name,c.name,a,fa(d));}function D(a,c){var d=b(c,!0);d&&a.push({priority:0,compile:$(function(a,b){var c=b.parent(),e=c.data("$binding")||[];e.push(d);S(c.data("$binding",e),"ng-binding");a.$watch(d,function(a){b[0].nodeValue=a})})})}function Ha(a,b){if("srcdoc"==b)return H.HTML;
var c=Ga(a);if("xlinkHref"==b||"FORM"==c&&"action"==b||"IMG"!=c&&("src"==b||"ngSrc"==b))return H.RESOURCE_URL}function ga(a,c,d,e){var f=b(d,!0);if(f){if("multiple"===e&&"SELECT"===Ga(a))throw ha("selmulti",fa(a));c.push({priority:100,compile:function(){return{pre:function(c,d,g){d=g.$$observers||(g.$$observers={});if(h.test(e))throw ha("nodomevents");if(f=b(g[e],!0,Ha(a,e)))g[e]=f(c),(d[e]||(d[e]=[])).$$inter=!0,(g.$$observers&&g.$$observers[e].$$scope||c).$watch(f,function(a,b){"class"===e&&a!=
b?g.$updateClass(a,b):g.$set(e,a)})}}}})}}function lb(a,b,c){var d=b[0],e=b.length,f=d.parentNode,h,g;if(a)for(h=0,g=a.length;h<g;h++)if(a[h]==d){a[h++]=c;g=h+e-1;for(var k=a.length;h<k;h++,g++)g<k?a[h]=a[g]:delete a[h];a.length-=e-1;break}f&&f.replaceChild(c,d);a=T.createDocumentFragment();a.appendChild(d);c[z.expando]=d[z.expando];d=1;for(e=b.length;d<e;d++)f=b[d],z(f).remove(),a.appendChild(f),delete b[d];b[0]=c;b.length=1}function kc(a,b){return t(function(){return a.apply(null,arguments)},a,
b)}var Fb=function(a,b){this.$$element=a;this.$attr=b||{}};Fb.prototype={$normalize:ka,$addClass:function(a){a&&0<a.length&&W.addClass(this.$$element,a)},$removeClass:function(a){a&&0<a.length&&W.removeClass(this.$$element,a)},$updateClass:function(a,b){var c=mc(a,b),d=mc(b,a);0===c.length?W.removeClass(this.$$element,d):0===d.length?W.addClass(this.$$element,c):W.setClass(this.$$element,c,d)},$set:function(a,b,c,d){var e=gc(this.$$element[0],a);e&&(this.$$element.prop(a,b),d=e);this[a]=b;d?this.$attr[a]=
d:(d=this.$attr[a])||(this.$attr[a]=d=cb(a,"-"));e=Ga(this.$$element);if("A"===e&&"href"===a||"IMG"===e&&"src"===a)this[a]=b=w(b,"src"===a);!1!==c&&(null===b||b===s?this.$$element.removeAttr(d):this.$$element.attr(d,b));(c=this.$$observers)&&r(c[a],function(a){try{a(b)}catch(c){n(c)}})},$observe:function(a,b){var c=this,d=c.$$observers||(c.$$observers={}),e=d[a]||(d[a]=[]);e.push(b);A.$evalAsync(function(){e.$$inter||b(c[a])});return b}};var Q=b.startSymbol(),V=b.endSymbol(),lc="{{"==Q||"}}"==V?za:
function(a){return a.replace(/\{\{/g,Q).replace(/}}/g,V)},oa=/^ngAttr[A-Z]/;return Y}]}function ka(b){return Qa(b.replace(kd,""))}function mc(b,a){var c="",d=b.split(/\s+/),e=a.split(/\s+/),f=0;a:for(;f<d.length;f++){for(var g=d[f],h=0;h<e.length;h++)if(g==e[h])continue a;c+=(0<c.length?" ":"")+g}return c}function ld(){var b={},a=/^(\S+)(\s+as\s+(\w+))?$/;this.register=function(a,d){va(a,"controller");X(a)?t(b,a):b[a]=d};this.$get=["$injector","$window",function(c,d){return function(e,f){var g,h,
m;E(e)&&(g=e.match(a),h=g[1],m=g[3],e=b.hasOwnProperty(h)?b[h]:ac(f.$scope,h,!0)||ac(d,h,!0),Pa(e,h,!0));g=c.instantiate(e,f);if(m){if(!f||"object"!=typeof f.$scope)throw F("$controller")("noscp",h||e.name,m);f.$scope[m]=g}return g}}]}function md(){this.$get=["$window",function(b){return z(b.document)}]}function nd(){this.$get=["$log",function(b){return function(a,c){b.error.apply(b,arguments)}}]}function nc(b){var a={},c,d,e;if(!b)return a;r(b.split("\n"),function(b){e=b.indexOf(":");c=O(ca(b.substr(0,
e)));d=ca(b.substr(e+1));c&&(a[c]=a[c]?a[c]+(", "+d):d)});return a}function oc(b){var a=X(b)?b:s;return function(c){a||(a=nc(b));return c?a[O(c)]||null:a}}function pc(b,a,c){if(N(c))return c(b,a);r(c,function(c){b=c(b,a)});return b}function od(){var b=/^\s*(\[|\{[^\{])/,a=/[\}\]]\s*$/,c=/^\)\]\}',?\n/,d={"Content-Type":"application/json;charset=utf-8"},e=this.defaults={transformResponse:[function(d){E(d)&&(d=d.replace(c,""),b.test(d)&&a.test(d)&&(d=Vb(d)));return d}],transformRequest:[function(a){return X(a)&&
"[object File]"!==Aa.call(a)?na(a):a}],headers:{common:{Accept:"application/json, text/plain, */*"},post:ba(d),put:ba(d),patch:ba(d)},xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN"},f=this.interceptors=[],g=this.responseInterceptors=[];this.$get=["$httpBackend","$browser","$cacheFactory","$rootScope","$q","$injector",function(a,b,c,d,n,q){function p(a){function c(a){var b=t({},a,{data:pc(a.data,a.headers,d.transformResponse)});return 200<=a.status&&300>a.status?b:n.reject(b)}var d={method:"get",
transformRequest:e.transformRequest,transformResponse:e.transformResponse},f=function(a){function b(a){var c;r(a,function(b,d){N(b)&&(c=b(),null!=c?a[d]=c:delete a[d])})}var c=e.headers,d=t({},a.headers),f,h,c=t({},c.common,c[O(a.method)]);b(c);b(d);a:for(f in c){a=O(f);for(h in d)if(O(h)===a)continue a;d[f]=c[f]}return d}(a);t(d,a);d.headers=f;d.method=Ia(d.method);(a=Gb(d.url)?b.cookies()[d.xsrfCookieName||e.xsrfCookieName]:s)&&(f[d.xsrfHeaderName||e.xsrfHeaderName]=a);var h=[function(a){f=a.headers;
var b=pc(a.data,oc(f),a.transformRequest);B(a.data)&&r(f,function(a,b){"content-type"===O(b)&&delete f[b]});B(a.withCredentials)&&!B(e.withCredentials)&&(a.withCredentials=e.withCredentials);return y(a,b,f).then(c,c)},s],g=n.when(d);for(r(u,function(a){(a.request||a.requestError)&&h.unshift(a.request,a.requestError);(a.response||a.responseError)&&h.push(a.response,a.responseError)});h.length;){a=h.shift();var k=h.shift(),g=g.then(a,k)}g.success=function(a){g.then(function(b){a(b.data,b.status,b.headers,
d)});return g};g.error=function(a){g.then(null,function(b){a(b.data,b.status,b.headers,d)});return g};return g}function y(b,c,f){function g(a,b,c){u&&(200<=a&&300>a?u.put(s,[a,b,nc(c)]):u.remove(s));k(b,a,c);d.$$phase||d.$apply()}function k(a,c,d){c=Math.max(c,0);(200<=c&&300>c?q.resolve:q.reject)({data:a,status:c,headers:oc(d),config:b})}function m(){var a=ab(p.pendingRequests,b);-1!==a&&p.pendingRequests.splice(a,1)}var q=n.defer(),y=q.promise,u,r,s=C(b.url,b.params);p.pendingRequests.push(b);y.then(m,
m);(b.cache||e.cache)&&(!1!==b.cache&&"GET"==b.method)&&(u=X(b.cache)?b.cache:X(e.cache)?e.cache:A);if(u)if(r=u.get(s),v(r)){if(r.then)return r.then(m,m),r;I(r)?k(r[1],r[0],ba(r[2])):k(r,200,{})}else u.put(s,y);B(r)&&a(b.method,s,c,g,f,b.timeout,b.withCredentials,b.responseType);return y}function C(a,b){if(!b)return a;var c=[];Qc(b,function(a,b){null===a||B(a)||(I(a)||(a=[a]),r(a,function(a){X(a)&&(a=na(a));c.push(ua(b)+"="+ua(a))}))});0<c.length&&(a+=(-1==a.indexOf("?")?"?":"&")+c.join("&"));return a}
var A=c("$http"),u=[];r(f,function(a){u.unshift(E(a)?q.get(a):q.invoke(a))});r(g,function(a,b){var c=E(a)?q.get(a):q.invoke(a);u.splice(b,0,{response:function(a){return c(n.when(a))},responseError:function(a){return c(n.reject(a))}})});p.pendingRequests=[];(function(a){r(arguments,function(a){p[a]=function(b,c){return p(t(c||{},{method:a,url:b}))}})})("get","delete","head","jsonp");(function(a){r(arguments,function(a){p[a]=function(b,c,d){return p(t(d||{},{method:a,url:b,data:c}))}})})("post","put");
p.defaults=e;return p}]}function pd(b){if(8>=P&&(!b.match(/^(get|post|head|put|delete|options)$/i)||!D.XMLHttpRequest))return new D.ActiveXObject("Microsoft.XMLHTTP");if(D.XMLHttpRequest)return new D.XMLHttpRequest;throw F("$httpBackend")("noxhr");}function qd(){this.$get=["$browser","$window","$document",function(b,a,c){return rd(b,pd,b.defer,a.angular.callbacks,c[0])}]}function rd(b,a,c,d,e){function f(a,b){var c=e.createElement("script"),d=function(){c.onreadystatechange=c.onload=c.onerror=null;
e.body.removeChild(c);b&&b()};c.type="text/javascript";c.src=a;P&&8>=P?c.onreadystatechange=function(){/loaded|complete/.test(c.readyState)&&d()}:c.onload=c.onerror=function(){d()};e.body.appendChild(c);return d}var g=-1;return function(e,m,k,l,n,q,p,y){function C(){u=g;W&&W();w&&w.abort()}function A(a,d,e,f){S&&c.cancel(S);W=w=null;d=0===d?e?200:404:d;a(1223==d?204:d,e,f);b.$$completeOutstandingRequest(x)}var u;b.$$incOutstandingRequestCount();m=m||b.url();if("jsonp"==O(e)){var H="_"+(d.counter++).toString(36);
d[H]=function(a){d[H].data=a};var W=f(m.replace("JSON_CALLBACK","angular.callbacks."+H),function(){d[H].data?A(l,200,d[H].data):A(l,u||-2);d[H]=Ba.noop})}else{var w=a(e);w.open(e,m,!0);r(n,function(a,b){v(a)&&w.setRequestHeader(b,a)});w.onreadystatechange=function(){if(w&&4==w.readyState){var a=null,b=null;u!==g&&(a=w.getAllResponseHeaders(),b="response"in w?w.response:w.responseText);A(l,u||w.status,b,a)}};p&&(w.withCredentials=!0);if(y)try{w.responseType=y}catch(Y){if("json"!==y)throw Y;}w.send(k||
null)}if(0<q)var S=c(C,q);else q&&q.then&&q.then(C)}}function sd(){var b="{{",a="}}";this.startSymbol=function(a){return a?(b=a,this):b};this.endSymbol=function(b){return b?(a=b,this):a};this.$get=["$parse","$exceptionHandler","$sce",function(c,d,e){function f(f,k,l){for(var n,q,p=0,y=[],C=f.length,A=!1,u=[];p<C;)-1!=(n=f.indexOf(b,p))&&-1!=(q=f.indexOf(a,n+g))?(p!=n&&y.push(f.substring(p,n)),y.push(p=c(A=f.substring(n+g,q))),p.exp=A,p=q+h,A=!0):(p!=C&&y.push(f.substring(p)),p=C);(C=y.length)||(y.push(""),
C=1);if(l&&1<y.length)throw qc("noconcat",f);if(!k||A)return u.length=C,p=function(a){try{for(var b=0,c=C,h;b<c;b++)"function"==typeof(h=y[b])&&(h=h(a),h=l?e.getTrusted(l,h):e.valueOf(h),null===h||B(h)?h="":"string"!=typeof h&&(h=na(h))),u[b]=h;return u.join("")}catch(g){a=qc("interr",f,g.toString()),d(a)}},p.exp=f,p.parts=y,p}var g=b.length,h=a.length;f.startSymbol=function(){return b};f.endSymbol=function(){return a};return f}]}function td(){this.$get=["$rootScope","$window","$q",function(b,a,c){function d(d,
g,h,m){var k=a.setInterval,l=a.clearInterval,n=c.defer(),q=n.promise,p=0,y=v(m)&&!m;h=v(h)?h:0;q.then(null,null,d);q.$$intervalId=k(function(){n.notify(p++);0<h&&p>=h&&(n.resolve(p),l(q.$$intervalId),delete e[q.$$intervalId]);y||b.$apply()},g);e[q.$$intervalId]=n;return q}var e={};d.cancel=function(a){return a&&a.$$intervalId in e?(e[a.$$intervalId].reject("canceled"),clearInterval(a.$$intervalId),delete e[a.$$intervalId],!0):!1};return d}]}function ud(){this.$get=function(){return{id:"en-us",NUMBER_FORMATS:{DECIMAL_SEP:".",
GROUP_SEP:",",PATTERNS:[{minInt:1,minFrac:0,maxFrac:3,posPre:"",posSuf:"",negPre:"-",negSuf:"",gSize:3,lgSize:3},{minInt:1,minFrac:2,maxFrac:2,posPre:"\u00a4",posSuf:"",negPre:"(\u00a4",negSuf:")",gSize:3,lgSize:3}],CURRENCY_SYM:"$"},DATETIME_FORMATS:{MONTH:"January February March April May June July August September October November December".split(" "),SHORTMONTH:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),DAY:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
SHORTDAY:"Sun Mon Tue Wed Thu Fri Sat".split(" "),AMPMS:["AM","PM"],medium:"MMM d, y h:mm:ss a","short":"M/d/yy h:mm a",fullDate:"EEEE, MMMM d, y",longDate:"MMMM d, y",mediumDate:"MMM d, y",shortDate:"M/d/yy",mediumTime:"h:mm:ss a",shortTime:"h:mm a"},pluralCat:function(b){return 1===b?"one":"other"}}}}function rc(b){b=b.split("/");for(var a=b.length;a--;)b[a]=wb(b[a]);return b.join("/")}function sc(b,a,c){b=wa(b,c);a.$$protocol=b.protocol;a.$$host=b.hostname;a.$$port=Q(b.port)||vd[b.protocol]||null}
function tc(b,a,c){var d="/"!==b.charAt(0);d&&(b="/"+b);b=wa(b,c);a.$$path=decodeURIComponent(d&&"/"===b.pathname.charAt(0)?b.pathname.substring(1):b.pathname);a.$$search=Xb(b.search);a.$$hash=decodeURIComponent(b.hash);a.$$path&&"/"!=a.$$path.charAt(0)&&(a.$$path="/"+a.$$path)}function la(b,a){if(0===a.indexOf(b))return a.substr(b.length)}function Wa(b){var a=b.indexOf("#");return-1==a?b:b.substr(0,a)}function Hb(b){return b.substr(0,Wa(b).lastIndexOf("/")+1)}function uc(b,a){this.$$html5=!0;a=a||
"";var c=Hb(b);sc(b,this,b);this.$$parse=function(a){var e=la(c,a);if(!E(e))throw Ib("ipthprfx",a,c);tc(e,this,b);this.$$path||(this.$$path="/");this.$$compose()};this.$$compose=function(){var a=Yb(this.$$search),b=this.$$hash?"#"+wb(this.$$hash):"";this.$$url=rc(this.$$path)+(a?"?"+a:"")+b;this.$$absUrl=c+this.$$url.substr(1)};this.$$rewrite=function(d){var e;if((e=la(b,d))!==s)return d=e,(e=la(a,e))!==s?c+(la("/",e)||e):b+d;if((e=la(c,d))!==s)return c+e;if(c==d+"/")return c}}function Jb(b,a){var c=
Hb(b);sc(b,this,b);this.$$parse=function(d){var e=la(b,d)||la(c,d),e="#"==e.charAt(0)?la(a,e):this.$$html5?e:"";if(!E(e))throw Ib("ihshprfx",d,a);tc(e,this,b);d=this.$$path;var f=/^\/?.*?:(\/.*)/;0===e.indexOf(b)&&(e=e.replace(b,""));f.exec(e)||(d=(e=f.exec(d))?e[1]:d);this.$$path=d;this.$$compose()};this.$$compose=function(){var c=Yb(this.$$search),e=this.$$hash?"#"+wb(this.$$hash):"";this.$$url=rc(this.$$path)+(c?"?"+c:"")+e;this.$$absUrl=b+(this.$$url?a+this.$$url:"")};this.$$rewrite=function(a){if(Wa(b)==
Wa(a))return a}}function vc(b,a){this.$$html5=!0;Jb.apply(this,arguments);var c=Hb(b);this.$$rewrite=function(d){var e;if(b==Wa(d))return d;if(e=la(c,d))return b+a+e;if(c===d+"/")return c}}function mb(b){return function(){return this[b]}}function wc(b,a){return function(c){if(B(c))return this[b];this[b]=a(c);this.$$compose();return this}}function wd(){var b="",a=!1;this.hashPrefix=function(a){return v(a)?(b=a,this):b};this.html5Mode=function(b){return v(b)?(a=b,this):a};this.$get=["$rootScope","$browser",
"$sniffer","$rootElement",function(c,d,e,f){function g(a){c.$broadcast("$locationChangeSuccess",h.absUrl(),a)}var h,m=d.baseHref(),k=d.url();a?(m=k.substring(0,k.indexOf("/",k.indexOf("//")+2))+(m||"/"),e=e.history?uc:vc):(m=Wa(k),e=Jb);h=new e(m,"#"+b);h.$$parse(h.$$rewrite(k));f.on("click",function(a){if(!a.ctrlKey&&!a.metaKey&&2!=a.which){for(var b=z(a.target);"a"!==O(b[0].nodeName);)if(b[0]===f[0]||!(b=b.parent())[0])return;var e=b.prop("href");X(e)&&"[object SVGAnimatedString]"===e.toString()&&
(e=wa(e.animVal).href);var g=h.$$rewrite(e);e&&(!b.attr("target")&&g&&!a.isDefaultPrevented())&&(a.preventDefault(),g!=d.url()&&(h.$$parse(g),c.$apply(),D.angular["ff-684208-preventDefault"]=!0))}});h.absUrl()!=k&&d.url(h.absUrl(),!0);d.onUrlChange(function(a){h.absUrl()!=a&&(c.$evalAsync(function(){var b=h.absUrl();h.$$parse(a);c.$broadcast("$locationChangeStart",a,b).defaultPrevented?(h.$$parse(b),d.url(b)):g(b)}),c.$$phase||c.$digest())});var l=0;c.$watch(function(){var a=d.url(),b=h.$$replace;
l&&a==h.absUrl()||(l++,c.$evalAsync(function(){c.$broadcast("$locationChangeStart",h.absUrl(),a).defaultPrevented?h.$$parse(a):(d.url(h.absUrl(),b),g(a))}));h.$$replace=!1;return l});return h}]}function xd(){var b=!0,a=this;this.debugEnabled=function(a){return v(a)?(b=a,this):b};this.$get=["$window",function(c){function d(a){a instanceof Error&&(a.stack?a=a.message&&-1===a.stack.indexOf(a.message)?"Error: "+a.message+"\n"+a.stack:a.stack:a.sourceURL&&(a=a.message+"\n"+a.sourceURL+":"+a.line));return a}
function e(a){var b=c.console||{},e=b[a]||b.log||x;a=!1;try{a=!!e.apply}catch(m){}return a?function(){var a=[];r(arguments,function(b){a.push(d(b))});return e.apply(b,a)}:function(a,b){e(a,null==b?"":b)}}return{log:e("log"),info:e("info"),warn:e("warn"),error:e("error"),debug:function(){var c=e("debug");return function(){b&&c.apply(a,arguments)}}()}}]}function da(b,a){if("constructor"===b)throw xa("isecfld",a);return b}function Xa(b,a){if(b){if(b.constructor===b)throw xa("isecfn",a);if(b.document&&
b.location&&b.alert&&b.setInterval)throw xa("isecwindow",a);if(b.children&&(b.nodeName||b.prop&&b.attr&&b.find))throw xa("isecdom",a);}return b}function nb(b,a,c,d,e){e=e||{};a=a.split(".");for(var f,g=0;1<a.length;g++){f=da(a.shift(),d);var h=b[f];h||(h={},b[f]=h);b=h;b.then&&e.unwrapPromises&&(pa(d),"$$v"in b||function(a){a.then(function(b){a.$$v=b})}(b),b.$$v===s&&(b.$$v={}),b=b.$$v)}f=da(a.shift(),d);return b[f]=c}function xc(b,a,c,d,e,f,g){da(b,f);da(a,f);da(c,f);da(d,f);da(e,f);return g.unwrapPromises?
function(h,g){var k=g&&g.hasOwnProperty(b)?g:h,l;if(null==k)return k;(k=k[b])&&k.then&&(pa(f),"$$v"in k||(l=k,l.$$v=s,l.then(function(a){l.$$v=a})),k=k.$$v);if(!a)return k;if(null==k)return s;(k=k[a])&&k.then&&(pa(f),"$$v"in k||(l=k,l.$$v=s,l.then(function(a){l.$$v=a})),k=k.$$v);if(!c)return k;if(null==k)return s;(k=k[c])&&k.then&&(pa(f),"$$v"in k||(l=k,l.$$v=s,l.then(function(a){l.$$v=a})),k=k.$$v);if(!d)return k;if(null==k)return s;(k=k[d])&&k.then&&(pa(f),"$$v"in k||(l=k,l.$$v=s,l.then(function(a){l.$$v=
a})),k=k.$$v);if(!e)return k;if(null==k)return s;(k=k[e])&&k.then&&(pa(f),"$$v"in k||(l=k,l.$$v=s,l.then(function(a){l.$$v=a})),k=k.$$v);return k}:function(f,g){var k=g&&g.hasOwnProperty(b)?g:f;if(null==k)return k;k=k[b];if(!a)return k;if(null==k)return s;k=k[a];if(!c)return k;if(null==k)return s;k=k[c];if(!d)return k;if(null==k)return s;k=k[d];return e?null==k?s:k=k[e]:k}}function yd(b,a){da(b,a);return function(a,d){return null==a?s:(d&&d.hasOwnProperty(b)?d:a)[b]}}function zd(b,a,c){da(b,c);da(a,
c);return function(c,e){if(null==c)return s;c=(e&&e.hasOwnProperty(b)?e:c)[b];return null==c?s:c[a]}}function yc(b,a,c){if(Kb.hasOwnProperty(b))return Kb[b];var d=b.split("."),e=d.length,f;if(a.unwrapPromises||1!==e)if(a.unwrapPromises||2!==e)if(a.csp)f=6>e?xc(d[0],d[1],d[2],d[3],d[4],c,a):function(b,f){var h=0,g;do g=xc(d[h++],d[h++],d[h++],d[h++],d[h++],c,a)(b,f),f=s,b=g;while(h<e);return g};else{var g="var p;\n";r(d,function(b,d){da(b,c);g+="if(s == null) return undefined;\ns="+(d?"s":'((k&&k.hasOwnProperty("'+
b+'"))?k:s)')+'["'+b+'"];\n'+(a.unwrapPromises?'if (s && s.then) {\n pw("'+c.replace(/(["\r\n])/g,"\\$1")+'");\n if (!("$$v" in s)) {\n p=s;\n p.$$v = undefined;\n p.then(function(v) {p.$$v=v;});\n}\n s=s.$$v\n}\n':"")});var g=g+"return s;",h=new Function("s","k","pw",g);h.toString=$(g);f=a.unwrapPromises?function(a,b){return h(a,b,pa)}:h}else f=zd(d[0],d[1],c);else f=yd(d[0],c);"hasOwnProperty"!==b&&(Kb[b]=f);return f}function Ad(){var b={},a={csp:!1,unwrapPromises:!1,logPromiseWarnings:!0};this.unwrapPromises=
function(b){return v(b)?(a.unwrapPromises=!!b,this):a.unwrapPromises};this.logPromiseWarnings=function(b){return v(b)?(a.logPromiseWarnings=b,this):a.logPromiseWarnings};this.$get=["$filter","$sniffer","$log",function(c,d,e){a.csp=d.csp;pa=function(b){a.logPromiseWarnings&&!zc.hasOwnProperty(b)&&(zc[b]=!0,e.warn("[$parse] Promise found in the expression `"+b+"`. Automatic unwrapping of promises in Angular expressions is deprecated."))};return function(d){var e;switch(typeof d){case "string":if(b.hasOwnProperty(d))return b[d];
e=new Lb(a);e=(new Ya(e,c,a)).parse(d,!1);"hasOwnProperty"!==d&&(b[d]=e);return e;case "function":return d;default:return x}}}]}function Bd(){this.$get=["$rootScope","$exceptionHandler",function(b,a){return Cd(function(a){b.$evalAsync(a)},a)}]}function Cd(b,a){function c(a){return a}function d(a){return g(a)}var e=function(){var g=[],k,l;return l={resolve:function(a){if(g){var c=g;g=s;k=f(a);c.length&&b(function(){for(var a,b=0,d=c.length;b<d;b++)a=c[b],k.then(a[0],a[1],a[2])})}},reject:function(a){l.resolve(h(a))},
notify:function(a){if(g){var c=g;g.length&&b(function(){for(var b,d=0,e=c.length;d<e;d++)b=c[d],b[2](a)})}},promise:{then:function(b,f,h){var l=e(),C=function(d){try{l.resolve((N(b)?b:c)(d))}catch(e){l.reject(e),a(e)}},A=function(b){try{l.resolve((N(f)?f:d)(b))}catch(c){l.reject(c),a(c)}},u=function(b){try{l.notify((N(h)?h:c)(b))}catch(d){a(d)}};g?g.push([C,A,u]):k.then(C,A,u);return l.promise},"catch":function(a){return this.then(null,a)},"finally":function(a){function b(a,c){var d=e();c?d.resolve(a):
d.reject(a);return d.promise}function d(e,f){var h=null;try{h=(a||c)()}catch(g){return b(g,!1)}return h&&N(h.then)?h.then(function(){return b(e,f)},function(a){return b(a,!1)}):b(e,f)}return this.then(function(a){return d(a,!0)},function(a){return d(a,!1)})}}}},f=function(a){return a&&N(a.then)?a:{then:function(c){var d=e();b(function(){d.resolve(c(a))});return d.promise}}},g=function(a){var b=e();b.reject(a);return b.promise},h=function(c){return{then:function(f,h){var g=e();b(function(){try{g.resolve((N(h)?
h:d)(c))}catch(b){g.reject(b),a(b)}});return g.promise}}};return{defer:e,reject:g,when:function(h,k,l,n){var q=e(),p,y=function(b){try{return(N(k)?k:c)(b)}catch(d){return a(d),g(d)}},C=function(b){try{return(N(l)?l:d)(b)}catch(c){return a(c),g(c)}},A=function(b){try{return(N(n)?n:c)(b)}catch(d){a(d)}};b(function(){f(h).then(function(a){p||(p=!0,q.resolve(f(a).then(y,C,A)))},function(a){p||(p=!0,q.resolve(C(a)))},function(a){p||q.notify(A(a))})});return q.promise},all:function(a){var b=e(),c=0,d=I(a)?
[]:{};r(a,function(a,e){c++;f(a).then(function(a){d.hasOwnProperty(e)||(d[e]=a,--c||b.resolve(d))},function(a){d.hasOwnProperty(e)||b.reject(a)})});0===c&&b.resolve(d);return b.promise}}}function Dd(){this.$get=["$window",function(b){var a=b.requestAnimationFrame||b.webkitRequestAnimationFrame,c=b.cancelAnimationFrame||b.webkitCancelAnimationFrame;b=function(b){var e=a(b);return function(){c(e)}};b.supported=!!a;return b}]}function Ed(){var b=10,a=F("$rootScope"),c=null;this.digestTtl=function(a){arguments.length&&
(b=a);return b};this.$get=["$injector","$exceptionHandler","$parse","$browser",function(d,e,f,g){function h(){this.$id=Za();this.$$phase=this.$parent=this.$$watchers=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=null;this["this"]=this.$root=this;this.$$destroyed=!1;this.$$asyncQueue=[];this.$$postDigestQueue=[];this.$$listeners={};this.$$listenerCount={};this.$$isolateBindings={}}function m(b){if(q.$$phase)throw a("inprog",q.$$phase);q.$$phase=b}function k(a,b){var c=f(a);
Pa(c,b);return c}function l(a,b,c){do a.$$listenerCount[c]-=b,0===a.$$listenerCount[c]&&delete a.$$listenerCount[c];while(a=a.$parent)}function n(){}h.prototype={constructor:h,$new:function(a){a?(a=new h,a.$root=this.$root,a.$$asyncQueue=this.$$asyncQueue,a.$$postDigestQueue=this.$$postDigestQueue):(a=function(){},a.prototype=this,a=new a,a.$id=Za());a["this"]=a;a.$$listeners={};a.$$listenerCount={};a.$parent=this;a.$$watchers=a.$$nextSibling=a.$$childHead=a.$$childTail=null;a.$$prevSibling=this.$$childTail;
this.$$childHead?this.$$childTail=this.$$childTail.$$nextSibling=a:this.$$childHead=this.$$childTail=a;return a},$watch:function(a,b,d){var e=k(a,"watch"),f=this.$$watchers,h={fn:b,last:n,get:e,exp:a,eq:!!d};c=null;if(!N(b)){var g=k(b||x,"listener");h.fn=function(a,b,c){g(c)}}if("string"==typeof a&&e.constant){var l=h.fn;h.fn=function(a,b,c){l.call(this,a,b,c);Ma(f,h)}}f||(f=this.$$watchers=[]);f.unshift(h);return function(){Ma(f,h);c=null}},$watchCollection:function(a,b){var c=this,d,e,h=0,g=f(a),
k=[],l={},m=0;return this.$watch(function(){e=g(c);var a,b;if(X(e))if(ub(e))for(d!==k&&(d=k,m=d.length=0,h++),a=e.length,m!==a&&(h++,d.length=m=a),b=0;b<a;b++)d[b]!==e[b]&&(h++,d[b]=e[b]);else{d!==l&&(d=l={},m=0,h++);a=0;for(b in e)e.hasOwnProperty(b)&&(a++,d.hasOwnProperty(b)?d[b]!==e[b]&&(h++,d[b]=e[b]):(m++,d[b]=e[b],h++));if(m>a)for(b in h++,d)d.hasOwnProperty(b)&&!e.hasOwnProperty(b)&&(m--,delete d[b])}else d!==e&&(d=e,h++);return h},function(){b(e,d,c)})},$digest:function(){var d,f,h,g,k=this.$$asyncQueue,
l=this.$$postDigestQueue,r,w,s=b,S,M=[],v,t,J;m("$digest");c=null;do{w=!1;for(S=this;k.length;){try{J=k.shift(),J.scope.$eval(J.expression)}catch(z){q.$$phase=null,e(z)}c=null}a:do{if(g=S.$$watchers)for(r=g.length;r--;)try{if(d=g[r])if((f=d.get(S))!==(h=d.last)&&!(d.eq?sa(f,h):"number"==typeof f&&"number"==typeof h&&isNaN(f)&&isNaN(h)))w=!0,c=d,d.last=d.eq?ba(f):f,d.fn(f,h===n?f:h,S),5>s&&(v=4-s,M[v]||(M[v]=[]),t=N(d.exp)?"fn: "+(d.exp.name||d.exp.toString()):d.exp,t+="; newVal: "+na(f)+"; oldVal: "+
na(h),M[v].push(t));else if(d===c){w=!1;break a}}catch(E){q.$$phase=null,e(E)}if(!(g=S.$$childHead||S!==this&&S.$$nextSibling))for(;S!==this&&!(g=S.$$nextSibling);)S=S.$parent}while(S=g);if((w||k.length)&&!s--)throw q.$$phase=null,a("infdig",b,na(M));}while(w||k.length);for(q.$$phase=null;l.length;)try{l.shift()()}catch(x){e(x)}},$destroy:function(){if(!this.$$destroyed){var a=this.$parent;this.$broadcast("$destroy");this.$$destroyed=!0;this!==q&&(r(this.$$listenerCount,bb(null,l,this)),a.$$childHead==
this&&(a.$$childHead=this.$$nextSibling),a.$$childTail==this&&(a.$$childTail=this.$$prevSibling),this.$$prevSibling&&(this.$$prevSibling.$$nextSibling=this.$$nextSibling),this.$$nextSibling&&(this.$$nextSibling.$$prevSibling=this.$$prevSibling),this.$parent=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=null)}},$eval:function(a,b){return f(a)(this,b)},$evalAsync:function(a){q.$$phase||q.$$asyncQueue.length||g.defer(function(){q.$$asyncQueue.length&&q.$digest()});this.$$asyncQueue.push({scope:this,
expression:a})},$$postDigest:function(a){this.$$postDigestQueue.push(a)},$apply:function(a){try{return m("$apply"),this.$eval(a)}catch(b){e(b)}finally{q.$$phase=null;try{q.$digest()}catch(c){throw e(c),c;}}},$on:function(a,b){var c=this.$$listeners[a];c||(this.$$listeners[a]=c=[]);c.push(b);var d=this;do d.$$listenerCount[a]||(d.$$listenerCount[a]=0),d.$$listenerCount[a]++;while(d=d.$parent);var e=this;return function(){c[ab(c,b)]=null;l(e,1,a)}},$emit:function(a,b){var c=[],d,f=this,h=!1,g={name:a,
targetScope:f,stopPropagation:function(){h=!0},preventDefault:function(){g.defaultPrevented=!0},defaultPrevented:!1},k=[g].concat(ta.call(arguments,1)),l,m;do{d=f.$$listeners[a]||c;g.currentScope=f;l=0;for(m=d.length;l<m;l++)if(d[l])try{d[l].apply(null,k)}catch(q){e(q)}else d.splice(l,1),l--,m--;if(h)break;f=f.$parent}while(f);return g},$broadcast:function(a,b){for(var c=this,d=this,f={name:a,targetScope:this,preventDefault:function(){f.defaultPrevented=!0},defaultPrevented:!1},h=[f].concat(ta.call(arguments,
1)),g,k;c=d;){f.currentScope=c;d=c.$$listeners[a]||[];g=0;for(k=d.length;g<k;g++)if(d[g])try{d[g].apply(null,h)}catch(l){e(l)}else d.splice(g,1),g--,k--;if(!(d=c.$$listenerCount[a]&&c.$$childHead||c!==this&&c.$$nextSibling))for(;c!==this&&!(d=c.$$nextSibling);)c=c.$parent}return f}};var q=new h;return q}]}function Fd(){var b=/^\s*(https?|ftp|mailto|tel|file):/,a=/^\s*(https?|ftp|file):|data:image\//;this.aHrefSanitizationWhitelist=function(a){return v(a)?(b=a,this):b};this.imgSrcSanitizationWhitelist=
function(b){return v(b)?(a=b,this):a};this.$get=function(){return function(c,d){var e=d?a:b,f;if(!P||8<=P)if(f=wa(c).href,""!==f&&!f.match(e))return"unsafe:"+f;return c}}}function Gd(b){if("self"===b)return b;if(E(b)){if(-1<b.indexOf("***"))throw qa("iwcard",b);b=b.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08").replace("\\*\\*",".*").replace("\\*","[^:/.?&;]*");return RegExp("^"+b+"$")}if($a(b))return RegExp("^"+b.source+"$");throw qa("imatcher");}function Ac(b){var a=[];
v(b)&&r(b,function(b){a.push(Gd(b))});return a}function Hd(){this.SCE_CONTEXTS=ea;var b=["self"],a=[];this.resourceUrlWhitelist=function(a){arguments.length&&(b=Ac(a));return b};this.resourceUrlBlacklist=function(b){arguments.length&&(a=Ac(b));return a};this.$get=["$injector",function(c){function d(a){var b=function(a){this.$$unwrapTrustedValue=function(){return a}};a&&(b.prototype=new a);b.prototype.valueOf=function(){return this.$$unwrapTrustedValue()};b.prototype.toString=function(){return this.$$unwrapTrustedValue().toString()};
return b}var e=function(a){throw qa("unsafe");};c.has("$sanitize")&&(e=c.get("$sanitize"));var f=d(),g={};g[ea.HTML]=d(f);g[ea.CSS]=d(f);g[ea.URL]=d(f);g[ea.JS]=d(f);g[ea.RESOURCE_URL]=d(g[ea.URL]);return{trustAs:function(a,b){var c=g.hasOwnProperty(a)?g[a]:null;if(!c)throw qa("icontext",a,b);if(null===b||b===s||""===b)return b;if("string"!==typeof b)throw qa("itype",a);return new c(b)},getTrusted:function(c,d){if(null===d||d===s||""===d)return d;var f=g.hasOwnProperty(c)?g[c]:null;if(f&&d instanceof
f)return d.$$unwrapTrustedValue();if(c===ea.RESOURCE_URL){var f=wa(d.toString()),l,n,q=!1;l=0;for(n=b.length;l<n;l++)if("self"===b[l]?Gb(f):b[l].exec(f.href)){q=!0;break}if(q)for(l=0,n=a.length;l<n;l++)if("self"===a[l]?Gb(f):a[l].exec(f.href)){q=!1;break}if(q)return d;throw qa("insecurl",d.toString());}if(c===ea.HTML)return e(d);throw qa("unsafe");},valueOf:function(a){return a instanceof f?a.$$unwrapTrustedValue():a}}}]}function Id(){var b=!0;this.enabled=function(a){arguments.length&&(b=!!a);return b};
this.$get=["$parse","$sniffer","$sceDelegate",function(a,c,d){if(b&&c.msie&&8>c.msieDocumentMode)throw qa("iequirks");var e=ba(ea);e.isEnabled=function(){return b};e.trustAs=d.trustAs;e.getTrusted=d.getTrusted;e.valueOf=d.valueOf;b||(e.trustAs=e.getTrusted=function(a,b){return b},e.valueOf=za);e.parseAs=function(b,c){var d=a(c);return d.literal&&d.constant?d:function(a,c){return e.getTrusted(b,d(a,c))}};var f=e.parseAs,g=e.getTrusted,h=e.trustAs;r(ea,function(a,b){var c=O(b);e[Qa("parse_as_"+c)]=
function(b){return f(a,b)};e[Qa("get_trusted_"+c)]=function(b){return g(a,b)};e[Qa("trust_as_"+c)]=function(b){return h(a,b)}});return e}]}function Jd(){this.$get=["$window","$document",function(b,a){var c={},d=Q((/android (\d+)/.exec(O((b.navigator||{}).userAgent))||[])[1]),e=/Boxee/i.test((b.navigator||{}).userAgent),f=a[0]||{},g=f.documentMode,h,m=/^(Moz|webkit|O|ms)(?=[A-Z])/,k=f.body&&f.body.style,l=!1,n=!1;if(k){for(var q in k)if(l=m.exec(q)){h=l[0];h=h.substr(0,1).toUpperCase()+h.substr(1);
break}h||(h="WebkitOpacity"in k&&"webkit");l=!!("transition"in k||h+"Transition"in k);n=!!("animation"in k||h+"Animation"in k);!d||l&&n||(l=E(f.body.style.webkitTransition),n=E(f.body.style.webkitAnimation))}return{history:!(!b.history||!b.history.pushState||4>d||e),hashchange:"onhashchange"in b&&(!g||7<g),hasEvent:function(a){if("input"==a&&9==P)return!1;if(B(c[a])){var b=f.createElement("div");c[a]="on"+a in b}return c[a]},csp:Ub(),vendorPrefix:h,transitions:l,animations:n,android:d,msie:P,msieDocumentMode:g}}]}
function Kd(){this.$get=["$rootScope","$browser","$q","$exceptionHandler",function(b,a,c,d){function e(e,h,m){var k=c.defer(),l=k.promise,n=v(m)&&!m;h=a.defer(function(){try{k.resolve(e())}catch(a){k.reject(a),d(a)}finally{delete f[l.$$timeoutId]}n||b.$apply()},h);l.$$timeoutId=h;f[h]=k;return l}var f={};e.cancel=function(b){return b&&b.$$timeoutId in f?(f[b.$$timeoutId].reject("canceled"),delete f[b.$$timeoutId],a.defer.cancel(b.$$timeoutId)):!1};return e}]}function wa(b,a){var c=b;P&&(V.setAttribute("href",
c),c=V.href);V.setAttribute("href",c);return{href:V.href,protocol:V.protocol?V.protocol.replace(/:$/,""):"",host:V.host,search:V.search?V.search.replace(/^\?/,""):"",hash:V.hash?V.hash.replace(/^#/,""):"",hostname:V.hostname,port:V.port,pathname:"/"===V.pathname.charAt(0)?V.pathname:"/"+V.pathname}}function Gb(b){b=E(b)?wa(b):b;return b.protocol===Bc.protocol&&b.host===Bc.host}function Ld(){this.$get=$(D)}function Cc(b){function a(d,e){if(X(d)){var f={};r(d,function(b,c){f[c]=a(c,b)});return f}return b.factory(d+
c,e)}var c="Filter";this.register=a;this.$get=["$injector",function(a){return function(b){return a.get(b+c)}}];a("currency",Dc);a("date",Ec);a("filter",Md);a("json",Nd);a("limitTo",Od);a("lowercase",Pd);a("number",Fc);a("orderBy",Gc);a("uppercase",Qd)}function Md(){return function(b,a,c){if(!I(b))return b;var d=typeof c,e=[];e.check=function(a){for(var b=0;b<e.length;b++)if(!e[b](a))return!1;return!0};"function"!==d&&(c="boolean"===d&&c?function(a,b){return Ba.equals(a,b)}:function(a,b){if(a&&b&&
"object"===typeof a&&"object"===typeof b){for(var d in a)if("$"!==d.charAt(0)&&Rd.call(a,d)&&c(a[d],b[d]))return!0;return!1}b=(""+b).toLowerCase();return-1<(""+a).toLowerCase().indexOf(b)});var f=function(a,b){if("string"==typeof b&&"!"===b.charAt(0))return!f(a,b.substr(1));switch(typeof a){case "boolean":case "number":case "string":return c(a,b);case "object":switch(typeof b){case "object":return c(a,b);default:for(var d in a)if("$"!==d.charAt(0)&&f(a[d],b))return!0}return!1;case "array":for(d=0;d<
a.length;d++)if(f(a[d],b))return!0;return!1;default:return!1}};switch(typeof a){case "boolean":case "number":case "string":a={$:a};case "object":for(var g in a)(function(b){"undefined"!=typeof a[b]&&e.push(function(c){return f("$"==b?c:c&&c[b],a[b])})})(g);break;case "function":e.push(a);break;default:return b}d=[];for(g=0;g<b.length;g++){var h=b[g];e.check(h)&&d.push(h)}return d}}function Dc(b){var a=b.NUMBER_FORMATS;return function(b,d){B(d)&&(d=a.CURRENCY_SYM);return Hc(b,a.PATTERNS[1],a.GROUP_SEP,
a.DECIMAL_SEP,2).replace(/\u00A4/g,d)}}function Fc(b){var a=b.NUMBER_FORMATS;return function(b,d){return Hc(b,a.PATTERNS[0],a.GROUP_SEP,a.DECIMAL_SEP,d)}}function Hc(b,a,c,d,e){if(null==b||!isFinite(b)||X(b))return"";var f=0>b;b=Math.abs(b);var g=b+"",h="",m=[],k=!1;if(-1!==g.indexOf("e")){var l=g.match(/([\d\.]+)e(-?)(\d+)/);l&&"-"==l[2]&&l[3]>e+1?g="0":(h=g,k=!0)}if(k)0<e&&(-1<b&&1>b)&&(h=b.toFixed(e));else{g=(g.split(Ic)[1]||"").length;B(e)&&(e=Math.min(Math.max(a.minFrac,g),a.maxFrac));g=Math.pow(10,
e);b=Math.round(b*g)/g;b=(""+b).split(Ic);g=b[0];b=b[1]||"";var l=0,n=a.lgSize,q=a.gSize;if(g.length>=n+q)for(l=g.length-n,k=0;k<l;k++)0===(l-k)%q&&0!==k&&(h+=c),h+=g.charAt(k);for(k=l;k<g.length;k++)0===(g.length-k)%n&&0!==k&&(h+=c),h+=g.charAt(k);for(;b.length<e;)b+="0";e&&"0"!==e&&(h+=d+b.substr(0,e))}m.push(f?a.negPre:a.posPre);m.push(h);m.push(f?a.negSuf:a.posSuf);return m.join("")}function Mb(b,a,c){var d="";0>b&&(d="-",b=-b);for(b=""+b;b.length<a;)b="0"+b;c&&(b=b.substr(b.length-a));return d+
b}function Z(b,a,c,d){c=c||0;return function(e){e=e["get"+b]();if(0<c||e>-c)e+=c;0===e&&-12==c&&(e=12);return Mb(e,a,d)}}function ob(b,a){return function(c,d){var e=c["get"+b](),f=Ia(a?"SHORT"+b:b);return d[f][e]}}function Ec(b){function a(a){var b;if(b=a.match(c)){a=new Date(0);var f=0,g=0,h=b[8]?a.setUTCFullYear:a.setFullYear,m=b[8]?a.setUTCHours:a.setHours;b[9]&&(f=Q(b[9]+b[10]),g=Q(b[9]+b[11]));h.call(a,Q(b[1]),Q(b[2])-1,Q(b[3]));f=Q(b[4]||0)-f;g=Q(b[5]||0)-g;h=Q(b[6]||0);b=Math.round(1E3*parseFloat("0."+
(b[7]||0)));m.call(a,f,g,h,b)}return a}var c=/^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;return function(c,e){var f="",g=[],h,m;e=e||"mediumDate";e=b.DATETIME_FORMATS[e]||e;E(c)&&(c=Sd.test(c)?Q(c):a(c));vb(c)&&(c=new Date(c));if(!La(c))return c;for(;e;)(m=Td.exec(e))?(g=g.concat(ta.call(m,1)),e=g.pop()):(g.push(e),e=null);r(g,function(a){h=Ud[a];f+=h?h(c,b.DATETIME_FORMATS):a.replace(/(^'|'$)/g,"").replace(/''/g,"'")});return f}}function Nd(){return function(b){return na(b,
!0)}}function Od(){return function(b,a){if(!I(b)&&!E(b))return b;a=Q(a);if(E(b))return a?0<=a?b.slice(0,a):b.slice(a,b.length):"";var c=[],d,e;a>b.length?a=b.length:a<-b.length&&(a=-b.length);0<a?(d=0,e=a):(d=b.length+a,e=b.length);for(;d<e;d++)c.push(b[d]);return c}}function Gc(b){return function(a,c,d){function e(a,b){return Oa(b)?function(b,c){return a(c,b)}:a}if(!I(a)||!c)return a;c=I(c)?c:[c];c=Sc(c,function(a){var c=!1,d=a||za;if(E(a)){if("+"==a.charAt(0)||"-"==a.charAt(0))c="-"==a.charAt(0),
a=a.substring(1);d=b(a)}return e(function(a,b){var c;c=d(a);var e=d(b),f=typeof c,h=typeof e;f==h?("string"==f&&(c=c.toLowerCase(),e=e.toLowerCase()),c=c===e?0:c<e?-1:1):c=f<h?-1:1;return c},c)});for(var f=[],g=0;g<a.length;g++)f.push(a[g]);return f.sort(e(function(a,b){for(var d=0;d<c.length;d++){var e=c[d](a,b);if(0!==e)return e}return 0},d))}}function ra(b){N(b)&&(b={link:b});b.restrict=b.restrict||"AC";return $(b)}function Jc(b,a,c,d){function e(a,c){c=c?"-"+cb(c,"-"):"";d.removeClass(b,(a?pb:
qb)+c);d.addClass(b,(a?qb:pb)+c)}var f=this,g=b.parent().controller("form")||rb,h=0,m=f.$error={},k=[];f.$name=a.name||a.ngForm;f.$dirty=!1;f.$pristine=!0;f.$valid=!0;f.$invalid=!1;g.$addControl(f);b.addClass(Ja);e(!0);f.$addControl=function(a){va(a.$name,"input");k.push(a);a.$name&&(f[a.$name]=a)};f.$removeControl=function(a){a.$name&&f[a.$name]===a&&delete f[a.$name];r(m,function(b,c){f.$setValidity(c,!0,a)});Ma(k,a)};f.$setValidity=function(a,b,c){var d=m[a];if(b)d&&(Ma(d,c),d.length||(h--,h||
(e(b),f.$valid=!0,f.$invalid=!1),m[a]=!1,e(!0,a),g.$setValidity(a,!0,f)));else{h||e(b);if(d){if(-1!=ab(d,c))return}else m[a]=d=[],h++,e(!1,a),g.$setValidity(a,!1,f);d.push(c);f.$valid=!1;f.$invalid=!0}};f.$setDirty=function(){d.removeClass(b,Ja);d.addClass(b,sb);f.$dirty=!0;f.$pristine=!1;g.$setDirty()};f.$setPristine=function(){d.removeClass(b,sb);d.addClass(b,Ja);f.$dirty=!1;f.$pristine=!0;r(k,function(a){a.$setPristine()})}}function ma(b,a,c,d){b.$setValidity(a,c);return c?d:s}function Vd(b,a,
c){var d=c.prop("validity");X(d)&&(c=function(c){if(b.$error[a]||!(d.badInput||d.customError||d.typeMismatch)||d.valueMissing)return c;b.$setValidity(a,!1)},b.$parsers.push(c),b.$formatters.push(c))}function tb(b,a,c,d,e,f){var g=a.prop("validity");if(!e.android){var h=!1;a.on("compositionstart",function(a){h=!0});a.on("compositionend",function(){h=!1;m()})}var m=function(){if(!h){var e=a.val();Oa(c.ngTrim||"T")&&(e=ca(e));if(d.$viewValue!==e||g&&""===e&&!g.valueMissing)b.$$phase?d.$setViewValue(e):
b.$apply(function(){d.$setViewValue(e)})}};if(e.hasEvent("input"))a.on("input",m);else{var k,l=function(){k||(k=f.defer(function(){m();k=null}))};a.on("keydown",function(a){a=a.keyCode;91===a||(15<a&&19>a||37<=a&&40>=a)||l()});if(e.hasEvent("paste"))a.on("paste cut",l)}a.on("change",m);d.$render=function(){a.val(d.$isEmpty(d.$viewValue)?"":d.$viewValue)};var n=c.ngPattern;n&&((e=n.match(/^\/(.*)\/([gim]*)$/))?(n=RegExp(e[1],e[2]),e=function(a){return ma(d,"pattern",d.$isEmpty(a)||n.test(a),a)}):e=
function(c){var e=b.$eval(n);if(!e||!e.test)throw F("ngPattern")("noregexp",n,e,fa(a));return ma(d,"pattern",d.$isEmpty(c)||e.test(c),c)},d.$formatters.push(e),d.$parsers.push(e));if(c.ngMinlength){var q=Q(c.ngMinlength);e=function(a){return ma(d,"minlength",d.$isEmpty(a)||a.length>=q,a)};d.$parsers.push(e);d.$formatters.push(e)}if(c.ngMaxlength){var p=Q(c.ngMaxlength);e=function(a){return ma(d,"maxlength",d.$isEmpty(a)||a.length<=p,a)};d.$parsers.push(e);d.$formatters.push(e)}}function Nb(b,a){b=
"ngClass"+b;return function(){return{restrict:"AC",link:function(c,d,e){function f(b){if(!0===a||c.$index%2===a){var d=g(b||"");h?sa(b,h)||e.$updateClass(d,g(h)):e.$addClass(d)}h=ba(b)}function g(a){if(I(a))return a.join(" ");if(X(a)){var b=[];r(a,function(a,c){a&&b.push(c)});return b.join(" ")}return a}var h;c.$watch(e[b],f,!0);e.$observe("class",function(a){f(c.$eval(e[b]))});"ngClass"!==b&&c.$watch("$index",function(d,f){var h=d&1;if(h!==f&1){var n=g(c.$eval(e[b]));h===a?e.$addClass(n):e.$removeClass(n)}})}}}}
var O=function(b){return E(b)?b.toLowerCase():b},Rd=Object.prototype.hasOwnProperty,Ia=function(b){return E(b)?b.toUpperCase():b},P,z,Ca,ta=[].slice,Wd=[].push,Aa=Object.prototype.toString,Na=F("ng"),Ba=D.angular||(D.angular={}),Ua,Ga,ia=["0","0","0"];P=Q((/msie (\d+)/.exec(O(navigator.userAgent))||[])[1]);isNaN(P)&&(P=Q((/trident\/.*; rv:(\d+)/.exec(O(navigator.userAgent))||[])[1]));x.$inject=[];za.$inject=[];var ca=function(){return String.prototype.trim?function(b){return E(b)?b.trim():b}:function(b){return E(b)?
b.replace(/^\s\s*/,"").replace(/\s\s*$/,""):b}}();Ga=9>P?function(b){b=b.nodeName?b:b[0];return b.scopeName&&"HTML"!=b.scopeName?Ia(b.scopeName+":"+b.nodeName):b.nodeName}:function(b){return b.nodeName?b.nodeName:b[0].nodeName};var Vc=/[A-Z]/g,Xd={full:"1.2.14",major:1,minor:2,dot:14,codeName:"feisty-cryokinesis"},Ra=R.cache={},db=R.expando="ng-"+(new Date).getTime(),Zc=1,Kc=D.document.addEventListener?function(b,a,c){b.addEventListener(a,c,!1)}:function(b,a,c){b.attachEvent("on"+a,c)},Db=D.document.removeEventListener?
function(b,a,c){b.removeEventListener(a,c,!1)}:function(b,a,c){b.detachEvent("on"+a,c)};R._data=function(b){return this.cache[b[this.expando]]||{}};var Xc=/([\:\-\_]+(.))/g,Yc=/^moz([A-Z])/,Ab=F("jqLite"),Fa=R.prototype={ready:function(b){function a(){c||(c=!0,b())}var c=!1;"complete"===T.readyState?setTimeout(a):(this.on("DOMContentLoaded",a),R(D).on("load",a))},toString:function(){var b=[];r(this,function(a){b.push(""+a)});return"["+b.join(", ")+"]"},eq:function(b){return 0<=b?z(this[b]):z(this[this.length+
b])},length:0,push:Wd,sort:[].sort,splice:[].splice},hb={};r("multiple selected checked disabled readOnly required open".split(" "),function(b){hb[O(b)]=b});var hc={};r("input select option textarea button form details".split(" "),function(b){hc[Ia(b)]=!0});r({data:dc,inheritedData:gb,scope:function(b){return z(b).data("$scope")||gb(b.parentNode||b,["$isolateScope","$scope"])},isolateScope:function(b){return z(b).data("$isolateScope")||z(b).data("$isolateScopeNoTemplate")},controller:ec,injector:function(b){return gb(b,
"$injector")},removeAttr:function(b,a){b.removeAttribute(a)},hasClass:Eb,css:function(b,a,c){a=Qa(a);if(v(c))b.style[a]=c;else{var d;8>=P&&(d=b.currentStyle&&b.currentStyle[a],""===d&&(d="auto"));d=d||b.style[a];8>=P&&(d=""===d?s:d);return d}},attr:function(b,a,c){var d=O(a);if(hb[d])if(v(c))c?(b[a]=!0,b.setAttribute(a,d)):(b[a]=!1,b.removeAttribute(d));else return b[a]||(b.attributes.getNamedItem(a)||x).specified?d:s;else if(v(c))b.setAttribute(a,c);else if(b.getAttribute)return b=b.getAttribute(a,
2),null===b?s:b},prop:function(b,a,c){if(v(c))b[a]=c;else return b[a]},text:function(){function b(b,d){var e=a[b.nodeType];if(B(d))return e?b[e]:"";b[e]=d}var a=[];9>P?(a[1]="innerText",a[3]="nodeValue"):a[1]=a[3]="textContent";b.$dv="";return b}(),val:function(b,a){if(B(a)){if("SELECT"===Ga(b)&&b.multiple){var c=[];r(b.options,function(a){a.selected&&c.push(a.value||a.text)});return 0===c.length?null:c}return b.value}b.value=a},html:function(b,a){if(B(a))return b.innerHTML;for(var c=0,d=b.childNodes;c<
d.length;c++)Da(d[c]);b.innerHTML=a},empty:fc},function(b,a){R.prototype[a]=function(a,d){var e,f;if(b!==fc&&(2==b.length&&b!==Eb&&b!==ec?a:d)===s){if(X(a)){for(e=0;e<this.length;e++)if(b===dc)b(this[e],a);else for(f in a)b(this[e],f,a[f]);return this}e=b.$dv;f=e===s?Math.min(this.length,1):this.length;for(var g=0;g<f;g++){var h=b(this[g],a,d);e=e?e+h:h}return e}for(e=0;e<this.length;e++)b(this[e],a,d);return this}});r({removeData:bc,dealoc:Da,on:function a(c,d,e,f){if(v(f))throw Ab("onargs");var g=
ja(c,"events"),h=ja(c,"handle");g||ja(c,"events",g={});h||ja(c,"handle",h=$c(c,g));r(d.split(" "),function(d){var f=g[d];if(!f){if("mouseenter"==d||"mouseleave"==d){var l=T.body.contains||T.body.compareDocumentPosition?function(a,c){var d=9===a.nodeType?a.documentElement:a,e=c&&c.parentNode;return a===e||!!(e&&1===e.nodeType&&(d.contains?d.contains(e):a.compareDocumentPosition&&a.compareDocumentPosition(e)&16))}:function(a,c){if(c)for(;c=c.parentNode;)if(c===a)return!0;return!1};g[d]=[];a(c,{mouseleave:"mouseout",
mouseenter:"mouseover"}[d],function(a){var c=a.relatedTarget;c&&(c===this||l(this,c))||h(a,d)})}else Kc(c,d,h),g[d]=[];f=g[d]}f.push(e)})},off:cc,one:function(a,c,d){a=z(a);a.on(c,function f(){a.off(c,d);a.off(c,f)});a.on(c,d)},replaceWith:function(a,c){var d,e=a.parentNode;Da(a);r(new R(c),function(c){d?e.insertBefore(c,d.nextSibling):e.replaceChild(c,a);d=c})},children:function(a){var c=[];r(a.childNodes,function(a){1===a.nodeType&&c.push(a)});return c},contents:function(a){return a.contentDocument||
a.childNodes||[]},append:function(a,c){r(new R(c),function(c){1!==a.nodeType&&11!==a.nodeType||a.appendChild(c)})},prepend:function(a,c){if(1===a.nodeType){var d=a.firstChild;r(new R(c),function(c){a.insertBefore(c,d)})}},wrap:function(a,c){c=z(c)[0];var d=a.parentNode;d&&d.replaceChild(c,a);c.appendChild(a)},remove:function(a){Da(a);var c=a.parentNode;c&&c.removeChild(a)},after:function(a,c){var d=a,e=a.parentNode;r(new R(c),function(a){e.insertBefore(a,d.nextSibling);d=a})},addClass:fb,removeClass:eb,
toggleClass:function(a,c,d){c&&r(c.split(" "),function(c){var f=d;B(f)&&(f=!Eb(a,c));(f?fb:eb)(a,c)})},parent:function(a){return(a=a.parentNode)&&11!==a.nodeType?a:null},next:function(a){if(a.nextElementSibling)return a.nextElementSibling;for(a=a.nextSibling;null!=a&&1!==a.nodeType;)a=a.nextSibling;return a},find:function(a,c){return a.getElementsByTagName?a.getElementsByTagName(c):[]},clone:Cb,triggerHandler:function(a,c,d){c=(ja(a,"events")||{})[c];d=d||[];var e=[{preventDefault:x,stopPropagation:x}];
r(c,function(c){c.apply(a,e.concat(d))})}},function(a,c){R.prototype[c]=function(c,e,f){for(var g,h=0;h<this.length;h++)B(g)?(g=a(this[h],c,e,f),v(g)&&(g=z(g))):Bb(g,a(this[h],c,e,f));return v(g)?g:this};R.prototype.bind=R.prototype.on;R.prototype.unbind=R.prototype.off});Sa.prototype={put:function(a,c){this[Ea(a)]=c},get:function(a){return this[Ea(a)]},remove:function(a){var c=this[a=Ea(a)];delete this[a];return c}};var bd=/^function\s*[^\(]*\(\s*([^\)]*)\)/m,cd=/,/,dd=/^\s*(_?)(\S+?)\1\s*$/,ad=
/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,Ta=F("$injector"),Yd=F("$animate"),Zd=["$provide",function(a){this.$$selectors={};this.register=function(c,d){var e=c+"-animation";if(c&&"."!=c.charAt(0))throw Yd("notcsel",c);this.$$selectors[c.substr(1)]=e;a.factory(e,d)};this.classNameFilter=function(a){1===arguments.length&&(this.$$classNameFilter=a instanceof RegExp?a:null);return this.$$classNameFilter};this.$get=["$timeout","$$asyncCallback",function(a,d){return{enter:function(a,c,g,h){g?g.after(a):(c&&c[0]||
(c=g.parent()),c.append(a));h&&d(h)},leave:function(a,c){a.remove();c&&d(c)},move:function(a,c,d,h){this.enter(a,c,d,h)},addClass:function(a,c,g){c=E(c)?c:I(c)?c.join(" "):"";r(a,function(a){fb(a,c)});g&&d(g)},removeClass:function(a,c,g){c=E(c)?c:I(c)?c.join(" "):"";r(a,function(a){eb(a,c)});g&&d(g)},setClass:function(a,c,g,h){r(a,function(a){fb(a,c);eb(a,g)});h&&d(h)},enabled:x}}]}],ha=F("$compile");jc.$inject=["$provide","$$sanitizeUriProvider"];var kd=/^(x[\:\-_]|data[\:\-_])/i,qc=F("$interpolate"),
$d=/^([^\?#]*)(\?([^#]*))?(#(.*))?$/,vd={http:80,https:443,ftp:21},Ib=F("$location");vc.prototype=Jb.prototype=uc.prototype={$$html5:!1,$$replace:!1,absUrl:mb("$$absUrl"),url:function(a,c){if(B(a))return this.$$url;var d=$d.exec(a);d[1]&&this.path(decodeURIComponent(d[1]));(d[2]||d[1])&&this.search(d[3]||"");this.hash(d[5]||"",c);return this},protocol:mb("$$protocol"),host:mb("$$host"),port:mb("$$port"),path:wc("$$path",function(a){return"/"==a.charAt(0)?a:"/"+a}),search:function(a,c){switch(arguments.length){case 0:return this.$$search;
case 1:if(E(a))this.$$search=Xb(a);else if(X(a))this.$$search=a;else throw Ib("isrcharg");break;default:B(c)||null===c?delete this.$$search[a]:this.$$search[a]=c}this.$$compose();return this},hash:wc("$$hash",za),replace:function(){this.$$replace=!0;return this}};var xa=F("$parse"),zc={},pa,Ka={"null":function(){return null},"true":function(){return!0},"false":function(){return!1},undefined:x,"+":function(a,c,d,e){d=d(a,c);e=e(a,c);return v(d)?v(e)?d+e:d:v(e)?e:s},"-":function(a,c,d,e){d=d(a,c);e=
e(a,c);return(v(d)?d:0)-(v(e)?e:0)},"*":function(a,c,d,e){return d(a,c)*e(a,c)},"/":function(a,c,d,e){return d(a,c)/e(a,c)},"%":function(a,c,d,e){return d(a,c)%e(a,c)},"^":function(a,c,d,e){return d(a,c)^e(a,c)},"=":x,"===":function(a,c,d,e){return d(a,c)===e(a,c)},"!==":function(a,c,d,e){return d(a,c)!==e(a,c)},"==":function(a,c,d,e){return d(a,c)==e(a,c)},"!=":function(a,c,d,e){return d(a,c)!=e(a,c)},"<":function(a,c,d,e){return d(a,c)<e(a,c)},">":function(a,c,d,e){return d(a,c)>e(a,c)},"<=":function(a,
c,d,e){return d(a,c)<=e(a,c)},">=":function(a,c,d,e){return d(a,c)>=e(a,c)},"&&":function(a,c,d,e){return d(a,c)&&e(a,c)},"||":function(a,c,d,e){return d(a,c)||e(a,c)},"&":function(a,c,d,e){return d(a,c)&e(a,c)},"|":function(a,c,d,e){return e(a,c)(a,c,d(a,c))},"!":function(a,c,d){return!d(a,c)}},ae={n:"\n",f:"\f",r:"\r",t:"\t",v:"\v","'":"'",'"':'"'},Lb=function(a){this.options=a};Lb.prototype={constructor:Lb,lex:function(a){this.text=a;this.index=0;this.ch=s;this.lastCh=":";this.tokens=[];var c;
for(a=[];this.index<this.text.length;){this.ch=this.text.charAt(this.index);if(this.is("\"'"))this.readString(this.ch);else if(this.isNumber(this.ch)||this.is(".")&&this.isNumber(this.peek()))this.readNumber();else if(this.isIdent(this.ch))this.readIdent(),this.was("{,")&&("{"===a[0]&&(c=this.tokens[this.tokens.length-1]))&&(c.json=-1===c.text.indexOf("."));else if(this.is("(){}[].,;:?"))this.tokens.push({index:this.index,text:this.ch,json:this.was(":[,")&&this.is("{[")||this.is("}]:,")}),this.is("{[")&&
a.unshift(this.ch),this.is("}]")&&a.shift(),this.index++;else if(this.isWhitespace(this.ch)){this.index++;continue}else{var d=this.ch+this.peek(),e=d+this.peek(2),f=Ka[this.ch],g=Ka[d],h=Ka[e];h?(this.tokens.push({index:this.index,text:e,fn:h}),this.index+=3):g?(this.tokens.push({index:this.index,text:d,fn:g}),this.index+=2):f?(this.tokens.push({index:this.index,text:this.ch,fn:f,json:this.was("[,:")&&this.is("+-")}),this.index+=1):this.throwError("Unexpected next character ",this.index,this.index+
1)}this.lastCh=this.ch}return this.tokens},is:function(a){return-1!==a.indexOf(this.ch)},was:function(a){return-1!==a.indexOf(this.lastCh)},peek:function(a){a=a||1;return this.index+a<this.text.length?this.text.charAt(this.index+a):!1},isNumber:function(a){return"0"<=a&&"9">=a},isWhitespace:function(a){return" "===a||"\r"===a||"\t"===a||"\n"===a||"\v"===a||"\u00a0"===a},isIdent:function(a){return"a"<=a&&"z">=a||"A"<=a&&"Z">=a||"_"===a||"$"===a},isExpOperator:function(a){return"-"===a||"+"===a||this.isNumber(a)},
throwError:function(a,c,d){d=d||this.index;c=v(c)?"s "+c+"-"+this.index+" ["+this.text.substring(c,d)+"]":" "+d;throw xa("lexerr",a,c,this.text);},readNumber:function(){for(var a="",c=this.index;this.index<this.text.length;){var d=O(this.text.charAt(this.index));if("."==d||this.isNumber(d))a+=d;else{var e=this.peek();if("e"==d&&this.isExpOperator(e))a+=d;else if(this.isExpOperator(d)&&e&&this.isNumber(e)&&"e"==a.charAt(a.length-1))a+=d;else if(!this.isExpOperator(d)||e&&this.isNumber(e)||"e"!=a.charAt(a.length-
1))break;else this.throwError("Invalid exponent")}this.index++}a*=1;this.tokens.push({index:c,text:a,json:!0,fn:function(){return a}})},readIdent:function(){for(var a=this,c="",d=this.index,e,f,g,h;this.index<this.text.length;){h=this.text.charAt(this.index);if("."===h||this.isIdent(h)||this.isNumber(h))"."===h&&(e=this.index),c+=h;else break;this.index++}if(e)for(f=this.index;f<this.text.length;){h=this.text.charAt(f);if("("===h){g=c.substr(e-d+1);c=c.substr(0,e-d);this.index=f;break}if(this.isWhitespace(h))f++;
else break}d={index:d,text:c};if(Ka.hasOwnProperty(c))d.fn=Ka[c],d.json=Ka[c];else{var m=yc(c,this.options,this.text);d.fn=t(function(a,c){return m(a,c)},{assign:function(d,e){return nb(d,c,e,a.text,a.options)}})}this.tokens.push(d);g&&(this.tokens.push({index:e,text:".",json:!1}),this.tokens.push({index:e+1,text:g,json:!1}))},readString:function(a){var c=this.index;this.index++;for(var d="",e=a,f=!1;this.index<this.text.length;){var g=this.text.charAt(this.index),e=e+g;if(f)"u"===g?(g=this.text.substring(this.index+
1,this.index+5),g.match(/[\da-f]{4}/i)||this.throwError("Invalid unicode escape [\\u"+g+"]"),this.index+=4,d+=String.fromCharCode(parseInt(g,16))):d=(f=ae[g])?d+f:d+g,f=!1;else if("\\"===g)f=!0;else{if(g===a){this.index++;this.tokens.push({index:c,text:e,string:d,json:!0,fn:function(){return d}});return}d+=g}this.index++}this.throwError("Unterminated quote",c)}};var Ya=function(a,c,d){this.lexer=a;this.$filter=c;this.options=d};Ya.ZERO=function(){return 0};Ya.prototype={constructor:Ya,parse:function(a,
c){this.text=a;this.json=c;this.tokens=this.lexer.lex(a);c&&(this.assignment=this.logicalOR,this.functionCall=this.fieldAccess=this.objectIndex=this.filterChain=function(){this.throwError("is not valid json",{text:a,index:0})});var d=c?this.primary():this.statements();0!==this.tokens.length&&this.throwError("is an unexpected token",this.tokens[0]);d.literal=!!d.literal;d.constant=!!d.constant;return d},primary:function(){var a;if(this.expect("("))a=this.filterChain(),this.consume(")");else if(this.expect("["))a=
this.arrayDeclaration();else if(this.expect("{"))a=this.object();else{var c=this.expect();(a=c.fn)||this.throwError("not a primary expression",c);c.json&&(a.constant=!0,a.literal=!0)}for(var d;c=this.expect("(","[",".");)"("===c.text?(a=this.functionCall(a,d),d=null):"["===c.text?(d=a,a=this.objectIndex(a)):"."===c.text?(d=a,a=this.fieldAccess(a)):this.throwError("IMPOSSIBLE");return a},throwError:function(a,c){throw xa("syntax",c.text,a,c.index+1,this.text,this.text.substring(c.index));},peekToken:function(){if(0===
this.tokens.length)throw xa("ueoe",this.text);return this.tokens[0]},peek:function(a,c,d,e){if(0<this.tokens.length){var f=this.tokens[0],g=f.text;if(g===a||g===c||g===d||g===e||!(a||c||d||e))return f}return!1},expect:function(a,c,d,e){return(a=this.peek(a,c,d,e))?(this.json&&!a.json&&this.throwError("is not valid json",a),this.tokens.shift(),a):!1},consume:function(a){this.expect(a)||this.throwError("is unexpected, expecting ["+a+"]",this.peek())},unaryFn:function(a,c){return t(function(d,e){return a(d,
e,c)},{constant:c.constant})},ternaryFn:function(a,c,d){return t(function(e,f){return a(e,f)?c(e,f):d(e,f)},{constant:a.constant&&c.constant&&d.constant})},binaryFn:function(a,c,d){return t(function(e,f){return c(e,f,a,d)},{constant:a.constant&&d.constant})},statements:function(){for(var a=[];;)if(0<this.tokens.length&&!this.peek("}",")",";","]")&&a.push(this.filterChain()),!this.expect(";"))return 1===a.length?a[0]:function(c,d){for(var e,f=0;f<a.length;f++){var g=a[f];g&&(e=g(c,d))}return e}},filterChain:function(){for(var a=
this.expression(),c;;)if(c=this.expect("|"))a=this.binaryFn(a,c.fn,this.filter());else return a},filter:function(){for(var a=this.expect(),c=this.$filter(a.text),d=[];;)if(a=this.expect(":"))d.push(this.expression());else{var e=function(a,e,h){h=[h];for(var m=0;m<d.length;m++)h.push(d[m](a,e));return c.apply(a,h)};return function(){return e}}},expression:function(){return this.assignment()},assignment:function(){var a=this.ternary(),c,d;return(d=this.expect("="))?(a.assign||this.throwError("implies assignment but ["+
this.text.substring(0,d.index)+"] can not be assigned to",d),c=this.ternary(),function(d,f){return a.assign(d,c(d,f),f)}):a},ternary:function(){var a=this.logicalOR(),c,d;if(this.expect("?")){c=this.ternary();if(d=this.expect(":"))return this.ternaryFn(a,c,this.ternary());this.throwError("expected :",d)}else return a},logicalOR:function(){for(var a=this.logicalAND(),c;;)if(c=this.expect("||"))a=this.binaryFn(a,c.fn,this.logicalAND());else return a},logicalAND:function(){var a=this.equality(),c;if(c=
this.expect("&&"))a=this.binaryFn(a,c.fn,this.logicalAND());return a},equality:function(){var a=this.relational(),c;if(c=this.expect("==","!=","===","!=="))a=this.binaryFn(a,c.fn,this.equality());return a},relational:function(){var a=this.additive(),c;if(c=this.expect("<",">","<=",">="))a=this.binaryFn(a,c.fn,this.relational());return a},additive:function(){for(var a=this.multiplicative(),c;c=this.expect("+","-");)a=this.binaryFn(a,c.fn,this.multiplicative());return a},multiplicative:function(){for(var a=
this.unary(),c;c=this.expect("*","/","%");)a=this.binaryFn(a,c.fn,this.unary());return a},unary:function(){var a;return this.expect("+")?this.primary():(a=this.expect("-"))?this.binaryFn(Ya.ZERO,a.fn,this.unary()):(a=this.expect("!"))?this.unaryFn(a.fn,this.unary()):this.primary()},fieldAccess:function(a){var c=this,d=this.expect().text,e=yc(d,this.options,this.text);return t(function(c,d,h){return e(h||a(c,d))},{assign:function(e,g,h){return nb(a(e,h),d,g,c.text,c.options)}})},objectIndex:function(a){var c=
this,d=this.expression();this.consume("]");return t(function(e,f){var g=a(e,f),h=d(e,f),m;if(!g)return s;(g=Xa(g[h],c.text))&&(g.then&&c.options.unwrapPromises)&&(m=g,"$$v"in g||(m.$$v=s,m.then(function(a){m.$$v=a})),g=g.$$v);return g},{assign:function(e,f,g){var h=d(e,g);return Xa(a(e,g),c.text)[h]=f}})},functionCall:function(a,c){var d=[];if(")"!==this.peekToken().text){do d.push(this.expression());while(this.expect(","))}this.consume(")");var e=this;return function(f,g){for(var h=[],m=c?c(f,g):
f,k=0;k<d.length;k++)h.push(d[k](f,g));k=a(f,g,m)||x;Xa(m,e.text);Xa(k,e.text);h=k.apply?k.apply(m,h):k(h[0],h[1],h[2],h[3],h[4]);return Xa(h,e.text)}},arrayDeclaration:function(){var a=[],c=!0;if("]"!==this.peekToken().text){do{if(this.peek("]"))break;var d=this.expression();a.push(d);d.constant||(c=!1)}while(this.expect(","))}this.consume("]");return t(function(c,d){for(var g=[],h=0;h<a.length;h++)g.push(a[h](c,d));return g},{literal:!0,constant:c})},object:function(){var a=[],c=!0;if("}"!==this.peekToken().text){do{if(this.peek("}"))break;
var d=this.expect(),d=d.string||d.text;this.consume(":");var e=this.expression();a.push({key:d,value:e});e.constant||(c=!1)}while(this.expect(","))}this.consume("}");return t(function(c,d){for(var e={},m=0;m<a.length;m++){var k=a[m];e[k.key]=k.value(c,d)}return e},{literal:!0,constant:c})}};var Kb={},qa=F("$sce"),ea={HTML:"html",CSS:"css",URL:"url",RESOURCE_URL:"resourceUrl",JS:"js"},V=T.createElement("a"),Bc=wa(D.location.href,!0);Cc.$inject=["$provide"];Dc.$inject=["$locale"];Fc.$inject=["$locale"];
var Ic=".",Ud={yyyy:Z("FullYear",4),yy:Z("FullYear",2,0,!0),y:Z("FullYear",1),MMMM:ob("Month"),MMM:ob("Month",!0),MM:Z("Month",2,1),M:Z("Month",1,1),dd:Z("Date",2),d:Z("Date",1),HH:Z("Hours",2),H:Z("Hours",1),hh:Z("Hours",2,-12),h:Z("Hours",1,-12),mm:Z("Minutes",2),m:Z("Minutes",1),ss:Z("Seconds",2),s:Z("Seconds",1),sss:Z("Milliseconds",3),EEEE:ob("Day"),EEE:ob("Day",!0),a:function(a,c){return 12>a.getHours()?c.AMPMS[0]:c.AMPMS[1]},Z:function(a){a=-1*a.getTimezoneOffset();return a=(0<=a?"+":"")+(Mb(Math[0<
a?"floor":"ceil"](a/60),2)+Mb(Math.abs(a%60),2))}},Td=/((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/,Sd=/^\-?\d+$/;Ec.$inject=["$locale"];var Pd=$(O),Qd=$(Ia);Gc.$inject=["$parse"];var be=$({restrict:"E",compile:function(a,c){8>=P&&(c.href||c.name||c.$set("href",""),a.append(T.createComment("IE fix")));if(!c.href&&!c.xlinkHref&&!c.name)return function(a,c){var f="[object SVGAnimatedString]"===Aa.call(c.prop("href"))?"xlink:href":"href";c.on("click",function(a){c.attr(f)||
a.preventDefault()})}}}),Ob={};r(hb,function(a,c){if("multiple"!=a){var d=ka("ng-"+c);Ob[d]=function(){return{priority:100,link:function(a,f,g){a.$watch(g[d],function(a){g.$set(c,!!a)})}}}}});r(["src","srcset","href"],function(a){var c=ka("ng-"+a);Ob[c]=function(){return{priority:99,link:function(d,e,f){var g=a,h=a;"href"===a&&"[object SVGAnimatedString]"===Aa.call(e.prop("href"))&&(h="xlinkHref",f.$attr[h]="xlink:href",g=null);f.$observe(c,function(a){a&&(f.$set(h,a),P&&g&&e.prop(g,f[h]))})}}}});
var rb={$addControl:x,$removeControl:x,$setValidity:x,$setDirty:x,$setPristine:x};Jc.$inject=["$element","$attrs","$scope","$animate"];var Lc=function(a){return["$timeout",function(c){return{name:"form",restrict:a?"EAC":"E",controller:Jc,compile:function(){return{pre:function(a,e,f,g){if(!f.action){var h=function(a){a.preventDefault?a.preventDefault():a.returnValue=!1};Kc(e[0],"submit",h);e.on("$destroy",function(){c(function(){Db(e[0],"submit",h)},0,!1)})}var m=e.parent().controller("form"),k=f.name||
f.ngForm;k&&nb(a,k,g,k);if(m)e.on("$destroy",function(){m.$removeControl(g);k&&nb(a,k,s,k);t(g,rb)})}}}}}]},ce=Lc(),de=Lc(!0),ee=/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,fe=/^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i,ge=/^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,Mc={text:tb,number:function(a,c,d,e,f,g){tb(a,c,d,e,f,g);e.$parsers.push(function(a){var c=e.$isEmpty(a);if(c||ge.test(a))return e.$setValidity("number",!0),""===a?null:c?a:parseFloat(a);
e.$setValidity("number",!1);return s});Vd(e,"number",c);e.$formatters.push(function(a){return e.$isEmpty(a)?"":""+a});d.min&&(a=function(a){var c=parseFloat(d.min);return ma(e,"min",e.$isEmpty(a)||a>=c,a)},e.$parsers.push(a),e.$formatters.push(a));d.max&&(a=function(a){var c=parseFloat(d.max);return ma(e,"max",e.$isEmpty(a)||a<=c,a)},e.$parsers.push(a),e.$formatters.push(a));e.$formatters.push(function(a){return ma(e,"number",e.$isEmpty(a)||vb(a),a)})},url:function(a,c,d,e,f,g){tb(a,c,d,e,f,g);a=
function(a){return ma(e,"url",e.$isEmpty(a)||ee.test(a),a)};e.$formatters.push(a);e.$parsers.push(a)},email:function(a,c,d,e,f,g){tb(a,c,d,e,f,g);a=function(a){return ma(e,"email",e.$isEmpty(a)||fe.test(a),a)};e.$formatters.push(a);e.$parsers.push(a)},radio:function(a,c,d,e){B(d.name)&&c.attr("name",Za());c.on("click",function(){c[0].checked&&a.$apply(function(){e.$setViewValue(d.value)})});e.$render=function(){c[0].checked=d.value==e.$viewValue};d.$observe("value",e.$render)},checkbox:function(a,
c,d,e){var f=d.ngTrueValue,g=d.ngFalseValue;E(f)||(f=!0);E(g)||(g=!1);c.on("click",function(){a.$apply(function(){e.$setViewValue(c[0].checked)})});e.$render=function(){c[0].checked=e.$viewValue};e.$isEmpty=function(a){return a!==f};e.$formatters.push(function(a){return a===f});e.$parsers.push(function(a){return a?f:g})},hidden:x,button:x,submit:x,reset:x,file:x},Nc=["$browser","$sniffer",function(a,c){return{restrict:"E",require:"?ngModel",link:function(d,e,f,g){g&&(Mc[O(f.type)]||Mc.text)(d,e,f,
g,c,a)}}}],qb="ng-valid",pb="ng-invalid",Ja="ng-pristine",sb="ng-dirty",he=["$scope","$exceptionHandler","$attrs","$element","$parse","$animate",function(a,c,d,e,f,g){function h(a,c){c=c?"-"+cb(c,"-"):"";g.removeClass(e,(a?pb:qb)+c);g.addClass(e,(a?qb:pb)+c)}this.$modelValue=this.$viewValue=Number.NaN;this.$parsers=[];this.$formatters=[];this.$viewChangeListeners=[];this.$pristine=!0;this.$dirty=!1;this.$valid=!0;this.$invalid=!1;this.$name=d.name;var m=f(d.ngModel),k=m.assign;if(!k)throw F("ngModel")("nonassign",
d.ngModel,fa(e));this.$render=x;this.$isEmpty=function(a){return B(a)||""===a||null===a||a!==a};var l=e.inheritedData("$formController")||rb,n=0,q=this.$error={};e.addClass(Ja);h(!0);this.$setValidity=function(a,c){q[a]!==!c&&(c?(q[a]&&n--,n||(h(!0),this.$valid=!0,this.$invalid=!1)):(h(!1),this.$invalid=!0,this.$valid=!1,n++),q[a]=!c,h(c,a),l.$setValidity(a,c,this))};this.$setPristine=function(){this.$dirty=!1;this.$pristine=!0;g.removeClass(e,sb);g.addClass(e,Ja)};this.$setViewValue=function(d){this.$viewValue=
d;this.$pristine&&(this.$dirty=!0,this.$pristine=!1,g.removeClass(e,Ja),g.addClass(e,sb),l.$setDirty());r(this.$parsers,function(a){d=a(d)});this.$modelValue!==d&&(this.$modelValue=d,k(a,d),r(this.$viewChangeListeners,function(a){try{a()}catch(d){c(d)}}))};var p=this;a.$watch(function(){var c=m(a);if(p.$modelValue!==c){var d=p.$formatters,e=d.length;for(p.$modelValue=c;e--;)c=d[e](c);p.$viewValue!==c&&(p.$viewValue=c,p.$render())}return c})}],ie=function(){return{require:["ngModel","^?form"],controller:he,
link:function(a,c,d,e){var f=e[0],g=e[1]||rb;g.$addControl(f);a.$on("$destroy",function(){g.$removeControl(f)})}}},je=$({require:"ngModel",link:function(a,c,d,e){e.$viewChangeListeners.push(function(){a.$eval(d.ngChange)})}}),Oc=function(){return{require:"?ngModel",link:function(a,c,d,e){if(e){d.required=!0;var f=function(a){if(d.required&&e.$isEmpty(a))e.$setValidity("required",!1);else return e.$setValidity("required",!0),a};e.$formatters.push(f);e.$parsers.unshift(f);d.$observe("required",function(){f(e.$viewValue)})}}}},
ke=function(){return{require:"ngModel",link:function(a,c,d,e){var f=(a=/\/(.*)\//.exec(d.ngList))&&RegExp(a[1])||d.ngList||",";e.$parsers.push(function(a){if(!B(a)){var c=[];a&&r(a.split(f),function(a){a&&c.push(ca(a))});return c}});e.$formatters.push(function(a){return I(a)?a.join(", "):s});e.$isEmpty=function(a){return!a||!a.length}}}},le=/^(true|false|\d+)$/,me=function(){return{priority:100,compile:function(a,c){return le.test(c.ngValue)?function(a,c,f){f.$set("value",a.$eval(f.ngValue))}:function(a,
c,f){a.$watch(f.ngValue,function(a){f.$set("value",a)})}}}},ne=ra(function(a,c,d){c.addClass("ng-binding").data("$binding",d.ngBind);a.$watch(d.ngBind,function(a){c.text(a==s?"":a)})}),oe=["$interpolate",function(a){return function(c,d,e){c=a(d.attr(e.$attr.ngBindTemplate));d.addClass("ng-binding").data("$binding",c);e.$observe("ngBindTemplate",function(a){d.text(a)})}}],pe=["$sce","$parse",function(a,c){return function(d,e,f){e.addClass("ng-binding").data("$binding",f.ngBindHtml);var g=c(f.ngBindHtml);
d.$watch(function(){return(g(d)||"").toString()},function(c){e.html(a.getTrustedHtml(g(d))||"")})}}],qe=Nb("",!0),re=Nb("Odd",0),se=Nb("Even",1),te=ra({compile:function(a,c){c.$set("ngCloak",s);a.removeClass("ng-cloak")}}),ue=[function(){return{scope:!0,controller:"@",priority:500}}],Pc={};r("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "),function(a){var c=ka("ng-"+a);Pc[c]=["$parse",function(d){return{compile:function(e,
f){var g=d(f[c]);return function(c,d,e){d.on(O(a),function(a){c.$apply(function(){g(c,{$event:a})})})}}}}]});var ve=["$animate",function(a){return{transclude:"element",priority:600,terminal:!0,restrict:"A",$$tlb:!0,link:function(c,d,e,f,g){var h,m,k;c.$watch(e.ngIf,function(f){Oa(f)?m||(m=c.$new(),g(m,function(c){c[c.length++]=T.createComment(" end ngIf: "+e.ngIf+" ");h={clone:c};a.enter(c,d.parent(),d)})):(k&&(k.remove(),k=null),m&&(m.$destroy(),m=null),h&&(k=yb(h.clone),a.leave(k,function(){k=null}),
h=null))})}}}],we=["$http","$templateCache","$anchorScroll","$animate","$sce",function(a,c,d,e,f){return{restrict:"ECA",priority:400,terminal:!0,transclude:"element",controller:Ba.noop,compile:function(g,h){var m=h.ngInclude||h.src,k=h.onload||"",l=h.autoscroll;return function(g,h,p,r,C){var s=0,u,t,z,w=function(){t&&(t.remove(),t=null);u&&(u.$destroy(),u=null);z&&(e.leave(z,function(){t=null}),t=z,z=null)};g.$watch(f.parseAsResourceUrl(m),function(f){var m=function(){!v(l)||l&&!g.$eval(l)||d()},
p=++s;f?(a.get(f,{cache:c}).success(function(a){if(p===s){var c=g.$new();r.template=a;a=C(c,function(a){w();e.enter(a,null,h,m)});u=c;z=a;u.$emit("$includeContentLoaded");g.$eval(k)}}).error(function(){p===s&&w()}),g.$emit("$includeContentRequested")):(w(),r.template=null)})}}}}],xe=["$compile",function(a){return{restrict:"ECA",priority:-400,require:"ngInclude",link:function(c,d,e,f){d.html(f.template);a(d.contents())(c)}}}],ye=ra({priority:450,compile:function(){return{pre:function(a,c,d){a.$eval(d.ngInit)}}}}),
ze=ra({terminal:!0,priority:1E3}),Ae=["$locale","$interpolate",function(a,c){var d=/{}/g;return{restrict:"EA",link:function(e,f,g){var h=g.count,m=g.$attr.when&&f.attr(g.$attr.when),k=g.offset||0,l=e.$eval(m)||{},n={},q=c.startSymbol(),p=c.endSymbol(),s=/^when(Minus)?(.+)$/;r(g,function(a,c){s.test(c)&&(l[O(c.replace("when","").replace("Minus","-"))]=f.attr(g.$attr[c]))});r(l,function(a,e){n[e]=c(a.replace(d,q+h+"-"+k+p))});e.$watch(function(){var c=parseFloat(e.$eval(h));if(isNaN(c))return"";c in
l||(c=a.pluralCat(c-k));return n[c](e,f,!0)},function(a){f.text(a)})}}}],Be=["$parse","$animate",function(a,c){var d=F("ngRepeat");return{transclude:"element",priority:1E3,terminal:!0,$$tlb:!0,link:function(e,f,g,h,m){var k=g.ngRepeat,l=k.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/),n,q,p,s,t,v,u={$id:Ea};if(!l)throw d("iexp",k);g=l[1];h=l[2];(l=l[3])?(n=a(l),q=function(a,c,d){v&&(u[v]=a);u[t]=c;u.$index=d;return n(e,u)}):(p=function(a,c){return Ea(c)},s=function(a){return a});
l=g.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);if(!l)throw d("iidexp",g);t=l[3]||l[1];v=l[2];var H={};e.$watchCollection(h,function(a){var g,h,l=f[0],n,u={},E,J,x,B,F,K,I=[];if(ub(a))F=a,n=q||p;else{n=q||s;F=[];for(x in a)a.hasOwnProperty(x)&&"$"!=x.charAt(0)&&F.push(x);F.sort()}E=F.length;h=I.length=F.length;for(g=0;g<h;g++)if(x=a===F?g:F[g],B=a[x],B=n(x,B,g),va(B,"`track by` id"),H.hasOwnProperty(B))K=H[B],delete H[B],u[B]=K,I[g]=K;else{if(u.hasOwnProperty(B))throw r(I,function(a){a&&
a.scope&&(H[a.id]=a)}),d("dupes",k,B);I[g]={id:B};u[B]=!1}for(x in H)H.hasOwnProperty(x)&&(K=H[x],g=yb(K.clone),c.leave(g),r(g,function(a){a.$$NG_REMOVED=!0}),K.scope.$destroy());g=0;for(h=F.length;g<h;g++){x=a===F?g:F[g];B=a[x];K=I[g];I[g-1]&&(l=I[g-1].clone[I[g-1].clone.length-1]);if(K.scope){J=K.scope;n=l;do n=n.nextSibling;while(n&&n.$$NG_REMOVED);K.clone[0]!=n&&c.move(yb(K.clone),null,z(l));l=K.clone[K.clone.length-1]}else J=e.$new();J[t]=B;v&&(J[v]=x);J.$index=g;J.$first=0===g;J.$last=g===E-
1;J.$middle=!(J.$first||J.$last);J.$odd=!(J.$even=0===(g&1));K.scope||m(J,function(a){a[a.length++]=T.createComment(" end ngRepeat: "+k+" ");c.enter(a,null,z(l));l=a;K.scope=J;K.clone=a;u[K.id]=K})}H=u})}}}],Ce=["$animate",function(a){return function(c,d,e){c.$watch(e.ngShow,function(c){a[Oa(c)?"removeClass":"addClass"](d,"ng-hide")})}}],De=["$animate",function(a){return function(c,d,e){c.$watch(e.ngHide,function(c){a[Oa(c)?"addClass":"removeClass"](d,"ng-hide")})}}],Ee=ra(function(a,c,d){a.$watch(d.ngStyle,
function(a,d){d&&a!==d&&r(d,function(a,d){c.css(d,"")});a&&c.css(a)},!0)}),Fe=["$animate",function(a){return{restrict:"EA",require:"ngSwitch",controller:["$scope",function(){this.cases={}}],link:function(c,d,e,f){var g,h,m,k=[];c.$watch(e.ngSwitch||e.on,function(d){var n,q=k.length;if(0<q){if(m){for(n=0;n<q;n++)m[n].remove();m=null}m=[];for(n=0;n<q;n++){var p=h[n];k[n].$destroy();m[n]=p;a.leave(p,function(){m.splice(n,1);0===m.length&&(m=null)})}}h=[];k=[];if(g=f.cases["!"+d]||f.cases["?"])c.$eval(e.change),
r(g,function(d){var e=c.$new();k.push(e);d.transclude(e,function(c){var e=d.element;h.push(c);a.enter(c,e.parent(),e)})})})}}}],Ge=ra({transclude:"element",priority:800,require:"^ngSwitch",link:function(a,c,d,e,f){e.cases["!"+d.ngSwitchWhen]=e.cases["!"+d.ngSwitchWhen]||[];e.cases["!"+d.ngSwitchWhen].push({transclude:f,element:c})}}),He=ra({transclude:"element",priority:800,require:"^ngSwitch",link:function(a,c,d,e,f){e.cases["?"]=e.cases["?"]||[];e.cases["?"].push({transclude:f,element:c})}}),Ie=
ra({link:function(a,c,d,e,f){if(!f)throw F("ngTransclude")("orphan",fa(c));f(function(a){c.empty();c.append(a)})}}),Je=["$templateCache",function(a){return{restrict:"E",terminal:!0,compile:function(c,d){"text/ng-template"==d.type&&a.put(d.id,c[0].text)}}}],Ke=F("ngOptions"),Le=$({terminal:!0}),Me=["$compile","$parse",function(a,c){var d=/^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,
e={$setViewValue:x};return{restrict:"E",require:["select","?ngModel"],controller:["$element","$scope","$attrs",function(a,c,d){var m=this,k={},l=e,n;m.databound=d.ngModel;m.init=function(a,c,d){l=a;n=d};m.addOption=function(c){va(c,'"option value"');k[c]=!0;l.$viewValue==c&&(a.val(c),n.parent()&&n.remove())};m.removeOption=function(a){this.hasOption(a)&&(delete k[a],l.$viewValue==a&&this.renderUnknownOption(a))};m.renderUnknownOption=function(c){c="? "+Ea(c)+" ?";n.val(c);a.prepend(n);a.val(c);n.prop("selected",
!0)};m.hasOption=function(a){return k.hasOwnProperty(a)};c.$on("$destroy",function(){m.renderUnknownOption=x})}],link:function(e,g,h,m){function k(a,c,d,e){d.$render=function(){var a=d.$viewValue;e.hasOption(a)?(E.parent()&&E.remove(),c.val(a),""===a&&x.prop("selected",!0)):B(a)&&x?c.val(""):e.renderUnknownOption(a)};c.on("change",function(){a.$apply(function(){E.parent()&&E.remove();d.$setViewValue(c.val())})})}function l(a,c,d){var e;d.$render=function(){var a=new Sa(d.$viewValue);r(c.find("option"),
function(c){c.selected=v(a.get(c.value))})};a.$watch(function(){sa(e,d.$viewValue)||(e=ba(d.$viewValue),d.$render())});c.on("change",function(){a.$apply(function(){var a=[];r(c.find("option"),function(c){c.selected&&a.push(c.value)});d.$setViewValue(a)})})}function n(e,f,g){function h(){var a={"":[]},c=[""],d,k,s,t,y;t=g.$modelValue;y=z(e)||[];var B=n?Pb(y):y,E,A,D;A={};s=!1;var L,J;if(p)if(w&&I(t))for(s=new Sa([]),D=0;D<t.length;D++)A[m]=t[D],s.put(w(e,A),t[D]);else s=new Sa(t);for(D=0;E=B.length,
D<E;D++){k=D;if(n){k=B[D];if("$"===k.charAt(0))continue;A[n]=k}A[m]=y[k];d=q(e,A)||"";(k=a[d])||(k=a[d]=[],c.push(d));p?d=v(s.remove(w?w(e,A):r(e,A))):(w?(d={},d[m]=t,d=w(e,d)===w(e,A)):d=t===r(e,A),s=s||d);L=l(e,A);L=v(L)?L:"";k.push({id:w?w(e,A):n?B[D]:D,label:L,selected:d})}p||(C||null===t?a[""].unshift({id:"",label:"",selected:!s}):s||a[""].unshift({id:"?",label:"",selected:!0}));A=0;for(B=c.length;A<B;A++){d=c[A];k=a[d];x.length<=A?(t={element:F.clone().attr("label",d),label:k.label},y=[t],x.push(y),
f.append(t.element)):(y=x[A],t=y[0],t.label!=d&&t.element.attr("label",t.label=d));L=null;D=0;for(E=k.length;D<E;D++)s=k[D],(d=y[D+1])?(L=d.element,d.label!==s.label&&L.text(d.label=s.label),d.id!==s.id&&L.val(d.id=s.id),L[0].selected!==s.selected&&L.prop("selected",d.selected=s.selected)):(""===s.id&&C?J=C:(J=u.clone()).val(s.id).attr("selected",s.selected).text(s.label),y.push({element:J,label:s.label,id:s.id,selected:s.selected}),L?L.after(J):t.element.append(J),L=J);for(D++;y.length>D;)y.pop().element.remove()}for(;x.length>
A;)x.pop()[0].element.remove()}var k;if(!(k=t.match(d)))throw Ke("iexp",t,fa(f));var l=c(k[2]||k[1]),m=k[4]||k[6],n=k[5],q=c(k[3]||""),r=c(k[2]?k[1]:m),z=c(k[7]),w=k[8]?c(k[8]):null,x=[[{element:f,label:""}]];C&&(a(C)(e),C.removeClass("ng-scope"),C.remove());f.empty();f.on("change",function(){e.$apply(function(){var a,c=z(e)||[],d={},h,k,l,q,t,v,u;if(p)for(k=[],q=0,v=x.length;q<v;q++)for(a=x[q],l=1,t=a.length;l<t;l++){if((h=a[l].element)[0].selected){h=h.val();n&&(d[n]=h);if(w)for(u=0;u<c.length&&
(d[m]=c[u],w(e,d)!=h);u++);else d[m]=c[h];k.push(r(e,d))}}else if(h=f.val(),"?"==h)k=s;else if(""===h)k=null;else if(w)for(u=0;u<c.length;u++){if(d[m]=c[u],w(e,d)==h){k=r(e,d);break}}else d[m]=c[h],n&&(d[n]=h),k=r(e,d);g.$setViewValue(k)})});g.$render=h;e.$watch(h)}if(m[1]){var q=m[0];m=m[1];var p=h.multiple,t=h.ngOptions,C=!1,x,u=z(T.createElement("option")),F=z(T.createElement("optgroup")),E=u.clone();h=0;for(var w=g.children(),D=w.length;h<D;h++)if(""===w[h].value){x=C=w.eq(h);break}q.init(m,C,
E);p&&(m.$isEmpty=function(a){return!a||0===a.length});t?n(e,g,m):p?l(e,g,m):k(e,g,m,q)}}}}],Ne=["$interpolate",function(a){var c={addOption:x,removeOption:x};return{restrict:"E",priority:100,compile:function(d,e){if(B(e.value)){var f=a(d.text(),!0);f||e.$set("value",d.text())}return function(a,d,e){var k=d.parent(),l=k.data("$selectController")||k.parent().data("$selectController");l&&l.databound?d.prop("selected",!1):l=c;f?a.$watch(f,function(a,c){e.$set("value",a);a!==c&&l.removeOption(c);l.addOption(a)}):
l.addOption(e.value);d.on("$destroy",function(){l.removeOption(e.value)})}}}}],Oe=$({restrict:"E",terminal:!0});(Ca=D.jQuery)?(z=Ca,t(Ca.fn,{scope:Fa.scope,isolateScope:Fa.isolateScope,controller:Fa.controller,injector:Fa.injector,inheritedData:Fa.inheritedData}),zb("remove",!0,!0,!1),zb("empty",!1,!1,!1),zb("html",!1,!1,!0)):z=R;Ba.element=z;(function(a){t(a,{bootstrap:Zb,copy:ba,extend:t,equals:sa,element:z,forEach:r,injector:$b,noop:x,bind:bb,toJson:na,fromJson:Vb,identity:za,isUndefined:B,isDefined:v,
isString:E,isFunction:N,isObject:X,isNumber:vb,isElement:Rc,isArray:I,version:Xd,isDate:La,lowercase:O,uppercase:Ia,callbacks:{counter:0},$$minErr:F,$$csp:Ub});Ua=Wc(D);try{Ua("ngLocale")}catch(c){Ua("ngLocale",[]).provider("$locale",ud)}Ua("ng",["ngLocale"],["$provide",function(a){a.provider({$$sanitizeUri:Fd});a.provider("$compile",jc).directive({a:be,input:Nc,textarea:Nc,form:ce,script:Je,select:Me,style:Oe,option:Ne,ngBind:ne,ngBindHtml:pe,ngBindTemplate:oe,ngClass:qe,ngClassEven:se,ngClassOdd:re,
ngCloak:te,ngController:ue,ngForm:de,ngHide:De,ngIf:ve,ngInclude:we,ngInit:ye,ngNonBindable:ze,ngPluralize:Ae,ngRepeat:Be,ngShow:Ce,ngStyle:Ee,ngSwitch:Fe,ngSwitchWhen:Ge,ngSwitchDefault:He,ngOptions:Le,ngTransclude:Ie,ngModel:ie,ngList:ke,ngChange:je,required:Oc,ngRequired:Oc,ngValue:me}).directive({ngInclude:xe}).directive(Ob).directive(Pc);a.provider({$anchorScroll:ed,$animate:Zd,$browser:hd,$cacheFactory:id,$controller:ld,$document:md,$exceptionHandler:nd,$filter:Cc,$interpolate:sd,$interval:td,
$http:od,$httpBackend:qd,$location:wd,$log:xd,$parse:Ad,$rootScope:Ed,$q:Bd,$sce:Id,$sceDelegate:Hd,$sniffer:Jd,$templateCache:jd,$timeout:Kd,$window:Ld,$$rAF:Dd,$$asyncCallback:fd})}])})(Ba);z(T).ready(function(){Uc(T,Zb)})})(window,document);!angular.$$csp()&&angular.element(document).find("head").prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\\:form{display:block;}.ng-animate-block-transitions{transition:0s all!important;-webkit-transition:0s all!important;}</style>');
//# sourceMappingURL=angular.min.js.map

/**!
 * AngularJS file upload/drop directive with http post and progress
 * @author  Danial  <danial.farid@gmail.com>
 * @version 1.6.5
 */
(function() {

var angularFileUpload = angular.module('angularFileUpload', []);

angularFileUpload.service('$upload', ['$http', '$q', '$timeout', function($http, $q, $timeout) {
	function sendHttp(config) {
		config.method = config.method || 'POST';
		config.headers = config.headers || {};
		config.transformRequest = config.transformRequest || function(data, headersGetter) {
			if (window.ArrayBuffer && data instanceof window.ArrayBuffer) {
				return data;
			}
			return $http.defaults.transformRequest[0](data, headersGetter);
		};
		var deferred = $q.defer();

		if (window.XMLHttpRequest.__isShim) {
			config.headers['__setXHR_'] = function() {
				return function(xhr) {
					if (!xhr) return;
					config.__XHR = xhr;
					config.xhrFn && config.xhrFn(xhr);
					xhr.upload.addEventListener('progress', function(e) {
						deferred.notify(e);
					}, false);
					//fix for firefox not firing upload progress end, also IE8-9
					xhr.upload.addEventListener('load', function(e) {
						if (e.lengthComputable) {
							deferred.notify(e);
						}
					}, false);
				};
			};
		}

		$http(config).then(function(r){deferred.resolve(r)}, function(e){deferred.reject(e)}, function(n){deferred.notify(n)});
		
		var promise = deferred.promise;
		promise.success = function(fn) {
			promise.then(function(response) {
				fn(response.data, response.status, response.headers, config);
			});
			return promise;
		};

		promise.error = function(fn) {
			promise.then(null, function(response) {
				fn(response.data, response.status, response.headers, config);
			});
			return promise;
		};

		promise.progress = function(fn) {
			promise.then(null, null, function(update) {
				fn(update);
			});
			return promise;
		};
		promise.abort = function() {
			if (config.__XHR) {
				$timeout(function() {
					config.__XHR.abort();
				});
			}
			return promise;
		};
		promise.xhr = function(fn) {
			config.xhrFn = (function(origXhrFn) {
				return function() {
					origXhrFn && origXhrFn.apply(promise, arguments);
					fn.apply(promise, arguments);
				}
			})(config.xhrFn);
			return promise;
		};
		
		return promise;
	}

	this.upload = function(config) {
		config.headers = config.headers || {};
		config.headers['Content-Type'] = undefined;
		config.transformRequest = config.transformRequest || $http.defaults.transformRequest;
		var formData = new FormData();
		var origTransformRequest = config.transformRequest;
		var origData = config.data;
		config.transformRequest = function(formData, headerGetter) {
			if (origData) {
				if (config.formDataAppender) {
					for (var key in origData) {
						var val = origData[key];
						config.formDataAppender(formData, key, val);
					}
				} else {
					for (var key in origData) {
						var val = origData[key];
						if (typeof origTransformRequest == 'function') {
							val = origTransformRequest(val, headerGetter);
						} else {
							for (var i = 0; i < origTransformRequest.length; i++) {
								var transformFn = origTransformRequest[i];
								if (typeof transformFn == 'function') {
									val = transformFn(val, headerGetter);
								}
							}
						}
						formData.append(key, val);
					}
				}
			}

			if (config.file != null) {
				var fileFormName = config.fileFormDataName || 'file';

				if (Object.prototype.toString.call(config.file) === '[object Array]') {
					var isFileFormNameString = Object.prototype.toString.call(fileFormName) === '[object String]';
					for (var i = 0; i < config.file.length; i++) {
						formData.append(isFileFormNameString ? fileFormName : fileFormName[i], config.file[i], 
								(config.fileName && config.fileName[i]) || config.file[i].name);
					}
				} else {
					formData.append(fileFormName, config.file, config.fileName || config.file.name);
				}
			}
			return formData;
		};

		config.data = formData;

		return sendHttp(config);
	};

	this.http = function(config) {
		return sendHttp(config);
	}
}]);

angularFileUpload.directive('ngFileSelect', [ '$parse', '$timeout', function($parse, $timeout) {
	return function(scope, elem, attr) {
		var fn = $parse(attr['ngFileSelect']);
		if (elem[0].tagName.toLowerCase() !== 'input' || (elem.attr('type') && elem.attr('type').toLowerCase()) !== 'file') {
			var fileElem = angular.element('<input type="file">')
			for (var i = 0; i < elem[0].attributes.length; i++) {
				fileElem.attr(elem[0].attributes[i].name, elem[0].attributes[i].value);
			}
			if (elem.attr("data-multiple")) fileElem.attr("multiple", "true");
			fileElem.css("top", 0).css("bottom", 0).css("left", 0).css("right", 0).css("width", "100%").
					css("opacity", 0).css("position", "absolute").css('filter', 'alpha(opacity=0)');
			elem.append(fileElem);
			if (elem.css("position") === '' || elem.css("position") === 'static') {
				elem.css("position", "relative");
			}
			elem = fileElem;
		}
		elem.bind('change', function(evt) {
			var files = [], fileList, i;
			fileList = evt.__files_ || evt.target.files;
			if (fileList != null) {
				for (i = 0; i < fileList.length; i++) {
					files.push(fileList.item(i));
				}
			}
			$timeout(function() {
				fn(scope, {
					$files : files,
					$event : evt
				});
			});
		});
		// removed this since it was confusing if the user click on browse and then cancel #181
//		elem.bind('click', function(){
//			this.value = null;
//		});

		// removed because of #253 bug
		// touch screens
//		if (('ontouchstart' in window) ||
//				(navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {
//			elem.bind('touchend', function(e) {
//				e.preventDefault();
//				e.target.click();
//			});
//		}
	};
} ]);

angularFileUpload.directive('ngFileDropAvailable', [ '$parse', '$timeout', function($parse, $timeout) {
	return function(scope, elem, attr) {
		if ('draggable' in document.createElement('span')) {
			var fn = $parse(attr['ngFileDropAvailable']);
			$timeout(function() {
				fn(scope);
			});
		}
	};
} ]);

angularFileUpload.directive('ngFileDrop', [ '$parse', '$timeout', '$location', function($parse, $timeout, $location) {
	return function(scope, elem, attr) {
		if ('draggable' in document.createElement('span')) {
			var leaveTimeout = null;
			elem[0].addEventListener("dragover", function(evt) {
				evt.stopPropagation();
				evt.preventDefault();
				$timeout.cancel(leaveTimeout);
				if (!elem[0].__drag_over_class_) {
					if (attr['ngFileDragOverClass'].search(/\) *$/) > -1) {
						dragOverClassFn = $parse(attr['ngFileDragOverClass']);
						var dragOverClass = dragOverClassFn(scope, {
							$event : evt
						});					
						elem[0].__drag_over_class_ = dragOverClass; 
					} else {
						elem[0].__drag_over_class_ = attr['ngFileDragOverClass'] || "dragover";
					}
				}
				elem.addClass(elem[0].__drag_over_class_);
			}, false);
			elem[0].addEventListener("dragenter", function(evt) {
				evt.stopPropagation();
				evt.preventDefault();
			}, false);
			elem[0].addEventListener("dragleave", function(evt) {
				leaveTimeout = $timeout(function() {
					elem.removeClass(elem[0].__drag_over_class_);
					elem[0].__drag_over_class_ = null;
				}, attr['ngFileDragOverDelay'] || 1);
			}, false);
			var fn = $parse(attr['ngFileDrop']);
			elem[0].addEventListener("drop", function(evt) {
				evt.stopPropagation();
				evt.preventDefault();
				elem.removeClass(elem[0].__drag_over_class_);
				elem[0].__drag_over_class_ = null;
				extractFiles(evt, function(files) {
					fn(scope, {
						$files : files,
						$event : evt
					});					
				});
			}, false);
						
			function isASCII(str) {
				return /^[\000-\177]*$/.test(str);
			}

			function extractFiles(evt, callback) {
				var files = [], items = evt.dataTransfer.items;
				if (items && items.length > 0 && items[0].webkitGetAsEntry && $location.protocol() != 'file') {
					for (var i = 0; i < items.length; i++) {
						var entry = items[i].webkitGetAsEntry();
						if (entry != null) {
							//fix for chrome bug https://code.google.com/p/chromium/issues/detail?id=149735
							if (isASCII(entry.name)) {
								traverseFileTree(files, entry);
							} else if (!items[i].webkitGetAsEntry().isDirectory) {
								files.push(items[i].getAsFile());
							}
						}
					}
				} else {
					var fileList = evt.dataTransfer.files;
					if (fileList != null) {
						for (var i = 0; i < fileList.length; i++) {
							files.push(fileList.item(i));
						}
					}
				}
				(function waitForProcess(delay) {
					$timeout(function() {
						if (!processing) {
							callback(files);
						} else {
							waitForProcess(10);
						}
					}, delay || 0)
				})();
			}
			
			var processing = 0;
			function traverseFileTree(files, entry, path) {
				if (entry != null) {
					if (entry.isDirectory) {
						var dirReader = entry.createReader();
						processing++;
						dirReader.readEntries(function(entries) {
							for (var i = 0; i < entries.length; i++) {
								traverseFileTree(files, entries[i], (path ? path : "") + entry.name + "/");
							}
							processing--;
						});
					} else {
						processing++;
						entry.file(function(file) {
							processing--;
							file._relativePath = (path ? path : "") + file.name;
							files.push(file);
						});
					}
				}
			}
		}
	};
} ]);

})();

/*
 AngularJS v1.2.14
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(n,e,A){'use strict';function x(s,g,k){return{restrict:"ECA",terminal:!0,priority:400,transclude:"element",link:function(a,c,b,f,w){function y(){p&&(p.remove(),p=null);h&&(h.$destroy(),h=null);l&&(k.leave(l,function(){p=null}),p=l,l=null)}function v(){var b=s.current&&s.current.locals;if(e.isDefined(b&&b.$template)){var b=a.$new(),d=s.current;l=w(b,function(d){k.enter(d,null,l||c,function(){!e.isDefined(t)||t&&!a.$eval(t)||g()});y()});h=d.scope=b;h.$emit("$viewContentLoaded");h.$eval(u)}else y()}
var h,l,p,t=b.autoscroll,u=b.onload||"";a.$on("$routeChangeSuccess",v);v()}}}function z(e,g,k){return{restrict:"ECA",priority:-400,link:function(a,c){var b=k.current,f=b.locals;c.html(f.$template);var w=e(c.contents());b.controller&&(f.$scope=a,f=g(b.controller,f),b.controllerAs&&(a[b.controllerAs]=f),c.data("$ngControllerController",f),c.children().data("$ngControllerController",f));w(a)}}}n=e.module("ngRoute",["ng"]).provider("$route",function(){function s(a,c){return e.extend(new (e.extend(function(){},
{prototype:a})),c)}function g(a,e){var b=e.caseInsensitiveMatch,f={originalPath:a,regexp:a},k=f.keys=[];a=a.replace(/([().])/g,"\\$1").replace(/(\/)?:(\w+)([\?\*])?/g,function(a,e,b,c){a="?"===c?c:null;c="*"===c?c:null;k.push({name:b,optional:!!a});e=e||"";return""+(a?"":e)+"(?:"+(a?e:"")+(c&&"(.+?)"||"([^/]+)")+(a||"")+")"+(a||"")}).replace(/([\/$\*])/g,"\\$1");f.regexp=RegExp("^"+a+"$",b?"i":"");return f}var k={};this.when=function(a,c){k[a]=e.extend({reloadOnSearch:!0},c,a&&g(a,c));if(a){var b=
"/"==a[a.length-1]?a.substr(0,a.length-1):a+"/";k[b]=e.extend({redirectTo:a},g(b,c))}return this};this.otherwise=function(a){this.when(null,a);return this};this.$get=["$rootScope","$location","$routeParams","$q","$injector","$http","$templateCache","$sce",function(a,c,b,f,g,n,v,h){function l(){var d=p(),m=r.current;if(d&&m&&d.$$route===m.$$route&&e.equals(d.pathParams,m.pathParams)&&!d.reloadOnSearch&&!u)m.params=d.params,e.copy(m.params,b),a.$broadcast("$routeUpdate",m);else if(d||m)u=!1,a.$broadcast("$routeChangeStart",
d,m),(r.current=d)&&d.redirectTo&&(e.isString(d.redirectTo)?c.path(t(d.redirectTo,d.params)).search(d.params).replace():c.url(d.redirectTo(d.pathParams,c.path(),c.search())).replace()),f.when(d).then(function(){if(d){var a=e.extend({},d.resolve),c,b;e.forEach(a,function(d,c){a[c]=e.isString(d)?g.get(d):g.invoke(d)});e.isDefined(c=d.template)?e.isFunction(c)&&(c=c(d.params)):e.isDefined(b=d.templateUrl)&&(e.isFunction(b)&&(b=b(d.params)),b=h.getTrustedResourceUrl(b),e.isDefined(b)&&(d.loadedTemplateUrl=
b,c=n.get(b,{cache:v}).then(function(a){return a.data})));e.isDefined(c)&&(a.$template=c);return f.all(a)}}).then(function(c){d==r.current&&(d&&(d.locals=c,e.copy(d.params,b)),a.$broadcast("$routeChangeSuccess",d,m))},function(c){d==r.current&&a.$broadcast("$routeChangeError",d,m,c)})}function p(){var a,b;e.forEach(k,function(f,k){var q;if(q=!b){var g=c.path();q=f.keys;var l={};if(f.regexp)if(g=f.regexp.exec(g)){for(var h=1,p=g.length;h<p;++h){var n=q[h-1],r="string"==typeof g[h]?decodeURIComponent(g[h]):
g[h];n&&r&&(l[n.name]=r)}q=l}else q=null;else q=null;q=a=q}q&&(b=s(f,{params:e.extend({},c.search(),a),pathParams:a}),b.$$route=f)});return b||k[null]&&s(k[null],{params:{},pathParams:{}})}function t(a,c){var b=[];e.forEach((a||"").split(":"),function(a,d){if(0===d)b.push(a);else{var e=a.match(/(\w+)(.*)/),f=e[1];b.push(c[f]);b.push(e[2]||"");delete c[f]}});return b.join("")}var u=!1,r={routes:k,reload:function(){u=!0;a.$evalAsync(l)}};a.$on("$locationChangeSuccess",l);return r}]});n.provider("$routeParams",
function(){this.$get=function(){return{}}});n.directive("ngView",x);n.directive("ngView",z);x.$inject=["$route","$anchorScroll","$animate"];z.$inject=["$compile","$controller","$route"]})(window,window.angular);
//# sourceMappingURL=angular-route.min.js.map

/*
 AngularJS v1.2.14
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(H,a,A){'use strict';function D(p,g){g=g||{};a.forEach(g,function(a,c){delete g[c]});for(var c in p)!p.hasOwnProperty(c)||"$"===c.charAt(0)&&"$"===c.charAt(1)||(g[c]=p[c]);return g}var v=a.$$minErr("$resource"),C=/^(\.[a-zA-Z_$][0-9a-zA-Z_$]*)+$/;a.module("ngResource",["ng"]).factory("$resource",["$http","$q",function(p,g){function c(a,c){this.template=a;this.defaults=c||{};this.urlParams={}}function t(n,w,l){function r(h,d){var e={};d=x({},w,d);s(d,function(b,d){u(b)&&(b=b());var k;if(b&&
b.charAt&&"@"==b.charAt(0)){k=h;var a=b.substr(1);if(null==a||""===a||"hasOwnProperty"===a||!C.test("."+a))throw v("badmember",a);for(var a=a.split("."),f=0,c=a.length;f<c&&k!==A;f++){var g=a[f];k=null!==k?k[g]:A}}else k=b;e[d]=k});return e}function e(a){return a.resource}function f(a){D(a||{},this)}var F=new c(n);l=x({},B,l);s(l,function(h,d){var c=/^(POST|PUT|PATCH)$/i.test(h.method);f[d]=function(b,d,k,w){var q={},n,l,y;switch(arguments.length){case 4:y=w,l=k;case 3:case 2:if(u(d)){if(u(b)){l=
b;y=d;break}l=d;y=k}else{q=b;n=d;l=k;break}case 1:u(b)?l=b:c?n=b:q=b;break;case 0:break;default:throw v("badargs",arguments.length);}var t=this instanceof f,m=t?n:h.isArray?[]:new f(n),z={},B=h.interceptor&&h.interceptor.response||e,C=h.interceptor&&h.interceptor.responseError||A;s(h,function(a,b){"params"!=b&&("isArray"!=b&&"interceptor"!=b)&&(z[b]=G(a))});c&&(z.data=n);F.setUrlParams(z,x({},r(n,h.params||{}),q),h.url);q=p(z).then(function(b){var d=b.data,k=m.$promise;if(d){if(a.isArray(d)!==!!h.isArray)throw v("badcfg",
h.isArray?"array":"object",a.isArray(d)?"array":"object");h.isArray?(m.length=0,s(d,function(b){m.push(new f(b))})):(D(d,m),m.$promise=k)}m.$resolved=!0;b.resource=m;return b},function(b){m.$resolved=!0;(y||E)(b);return g.reject(b)});q=q.then(function(b){var a=B(b);(l||E)(a,b.headers);return a},C);return t?q:(m.$promise=q,m.$resolved=!1,m)};f.prototype["$"+d]=function(b,a,k){u(b)&&(k=a,a=b,b={});b=f[d].call(this,b,this,a,k);return b.$promise||b}});f.bind=function(a){return t(n,x({},w,a),l)};return f}
var B={get:{method:"GET"},save:{method:"POST"},query:{method:"GET",isArray:!0},remove:{method:"DELETE"},"delete":{method:"DELETE"}},E=a.noop,s=a.forEach,x=a.extend,G=a.copy,u=a.isFunction;c.prototype={setUrlParams:function(c,g,l){var r=this,e=l||r.template,f,p,h=r.urlParams={};s(e.split(/\W/),function(a){if("hasOwnProperty"===a)throw v("badname");!/^\d+$/.test(a)&&(a&&RegExp("(^|[^\\\\]):"+a+"(\\W|$)").test(e))&&(h[a]=!0)});e=e.replace(/\\:/g,":");g=g||{};s(r.urlParams,function(d,c){f=g.hasOwnProperty(c)?
g[c]:r.defaults[c];a.isDefined(f)&&null!==f?(p=encodeURIComponent(f).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"%20").replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+"),e=e.replace(RegExp(":"+c+"(\\W|$)","g"),function(a,c){return p+c})):e=e.replace(RegExp("(/?):"+c+"(\\W|$)","g"),function(a,c,d){return"/"==d.charAt(0)?d:c+d})});e=e.replace(/\/+$/,"")||"/";e=e.replace(/\/\.(?=\w+($|\?))/,".");c.url=e.replace(/\/\\\./,"/.");s(g,function(a,
e){r.urlParams[e]||(c.params=c.params||{},c.params[e]=a)})}};return t}])})(window,window.angular);
//# sourceMappingURL=angular-resource.min.js.map

/*
 AngularJS v1.2.14
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(p,f,n){'use strict';f.module("ngCookies",["ng"]).factory("$cookies",["$rootScope","$browser",function(d,b){var c={},g={},h,k=!1,l=f.copy,m=f.isUndefined;b.addPollFn(function(){var a=b.cookies();h!=a&&(h=a,l(a,g),l(a,c),k&&d.$apply())})();k=!0;d.$watch(function(){var a,e,d;for(a in g)m(c[a])&&b.cookies(a,n);for(a in c)(e=c[a],f.isString(e))?e!==g[a]&&(b.cookies(a,e),d=!0):f.isDefined(g[a])?c[a]=g[a]:delete c[a];if(d)for(a in e=b.cookies(),c)c[a]!==e[a]&&(m(e[a])?delete c[a]:c[a]=e[a])});
return c}]).factory("$cookieStore",["$cookies",function(d){return{get:function(b){return(b=d[b])?f.fromJson(b):b},put:function(b,c){d[b]=f.toJson(c)},remove:function(b){delete d[b]}}}])})(window,window.angular);
//# sourceMappingURL=angular-cookies.min.js.map

/*!
 * Bootstrap v3.2.0 (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]};return!1}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one("bsTransitionEnd",function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b(),a.support.transition&&(a.event.special.bsTransitionEnd={bindType:a.support.transition.end,delegateType:a.support.transition.end,handle:function(b){return a(b.target).is(this)?b.handleObj.handler.apply(this,arguments):void 0}})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var c=a(this),e=c.data("bs.alert");e||c.data("bs.alert",e=new d(this)),"string"==typeof b&&e[b].call(c)})}var c='[data-dismiss="alert"]',d=function(b){a(b).on("click",c,this.close)};d.VERSION="3.2.0",d.prototype.close=function(b){function c(){f.detach().trigger("closed.bs.alert").remove()}var d=a(this),e=d.attr("data-target");e||(e=d.attr("href"),e=e&&e.replace(/.*(?=#[^\s]*$)/,""));var f=a(e);b&&b.preventDefault(),f.length||(f=d.hasClass("alert")?d:d.parent()),f.trigger(b=a.Event("close.bs.alert")),b.isDefaultPrevented()||(f.removeClass("in"),a.support.transition&&f.hasClass("fade")?f.one("bsTransitionEnd",c).emulateTransitionEnd(150):c())};var e=a.fn.alert;a.fn.alert=b,a.fn.alert.Constructor=d,a.fn.alert.noConflict=function(){return a.fn.alert=e,this},a(document).on("click.bs.alert.data-api",c,d.prototype.close)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.button"),f="object"==typeof b&&b;e||d.data("bs.button",e=new c(this,f)),"toggle"==b?e.toggle():b&&e.setState(b)})}var c=function(b,d){this.$element=a(b),this.options=a.extend({},c.DEFAULTS,d),this.isLoading=!1};c.VERSION="3.2.0",c.DEFAULTS={loadingText:"loading..."},c.prototype.setState=function(b){var c="disabled",d=this.$element,e=d.is("input")?"val":"html",f=d.data();b+="Text",null==f.resetText&&d.data("resetText",d[e]()),d[e](null==f[b]?this.options[b]:f[b]),setTimeout(a.proxy(function(){"loadingText"==b?(this.isLoading=!0,d.addClass(c).attr(c,c)):this.isLoading&&(this.isLoading=!1,d.removeClass(c).removeAttr(c))},this),0)},c.prototype.toggle=function(){var a=!0,b=this.$element.closest('[data-toggle="buttons"]');if(b.length){var c=this.$element.find("input");"radio"==c.prop("type")&&(c.prop("checked")&&this.$element.hasClass("active")?a=!1:b.find(".active").removeClass("active")),a&&c.prop("checked",!this.$element.hasClass("active")).trigger("change")}a&&this.$element.toggleClass("active")};var d=a.fn.button;a.fn.button=b,a.fn.button.Constructor=c,a.fn.button.noConflict=function(){return a.fn.button=d,this},a(document).on("click.bs.button.data-api",'[data-toggle^="button"]',function(c){var d=a(c.target);d.hasClass("btn")||(d=d.closest(".btn")),b.call(d,"toggle"),c.preventDefault()})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.carousel"),f=a.extend({},c.DEFAULTS,d.data(),"object"==typeof b&&b),g="string"==typeof b?b:f.slide;e||d.data("bs.carousel",e=new c(this,f)),"number"==typeof b?e.to(b):g?e[g]():f.interval&&e.pause().cycle()})}var c=function(b,c){this.$element=a(b).on("keydown.bs.carousel",a.proxy(this.keydown,this)),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.paused=this.sliding=this.interval=this.$active=this.$items=null,"hover"==this.options.pause&&this.$element.on("mouseenter.bs.carousel",a.proxy(this.pause,this)).on("mouseleave.bs.carousel",a.proxy(this.cycle,this))};c.VERSION="3.2.0",c.DEFAULTS={interval:5e3,pause:"hover",wrap:!0},c.prototype.keydown=function(a){switch(a.which){case 37:this.prev();break;case 39:this.next();break;default:return}a.preventDefault()},c.prototype.cycle=function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},c.prototype.getItemIndex=function(a){return this.$items=a.parent().children(".item"),this.$items.index(a||this.$active)},c.prototype.to=function(b){var c=this,d=this.getItemIndex(this.$active=this.$element.find(".item.active"));return b>this.$items.length-1||0>b?void 0:this.sliding?this.$element.one("slid.bs.carousel",function(){c.to(b)}):d==b?this.pause().cycle():this.slide(b>d?"next":"prev",a(this.$items[b]))},c.prototype.pause=function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},c.prototype.next=function(){return this.sliding?void 0:this.slide("next")},c.prototype.prev=function(){return this.sliding?void 0:this.slide("prev")},c.prototype.slide=function(b,c){var d=this.$element.find(".item.active"),e=c||d[b](),f=this.interval,g="next"==b?"left":"right",h="next"==b?"first":"last",i=this;if(!e.length){if(!this.options.wrap)return;e=this.$element.find(".item")[h]()}if(e.hasClass("active"))return this.sliding=!1;var j=e[0],k=a.Event("slide.bs.carousel",{relatedTarget:j,direction:g});if(this.$element.trigger(k),!k.isDefaultPrevented()){if(this.sliding=!0,f&&this.pause(),this.$indicators.length){this.$indicators.find(".active").removeClass("active");var l=a(this.$indicators.children()[this.getItemIndex(e)]);l&&l.addClass("active")}var m=a.Event("slid.bs.carousel",{relatedTarget:j,direction:g});return a.support.transition&&this.$element.hasClass("slide")?(e.addClass(b),e[0].offsetWidth,d.addClass(g),e.addClass(g),d.one("bsTransitionEnd",function(){e.removeClass([b,g].join(" ")).addClass("active"),d.removeClass(["active",g].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger(m)},0)}).emulateTransitionEnd(1e3*d.css("transition-duration").slice(0,-1))):(d.removeClass("active"),e.addClass("active"),this.sliding=!1,this.$element.trigger(m)),f&&this.cycle(),this}};var d=a.fn.carousel;a.fn.carousel=b,a.fn.carousel.Constructor=c,a.fn.carousel.noConflict=function(){return a.fn.carousel=d,this},a(document).on("click.bs.carousel.data-api","[data-slide], [data-slide-to]",function(c){var d,e=a(this),f=a(e.attr("data-target")||(d=e.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""));if(f.hasClass("carousel")){var g=a.extend({},f.data(),e.data()),h=e.attr("data-slide-to");h&&(g.interval=!1),b.call(f,g),h&&f.data("bs.carousel").to(h),c.preventDefault()}}),a(window).on("load",function(){a('[data-ride="carousel"]').each(function(){var c=a(this);b.call(c,c.data())})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.collapse"),f=a.extend({},c.DEFAULTS,d.data(),"object"==typeof b&&b);!e&&f.toggle&&"show"==b&&(b=!b),e||d.data("bs.collapse",e=new c(this,f)),"string"==typeof b&&e[b]()})}var c=function(b,d){this.$element=a(b),this.options=a.extend({},c.DEFAULTS,d),this.transitioning=null,this.options.parent&&(this.$parent=a(this.options.parent)),this.options.toggle&&this.toggle()};c.VERSION="3.2.0",c.DEFAULTS={toggle:!0},c.prototype.dimension=function(){var a=this.$element.hasClass("width");return a?"width":"height"},c.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var c=a.Event("show.bs.collapse");if(this.$element.trigger(c),!c.isDefaultPrevented()){var d=this.$parent&&this.$parent.find("> .panel > .in");if(d&&d.length){var e=d.data("bs.collapse");if(e&&e.transitioning)return;b.call(d,"hide"),e||d.data("bs.collapse",null)}var f=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[f](0),this.transitioning=1;var g=function(){this.$element.removeClass("collapsing").addClass("collapse in")[f](""),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return g.call(this);var h=a.camelCase(["scroll",f].join("-"));this.$element.one("bsTransitionEnd",a.proxy(g,this)).emulateTransitionEnd(350)[f](this.$element[0][h])}}},c.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var b=a.Event("hide.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse").removeClass("in"),this.transitioning=1;var d=function(){this.transitioning=0,this.$element.trigger("hidden.bs.collapse").removeClass("collapsing").addClass("collapse")};return a.support.transition?void this.$element[c](0).one("bsTransitionEnd",a.proxy(d,this)).emulateTransitionEnd(350):d.call(this)}}},c.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()};var d=a.fn.collapse;a.fn.collapse=b,a.fn.collapse.Constructor=c,a.fn.collapse.noConflict=function(){return a.fn.collapse=d,this},a(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(c){var d,e=a(this),f=e.attr("data-target")||c.preventDefault()||(d=e.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""),g=a(f),h=g.data("bs.collapse"),i=h?"toggle":e.data(),j=e.attr("data-parent"),k=j&&a(j);h&&h.transitioning||(k&&k.find('[data-toggle="collapse"][data-parent="'+j+'"]').not(e).addClass("collapsed"),e[g.hasClass("in")?"addClass":"removeClass"]("collapsed")),b.call(g,i)})}(jQuery),+function(a){"use strict";function b(b){b&&3===b.which||(a(e).remove(),a(f).each(function(){var d=c(a(this)),e={relatedTarget:this};d.hasClass("open")&&(d.trigger(b=a.Event("hide.bs.dropdown",e)),b.isDefaultPrevented()||d.removeClass("open").trigger("hidden.bs.dropdown",e))}))}function c(b){var c=b.attr("data-target");c||(c=b.attr("href"),c=c&&/#[A-Za-z]/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,""));var d=c&&a(c);return d&&d.length?d:b.parent()}function d(b){return this.each(function(){var c=a(this),d=c.data("bs.dropdown");d||c.data("bs.dropdown",d=new g(this)),"string"==typeof b&&d[b].call(c)})}var e=".dropdown-backdrop",f='[data-toggle="dropdown"]',g=function(b){a(b).on("click.bs.dropdown",this.toggle)};g.VERSION="3.2.0",g.prototype.toggle=function(d){var e=a(this);if(!e.is(".disabled, :disabled")){var f=c(e),g=f.hasClass("open");if(b(),!g){"ontouchstart"in document.documentElement&&!f.closest(".navbar-nav").length&&a('<div class="dropdown-backdrop"/>').insertAfter(a(this)).on("click",b);var h={relatedTarget:this};if(f.trigger(d=a.Event("show.bs.dropdown",h)),d.isDefaultPrevented())return;e.trigger("focus"),f.toggleClass("open").trigger("shown.bs.dropdown",h)}return!1}},g.prototype.keydown=function(b){if(/(38|40|27)/.test(b.keyCode)){var d=a(this);if(b.preventDefault(),b.stopPropagation(),!d.is(".disabled, :disabled")){var e=c(d),g=e.hasClass("open");if(!g||g&&27==b.keyCode)return 27==b.which&&e.find(f).trigger("focus"),d.trigger("click");var h=" li:not(.divider):visible a",i=e.find('[role="menu"]'+h+', [role="listbox"]'+h);if(i.length){var j=i.index(i.filter(":focus"));38==b.keyCode&&j>0&&j--,40==b.keyCode&&j<i.length-1&&j++,~j||(j=0),i.eq(j).trigger("focus")}}}};var h=a.fn.dropdown;a.fn.dropdown=d,a.fn.dropdown.Constructor=g,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=h,this},a(document).on("click.bs.dropdown.data-api",b).on("click.bs.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.bs.dropdown.data-api",f,g.prototype.toggle).on("keydown.bs.dropdown.data-api",f+', [role="menu"], [role="listbox"]',g.prototype.keydown)}(jQuery),+function(a){"use strict";function b(b,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},c.DEFAULTS,e.data(),"object"==typeof b&&b);f||e.data("bs.modal",f=new c(this,g)),"string"==typeof b?f[b](d):g.show&&f.show(d)})}var c=function(b,c){this.options=c,this.$body=a(document.body),this.$element=a(b),this.$backdrop=this.isShown=null,this.scrollbarWidth=0,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,a.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};c.VERSION="3.2.0",c.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},c.prototype.toggle=function(a){return this.isShown?this.hide():this.show(a)},c.prototype.show=function(b){var c=this,d=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(d),this.isShown||d.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.$body.addClass("modal-open"),this.setScrollbar(),this.escape(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.backdrop(function(){var d=a.support.transition&&c.$element.hasClass("fade");c.$element.parent().length||c.$element.appendTo(c.$body),c.$element.show().scrollTop(0),d&&c.$element[0].offsetWidth,c.$element.addClass("in").attr("aria-hidden",!1),c.enforceFocus();var e=a.Event("shown.bs.modal",{relatedTarget:b});d?c.$element.find(".modal-dialog").one("bsTransitionEnd",function(){c.$element.trigger("focus").trigger(e)}).emulateTransitionEnd(300):c.$element.trigger("focus").trigger(e)}))},c.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b),this.isShown&&!b.isDefaultPrevented()&&(this.isShown=!1,this.$body.removeClass("modal-open"),this.resetScrollbar(),this.escape(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").attr("aria-hidden",!0).off("click.dismiss.bs.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",a.proxy(this.hideModal,this)).emulateTransitionEnd(300):this.hideModal())},c.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){this.$element[0]===a.target||this.$element.has(a.target).length||this.$element.trigger("focus")},this))},c.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keyup.dismiss.bs.modal",a.proxy(function(a){27==a.which&&this.hide()},this)):this.isShown||this.$element.off("keyup.dismiss.bs.modal")},c.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.$element.trigger("hidden.bs.modal")})},c.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},c.prototype.backdrop=function(b){var c=this,d=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var e=a.support.transition&&d;if(this.$backdrop=a('<div class="modal-backdrop '+d+'" />').appendTo(this.$body),this.$element.on("click.dismiss.bs.modal",a.proxy(function(a){a.target===a.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus.call(this.$element[0]):this.hide.call(this))},this)),e&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!b)return;e?this.$backdrop.one("bsTransitionEnd",b).emulateTransitionEnd(150):b()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var f=function(){c.removeBackdrop(),b&&b()};a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",f).emulateTransitionEnd(150):f()}else b&&b()},c.prototype.checkScrollbar=function(){document.body.clientWidth>=window.innerWidth||(this.scrollbarWidth=this.scrollbarWidth||this.measureScrollbar())},c.prototype.setScrollbar=function(){var a=parseInt(this.$body.css("padding-right")||0,10);this.scrollbarWidth&&this.$body.css("padding-right",a+this.scrollbarWidth)},c.prototype.resetScrollbar=function(){this.$body.css("padding-right","")},c.prototype.measureScrollbar=function(){var a=document.createElement("div");a.className="modal-scrollbar-measure",this.$body.append(a);var b=a.offsetWidth-a.clientWidth;return this.$body[0].removeChild(a),b};var d=a.fn.modal;a.fn.modal=b,a.fn.modal.Constructor=c,a.fn.modal.noConflict=function(){return a.fn.modal=d,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(c){var d=a(this),e=d.attr("href"),f=a(d.attr("data-target")||e&&e.replace(/.*(?=#[^\s]+$)/,"")),g=f.data("bs.modal")?"toggle":a.extend({remote:!/#/.test(e)&&e},f.data(),d.data());d.is("a")&&c.preventDefault(),f.one("show.bs.modal",function(a){a.isDefaultPrevented()||f.one("hidden.bs.modal",function(){d.is(":visible")&&d.trigger("focus")})}),b.call(f,g,this)})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f="object"==typeof b&&b;(e||"destroy"!=b)&&(e||d.data("bs.tooltip",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.type=this.options=this.enabled=this.timeout=this.hoverState=this.$element=null,this.init("tooltip",a,b)};c.VERSION="3.2.0",c.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0}},c.prototype.init=function(b,c,d){this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d),this.$viewport=this.options.viewport&&a(this.options.viewport.selector||this.options.viewport);for(var e=this.options.trigger.split(" "),f=e.length;f--;){var g=e[f];if("click"==g)this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if("manual"!=g){var h="hover"==g?"mouseenter":"focusin",i="hover"==g?"mouseleave":"focusout";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&"number"==typeof b.delay&&(b.delay={show:b.delay,hide:b.delay}),b},c.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},c.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),clearTimeout(c.timeout),c.hoverState="in",c.options.delay&&c.options.delay.show?void(c.timeout=setTimeout(function(){"in"==c.hoverState&&c.show()},c.options.delay.show)):c.show()},c.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),clearTimeout(c.timeout),c.hoverState="out",c.options.delay&&c.options.delay.hide?void(c.timeout=setTimeout(function(){"out"==c.hoverState&&c.hide()},c.options.delay.hide)):c.hide()},c.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(b);var c=a.contains(document.documentElement,this.$element[0]);if(b.isDefaultPrevented()||!c)return;var d=this,e=this.tip(),f=this.getUID(this.type);this.setContent(),e.attr("id",f),this.$element.attr("aria-describedby",f),this.options.animation&&e.addClass("fade");var g="function"==typeof this.options.placement?this.options.placement.call(this,e[0],this.$element[0]):this.options.placement,h=/\s?auto?\s?/i,i=h.test(g);i&&(g=g.replace(h,"")||"top"),e.detach().css({top:0,left:0,display:"block"}).addClass(g).data("bs."+this.type,this),this.options.container?e.appendTo(this.options.container):e.insertAfter(this.$element);var j=this.getPosition(),k=e[0].offsetWidth,l=e[0].offsetHeight;if(i){var m=g,n=this.$element.parent(),o=this.getPosition(n);g="bottom"==g&&j.top+j.height+l-o.scroll>o.height?"top":"top"==g&&j.top-o.scroll-l<0?"bottom":"right"==g&&j.right+k>o.width?"left":"left"==g&&j.left-k<o.left?"right":g,e.removeClass(m).addClass(g)}var p=this.getCalculatedOffset(g,j,k,l);this.applyPlacement(p,g);var q=function(){d.$element.trigger("shown.bs."+d.type),d.hoverState=null};a.support.transition&&this.$tip.hasClass("fade")?e.one("bsTransitionEnd",q).emulateTransitionEnd(150):q()}},c.prototype.applyPlacement=function(b,c){var d=this.tip(),e=d[0].offsetWidth,f=d[0].offsetHeight,g=parseInt(d.css("margin-top"),10),h=parseInt(d.css("margin-left"),10);isNaN(g)&&(g=0),isNaN(h)&&(h=0),b.top=b.top+g,b.left=b.left+h,a.offset.setOffset(d[0],a.extend({using:function(a){d.css({top:Math.round(a.top),left:Math.round(a.left)})}},b),0),d.addClass("in");var i=d[0].offsetWidth,j=d[0].offsetHeight;"top"==c&&j!=f&&(b.top=b.top+f-j);var k=this.getViewportAdjustedDelta(c,b,i,j);k.left?b.left+=k.left:b.top+=k.top;var l=k.left?2*k.left-e+i:2*k.top-f+j,m=k.left?"left":"top",n=k.left?"offsetWidth":"offsetHeight";d.offset(b),this.replaceArrow(l,d[0][n],m)},c.prototype.replaceArrow=function(a,b,c){this.arrow().css(c,a?50*(1-a/b)+"%":"")},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},c.prototype.hide=function(){function b(){"in"!=c.hoverState&&d.detach(),c.$element.trigger("hidden.bs."+c.type)}var c=this,d=this.tip(),e=a.Event("hide.bs."+this.type);return this.$element.removeAttr("aria-describedby"),this.$element.trigger(e),e.isDefaultPrevented()?void 0:(d.removeClass("in"),a.support.transition&&this.$tip.hasClass("fade")?d.one("bsTransitionEnd",b).emulateTransitionEnd(150):b(),this.hoverState=null,this)},c.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("data-original-title"))&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},c.prototype.hasContent=function(){return this.getTitle()},c.prototype.getPosition=function(b){b=b||this.$element;var c=b[0],d="BODY"==c.tagName;return a.extend({},"function"==typeof c.getBoundingClientRect?c.getBoundingClientRect():null,{scroll:d?document.documentElement.scrollTop||document.body.scrollTop:b.scrollTop(),width:d?a(window).width():b.outerWidth(),height:d?a(window).height():b.outerHeight()},d?{top:0,left:0}:b.offset())},c.prototype.getCalculatedOffset=function(a,b,c,d){return"bottom"==a?{top:b.top+b.height,left:b.left+b.width/2-c/2}:"top"==a?{top:b.top-d,left:b.left+b.width/2-c/2}:"left"==a?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},c.prototype.getViewportAdjustedDelta=function(a,b,c,d){var e={top:0,left:0};if(!this.$viewport)return e;var f=this.options.viewport&&this.options.viewport.padding||0,g=this.getPosition(this.$viewport);if(/right|left/.test(a)){var h=b.top-f-g.scroll,i=b.top+f-g.scroll+d;h<g.top?e.top=g.top-h:i>g.top+g.height&&(e.top=g.top+g.height-i)}else{var j=b.left-f,k=b.left+f+c;j<g.left?e.left=g.left-j:k>g.width&&(e.left=g.left+g.width-k)}return e},c.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||("function"==typeof c.title?c.title.call(b[0]):c.title)},c.prototype.getUID=function(a){do a+=~~(1e6*Math.random());while(document.getElementById(a));return a},c.prototype.tip=function(){return this.$tip=this.$tip||a(this.options.template)},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},c.prototype.validate=function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},c.prototype.enable=function(){this.enabled=!0},c.prototype.disable=function(){this.enabled=!1},c.prototype.toggleEnabled=function(){this.enabled=!this.enabled},c.prototype.toggle=function(b){var c=this;b&&(c=a(b.currentTarget).data("bs."+this.type),c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c))),c.tip().hasClass("in")?c.leave(c):c.enter(c)},c.prototype.destroy=function(){clearTimeout(this.timeout),this.hide().$element.off("."+this.type).removeData("bs."+this.type)};var d=a.fn.tooltip;a.fn.tooltip=b,a.fn.tooltip.Constructor=c,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=d,this}}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.popover"),f="object"==typeof b&&b;(e||"destroy"!=b)&&(e||d.data("bs.popover",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.init("popover",a,b)};if(!a.fn.tooltip)throw new Error("Popover requires tooltip.js");c.VERSION="3.2.0",c.DEFAULTS=a.extend({},a.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),c.prototype=a.extend({},a.fn.tooltip.Constructor.prototype),c.prototype.constructor=c,c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content").empty()[this.options.html?"string"==typeof c?"html":"append":"text"](c),a.removeClass("fade top bottom left right in"),a.find(".popover-title").html()||a.find(".popover-title").hide()},c.prototype.hasContent=function(){return this.getTitle()||this.getContent()},c.prototype.getContent=function(){var a=this.$element,b=this.options;return a.attr("data-content")||("function"==typeof b.content?b.content.call(a[0]):b.content)},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")},c.prototype.tip=function(){return this.$tip||(this.$tip=a(this.options.template)),this.$tip};var d=a.fn.popover;a.fn.popover=b,a.fn.popover.Constructor=c,a.fn.popover.noConflict=function(){return a.fn.popover=d,this}}(jQuery),+function(a){"use strict";function b(c,d){var e=a.proxy(this.process,this);this.$body=a("body"),this.$scrollElement=a(a(c).is("body")?window:c),this.options=a.extend({},b.DEFAULTS,d),this.selector=(this.options.target||"")+" .nav li > a",this.offsets=[],this.targets=[],this.activeTarget=null,this.scrollHeight=0,this.$scrollElement.on("scroll.bs.scrollspy",e),this.refresh(),this.process()}function c(c){return this.each(function(){var d=a(this),e=d.data("bs.scrollspy"),f="object"==typeof c&&c;e||d.data("bs.scrollspy",e=new b(this,f)),"string"==typeof c&&e[c]()})}b.VERSION="3.2.0",b.DEFAULTS={offset:10},b.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)},b.prototype.refresh=function(){var b="offset",c=0;a.isWindow(this.$scrollElement[0])||(b="position",c=this.$scrollElement.scrollTop()),this.offsets=[],this.targets=[],this.scrollHeight=this.getScrollHeight();var d=this;this.$body.find(this.selector).map(function(){var d=a(this),e=d.data("target")||d.attr("href"),f=/^#./.test(e)&&a(e);return f&&f.length&&f.is(":visible")&&[[f[b]().top+c,e]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){d.offsets.push(this[0]),d.targets.push(this[1])})},b.prototype.process=function(){var a,b=this.$scrollElement.scrollTop()+this.options.offset,c=this.getScrollHeight(),d=this.options.offset+c-this.$scrollElement.height(),e=this.offsets,f=this.targets,g=this.activeTarget;if(this.scrollHeight!=c&&this.refresh(),b>=d)return g!=(a=f[f.length-1])&&this.activate(a);if(g&&b<=e[0])return g!=(a=f[0])&&this.activate(a);for(a=e.length;a--;)g!=f[a]&&b>=e[a]&&(!e[a+1]||b<=e[a+1])&&this.activate(f[a])},b.prototype.activate=function(b){this.activeTarget=b,a(this.selector).parentsUntil(this.options.target,".active").removeClass("active");var c=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',d=a(c).parents("li").addClass("active");d.parent(".dropdown-menu").length&&(d=d.closest("li.dropdown").addClass("active")),d.trigger("activate.bs.scrollspy")};var d=a.fn.scrollspy;a.fn.scrollspy=c,a.fn.scrollspy.Constructor=b,a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=d,this},a(window).on("load.bs.scrollspy.data-api",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);c.call(b,b.data())})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tab");e||d.data("bs.tab",e=new c(this)),"string"==typeof b&&e[b]()})}var c=function(b){this.element=a(b)};c.VERSION="3.2.0",c.prototype.show=function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.data("target");if(d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),!b.parent("li").hasClass("active")){var e=c.find(".active:last a")[0],f=a.Event("show.bs.tab",{relatedTarget:e});if(b.trigger(f),!f.isDefaultPrevented()){var g=a(d);this.activate(b.closest("li"),c),this.activate(g,g.parent(),function(){b.trigger({type:"shown.bs.tab",relatedTarget:e})})}}},c.prototype.activate=function(b,c,d){function e(){f.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),b.addClass("active"),g?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu")&&b.closest("li.dropdown").addClass("active"),d&&d()}var f=c.find("> .active"),g=d&&a.support.transition&&f.hasClass("fade");g?f.one("bsTransitionEnd",e).emulateTransitionEnd(150):e(),f.removeClass("in")};var d=a.fn.tab;a.fn.tab=b,a.fn.tab.Constructor=c,a.fn.tab.noConflict=function(){return a.fn.tab=d,this},a(document).on("click.bs.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(c){c.preventDefault(),b.call(a(this),"show")})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.affix"),f="object"==typeof b&&b;e||d.data("bs.affix",e=new c(this,f)),"string"==typeof b&&e[b]()})}var c=function(b,d){this.options=a.extend({},c.DEFAULTS,d),this.$target=a(this.options.target).on("scroll.bs.affix.data-api",a.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",a.proxy(this.checkPositionWithEventLoop,this)),this.$element=a(b),this.affixed=this.unpin=this.pinnedOffset=null,this.checkPosition()};c.VERSION="3.2.0",c.RESET="affix affix-top affix-bottom",c.DEFAULTS={offset:0,target:window},c.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(c.RESET).addClass("affix");var a=this.$target.scrollTop(),b=this.$element.offset();return this.pinnedOffset=b.top-a},c.prototype.checkPositionWithEventLoop=function(){setTimeout(a.proxy(this.checkPosition,this),1)},c.prototype.checkPosition=function(){if(this.$element.is(":visible")){var b=a(document).height(),d=this.$target.scrollTop(),e=this.$element.offset(),f=this.options.offset,g=f.top,h=f.bottom;"object"!=typeof f&&(h=g=f),"function"==typeof g&&(g=f.top(this.$element)),"function"==typeof h&&(h=f.bottom(this.$element));var i=null!=this.unpin&&d+this.unpin<=e.top?!1:null!=h&&e.top+this.$element.height()>=b-h?"bottom":null!=g&&g>=d?"top":!1;if(this.affixed!==i){null!=this.unpin&&this.$element.css("top","");var j="affix"+(i?"-"+i:""),k=a.Event(j+".bs.affix");this.$element.trigger(k),k.isDefaultPrevented()||(this.affixed=i,this.unpin="bottom"==i?this.getPinnedOffset():null,this.$element.removeClass(c.RESET).addClass(j).trigger(a.Event(j.replace("affix","affixed"))),"bottom"==i&&this.$element.offset({top:b-this.$element.height()-h}))}}};var d=a.fn.affix;a.fn.affix=b,a.fn.affix.Constructor=c,a.fn.affix.noConflict=function(){return a.fn.affix=d,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var c=a(this),d=c.data();d.offset=d.offset||{},d.offsetBottom&&(d.offset.bottom=d.offsetBottom),d.offsetTop&&(d.offset.top=d.offsetTop),b.call(c,d)})})}(jQuery);
/*
 Copyright 2011-2013 Abdulla Abdurakhmanov
 Original sources are available at https://code.google.com/p/x2js/

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

function X2JS(config) {
	'use strict';
		
	var VERSION = "1.1.5";
	
	config = config || {};
	initConfigDefaults();
	initRequiredPolyfills();
	
	function initConfigDefaults() {
		if(config.escapeMode === undefined) {
			config.escapeMode = true;
		}
		config.attributePrefix = config.attributePrefix || "_";
		config.arrayAccessForm = config.arrayAccessForm || "none";
		config.emptyNodeForm = config.emptyNodeForm || "text";
		if(config.enableToStringFunc === undefined) {
			config.enableToStringFunc = true; 
		}
		config.arrayAccessFormPaths = config.arrayAccessFormPaths || []; 
		if(config.skipEmptyTextNodesForObj === undefined) {
			config.skipEmptyTextNodesForObj = true;
		}
		if(config.stripWhitespaces === undefined) {
			config.stripWhitespaces = true;
		}
		config.datetimeAccessFormPaths = config.datetimeAccessFormPaths || [];
	}

	var DOMNodeTypes = {
		ELEMENT_NODE 	   : 1,
		TEXT_NODE    	   : 3,
		CDATA_SECTION_NODE : 4,
		COMMENT_NODE	   : 8,
		DOCUMENT_NODE 	   : 9
	};
	
	function initRequiredPolyfills() {
		function pad(number) {
	      var r = String(number);
	      if ( r.length === 1 ) {
	        r = '0' + r;
	      }
	      return r;
	    }
		// Hello IE8-
		if(typeof String.prototype.trim !== 'function') {			
			String.prototype.trim = function() {
				return this.replace(/^\s+|^\n+|(\s|\n)+$/g, '');
			}
		}
		if(typeof Date.prototype.toISOString !== 'function') {
			// Implementation from http://stackoverflow.com/questions/2573521/how-do-i-output-an-iso-8601-formatted-string-in-javascript
			Date.prototype.toISOString = function() {
		      return this.getUTCFullYear()
		        + '-' + pad( this.getUTCMonth() + 1 )
		        + '-' + pad( this.getUTCDate() )
		        + 'T' + pad( this.getUTCHours() )
		        + ':' + pad( this.getUTCMinutes() )
		        + ':' + pad( this.getUTCSeconds() )
		        + '.' + String( (this.getUTCMilliseconds()/1000).toFixed(3) ).slice( 2, 5 )
		        + 'Z';
		    };
		}
	}
	
	function getNodeLocalName( node ) {
		var nodeLocalName = node.localName;			
		if(nodeLocalName == null) // Yeah, this is IE!! 
			nodeLocalName = node.baseName;
		if(nodeLocalName == null || nodeLocalName=="") // =="" is IE too
			nodeLocalName = node.nodeName;
		return nodeLocalName;
	}
	
	function getNodePrefix(node) {
		return node.prefix;
	}
		
	function escapeXmlChars(str) {
		if(typeof(str) == "string")
			return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
		else
			return str;
	}

	function unescapeXmlChars(str) {
		return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#x2F;/g, '\/');
	}
	
	function toArrayAccessForm(obj, childName, path) {
		switch(config.arrayAccessForm) {
		case "property":
			if(!(obj[childName] instanceof Array))
				obj[childName+"_asArray"] = [obj[childName]];
			else
				obj[childName+"_asArray"] = obj[childName];
			break;		
		/*case "none":
			break;*/
		}
		
		if(!(obj[childName] instanceof Array) && config.arrayAccessFormPaths.length > 0) {
			var idx = 0;
			for(; idx < config.arrayAccessFormPaths.length; idx++) {
				var arrayPath = config.arrayAccessFormPaths[idx];
				if( typeof arrayPath === "string" ) {
					if(arrayPath == path)
						break;
				}
				else
				if( arrayPath instanceof RegExp) {
					if(arrayPath.test(path))
						break;
				}				
				else
				if( typeof arrayPath === "function") {
					if(arrayPath(obj, childName, path))
						break;
				}
			}
			if(idx!=config.arrayAccessFormPaths.length) {
				obj[childName] = [obj[childName]];
			}
		}
	}
	
	function fromXmlDateTime(prop) {
		// Implementation based up on http://stackoverflow.com/questions/8178598/xml-datetime-to-javascript-date-object
		// Improved to support full spec and optional parts
		var bits = prop.split(/[-T:+Z]/g);
		
		var d = new Date(bits[0], bits[1]-1, bits[2]);			
		var secondBits = bits[5].split("\.");
		d.setHours(bits[3], bits[4], secondBits[0]);
		if(secondBits.length>1)
			d.setMilliseconds(secondBits[1]);

		// Get supplied time zone offset in minutes
		if(bits[6] && bits[7]) {
			var offsetMinutes = bits[6] * 60 + Number(bits[7]);
			var sign = /\d\d-\d\d:\d\d$/.test(prop)? '-' : '+';

			// Apply the sign
			offsetMinutes = 0 + (sign == '-'? -1 * offsetMinutes : offsetMinutes);

			// Apply offset and local timezone
			d.setMinutes(d.getMinutes() - offsetMinutes - d.getTimezoneOffset())
		}
		else
			if(prop.indexOf("Z", prop.length - 1) !== -1) {
				d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()));					
			}

		// d is now a local time equivalent to the supplied time
		return d;
	}
	
	function checkFromXmlDateTimePaths(value, childName, fullPath) {
		if(config.datetimeAccessFormPaths.length > 0) {
			var path = fullPath.split("\.#")[0];
			var idx = 0;
			for(; idx < config.datetimeAccessFormPaths.length; idx++) {
				var dtPath = config.datetimeAccessFormPaths[idx];
				if( typeof dtPath === "string" ) {
					if(dtPath == path)
						break;
				}
				else
				if( dtPath instanceof RegExp) {
					if(dtPath.test(path))
						break;
				}				
				else
				if( typeof dtPath === "function") {
					if(dtPath(obj, childName, path))
						break;
				}
			}
			if(idx!=config.datetimeAccessFormPaths.length) {
				return fromXmlDateTime(value);
			}
			else
				return value;
		}
		else
			return value;
	}

	function parseDOMChildren( node, path ) {
		if(node.nodeType == DOMNodeTypes.DOCUMENT_NODE) {
			var result = new Object;
			var nodeChildren = node.childNodes;
			// Alternative for firstElementChild which is not supported in some environments
			for(var cidx=0; cidx <nodeChildren.length; cidx++) {
				var child = nodeChildren.item(cidx);
				if(child.nodeType == DOMNodeTypes.ELEMENT_NODE) {
					var childName = getNodeLocalName(child);
					result[childName] = parseDOMChildren(child, childName);
				}
			}
			return result;
		}
		else
		if(node.nodeType == DOMNodeTypes.ELEMENT_NODE) {
			var result = new Object;
			result.__cnt=0;
			
			var nodeChildren = node.childNodes;
			
			// Children nodes
			for(var cidx=0; cidx <nodeChildren.length; cidx++) {
				var child = nodeChildren.item(cidx); // nodeChildren[cidx];
				var childName = getNodeLocalName(child);
				
				if(child.nodeType!= DOMNodeTypes.COMMENT_NODE) {
					result.__cnt++;
					if(result[childName] == null) {
						result[childName] = parseDOMChildren(child, path+"."+childName);
						toArrayAccessForm(result, childName, path+"."+childName);					
					}
					else {
						if(result[childName] != null) {
							if( !(result[childName] instanceof Array)) {
								result[childName] = [result[childName]];
								toArrayAccessForm(result, childName, path+"."+childName);
							}
						}
						(result[childName])[result[childName].length] = parseDOMChildren(child, path+"."+childName);
					}
				}								
			}
			
			// Attributes
			for(var aidx=0; aidx <node.attributes.length; aidx++) {
				var attr = node.attributes.item(aidx); // [aidx];
				result.__cnt++;
				result[config.attributePrefix+attr.name]=attr.value;
			}
			
			// Node namespace prefix
			var nodePrefix = getNodePrefix(node);
			if(nodePrefix!=null && nodePrefix!="") {
				result.__cnt++;
				result.__prefix=nodePrefix;
			}
			
			if(result["#text"]!=null) {				
				result.__text = result["#text"];
				if(result.__text instanceof Array) {
					result.__text = result.__text.join("\n");
				}
				if(config.escapeMode)
					result.__text = unescapeXmlChars(result.__text);
				if(config.stripWhitespaces)
					result.__text = result.__text.trim();
				delete result["#text"];
				if(config.arrayAccessForm=="property")
					delete result["#text_asArray"];
				result.__text = checkFromXmlDateTimePaths(result.__text, childName, path+"."+childName);
			}
			if(result["#cdata-section"]!=null) {
				result.__cdata = result["#cdata-section"];
				delete result["#cdata-section"];
				if(config.arrayAccessForm=="property")
					delete result["#cdata-section_asArray"];
			}
			
			if( result.__cnt == 1 && result.__text!=null  ) {
				result = result.__text;
			}
			else
			if( result.__cnt == 0 && config.emptyNodeForm=="text" ) {
				result = '';
			}
			else
			if ( result.__cnt > 1 && result.__text!=null && config.skipEmptyTextNodesForObj) {
				if( (config.stripWhitespaces && result.__text=="") || (result.__text.trim()=="")) {
					delete result.__text;
				}
			}
			delete result.__cnt;			
			
			if( config.enableToStringFunc && (result.__text!=null || result.__cdata!=null )) {
				result.toString = function() {
					return (this.__text!=null? this.__text:'')+( this.__cdata!=null ? this.__cdata:'');
				};
			}
			
			return result;
		}
		else
		if(node.nodeType == DOMNodeTypes.TEXT_NODE || node.nodeType == DOMNodeTypes.CDATA_SECTION_NODE) {
			return node.nodeValue;
		}	
	}
	
	function startTag(jsonObj, element, attrList, closed) {
		var resultStr = "<"+ ( (jsonObj!=null && jsonObj.__prefix!=null)? (jsonObj.__prefix+":"):"") + element;
		if(attrList!=null) {
			for(var aidx = 0; aidx < attrList.length; aidx++) {
				var attrName = attrList[aidx];
				var attrVal = jsonObj[attrName];
				if(config.escapeMode)
					attrVal=escapeXmlChars(attrVal);
				resultStr+=" "+attrName.substr(config.attributePrefix.length)+"='"+attrVal+"'";
			}
		}
		if(!closed)
			resultStr+=">";
		else
			resultStr+="/>";
		return resultStr;
	}
	
	function endTag(jsonObj,elementName) {
		return "</"+ (jsonObj.__prefix!=null? (jsonObj.__prefix+":"):"")+elementName+">";
	}
	
	function endsWith(str, suffix) {
	    return str.indexOf(suffix, str.length - suffix.length) !== -1;
	}
	
	function jsonXmlSpecialElem ( jsonObj, jsonObjField ) {
		if((config.arrayAccessForm=="property" && endsWith(jsonObjField.toString(),("_asArray"))) 
				|| jsonObjField.toString().indexOf(config.attributePrefix)==0 
				|| jsonObjField.toString().indexOf("__")==0
				|| (jsonObj[jsonObjField] instanceof Function) )
			return true;
		else
			return false;
	}
	
	function jsonXmlElemCount ( jsonObj ) {
		var elementsCnt = 0;
		if(jsonObj instanceof Object ) {
			for( var it in jsonObj  ) {
				if(jsonXmlSpecialElem ( jsonObj, it) )
					continue;			
				elementsCnt++;
			}
		}
		return elementsCnt;
	}
	
	function parseJSONAttributes ( jsonObj ) {
		var attrList = [];
		if(jsonObj instanceof Object ) {
			for( var ait in jsonObj  ) {
				if(ait.toString().indexOf("__")== -1 && ait.toString().indexOf(config.attributePrefix)==0) {
					attrList.push(ait);
				}
			}
		}
		return attrList;
	}
	
	function parseJSONTextAttrs ( jsonTxtObj ) {
		var result ="";
		
		if(jsonTxtObj.__cdata!=null) {										
			result+="<![CDATA["+jsonTxtObj.__cdata+"]]>";					
		}
		
		if(jsonTxtObj.__text!=null) {			
			if(config.escapeMode)
				result+=escapeXmlChars(jsonTxtObj.__text);
			else
				result+=jsonTxtObj.__text;
		}
		return result;
	}
	
	function parseJSONTextObject ( jsonTxtObj ) {
		var result ="";

		if( jsonTxtObj instanceof Object ) {
			result+=parseJSONTextAttrs ( jsonTxtObj );
		}
		else
			if(jsonTxtObj!=null) {
				if(config.escapeMode)
					result+=escapeXmlChars(jsonTxtObj);
				else
					result+=jsonTxtObj;
			}
		
		return result;
	}
	
	function parseJSONArray ( jsonArrRoot, jsonArrObj, attrList ) {
		var result = ""; 
		if(jsonArrRoot.length == 0) {
			result+=startTag(jsonArrRoot, jsonArrObj, attrList, true);
		}
		else {
			for(var arIdx = 0; arIdx < jsonArrRoot.length; arIdx++) {
				result+=startTag(jsonArrRoot[arIdx], jsonArrObj, parseJSONAttributes(jsonArrRoot[arIdx]), false);
				result+=parseJSONObject(jsonArrRoot[arIdx]);
				result+=endTag(jsonArrRoot[arIdx],jsonArrObj);						
			}
		}
		return result;
	}
	
	function parseJSONObject ( jsonObj ) {
		var result = "";	

		var elementsCnt = jsonXmlElemCount ( jsonObj );
		
		if(elementsCnt > 0) {
			for( var it in jsonObj ) {
				
				if(jsonXmlSpecialElem ( jsonObj, it) )
					continue;			
				
				var subObj = jsonObj[it];						
				
				var attrList = parseJSONAttributes( subObj )
				
				if(subObj == null || subObj == undefined) {
					result+=startTag(subObj, it, attrList, true);
				}
				else
				if(subObj instanceof Object) {
					
					if(subObj instanceof Array) {					
						result+=parseJSONArray( subObj, it, attrList );					
					}
					else if(subObj instanceof Date) {
						result+=startTag(subObj, it, attrList, false);
						result+=subObj.toISOString();
						result+=endTag(subObj,it);
					}
					else {
						var subObjElementsCnt = jsonXmlElemCount ( subObj );
						if(subObjElementsCnt > 0 || subObj.__text!=null || subObj.__cdata!=null) {
							result+=startTag(subObj, it, attrList, false);
							result+=parseJSONObject(subObj);
							result+=endTag(subObj,it);
						}
						else {
							result+=startTag(subObj, it, attrList, true);
						}
					}
				}
				else {
					result+=startTag(subObj, it, attrList, false);
					result+=parseJSONTextObject(subObj);
					result+=endTag(subObj,it);
				}
			}
		}
		result+=parseJSONTextObject(jsonObj);
		
		return result;
	}
	
	this.parseXmlString = function(xmlDocStr) {
		var isIEParser = window.ActiveXObject || "ActiveXObject" in window;
		if (xmlDocStr === undefined) {
			return null;
		}
		var xmlDoc;
		if (window.DOMParser) {
			var parser=new window.DOMParser();			
			var parsererrorNS = null;
			// IE9+ now is here
			if(!isIEParser) {
				try {
					parsererrorNS = parser.parseFromString("INVALID", "text/xml").childNodes[0].namespaceURI;
				}
				catch(err) {					
					parsererrorNS = null;
				}
			}
			try {
				xmlDoc = parser.parseFromString( xmlDocStr, "text/xml" );
				if( parsererrorNS!= null && xmlDoc.getElementsByTagNameNS(parsererrorNS, "parsererror").length > 0) {
					//throw new Error('Error parsing XML: '+xmlDocStr);
					xmlDoc = null;
				}
			}
			catch(err) {
				xmlDoc = null;
			}
		}
		else {
			// IE :(
			if(xmlDocStr.indexOf("<?")==0) {
				xmlDocStr = xmlDocStr.substr( xmlDocStr.indexOf("?>") + 2 );
			}
			xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async="false";
			xmlDoc.loadXML(xmlDocStr);
		}
		return xmlDoc;
	};
	
	this.asArray = function(prop) {
		if(prop instanceof Array)
			return prop;
		else
			return [prop];
	};
	
	this.toXmlDateTime = function(dt) {
		if(dt instanceof Date)
			return dt.toISOString();
		else
		if(typeof(dt) === 'number' )
			return new Date(dt).toISOString();
		else	
			return null;
	};
	
	this.asDateTime = function(prop) {
		if(typeof(prop) == "string") {
			return fromXmlDateTime(prop);
		}
		else
			return prop;
	};

	this.xml2json = function (xmlDoc) {
		return parseDOMChildren ( xmlDoc );
	};
	
	this.xml_str2json = function (xmlDocStr) {
		var xmlDoc = this.parseXmlString(xmlDocStr);
		if(xmlDoc!=null)
			return this.xml2json(xmlDoc);
		else
			return null;
	};

	this.json2xml_str = function (jsonObj) {
		return parseJSONObject ( jsonObj );
	};

	this.json2xml = function (jsonObj) {
		var xmlDocStr = this.json2xml_str (jsonObj);
		return this.parseXmlString(xmlDocStr);
	};
	
	this.getVersion = function () {
		return VERSION;
	};
	
}

// device filter for device select menu
function devices_htmlSelect_filter(ZWaveAPIData,span,dev,type) {
	// return true means to skip this node
	switch(type) {
		case 'srcnode':
			// allow everything, since events can come from any device via timed_event
			return false;

			// skip virtual, controller or broadcast as event source
			//return ( (ZWaveAPIData.devices[dev].data.isVirtual.value || dev == ZWaveAPIData.controller.data.nodeId.value || dev == 255));

		case 'dstnode':
			// skip not virtual, not controller and not broadcast as event destination
			return (!(ZWaveAPIData.devices[dev].data.isVirtual.value || dev == ZWaveAPIData.controller.data.nodeId.value || dev == 255));

		case 'device':
			return ZWaveAPIData.devices[dev].data.isVirtual.value || dev == ZWaveAPIData.controller.data.nodeId.value;

		case 'node':
			// skip non-FLiRS sleeping in list of associations/wakeup node notifications/... in CC params of type node
			return (!ZWaveAPIData.devices[dev].data.isListening.value && !ZWaveAPIData.devices[dev].data.sensor250.value && !ZWaveAPIData.devices[dev].data.sensor1000.value);

		default:
			return false;
	}
};

// returns array with default values: first value from the enum, minimum value for range, empty string for string, first nodeId for node, default schedule for the climate_schedule
function method_defaultValues(ZWaveAPIData,method) {
     
	function method_defaultValue(val) {
		if ('enumof' in val['type']) {
			if (val['type']['enumof'][0])
				return method_defaultValue(val['type']['enumof'][0]); // take first item of enumof
			else
				return null;
		}
		if ('range' in val['type'])
			return val['type']['range']['min'];
		if ('fix' in val['type'])
			return val['type']['fix']['value'];
		if ('string' in val['type'])
			return "";
		if ('node' in val['type'])
			for (var dev in ZWaveAPIData.devices) {
				if (devices_htmlSelect_filter(ZWaveAPIData,null,dev,'node')) {
					continue;
				};
				return parseInt(dev);
			};
		alert('method_defaultValue: unknown type of value');
	};

	var parameters = [];
//	method.forEach(function(val,parameter_index){
//		parameters[parameter_index] = method_defaultValue(val);
//	});
        angular.forEach(method,function(val,parameter_index){
		parameters[parameter_index] = method_defaultValue(val);
	});
       
	return parameters;
};

// represent array with number, string and array elements in reversible way: use eval('[' + return_value + ']') to rever back to an array
function repr_array(arr) {
	var repr='';
	for (var indx in arr) {
		if (repr != '')
			repr += ',';
		switch (typeof(arr[indx])) {
			case 'number':
				repr += arr[indx].toString();
				break;
			case 'string':
				repr += "'" + arr[indx].replace(/'/g, "\'") + "'"; // " // just for joe to hilight syntax properly
				break;
			case 'object':
				repr += '[' + repr_array(arr[indx]) + ']';
				break;
			default:
				if (arr[indx] === null)
					repr += 'null'; // for null object
				else
					error_msg('Unknown type of parameter: ' + typeof(arr[indx]));
		}
	};

	return repr;
};

/*
	Array unique
*/
function array_unique(arr) {
	var newArray = new Array();

	label:for (var i=0; i<arr.length;i++ ) {  
		for (var j=0; j<newArray.length;j++ )
			if (newArray[j] == arr[i]) 
				continue label;
		newArray[newArray.length] = arr[i];
	}
	return newArray;
};
var _methods_specs_rendered = null;
function getMethodSpec(ZWaveAPIData,devId, instId, ccId, method) {
	if (_methods_specs_rendered === null)
        renderAllMethodSpec(ZWaveAPIData);
	
	try {
		if (!(devId in _methods_specs_rendered))
			_methods_specs_rendered[devId] = {};
		if (!(instId in _methods_specs_rendered[devId]))
			_methods_specs_rendered[devId][instId] = {};
		if (!(ccId in _methods_specs_rendered[devId][instId]))
			 _methods_specs_rendered[devId][instId][ccId] = renderMethodSpec(parseInt(ccId, 10), ZWaveAPIData.devices[devId].instances[instId].commandClasses[ccId].data);

		var methods = _methods_specs_rendered[devId][instId][ccId];
		if (method)
			return methods[method];
		else
			return methods;
	} catch(err) {
		return null;
	}
}

function renderAllMethodSpec(ZWaveAPIData) {
	_methods_specs_rendered = {};
	
	for (var devId in ZWaveAPIData.devices) {
		_methods_specs_rendered[devId] = {};
		for (var instId in ZWaveAPIData.devices[devId].instances) {
			_methods_specs_rendered[devId][instId] = {};
			for (var ccId in ZWaveAPIData.devices[devId].instances[instId].commandClasses) {
				_methods_specs_rendered[devId][instId][ccId] = renderMethodSpec(parseInt(ccId, 10), ZWaveAPIData.devices[devId].instances[instId].commandClasses[ccId].data);
			}
		}
	}
}

function renderMethodSpec(ccId, data) {
	switch (ccId) {

		// PowerLevel
		case 0x73:
			return {
				"Get": [],
				"TestNodeGet": [],



				"TestNodeSet": [
					{
						"label": "Node ID",
						"type": {
							"range": {
								"min": 0,
								"max": 232
							}
						}
					},

					{			
						"label": "PowerLevel",
						"type": {
							"enumof": [
								{
									"label": "-9dbm ", "type":{
										"fix": 	{
											"value": 9
										}
									}
								},
								{
									"label": "-8dbm ", "type":{
										"fix": 	{
											"value": 8
										}
									}
								},
								{
									"label": "-7dbm ", "type":{
										"fix": 	{
											"value": 7
										}
									}
								},
								{
									"label": "-6dbm ", "type":{
										"fix": 	{
											"value": 6
										}
									}
								},
								{
									"label": "-5dbm ", "type":{
										"fix": 	{
											"value": 5
										}
									}
								},
								{
									"label": "-4dbm ", "type":{
										"fix": 	{
											"value": 4
										}
									}
								},
								{
									"label": "-3dbm ", "type":{
										"fix": 	{
											"value": 3
										}
									}
								},
								{
									"label": "-2dbm ", "type":{
										"fix": 	{
											"value": 2
										}
									}
								},
								{
									"label": "-1dbm ", "type":{
										"fix": 	{
											"value": 1
										}
									}
								},
								{
									"label": "Normal ", "type":{
										"fix": 	{
											"value": 0
										}
									}
								}
							]
						}				
					},
					{				
						"label": "Number of pakets",
						"type": {
							"range": {
								"min": 0,
								"max": 1000
							}
						}					
					
					}
				],


				
				"Set":[
					{
						"label": "PowerLevel",
						"type": {
							"enumof": [
								{
									"label": "-9dbm ", "type":{
										"fix": 	{
											"value": 9
										}
									}
								},
								{
									"label": "-8dbm ", "type":{
										"fix": 	{
											"value": 8
										}
									}
								},
								{
									"label": "-7dbm ", "type":{
										"fix": 	{
											"value": 7
										}
									}
								},
								{
									"label": "-6dbm ", "type":{
										"fix": 	{
											"value": 6
										}
									}
								},
								{
									"label": "-5dbm ", "type":{
										"fix": 	{
											"value": 5
										}
									}
								},
								{
									"label": "-4dbm ", "type":{
										"fix": 	{
											"value": 4
										}
									}
								},
								{
									"label": "-3dbm ", "type":{
										"fix": 	{
											"value": 3
										}
									}
								},
								{
									"label": "-2dbm ", "type":{
										"fix": 	{
											"value": 2
										}
									}
								},
								{
									"label": "-1dbm ", "type":{
										"fix": 	{
											"value": 1
										}
									}
								},
								{
									"label": "Normal ", "type":{
										"fix": 	{
											"value": 0
										}
									}
								}
							]
						}
					},
					{
						"label": "Timeout (s)",
						"type": {
							"range": {
								"min": 0,
								"max": 255
							}
						}
					}
				]
			};


	
		//SwitchColor.c	 0x33	
		case 0x33:
			return {
				"Get": [
						{
						"label": "Color Capability",
						"type": {
							"enumof": [
								{
									"label": "Warm White",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "Cold White",
									"type": {
										"fix": 	{
											"value": 1
										}
									}
								},								
								{
									"label": "Red",
									"type": {
										"fix": 	{
											"value": 2
										}
									}
								},								
								{
									"label": "Green",
									"type": {
										"fix": 	{
											"value": 3
										}
									}
								},								
								{
									"label": "Blue",
									"type": {
										"fix": 	{
											"value": 4
										}
									}
								}								
							]
						}
					}				
				],
				"Set": [
					{
						"label": "Color Capability",
						"type": {
							"enumof": [
								{
									"label": "Warm White",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "Cold White",
									"type": {
										"fix": 	{
											"value": 1
										}
									}
								},								
								{
									"label": "Red",
									"type": {
										"fix": 	{
											"value": 2
										}
									}
								},								
								{
									"label": "Green",
									"type": {
										"fix": 	{
											"value": 3
										}
									}
								},								
								{
									"label": "Blue",
									"type": {
										"fix": 	{
											"value": 4
										}
									}
								}								
							]
						}
					},
					{
						"label": "Value",
						"type": {
							"range": {
								"min": 	0,
								"max": 	255
							}
						}
					}					
				],
			"StopStateChange": [
						{
						"label": "Color Capability",
						"type": {
							"enumof": [
								{
									"label": "Warm White",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "Cold White",
									"type": {
										"fix": 	{
											"value": 1
										}
									}
								},								
								{
									"label": "Red",
									"type": {
										"fix": 	{
											"value": 2
										}
									}
								},								
								{
									"label": "Green",
									"type": {
										"fix": 	{
											"value": 3
										}
									}
								},								
								{
									"label": "Blue",
									"type": {
										"fix": 	{
											"value": 4
										}
									}
								}								
							]
						}
					}								
				],
			"StartStateChange": [
						{
						"label": "Color Capability",
						"type": {
							"enumof": [
								{
									"label": "Warm White",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "Cold White",
									"type": {
										"fix": 	{
											"value": 1
										}
									}
								},								
								{
									"label": "Red",
									"type": {
										"fix": 	{
											"value": 2
										}
									}
								},								
								{
									"label": "Green",
									"type": {
										"fix": 	{
											"value": 3
										}
									}
								},								
								{
									"label": "Blue",
									"type": {
										"fix": 	{
											"value": 4
										}
									}
								}								
							]
						}
					},
					{
						"label": "Direction",
						"type": {
							"enumof": [
								{
									"label": "Up",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "Down",
									"type": {
										"fix": 	{
											"value": 1
										}
									}
								}
							]
						}
					},													
				]														
			};
 



		
// StateSetMultiple(ZWBYTE count, const ZWBYTE* capabilityIds, const ZWBYTE* states, ZWBYTE duration);
// StartLevelChange(ZWBYTE capabilityId, ZWBYTE dir, ZWBOOL ignoreStartLevel, ZWBYTE startLevel );
// StopStateChange(ZWBYTE capabilityId );
		

		// Schedule (incomplete)
		case 0x53:
			return {
				"Get": [
					{
						"label": "Id",
						"type": {
							"range": {
								"min": 	1,
								"max": 255
							}
						}
					}
				]
			};
		
		// AssociationGroupInformation
		case 0x59:
			return {
 
				"GetName": [
					{
						"label": "Group",
						"type": {
							"range": {
								"min": 	1,
								"max": 255
							}
						}
					}
				],
				"GetInfo": [
					{
						"label": "Group",
						"type": {
							"range": {
								"min": 	1,
								"max": 255
							}
						}
					}
				],
				"GetCommands": [
					{
						"label": "Group",
						"type": {
							"range": {
								"min": 	1,
								"max": 255
							}
						}
					}
				]
			};

		// ZWavePlusInfo
		case 0x5e:
			return {
				"Get": []
			};
		
		case 0x85:
			return {
				"GroupingsGet": [],
				"Get": [
					{
						"label": "Group",
						"type": {
							"range": {
								"min": 	1,
								"max": 255
							}
						}
					}
				],
				"Set": [
					{
						"label": "Group",
						"type": {
							"range": {
								"min": 	1,
								"max": 255
							}
						}
					},
					{
						"label": "Node",
						"type": {
							"node": {
							}
						}
					}
				],
				"Remove": [
					{
						"label": "Group",
						"type": {
							"range": {
								"min": 	1,
								"max": 255
							}
						}
					},
					{
						"label": "Node",
						"type": {
							"range": {
								"min": 	1,
								"max": 255
							}
						}
					}
				]
			};
	
		// Version
		case 0x86:
			return {
				/*
				Version is not publically exported in Z-Way.C

				"CommandClassVersionGet": [
					{
						"label":"CommandClass",
						"type":	{
							"range":	{
								"min":	0x0001,
								"max":	0xFFFF
							}
						}
					}
				]
				*/
			};

		// UserCode
		case 0x63:
			return {
				"Get": [
					{
						"label": "User",
						"type":	{
							"range": {
								"min": 	0,
								"max": 	99
							}
						}
					}
				],
				"Set": [
					{
						"label": "User",
						"type": {
							"enumof": [
								{
									"label": "All usercodes",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "Id",
									"type": {
										"range": {
											"min": 	1,
											"max": 	99
										}
									}
								}
							]
						}
					},
					{
						"label": "Code (4...10 Digits)",
						"type": {
							"string": {
							}
						}
					},
					{
						"label": "Mode",
						"type": {
							"enumof": [
								{
									"label": "Not Set",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "Set",
									"type": {
										"fix": 	{
											"value": 1
										}
									}
								},
								{
									"label": "Reserved",
									"type": {
										"fix": 	{
											"value": 2
										}
									}
								}
							]
						}
					}
				]
			};
			
		// Time Parameters
		case 0x8B:
			return {
				"Get": [],
				"Set": []
			};
			
		// Thermostat SetPoint
		case 0x43:
			return {
				"Get": [
				       {
						"label": "Type",
						"type": {
							"enumof": (
									function() {
										try {
											var arr = [];
											var key;
											for (key in data) {
												var ikey = parseInt(key);
												if (!isNaN(ikey))
													arr.push({
														"label": data[ikey].modeName.value,
														"type": {
															"fix": 	{
																"value": ikey
															}
														}
													});
											};
											return arr;
										} catch(err) {}
										return [];
									}
								)()
						}
					}
				],
				"Set": [
				       {
						"label": "Type",
						"type": {
							"enumof": (
									function() {
										try {
											var arr = [];
											var key;
											for (key in data) {
												var ikey = parseInt(key);
												if (!isNaN(ikey))
													arr.push({
														"label": data[ikey].modeName.value,
														"type": {
															"fix": 	{
																"value": ikey
															}
														}
													});
											};
											return arr;
										} catch(err) {}
										return [];
									}
								)()
						}
					},
					{
						"label": "Value",
						"type": {
							"range": {
								"min": 	0,
								"max": 	100
							}
						}
					}
				]
			};

		// Wakeup	
		case 0x84:
			return {
				"Get": [],
				"CapabilitiesGet": [],
				"Set": [
				       {
						"label": "Wakeup time, seconds",
						"type": {
							"range": {
								"min": 	(
									function() {
										try {
											if (data.version.value >= 2 && data.min.value !== null)
												return data.min.value;
										} catch(err) {}
										return 0;
									}
									)(),
								"max": 	(
									function() {
										try {
											if (data.version.value >= 2 && data.max.value !== null)
												return data.max.value;
										} catch(err) {}
										return 256 * 256 * 256 - 1;
									}
									)()
							}
						}
					},
					{
						"label": "to Node",
						"type": {
							"node": {}
						}
					}
				],
				"Sleep": []
			};

		// Time
		case 0x8A:
			return {
				"TimeGet": [],
				"DateGet": []
			};

		// ThermostatMode
		case 0x40:
			return {
				"Get": [],
				"Set": [
					{
						"label": "Type",
						"type": {
							"enumof": (
									function() {
										try {
											var arr = [];
											var key;
											for (key in data) {
												var ikey = parseInt(key);
												if (!isNaN(ikey))
													arr.push({
														"label": data[ikey].modeName.value,
														"type": {
															"fix": 	{
																"value": ikey
															}
														}
													});
											};
											return arr;
										} catch(err) {}
										return [];
									}
								)()
						}
					}
				]
			};

		// ThermostatFanMode
		case 0x44:
			return {
				"Get": [],
				"Set": [
					{
						"label": "Level",
						"type": {
							"enumof": [
								{
									"label": "Off",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "On",
									"type": {
										"fix": 	{
											"value": 1
										}
									}
								}
							]
						}
					},
					{
						"label": "Type",
						"type": {
							"enumof": (
									function() {
										try {
											var arr = [];
											var key;
											for (key in data) {
												var ikey = parseInt(key);
												if (!isNaN(ikey))
													arr.push({
														"label": data[ikey].modeName.value,
														"type": {
															"fix": 	{
																"value": ikey
															}
														}
													});
											};
											return arr;
										} catch(err) {}
										return [];
									}
								)()
						}
					}
				]
			};

		// ThermostatFanState
		case 0x45: 
			return {
				"Get": []
			};

		// ThermostatOperatingState
		case 0x42:
			return {
				"Get": [],
				"LoggingGet" : [
					{
						"label": "States (bitmask)",
						"type": {
							"range": {
								"min": 1,
								"max": 99
							}
						}
					}
				]
			};

		// SwitchMultilevel
		case 0x26:
			return {
				"Get": [],
				"Set": [
					{
						"label": "Dimmer level",
						"type": {
							"enumof": [
								{
									"label": "Off",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "%",
									"type": {
										"range": {
											"min": 0,
											"max": 99
										}
									}
								},
								{
									"label": "Full",
									"type": {
										"fix": 	{
											"value": 99
										}
									}
								},
								{
									"label": "On",
									"type": {
										"fix": 	{
											"value": 255
										}
									}
								}
							]
						}
					}
				],
				"StartLevelChange": [
				       {
						"label": "Direction",
						"type": {
							"enumof": [
								{
									"label": "Up",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "Down",
									"type": {
										"fix": 	{
											"value": 1
										}
									}
								}
							]
						}
					},
				],
				"StopLevelChange": [],
				"SetWithDuration": [
					{
						"label": "Dimmer level",
						"type": {
							"enumof": [
								{
									"label": "Off",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "%",
									"type": {
										"range": {
											"min": 0,
											"max": 99
										}
									}
								},
								{
									"label": "Full",
									"type": {
										"fix": 	{
											"value": 99
										}
									}
								},
								{
									"label": "On",
									"type": {
										"fix": 	{
											"value": 255
										}
									}
								}
							]
						}
					},
					{
						"label": "Duration",
						"type": {
							"enumof": [
								{
									"label": "immediately",
									"type": {
									"fix": 	{
										"value": 0
										}
									}
								},
									{
									"label": "in seconds",
									"type": {
										"range": {
											"min": 	1,
											"max": 127
										}
									}
								},
									{
									"label": "in minutes",
									"type": {
										"range": {
											"min": 	1,
											"max": 127,
											"shift": 127
										}
									}
								},
								{
									"label": "use device default",
									"type": {
										"fix": 	{
											"value": 255
										}
									}
								}
							]
						}
					}
				],
				"StartLevelChangeWithDurationV2": [
					{
						"label": "Direction",
						"type": {
							"enumof": [
								{
									"label": "Up",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "Down",
									"type": {
										"fix": 	{
											"value": 1
										}
									}
								}
							]
						}
					},
					{
						"label": "Duration",
						"type": {
							"enumof": [
								{
									"label": "immediately",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "in seconds",
									"type": {
										"range": {
											"min": 	1,
											"max": 127
										}
									}
								},
								{
									"label": "in minutes",
									"type": {
										"range": {
											"min": 	1,
											"max": 127,
										"shift": 	127
										}
									}
								},
								{
									"label": "use device default",
									"type": {
										"fix": 	{
											"value": 255
										}
									}
								}
							]
						}
					}
				],
				"SetMotorA": [
					{
						"label": "Status",
						"type": {
							"enumof": [
								{
									"label": "Close",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "Open",
									"type": {
										"fix": 	{
											"value": 255
										}
									}
								}
							]
						}
					}
				],
				"StartLevelChangeMotorA": [
					{
						"label": "Start Move",
						"type": {
							"enumof": [
								{
									"label": "Up",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "Down",
									"type": {
										"fix": 	{
											"value": 1
										}
									}
								}
							]
						}
					}
				],
				"StopLevelChangeMotorA": [],
				"SetMotorB": [
					{
						"label": "Blind Position",
						"type": {
							"enumof": [
								{
									"label": "Close",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "%",
									"type": {
										"range": {
											"min": 0,
											"max": 99
										}
									}
								},
								{
									"label": "Open",
									"type": {
										"fix": 	{
											"value": 255
										}
									}
								},
								]
						}
					}
				],
				"StartLevelChangeMotorB": [
					{
						"label": "Start Move",
						"type": {
							"enumof": [
								{
									"label": "Up",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "Down",
									"type": {
										"fix": 	{
											"value": 1
										}
									}
								}
							]
						}
					}
				],
				"StopLevelChange": []
			};

		// SwtichBinary
		case 0x25:
			return {
				"Get": [],
				"Set": [
					{
						"label": "Level",
						"type": {
							"enumof": [
								{
									"label": "Off",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "On",
									"type": {
										"fix": 	{
											"value": 255
										}
									}
								}
							]
						}
					}
				]
			};

		// SimpleAV
		case 0x94:
			return {
				"SetEmpty": [
					{
						"label": "Key attribute",
						"type": {
							"enumof": [
								{
									"label": "Key Down",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "Key Up",
									"type": {
										"fix": 	{
											"value": 1
										}
									}
								},
								{
									"label": "Key Alive",
									"type": {
										"fix": 	{
											"value": 2
										}
									}
								},
								]
						}
					},
					{
						"label": "Media item",
						"type": {
							"enumof": [
								{
									"label": "No",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "ID",
									"type": {
										"range": {
											"min": 0,
											"max": 0
										}
									}
								},
								]
						}
					},
					{
						"label": "Button",
						"type": {
							"enumof": []
						}
					},
				],
				"SetFull": [
					{
						"label": "Mute",
						"type": {
							"fix": 	{
								"value": 0x0001
							}
						}
					},
					{
						"label": "Volume down",
						"type": {
							"fix": 	{
								"value": 0x0002
							}
						}
					},
					{
						"label": "Volume up",
						"type": {
							"fix": 	{
								"value": 0x0003
									}
								}
							},
							{
						"label": "Channel up",
						"type": {
							"fix": 	{
								"value": 0x0004
							}
						}
					},
					{
						"label": "Channel down",
						"type": {
							"fix": 	{
								"value": 0x0005
							}
						}
					},
					{
						"label": "0",
						"type": {
							"fix": 	{
								"value": 0x0006
							}
						}
					},
					{
						"label": "1",
						"type": {
							"fix": 	{
								"value": 0x0007
							}
						}
					},
					{
						"label": "2",
						"type": {
							"fix": 	{
								"value": 0x0008
							}
						}
					},
					{
						"label": "3",
						"type": {
							"fix": 	{
								"value": 0x0009
							}
						}
					},
					{
						"label": "4",
						"type": {
							"fix": 	{
								"value": 0x000A
							}
						}
					},
					{
						"label": "5",
						"type": {
							"fix": 	{
								"value": 0x000B
							}
						}
					},
					{
						"label": "6",
						"type": {
							"fix": 	{
								"value": 0x000C
							}
						}
					},
					{
						"label": "7",
						"type": {
							"fix": 	{
								"value": 0x000D
							}
						}
					},
					{
						"label": "8",
						"type": {
							"fix": 	{
								"value": 0x000E
							}
						}
					},
					{
						"label": "9",
						"type": {
							"fix": 	{
								"value": 0x000F
							}
						}
					},
					{
						"label": "Last channel",
						"type": {
							"fix": 	{
								"value": 0x0010
							}
						}
					},
					{
						"label": "Display",
						"type": {
							"fix": 	{
								"value": 0x0011
							}
						}
					},
					{
						"label": "Favorite channel",
						"type": {
							"fix": 	{
								"value": 0x0012
							}
						}
					},
					{
						"label": "Play",
						"type": {
							"fix": 	{
								"value": 0x0013
							}
						}
					},
					{
						"label": "Stop",
						"type": {
							"fix": 	{
								"value": 0x0014
							}
						}
					},
					{
						"label": "Pause",
						"type": {
							"fix": 	{
								"value": 0x0015
							}
						}
					},
					{
						"label": "Fast forward",
						"type": {
							"fix": 	{
								"value": 0x0016
							}
						}
					},
					{
						"label": "Rewind",
						"type": {
							"fix": 	{
								"value": 0x0017
							}
						}
					},
					{
						"label": "Instant replay",
						"type": {
							"fix": 	{
								"value": 0x0018
							}
						}
					},
					{
						"label": "Record",
						"type": {
							"fix": 	{
								"value": 0x0019
							}
						}
					},
					{
						"label": "AC3",
						"type": {
							"fix": 	{
								"value": 0x001A
							}
						}
					},
					{
						"label": "PVR menu",
						"type": {
							"fix": 	{
								"value": 0x001B
							}
						}
					},
					{
						"label": "Guide",
						"type": {
							"fix": 	{
								"value": 0x001C
							}
						}
					},
					{
						"label": "Menu",
						"type": {
							"fix": 	{
								"value": 0x001D
							}
						}
					},
					{
						"label": "Menu up",
						"type": {
							"fix": 	{
								"value": 0x001E
							}
						}
					},
					{
						"label": "Menu down",
						"type": {
							"fix": 	{
								"value": 0x001F
							}
						}
					},
					{
						"label": "Menu left",
						"type": {
							"fix": 	{
								"value": 0x0020
							}
						}
					},
					{
						"label": "Menu right",
						"type": {
							"fix": 	{
								"value": 0x0021
							}
						}
					},
					{
						"label": "Page up",
						"type": {
							"fix": 	{
								"value": 0x0022
							}
						}
					},
					{
						"label": "Page down",
						"type": {
							"fix": 	{
								"value": 0x0023
							}
						}
					},
					{
						"label": "Select",
						"type": {
							"fix": 	{
								"value": 0x0024
							}
						}
					},
					{
						"label": "Exit",
						"type": {
							"fix": 	{
								"value": 0x0025
							}
						}
					},
					{
						"label": "Input",
						"type": {
							"fix": 	{
								"value": 0x0026
							}
						}
					},
					{
						"label": "Power",
						"type": {
							"fix": 	{
								"value": 0x0027
							}
						}
					},
					{
						"label": "Enter channel",
						"type": {
							"fix": 	{
								"value": 0x0028
							}
						}
					},
					{
						"label": "10",
						"type": {
							"fix": 	{
								"value": 0x0029
							}
						}
					},
					{
						"label": "11",
						"type": {
							"fix": 	{
								"value": 0x002A
							}
						}
					},
					{
						"label": "12",
						"type": {
							"fix": 	{
								"value": 0x002B
							}
						}
					},
					{
						"label": "13",
						"type": {
							"fix": 	{
								"value": 0x002C
							}
						}
					},
					{
						"label": "14",
						"type": {
							"fix": 	{
								"value": 0x002D
							}
						}
					},
					{
						"label": "15",
						"type": {
							"fix": 	{
								"value": 0x002E
							}
						}
					},
					{
						"label": "16",
						"type": {
							"fix": 	{
								"value": 0x002F
							}
						}
					},
					{
						"label": "+10",
						"type": {
							"fix": 	{
								"value": 0x0030
							}
						}
					},
					{
						"label": "+20",
						"type": {
							"fix": 	{
								"value": 0x0031
							}
						}
					},
					{
						"label": "+100",
						"type": {
							"fix": 	{
								"value": 0x0032
							}
						}
					},
					{
						"label": "-/--",
						"type": {
							"fix": 	{
								"value": 0x0033
							}
						}
					},
					{
						"label": "3-CH",
						"type": {
							"fix": 	{
								"value": 0x0034
							}
						}
					},
					{
						"label": "3D",
						"type": {
							"fix": 	{
								"value": 0x0035
							}
						}
					},
					{
						"label": "6-CH input",
						"type": {
							"fix": 	{
								"value": 0x0036
							}
						}
					},
					{
						"label": "A",
						"type": {
							"fix": 	{
								"value": 0x0037
							}
						}
					},
					{
						"label": "Add",
						"type": {
							"fix": 	{
								"value": 0x0038
							}
						}
					},
					{
						"label": "Alarm",
						"type": {
							"fix": 	{
								"value": 0x0039
							}
						}
					},
					{
						"label": "AM",
						"type": {
							"fix": 	{
								"value": 0x003A
							}
						}
					},
					{
						"label": "Analog",
						"type": {
							"fix": 	{
								"value": 0x003B
							}
						}
					},
					{
						"label": "Angle",
						"type": {
							"fix": 	{
								"value": 0x003C
							}
						}
					},
					{
						"label": "Antenna",
						"type": {
							"fix": 	{
								"value": 0x003D
							}
						}
					},
					{
						"label": "Antenna east",
						"type": {
							"fix": 	{
								"value": 0x003E
							}
						}
					},
					{
						"label": "Antenna west",
						"type": {
							"fix": 	{
								"value": 0x003F
							}
						}
					},
					{
						"label": "Aspect",
						"type": {
							"fix": 	{
								"value": 0x0040
							}
						}
					},
					{
						"label": "Audio 1",
						"type": {
							"fix": 	{
								"value": 0x0041
							}
						}
					},
					{
						"label": "Audio 2",
						"type": {
							"fix": 	{
								"value": 0x0042
							}
						}
					},
					{
						"label": "Audio 3",
						"type": {
							"fix": 	{
								"value": 0x0043
							}
						}
					},
					{
						"label": "Audio dubbing",
						"type": {
							"fix": 	{
								"value": 0x0044
							}
						}
					},
					{
						"label": "Audio level down",
						"type": {
							"fix": 	{
								"value": 0x0045
							}
						}
					},
					{
						"label": "Audio level up",
						"type": {
							"fix": 	{
								"value": 0x0046
							}
						}
					},
					{
						"label": "Auto/Manual",
						"type": {
							"fix": 	{
								"value": 0x0047
							}
						}
					},
					{
						"label": "Aux 1",
						"type": {
							"fix": 	{
								"value": 0x0048
							}
						}
					},
					{
						"label": "Aux 2",
						"type": {
							"fix": 	{
								"value": 0x0049
							}
						}
					},
					{
						"label": "B",
						"type": {
							"fix": 	{
								"value": 0x004A
							}
						}
					},
					{
						"label": "Back",
						"type": {
							"fix": 	{
								"value": 0x004B
							}
						}
					},
					{
						"label": "Background",
						"type": {
							"fix": 	{
								"value": 0x004C
							}
						}
					},
					{
						"label": "Balance",
						"type": {
							"fix": 	{
								"value": 0x004D
							}
						}
					},
					{
						"label": "Balance left",
						"type": {
							"fix": 	{
								"value": 0x004E
							}
						}
					},
					{
						"label": "Balance right",
						"type": {
							"fix": 	{
								"value": 0x004F
							}
						}
					},
					{
						"label": "Band",
						"type": {
							"fix": 	{
								"value": 0x0050
							}
						}
					},
					{
						"label": "Bandwidth",
						"type": {
							"fix": 	{
								"value": 0x0051
							}
						}
					},
					{
						"label": "Bass",
						"type": {
							"fix": 	{
								"value": 0x0052
							}
						}
					},
					{
						"label": "Bass down",
						"type": {
							"fix": 	{
								"value": 0x0053
							}
						}
					},
					{
						"label": "Bass up",
						"type": {
							"fix": 	{
								"value": 0x0054
							}
						}
					},
					{
						"label": "Blank",
						"type": {
							"fix": 	{
								"value": 0x0055
							}
						}
					},
					{
						"label": "Breeze mode",
						"type": {
							"fix": 	{
								"value": 0x0056
							}
						}
					},
					{
						"label": "Bright",
						"type": {
							"fix": 	{
								"value": 0x0057
							}
						}
					},
					{
						"label": "Brightness",
						"type": {
							"fix": 	{
								"value": 0x0058
							}
						}
					},
					{
						"label": "Brightness down",
						"type": {
							"fix": 	{
								"value": 0x0059
							}
						}
					},
					{
						"label": "Brightness up",
						"type": {
							"fix": 	{
								"value": 0x005A
							}
						}
					},
					{
						"label": "Buy",
						"type": {
							"fix": 	{
								"value": 0x005B
							}
						}
					},
					{
						"label": "C",
						"type": {
							"fix": 	{
								"value": 0x005C
							}
						}
					},
					{
						"label": "Camera",
						"type": {
							"fix": 	{
								"value": 0x005D
							}
						}
					},
					{
						"label": "Category down",
						"type": {
							"fix": 	{
								"value": 0x005E
							}
						}
					},
					{
						"label": "Category up",
						"type": {
							"fix": 	{
								"value": 0x005F
							}
						}
					},
					{
						"label": "Center",
						"type": {
							"fix": 	{
								"value": 0x0060
							}
						}
					},
					{
						"label": "Center down",
						"type": {
							"fix": 	{
								"value": 0x0061
							}
						}
					},
					{
						"label": "Center mode",
						"type": {
							"fix": 	{
								"value": 0x0062
							}
						}
					},
					{
						"label": "Center up",
						"type": {
							"fix": 	{
								"value": 0x0063
							}
						}
					},
					{
						"label": "Channel/Program",
						"type": {
							"fix": 	{
								"value": 0x0064
							}
						}
					},
					{
						"label": "Clear",
						"type": {
							"fix": 	{
								"value": 0x0065
							}
						}
					},
					{
						"label": "Close",
						"type": {
							"fix": 	{
								"value": 0x0066
							}
						}
					},
					{
						"label": "Closed caption",
						"type": {
							"fix": 	{
								"value": 0x0067
							}
						}
					},
					{
						"label": "Cold",
						"type": {
							"fix": 	{
								"value": 0x0068
							}
						}
					},
					{
						"label": "Color",
						"type": {
							"fix": 	{
								"value": 0x0069
							}
						}
					},
					{
						"label": "Color down",
						"type": {
							"fix": 	{
								"value": 0x006A
							}
						}
					},
					{
						"label": "Color up",
						"type": {
							"fix": 	{
								"value": 0x006B
							}
						}
					},
					{
						"label": "Component 1",
						"type": {
							"fix": 	{
								"value": 0x006C
							}
						}
					},
					{
						"label": "Component 2",
						"type": {
							"fix": 	{
								"value": 0x006D
							}
						}
					},
					{
						"label": "Component 3",
						"type": {
							"fix": 	{
								"value": 0x006E
							}
						}
					},
					{
						"label": "Concert",
						"type": {
							"fix": 	{
								"value": 0x006F
							}
						}
					},
					{
						"label": "Confirm",
						"type": {
							"fix": 	{
								"value": 0x0070
							}
						}
					},
					{
						"label": "Continue",
						"type": {
							"fix": 	{
								"value": 0x0071
							}
						}
					},
					{
						"label": "Contrast",
						"type": {
							"fix": 	{
								"value": 0x0072
							}
						}
					},
					{
						"label": "Contrast down",
						"type": {
							"fix": 	{
								"value": 0x0073
							}
						}
					},
					{
						"label": "Contrast up",
						"type": {
							"fix": 	{
								"value": 0x0074
							}
						}
					},
					{
						"label": "Counter",
						"type": {
							"fix": 	{
								"value": 0x0075
							}
						}
					},
					{
						"label": "Counter reset",
						"type": {
							"fix": 	{
								"value": 0x0076
							}
						}
					},
					{
						"label": "D",
						"type": {
							"fix": 	{
								"value": 0x0077
							}
						}
					},
					{
						"label": "Day down",
						"type": {
							"fix": 	{
								"value": 0x0078
							}
						}
					},
					{
						"label": "Day up",
						"type": {
							"fix": 	{
								"value": 0x0079
							}
						}
					},
					{
						"label": "Delay",
						"type": {
							"fix": 	{
								"value": 0x007A
							}
						}
					},
					{
						"label": "Delay down",
						"type": {
							"fix": 	{
								"value": 0x007B
							}
						}
					},
					{
						"label": "Delay up",
						"type": {
							"fix": 	{
								"value": 0x007C
							}
						}
					},
					{
						"label": "Delete",
						"type": {
							"fix": 	{
								"value": 0x007D
							}
						}
					},
					{
						"label": "Delimiter",
						"type": {
							"fix": 	{
								"value": 0x007E
							}
						}
					},
					{
						"label": "Digest",
						"type": {
							"fix": 	{
								"value": 0x007F
							}
						}
					},
					{
						"label": "Digital",
						"type": {
							"fix": 	{
								"value": 0x0080
							}
						}
					},
					{
						"label": "Dim",
						"type": {
							"fix": 	{
								"value": 0x0081
							}
						}
					},
					{
						"label": "Direct",
						"type": {
							"fix": 	{
								"value": 0x0082
							}
						}
					},
					{
						"label": "Disarm",
						"type": {
							"fix": 	{
								"value": 0x0083
							}
						}
					},
					{
						"label": "Disc",
						"type": {
							"fix": 	{
								"value": 0x0084
							}
						}
					},
					{
						"label": "Disc 1",
						"type": {
							"fix": 	{
								"value": 0x0085
							}
						}
					},
					{
						"label": "Disc 2",
						"type": {
							"fix": 	{
								"value": 0x0086
							}
						}
					},
					{
						"label": "Disc 3",
						"type": {
							"fix": 	{
								"value": 0x0087
							}
						}
					},
					{
						"label": "Disc 4",
						"type": {
							"fix": 	{
								"value": 0x0088
							}
						}
					},
					{
						"label": "Disc 5",
						"type": {
							"fix": 	{
								"value": 0x0089
							}
						}
					},
					{
						"label": "Disc 6",
						"type": {
							"fix": 	{
								"value": 0x008A
							}
						}
					},
					{
						"label": "Disc down",
						"type": {
							"fix": 	{
								"value": 0x008B
							}
						}
					},
					{
						"label": "Disc up",
						"type": {
							"fix": 	{
								"value": 0x008C
							}
						}
					},
					{
						"label": "Disco",
						"type": {
							"fix": 	{
								"value": 0x008D
							}
						}
					},
					{
						"label": "Edit",
						"type": {
							"fix": 	{
								"value": 0x008E
							}
						}
					},
					{
						"label": "Effect down",
						"type": {
							"fix": 	{
								"value": 0x008F
							}
						}
					},
					{
						"label": "Effect up",
						"type": {
							"fix": 	{
								"value": 0x0090
							}
						}
					},
					{
						"label": "Eject",
						"type": {
							"fix": 	{
								"value": 0x0091
							}
						}
					},
					{
						"label": "End",
						"type": {
							"fix": 	{
								"value": 0x0092
							}
						}
					},
					{
						"label": "EQ",
						"type": {
							"fix": 	{
								"value": 0x0093
							}
						}
					},
					{
						"label": "Fader",
						"type": {
							"fix": 	{
								"value": 0x0094
							}
						}
					},
					{
						"label": "Fan",
						"type": {
							"fix": 	{
								"value": 0x0095
							}
						}
					},
					{
						"label": "Fan high",
						"type": {
							"fix": 	{
								"value": 0x0096
							}
						}
					},
					{
						"label": "Fan low",
						"type": {
							"fix": 	{
								"value": 0x0097
							}
						}
					},
					{
						"label": "Fan medium",
						"type": {
							"fix": 	{
								"value": 0x0098
							}
						}
					},
					{
						"label": "Fan speed",
						"type": {
							"fix": 	{
								"value": 0x0099
							}
						}
					},
					{
						"label": "Fastext blue",
						"type": {
							"fix": 	{
								"value": 0x009A
							}
						}
					},
					{
						"label": "Fastext green",
						"type": {
							"fix": 	{
								"value": 0x009B
							}
						}
					},
					{
						"label": "Fastext purple",
						"type": {
							"fix": 	{
								"value": 0x009C
							}
						}
					},
					{
						"label": "Fastext red",
						"type": {
							"fix": 	{
								"value": 0x009D
							}
						}
					},
					{
						"label": "Fastext white",
						"type": {
							"fix": 	{
								"value": 0x009E
							}
						}
					},
					{
						"label": "Fastext yellow",
						"type": {
							"fix": 	{
								"value": 0x009F
							}
						}
					},
					{
						"label": "Favorite channel down",
						"type": {
							"fix": 	{
								"value": 0x00A0
							}
						}
					},
					{
						"label": "Favorite channel up",
						"type": {
							"fix": 	{
								"value": 0x00A1
							}
						}
					},
					{
						"label": "Finalize",
						"type": {
							"fix": 	{
								"value": 0x00A2
							}
						}
					},
					{
						"label": "Fine tune",
						"type": {
							"fix": 	{
								"value": 0x00A3
							}
						}
					},
					{
						"label": "Flat",
						"type": {
							"fix": 	{
								"value": 0x00A4
							}
						}
					},
					{
						"label": "FM",
						"type": {
							"fix": 	{
								"value": 0x00A5
							}
						}
					},
					{
						"label": "Focus down",
						"type": {
							"fix": 	{
								"value": 0x00A6
							}
						}
					},
					{
						"label": "Focus up",
						"type": {
							"fix": 	{
								"value": 0x00A7
							}
						}
					},
					{
						"label": "Freeze",
						"type": {
							"fix": 	{
								"value": 0x00A8
							}
						}
					},
					{
						"label": "Front",
						"type": {
							"fix": 	{
								"value": 0x00A9
							}
						}
					},
					{
						"label": "Game",
						"type": {
							"fix": 	{
								"value": 0x00AA
							}
						}
					},
					{
						"label": "GoTo",
						"type": {
							"fix": 	{
								"value": 0x00AB
							}
						}
					},
					{
						"label": "Hall",
						"type": {
							"fix": 	{
								"value": 0x00AC
							}
						}
					},
					{
						"label": "Heat",
						"type": {
							"fix": 	{
								"value": 0x00AD
							}
						}
					},
					{
						"label": "Help",
						"type": {
							"fix": 	{
								"value": 0x00AE
							}
						}
					},
					{
						"label": "Home",
						"type": {
							"fix": 	{
								"value": 0x00AF
							}
						}
					},
					{
						"label": "Index",
						"type": {
							"fix": 	{
								"value": 0x00B0
							}
						}
					},
					{
						"label": "Index forward",
						"type": {
							"fix": 	{
								"value": 0x00B1
							}
						}
					},
					{
						"label": "Index reverse",
						"type": {
							"fix": 	{
								"value": 0x00B2
							}
						}
					},
					{
						"label": "Interactive",
						"type": {
							"fix": 	{
								"value": 0x00B3
							}
						}
					},
					{
						"label": "Intro scan",
						"type": {
							"fix": 	{
								"value": 0x00B4
							}
						}
					},
					{
						"label": "Jazz",
						"type": {
							"fix": 	{
								"value": 0x00B5
							}
						}
					},
					{
						"label": "Karaoke",
						"type": {
							"fix": 	{
								"value": 0x00B6
							}
						}
					},
					{
						"label": "Keystone",
						"type": {
							"fix": 	{
								"value": 0x00B7
							}
						}
					},
					{
						"label": "Keystone down",
						"type": {
							"fix": 	{
								"value": 0x00B8
							}
						}
					},
					{
						"label": "Keystone up",
						"type": {
							"fix": 	{
								"value": 0x00B9
							}
						}
					},
					{
						"label": "Language",
						"type": {
							"fix": 	{
								"value": 0x00BA
							}
						}
					},
					{
						"label": "Left click",
						"type": {
							"fix": 	{
								"value": 0x00BB
							}
						}
					},
					{
						"label": "Level",
						"type": {
							"fix": 	{
								"value": 0x00BC
							}
						}
					},
					{
						"label": "Light",
						"type": {
							"fix": 	{
								"value": 0x00BD
							}
						}
					},
					{
						"label": "List",
						"type": {
							"fix": 	{
								"value": 0x00BE
							}
						}
					},
					{
						"label": "Live TV",
						"type": {
							"fix": 	{
								"value": 0x00BF
							}
						}
					},
					{
						"label": "Local/Dx",
						"type": {
							"fix": 	{
								"value": 0x00C0
							}
						}
					},
					{
						"label": "Loudness",
						"type": {
							"fix": 	{
								"value": 0x00C1
							}
						}
					},
					{
						"label": "Mail",
						"type": {
							"fix": 	{
								"value": 0x00C2
							}
						}
					},
					{
						"label": "Mark",
						"type": {
							"fix": 	{
								"value": 0x00C3
							}
						}
					},
					{
						"label": "Memory recall",
						"type": {
							"fix": 	{
								"value": 0x00C4
							}
						}
					},
					{
						"label": "Monitor",
						"type": {
							"fix": 	{
								"value": 0x00C5
							}
						}
					},
					{
						"label": "Movie",
						"type": {
							"fix": 	{
								"value": 0x00C6
							}
						}
					},
					{
						"label": "Multi room",
						"type": {
							"fix": 	{
								"value": 0x00C7
							}
						}
					},
					{
						"label": "Music",
						"type": {
							"fix": 	{
								"value": 0x00C8
							}
						}
					},
					{
						"label": "Music scan",
						"type": {
							"fix": 	{
								"value": 0x00C9
							}
						}
					},
					{
						"label": "Natural",
						"type": {
							"fix": 	{
								"value": 0x00CA
							}
						}
					},
					{
						"label": "Night",
						"type": {
							"fix": 	{
								"value": 0x00CB
							}
						}
					},
					{
						"label": "Noise reduction",
						"type": {
							"fix": 	{
								"value": 0x00CC
							}
						}
					},
					{
						"label": "Normalize",
						"type": {
							"fix": 	{
								"value": 0x00CD
							}
						}
					},
					{
						"label": "Discrete input CableTV",
						"type": {
							"fix": 	{
								"value": 0x00CE
							}
						}
					},
					{
						"label": "Discrete input CD 1",
						"type": {
							"fix": 	{
								"value": 0x00CF
							}
						}
					},
					{
						"label": "Discrete input CD 2",
						"type": {
							"fix": 	{
								"value": 0x00D0
							}
						}
					},
					{
						"label": "Discrete input CD Recorder",
						"type": {
							"fix": 	{
								"value": 0x00D1
							}
						}
					},
					{
						"label": "Discrete input DAT (Digital Audio Tape)",
						"type": {
							"fix": 	{
								"value": 0x00D2
							}
						}
					},
					{
						"label": "Discrete input DVD",
						"type": {
							"fix": 	{
								"value": 0x00D3
							}
						}
					},
					{
						"label": "Discrete input DVI",
						"type": {
							"fix": 	{
								"value": 0x00D4
							}
						}
					},
					{
						"label": "Discrete input HDTV",
						"type": {
							"fix": 	{
								"value": 0x00D5
							}
						}
					},
					{
						"label": "Discrete input LaserDisc",
						"type": {
							"fix": 	{
								"value": 0x00D6
							}
						}
					},
					{
						"label": "Discrete input MiniDisc",
						"type": {
							"fix": 	{
								"value": 0x00D7
							}
						}
					},
					{
						"label": "Discrete input PC",
						"type": {
							"fix": 	{
								"value": 0x00D8
							}
						}
					},
					{
						"label": "Discrete input Personal Video Recorder",
						"type": {
							"fix": 	{
								"value": 0x00D9
							}
						}
					},
					{
						"label": "Discrete input TV",
						"type": {
							"fix": 	{
								"value": 0x00DA
							}
						}
					},
					{
						"label": "Discrete input TV/VCR or TV/DVD",
						"type": {
							"fix": 	{
								"value": 0x00DB
							}
						}
					},
					{
						"label": "Discrete input VCR",
						"type": {
							"fix": 	{
								"value": 0x00DC
							}
						}
					},
					{
						"label": "One touch playback",
						"type": {
							"fix": 	{
								"value": 0x00DD
							}
						}
					},
					{
						"label": "One touch record",
						"type": {
							"fix": 	{
								"value": 0x00DE
							}
						}
					},
					{
						"label": "Open",
						"type": {
							"fix": 	{
								"value": 0x00DF
							}
						}
					},
					{
						"label": "Optical",
						"type": {
							"fix": 	{
								"value": 0x00E0
							}
						}
					},
					{
						"label": "Options",
						"type": {
							"fix": 	{
								"value": 0x00E1
							}
						}
					},
					{
						"label": "Orchestra",
						"type": {
							"fix": 	{
								"value": 0x00E2
							}
						}
					},
					{
						"label": "PAL/NTSC",
						"type": {
							"fix": 	{
								"value": 0x00E3
							}
						}
					},
					{
						"label": "Parental lock",
						"type": {
							"fix": 	{
								"value": 0x00E4
							}
						}
					},
					{
						"label": "PBC",
						"type": {
							"fix": 	{
								"value": 0x00E5
							}
						}
					},
					{
						"label": "Phono",
						"type": {
							"fix": 	{
								"value": 0x00E6
							}
						}
					},
					{
						"label": "Photos",
						"type": {
							"fix": 	{
								"value": 0x00E7
							}
						}
					},
					{
						"label": "Picture menu",
						"type": {
							"fix": 	{
								"value": 0x00E8
							}
						}
					},
					{
						"label": "Picture mode",
						"type": {
							"fix": 	{
								"value": 0x00E9
							}
						}
					},
					{
						"label": "Picture mute",
						"type": {
							"fix": 	{
								"value": 0x00EA
							}
						}
					},
					{
						"label": "PIP channel down",
						"type": {
							"fix": 	{
								"value": 0x00EB
							}
						}
					},
					{
						"label": "PIP channel up",
						"type": {
							"fix": 	{
								"value": 0x00EC
							}
						}
					},
					{
						"label": "PIP freeze",
						"type": {
							"fix": 	{
								"value": 0x00ED
							}
						}
					},
					{
						"label": "PIP input",
						"type": {
							"fix": 	{
								"value": 0x00EE
							}
						}
					},
					{
						"label": "PIP move",
						"type": {
							"fix": 	{
								"value": 0x00EF
							}
						}
					},
					{
						"label": "PIP Off",
						"type": {
							"fix": 	{
								"value": 0x00F0
							}
						}
					},
					{
						"label": "PIP On",
						"type": {
							"fix": 	{
								"value": 0x00F1
							}
						}
					},
					{
						"label": "PIP size",
						"type": {
							"fix": 	{
								"value": 0x00F2
							}
						}
					},
					{
						"label": "PIP split",
						"type": {
							"fix": 	{
								"value": 0x00F3
							}
						}
					},
					{
						"label": "PIP swap",
						"type": {
							"fix": 	{
								"value": 0x00F4
							}
						}
					},
					{
						"label": "Play mode",
						"type": {
							"fix": 	{
								"value": 0x00F5
							}
						}
					},
					{
						"label": "Play reverse",
						"type": {
							"fix": 	{
								"value": 0x00F6
							}
						}
					},
					{
						"label": "Power Off",
						"type": {
							"fix": 	{
								"value": 0x00F7
							}
						}
					},
					{
						"label": "Power On",
						"type": {
							"fix": 	{
								"value": 0x00F8
							}
						}
					},
					{
						"label": "PPV (Pay per view)",
						"type": {
							"fix": 	{
								"value": 0x00F9
							}
						}
					},
					{
						"label": "Preset",
						"type": {
							"fix": 	{
								"value": 0x00FA
							}
						}
					},
					{
						"label": "Program",
						"type": {
							"fix": 	{
								"value": 0x00FB
							}
						}
					},
					{
						"label": "Progressive scan",
						"type": {
							"fix": 	{
								"value": 0x00FC
							}
						}
					},
					{
						"label": "ProLogic",
						"type": {
							"fix": 	{
								"value": 0x00FD
							}
						}
					},
					{
						"label": "PTY",
						"type": {
							"fix": 	{
								"value": 0x00FE
							}
						}
					},
					{
						"label": "Quick skip",
						"type": {
							"fix": 	{
								"value": 0x00FF
							}
						}
					},
					{
						"label": "Random",
						"type": {
							"fix": 	{
								"value": 0x0100
							}
						}
					},
					{
						"label": "RDS",
						"type": {
							"fix": 	{
								"value": 0x0101
							}
						}
					},
					{
						"label": "Rear",
						"type": {
							"fix": 	{
								"value": 0x0102
							}
						}
					},
					{
						"label": "Rear volume down",
						"type": {
							"fix": 	{
								"value": 0x0103
							}
						}
					},
					{
						"label": "Rear volume up",
						"type": {
							"fix": 	{
								"value": 0x0104
							}
						}
					},
					{
						"label": "Record mute",
						"type": {
							"fix": 	{
								"value": 0x0105
							}
						}
					},
					{
						"label": "Record pause",
						"type": {
							"fix": 	{
								"value": 0x0106
							}
						}
					},
					{
						"label": "Repeat",
						"type": {
							"fix": 	{
								"value": 0x0107
							}
						}
					},
					{
						"label": "Repeat A-B",
						"type": {
							"fix": 	{
								"value": 0x0108
							}
						}
					},
					{
						"label": "Resume",
						"type": {
							"fix": 	{
								"value": 0x0109
							}
						}
					},
					{
						"label": "RGB",
						"type": {
							"fix": 	{
								"value": 0x010A
							}
						}
					},
					{
						"label": "Right click",
						"type": {
							"fix": 	{
								"value": 0x010B
							}
						}
					},
					{
						"label": "Rock",
						"type": {
							"fix": 	{
								"value": 0x010C
							}
						}
					},
					{
						"label": "Rotate left",
						"type": {
							"fix": 	{
								"value": 0x010D
							}
						}
					},
					{
						"label": "Rotate right",
						"type": {
							"fix": 	{
								"value": 0x010E
							}
						}
					},
					{
						"label": "SAT",
						"type": {
							"fix": 	{
								"value": 0x010F
							}
						}
					},
					{
						"label": "Scan",
						"type": {
							"fix": 	{
								"value": 0x0110
							}
						}
					},
					{
						"label": "Scart",
						"type": {
							"fix": 	{
								"value": 0x0111
							}
						}
					},
					{
						"label": "Scene",
						"type": {
							"fix": 	{
								"value": 0x0112
							}
						}
					},
					{
						"label": "Scroll",
						"type": {
							"fix": 	{
								"value": 0x0113
							}
						}
					},
					{
						"label": "Services",
						"type": {
							"fix": 	{
								"value": 0x0114
							}
						}
					},
					{
						"label": "Setup menu",
						"type": {
							"fix": 	{
								"value": 0x0115
							}
						}
					},
					{
						"label": "Sharp",
						"type": {
							"fix": 	{
								"value": 0x0116
							}
						}
					},
					{
						"label": "Sharpness",
						"type": {
							"fix": 	{
								"value": 0x0117
							}
						}
					},
					{
						"label": "Sharpness down",
						"type": {
							"fix": 	{
								"value": 0x0118
							}
						}
					},
					{
						"label": "Sharpness up",
						"type": {
							"fix": 	{
								"value": 0x0119
							}
						}
					},
					{
						"label": "Side A/B",
						"type": {
							"fix": 	{
								"value": 0x011A
							}
						}
					},
					{
						"label": "Skip forward",
						"type": {
							"fix": 	{
								"value": 0x011B
							}
						}
					},
					{
						"label": "Skip reverse",
						"type": {
							"fix": 	{
								"value": 0x011C
							}
						}
					},
					{
						"label": "Sleep",
						"type": {
							"fix": 	{
								"value": 0x011D
							}
						}
					},
					{
						"label": "Slow",
						"type": {
							"fix": 	{
								"value": 0x011E
							}
						}
					},
					{
						"label": "Slow forward",
						"type": {
							"fix": 	{
								"value": 0x011F
							}
						}
					},
					{
						"label": "Slow reverse",
						"type": {
							"fix": 	{
								"value": 0x0120
							}
						}
					},
					{
						"label": "Sound menu",
						"type": {
							"fix": 	{
								"value": 0x0121
							}
						}
					},
					{
						"label": "Sound mode",
						"type": {
							"fix": 	{
								"value": 0x0122
							}
						}
					},
					{
						"label": "Speed",
						"type": {
							"fix": 	{
								"value": 0x0123
							}
						}
					},
					{
						"label": "Speed down",
						"type": {
							"fix": 	{
								"value": 0x0124
							}
						}
					},
					{
						"label": "Speed up",
						"type": {
							"fix": 	{
								"value": 0x0125
							}
						}
					},
					{
						"label": "Sports",
						"type": {
							"fix": 	{
								"value": 0x0126
							}
						}
					},
					{
						"label": "Stadium",
						"type": {
							"fix": 	{
								"value": 0x0127
							}
						}
					},
					{
						"label": "Start",
						"type": {
							"fix": 	{
								"value": 0x0128
							}
						}
					},
					{
						"label": "Start ID erase",
						"type": {
							"fix": 	{
								"value": 0x0129
							}
						}
					},
					{
						"label": "Start ID renumber",
						"type": {
							"fix": 	{
								"value": 0x012A
							}
						}
					},
					{
						"label": "Start ID write",
						"type": {
							"fix": 	{
								"value": 0x012B
							}
						}
					},
					{
						"label": "Step",
						"type": {
							"fix": 	{
								"value": 0x012C
							}
						}
					},
					{
						"label": "Stereo/Mono",
						"type": {
							"fix": 	{
								"value": 0x012D
							}
						}
					},
					{
						"label": "Still forward",
						"type": {
							"fix": 	{
								"value": 0x012E
							}
						}
					},
					{
						"label": "Still reverse",
						"type": {
							"fix": 	{
								"value": 0x012F
							}
						}
					},
					{
						"label": "Subtitle",
						"type": {
							"fix": 	{
								"value": 0x0130
							}
						}
					},
					{
						"label": "Subwoofer down",
						"type": {
							"fix": 	{
								"value": 0x0131
							}
						}
					},
					{
						"label": "Subwoofer up",
						"type": {
							"fix": 	{
								"value": 0x0132
							}
						}
					},
					{
						"label": "Super bass",
						"type": {
							"fix": 	{
								"value": 0x0133
							}
						}
					},
					{
						"label": "Surround",
						"type": {
							"fix": 	{
								"value": 0x0134
							}
						}
					},
					{
						"label": "Surround mode",
						"type": {
							"fix": 	{
								"value": 0x0135
							}
						}
					},
					{
						"label": "S-Video",
						"type": {
							"fix": 	{
								"value": 0x0136
							}
						}
					},
					{
						"label": "Sweep",
						"type": {
							"fix": 	{
								"value": 0x0137
							}
						}
					},
					{
						"label": "Synchro record",
						"type": {
							"fix": 	{
								"value": 0x0138
							}
						}
					},
					{
						"label": "Tape 1",
						"type": {
							"fix": 	{
								"value": 0x0139
							}
						}
					},
					{
						"label": "Tape 1-2",
						"type": {
							"fix": 	{
								"value": 0x013A
							}
						}
					},
					{
						"label": "Tape 2",
						"type": {
							"fix": 	{
								"value": 0x013B
							}
						}
					},
					{
						"label": "Temperature down",
						"type": {
							"fix": 	{
								"value": 0x013C
							}
						}
					},
					{
						"label": "Temperature up",
						"type": {
							"fix": 	{
								"value": 0x013D
							}
						}
					},
					{
						"label": "Test tone",
						"type": {
							"fix": 	{
								"value": 0x013E
							}
						}
					},
					{
						"label": "Text (Teletext)",
						"type": {
							"fix": 	{
								"value": 0x013F
							}
						}
					},
					{
						"label": "Text expand",
						"type": {
							"fix": 	{
								"value": 0x0140
							}
						}
					},
					{
						"label": "Text hold",
						"type": {
							"fix": 	{
								"value": 0x0141
							}
						}
					},
					{
						"label": "Text index",
						"type": {
							"fix": 	{
								"value": 0x0142
							}
						}
					},
					{
						"label": "Text mix",
						"type": {
							"fix": 	{
								"value": 0x0143
							}
						}
					},
					{
						"label": "Text off",
						"type": {
							"fix": 	{
								"value": 0x0144
							}
						}
					},
					{
						"label": "Text reveal",
						"type": {
							"fix": 	{
								"value": 0x0145
							}
						}
					},
					{
						"label": "Text subpage",
						"type": {
							"fix": 	{
								"value": 0x0146
							}
						}
					},
					{
						"label": "Text timer page",
						"type": {
							"fix": 	{
								"value": 0x0147
							}
						}
					},
					{
						"label": "Text update",
						"type": {
							"fix": 	{
								"value": 0x0148
							}
						}
					},
					{
						"label": "Theater",
						"type": {
							"fix": 	{
								"value": 0x0149
							}
						}
					},
					{
						"label": "Theme",
						"type": {
							"fix": 	{
								"value": 0x014A
							}
						}
					},
					{
						"label": "Thumbs down",
						"type": {
							"fix": 	{
								"value": 0x014B
							}
						}
					},
					{
						"label": "Thumbs up",
						"type": {
							"fix": 	{
								"value": 0x014C
							}
						}
					},
					{
						"label": "Tilt down",
						"type": {
							"fix": 	{
								"value": 0x014D
							}
						}
					},
					{
						"label": "Tilt up",
						"type": {
							"fix": 	{
								"value": 0x014E
							}
						}
					},
					{
						"label": "Time",
						"type": {
							"fix": 	{
								"value": 0x014F
							}
						}
					},
					{
						"label": "Timer",
						"type": {
							"fix": 	{
								"value": 0x0150
							}
						}
					},
					{
						"label": "Timer down",
						"type": {
							"fix": 	{
								"value": 0x0151
							}
						}
					},
					{
						"label": "Timer up",
						"type": {
							"fix": 	{
								"value": 0x0152
							}
						}
					},
					{
						"label": "Tint",
						"type": {
							"fix": 	{
								"value": 0x0153
							}
						}
					},
					{
						"label": "Tint down",
						"type": {
							"fix": 	{
								"value": 0x0154
							}
						}
					},
					{
						"label": "Tint up",
						"type": {
							"fix": 	{
								"value": 0x0155
							}
						}
					},
					{
						"label": "Title",
						"type": {
							"fix": 	{
								"value": 0x0156
							}
						}
					},
					{
						"label": "Track",
						"type": {
							"fix": 	{
								"value": 0x0157
							}
						}
					},
					{
						"label": "Tracking",
						"type": {
							"fix": 	{
								"value": 0x0158
							}
						}
					},
					{
						"label": "Tracking down",
						"type": {
							"fix": 	{
								"value": 0x0159
							}
						}
					},
					{
						"label": "Tracking up",
						"type": {
							"fix": 	{
								"value": 0x015A
							}
						}
					},
					{
						"label": "Treble",
						"type": {
							"fix": 	{
								"value": 0x015B
							}
						}
					},
					{
						"label": "Treble down",
						"type": {
							"fix": 	{
								"value": 0x015C
							}
						}
					},
					{
						"label": "Treble up",
						"type": {
							"fix": 	{
								"value": 0x015D
							}
						}
					},
					{
						"label": "Tune down",
						"type": {
							"fix": 	{
								"value": 0x015E
							}
						}
					},
					{
						"label": "Tune up",
						"type": {
							"fix": 	{
								"value": 0x015F
							}
						}
					},
					{
						"label": "Tuner",
						"type": {
							"fix": 	{
								"value": 0x0160
							}
						}
					},
					{
						"label": "VCR Plus+",
						"type": {
							"fix": 	{
								"value": 0x0161
							}
						}
					},
					{
						"label": "Video 1",
						"type": {
							"fix": 	{
								"value": 0x0162
							}
						}
					},
					{
						"label": "Video 2",
						"type": {
							"fix": 	{
								"value": 0x0163
							}
						}
					},
					{
						"label": "Video 3",
						"type": {
							"fix": 	{
								"value": 0x0164
							}
						}
					},
					{
						"label": "Video 4",
						"type": {
							"fix": 	{
								"value": 0x0165
							}
						}
					},
					{
						"label": "Video 5",
						"type": {
							"fix": 	{
								"value": 0x0166
							}
						}
					},
					{
						"label": "View",
						"type": {
							"fix": 	{
								"value": 0x0167
							}
						}
					},
					{
						"label": "Voice",
						"type": {
							"fix": 	{
								"value": 0x0168
							}
						}
					},
					{
						"label": "Zoom",
						"type": {
							"fix": 	{
								"value": 0x0169
							}
						}
					},
					{
						"label": "Zoom in",
						"type": {
							"fix": 	{
								"value": 0x016A
							}
						}
					},
					{
						"label": "Zoom out",
						"type": {
							"fix": 	{
								"value": 0x016B
							}
						}
					},
					{
						"label": "eHome",
						"type": {
							"fix": 	{
								"value": 0x016C
							}
						}
					},
					{
						"label": "Details",
						"type": {
							"fix": 	{
								"value": 0x016D
							}
						}
					},
					{
						"label": "DVD menu",
						"type": {
							"fix": 	{
								"value": 0x016E
							}
						}
					},
					{
						"label": "My TV",
						"type": {
							"fix": 	{
								"value": 0x016F
							}
						}
					},
					{
						"label": "Recorded TV",
						"type": {
							"fix": 	{
								"value": 0x0170
							}
						}
					},
					{
						"label": "My videos",
						"type": {
							"fix": 	{
								"value": 0x0171
							}
						}
					},
					{
						"label": "DVD angle",
						"type": {
							"fix": 	{
								"value": 0x0172
							}
						}
					},
					{
						"label": "DVD audio",
						"type": {
							"fix": 	{
								"value": 0x0173
							}
						}
					},
					{
						"label": "DVD subtitle",
						"type": {
							"fix": 	{
								"value": 0x0174
							}
						}
					},
					{
						"label": "Radio",
						"type": {
							"fix": 	{
								"value": 0x0175
							}
						}
					},
					{
						"label": "#",
						"type": {
							"fix": 	{
								"value": 0x0176
							}
						}
					},
					{
						"label": "*",
						"type": {
							"fix": 	{
								"value": 0x0177
							}
						}
					},
					{
						"label": "OEM 1",
						"type": {
							"fix": 	{
								"value": 0x0178
							}
						}
					},
					{
						"label": "OEM 2",
						"type": {
							"fix": 	{
								"value": 0x0179
							}
						}
					},
					{
						"label": "Info",
						"type": {
							"fix": 	{
								"value": 0x017A
							}
						}
					},
					{
						"label": "CAPS NUM",
						"type": {
							"fix": 	{
								"value": 0x017B
							}
						}
					},
					{
						"label": "TV MODE",
						"type": {
							"fix": 	{
								"value": 0x017C
							}
						}
					},
					{
						"label": "SOURCE",
						"type": {
							"fix": 	{
								"value": 0x017D
							}
						}
					},
					{
						"label": "FILEMODE",
						"type": {
							"fix": 	{
								"value": 0x017E
							}
						}
					},
					{
						"label": "Time seek",
						"type": {
							"fix": 	{
								"value": 0x017F
							}
						}
					},
					{
						"label": "Mouse enable",
						"type": {
							"fix": 	{
								"value": 0x0180
							}
						}
					},
					{
						"label": "Mouse disable",
						"type": {
							"fix": 	{
								"value": 0x0181
							}
						}
					},
					{
						"label": "VOD",
						"type": {
							"fix": 	{
								"value": 0x0182
							}
						}
					},
					{
						"label": "Thumbs Up",
						"type": {
							"fix": 	{
								"value": 0x0183
							}
						}
					},
					{
						"label": "Thumbs Down",
						"type": {
							"fix": 	{
								"value": 0x0184
							}
						}
					},
					{
						"label": "Apps",
						"type": {
							"fix": 	{
								"value": 0x0185
							}
						}
					},
					{
						"label": "Mouse toggle",
						"type": {
							"fix": 	{
								"value": 0x0186
							}
						}
					},
					{
						"label": "TV Mode",
						"type": {
							"fix": 	{
								"value": 0x0187
							}
						}
					},
					{
						"label": "DVD Mode",
						"type": {
							"fix": 	{
								"value": 0x0188
							}
						}
					},
					{
						"label": "STB Mode",
						"type": {
							"fix": 	{
								"value": 0x0189
							}
						}
					},
					{
						"label": "AUX Mode",
						"type": {
							"fix": 	{
								"value": 0x018A
							}
						}
					},
					{
						"label": "BluRay Mode",
						"type": {
							"fix": 	{
								"value": 0x018B
							}
						}
					},
					{
						"label": "Reserved (Mode)",
						"type": {
							"fix": 	{
								"value": 0x018C
							}
						}
					},
					{
						"label": "Reserved (Mode)",
						"type": {
							"fix": 	{
								"value": 0x018D
							}
						}
					},
					{
						"label": "Reserved (Mode)",
						"type": {
							"fix": 	{
								"value": 0x018E
							}
						}
					},
					{
						"label": "Reserved (Mode)",
						"type": {
							"fix": 	{
								"value": 0x018F
							}
						}
					},
					{
						"label": "Reserved (Mode)",
						"type": {
							"fix": 	{
								"value": 0x0190
							}
						}
					},
					{
						"label": "Reserved (Mode)",
						"type": {
							"fix": 	{
								"value": 0x0191
							}
						}
					},
					{
						"label": "Reserved (Mode)",
						"type": {
							"fix": 	{
								"value": 0x0192
							}
						}
					},
					{
						"label": "Reserved (Mode)",
						"type": {
							"fix": 	{
								"value": 0x0193
							}
						}
					},
					{
						"label": "Standby 1",
						"type": {
							"fix": 	{
								"value": 0x0194
							}
						}
					},
					{
						"label": "Standby 2",
						"type": {
							"fix": 	{
								"value": 0x0195
							}
						}
					},
					{
						"label": "Standby 3",
						"type": {
							"fix": 	{
								"value": 0x0196
							}
						}
					},
					{
						"label": "HDMI 1",
						"type": {
							"fix": 	{
								"value": 0x0197
							}
						}
					},
					{
						"label": "HDMI 2",
						"type": {
							"fix": 	{
								"value": 0x0198
							}
						}
					},
					{
						"label": "HDMI 3",
						"type": {
							"fix": 	{
								"value": 0x0199
							}
						}
					},
					{
						"label": "HDMI 4",
						"type": {
							"fix": 	{
								"value": 0x019A
							}
						}
					},
					{
						"label": "HDMI 5",
						"type": {
							"fix": 	{
								"value": 0x019B
							}
						}
					},
					{
						"label": "HDMI 6",
						"type": {
							"fix": 	{
								"value": 0x019C
							}
						}
					},
					{
						"label": "HDMI 7",
						"type": {
							"fix": 	{
								"value": 0x019D
							}
						}
					},
					{
						"label": "HDMI 8",
						"type": {
							"fix": 	{
								"value": 0x019E
							}
						}
					},
					{
						"label": "HDMI 9",
						"type": {
							"fix": 	{
								"value": 0x019F
							}
						}
					},
					{
						"label": "USB 1",
						"type": {
							"fix": 	{
								"value": 0x01A0
							}
						}
					},
					{
						"label": "USB 2",
						"type": {
							"fix": 	{
								"value": 0x01A1
							}
						}
					},
					{
						"label": "USB 3",
						"type": {
							"fix": 	{
								"value": 0x01A2
							}
						}
					},
					{
						"label": "USB 4",
						"type": {
							"fix": 	{
								"value": 0x01A3
							}
						}
					},
					{
						"label": "USB 5",
						"type": {
							"fix": 	{
								"value": 0x01A4
							}
						}
					},
					{
						"label": "ZOOM 4:3 Normal",
						"type": {
							"fix": 	{
								"value": 0x01A5
							}
						}
					},
					{
						"label": "ZOOM 4:3 Zoom",
						"type": {
							"fix": 	{
								"value": 0x01A6
							}
						}
					},
					{
						"label": "ZOOM 16:9 Normal",
						"type": {
							"fix": 	{
								"value": 0x01A7
							}
						}
					},
					{
						"label": "ZOOM 16:9 Zoom",
						"type": {
							"fix": 	{
								"value": 0x01A8
							}
						}
					},
					{
						"label": "ZOOM 16:9 Wide 1",
						"type": {
							"fix": 	{
								"value": 0x01A9
							}
						}
					},
					{
						"label": "ZOOM 16:9 Wide 2",
						"type": {
							"fix": 	{
								"value": 0x01AA
							}
						}
					},
					{
						"label": "ZOOM 16:9 Wide 3",
						"type": {
							"fix": 	{
								"value": 0x01AB
							}
						}
					},
					{
						"label": "ZOOM Cinema",
						"type": {
							"fix": 	{
								"value": 0x01AC
							}
						}
					},
					{
						"label": "ZOOM 16:9 Default",
						"type": {
							"fix": 	{
								"value": 0x01AD
							}
						}
					},
					{
						"label": "Reserved (ZOOM mode)",
						"type": {
							"fix": 	{
								"value": 0x01AE
							}
						}
					},
					{
						"label": "Reserved (ZOOM mode)",
						"type": {
							"fix": 	{
								"value": 0x01BF
							}
						}
					},
					{
						"label": "Auto Zoom",
						"type": {
							"fix": 	{
								"value": 0x01B0
							}
						}
					},
					{
						"label": "ZOOM Set as Default Zoom",
						"type": {
							"fix": 	{
								"value": 0x01B1
							}
						}
					},
					{
						"label": "Mute On",
						"type": {
							"fix": 	{
								"value": 0x01B2
							}
						}
					},
					{
						"label": "Mute Off",
						"type": {
							"fix": 	{
								"value": 0x01B3
							}
						}
					},
					{
						"label": "AUDIO Mode AUDYSSEY AUDIO OFF",
						"type": {
							"fix": 	{
								"value": 0x01B4
							}
						}
					},
					{
						"label": "AUDIO Mode AUDYSSEY AUDIO LO",
						"type": {
							"fix": 	{
								"value": 0x01B5
							}
						}
					},
					{
						"label": "AUDIO Mode AUDYSSEY AUDIO MED",
						"type": {
							"fix": 	{
								"value": 0x01B6
							}
						}
					},
					{
						"label": "AUDIO Mode AUDYSSEY AUDIO HI",
						"type": {
							"fix": 	{
								"value": 0x01B7
							}
						}
					},
					{
						"label": "Reserved",
						"type": {
							"fix": 	{
								"value": 0x01B8
							}
						}
					},
					{
						"label": "Reserved",
						"type": {
							"fix": 	{
								"value": 0x01B9
							}
						}
					},
					{
						"label": "AUDIO Mode SRS SURROUND ON",
						"type": {
							"fix": 	{
								"value": 0x01BA
							}
						}
					},
					{
						"label": "AUDIO Mode SRS SURROUND OFF",
						"type": {
							"fix": 	{
								"value": 0x01BB
							}
						}
					},
					{
						"label": "Reserved",
						"type": {
							"fix": 	{
								"value": 0x01BC
							}
						}
					},
					{
						"label": "Reserved",
						"type": {
							"fix": 	{
								"value": 0x01BD
							}
						}
					},
					{
						"label": "Reserved",
						"type": {
							"fix": 	{
								"value": 0x01BE
							}
						}
					},
					{
						"label": "Picture Mode Home",
						"type": {
							"fix": 	{
								"value": 0x01BF
							}
						}
					},
					{
						"label": "Picture Mode Retail",
						"type": {
							"fix": 	{
								"value": 0x01C0
							}
						}
					},
					{
						"label": "Picture Mode Vivid",
						"type": {
							"fix": 	{
								"value": 0x01C1
							}
						}
					},
					{
						"label": "Picture Mode Standard",
						"type": {
							"fix": 	{
								"value": 0x01C2
							}
						}
					},
					{
						"label": "Picture Mode Theater",
						"type": {
							"fix": 	{
								"value": 0x01C3
							}
						}
					},
					{
						"label": "Picture Mode Sports",
						"type": {
							"fix": 	{
								"value": 0x01C4
							}
						}
					},
					{
						"label": "Picture Mode Energy savings",
						"type": {
							"fix": 	{
								"value": 0x01C5
							}
						}
					},
					{
						"label": "Picture Mode Custom",
						"type": {
							"fix": 	{
								"value": 0x01C6
							}
						}
					},
					{
						"label": "Cool",
						"type": {
							"fix": 	{
								"value": 0x01C7
							}
						}
					},
					{
						"label": "Medium",
						"type": {
							"fix": 	{
								"value": 0x01C8
							}
						}
					},
					{
						"label": "Warm_D65",
						"type": {
							"fix": 	{
								"value": 0x01C9
							}
						}
					},
					{
						"label": "CC ON",
						"type": {
							"fix": 	{
								"value": 0x01CA
							}
						}
					},
					{
						"label": "CC OFF",
						"type": {
							"fix": 	{
								"value": 0x01CB
							}
						}
					},
					{
						"label": "Video Mute ON",
						"type": {
							"fix": 	{
								"value": 0x01CC
							}
						}
					},
					{
						"label": "Video Mute OFF",
						"type": {
							"fix": 	{
								"value": 0x01CD
							}
						}
					},
					{
						"label": "Next Event",
						"type": {
							"fix": 	{
								"value": 0x01CE
							}
						}
					},
					{
						"label": "Previous Event",
						"type": {
							"fix": 	{
								"value": 0x01CF
							}
						}
					},
					{
						"label": "CEC device list",
						"type": {
							"fix": 	{
								"value": 0x01D0
							}
						}
					},
					{
						"label": "MTS SAP",
						"type": {
							"fix": 	{
								"value": 0x01D1
							}
						}
					},
				]
			};

		// SensorMultilevel
		case 0x31:
			return {
				"Get": [],
			};

		// SensroBinary
		case 0x30:
			return {
				"Get": [],
			};

		// PowerLevel
		case 0x73:
			return {
				"Get": [],
				"TestAllNeighbours": [],
				"TestToNode": [
					{
						"label": "Node ID",
						"type": {
							"range": {
								"min": 0,
								"max": 232
							}
						}
					}
				],
				"Set":[
					{
						"label": "PowerLevel",
						"type": {
							"enumof": [
								{
									"label": "-9dbm ", "type":{
										"fix": 	{
											"value": 9
										}
									}
								},
								{
									"label": "-8dbm ", "type":{
										"fix": 	{
											"value": 8
										}
									}
								},
								{
									"label": "-7dbm ", "type":{
										"fix": 	{
											"value": 7
										}
									}
								},
								{
									"label": "-6dbm ", "type":{
										"fix": 	{
											"value": 6
										}
									}
								},
								{
									"label": "-5dbm ", "type":{
										"fix": 	{
											"value": 5
										}
									}
								},
								{
									"label": "-4dbm ", "type":{
										"fix": 	{
											"value": 4
										}
									}
								},
								{
									"label": "-3dbm ", "type":{
										"fix": 	{
											"value": 3
										}
									}
								},
								{
									"label": "-2dbm ", "type":{
										"fix": 	{
											"value": 2
										}
									}
								},
								{
									"label": "-1dbm ", "type":{
										"fix": 	{
											"value": 1
										}
									}
								},
								{
									"label": "Normal ", "type":{
										"fix": 	{
											"value": 0
										}
									}
								}
							]
						}
					},
					{
						"label": "Timeout (s)",
						"type": {
							"range": {
								"min": 0,
								"max": 255
							}
						}
					}
				]
			};
			
		// Proprietary
		case 0x88:
			return {
				"Get": []
			};
		
		// MeterPulse
		case 0x35:
			return {
				"Get": []
			};
		
		// ManufacturerSpecific
		case 0x72:
			return {
				"Get": []
			};
		
		// Manufacturer Proprietary
		case 0x91:
			return {
				"Send": [
					{
						"label": "Data in format [1,2,3,..,0xa,..]",
						"type": {
							"string": {
							}
						}
					}
				]
			};

		// SwitchAll
		case 0x27:
			return {
				"SetOn": [],
				"SetOff": [],
				"Get": [],
				"Set": [
					{
						"label": "Mode",
						"type": {
							"enumof": [
								{
									"label": "Not in switch all group",
									"type": {
										"fix": 	{
											"value": 0x00
										}
									}
								},
								{
									"label": "In switch all off group only",
									"type": {
										"fix": 	{
											"value": 0x01
										}
									}
								},
								{
									"label": "In switch all on group only",
									"type": {
										"fix": 	{
											"value": 0x02
										}
									}
								},
								{
									"label": "In switch all on and off groups",
									"type": {
										"fix": 	{
											"value": 0xff
										}
									}
								}
							]
						}
					}
				]
			};

		// SensorConfiguration
		case 0x9e:
			return	{
				"Get": [],
				"Set": [
					{
						"label": "Trigger",
							"type": {
							"enumof": [
								{
									"label": "Current",
									"type": {
										"fix": 	{
											"value": 1
										}
									}
								},
								{
									"label": "Default",
									"type": {
										"fix": 	{
											"value": 2
										}
									}
								},
								{
									"label": "Value",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								]
						}
					},
					{
						"label": "Value of Sensor",
						"type": {
							"range": {
								"min": 0,
								"max": 0xffff
							}
						}
					}
				]
			};

		// ScheduleEntryLock
		case 0x4e:
			return {
				"WeekDayScheduleGet": [
					{
						"label": "User",
						"type": {
							"range": {
								"min": 0,
								"max": 99
							}
						}
					}
				],
				"YearScheduleGet": [
					{
						"label": "User",
						"type": {
							"range": {
								"min": 0,
								"max": 99
							}
						}
					}
				],
				"WeekDayScheduleSet": [
					{
						"label": "User",
						"type": {
							"range": {
								"min": 0,
								"max": 99
							}
						}
					}
				],
				"YearScheduleSet": [
					{
						"label": "User",
						"type": {
							"range": {
								"min": 0,
								"max": 99
							}
						}
					}
				],
				"Set": [
					{
						"label": "User",
						"type": {
							"range": {
								"min": 0,
								"max": 99
							}
						}
					},
					{
						"label": "Level",
						"type": {
							"enumof": [
								{
									"label": "Disable",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "Enable",
									"type": {
										"fix": 	{
											"value": 1
										}
									}
								}
							]
						}
					}
				],

				"AllSet": [
					{
						"label": "Level",
						"type": {
							"enumof": [
								{
									"label": "Disable",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "Enable",
									"type": {
										"fix": 	{
											"value": 1
										}
									}
								}
							]
						}
					}
				]
			};

		// SceneActivation
		case 0x2B:
			return {
				"Set": [
					{
						"label": "Scene",
						"type": {
							"range": {
								"min": 	1,
								"max": 255
							}
						}
					},
					{
						"label": "Duration",
						"type": {
							"enumof": [
								{
									"label": "immediately",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "in seconds",
									"type": {
										"range": {
											"min": 	1,
											"max": 127
										}
									}
								},
								{
									"label": "in minutes",
									"type": {
										"range": {
											"min": 	1,
											"max": 127,
										"shift": 	127
										}
									}
								},
								{
									"label": "use device default",
									"type": {
										"fix": 	{
											"value": 255
										}
									}
								}
							]
						}
					}
				]
			};
			
		// SceneActuatorConf
		case 0x2C:
			return {
				"Get": [
					{
						"label": "Scene",
						"type": {
							"range": {
								"min": 0,
								"max": 255
							}
						}
					}
				],
				"Set": [
					{
						"label": "Scene",
						"type": {
							"range": {
								"min": 	1,
								"max": 255
							}
						}
					},
					{
						"label": "Level",
						"type": {
							"enumof": [
								{
									"label": "Off",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "%",
									"type": {
										"range": {
											"min": 0,
											"max": 99
										}
									}
								},
								{
									"label": "Full",
									"type": {
										"fix": 	{
											"value": 99
										}
									}
								},
								{
									"label": "On",
									"type": {
										"fix": 	{
											"value": 255
										}
									}
								}
							]
						}
					},
					{
						"label": "Duration",
						"type": {
							"enumof": [
								{
									"label": "immediately",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "in seconds",
									"type": {
										"range": {
											"min": 	1,
											"max": 127
										}
									}
								},
								{
									"label": "in minutes",
									"type": {
										"range": {
											"min": 	1,
											"max": 127,
										"shift": 	127
										}
									}
								},
								{
									"label": "use device default",
									"type": {
										"fix": 	{
											"value": 255
										}
									}
								}
							]
						}
					},
					{
						"label": "Level used",
						"type": {
							"enumof": [
								{
									"label": "Current in device",
									"type": {
										"fix": 	{
											"value": 0,
											},
										}
									},
								{
									"label": "Defined",
									"type": {
										"fix": 	{
											"value": 1 << 7,
										}
									}
								}
							]
						}
					},
				]
			};

		// Protection
		case 0x75:
			return {
				"Get": [],
				"ExclusiveGet": [],
				"TimeoutGet": [],
				"Set": (function () {
					var ret = [
						{
							"label": "Local operations",
								"type": {
									"enumof": [
										{
											"label": "Unprotected",
											"type": {
												"fix": 	{
													"value": 0
												}
											}
										},
										{
											"label": "Protection by sequence",
											"type": {
												"fix": 	{
													"value": 1
												}
											}
										},
										{
											"label": "No operation possible",
											"type": {
												"fix": 	{
													"value": 2
												}
											}
										}
									]
								}
							},
						];

					if (data.version.value >= 2)
						ret.push({
								"label": "RF operations",
								"type": {
									"enumof": [
										{
											"label": "Unprotected",
											"type": {
												"fix": 	{
													"value": 0
												}
											}
										},
										{
											"label": "No RF Control",
											"type": {
												"fix": 	{
													"value": 1
												}
											}
										},
										{
											"label": "No RF Communication",
											"type": {
												"fix": 	{
													"value": 2
												}
											}
										}
									]
								}
							}
						);
						return ret;
				})(),
				
				"TimeoutSet": [
					 {
						"label": "Time",
						"type": {
							"enumof": [
								{
									"label": "No",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "Sec",
									"type": {
										"range": {
											"min": 0,
											"max": 60
										}
									}
								},
								{
									"label": "Min",
									"type": {
										"range": {
											"min": 	2,
											"max": 191,
										"shift": 	63
										}
									}
								},
								{
									"label": "Infinite",
									"type": {
										"fix": 	{
											"value": 255
										}
									}
								},
								]
						}
					}
				],
				"ExclusivitySet": [
					{
						"label": "to node",
						"type": {
							"node": {}
						}
					}
				]
			};
			
		// SceneControllerConf
		case 0x2d:
			return {
				"Get": [
					{
						"label": "Group",
						"type": {
							"range": {
								"min": 0,
								"max": 255
							}
						}
					}
				],
				"Set": [
					{
						"label": "Group",
						"type": {
							"range": {
								"min": 0,
								"max": 255
							}
						}
					},
					{
						"label": "Scene",
						"type": {
							"range": {
								"min": 0,
								"max": 255
							}
						}
					},
					{
						"label": "DimmingDuration",
						"type": {
							"enumof": [
								{
									"label": "immediately",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "in seconds",
									"type": {
										"range": {
											"min": 	1,
											"max": 127
										}
									}
								},
								{
									"label": "in minutes",
									"type": {
										"range": {
											"min": 	1,
											"max": 127,
										"shift": 	127
										}
									}
								},
								{
									"label": "use device default",
									"type": {
										"fix": 	{
											"value": 255
										}
									}
								}
							]
						}
					}
				]
			};
			
		// Alarm
		case 0x71:
			var ret = {
				"Get": [
					{
						"label": "Type",
						"type": {
							"enumof": (
									function() {
										try {
											var arr = [];
											var key;
											for (key in data) {
												var ikey = parseInt(key);
												if (!isNaN(ikey))
													arr.push({
														"label": data[ikey].typeString.value,
														"type": {
															"fix": 	{
																"value": ikey
															}
														}
													});
											};
											return arr;
										} catch(err) {}
										return [];
									}
								)()
						}
					}
				]
			};
			
			if (data.version.value > 1) {
				ret["Set"] = [
					{
						"label": "Type",
						"type": {
							"enumof": (
									function() {
										try {
											var arr = [];
											var key;
											for (key in data) {
												var ikey = parseInt(key);
												if (!isNaN(ikey))
													arr.push({
														"label": data[ikey].typeString.value,
														"type": {
															"fix": 	{
																"value": ikey
															}
														}
													});
											};
											return arr;
										} catch(err) {}
										return [];
									}
								)()
						}
					},
					{
						"label": "Status",
						"type": {
							"enumof": [
								{
									"label": "Disable",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "Enable",
									"type": {
										"fix": 	{
											"value": 255
										}
									}
								}
							]
						}
					}
				];
			}
			
			return ret;
		
		// AlarmSensor
		case 0x9c:
			return {
				"Get": []
			};
		
		// Battery
		case 0x80:
			return {
				"Get": []
			};

		// MutiChannelAssociation
		case 0x8e:
			return {
				"GroupingsGet": [],
				"Get": [
					{
						"label": "Group",
						"type": {
							"range": {
								"min": 	1,
								"max": 255
							}
						}
					}
				],
				"Set": [
					{
						"label": "Group",
						"type": {
							"range": {
								"min": 	1,
								"max": 255
							}
						}
					},
					{
						"label": "Node",
						"type": {
							"node": {
							}
						}
					},
					{
						"label": "instance",
						"type": {
							"range": {
								"min": 	1,
								"max": 127
							}
						}
					}
				],
				"Remove": [
					{
						"label": "Group",
						"type": {
							"range": {
								"min": 	1,
								"max": 255
							}
						}
					},
					{
						"label": "Node",
						"type": {
							"node": {
							}
						}
					},
					{
						"label": "instance",
						"type": {
							"range": {
								"min": 	1,
								"max": 127
							}
						}
					}
				]
			};
		
		// Meter	
		case 0x32:
			return {
				"Get": [],
				"Reset": []
			};

		// AlarmSilence
		case 0x9d:
			return {
				"Set": [
					{
						"label": "Mode",
						"type": {
							"enumof": [
								{
									"label": "Disable all",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "Disable all Sensor Alarms",
									"type": {
										"fix": 	{
											"value": 1
										}
									}
								},
								{
									"label": "Enable all",
									"type": {
										"fix": 	{
											"value": 2
										}
									}
								},
								{
									"label": "Enable all Sensor Alarms",
									"type": {
										"fix": 	{
											"value": 3
										}
									}
								}
							]
						}
					},
					{
						"label": "Duration in sec",
						"type": {
							"range": {
								"min": 0,
								"max": 256
							}
						}
					},
					{
						"label": "Alarm",
						"type": {
							"range": {
								"min": 0,
								"max": 0xffff
							}
						}
					}
				]
			};

		// BasicWindowCovering
		case 0x50:
			return {
				"Stop": [],
				"Start": [
					{
						"label": "Direction",
						"type": {
							"enumof": [
								{
									"label": "Up",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "Down",
									"type": {
										"fix": 	{
											"value": 255
										}
									}
								}
							]
						}
					}
				]
			};

		// Configuration			
		case 0x70:
			return {
				"Get": [
					{
						"label": "Parameter",
						"type": {
							"range": {
								"min": 0,
								"max": 255
							}
						}
					}
				],
				"Set": [
					{
						"label": "Parameter",
						"type": {
							"range": {
								"min": 0,
								"max": 255
							}
						}
					},
					{
						"label": "Value",
						"type": {
							"range": {
								"min": 0,
								"max": 4294967295
							}
						}
					},
					{
						"label": "Size",
						"type": {
							"enumof": [
								{
									"label": "auto detect",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "1 byte",
									"type": {
										"fix": 	{
											"value": 1
										}
									}
								},
								{
									"label": "2 byte",
									"type": {
										"fix": 	{
											"value": 2
										}
									}
								},
								{
									"label": "4 byte",
									"type": {
										"fix": 	{
											"value": 4
										}
									}
								}
							]
						}
					}
				],
				"SetDefault": [
					{
						"label": "Parameter",
						"type": {
							"range": {
								"min": 0,
								"max": 255
							}
						}
					}
				]
			};

		// Association
		case 0x85:
			return {
				"GroupingsGet": [],
				"Get": [
					{
						"label": "Group",
						"type": {
							"range": {
								"min": 	1,
								"max": 255
							}
						}
					}
				],
				"Set": [
					{
						"label": "Group",
						"type": {
							"range": {
								"min": 	1,
								"max": 255
							}
						}
					},
					{
						"label": "Node",
						"type": {
							"node": {
							}
						}
					}
				],
				"Remove": [
					{
						"label": "Group",
						"type": {
							"range": {
								"min": 	1,
								"max": 255
							}
						}
					},
					{
						"label": "Node",
						"type": {
							"range": {
								"min": 	1,
								"max": 255
							}
						}
					}
				]
			};

		// AssociationCommandConfiguration
		case 0x9b:
			return {
				"Get": []
			};
		
		// NodeNaming
		case 0x77:
			return {
				"Get": [],
				"GetName": [],
				"GetLocation": [],
				"SetName": [
					{
						"label": "Name",
						"type": {
							"string": {
							}
						}
					}
				],
				"SetLocation": [
					{
						"label": "Location",
						"type": {
							"string": {
							}
						}
					}
				]
			};
			
		// MeterTableMonitor
		case 0x3d:
			return {
				"StatusDateGet": [
					{
						"label": "Index",
						"type": {
							"enumof": [
								{
									"label": "For all entries",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "",
									"type": {
										"range": 	{
											"min": 1,
											"max": 255
										}
									}
								}
							]
						}
					},
					{
						"label": "Start (UNIX stamp)",
						"type": {
							"range": {
								"min": 0,
								"max": 100000000
							}
						}
					},
					{
						"label": "Stop (UNIX stamp)",
						"type": {
							"range": {
								"min": 0,
								"max": 100000000
							}
						}
					}
				],
				"StatusDepthGet": [
					{
						"label": "Index",
						"type": {
							"enumof": [
								{
									"label": "Current only",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "For all entries",
									"type": {
										"fix": 	{
											"value": 255
										}
									}
								},
								{
									"label": "",
									"type": {
										"range": 	{
											"min": 1,
											"max": 255
										}
									}
								}
							]
						}
					}
				],
				"CurrentDataGet": [
					{
						"label": "Index",
						"type": {
							"enumof": [
								{
									"label": "For all supported",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "",
									"type": {
										"range": 	{
											"min": 1,
											"max": 255
										}
									}
								}
							]
						}
					}
				]
			};

		// Indicator			
		case 0x87:
			return {
				"Get": [],
				"Set": [
					{
						"label": "Active",
						"type": {
							"enumof": [
								{
									"label": "Off",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "On",
									"type": {
										"fix": 	{
											"value": 255
										}
									}
								}
							]
						}
					}
				]
			};

		/*
		This UI requires special handling of form, so it is handled in a special tab in the UI
		// FirmwareUpdateMD
		case 0x7A:
			return {
				"Get": [],
				"RequestUpdate": [
					{
						"label": "Path to File",
						"type": {
							"string": {
							}
						}
					},
					{
						"label": "FirmwareId",
						"type": {
							"range": {
								"min": 0,
								"max": 65535
							}
						}
					}
				]
			};
		*/
		
		// DoorLockLogging
		case 0x4c:
			return {
				"Get": [
					{
						"label": "Record",
						"type": {
							"range": {
								"min": 0,
								"max": 99
							}
						}
					}
				]
			};

		// DoorLock
		case 0x62:
			return {
			 	"Get": [],
				"Set": [
					{
						"label": "Mode",
						"type": {
							"enumof": [
								{
									"label": "Door Unsecured",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "Door Unsecured with timeout",
									"type": {
										"fix": 	{
											"value": 0x1
										}
									}
								},
								{
									"label": "Door Unsecured for inside Door Handles",
									"type": {
										"fix": 	{
											"value": 0x10
										}
									}
								},
								{
									"label": "Door Unsecured for inside Door Handles with timeout",
									"type": {
										"fix": 	{
											"value": 0x11
										}
									}
								},
								{
									"label": "Door Unsecured for outside Door Handles",
									"type": {
										"fix": 	{
											"value": 0x20
										}
									}
								},
								{
									"label": "Door Unsecured for outside Door Handles with timeout",
									"type": {
										"fix": 	{
											"value": 0x21
										}
									}
								},
								{
									"label": "Door Secured",
									"type": {
										"fix": 	{
											"value": 0xff
										}
									}
								}
							]
						}
					}
				],
				"ConfigurationGet": [],
				"ConfigurationSet": [
					{
						"label": "Timeout, minutes",
						"type": {
							"range": {
								"min": 	1,
								"max": 254
							}
						}
					},
					{
						"label": "Timeout, seconds",
						"type": {
							"range": {
								"min": 	1,
								"max": 59
							}
						}
					}
				]
			};

		// Basic
		case 0x20:
			return {
				"Get": [],
				"Set": [
					{
						"label": "Level",
						"type": {
							"enumof": [
								{
									"label": "Off",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},
								{
									"label": "Dimmer level",
									"type": {
										"range": {
											"min": 0,
											"max": 255
										}
									}
								},
								{
									"label": "Max",
									"type": {
										"fix": 	{
											"value": 99
										}
									}
								},
								{
									"label": "On",
									"type": {
										"fix": 	{
											"value": 255
										}
									}
								}
							]
						}
					}
				]
			};
			
		// ClimateControlSchedule	(incomplete Implementation, only overwrite but no schedule handling)
		case 0x46:
			return {
				"OverrideGet": [],
				"OverrideSet": [
					{
						"label": "Type",
						"type": {
							"enumof": [
								{
									"label": "No override",
									"type": {
										"fix": 	{
											"value": 0
										}
									}
								},							
								{
									"label": "Permanently",
									"type": {
										"fix": 	{
											"value": 1
										}
									}
								},
								{
									"label": "Temporary",
									"type": {
										"fix": 	{
											"value": 2
										}
									}
								}
							]
						}
					},
					
					{
						"label": "State",
						"type": {
							"enumof": [
								{
									"label": "Unused",
									"type": {
										"fix": 	{
											"value": 127
										}
									}
								},
								{
									"label": "Energy Saving",
									"type": {
										"fix": 	{
											"value": 122
										}
									}
								},							
								{
									"label": "Frost Protection",
									"type": {
										"fix": 	{
											"value": 121
										}
									}
								},
								{
									"label": "Temperature Offset in 1/10K",
									"type": {
										"range": {
											"min": -128,
											"max": 120
										}
									}
								},
							]
						}
					},
					
					
					
					
										
				]								
			};   

		default: return {};
	}
}

/**
 * Application base
 * @author Martin Vach
 */

//Define an angular module for our app
var angApp = angular.module('angApp', [
    'ngRoute',
    'ngCookies',
    'appController',
    'appFactory',
    'appService',
    'appConfig',
    'angularFileUpload'
]);

//Define Routing for app
angApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
                // Home
                when('/', {
                    templateUrl: 'app/views/home/home.html'
                }).
                // Test
                when('/test', {
                    templateUrl: 'app/views/test.html'
                }).
                        // Help
                when('/help/:nodeId?', {
                    templateUrl: 'app/views/help/help.html'
                }).
                // Controll
                when('/control/switch', {
                    templateUrl: 'app/views/controll/switch.html'
                }).
                when('/control/dimmer', {
                    templateUrl: 'app/views/controll/dimmer.html'
                }).
                when('/control/sensors', {
                    templateUrl: 'app/views/controll/sensors.html'
                }).
                when('/control/meters', {
                    templateUrl: 'app/views/controll/meters.html'
                }).
                when('/control/thermostat', {
                    templateUrl: 'app/views/controll/thermostat.html'
                }).
                when('/control/locks', {
                    templateUrl: 'app/views/controll/locks.html'
                }).
                // Device
                when('/device/status', {
                    templateUrl: 'app/views/device/status.html'
                }).
                when('/device/battery', {
                    templateUrl: 'app/views/device/battery.html'
                }).
                when('/device/type', {
                    templateUrl: 'app/views/device/type.html'
                }).
                when('/device/type', {
                    templateUrl: 'app/views/device/type.html'
                }).
                when('/device/associations', {
                    templateUrl: 'app/views/device/associations.html'
                }).
                when('/device/security', {
                    templateUrl: 'app/views/device/security.html'
                }).
                // Config
                when('/config/configuration/:nodeId?', {
                    templateUrl: 'app/views/config/config.html'
                }).
                // Network
                when('/network/control', {
                    templateUrl: 'app/views/network/control.html'
                }).
                when('/network/routing', {
                    templateUrl: 'app/views/network/routing.html'
                }).
                when('/network/reorganization', {
                    templateUrl: 'app/views/network/reorganization.html'
                }).
                when('/network/timing', {
                    templateUrl: 'app/views/network/timing.html'
                }).
                when('/network/controller', {
                    templateUrl: 'app/views/network/controller.html'
                }).
                 when('/network/queue', {
                    templateUrl: 'app/views/network/queue.html'
                }).        
                otherwise({
                    redirectTo: '/'
                });
    }]);



/**
 * App configuration
 * @author Martin Vach
 * @author Martin Hartnagel
 */

var config_module = angular.module('appConfig', []);
var config_data = {
    'cfg': {
        'app_name': 'Z-Wave',
        'app_version': '0.1',
        'custom_ip': false,
        'user_field': 'USERXXXX',
        'pass_field': 'PSWDXXXX',
        'interval': 3000, // Set interval in miliseconds to refresh data
        'queue_interval': 3000, // Set interval in miliseconds to refresh queue data
        'route_update_timeout': 15000, // Maximum time in miliseconds to wait for an update-route
        //'server_url': 'http://192.168.10.162:8083/', // Remote JSON
        'server_url': '', // Remote JSON
        'update_url': '/ZWaveAPI/Data/', // Url for update (refresh data)
        'store_url': '/ZWaveAPI/Run/', // Url for store data
        'restore_url': '/ZWaveAPI/Restore', // Url to restore backup
        'queue_url': '/ZWaveAPI/InspectQueue', // Url for inspect queue
        'fw_update_url': '/ZWaveAPI/FirmwareUpdate', // Url for Firmware Update
        'runjs_url': '/JS/Run/', // Url for running JS
        'device_classes_url': '/translations/DeviceClasses.xml', // Url to Device Classes
        'config_url': '/config/', // Url for store config data
        'reorg_log_url': '/config/reorg.log', // Url for store reorg log data
        'zddx_url': '/ZDDX/', // Url for zddx xml files
        'zddx_create_url': '/ZWaveAPI/CreateZDDX/', // Create zddx file
        'notes_url': '/config/notes.log', // Url for store notes data
        'lang_dir': 'app/core/lang/', // Language directory
        'lang': 'en', // Default language
        'lang_list': ["en", "de", "fr", "es", "ru"], // List of languages
        'thermostat_range': {// Min and max thermostat range
            "min": "0",
            "max": "40"
        }

    }
};
angular.forEach(config_data, function(key, value) {
    config_module.constant(value, key);
});
/**
 * Application directives
 * @author Martin Vach
 */

angApp.directive('sortBy', function() {
    return {
        restrict: "E",
        replace: true,
        template: '<span ng-show="predicate == {{coll_name}}"><i ng-show="!reverse" class="fa fa-sort-asc"></i><i ng-show="reverse" class="fa fa-sort-desc"></i></span>',
        link: function(scope, element, attr) {
            // this is link function
            var col_name = scope.$eval(attr.col_name);
        }
    };
});

angApp.directive('btnSpinner', function() {
    return {
        restrict: "E",
        replace: true,
        template: '<i class="fa fa-spinner fa-spin fa-lg" style="display:none;"></i>'
    };
});

angApp.directive('tooltip', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).hover(function() {
                // on mouseenter
                $(element).tooltip('show');
            }, function() {
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});
/**
 * Hide collapsed navi after click on mobile devices
 */
angApp.directive('collapseNavbar', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).click(function() {
                $("#nav_collapse").removeClass("in").addClass("collapse");
            });
        }
    };
});

angApp.directive('draggable', ['$document', function($document) {
        return {
            restrict: 'A',
            link: function(scope, elm, attrs) {
                var startX, startY, initialMouseX, initialMouseY;
                elm.css({position: 'absolute'});

                elm.bind('mousedown', function($event) {
                    startX = elm.prop('offsetLeft');
                    startY = elm.prop('offsetTop');
                    initialMouseX = $event.clientX;
                    initialMouseY = $event.clientY;
                    $document.bind('mousemove', mousemove);
                    $document.bind('mouseup', mouseup);
                    return false;
                });

                function mousemove($event) {
                    var dx = $event.clientX - initialMouseX;
                    var dy = $event.clientY - initialMouseY;
                    elm.css({
                        top: startY + dy + 'px',
                        left: startX + dx + 'px'
                    });
                    return false;
                }

                function mouseup() {
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);
                }
            }
        };
    }]);

/**
 *  Switches directives
 *  @todo: move to filters
 */

// Switch type
angApp.directive('switchTypeIcon', function() {
    return {
        restrict: "E",
        replace: true,
        template: ' <i class="fa {{icon}} fa-lg"></i> ',
        link: function(scope, elem, attr) {
            var icon;
            scope.generic = attr.generic;
            scope.specific = attr.specific;
            switch (parseInt(attr.generic, 10)) {
                case 1:
                    icon = 'fa-eye';
                    break;
                case 17:
                    icon = 'fa-lightbulb-o';
                    break;

                case 16:
                    icon = 'fa-power-off';
                    break;

                case 8:
                    icon = 'fa-sort-amount-desc';
                    break;

                case 9:
                    icon = 'fa-bullseye fa-lg';
                    break;
                case 32:
                    icon = 'fa-eye';
                    break;

                case 64:
                    icon = 'fa-lock fa-lg';
                    break;



                default:
                    icon = '';
                    break;
            }

            scope.icon = icon;
        }
    };
});

// Switch all icons
//@todo: move to filters
angApp.directive('switchAllIcon', function() {
    return {
        restrict: "E",
        replace: true,
        template: '<img src="{{src}}" />',
        link: function(scope, elem, attr) {
            var src;
            if (attr.hasall !== null) {
                switch (parseInt(attr.hasall, 10)) {
                    case 0:
                        src = 'app/images/icons/switch_all_xx_xxx.png';
                        break;

                    case 1:
                        src = 'app/images/icons/switch_all_xx_off.png';
                        break;

                    case 2:
                        src = 'app/images/icons/switch_all_on_xxx.png';
                        break;

                    case 255:
                        src = 'app/images/icons/switch_all_on_off.png';
                        break;

                    default:
                        src = 'app/images/icons/1x1.png';
                        break;
                }
            }
            ;
            scope.src = src;
        }
    };
});


// Switch all icons
//@todo: move to filters
angApp.directive('routingTypeIcon', function() {
    return {
        restrict: "E",
        replace: true,
        template: '<img src="{{src}}" title="{{title}}" />',
        link: function($scope, elem, attr) {
            var src;
            var title;
            if (attr.nodeId !== null && $scope.ZWaveAPIData) {
                var node = $scope.ZWaveAPIData.devices[attr.nodeId];

                var isListening = node.data.isListening.value;
                var isFLiRS = !isListening && (node.data.sensor250.value || node.data.sensor1000.value);
                var hasWakeup = 0x84 in node.instances[0].commandClasses;
                var hasBattery = 0x80 in node.instances[0].commandClasses;
                var isPortableRemoteControl = (node.data.deviceTypeString.value == "Portable Remote Controller");

                if (isListening) { // mains powered
                    src = 'app/images/icons/type_Mains-Powered.png';
                    title = $scope._t('conf_apply_mains');
                } else if (hasWakeup) {
                    src = 'app/images/icons/type_Battery-Wakeup.png';
                    title = $scope._t('battery_powered_device');
                } else if (isFLiRS) {
                    src = 'app/images/icons/type_FLIRS2.png';
                    title = $scope._t('FLiRS_device');
                } else if (isPortableRemoteControl) {
                    src = 'app/images/icons/type_Remote-Control.png';
                    title = $scope._t('battery_operated_remote_control');
                } else {
                    src = 'app/images/icons/1x1.png';
                    title = "";
                }
            }
            $scope.src = src;
            $scope.title = title;
        }
    };
});

angApp.directive('expertCommandInput', function($filter) {
    // Get text input
    function getText(label, value, min, max, name) {
        var input = '';
        var inName = $filter('stringToSlug')(name ? name : label);
        input += '<label>' + label + '</label> ';
        input += '<input class="form-control" name="' + inName + '" type="text" class="form-control" value="' + value + '" title=" min: ' + min + ', max: ' + max + '" />';
        return input;
    }
    // Get node
    function getNode(label, devices, selected, name) {
        var input = '';
        var inName = $filter('stringToSlug')(name ? name : label);
        input += '<label>' + label + '</label> ';
        input += '<select name="select_' + inName + '" class="form-control">';
        input += '<option value="1">RaZberry</option>';
        angular.forEach(devices, function(v, k) {
            input += '<option value="' + v.id + '">' + v.name + '</option>';
        });

        input += '</select>';

        return input;
    }

    // Get enumerators
    function getEnum(label, enums, defaultValue, name, hideRadio,showDefaultValue) {
        var input = '';
        if (!enums) {
            return;
        }
        var inName = $filter('stringToSlug')(name ? name : label);
        input += '<label>' + label + '</label><br />';
        var cnt = 1;
        angular.forEach(enums.enumof, function(v, k) {
            var title = v.label;
            var type = v.type;


            var checked = (cnt == 1 ? ' checked="checked"' : '');
            var isCurrent = (cnt == 1 ? ' commads-is-current' : '');

            if ('fix' in type) {
                if (defaultValue) {
                    if (isNaN(parseInt(defaultValue, 10))) {
                        checked = (v.label == defaultValue ? ' checked="checked"' : '');
                        isCurrent = (v.label == defaultValue ? ' commads-is-current' : '');
                    } else {
                        checked = '';
                        isCurrent = '';
                    }
                }
                input += '<input name="radio_' + inName + '" class="commands-data-chbx" type="radio" value="' + type.fix.value + '"' + checked + ' /> <span class="commands-label' + isCurrent + '">' + title + '</span><br />';
            } else if ('range' in type) {
                var min = type.range.min;
                var max = type.range.max;
                var disabled = ' disabled="true"';
                var setVal = (defaultValue ? defaultValue : min);
                if (defaultValue) {
                    if (defaultValue >= min && defaultValue <= max) {
                        checked = ' checked="checked"';
                        disabled = '';
                        isCurrent = ' commads-is-current';
                    }

                } else {
                    checked = '';
                    isCurrent = '';
                }
                if (hideRadio) {
                    disabled = '';
                }

//                input += '<input name="radio_' + inName + '" class="commands-data-chbx" type="radio" value=""' + checked + ' /> ' + title + ' <input type="text" name="radio_' + inName + '_txt" class="form-control commands-data-txt-chbx" value="' + min + '" title=" min: ' + min + ', max: ' + max + '"'+ disabled + ' /><br />'; 
                if (!hideRadio) {
                    input += '<div><input name="radio_' + inName + '" class="commands-data-chbx" type="radio" value=""' + checked + ' /> <span class="commands-label' + isCurrent + '">' + title + '</span> <input type="text" name="radio_txt_' + inName + '" class="form-control commands-data-txt-chbx" value="' + setVal + '" title=" min: ' + min + ', max: ' + max + '"' + disabled + ' /></div>';
                } else {
                    input += '<input type="text" name="radio_txt_' + inName + '" class="form-control" value="' + setVal + '" title=" min: ' + min + ', max: ' + max + '" /><br />';
                }


            } else {
                input = '';
            }
            cnt++;

        });
        return input;
    }

    // Get dropdown list
    function getDropdown(label, enums, defaultValue, name) {
        var input = '';
        var inName = $filter('stringToSlug')(name ? name : label);
        input += '<label>' + label + '</label><br />';
        input += '<select name="select_' + inName + '" class="form-control">';
        var cnt = 1;
        angular.forEach(enums.enumof, function(v, k) {
            var title = v.label;
            var type = v.type;
            var value;
            if ('fix' in type) {
                value = type.fix.value;
            } else if ('range' in type) {
                value = type.range.min;
            }

            if (defaultValue) {
                var selected = (type.fix.value == defaultValue ? ' selected' : '');
            }
            input += '<option value="' + value + '"' + selected + '> ' + title + '</option>';
            cnt++;

        });
        input += '</select">';
        return input;
    }

    // Get constant 
    function getConstant(label, type, defaultValue, name) {
        var input = '';
        var inName = $filter('stringToSlug')(name ? name : label);
        input += '<label>' + label + '</label><br />';
        if (type.constant.length > 0) {
            input += '<select name="select_' + inName + '" class="form-control">';
            angular.forEach(type.constant, function(v, k) {

                input += '<option value="' + v.type.constant.value + '"> ' + v.label + '</option>';
            });


            input += '</select">';
        }
        //console.log(type,defaultValue);
        input += '<em>Constant type</em>';
        return input;
    }
    // Get string
    function getString(label, value, name) {
        var input = '';
        var inName = $filter('stringToSlug')(name ? name : label);
        input += '<label>' + label + '</label> ';
        input += '<input class="form-control" name="' + inName + '" type="text" class="form-control" value="' + value + '" />';
        return input;
    }

    // Get default
    function getDefault(label) {

        var input = '';
        input += '<label>' + label + '</label><br />';
        return input;
    }

    return {
        restrict: "E",
        replace: true,
        template: '<div class="form-group" id="form_group_" ng-bind-html="input | toTrusted"></div>',
        scope: {
            collection: '=',
            devices: '=',
            getNodeDevices: '=',
            values: '=',
            isDropdown: '=',
            defaultValue: '=',
            showDefaultValue: '=',
            divId: '='
        },
        link: function(scope, element, attrs) {

            var input = '';
            if (!scope.collection) {
                return;
            }
            var label = scope.collection.label;
            var type = scope.collection.type;
            var name = scope.collection.name;
            var hideRadio = scope.collection.hideRadio;
            if (scope.isDropdown) {
                input = getDropdown(label, type, scope.defaultValue);
                scope.input = input;
                return;
            }

            //if (label && type) {
            //console.log( scope.showDefaultValue)
            if (type) {
                if ('range' in type) {
                    input = getText(label, scope.values, type.range.min, type.range.max, name);
                } else if ('node' in type) {
                    input = getNode(label, scope.getNodeDevices(), 'null', name);
                } else if ('enumof' in type) {
                    input = getEnum(label, type, scope.defaultValue, name, hideRadio,scope.showDefaultValue);
                } else if ('constant' in type) {
                    input = getConstant(label, type, scope.defaultValue, name);
                } else if ('string' in type) {
                    input = getString(label, scope.values, name);
                } else {
                    input = getDefault(label);
                }
                scope.input = input;
                return;
            }

        }

    };
});

angApp.directive('configDefaultValue', function() {
    return {
        restrict: "E",
        replace: true,
        template: '<span class="default-value-format"> {{input}}</span>',
        scope: {
            collection: '=',
            defaultValue: '=',
            showDefaultValue: '='
        },
        link: function(scope, element, attrs) {
            var input = '';
            if (!scope.collection) {
                return;
            }
            var label = scope.collection.label;
            var type = scope.collection.type;
            var name = scope.collection.name;
            var hideRadio = scope.collection.hideRadio;
            if (type) {
                if ('range' in type) {
                    //input = getText(label, scope.values, type.range.min, type.range.max, name);
                } else if ('node' in type) {
                    //input = getNode(label, scope.getNodeDevices(), 'null', name);
                } else if ('enumof' in type) {
                    input = getEnum(type, scope.defaultValue,scope.showDefaultValue);
                } else if ('constant' in type) {
                    //input = getConstant(label, type, scope.defaultValue, name);
                } else if ('string' in type) {
                    //input = getString(label, scope.values, name);
                } else {
                    input = scope.showDefaultValue;
                }
                scope.input = input;
                return;
            }


        }

    };

    // Get enumerators
    function getEnum(enums, defaultValue,showDefaultValue) {
        //console.log(enums)
        var input = showDefaultValue;
        if (!enums) {
            return;
        }
        angular.forEach(enums.enumof, function(v, k) {
            var title = v.label ? v.label : showDefaultValue;
            var type = v.type;

            if ('fix' in type) {
                if (type.fix.value == showDefaultValue) {
                    input = title;
                    return;
                }

            } else if ('range' in type) {
                var min = type.range.min;
                var max = type.range.max;
                var setVal = (defaultValue ? defaultValue : min);
                if (setVal == showDefaultValue) {
                    input = showDefaultValue;
                    return;
                }
            }

        });
        return input;
    }
});

angApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

/*** Fixes ***/
// js holder fix
angApp.directive('jsholderFix', function() {
    return {
        link: function(scope, element, attrs) {
            Holder.run({images: element[0], nocss: true});
        }
    };
});


/**
 * App filters
 * @author Martin Vach
 * @author Martin Hartnagel
 */

/**
 * Check if JSON keys/nodes exist
 */
angApp.filter('hasNode', function() {
    return function(obj, path) {
        path = path.split('.');
        var p = obj || {};
        for (var i in path) {
            if (p === null || typeof p[path[i]] === 'undefined') {
                return null;
            }
            p = p[path[i]];
        }
        return p;
    };
});

/**
 * Convert text to slug
 */
angApp.filter('stringToSlug', function() {
    return function(str) {
       str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
        var to = "aaaaeeeeiiiioooouuuunc------";
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
                .replace(/\s+/g, '-') // collapse whitespace and replace by -
                .replace(/-+/g, '-'); // collapse dashes

        return str;
    };
});
/**
 * Convert unix timastamp to date
 */
angApp.filter('getTimestamp', function() {
    return Math.round(+new Date() / 1000);
});

/**
 * Calculates difference between two dates in days
 */
angApp.filter('days_between', function() {
    return function(date1, date2) {
        return Math.round(Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
    };
});

/**
 * Return string with date in smart format: "hh:mm:ss" if current day, "hh:mm dd" if this week, "hh:mm dd mmmm" if this year, else "hh:mm dd mmmm yyyy"
 */ 
angApp.filter('getTime', function($filter) {
    return function(timestamp, invalidReturn) {
        var d = new Date(parseInt(timestamp, 10)*1000);
        if (timestamp === 0 || isNaN(d.getTime()))
            return invalidReturn

            var day = d.getDate();
        var mon = d.getMonth() + 1; //Months are zero based
        var year = d.getFullYear();
        var hrs = d.getHours();
        var min = (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes());
        var sec = (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds());

        var cd = new Date();

        var time;
        if ($filter('days_between')(cd, d) < 1 && cd.getDate() == d.getDate()) // this day
            time = hrs + ':' + min + ':' + sec;
        else if ($filter('days_between')(cd, d)  < 7 && ((cd < d) ^ (cd.getDay() >= d.getDay()))) // this week
            time = day + '. ' + hrs + ':' + min;
        else if (cd.getFullYear() == d.getFullYear()) // this year
            time = day + '.' + mon + '. ' + hrs + ':' + min;
        else // one upon a time
            time = day + '.' + mon + '.' + year + ' ' + hrs + ':' + min;

        return time;
    };
});


/**
 * Return "red" if the data is outdated or "" if up to date
 */
angApp.filter('getUpdated', function() {
    return function(data) {
        if (data === undefined)
            return '';
        return ((data.updateTime > data.invalidateTime) ?'':'red');
    };
});

/**
 * Strip HTML tags
 */
angApp.filter('stripTags', function() {
    return function(input) {
        return String(input).replace(/<[^>]+>/gm, '');
        //return  input.replace(/<\/?[^>]+(>|$)/g, "");
    };
});
/**
 * Display HTML tags in scope
 */
angApp.filter('toTrusted', ['$sce', function($sce){
       
        return function(text) {
             if(text == null){
            return '';
        }
            return $sce.trustAsHtml(text);
        };
    }]);

/**
 * Display device name
 */
angApp.filter('deviceName', function() {
    return function(deviceId,device) {
        var name = 'Device ' + '_' + deviceId;
        if (device === undefined) {
            return name;
        }
        if(device.data.givenName.value != ''){
             name = device.data.givenName.value;
        }
        return name;
    };
});

/**
 * Display device name
 */
angApp.filter('getDeviceName', function() {
    return function(deviceId,data) {
        var name = 'Device ' + deviceId;
       angular.forEach(data, function(v, k) {
              if(v.id == deviceId){
                name = v.name;
                return;
              }
                
            });
        return name;
    };
});

angApp.filter('getByProperty', function() {
    return function(propertyName, propertyValue, collection) {
        var i=0, len=collection.length;
        for (; i<len; i++) {
            if (collection[i][propertyName] == +propertyValue) {
                return collection[i];
            }
        }
        return null;
    };
});
// Convert unix timastamp to date
angApp.filter('dateFromUnix', function() {
    return function(input) {
        var d = new Date(input * 1000);
        var day = d.getDate();
        var mon = d.getMonth() + 1; //Months are zero based
        var year = d.getFullYear();
        var hrs = d.getHours();
        var min = (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes());
        var sec = (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds());
        var time = day + '.' + mon + '.' + year + ' ' + hrs + ':' + min + ':' + sec;
        return time;
    };
});

//Get current date time
angApp.filter('getCurrentDate', function() {
   
        var d = new Date();
        var day = d.getDate();
        var mon = d.getMonth() + 1; //Months are zero based
        var year = d.getFullYear();
        var hrs = d.getHours();
        var min = (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes());
        var sec = (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds());
        var time = day + '.' + mon + '.' + year + ' ' + hrs + ':' + min + ':' + sec;
        return time;
   
});

//Get current time
angApp.filter('getCurrentTime', function() {
    return function() {
        var d = new Date();
        var hrs = (d.getHours() < 10 ? '0' + d.getHours() : d.getHours());
        var min = (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes());
        var sec = (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds());
        var time = hrs + ':' + min + ':' + sec;
        return time;
    };
});

//Check for today
angApp.filter('isTodayFromUnix', function() {
    return function(input) {
        if(isNaN(input)){
            return '?';
        }
        var d = new Date(input * 1000);
        var day = (d.getDate() < 10 ? '0' + d.getDate() : d.getDate());
        var mon = d.getMonth() + 1; //Months are zero based
        mon = ( mon < 10 ? '0' +  mon :  mon);
        var year = d.getFullYear();
        var hrs = (d.getHours() < 10 ? '0' + d.getHours() : d.getHours());
        var min = (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes());
        var sec = (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds());

        if (d.toDateString() == (new Date()).toDateString()) {
            //return hrs + ':' + min + ':' + sec;
            return hrs + ':' + min;

        } else {
            //return day + '.' + mon + '.' + year + ' ' + hrs + ':' + min + ':' + sec;
            return day + '.' + mon + '.' + year;
        }
    };
});

/**
 * Replace Lock state with text
 */
angApp.filter('lockStatus', function() {
    return function(input) {
        var mode = input;
        var mode_lbl;

        if (mode === '' || mode === null) {
            mode_lbl = '?';
        } else {
            switch (mode) {
            case 0x00:
                mode_lbl = 'Open';
                break;
            case 0x10:
                mode_lbl = 'Open from inside';
                break;
            case 0x20:
                mode_lbl = 'Open from outside';
                break;
            case 0xff:
                mode_lbl = 'Closed';
                break;
            }
            ;
        };
        return  mode_lbl;
    };
});

/**
 * Replace Lock state with text
 */
angApp.filter('lockIsOpen', function() {
    return function(input) {
        var mode = input;
        var status = true;

        if (mode === '' || mode === null) {
            status = false;
        } else {
            switch (mode) {
            case 0x00:
                status = true;
                break;
            case 0x10:
                status = true;
                break;
            case 0x20:
                status = true;
                break;
            case 0xff:
                status = false;
                break;
            }
            ;
        };
        return  status;
    };
});


/**
 * Set battery icon
 */
angApp.filter('batteryIcon', function() {
    return function(input) {
        var icon = '';
        if(input >= 80){
            icon = 'fa fa-star fa-lg text-success';
        }
        if(input > 50 && input < 80){
            icon = 'fa fa-star-half-o fa-lg text-success';
        }
        if(input > 10 && input <= 50){
            icon = 'fa fa-star-half-o fa-lg text-danger';
        }
        if(input <= 10){
            icon = 'fa fa-star-o fa-lg text-danger';
        }
        return  icon;
    };
});

/**
 * Returns <code>true</code> if an association (in Association or Multichannel Association
class) form fromNode is set to toNodeId, <code>false</code> elsewise.
 * @param fromNode node to check if an association is set to toNodeId.
 * @param toNodeId node to check if an association from fromNode exists.
 */
angApp.filter('associationExists', function() {
    return function(fromNode, toNodeId) {
        var exists = false;
        $.each(fromNode.instances, function (index, instance) {
            if (!("commandClasses" in instance)) {
                return;
            }
            
            if (0x85 in instance.commandClasses) {
                for(var group = 0 ; group < instance.commandClasses[0x85].data.groups.value; group++) {
                    var associations = instance.commandClasses[0x85].data[group + 1].nodes.value;
                    if ($.inArray(parseInt(toNodeId), associations) != -1) {
                        exists = true;
                        return false;
                    }
                }
            }
            if (0x8e in instance.commandClasses) {
                for(var group = 0 ; group < instance.commandClasses[0x8e].data.groups.value; group++) {
                    var associations = instance.commandClasses[0x8e].data[group + 1].nodesInstances.value;
                    for(var i = 0; i < associations.length; i+=2) {
                        if (parseInt(toNodeId) == associations[i]) {
                            exists = true;
                            return false;
                        }
                    }
                }
            }
        });
        return exists;
    };
});

/**
 * Filter nodes which are updateable concerning routes.
 * @param batteryOnly if undefined includes all devices, if true includes only battery devices, if false includes only non-battery devices
 */
angApp.filter('updateable', function() {
    return function(node, nodeId, batteryOnly) {
        var nodeIsVirtual = node.data.isVirtual;
        var nodeBasicType = node.data.basicType;
        if (nodeId == 255 || nodeIsVirtual == null || nodeIsVirtual.value == true || nodeBasicType == null || nodeBasicType.value == 1) {
            return false;
        }
        if (batteryOnly != undefined) {
            var hasBattery = 0x80 in node.instances[0].commandClasses;
            return batteryOnly == hasBattery;
        }
        return true;
    };
});

/**
 * Count Routes
 */
angApp.filter('getRoutesCount', function($filter) {
    return function(ZWaveAPIData, nodeId) {
        var in_array=function(v, arr, return_index){
            for (var i=0; i<arr.length; i++)
                if (arr[i]==v) 
                    return return_index?i:true;
            return false;
        };
        var getFarNeighbours=function(nodeId, exludeNodeIds, hops) {
            if (hops === undefined) {
                var hops = 0;
                var exludeNodeIds = [nodeId];
            };

            if (hops > 2) // Z-Wave allows only 4 routers, but we are interested in only 2, since network becomes unstable if more that 2 routers are used in communications
                return [];

            var nodesList = [];
            angular.forEach(ZWaveAPIData.devices[nodeId].data.neighbours.value, function(nnodeId, index) {
                if (!(nnodeId in ZWaveAPIData.devices))
                    return; // skip deviced reported in routing table but absent in reality. This may happen after restore of routing table.
                if (!in_array(nnodeId, exludeNodeIds)) {
                    nodesList.push({ nodeId: nnodeId, hops: hops });
                    if (ZWaveAPIData.devices[nnodeId].data.isListening.value && ZWaveAPIData.devices[nnodeId].data.isRouting.value)
                        $.merge(nodesList, getFarNeighbours(nnodeId, $.merge([nnodeId], exludeNodeIds) /* this will not alter exludeNodeIds */, hops + 1));
                }
            });
            return nodesList;
        };

        var routesCount = {};
        angular.forEach(getFarNeighbours(nodeId), function(nnode, index) {
            if (nnode.nodeId in routesCount) {
                if (nnode.hops in routesCount[nnode.nodeId])
                    routesCount[nnode.nodeId][nnode.hops]++;
                else
                    routesCount[nnode.nodeId][nnode.hops] = 1;
            } else {
                routesCount[nnode.nodeId] = new Array();
                routesCount[nnode.nodeId][nnode.hops] = 1;
            }
        });
        return routesCount;
    };
});

/*
 * Set security icon
 */
angApp.filter('securityIcon', function() {
    return function(input) {
        //var icon = 'fa fa-minus';
        var icon = '&nbsp';
        if(input === false){
            icon = 'fa fa-check fa-lg text-danger';
        }
        if(input === true){
            icon = 'fa fa-check fa-lg text-success';
        }
        return  icon;
    };
});

/*
 * Set mwief icon
 */
angApp.filter('mwiefIcon', function() {
    return function(input) {
        //var icon = 'fa fa-minus';
        var icon = '&nbsp';
//        if(input === false){
//            icon = 'fa fa-check fa-lg text-danger';
//        }
        if(input){
            icon = 'fa fa-check fa-lg text-success';
        }
        return  icon;
    };
});

/*
 * Set mwief icon
 */
angApp.filter('checkedIcon', function() { 
    return function(input) {
        //var icon = 'fa fa-minus';
        var icon = '&nbsp';
//        if(input === false){
//            icon = 'fa fa-check fa-lg text-danger';
//        }
        if(input){
            icon = 'fa fa-check fa-lg text-success';
        }else{
             icon = 'fa fa-ban fa-lg text-danger';
        }
        return  icon;
    };
});

/**
 * Set zWavePlus icon
 */
angApp.filter('zWavePlusIcon', function() {
    return function(input) {
        //var icon = 'fa fa-minus';
        var icon = '&nbsp';
        if(input === true){
            icon = 'fa fa-plus fa-lg text-success';
        }
        return  icon;
    };
});

/**
 * Application factories
 * @author Martin Vach
 */

/*** Factories ***/
var appFactory = angular.module('appFactory', ['ngResource']);

/**
 * Caching the river...
 */
appFactory.factory('myCache', function($cacheFactory) {
    return $cacheFactory('myData');
});
/**
 * Data service
 * @todo: Replace all data handler with this service
 * @todo: Complete error handling
 */
appFactory.factory('dataService', function($http, $q, $interval, $filter, $location, $window,myCache, cfg) {
    var apiData;
    var apiDataInterval;
    var deviceClasses;
    var queueDataInterval;
    /**
     * Public functions
     */
    return({
        getZwaveData: getZwaveData,
        getZwaveDataQuietly: getZwaveDataQuietly,
        updateZwaveData: updateZwaveData,
        updateZwaveDataSince: updateZwaveDataSince,
        joinedZwaveData: joinedZwaveData,
        cancelZwaveDataInterval: cancelZwaveDataInterval,
        runCmd: runCmd,
        store: store,
        getDeviceClasses: getDeviceClasses,
        getSelectZDDX: getSelectZDDX,
        getTiming: getTiming,
        getQueueData: getQueueData,
        updateQueueData: updateQueueData,
        cancelQueueDataInterval: cancelQueueDataInterval,
        runJs: runJs,
        fwUpdate: fwUpdate,
        getNotes: getNotes,
        putNotes: putNotes,
        getReorgLog: getReorgLog,
        putReorgLog: putReorgLog,
        purgeCache: purgeCache,
        getLanguageFile: getLanguageFile
    });
    /**
     * Get IP
     */
    function getAppIp() {
        if (cfg.custom_ip) {
            var ip = cfg.server_url;
            if (!ip || ip == '') {
                $location.path('/');
            }
        }

    }

    /**
     * Gets all of the data in the remote collection.
     */
    function getZwaveData(callback) {
        getAppIp();
        var time = Math.round(+new Date() / 1000);
        if (apiData) {
            console.log('CACHED');
            return callback(apiData);
        }
        else {

            //pageLoader();
            console.log('NOOOOT CACHED');
            var request = $http({
                method: "POST",
                url: cfg.server_url + cfg.update_url + "0"
                        //url: 'storage/all_cp.json'
            });
            request.success(function(data) {
                $('#update_time_tick').html($filter('getCurrentTime')(time));
                apiData = data;
                pageLoader(true);
                return callback(data);
            }).error(function() {
                pageLoader(true);
                handleError(false, true, false);


            });
        }
    }

    /**
     * Gets all of the data in the remote collection without a "Loading data..." notification.
     */
    function getZwaveDataQuietly(callback) {
        var time = Math.round(+new Date() / 1000);
        if (apiData) {
            console.log('CACHED');
            return callback(apiData);
        }
        else {

            console.log('NOOOOT CACHED');
            var request = $http({
                method: "POST",
                url: cfg.server_url + cfg.update_url + "0"
            });
            request.success(function(data) {
                $('#update_time_tick').html($filter('getCurrentTime')(time));
                apiData = data;
                return callback(data);
            }).error(function() {
                handleError(false, true, true);

            });
        }
    }

    /**
     * Gets updated data in the remote collection.
     */
    function  updateZwaveData(callback) {
        var time = Math.round(+new Date() / 1000);
        var refresh = function() {
            var request = $http({
                method: "POST",
                url: cfg.server_url + cfg.update_url + time
            });
            request.success(function(data) {
                time = data.updateTime;
                $('#update_time_tick').html($filter('getCurrentTime')(time));
                return callback(data);
            }).error(function() {
                handleError();

            });
        };
        apiDataInterval = $interval(refresh, cfg.interval);
    }

    /**
     * Gets one update of data in the remote collection since a specific time.
     * @param since the time (in seconds) to update from.
     * @param callback called in case of successful data reception.
     * @param errorCallback called in case of error.
     */
    function updateZwaveDataSince(since, callback, errorCallback) {
        var time = since;
        var request = $http({
            method: "POST",
            url: cfg.server_url + cfg.update_url + time
        });
        request.success(function(data) {
            time = data.updateTime;
            $('#update_time_tick').html($filter('getCurrentTime')(time));
            return callback(data);
        }).error(function(error) {
            handleError();
            if (errorCallback !== undefined)
                errorCallback(error);
        });
    }

    /**
     * Get updated data and join with ZwaveData
     */
    function  joinedZwaveData(callback) {
        var time = Math.round(+new Date() / 1000);
       
        var result = {};
        var refresh = function() {
            //console.log(apiData);
            var request = $http({
                method: "POST",
                //url: "storage/updated.json"
                url: cfg.server_url + cfg.update_url + time
            });
            request.success(function(data) {
                $('#update_time_tick').html($filter('getCurrentTime')(time));
                if (!apiData|| !data)
                    return;
                time = data.updateTime;
                angular.forEach(data, function(obj, path) {
                   if(!angular.isString(path)){
                       return;
                   }
                    var pobj = apiData;
                    var pe_arr = path.split('.');
                    for (var pe in pe_arr.slice(0, -1)) {
                        pobj = pobj[pe_arr[pe]];
                    }
                    pobj[pe_arr.slice(-1)] = obj;
                });
                result = {
                    "joined": apiData,
                    "update": data
                };
                return callback(result);
            }).error(function() {
                handleError();

            });
        };
        apiDataInterval = $interval(refresh, cfg.interval);
    }


    /**
     * Cancel data interval
     */
    function cancelZwaveDataInterval() {
        if (angular.isDefined(apiDataInterval)) {
            $interval.cancel(apiDataInterval);
            apiDataInterval = undefined;
        }
        return;
    }

    /**
     * Run api cmd
     */
    function runCmd(param, request,error) {
        var url = (request ? cfg.server_url + request : cfg.server_url + cfg.store_url + param);
        var request = $http({
            method: 'POST',
            url: url
        });
        request.success(function(data) {
            $('button .fa-spin,a .fa-spin').fadeOut(1000);
            handleSuccess(data);
        }).error(function() {
            $('button .fa-spin,a .fa-spin').fadeOut(1000);
            if(error){
              $window.alert(error  + '\n' + url);  
            }

        });

    }

    /**
     * Run store api cmd
     */
    function store(param, success, error) {
        var url = cfg.server_url + cfg.store_url + param;
        var request = $http({
            method: 'POST',
            url: url
        });
        request.success(function(data) {
            handleSuccess(data);
            if (success)
                success();
        }).error(function(err) {
            handleError();
            if (error)
                error(err);
        });

    }

    /**
     * Get device classes from XML file
     */
    function getDeviceClasses(callback) {
        if (deviceClasses) {
            return callback(deviceClasses);
        }
        else {
            var request = $http({
                method: "get",
                url: cfg.server_url + cfg.device_classes_url
            });
            request.success(function(data) {
                var x2js = new X2JS();
                var json = x2js.xml_str2json(data);
                deviceClasses = json;
                return callback(deviceClasses);
            }).error(function() {
                handleError();

            });
        }
    }

    /**
     * Get zddx device selection
     */
    function getSelectZDDX(nodeId, callback) {
        if (deviceClasses) {
            return callback(deviceClasses);
        }
        else {
            var request = $http({
                method: "POST",
                url: cfg.server_url + '/ZWaveAPI/Run/devices[' + nodeId + '].GuessXML()'
            });
            request.success(function(data) {
                return callback(data);
            }).error(function() {
                console.log('Error: getSelectZDDX');
                // handleError();

            });
        }
    }

    /**
     * Get timing (statistics) data
     */
    function  getTiming(callback) {
        getAppIp();
        var request = $http({
            method: "POST",
            //url: 'storage/timing.json'
            url: cfg.server_url + '/ZWaveAPI/CommunicationStatistics'
        });
        request.success(function(data) {
            return callback(data);
        }).error(function() {
            console.log('Error: CommunicationStatistics');
            handleError(false, true);

        });
    }



    /**
     * Load Queue data
     */
    function getQueueData(callback) {
        if (typeof (callback) != 'function') {
            return;
        }
        ;
        var request = $http({
            method: "POST",
            url: cfg.server_url + cfg.queue_url
        });
        request.success(function(data) {
            return callback(data);
        }).error(function() {
            handleError();

        });
    }

    /**
     * Load and update Queue data
     */
    function updateQueueData(callback) {
        var refresh = function() {
            getQueueData(callback);
        };
        queueDataInterval = $interval(refresh, cfg.queue_interval);
    }
    /**
     * Cancel Queue interval
     */
    function cancelQueueDataInterval() {
        if (angular.isDefined(queueDataInterval)) {
            $interval.cancel(queueDataInterval);
            queueDataInterval = undefined;
        }
        return;
    }

    /**
     * Run JavaScript cmd
     */
    function runJs(param) {
        var request = $http({
            method: 'POST',
            dataType: "json",
            url: cfg.server_url + cfg.runjs_url + param
        });
        request.success(function(data) {
            handleSuccess(data);
        }).error(function() {
            handleError();

        });

    }

    /**
     * Run Firmware Update
     */
    function fwUpdate(nodeId, data) {
        var uploadUrl = cfg.server_url + cfg.fw_update_url + '/' + nodeId;
        var fd = new FormData();
        fd.append('file', data.file);
        fd.append('url', data.url);
        fd.append('targetId', data.targetId);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).success(function() {
            handleSuccess(data);
        }).error(function() {
            handleError();
        });

    }

    /**
     * Gets notes from remote text file
     */
    function getNotes(callback) {
        var request = $http({
            method: 'GET',
            url: cfg.server_url + cfg.notes_url
        });
        request.success(function(data) {
            return callback(data);
        }).error(function() {
            //handleError();
            console.log('Notes error');

        });

    }

    /**
     * Put notes in remote text file
     */
    function putNotes(notes) {
        var request = $http({
            method: "PUT",
            dataType: "text",
            url: cfg.server_url + cfg.notes_url,
            data: notes,
            headers: {
                "Content-Type": "application/json"
            }
        });
        request.success(function(data) {
            handleSuccess(data);
        }).error(function(error) {
            handleError();

        });
    }


    /**
     * Gets reorg log from remote text file
     */
    function getReorgLog(callback) {
        return $http({method: 'GET', url: cfg.server_url + cfg.reorg_log_url + '?at=' + (new Date()).getTime()}).success(function(data, status, headers, config) {
            callback(data);
        });
    }

    /**
     * Put reorg log in remote text file
     */
    function putReorgLog(log) {
        return $.ajax({
            type: "PUT",
            dataType: "text",
            url: cfg.server_url + cfg.reorg_log_url,
            contentType: "text/plain",
            data: log
        });
    }

    /**
     * Clear the cached ZWaveData.
     */
    function purgeCache() {
        apiData = undefined;
    }
    
    /**
     * Load language file
     */
    function getLanguageFile(callback,lang) {
        var langFile = 'language.' + lang + '.json';
        var cached = myCache.get(langFile);
        if (cached) {
           return callback(cached);
        }
        var request = {
            method: "get",
            url: cfg.lang_dir + langFile
        };
        return $http(request).success(function(data) {
                myCache.put(langFile, data);
                return callback(data);
            }).error(function() {
                handleError(false,true);

            });
    }

    /**
     * 
     * Handle errors
     */
    function handleError(message, showResponse, hideContent) {
        // Custom IP show/hide
        $('.custom-ip-error').show();
        $('.custom-ip-success').hide();

        var msg = (message ? message : 'Error handling data from server');
        if (showResponse) {
            $('#respone_container').show();
            $('#respone_container_inner').html('<div class="alert alert-danger alert-dismissable response-message"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button> <i class="icon-ban-circle"></i> ' + msg + '</div>');
        }
        $('.error-hide').hide();

        if (hideContent) {
            $('#main_content').hide();
        }

        console.log('Error');

    }

    /**
     * 
     * Handle cmd errors
     */
    function handleCmdError(message) {
        var msg = (message ? message : 'Error handling data from server');
        $('#respone_container').show();
        $('#respone_container_inner').html('<div class="alert alert-danger alert-dismissable response-message"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button> <i class="icon-ban-circle"></i> ' + msg + '</div>');
        console.log('Error');

    }

    /**
     * Handle success response
     */
    function handleSuccess(response) {
        console.log('Success');
        return;

    }

    /**
     * Show / Hide page loader
     */
    function pageLoader(hide) {
        // Custom IP show/hide
        $('.custom-ip-error').hide();
        $('.custom-ip-success').show();

        if (hide) {
            $('#respone_container').hide();
            $('#main_content').show();
            $('.error-hide').show();
            return;
        }
        //$('#main_content').hide();
        $('#respone_container').show();
        $('#respone_container_inner').html('<div class="alert alert-warning page-load-spinner"><i class="fa fa-spinner fa-lg fa-spin"></i><br /> Loading data....</div>');
        return;

    }
});



/**
 * Application services
 * @author Martin Vach
 */
var appService = angular.module('appService', []);

/**
 * Device service
 */
appService.service('deviceService', function($filter) {
    /// --- Public functions --- ///

    /**
     * Get language line by key
     */
    this.getLangLine = function(key, languages) {
        if (angular.isObject(languages)) {
            if (angular.isDefined(languages[key])) {
                return languages[key] !== '' ? languages[key] : key;
            }
        }
        return key;
    };

    /**
     * Check if is not device
     */
    this.notDevice = function(ZWaveAPIData, node, nodeId) {
        if (nodeId == 255 || nodeId == ZWaveAPIData.controller.data.nodeId.value || node.data.isVirtual.value) {
            return true;
        }
        return false;
    };

    /**
     * Check if device isFailed
     */
    this.isFailed = function(node) {
        return node.data.isFailed.value;
    };

    /**
     * Check if device isListening
     */
    this.isListening = function(node) {
        return node.data.isListening.value;
    };

    /**
     * Check if device isFLiRS
     */
    this.isFLiRS = function(node) {
        return !node.data.isListening.value && (node.data.sensor250.value || node.data.sensor1000.value);
    };

    /**
     * Check if device is reset locally
     */
    this.isLocalyReset = function(node) {
        return isLocalyReset(node);
    };

    /**
     * Get language from zddx
     */
    this.configGetZddxLang = function(node, lang) {
        return configGetZddxLang(node, lang);
    };


    /// --- Private functions --- ///
    /**
     * isLocalyReset
     */
    function isLocalyReset(node) {
        var isLocalyReset = false;
        for (var iId in node.instances) {
            if (node.instances[iId].commandClasses[90]) {
                isLocalyReset = node.instances[iId].commandClasses[90].data.reset.value;
            }
        }
        return isLocalyReset;
    }

    /**
     *  Get language from zddx
     */
    function configGetZddxLang(langs, currLang) {
       var label = null;
       if (!langs) {
            return label;
        }
        
       if (angular.isArray(langs)) {
            angular.forEach(langs, function(lang, index) {
                if (("__text" in lang) && (lang["_xml:lang"] == currLang)) {
                    label = lang.__text;
                    return false;
                }
                if (("__text" in lang) && (lang["_xml:lang"] == "en")) {
                    label = lang.__text;
                }
            });
        } else {
            if (("__text" in langs)) {
                label = langs.__text;
            }
        }
        return label;
    }
});

/**
 * Application controllers and factories
 * @author Martin Vach
 */

/*** Controllers ***/
var appController = angular.module('appController', []);

// Base controller
appController.controller('BaseController', function($scope, $cookies, $filter, $location, $window,cfg, dataService, deviceService, myCache) {
    // Custom IP
    $scope.customIP = {
        'url': cfg.server_url,
        'message': false,
        'connected': false
    };
    $scope.showHome = true;
    if (cfg.custom_ip === true) {
        $scope.showHome = false;
    }
    // Is mobile
    $scope.isMobile = false;

    // Show page content
    $scope.showContent = false;
    // Global config
    $scope.cfg = cfg;

    // Lang settings
    $scope.lang_list = cfg.lang_list;
    // Set language
    $scope.lang = (angular.isDefined($cookies.lang) ? $cookies.lang : cfg.lang);
    $('.current-lang').html($scope.lang);
    $scope.changeLang = function(lang) {
        $window.alert($scope._t('language_select_reload_interface'));
        $cookies.lang = lang;
        $scope.lang = lang;
    };
    // Load language files
    $scope.loadLang = function(lang) {
        // Is lang in language list?
        var lang = (cfg.lang_list.indexOf(lang) > -1 ? lang : cfg.lang);
        dataService.getLanguageFile(function(data) {
            $cookies.langFile = {'ab': 25};
            $scope.languages = data;
        }, lang);


    };
    // Get language lines
    $scope._t = function(key) {
        return deviceService.getLangLine(key, $scope.languages);
    };

    // Watch for lang change
    $scope.$watch('lang', function() {
        $('.current-lang').html($scope.lang);
        $scope.loadLang($scope.lang);
    });
    // Navi time
    $scope.navTime = $filter('getCurrentTime');
    // Order by
    $scope.orderBy = function(field) {
        $scope.predicate = field;
        $scope.reverse = !$scope.reverse;
    };
    // Get body ID
    $scope.getBodyId = function() {
        var path = $location.path();
        var lastSegment = path.split('/').pop();
        return lastSegment;
    };

    $scope.mobileCheck = function(a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
            $scope.isMobile = true;
        }
    };
    $scope.mobileCheck(navigator.userAgent || navigator.vendor || window.opera);



});

// Test controller
appController.controller('TestController', function($scope, $filter, $timeout, $upload, dataService) {
    $scope.timeInMs = 0;
    $scope.dataSet;
    $scope.devices = [];
    $scope.ZWaveAPIData = [];
    $scope.reset = function() {
        $scope.devices = angular.copy([]);
    };
    $scope.from = "ZWaveAPIData";
    var countUp = function() {
        $scope.timeInMs += 1;
        $timeout(countUp, 1000);
    };
    $timeout(countUp, 1000);

    $scope.loadData = function() {

        dataService.getZwaveData(function(ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            setData(ZWaveAPIData);
//            dataService.joinedZwaveData(function(data) {
//                console.log(data.joined);
//                //console.log(ZWaveAPIData.updateTime);
//                $scope.reset();
//                $scope.from = "Update";
//                $scope.ZWaveAPIData = ZWaveAPIData;
//                setData(ZWaveAPIData);
//            });
        });
    };
    $scope.loadData();

    function setData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }
            //var abc = jPath(ZWaveAPIData, 'updateTime');
            //console.log(hasNode(node, 'data.isListening.value'));
            console.log($filter('hasNode')(node, 'data.isListening.value'));
            // Set object
            var obj = {};
            obj['id'] = nodeId;
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['time'] = ZWaveAPIData.updateTime;
            $scope.devices.push(obj);
        });
    }
    ;

    // Refresh data
    $scope.refresh = function(ZWaveAPIData) {
        console.log(ZWaveAPIData);
        dataService.updateZwaveData(function(data) {

        });
    };
    //$scope.refresh($scope.ZWaveAPIData);

    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });


});

// Statistics controller
appController.controller('HelpController', function($scope, $routeParams) {
    $scope.nodeId = $routeParams.nodeId;
});

// Home controller
appController.controller('HomeController', function($scope, $filter, $timeout, $route, dataService, deviceService, cfg) {
    $scope.ZWaveAPIData;
    $scope.countDevices;
    $scope.failedDevices = [];
    $scope.batteryDevices;
    $scope.lowBatteryDevices = [];
    $scope.flirsDevices;
    $scope.mainsDevices;
    $scope.localyResetDevices = [];
    $scope.notInterviewDevices = [];
    $scope.assocRemovedDevices = [];
    $scope.notes = [];
    $scope.notesData = '';
    $scope.updateTime = $filter('getTimestamp');

    $scope.reset = function() {
        $scope.failedDevices = angular.copy([]);
        $scope.lowBatteryDevices = angular.copy([]);
        $scope.notInterviewDevices = angular.copy([]);
        $scope.localyResetDevices = angular.copy([]);
        $scope.assocRemovedDevices = angular.copy([]);

    };


    /**
     * Notes
     */
    $scope.loadNotesData = function() {
        dataService.getNotes(function(data) {
            $scope.notesData = data;
        });
    };


    /**
     * Load data
     *
     */
    $scope.loadData = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            notInterviewDevices(ZWaveAPIData);
            notInterviewDevices(ZWaveAPIData);
            countDevices(ZWaveAPIData);
            assocRemovedDevices(ZWaveAPIData);
            batteryDevices(ZWaveAPIData);
            $scope.mainsDevices = $scope.countDevices - $scope.batteryDevices;
            dataService.joinedZwaveData(function(data) {
                $scope.reset();
                notInterviewDevices(data.joined);
                countDevices(data.joined);
                assocRemovedDevices(data.joined);
                batteryDevices(data.joined);
                $scope.mainsDevices = $scope.countDevices - $scope.batteryDevices;

            });
        });
    };
    if (!cfg.custom_ip) {
        $scope.loadData();
        $scope.loadNotesData();
    } else {
        if (cfg.server_url != '') {
            $scope.loadData();
            $scope.loadNotesData();
        }
    }


    /**
     * Set custom IP
     */
    $scope.setIP = function(ip) {
        if (!ip || ip == '') {
            $('.custom-ip-error').show();
            return;
        }
        dataService.cancelZwaveDataInterval();
        $('.custom-ip-success,.custom-ip-true .home-page').hide();
        var setIp = 'http://' + ip + ':8083';
        cfg.server_url = setIp;
        dataService.purgeCache();
        $scope.loadHomeData = true;
        //$scope.loadData();
        $route.reload();
//        $http.get(setIp)
//                .success(function(data, status, headers, config) {
//                    dataService.purgeCache();
//                    cfg.server_url = setIp;
//                    $scope.showHome = true;
//                    $scope.customIP.message = false;
//                     $scope.customIP.connected = 'Connected to: ' + setIp;
//                    $route.reload();
//                }).error(function(data, status, headers, config) {
//            $scope.showHome = false;
//            $scope.customIP.message = 'Server error';
//            $scope.customIP.connected = false;
//        });

//        dataService.getZwaveData(function(ZWaveAPIData) {
//        });
    };

    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });
    /**
     * Save notes
     */
    $scope.saveNotes = function(form, btn) {
        var input = $('#' + form + ' #note').val();
        if (!input || input == '') {
            return;
        }
        $(btn).attr('disabled', true);
        dataService.putNotes(input);

        $timeout(function() {
            $(btn).removeAttr('disabled');
        }, 2000);
        return;


    };

    /// --- Private functions --- ///

    /**
     * Count devices
     */
    function countDevices(ZWaveAPIData) {
        var cnt = 0;
        var cntFlirs = 0;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {

            if (deviceService.notDevice(ZWaveAPIData, node, nodeId)) {
                return;
            }
            var isFLiRS = deviceService.isFLiRS(node);
            var isLocalyReset = deviceService.isLocalyReset(node);
            var isFailed = deviceService.isFailed(node);

            if (isFLiRS) {
                cntFlirs++;
            }

            var obj = {};
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['id'] = nodeId;
            if (isFailed) {
                $scope.failedDevices.push(obj);
            }
            if (isLocalyReset) {
                $scope.localyResetDevices.push(obj);
            }

            cnt++;
        });
        $scope.flirsDevices = cntFlirs;
        $scope.countDevices = cnt;
    }
    ;

    /**
     * batteryDevices
     */
    function batteryDevices(ZWaveAPIData) {
        var controllerId = ZWaveAPIData.controller.data.nodeId.value;
        var cnt = 0;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerId || node.data.isVirtual.value) {
                return;
            }
            var hasBattery = 0x80 in node.instances[0].commandClasses;
            var instanceId = 0;
            var interviewDone = false;
            var ccId = 0x80;
            if (!hasBattery) {
                return;
            }
            // Is interview done
            for (var iId in ZWaveAPIData.devices[nodeId].instances) {
                for (var ccId in ZWaveAPIData.devices[nodeId].instances[iId].commandClasses) {
                    var isDone = ZWaveAPIData.devices[nodeId].instances[iId].commandClasses[ccId].data.interviewDone.value;
                    if (isDone != false) {
                        interviewDone = true;
                    }
                }
            }
            var node = ZWaveAPIData.devices[nodeId];
            var battery_charge = parseInt(node.instances[0].commandClasses[0x80].data.last.value);
            var obj = {};
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['id'] = nodeId;
            obj['battery_charge'] = battery_charge;
            if (battery_charge <= 20 && interviewDone) {
                $scope.lowBatteryDevices.push(obj);
            }
            cnt++;
        });
        $scope.batteryDevices = cnt;
    }
    ;

    /**
     * notInterviewDevices
     */
    function notInterviewDevices(ZWaveAPIData) {
        var controllerId = ZWaveAPIData.controller.data.nodeId.value;
        var cnt = 0;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerId || node.data.isVirtual.value) {
                return;
            }
            var obj = {};
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['id'] = nodeId;
            for (var iId in ZWaveAPIData.devices[nodeId].instances) {
                for (var ccId in ZWaveAPIData.devices[nodeId].instances[iId].commandClasses) {
                    var isDone = ZWaveAPIData.devices[nodeId].instances[iId].commandClasses[ccId].data.interviewDone.value;
                    if (isDone == false) {
                        $scope.notInterviewDevices.push(obj);
                        return;
                    }
                }
            }
            cnt++;
        });
        return cnt;
    }
    ;
    /**
     * assocRemovedDevices
     */
    function assocRemovedDevices(ZWaveAPIData) {
        var controllerId = ZWaveAPIData.controller.data.nodeId.value;
        var cnt = 0;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerId || node.data.isVirtual.value) {
                return;
            }
            var removedDevices = assocGedRemovedDevices(node, ZWaveAPIData);
            if (removedDevices.length > 0) {

                var obj = {};
                obj['name'] = $filter('deviceName')(nodeId, node);
                obj['id'] = nodeId;
                obj['assoc'] = removedDevices;
                $scope.assocRemovedDevices.push(obj);
                cnt++;
            }
        });
        return cnt;
    }
    ;

    /**
     * assocGedRemovedDevices
     */
    function assocGedRemovedDevices(node, ZWaveAPIData) {
        var assocDevices = [];
        var data;
        if (0x85 in node.instances[0].commandClasses) {
            var cc = node.instances[0].commandClasses[0x85].data;
            if (cc.groups.value >= 1) {
                for (var grp_num = 1; grp_num <= parseInt(cc.groups.value, 10); grp_num++) {
                    data = cc[grp_num];
                    for (var i = 0; i < data.nodes.value.length; i++) {
                        var targetNodeId = data.nodes.value[i];
                        if (!(targetNodeId in ZWaveAPIData.devices)) {
                            assocDevices.push({'id': targetNodeId, 'name': '(#' + targetNodeId + ') ' + $filter('deviceName')(targetNodeId, ZWaveAPIData.devices[targetNodeId])});
                        }
                    }

                }
            }
        }

        if (0x8e in node.instances[0].commandClasses) {
            var cc = node.instances[0].commandClasses[0x8e].data;
            if (cc.groups.value >= 1) {
                for (var grp_num = 1; grp_num <= parseInt(cc.groups.value, 10); grp_num++) {

                    data = cc[grp_num];

                    for (var i = 0; i < data.nodesInstances.value.length; i += 2) {
                        var targetNodeId = data.nodesInstances.value[i];
                        var targetInstanceId = data.nodesInstances.value[i + 1];
                        var instanceId = (targetInstanceId > 0 ? '.' + targetInstanceId : '');
                        if (!(targetNodeId in ZWaveAPIData.devices)) {
                            assocDevices.push({'id': targetNodeId, 'name': '(#' + targetNodeId + instanceId + ') ' + $filter('deviceName')(targetNodeId, ZWaveAPIData.devices[targetNodeId])});
                        }

                    }
                }
            }
        }
        if (assocDevices.length > 0) {
            //console.log(assocDevices)
        }

        return assocDevices;
    }
    ;
});

// Switch controller
appController.controller('SwitchController', function($scope, $filter, dataService, cfg) {
    $scope.switches = [];
    $scope.rangeSlider = [];
    $scope.updateTime = $filter('getTimestamp');
    $scope.reset = function() {
        $scope.switches = angular.copy([]);
    };

    // Load data
    $scope.load = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            dataService.joinedZwaveData(function(data) {
                refreshData(data);
            });
        });
    };


    // Load data
    $scope.load();

    // Refresh data
    $scope.refresh = function() {
        dataService.joinedZwaveData(function(data) {
            $scope.reset();
            setData(data.joined);
        });
    };
    //$scope.refresh();

    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });

    // Store data from on remote server
    $scope.store = function(btn) {
        var url = $(btn).attr('data-store-url');
        dataService.runCmd(url, false, $scope._t('error_handling_data'));
    };

    // Store all data on remote server
    $scope.storeAll = function(id) {
        angular.forEach($scope.switches, function(v, k) {
            dataService.runCmd(v.urlToStore);
        });
    };

    // Store data with switch all
    $scope.storeSwitchAll = function(btn) {
        var action_url = $(btn).attr('data-store-url');
        angular.forEach($scope.switches, function(v, k) {
            var url = 'devices[' + v['id'] + '].instances[0].commandClasses[0x27].' + action_url;
            if (v.hasSwitchAll) {
                dataService.runCmd(url);
            }
        });
        ;
    };

    $scope.sliderChange = function(cmd, index) {
        var val = $scope.rangeSlider[index];
        var url = cmd + '.Set(' + val + ')';
        dataService.runCmd(url, false, $scope._t('error_handling_data'));
    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }

            // Loop throught instances
            var cnt = 1;
            angular.forEach(node.instances, function(instance, instanceId) {
                if (instanceId == 0 && node.instances.length > 1) {
                    return;
                }
                var hasBinary = 0x25 in instance.commandClasses;
                var hasMultilevel = 0x26 in instance.commandClasses;
                var switchAllValue = null;
                var hasSwitchAll = (0x27 in instance.commandClasses) && (instanceId == 0);
                if (hasSwitchAll) {
                    switchAllValue = instance.commandClasses[0x27].data.mode.value;
                }

                var ccId;
                var deviceType = null;
                if (hasMultilevel) {
                    ccId = 0x26;
                    deviceType = 'multilevel';
                } else if (hasBinary) {
                    ccId = 0x25;
                    deviceType = 'binary';
                } else {
                    return; // we skip instance if there is no SwitchBinary or SwitchMultilevel CCs
                }

                var genericType = ZWaveAPIData.devices[nodeId].data.genericType.value;
                var specificType = ZWaveAPIData.devices[nodeId].data.specificType.value;
                var genspecType = genericType + '/' + specificType;

                // Set object
                var obj = {};

                // Motor devices
                var btnOn = $scope._t('switched_on');
                var btnOff = $scope._t('switched_off');
                var btnFull = $scope._t('btn_full');
                var hasMotor = false;
                var motorDevices = ['17/3', '17/5', '17/6', '17/7', '9/0', ' 9/1'];
                if (motorDevices.indexOf(genspecType) !== -1) {
                    btnOn = $scope._t('btn_switched_up');
                    btnOff = $scope._t('btn_switched_down');
                    hasMotor = true;
                }
                //console.log(nodeId + '.' + instanceId + ': ' + genspecType + ' motor: ' + hasMotor);
                var multiChannel = false;
                if (0x60 in instance.commandClasses) {
                    multiChannel = true;
                }
                var level = updateLevel(instance.commandClasses[ccId].data.level, ccId, btnOn, btnOff);

                obj['id'] = nodeId;
                obj['cmd'] = instance.commandClasses[ccId].data.name + '.level';
                obj['iId'] = instanceId;
                obj['ccId'] = ccId;
                obj['hasMotor'] = hasMotor;
                obj['multiChannel'] = multiChannel;
                obj['deviceType'] = deviceType;
                obj['genericType'] = genericType;
                obj['specificType'] = specificType;
                obj['hasSwitchAll'] = hasSwitchAll;
                obj['switchAllValue'] = switchAllValue;
                obj['rowId'] = 'switch_' + nodeId + '_' + cnt;
                obj['name'] = $filter('deviceName')(nodeId, node);
                obj['updateTime'] = instance.commandClasses[ccId].data.level.updateTime;
                obj['invalidateTime'] = instance.commandClasses[ccId].data.level.invalidateTime;
                obj['urlToStore'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].Get()';
                obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                //obj['level'] = ZWaveAPIData.devices[nodeId].instances[instanceId].commandClasses[ccId].data.level;
                obj['level'] = level.level_cont;
                obj['levelColor'] = level.level_color;
                obj['levelStatus'] = level.level_status;
                obj['levelMax'] = level.level_max;
                obj['levelVal'] = level.level_val;
                obj['urlToOff'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].Set(0)';
                obj['urlToOn'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].Set(255)';
                obj['urlToFull'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].Set(99)';
                obj['urlToSlide'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + ']';
                obj['btnOn'] = btnOn;
                obj['btnOff'] = btnOff;
                obj['btnFull'] = btnFull;
                obj['cmdToUpdate'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data.level';


                $scope.switches.push(obj);
                $scope.rangeSlider.push(obj['range_' + nodeId] = level.level_val);
                cnt++;
            });
        });
    }
    ;

    /**
     * Refresh zwave data
     */
    function refreshData(data) {
        angular.forEach($scope.switches, function(v, k) {
            //console.log(v.cmdToUpdate);
            //return;
            var obj = data.update[v.cmdToUpdate];
            if (v.cmdToUpdate in data.update) {
                var level = updateLevel(obj, v.ccId, v.btnOn, v.btnOff);
                var updateTime = obj.updateTime;
                var invalidateTime = obj.invalidateTime;
                var formatTime = $filter('isTodayFromUnix')(updateTime);
                $('#' + v.rowId + ' .row-level').html(level.level_cont).css({color: level.level_color});
                $('#' + v.rowId + ' .row-time').html(formatTime);
                if (updateTime > invalidateTime) {
                    $('#' + v.rowId + ' .row-time').removeClass('is-updated-false');
                }
                $("#the_item_id").css({backgroundColor: "#333", color: "#FFF"});
                //console.log('Updating:' + v.rowId + ' | At: ' + updateTime + ' | with: ' + level);//REM
            }
        });
    }

    // Update level
    function updateLevel(obj, ccId, btnOn, btnOff) {

        var level_cont;
        var level_color;
        var level_status = 'off';
        var level_val = 0;
        var level_max = 99;

        //var level = obj.value;
        var level = (angular.isDefined(obj.value) ? obj.value : null);

        if (level === '' || level === null) {
            level_cont = '?';
            level_color = 'gray';
        } else {
            if (level === false)
                level = 0;
            if (level === true)
                level = 255;
            level = parseInt(level, 10);
            if (level === 0) {
                level_cont = btnOff;
                level_color = '#a94442';
            } else if (level === 255 || level === 99) {
                level_status = 'on';
                level_cont = btnOn;
                level_color = '#3c763d';
//                if(level > 99){
//                    level_max = 255;
//                }
                //level_val = level;
                level_val = (level < 100 ? level : 99);
            } else {
                level_cont = level.toString() + ((ccId == 0x26) ? '%' : '');
                var lvlc_r = ('00' + parseInt(0x9F + 0x60 * level / 99).toString(16)).slice(-2);
                var lvlc_g = ('00' + parseInt(0x7F + 0x50 * level / 99).toString(16)).slice(-2);
                level_color = '#' + lvlc_r + lvlc_g + '00';
                level_status = 'on';
                // level_val = level;
                level_val = (level < 100 ? level : 99);
            }
        }
        ;
        return {"level_cont": level_cont, "level_color": level_color, "level_status": level_status, "level_val": level_val, "level_max": level_max};
    }
    ;
});

/**
 * Sensors controller
 */
appController.controller('SensorsController', function($scope, $filter, dataService) {
    $scope.sensors = [];
    $scope.reset = function() {
        $scope.sensors = angular.copy([]);
    };

    // Load data
    $scope.load = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            dataService.joinedZwaveData(function(data) {
                refreshData(data);
            });
        });
    };
    // Load data
    $scope.load($scope.lang);

    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });

    // Store data from on remote server
    $scope.store = function(cmd) {
        dataService.runCmd(cmd, false, $scope._t('error_handling_data'));
    };

    // Store all data on remote server
    $scope.storeAll = function(id) {
        var btn = '#btn_update_' + id;
        angular.forEach($scope.sensors, function(v, k) {
            dataService.runCmd(v.urlToStore);
        });
    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
        $scope.updateTime = ZWaveAPIData.updateTime;
        $scope.controllerId = ZWaveAPIData.controller.data.nodeId.value;

        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(device, k) {
            if (k == 255 || k == $scope.controllerId || device.data.isVirtual.value) {
                return false;
            }
            // Loop throught instances
            angular.forEach(device.instances, function(instance, instanceId) {
               
                if (instanceId == 0 && device.instances.length > 1) {
                    return;
                }
                // Look for SensorBinary - Loop throught 0x30 commandClasses
                var sensorBinary = instance.commandClasses[0x30];
               
                if (angular.isObject(sensorBinary)) {
                     var cnt = 0;
                    angular.forEach(sensorBinary.data, function(val, key) {
                        // Not a sensor type
                        var sensor_type = parseInt(key, 10);
                        if (isNaN(sensor_type)) {
                            return;
                        }
                        
                        // Set object
                        var obj = {};
                        obj['id'] = k;
                        obj['iId'] = instanceId;
                        obj['cmd'] = sensorBinary.data.name + '.' + val.name;
                        obj['cmdId'] = '48';
                        obj['rowId'] = sensorBinary.name + '_' + val.name + '_' + k + '_' + cnt;
                        obj['name'] = $filter('deviceName')(k, device);
                        obj['type'] = sensorBinary.name;
                        obj['purpose'] = val.sensorTypeString.value;
                        obj['level'] = (val.level.value ? $scope._t('sensor_triggered') : $scope._t('sensor_idle'));
                        obj['levelExt'] = null;
                        obj['invalidateTime'] = val.invalidateTime;
                        obj['updateTime'] = val.updateTime;
                        obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                        obj['urlToStore'] = 'devices[' + obj['id'] + '].instances[' + instanceId + '].commandClasses[48].Get()';
                        obj['cmdToUpdate'] = 'devices.' + obj['id'] + '.instances.' + instanceId + '.commandClasses.48.data.' + sensor_type;
                        // Push to sensors
                        $scope.sensors.push(obj);
                        cnt++;
                    });
                }


                // Look for SensorMultilevel - Loop throught 0x31 commandClasses
                var sensorMultilevel = instance.commandClasses[0x31];
                if (angular.isObject(sensorMultilevel)) {
                    var cnt = 0;
                    angular.forEach(sensorMultilevel.data, function(val, key) {
                        // Not a sensor type
                        var sensor_type = parseInt(key, 10);
                        if (isNaN(sensor_type)) {
                            return;
                        }

                        obj = instance.commandClasses[0x31];
                        // Check for commandClasses data
                        var obj = {};
                        obj['id'] = k;
                        obj['iId'] = instanceId;
                        obj['cmd'] = sensorMultilevel.data.name + '.' + val.name;
                        obj['cmdId'] = '49';
                        obj['rowId'] = sensorMultilevel.name + '_' + val.name + '_' + k + '_' + cnt;
                        obj['name'] = $filter('deviceName')(k, device);
                        obj['type'] = sensorMultilevel.name;
                        obj['purpose'] = val.sensorTypeString.value;
                        obj['level'] = val.val.value;
                        obj['levelExt'] = val.scaleString.value;
                        obj['invalidateTime'] = val.invalidateTime;
                        obj['updateTime'] = val.updateTime;
                        obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                        obj['urlToStore'] = 'devices[' + obj['id'] + '].instances[' + instanceId + '].commandClasses[49].Get()';
                        obj['cmdToUpdate'] = 'devices.' + obj['id'] + '.instances.' + instanceId + '.commandClasses.49.data.' + sensor_type;
                        // Push to sensors
                        $scope.sensors.push(obj);
                        cnt++;
                    });
                }

                // Look for Meter - Loop throught 0x32 commandClasses
                var meters = instance.commandClasses[0x32];
                var cnt = 0;
                if (angular.isObject(meters)) {
                    angular.forEach(meters.data, function(meter, key) {
                        realEMeterScales = [0, 1, 3, 8, 9];// Not in [0, 1, 3, 8, 9] !== -1
                        var sensor_type = parseInt(key, 10);
                        if (isNaN(sensor_type)) {
                            return;
                        }

                        if (meter.sensorType.value == 1 && realEMeterScales.indexOf(sensor_type) != -1) {
                            return; // filter only for eMeters
                        }
                        if (meter.sensorType.value > 1) {
                            return; //  gas and water have real meter scales
                        }
                        var obj = {};

                        obj['id'] = k;
                        obj['iId'] = instanceId;
                        obj['cmd'] = meters.data.name + '.' + meter.name;
                        obj['cmdId'] = '50';
                        obj['rowId'] = meters.name + '_' + meter.name + '_' + k + '_' + cnt;
                        obj['name'] = $filter('deviceName')(k, device);
                        obj['type'] = meters.name;
                        obj['purpose'] = meter.sensorTypeString.value;
                        obj['level'] = meter.val.value;
                        obj['levelExt'] = meter.scaleString.value;
                        obj['invalidateTime'] = meter.invalidateTime;
                        obj['updateTime'] = meter.updateTime;
                        obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                        obj['urlToStore'] = 'devices[' + obj['id'] + '].instances[' + instanceId + '].commandClasses[50].Get()';
                        obj['cmdToUpdate'] = 'devices.' + obj['id'] + '.instances.' + instanceId + '.commandClasses.50.data.' + sensor_type;
                        $scope.sensors.push(obj);
                        cnt++;
                    });
                }
                
                 var alarmSensor = instance.commandClasses[0x9c];
                 if (angular.isObject(alarmSensor)) {
                     //return;
                    var cnt = 0;
                    angular.forEach(alarmSensor.data, function(val, key) {
                        // Not a sensor type
                        var sensor_type = parseInt(key, 10);
                        if (isNaN(sensor_type)) {
                            return;
                        }
                        // Set object
                        var obj = {};
                        obj['id'] = k;
                        obj['iId'] = instanceId;
                        obj['cmd'] = alarmSensor.data.name + '.' + val.name;
                        obj['cmdId'] = '0x9c';
                        obj['rowId'] = alarmSensor.name + '_' + val.name + '_' + k + '_' + cnt;
                        obj['name'] = $filter('deviceName')(k, device);
                        obj['type'] = alarmSensor.name;
                        obj['purpose'] = val.typeString.value;
                        obj['level'] = (val.value ? $scope._t('sensor_triggered') : $scope._t('sensor_idle'));
                        obj['levelExt'] = null;
                        obj['invalidateTime'] = val.invalidateTime;
                        obj['updateTime'] = val.updateTime;
                        obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                        obj['urlToStore'] = 'devices[' + obj['id'] + '].instances[' + instanceId + '].commandClasses[0x9c].Get()';
                        obj['cmdToUpdate'] = 'devices.' + obj['id'] + '.instances.' + instanceId + '.commandClasses.0x9c.data.' + sensor_type;
                        // Push to sensors
                        $scope.sensors.push(obj);
                        cnt++;
                    });
                }

            });

        });
    }
    /**
     * Refresh zwave data
     */
    function refreshData(data) {
        angular.forEach($scope.sensors, function(v, k) {
            // Check for updated data
            if (v.cmdToUpdate in data.update) {
                var obj = data.update[v.cmdToUpdate];
                var level = '';
                var updateTime = 0;
                var invalidateTime = 0;
                var levelExt;
                if (v.cmdId == 0x30) {
                    levelExt = (obj.value ? $scope._t('sensor_triggered') : $scope._t('sensor_idle'));
                    updateTime = obj.level.updateTime;
                    invalidateTime = obj.level.invalidateTime;
                } else if(v.cmdId == 0x9c){
                    levelExt = (obj.level.value ? $scope._t('sensor_triggered') : $scope._t('sensor_idle'));
                    updateTime = obj.val.updateTime;
                    invalidateTime = obj.val.invalidateTime;
                }
                else {
                    level = obj.val.value;
                    levelExt = obj.scaleString.value;
                    updateTime = obj.val.updateTime;
                    invalidateTime = obj.val.invalidateTime;
                }

                // Update row
                $('#' + v.rowId + ' .row-level').html(level);
                $('#' + v.rowId + ' .row-time').html($filter('isTodayFromUnix')(updateTime));
                if (updateTime > invalidateTime) {
                    $('#' + v.rowId + ' .row-time').removeClass('is-updated-false');
                }

                //console.log('Updating:' + v.rowId + ' | At: ' + updateTime + ' | with: ' + level);//REM
            }
        });
    }
});

/**
 * Meters controller
 */
appController.controller('MetersController', function($scope, $filter, dataService) {
    $scope.meters = [];
    $scope.reset = function() {
        $scope.meters = angular.copy([]);
    };

    // Load data
    $scope.load = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            dataService.joinedZwaveData(function(data) {
                refreshData(data);
            });
        });
    };

    $scope.load();

    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });

    // Store data from meter on remote server
    $scope.store = function(cmd, action) {
        // Is clicked on RESET?
        if (action === 'reset' && !window.confirm($scope._t('are_you_sure_reset_meter'))) {
            return;
        }
        dataService.runCmd(cmd, false, $scope._t('error_handling_data'));
    };

    // Store all data from sensors on remote server
    $scope.storeAll = function(id) {
        angular.forEach($scope.meters, function(v, k) {
            dataService.runCmd(v.urlToStore);
        });

    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
        $scope.controllerId = ZWaveAPIData.controller.data.nodeId.value;

        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(device, k) {
            if (k == 255 || k == $scope.controllerId || device.data.isVirtual.value) {
                return false;
            }
            // Loop throught instances
            angular.forEach(device.instances, function(instance, instanceId) {
                if (instanceId == 0 && device.instances.length > 1) {
                    return;
                }

                // Look for Meter - Loop throught 0x32 commandClasses
                var meters = instance.commandClasses[0x32];
                if (angular.isObject(meters)) {
                    angular.forEach(meters.data, function(meter, key) {
                        realEMeterScales = [0, 1, 3, 8, 9];// Not in [0, 1, 3, 8, 9] !== -1
                        var scaleId = parseInt(key, 10);
                        if (isNaN(scaleId)) {
                            return;
                        }
                        if (meter.sensorType.value == 1 && realEMeterScales.indexOf(scaleId) === -1) {
                            return; // filter only for eMeters
                        }
                        if (meter.sensorType.value > 1) {
                            return; //  gas and water have real meter scales
                        }
                        var obj = {};
                        obj['id'] = k;
                        obj['iId'] = instanceId;
                        obj['cmd'] = meters.name + '.' + meter.name;
                        obj['cmdId'] = 0x30;
                        obj['rowId'] = meters.name + '_' + meter.name + '_' + k;
                        obj['name'] = $filter('deviceName')(k, device);
                        obj['type'] = meters.name;
                        obj['purpose'] = meter.sensorTypeString.value;
                        obj['level'] = meter.val.value;
                        obj['levelExt'] = meter.scaleString.value;
                        obj['invalidateTime'] = meter.invalidateTime;
                        obj['updateTime'] = meter.updateTime;
                        obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                        obj['urlToStore'] = 'devices[' + obj['id'] + '].instances[' + instanceId + '].commandClasses[50].Get()';
                        obj['cmdToUpdate'] = 'devices.' + k + '.instances.' + instanceId + '.commandClasses.' + 0x32 + '.data.' + scaleId;
                        if (ZWaveAPIData.devices[obj['id']].instances[instanceId].commandClasses[0x32].data.version.value < 2
                                || !ZWaveAPIData.devices[obj['id']].instances[instanceId].commandClasses[0x32].data.resettable.value) {
                            obj['urlToReset'] = null;
                        } else {
                            obj['urlToReset'] = 'devices[' + obj['id'] + '].instances[' + instanceId + '].commandClasses[50].Reset()';
                        }

                        $scope.meters.push(obj);
                    });
                }

            });
        });
    }

    /**
     * Refresh zwave data
     */
    function refreshData(data) {
        angular.forEach($scope.meters, function(v, k) {
            var obj = data.update[v.cmdToUpdate];
            if (v.cmdToUpdate in data.update) {
                var level = obj.val.value;
                var updateTime = $filter('isTodayFromUnix')(obj.updateTime);
                $('#' + v.rowId + ' .row-level').html(level);
                $('#' + v.rowId + ' .row-time').html(updateTime);
                if (obj.updateTime > obj.invalidateTime) {
                    $('#' + v.rowId + ' .row-time').removeClass('is-updated-false');
                }
            }
        });
    }
});

// Thermostat controller
appController.controller('ThermostatController', function($scope, $filter, dataService) {
    $scope.thermostats = [];
    $scope.rangeSlider = [];
    $scope.mChangeMode = [];
    $scope.reset = function() {
        $scope.thermostats = angular.copy([]);
    };
    // Load data
    $scope.load = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            dataService.joinedZwaveData(function(data) {
                refreshData(data);
            });
        });
    };
    // Load data
    $scope.load();

    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });
    // Change temperature on click
    $scope.tempChange = function(cmd, index, type) {
        var val = $scope.rangeSlider[index];
        var min = parseInt($scope.cfg.thermostat_range.min, 10);
        var max = parseInt($scope.cfg.thermostat_range.max, 10);
        var count = (type === '-' ? val - 1 : val + 1);
        if (count < min) {
            count = min;
        }
        if (count > max) {
            count = max;
        }
        $scope.rangeSlider[index] = count;
        var url = cmd + '.Set(1,' + count + ')';
        console.log('Sending value: ' + $scope.rangeSlider[index]);
        dataService.runCmd(url, false, $scope._t('error_handling_data'));
    };
    // Change temperature after slider handle
    $scope.sliderChange = function(cmd, index) {
        var count = parseInt($scope.rangeSlider[index]);
        var min = parseInt($scope.cfg.thermostat_range.min, 10);
        var max = parseInt($scope.cfg.thermostat_range.max, 10);
        if (count < min) {
            count = min;
        }
        if (count > max) {
            count = max;
        }
        $scope.rangeSlider[index] = count;
        var url = cmd + '.Set(1,' + count + ')';
        console.log(url);
        dataService.runCmd(url, false, $scope._t('error_handling_data'));
    };
    // Change mode
     $scope.changeMode = function(cmd,mode) {
         if(!mode){
             return;
         }
          var url = cmd + '.Set('+ mode + ')';
         dataService.runCmd(url);
    };
   
    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }

            // Loop throught instances
            var cnt = 1;
            angular.forEach(node.instances, function(instance, instanceId) {
                if (instanceId == 0 && node.instances.length > 1) {
                    return;
                }
                // we skip devices without ThermostatSetPint AND ThermostatMode CC
                if (!(0x43 in instance.commandClasses) && !(0x40 in instance.commandClasses)) {
                    return;
                }

                var ccId;
                var curThermMode = getCurrentThermostatMode(instance);
                var level = null;
                var hasExt = false;
                var changeTemperature = false;
                var updateTime;
                var invalidateTime;
                var modeType = null;
                var modeList = {};

                var hasThermostatMode = 0x40 in instance.commandClasses;
                var hasThermostatSetpoint = 0x43 in instance.commandClasses;
                var isThermostatMode = false;
                 var isThermostatSetpoint = false;
                var hasThermostatSetback = 0x47 in instance.commandClasses;
                var hasClimateControlSchedule = 0x46 in instance.commandClasses;
                var curThermModeName = ''; 

                if (!hasThermostatSetpoint && !hasThermostatMode) { // to include more Thermostat* CCs
                    return; // we don't want devices without ThermostatSetpoint AND ThermostatMode CCs
                }
                //console.log( nodeId + ': ' + curThermMode);
                if (hasThermostatMode) {
                    ccId = 0x40;
                } 
                else if (hasThermostatSetpoint) {
                    ccId = 0x43;

                }
                if (hasThermostatMode) {
                    curThermModeName = (curThermMode in instance.commandClasses[0x40].data) ? instance.commandClasses[0x40].data[curThermMode].modeName.value : "???";
                    modeList = getModeList(instance.commandClasses[0x40].data);
                    if (curThermMode in instance.commandClasses[0x40].data) {
                        updateTime = instance.commandClasses[0x40].data.mode.updateTime;
                        invalidateTime = instance.commandClasses[0x40].data.mode.invalidateTime;
                        modeType = 'hasThermostatMode';
                        isThermostatMode = true;

                    }
                } 
                if (hasThermostatSetpoint) {
                    if (angular.isDefined(instance.commandClasses[0x43].data[curThermMode])) {
                        level = instance.commandClasses[0x43].data[curThermMode].setVal.value;
                        updateTime = instance.commandClasses[0x43].data[curThermMode].updateTime;
                        invalidateTime = instance.commandClasses[0x43].data[curThermMode].invalidateTime;
                        changeTemperature = true;
                        hasExt = true;
                        modeType = 'hasThermostatSetpoint';
                        isThermostatSetpoint = true;
                    }

                }

                // Set object
                var obj = {};

                obj['id'] = nodeId;
                obj['cmd'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data.' + curThermMode;
                obj['ccId'] = ccId;
                obj['rowId'] = 'row_' + nodeId + '_' + cnt;
                obj['name'] = $filter('deviceName')(nodeId, node);
                 obj['curThermMode'] = curThermMode;
                obj['changeTemperature'] = changeTemperature;
                obj['level'] = level;
                obj['hasExt'] = hasExt;
                obj['updateTime'] = updateTime;
                obj['invalidateTime'] = invalidateTime;
                obj['isUpdated'] = (updateTime > invalidateTime ? true : false);
                obj['urlToStore'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + ']';
                obj['cmdToUpdate'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data.' + curThermMode;
                obj['modeType'] = modeType;
                obj['isThermostatMode'] = isThermostatMode;
                 obj['isThermostatSetpoint'] = isThermostatSetpoint;
                 obj['modeList'] = modeList;
                $scope.thermostats.push(obj);
                $scope.rangeSlider.push(obj['range_' + nodeId] = obj['level']);
                //console.log(obj);
                cnt++;
            });
        });
    }

    /**
     * Refresh zwave data
     */
    function refreshData(data) {
        angular.forEach($scope.thermostats, function(v, k) {
            if (!v.modeType) {
                return;
            }
            var obj = data.update[v.cmdToUpdate];
            var level = null;
            var updateTime;
            var invalidateTime;
            if(!angular.isObject(data.update)){
                return;
            }
            if (v.cmdToUpdate in data.update) {
                if (v.modeType == 'hasThermostatMode') {
                    updateTime = obj.mode.updateTime;
                    invalidateTime = obj.mode.invalidateTime;
                } if (v.modeType == 'hasThermostatSetpoint') {
                    updateTime = obj.updateTime;
                    invalidateTime = obj.invalidateTime;
                    level = obj.setVal.value;
                }
                var formatTime = $filter('isTodayFromUnix')(updateTime);
                $('#' + v.rowId + ' .row-level .level-val').html(level);
                $('#' + v.rowId + ' .row-time').html(formatTime);
                if (updateTime > invalidateTime) {
                    $('#' + v.rowId + ' .row-time').removeClass('is-updated-false');
                }
                console.log('Updating:' + v.rowId + ' | At: ' + formatTime + ' | with: ' + level);//REM
            }
        });
    }

    // used to pick up thermstat mode
    function getCurrentThermostatMode(_instance) {
        var hasThermostatMode = 0x40 in _instance.commandClasses;
        
        var _curThermMode = 1;
        if (hasThermostatMode) {
            _curThermMode = _instance.commandClasses[0x40].data.mode.value;
            if (isNaN(parseInt(_curThermMode, 10)))
                _curThermMode = null; // Mode not retrieved yet
        } 
//        else {
//            // we pick up first available mode, since not ThermostatMode is supported to change modes
//            _curThermMode = null;
//            angular.forEach(_instance.commandClasses[0x43].data, function(name, k) {
//                if (!isNaN(parseInt(name, 10))) {
//                    _curThermMode = parseInt(name, 10);
//                    return false;
//                }
//            });
//        }
//        ;
        return _curThermMode;
    }
    ;
    // used to pick up thermstat mode
    function getModeList(data){
        var list = []
       angular.forEach(data, function(v, k) {
            if (!k || isNaN(parseInt(k, 10))){
                return;
            }
             var obj = {};
             obj['key'] = k;
            obj['val'] = $filter('hasNode')(v,'modeName.value');
            list.push(obj);
         });
        
        return list;
    }
    ;
});
// Locks controller
appController.controller('LocksController', function($scope, $filter, dataService) {
    $scope.locks = [];
    $scope.reset = function() {
        $scope.locks = angular.copy([]);
    };
    // Load data
    $scope.load = function(lang) {
        dataService.getZwaveData(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            dataService.joinedZwaveData(function(data) {
                refreshData(data);
            });
        });
    };
    // Load data
    $scope.load($scope.lang);

    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });
    // Store data on remote server
    $scope.store = function(btn) {
        var url = $(btn).attr('data-store-url');
        dataService.runCmd(url, false, $scope._t('error_handling_data'));
        return;
    };
    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        var doorLockCCId = 0x62;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }

            // Loop throught instances
            var cnt = 1;
            angular.forEach(node.instances, function(instance, instanceId) {
                if (instanceId == 0 && node.instances.length > 1) {
                    return;
                }
                // we don't want devices without DoorLock CC
                if (!(doorLockCCId in instance.commandClasses)) {
                    return;
                }

                // CC gui
                var mode = instance.commandClasses[doorLockCCId].data.mode.value;
                if (mode === '' || mode === null) {
                    mode = 0;
                }

                var ccId = 98;
                // Set object
                var obj = {};
                //var level = $scope.updateLevel(instance.commandClasses[ccId].data.level, ccId);

                obj['id'] = nodeId;
                obj['cmd'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data.mode';
                obj['ccId'] = doorLockCCId;
                obj['rowId'] = 'row_' + nodeId + '_' + cnt;
                obj['name'] = $filter('deviceName')(nodeId, node);
                obj['level'] = mode;
                obj['updateTime'] = instance.commandClasses[ccId].data.mode.updateTime;
                obj['invalidateTime'] = instance.commandClasses[ccId].data.mode.invalidateTime;
                obj['isUpdated'] = ((obj['updateTime'] > obj['invalidateTime']) ? true : false);
                obj['urlToStore'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + ']';
                obj['cmdToUpdate'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data.mode';
                $scope.locks.push(obj);
                cnt++;
            });
        });
    }

    /**
     * Refresh zwave data
     */
    function refreshData(data) {
        angular.forEach($scope.locks, function(v, k) {

            if (v.cmdToUpdate in data.update) {
                var obj = data.update[v.cmdToUpdate];
                var active = obj.value;
                var level = $filter('lockStatus')(obj.value);
                var updateTime = $filter('isTodayFromUnix')(obj.updateTime);
                $('#' + v.rowId + ' .row-time').html(updateTime).removeClass('is-updated-false');
                $('#' + v.rowId + ' .row-level').html(level);
                $('#' + v.rowId + ' .btn-group-lock button').removeClass('active');
                if (active == '255') {
                    $('#' + v.rowId + ' .btn-lock').addClass('active');
                } else {
                    $('#' + v.rowId + ' .btn-unlock').addClass('active');
                }
            }
        });
    }
});
// Status controller
appController.controller('StatusController', function($scope, $filter, dataService) {
    $scope.statuses = [];
    $scope.interviewCommandsDevice = [];
    $scope.interviewCommands = [];
    $scope.deviceInfo = {
        "index": null,
        "id": null,
        "name": null
    };
    $scope.reset = function() {
        $scope.statuses = angular.copy([]);
    };
    // Load data
    $scope.load = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            dataService.joinedZwaveData(function(data) {
//                $scope.reset();
//                setData(data.joined);
                refreshData(data.update);
            });
        });
    };

    // Load data
    $scope.load($scope.lang);

    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });
    // Store data from on remote server
    $scope.store = function(btn) {
        var url = $(btn).attr('data-store-url');
        dataService.runCmd(url, false, $scope._t('error_handling_data'));
    };
    // Store all data on remote server
    $scope.storeAll = function(btn) {
        angular.forEach($scope.statuses, function(v, k) {
            if (v.urlToStore) {
                dataService.runCmd(v.urlToStore);
            }
        });
    };
    $scope.showModalInterview = function(target, index, id, name) {
        $scope.deviceInfo = {
            "index": index,
            "id": id,
            "name": name
        };
        $(target).modal();
    };
    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        var doorLockCCId = 0x62;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }

            var basicType = node.data.basicType.value;
            var genericType = node.data.genericType.value;
            var specificType = node.data.specificType.value;
            var isListening = node.data.isListening.value;
            var isFLiRS = !isListening && (node.data.sensor250.value || node.data.sensor1000.value);
            var hasWakeup = 0x84 in node.instances[0].commandClasses;
            var hasBattery = 0x80 in node.instances[0].commandClasses;
            // Update
            var node = ZWaveAPIData.devices[nodeId];
            var lastReceive = parseInt(node.data.lastReceived.updateTime, 10) || 0;
            var lastSend = parseInt(node.data.lastSend.updateTime, 10) || 0;
            var lastCommunication = (lastSend > lastReceive) ? lastSend : lastReceive;
            var isFailed = node.data.isFailed.value;
            var isAwake = node.data.isAwake.value;
            var prefixD = 'devices.' + nodeId + '.data.';
            var prefixIC = 'devices.' + nodeId + '.instances.0.commandClasses';
            var bindPath = prefixD + 'isFailed,' + prefixD + 'isAwake,' + prefixD + 'lastSend,' + prefixD + 'lastReceived,' + prefixD + 'queueLength,devices.' + nodeId + '.instances[*].commandClasses[*].data.interviewDone,' + prefixIC + '.' + 0x84 + '.data.lastWakeup,' + prefixIC + '.' + 0x84 + '.data.lastSleep,' + prefixIC + '.' + 0x84 + '.data.interval,' + prefixIC + '.' + 0x80 + '.data.last';
            $scope.interviewCommands.push(interviewCommands(node));
            $scope.interviewCommandsDevice.push(node.data);
            updateDeviceInfo(ZWaveAPIData, nodeId, basicType, genericType, specificType, isFLiRS, hasWakeup, hasBattery, isListening, bindPath);
        });
    }

    function updateDeviceInfo(ZWaveAPIData, nodeId, basicType, genericType, specificType, isFLiRS, hasWakeup, hasBattery, isListening, bindPath) {
        //var nodeId = $(this).attr('device');
        var node = ZWaveAPIData.devices[nodeId];
        var lastReceive = parseInt(node.data.lastReceived.updateTime, 10) || 0;
        var lastSend = parseInt(node.data.lastSend.updateTime, 10) || 0;
        var lastCommunication = (lastSend > lastReceive) ? lastSend : lastReceive;
        var isFailed = node.data.isFailed.value;
        var isAwake = node.data.isAwake.value;
        var sleepingSince = 0;
        var lastWakeup = 0;
        var interval = 0;
        if (!isListening && hasWakeup) {
            sleepingSince = parseInt(node.instances[0].commandClasses[0x84].data.lastSleep.value, 10);
            lastWakeup = parseInt(node.instances[0].commandClasses[0x84].data.lastWakeup.value, 10);
            interval = parseInt(node.instances[0].commandClasses[0x84].data.interval.value, 10);
        }
        // Conts
        var sleeping_cont = sleepingCont(isListening, hasWakeup, isFLiRS, sleepingSince, lastWakeup, interval);
        var awake_cont = awakeCont(isAwake, isListening, isFLiRS);
        var operating_cont = operatingCont(isFailed, lastCommunication);
        var interview_cont = false;
        //var _interview_cont = '<i class="fa fa-question-circle fa-lg text-info" title="' + $scope._t('device_is_not_fully_interviewed') + '"></i>';
        var _interview_cont = $scope._t('device_is_not_fully_interviewed');
        if (ZWaveAPIData.devices[nodeId].data.nodeInfoFrame.value && ZWaveAPIData.devices[nodeId].data.nodeInfoFrame.value.length) {
            for (var iId in ZWaveAPIData.devices[nodeId].instances)
                for (var ccId in ZWaveAPIData.devices[nodeId].instances[iId].commandClasses)
                    if (!ZWaveAPIData.devices[nodeId].instances[iId].commandClasses[ccId].data.interviewDone.value) {
                        interview_cont = _interview_cont;
                    }
        } else {
            interview_cont = _interview_cont;
        }

        // DDR
        var ddr = false;
        if (angular.isDefined(node.data.ZDDXMLFile)) {
            ddr = node.data.ZDDXMLFile.value;
        }

        var obj = {};
        obj['id'] = nodeId;
        obj['rowId'] = 'row_' + nodeId;
        obj['cmd'] = bindPath.split(',');
        obj['genericType'] = genericType;
        obj['specificType'] = specificType;
        obj['name'] = $filter('deviceName')(nodeId, node);
        obj['sleeping'] = sleeping_cont;
        obj['awake'] = awake_cont;
        obj['updateTime'] = operating_cont;
        obj['ddr'] = ddr;
        obj['interview'] = interview_cont;
        obj['urlToStore'] = (isListening || isFLiRS ? 'devices[' + nodeId + '].SendNoOperation()' : false);
        obj['interview'] = interview_cont;
        obj['isListening'] = isListening;
        obj['isFLiRS'] = isFLiRS;
        obj['hasWakeup'] = hasWakeup;
        obj['lastCommunication'] = lastCommunication;
        obj['sleepingSince'] = sleepingSince;
        obj['lastWakeup'] = lastWakeup;
        obj['interval'] = interval;
        $scope.statuses.push(obj);
    }
    ;

    // Refresh data
    function refreshData(data) {

        angular.forEach($scope.statuses, function(v, k) {
            angular.forEach(v.cmd, function(ccId, key) {
                if (ccId in data) {
                    var node = 'devices.' + v.id;
                    var isAwakeCmd = node + '.data.isAwake';
                    var isFailedCmd = node + '.data.isFailed';
                    var lastReceiveCmd = node + '.data.lastReceived';
                    var lastSendCmd = node + '.data.lastSend';
                    var lastWakeupCmd = node + '.instances.0.commandClasses.132.data.lastWakeup';
                    var lastSleepCmd = node + '.instances.0.commandClasses.132.data.lastSleep';
                    var lastCommunication = v.lastCommunication;
                    switch (ccId) {
                        case isAwakeCmd:
                            var isAwake = data[isAwakeCmd].value;
                            var awake_cont = awakeCont(isAwake, v.isListening, v.isFLiRS);
                            $('#' + v.rowId + ' .row-awake').html(awake_cont);
                            break;
                        case isFailedCmd:
                            var isFailed = data[isFailedCmd].value;
                            var operating_cont = operatingCont(isFailed, lastCommunication);
                            $('#' + v.rowId + ' .row-time').html(operating_cont);
                            break;
                        case lastReceiveCmd:
                            var lastReceive = data[lastReceiveCmd].updateTime;
                            lastCommunication = (lastReceive > lastCommunication) ? lastReceive : lastCommunication;
                            var operating_cont_rec = operatingCont(false, lastCommunication);
                            $('#' + v.rowId + ' .row-time').html(operating_cont_rec);
                            break;
                        case lastSendCmd:
                            var lastSend = data[lastSendCmd].updateTime;
                            lastCommunication = (lastSend > lastCommunication) ? lastSend : lastCommunication;
                            var operating_cont_send = operatingCont(false, lastCommunication);
                            $('#' + v.rowId + ' .row-time').html(operating_cont_send);
                            break;
                        case lastWakeupCmd:
                            var lastWakeup = data[lastWakeupCmd].value;
                            if (angular.isDefined(data[lastSleepCmd])) {
                                var sleepingSince = data[lastSleepCmd].value;
                                var sleeping_cont = sleepingCont(v.isListening, v.hasWakeup, v.isFLiRS, sleepingSince, lastWakeup, v.interval);
                                $('#' + v.rowId + ' .row-sleeping').html(sleeping_cont);

                            }
                            break;
                        case lastSleepCmd:
                            //console.log(lastSleepCmd);
                            break;
                    }
                    ;
                    //$('#' + v.rowId + ' .row-time').html(node);
                }

            });

        });
    }
    ;

    // Interview commands
    function interviewCommands(node) {
        var interviews = [];
        for (var iId in node.instances) {
            var cnt = 0;
            for (var ccId in node.instances[iId].commandClasses) {
                var obj = {};
                obj['iId'] = iId;
                obj['ccId'] = ccId;
                obj['ccName'] = node.instances[iId].commandClasses[ccId].name;
                obj['interviewDone'] = node.instances[iId].commandClasses[ccId].data.interviewDone.value;
                obj['cmdData'] = node.instances[iId].commandClasses[ccId].data;
                obj['cmdDataIn'] = node.instances[iId].data;
                interviews.push(obj);
                cnt++;
            }
            ;
        }
        ;
        return interviews;
    }


    // Get Awake HTML
    function awakeCont(isAwake, isListening, isFLiRS) {
        var awake_cont = '';
        if (!isListening && !isFLiRS)
            awake_cont = isAwake ? ('<i class="fa fa-certificate fa-lg text-orange" title="' + $scope._t('device_is_active') + '"></i>') : ('<i class="fa fa-moon-o fa-lg text-primary" title="' + $scope._t('device_is_sleeping') + '"></i>');
        return awake_cont;
    }
    // Get operating HTML
    function operatingCont(isFailed, lastCommunication) {
        var operating_cont = (isFailed ? ('<i class="fa fa-check fa-lg text-danger" title="' + $scope._t('device_is_dead') + '"></i>') : ('<i class="fa fa-check fa-lg text-success" title="' + $scope._t('device_is_operating') + '"></i>')) + ' <span title="' + $scope._t('last_communication') + '" class="not_important">' + $filter('isTodayFromUnix')(lastCommunication) + '</span>';
        return operating_cont;
    }

    // Get Sleeping HTML
    function sleepingCont(isListening, hasWakeup, isFLiRS, sleepingSince, lastWakeup, interval) {
        var sleeping_cont;
        if (isListening)
            sleeping_cont = ''; // mains powered device
        else if (!isListening && hasWakeup) {
            var approx = '';
            if (isNaN(sleepingSince) || sleepingSince < lastWakeup) {
                sleepingSince = lastWakeup
                if (!isNaN(lastWakeup))
                    approx = '<span title="' + $scope._t('sleeping_since_approximately') + '">~</span> ';
            }
            ;
            if (interval == 0)
                interval = NaN; // to indicate that interval and hence next wakeup are unknown
            var lastSleep = $filter('isTodayFromUnix')(sleepingSince);
            var nextWakeup = $filter('isTodayFromUnix')(sleepingSince + interval);
            sleeping_cont = '<span title="' + $scope._t('sleeping_since') + '" class="not_important">' + approx + lastSleep + '</span> &#8594; <span title="' + $scope._t('next_wakeup') + '">' + approx + nextWakeup + '</span> <i class="fa fa-clock-o fa-lg" title="' + $scope._t('battery_operated_device_with_wakeup') + '"></i>';
        } else if (!isListening && isFLiRS)
            sleeping_cont = '<i class="fa fa-headphones fa-lg" title="' + $scope._t('FLiRS_device') + '"></i>';
        else
            sleeping_cont = '<i class="fa fa-rss fa-lg" title="' + $scope._t('battery_operated_remote_control') + '"></i>';
        return sleeping_cont;
    }
});
// Battery controller
appController.controller('BatteryController', function($scope, $filter, $http, dataService, myCache) {
    $scope.battery = [];
    $scope.batteryInfo = [];
    $scope.reset = function() {
        $scope.battery = angular.copy([]);
    };
    // Load data
    $scope.load = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            dataService.joinedZwaveData(function(data) {
                refreshData(data);
//                $scope.reset();
//                setData(data.joined);
            });
        });
    };
    $scope.load($scope.lang);

    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });
    // Store single data on remote server
    $scope.store = function(btn) {
        var url = $(btn).attr('data-store-url');
        dataService.runCmd(url, false, $scope._t('error_handling_data'));
    };
    // Store all data on remote server
    $scope.storeAll = function(btn) {
        angular.forEach($scope.battery, function(v, k) {
            dataService.runCmd(v.urlToStore);
        });
    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }
            var hasBattery = 0x80 in node.instances[0].commandClasses;
            var instanceId = 0;
            var ccId = 0x80;
            if (!hasBattery) {
                return;
            }
            var node = ZWaveAPIData.devices[nodeId];
            var battery_charge = parseInt(node.instances[0].commandClasses[0x80].data.last.value);
            var battery_updateTime = node.instances[0].commandClasses[0x80].data.last.updateTime;

//            var info = loadZDD(nodeId, ZWaveAPIData);
//            console.log(info);
            // Set object
            var obj = {};
            obj['id'] = nodeId;
            obj['cmd'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].data.last';
            obj['rowId'] = 'row_' + nodeId;
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['level'] = battery_charge;
            obj['updateTime'] = battery_updateTime;
            obj['urlToStore'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + '].Get()';
            obj['cmdToUpdate'] = 'devices.' + nodeId + '.instances.' + instanceId + '.commandClasses.' + ccId + '.data';
            obj['batteryCount'] = null;
            obj['batteryType'] = null;

            var zddXmlFile = null;
            if (angular.isDefined(node.data.ZDDXMLFile)) {
                zddXmlFile = node.data.ZDDXMLFile.value;
            }
            if (zddXmlFile) {
                var cachedZddXml = myCache.get(zddXmlFile);
                if (!cachedZddXml) {
                    $http.get($scope.cfg.server_url + $scope.cfg.zddx_url + zddXmlFile).then(function(response) {
                        var x2js = new X2JS();
                        var zddXml = x2js.xml_str2json(response.data);
                        myCache.put(zddXmlFile, zddXml);
                        var batteryInfo = getBatteryInfo(zddXml);
                        obj['batteryCount'] = batteryInfo.batteryCount;
                        obj['batteryType'] = batteryInfo.batteryType;

                    });
                } else {
                    var batteryInfo = getBatteryInfo(cachedZddXml);
                    obj['batteryCount'] = batteryInfo.batteryCount;
                    obj['batteryType'] = batteryInfo.batteryType;
                }
            }

            $scope.battery.push(obj);
        });
    }

    /**
     * Refresh zwave data
     */
    function refreshData(data) {

        angular.forEach($scope.battery, function(v, k) {
            var obj = data.update[v.cmdToUpdate];
            if (obj) {
                var level = parseInt(obj.last.value);
                var updateTime = obj.last.updateTime;
                //var invalidateTime;
                var formatTime = $filter('isTodayFromUnix')(updateTime);
                $('#' + v.rowId + ' .row-level').html(level);
                $('#' + v.rowId + ' .row-time').html(formatTime);
                //console.log('Updating:' + v.rowId + ' | At: ' + formatTime + ' | with: ' + level);//REM
            }
        });
    }

    // Load ZDDXML
    $scope.loadZDD_ = function(nodeId) {
        if (nodeId in $scope.zdd)
            return; // zdd already loaded for nodeId
        var node = $scope.ZWaveAPIData.devices[nodeId];
        if (node == undefined)
            return;
        var zddXmlFile = null;
        if (angular.isDefined(node.data.ZDDXMLFile)) {
            zddXmlFile = node.data.ZDDXMLFile.value;
        }
        if (!(zddXmlFile))
            return; // not available

        var cachedZddXml = myCache.get(zddXmlFile);
        if (!cachedZddXml) {
            $http.get($scope.cfg.server_url + $scope.cfg.zddx_url + zddXmlFile).then(function(response) {
                var x2js = new X2JS();
                var zddXml = x2js.xml_str2json(response.data);
                myCache.put(zddXmlFile, zddXml);
                if (("ZWaveDevice" in zddXml) && ("assocGroups" in zddXml.ZWaveDevice)) {
                    $scope.zdd[nodeId] = zddXml.ZWaveDevice.assocGroups;
                    if (nodeId == $scope.deviceId)
                        $scope.updateData(nodeId);
                } else {
                    $scope.zdd[nodeId] = undefined;
                }
            });
        } else {
            var zddXml = cachedZddXml;
            if (("ZWaveDevice" in zddXml) && ("assocGroups" in zddXml.ZWaveDevice)) {
                $scope.zdd[nodeId] = zddXml.ZWaveDevice.assocGroups;
                if (nodeId == $scope.deviceId)
                    $scope.updateData(nodeId);
            } else {
                $scope.zdd[nodeId] = undefined;
            }
        }
    };

    // Load ZDDXML
    function loadZDD(nodeId, ZWaveAPIData) {

        var node = ZWaveAPIData.devices[nodeId];
        if (node == undefined) {
            return;
        }

        var zddXmlFile = null;
        if (angular.isDefined(node.data.ZDDXMLFile)) {
            zddXmlFile = node.data.ZDDXMLFile.value;
        }
        if (!(zddXmlFile)) {
            return;
        }
        var cachedZddXml = myCache.get(zddXmlFile);
        if (!cachedZddXml) {
            $http.get($scope.cfg.server_url + $scope.cfg.zddx_url + zddXmlFile).then(function(response) {
                var x2js = new X2JS();
                var zddXml = x2js.xml_str2json(response.data);
                myCache.put(zddXmlFile, zddXml);
                return getBatteryInfo(zddXml);

            });
        } else {
            return getBatteryInfo(cachedZddXml);
        }
    }
    ;
    // Get battery info
    function getBatteryInfo(zddXml) {
        var info = {
            'batteryCount': null,
            'batteryType': null
        };
        if (("deviceDescription" in zddXml.ZWaveDevice)) {
            var obj = zddXml.ZWaveDevice.deviceDescription;
            if (obj) {
                if (obj.batteryCount) {
                    info.batteryCount = obj.batteryCount;
                }
                if (obj.batteryType) {
                    info.batteryType = obj.batteryType;
                }
            }
        }
        return info;
    }
});
// Type controller
appController.controller('TypeController', function($scope, $filter, dataService) {
    $scope.devices = [];
    $scope.reset = function() {
        $scope.devices = angular.copy([]);
    };
    $scope.deviceClasses = [];
    // Load  device classes xml data
    $scope.loadDeviceClasses = function() {
        dataService.getDeviceClasses(function(data) {
            var lang = 'en';
            angular.forEach(data.DeviceClasses.Generic, function(val, key) {
                var obj = {};
                var langs = {
                    "en": "0",
                    "de": "1",
                    "ru": "2"
                };
                if (angular.isDefined(langs[$scope.lang])) {
                    lang = $scope.lang;
                }
                var langId = langs[lang];
                obj['id'] = parseInt(val._id);
                obj['generic'] = val.name.lang[langId].__text;
                obj['specific'] = val.Specific;
                obj['langId'] = langId;
                $scope.deviceClasses.push(obj);
            });
        });
    };
    $scope.loadDeviceClasses();

    // Load data
    $scope.load = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
            dataService.joinedZwaveData(function(data) {
                $scope.reset();
                setData(data.joined);
                dataService.cancelZwaveDataInterval();
            });
        });
    };
    $scope.load();

    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });

    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }
            var node = ZWaveAPIData.devices[nodeId];
            var instanceId = 0;
            var ccIds = [32, 34, 37, 38, 43, 70, 91, 94, 96, 114, 119, 129, 134, 138, 143, 152];
            var basicType = node.data.basicType.value;
            var genericType = node.data.genericType.value;
            var specificType = node.data.specificType.value;
            var major = node.data.ZWProtocolMajor.value;
            var minor = node.data.ZWProtocolMinor.value;
            var fromSdk = true;
            var sdk;
            // SDK
            if (node.data.SDK.value == '') {
                sdk = major + '.' + minor;
                fromSdk = false;
            } else {
                sdk = node.data.SDK.value;
            }
            // Version
            var appVersion = node.data.applicationMajor.value + '.' + node.data.applicationMinor.value;
            // Security and ZWavePlusInfo
            var security = 0;
            angular.forEach(ccIds, function(v, k) {
                var cmd = node.instances[instanceId].commandClasses[v];
                if (angular.isObject(cmd) && cmd.name === 'Security') {
                    security = cmd.data.interviewDone.value;
                    return;
                }
            });
            // MWI and EF
            var mwief = getEXFrame(major, minor);

            // DDR
            var ddr = false;
            if (angular.isDefined(node.data.ZDDXMLFile)) {
                ddr = node.data.ZDDXMLFile.value;
            }

            // Zwave plus
            var ZWavePlusInfo = false;
            angular.forEach(ccIds, function(v, k) {
                var cmd = node.instances[instanceId].commandClasses[v];
                if (angular.isObject(cmd) && cmd.name === 'ZWavePlusInfo') {
                    ZWavePlusInfo = true;
                    return;
                }
            });
            // Device type
            var deviceXml = $scope.deviceClasses;
            var deviceType = $scope._t('unknown_device_type') + ': ' + genericType;
            angular.forEach(deviceXml, function(v, k) {
                if (genericType == v.id) {
                    deviceType = v.generic;
                    angular.forEach(v.specific, function(s, sk) {
                        if (specificType == s._id) {
                            if (angular.isDefined(s.name.lang[v.langId].__text)) {
                                deviceType = s.name.lang[v.langId].__text;
                            }
                        }
                    });
                    return;
                }
            });
            console.log(node.data.vendorString)
            // Set object
            var obj = {};
            obj['id'] = nodeId;
            obj['rowId'] = 'row_' + nodeId;
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['security'] = security;
            obj['mwief'] = mwief;
            obj['ddr'] = ddr;
            obj['ZWavePlusInfo'] = ZWavePlusInfo;
            obj['sdk'] = (sdk == '0.0' ? '?' : sdk);
            obj['fromSdk'] = fromSdk;
            obj['appVersion'] = appVersion;
            obj['type'] = deviceType;
            obj['deviceType'] = deviceType;
            obj['basicType'] = basicType;
            obj['genericType'] = genericType;
            obj['specificType'] = specificType;
            $scope.devices.push(obj);
        });
    }

    /**
     * Get EXF frame
     */
    function getEXFrame($major, $minor) {
        if ($major == 1)
            return 0;
        if ($major == 2) {
            if ($minor >= 96)
                return 1;
            if ($minor == 74)
                return 1;
            return 0;
        }
        if ($major == 3)
            return 1;
        return 0;
    }

});
// Device Associations controller
appController.controller('AssociationsController', function($scope, $filter, $http, myCache, dataService) {
    $scope.devices = [];
    $scope.ZWaveAPIData = [];
    $scope.showLifeline = false;
    $scope.zdd;
    $scope.reset = function() {
        $scope.devices = angular.copy([]);
    };
    // Load data
    $scope.load = function(lang) {
        dataService.getZwaveData(function(ZWaveAPIData) {
            setData(ZWaveAPIData);
        });
    };
    // Load data
    $scope.load($scope.lang);

    // Refresh data
    $scope.refresh = function() {
        dataService.joinedZwaveData(function(data) {
            $scope.reset();
            setData(data.joined);
            dataService.cancelZwaveDataInterval();
        });
    };
    //$scope.refresh();


    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });
    // Store data on remote server
    $scope.lifeline = function(status) {
        $scope.reset();
        $scope.showLifeline = status;
        $scope.load($scope.lang);
    };
    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        var cnt = 1;
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }
            var zddXmlFile = null;
            if (angular.isDefined(node.data.ZDDXMLFile)) {
                zddXmlFile = node.data.ZDDXMLFile.value;
            }
            var zdd;
            if (zddXmlFile && zddXmlFile !== 'undefined') {
                var cachedZddXml = myCache.get(zddXmlFile);
                if (!cachedZddXml) {
                    $http.get($scope.cfg.server_url + $scope.cfg.zddx_url + zddXmlFile).then(function(response) {
                        var x2js = new X2JS();
                        var zddXml = x2js.xml_str2json(response.data);
                        myCache.put(zddXmlFile, zddXml);
                        var assocGroup = [];
                        if (("ZWaveDevice" in zddXml) && ("assocGroups" in zddXml.ZWaveDevice)) {
                            zdd = zddXml.ZWaveDevice.assocGroups;
                            var assocDevices = getAssocDevices(node, ZWaveAPIData, zdd, controllerNodeId);
                            $scope.devices.push({
                                'id': nodeId,
                                'rowId': 'row_' + nodeId + '_' + cnt,
                                'name': $filter('deviceName')(nodeId, node),
                                'assocGroup': assocDevices
                            });
                        }

                    });
                } else {
                    var zddXml = cachedZddXml;
                    var assocGroup = [];
                    if (("ZWaveDevice" in zddXml) && ("assocGroups" in zddXml.ZWaveDevice)) {
                        zdd = zddXml.ZWaveDevice.assocGroups;
                        var assocDevices = getAssocDevices(node, ZWaveAPIData, zdd, controllerNodeId);
                        $scope.devices.push({
                            'id': nodeId,
                            'rowId': 'row_' + nodeId + '_' + cnt,
                            'name': $filter('deviceName')(nodeId, node),
                            'assocGroup': assocDevices
                        });
                    }
                }
            } else {
                zdd = null;
                var assocDevices = getAssocDevices(node, ZWaveAPIData, zdd, controllerNodeId);
                $scope.devices.push({
                    'id': nodeId,
                    'rowId': 'row_' + nodeId + '_' + cnt,
                    'name': $filter('deviceName')(nodeId, node),
                    'assocGroup': assocDevices
                });
            }


            cnt++;
        });
    }
    /**
     * Get group name
     */
    function getGroupLabel(assocGroups, index, instance) {
        // Set default assoc group name
        var label = $scope._t('association_group') + " " + (index + 1);

        // Attempt to get assoc group name from the zdd file
        var langs = $filter('hasNode')(assocGroups, 'description.lang');
        if (langs) {
            if ($.isArray(langs)) {
                angular.forEach(langs, function(lang, index) {
                    if (("__text" in lang) && (lang["_xml:lang"] == $scope.lang)) {
                        label = lang.__text;
                        return false;
                    }
                    if (("__text" in lang) && (lang["_xml:lang"] == "en")) {
                        label = lang.__text;
                    }
                });
            } else {
                if (("__text" in langs)) {
                    label = langs.__text;
                }
            }
        } else {
            // Attempt to get assoc group name from the command class
            angular.forEach(instance[0].commandClasses, function(v, k) {
                if (v.name == 'AssociationGroupInformation') {
                    label = $filter('hasNode')(v, 'data.' + (index + 1) + '.groupName.value');
                }

            });
        }

        return label;
    }
    ;
    /**
     * Get assoc devices
     */
    function getAssocDevices(node, ZWaveAPIData, zdd, controllerNodeId) {
        var assocGroups = [];
        var assocDevices = [];
        var assoc = [];
        var data;
        if (0x85 in node.instances[0].commandClasses) {
            var cc = node.instances[0].commandClasses[0x85].data;
            if (cc.groups.value >= 1) {
                for (var grp_num = 1; grp_num <= parseInt(cc.groups.value, 10); grp_num++) {
                    var groupArr = [];
                    var groupDev = [];
                    if (assocGroups.indexOf(grp_num) == -1) {
                        assocGroups.push(grp_num);
                    }

                    data = cc[grp_num];
                    for (var i = 0; i < data.nodes.value.length; i++) {
                        var targetNodeId = data.nodes.value[i];
                        var device = {'id': targetNodeId, 'name': '(#' + targetNodeId + ') ' + $filter('deviceName')(targetNodeId, ZWaveAPIData.devices[targetNodeId])};
                        assocDevices.push({'group': grp_num, 'device': device});
                    }

                }
            }
        }

        if (0x8e in node.instances[0].commandClasses) {
            var cc = node.instances[0].commandClasses[0x8e].data;
            if (cc.groups.value >= 1) {
                for (var grp_num = 1; grp_num <= parseInt(cc.groups.value, 10); grp_num++) {
                    var groupDev = [];
                    if (assocGroups.indexOf(grp_num) == -1) {
                        assocGroups.push(grp_num);
                    }
                    data = cc[grp_num];

                    for (var i = 0; i < data.nodesInstances.value.length; i += 2) {
                        var targetNodeId = data.nodesInstances.value[i];
                        var targetInstanceId = data.nodesInstances.value[i + 1];
                        var instanceId = (targetInstanceId > 0 ? '.' + targetInstanceId : '')
                        var device = {'id': targetNodeId, 'name': '(#' + targetNodeId + instanceId + ') ' + $filter('deviceName')(targetNodeId, ZWaveAPIData.devices[targetNodeId])};
                        assocDevices.push({'group': grp_num, 'device': device});
                    }
                }
            }
        }

        angular.forEach(assocGroups, function(v, k) {

            var dev = [];
            var name;

            if (zdd) {
                angular.forEach(zdd, function(zddval, zddkey) {
                    if (angular.isArray(zddval)) {
                        angular.forEach(zddval, function(val, key) {
                            if (val._number == v)
                                name = getGroupLabel(val, v, node.instances);
                        });
                    } else {
                        if (zddval._number == v)
                            name = getGroupLabel(zddval, v, node.instances);

                    }
                });
            } else {
                name = getGroupLabel([], v - 1, node.instances);
            }

            angular.forEach(assocDevices, function(d, key, nodeId) {
                //console.log(d)
                if (d['group'] == v) {
                    if ($scope.showLifeline) {
                        dev.push(d.device.name);
                    } else {
                        if (controllerNodeId != d.device.id) {
                            dev.push(d.device.name);
                        }
                    }
                }

            });

            if (dev.length > 0) {
                assoc.push({'name': name, 'devices': dev});
            }
        });

        return assoc;
    }


});
// Assoc controller
appController.controller('AssocController', function($scope, $log, $filter, $route, $timeout, $http, dataService, myCache, cfg) {

    $scope.keys = [];
    $scope.data = {};
    $scope.ZWaveAPIData;
    $scope.removeData = null;
    $scope.addData = null;
    $scope.addNodes = {};
    $scope.addInstances = {};
    $scope.removeNodes = {};
    $scope.removeInstances = {};
    $scope.assocToNode = null;
    $scope.assocToInstance = null;
    $scope.applyQueue = [];
    $scope.updates = [];
    $scope.zdd = {};
    var pollForUpdate = function(since, updates) {
        var spinner = $('#AssociationTable .fa-spinner');
        spinner.show();
        dataService.updateZwaveDataSince(since, function(updateZWaveAPIData) {
            var remaining = [];
            var hasUpdates = false;
            angular.forEach(updates, function(update, index) {
                if (!(update in updateZWaveAPIData)) {
                    remaining.push(update);
                } else if (updateZWaveAPIData[update].invalidateTime > updateZWaveAPIData[update].updateTime) {
                    hasUpdates = true;
                    remaining.push(update);
                } else {
                    hasUpdates = true;
                }
            });
            if (remaining.length == 0) {
                dataService.purgeCache();
                $scope.load($scope.lang);
                spinner.fadeOut();
            } else if (since + cfg.route_update_timeout / 1000 < (new Date()).getTime() / 1000) {
                console.log("update timed out");
                spinner.fadeOut();
            } else {
                window.setTimeout(pollForUpdate, cfg.interval, since, remaining);
                if (hasUpdates) {
                    dataService.purgeCache();
                    $scope.load($scope.lang);
                }
            }
        });
    };
    $scope.updateAssoc = function() {
        $scope.applyQueue = [];
        $scope.updates = [];
        var updates = [];
        var nodeId = $scope.deviceId;
        var node = $scope.ZWaveAPIData.devices[nodeId];
        if (node == undefined)
            return;
        if (nodeId == 255 || node.data.isVirtual.value)
            return;
        $.each(node.instances, function(index, instance) {
            if (!("commandClasses" in instance)) {
                return;
            }
            if (0x85 in instance.commandClasses) {
                for (var group = 0; group < instance.commandClasses[0x85].data.groups.value; group++) {
                    updates.push("devices." + nodeId + ".instances." + index + ".commandClasses." + (0x85) + ".data." + (group + 1));
                    dataService.runCmd('devices[' + nodeId + '].instances[' + index + '].commandClasses[0x85].Get(' + (group + 1) + ')', false, $scope._t('error_handling_data'));
                }
            }
            if (0x8e in instance.commandClasses) {
                for (var group = 0; group < instance.commandClasses[0x8e].data.groups.value; group++) {
                    updates.push("devices." + nodeId + ".instances." + index + ".commandClasses." + (0x8e) + ".data." + (group + 1));
                    dataService.runCmd('devices[' + nodeId + '].instances[' + index + '].commandClasses[0x8e].Get(' + (group + 1) + ')', false, $scope._t('error_handling_data'));

                }
            }

        });
        pollForUpdate(Math.floor((new Date()).getTime() / 1000), updates);
    }

    // Open remove assocation dialog
    $scope.openRemove = function(data) {
        $scope.removeData = data;
        $scope.removeNodes = {};
        $scope.removeInstances = {};
        $scope.assocToNode = null;
        $scope.assocToInstance = null;
        angular.forEach($scope.removeData.nodeIds, function(nodeId, index) {
            if ($scope.removeData.instanceIds[index] != null) {
                var instanceId = parseInt($scope.removeData.instanceIds[index]) - 1;
                // MultiChannelAssociation with instanceId
                $scope.removeNodes[nodeId] = '(#' + nodeId + ') ' + $filter('deviceName')(nodeId, $scope.ZWaveAPIData.devices[nodeId]);
                if (!(nodeId in $scope.removeInstances))
                    $scope.removeInstances[nodeId] = {};
                $scope.removeInstances[nodeId][instanceId] = instanceId + 1;
            } else {
                // simple Assocation
                $scope.removeNodes[nodeId] = '(#' + nodeId + ') ' + $filter('deviceName')(nodeId, $scope.ZWaveAPIData.devices[nodeId]);
            }
        });
        $('#modal_remove').modal({});
    };
    // Remove an assocation
    $scope.remove = function() {
        var params = $scope.removeData.groupId + ',' + $scope.assocToNode;
        if ($scope.assocToInstance != null) {
            params += ',' + (parseInt($scope.assocToInstance) + 1);
        }
        var nodeId = $scope.deviceId;
        var node = $scope.ZWaveAPIData.devices[nodeId];
        if (node == undefined)
            return;
        if (nodeId == 255 || node.data.isVirtual.value)
            return;
        var index = $scope.removeData.instance;
        var group = parseInt($scope.removeData.groupId);
        if ($scope.assocToInstance == null) {
            $scope.updates.push("devices." + nodeId + ".instances." + index + ".commandClasses." + (0x85) + ".data." + group);
            $scope.applyQueue.push('devices[' + nodeId + '].instances[' + index + '].commandClasses[0x85].Remove(' + params + ')');
        } else {
            $scope.updates.push("devices." + nodeId + ".instances." + index + ".commandClasses." + (0x8e) + ".data." + group);
            $scope.applyQueue.push('devices[' + nodeId + '].instances[' + index + '].commandClasses[0x8e].Remove(' + params + ')');
        }
        // cause view to hide element
        var removeIndex = -1;
        for (var i = 0; i < $scope.removeData.nodeIds.length; i++) {
            if ($scope.removeData.nodeIds[i] == $scope.assocToNode) {
                if ($scope.assocToInstance != null) {
                    if ($scope.removeData.instanceIds[i] == (parseInt($scope.assocToInstance) + 1)) {
                        removeIndex = i;
                        break;
                    }
                } else {
                    removeIndex = i;
                    break;
                }
            }
        }
        $scope.removeData.nodeIds.splice(removeIndex, 1);
        $scope.removeData.instanceIds.splice(removeIndex, 1);
        $scope.removeData.persistent.splice(removeIndex, 1);
        $scope.removeData.tooltips.splice(removeIndex, 1);
        $('#modal_remove').modal('hide');
    };
    // Add an assocation
    $scope.add = function() {
        var params = $scope.addData.groupId + ',' + $scope.assocToNode;
        if ($scope.assocToInstance != null) {
            params += ',' + (parseInt($scope.assocToInstance) + 1);
        }
        var nodeId = $scope.deviceId;
        var node = $scope.ZWaveAPIData.devices[nodeId];
        if (node == undefined)
            return;
        if (nodeId == 255 || node.data.isVirtual.value)
            return;
        var index = $scope.addData.instance;
        var group = parseInt($scope.addData.groupId);
        if ($scope.assocToInstance == null) {
            $scope.updates.push("devices." + nodeId + ".instances." + index + ".commandClasses." + (0x85) + ".data." + group);
            $scope.applyQueue.push('devices[' + nodeId + '].instances[' + index + '].commandClasses[0x85].Set(' + params + ')');
        } else {
            $scope.updates.push("devices." + nodeId + ".instances." + index + ".commandClasses." + (0x8e) + ".data." + group);
            $scope.applyQueue.push('devices[' + nodeId + '].instances[' + index + '].commandClasses[0x8e].Set(' + params + ')');
        }
        // cause view to show element
        $scope.addData.nodeIds.push(parseInt($scope.assocToNode));
        if ($scope.assocToInstance != null)
            $scope.addData.instanceIds.push(parseInt($scope.assocToInstance) + 1);
        else
            $scope.addData.instanceIds.push(null);
        $scope.addData.persistent.push("notInZWave");
        if ($scope.assocToInstance != null)
            $scope.addData.tooltips.push($scope._t('instance') + " " + ($scope.assocToInstance + 1) + " " + $scope._t('of') + " " + $filter('deviceName')($scope.assocToNode, $scope.ZWaveAPIData.devices[$scope.assocToNode]));
        else
            $scope.addData.tooltips.push($filter('deviceName')($scope.assocToNode, $scope.ZWaveAPIData.devices[$scope.assocToNode]));
        $('#modal_add').modal('hide');
    };
    // Open add assocation dialog
    $scope.openAdd = function(data) {
        $scope.addData = data;
        $scope.addNodes = {};
        $scope.addInstances = {};
        $scope.assocToNode = null;
        $scope.assocToInstance = null;
        // Prepare devices and nodes
        angular.forEach($scope.ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || node.data.isVirtual.value)
                return;
            for (var instanceId in $scope.ZWaveAPIData.devices[nodeId].instances) {
                var fromInstanceId = $scope.addData.instanceId;
                var groupId = $scope.addData.groupId;
                if (nodeId != $scope.addData.nodeId || fromInstanceId != instanceId) { // exclude self-assoc
                    var contained = false;
                    for (var i = 0; i < $scope.addData.nodeIds.length; i++) {
                        if ($scope.addData.nodeIds[i] == nodeId && ($scope.addData.instanceIds[i] == null || $scope.addData.instanceIds[i] == parseInt(instanceId) + 1)) {
                            contained = true;
                            break;
                        }
                    }
                    if (contained)
                        continue;
                    if (0 in node.instances) {
                        if ((0x8e in $scope.addData.node.instances[0].commandClasses) && (0x8e in node.instances[0].commandClasses)) {
                            // MultiChannelAssociation with instanceId
                            $scope.addNodes[nodeId] = '(#' + nodeId + ') ' + $filter('deviceName')(nodeId, node);
                            if (!(nodeId in $scope.addInstances))
                                $scope.addInstances[nodeId] = {};
                            $scope.addInstances[nodeId][instanceId] = parseInt(instanceId) + 1;
                        } else {
                            // simple Assocation
                            $scope.addNodes[nodeId] = '(#' + nodeId + ') ' + $filter('deviceName')(nodeId, node);
                            break; // first instance is enough
                        }
                    }
                }
            }
        });
        $('#modal_add').modal({});
    };
    // Load ZDDXML
    $scope.loadZDD = function(nodeId) {
        if (nodeId in $scope.zdd)
            return; // zdd already loaded for nodeId
        var node = $scope.ZWaveAPIData.devices[nodeId];
        if (node == undefined)
            return;
        var zddXmlFile = null;
        if (angular.isDefined(node.data.ZDDXMLFile)) {
            zddXmlFile = node.data.ZDDXMLFile.value;
        }
        if (!zddXmlFile || zddXmlFile === 'undefined')
            return; // not available

        var cachedZddXml = myCache.get(zddXmlFile);
        if (!cachedZddXml) {
            $http.get($scope.cfg.server_url + $scope.cfg.zddx_url + zddXmlFile).then(function(response) {
                var x2js = new X2JS();
                var zddXml = x2js.xml_str2json(response.data);
                myCache.put(zddXmlFile, zddXml);
                if (("ZWaveDevice" in zddXml) && ("assocGroups" in zddXml.ZWaveDevice)) {
                    $scope.zdd[nodeId] = zddXml.ZWaveDevice.assocGroups;
                    if (nodeId == $scope.deviceId)
                        $scope.updateData(nodeId);
                } else {
                    $scope.zdd[nodeId] = undefined;
                }
            });
        } else {
            var zddXml = cachedZddXml;
            if (("ZWaveDevice" in zddXml) && ("assocGroups" in zddXml.ZWaveDevice)) {
                $scope.zdd[nodeId] = zddXml.ZWaveDevice.assocGroups;
                if (nodeId == $scope.deviceId)
                    $scope.updateData(nodeId);
            } else {
                $scope.zdd[nodeId] = undefined;
            }
        }
    };
    $scope.updateData = function(nodeId) {
        var findLabel = function(nodeId, index, instance) {
            // Set default assoc group name
            var label = $scope._t('association_group') + " " + (index + 1);

            // Attempt to get assoc group name from the zdd file
            if ($scope.zdd[nodeId] && ("assocGroup" in $scope.zdd[nodeId]) && ((index) in $scope.zdd[nodeId].assocGroup)) {
                // find best matching lang, default english
                var langs = $scope.zdd[nodeId].assocGroup[index].description.lang;
                if ($.isArray(langs)) {
                    angular.forEach(langs, function(lang, index) {
                        if (("__text" in lang) && (lang["_xml:lang"] == $scope.lang)) {
                            label = lang.__text;
                            return false;
                        }
                        if (("__text" in lang) && (lang["_xml:lang"] == "en")) {
                            label = lang.__text;
                        }
                    });
                } else {
                    if (("__text" in langs)) {
                        label = langs.__text;
                    }
                }
            } else {
                // Attempt to get assoc group name from the command class
                angular.forEach(instance.commandClasses, function(v, k) {
                    if (v.name == 'AssociationGroupInformation') {
                        label = $filter('hasNode')(v, 'data.' + (index + 1) + '.groupName.value');
                    }

                });
            }
            return label;
        };
        $scope.keys = [];
        $scope.data = {};
        var node = $scope.ZWaveAPIData.devices[nodeId];
        if (node == undefined)
            return;
        if (nodeId == 255 || node.data.isVirtual.value)
            return;
        $.each(node.instances, function(index, instance) {
            if (!("commandClasses" in instance)) {
                return;
            }
            if ((0x85 in instance.commandClasses) || (0x8e in instance.commandClasses)) {
                var groups = 0;
                if (0x85 in instance.commandClasses) {
                    groups = instance.commandClasses[0x85].data.groups.value;
                }
                if (0x8e in instance.commandClasses) {
                    if (instance.commandClasses[0x8e].data.groups.value > groups)
                        groups = instance.commandClasses[0x8e].data.groups.value;
                }
                for (var group = 0; group < groups; group++) {
                    var key = nodeId + "." + index + "." + group;
                    if ($.inArray(key, $scope.keys) == -1)
                        $scope.keys.push(key);
                    var data;
                    var timeArray; // object to get updateTime from
                    var nodeIds = [];
                    var instanceIds = [];
                    var persistent = [];
                    var tooltips = [];
                    var type = null;
                    if ((0x85 in instance.commandClasses) && (group < instance.commandClasses[0x85].data.groups.value)) {
                        data = instance.commandClasses[0x85].data[group + 1];
                        timeArray = data.nodes;
                        for (var i = 0; i < data.nodes.value.length; i++) {
                            var targetNodeId = data.nodes.value[i];
                            nodeIds.push(targetNodeId);
                            var targetInstanceId = null;
                            instanceIds.push(targetInstanceId);
                            if (targetNodeId in $scope.ZWaveAPIData.devices) {
                                persistent.push("inZWave");
                                tooltips.push($filter('deviceName')(targetNodeId, $scope.ZWaveAPIData.devices[targetNodeId]));
                            } else {
                                persistent.push("dissapeared");
                                tooltips.push($scope._t('device_disappeared'));
                            }
                        }
                    }
                    if ((0x8e in instance.commandClasses) && (group < instance.commandClasses[0x8e].data.groups.value)) {
                        data = instance.commandClasses[0x8e].data[group + 1];
                        timeArray = data.nodesInstances;
                        for (var i = 0; i < data.nodesInstances.value.length; i += 2) {
                            var targetNodeId = data.nodesInstances.value[i];
                            nodeIds.push(targetNodeId);
                            var targetInstanceId = data.nodesInstances.value[i + 1];
                            instanceIds.push(targetInstanceId);
                            if (targetNodeId in $scope.ZWaveAPIData.devices) {
                                persistent.push("inZWave");
                                //tooltips.push($scope._t('instance') + " " + targetInstanceId + " " + $scope._t('of') + " " + $filter('deviceName')(targetNodeId, $scope.ZWaveAPIData.devices[targetNodeId]));
                                tooltips.push($filter('deviceName')(targetNodeId, $scope.ZWaveAPIData.devices[targetNodeId]));
                            } else {
                                persistent.push("notInZWave");
                                tooltips.push($scope._t('device_disappeared'));
                            }
                        }
                    }
                    $scope.data[key] = {"label": findLabel(nodeId, group, instance), "tooltips": tooltips, "nodeId": nodeId, "instanceId": index, "node": node, "instance": index, "groupId": (group + 1), "nodeIds": nodeIds, "instanceIds": instanceIds, "persistent": persistent, "update": timeArray, "max": data.max.value, "remaining": (data.max.value - nodeIds.length)};
                }
            }
        });
    };
    // Load data
    $scope.load = function(lang) {
        dataService.getZwaveDataQuietly(function(ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            // Gather associations
            var nodeId = $scope.deviceId;
            $scope.updateData(nodeId);
            // load initial zdd data (cached)
            angular.forEach($scope.ZWaveAPIData.devices, function(node, nodeId) {
                if (nodeId == 255 || node.data.isVirtual.value)
                    return;
                $scope.loadZDD(nodeId);
            });
        });
    };
    $scope.load($scope.lang);
    $scope.applyConfig = function() {
        var spinner = $('#AssociationTable .fa-spinner');
        spinner.show();
        while ($scope.applyQueue.length > 0) {
            var exec = $scope.applyQueue.shift();
            dataService.runCmd(exec, false, $scope._t('error_handling_data'));
        }
        pollForUpdate(Math.floor((new Date()).getTime() / 1000), $scope.updates);
        $scope.updates = [];

        var nodeId = $scope.deviceId;
        var node = $scope.ZWaveAPIData.devices[nodeId];
        var isListening = node.data.isListening.value;
        var isFLiRS = !isListening && (node.data.sensor250.value || node.data.sensor1000.value);
        var hasWakeup = 0x84 in node.instances[0].commandClasses;
        var hasBattery = 0x80 in node.instances[0].commandClasses;
        if (!isListening && !isFLiRS && hasBattery)
            alert($scope._t('conf_apply_battery'));
    };
    /**
     * Show modal window
     *
     * @returns {void}
     */
    $scope.showModalAssoc = function(target, param) {
        $(target).modal();
        $(target + ' .modal-title').html(param.title);
        return;
    };
});
// Configuration controller
appController.controller('ConfigurationController', function($scope, $routeParams, $route, $window, $http, $filter, $location, $cookies, $timeout, dataService, deviceService, myCache) {
    $scope.devices = [];
    $scope.showDevices = false;
    $scope.ZWaveAPIData;
    $scope.descriptionCont;
    $scope.configCont;
    $scope.switchAllCont;
    $scope.protectionCont;
    $scope.wakeupCont;
    $scope.fwupdateCont;
    $scope.interviewCommandsDevice;
    $scope.interviewCommands;
    $scope.assocCont;
    $scope.deviceId;
    $scope.deviceName = $scope._t('h1_configuration_no_device');
    $scope.deviceImage = '';
    $scope.deviceSelectImage = '';
    $scope.commands = [];
    $scope.deviceZddx = [];
    $scope.deviceZddxFile;
    $scope.refresh = false;
    $scope.hasBattery = false;
    $scope.formFirmware = {
        fw_url: "",
        fw_target: ""
    };
    $scope.reset = function() {
        $scope.devices = angular.copy([]);
        $scope.commands = angular.copy([]);
    };

    // Remember device id
    $scope.detailId = (angular.isDefined($cookies.configuration_id) ? $cookies.configuration_id : 0);
    // Redirect to detail page
    $scope.redirectToDetail = function(detailId) {
        if (detailId > 0) {
            $location.path('/config/configuration/' + detailId);
        }
    };

    // Remember active tab
    $scope.rememberTab = function(tabId) {
        if (tabId == 'interview') {
            $scope.devices = angular.copy([]);
            $scope.refresh = true;
        } else {
            $scope.refresh = false;

        }
        $cookies.tab_config = tabId;
    };
    // Get active tab
    $scope.getActiveTab = function() {
        var activeTab = (angular.isDefined($cookies.tab_config) ? $cookies.tab_config : 'interview');
        if (activeTab == 'interview') {
            $scope.devices = angular.copy([]);
            $scope.refresh = true;
        } else {
            $scope.refresh = false;
        }
        $scope.activeTab = activeTab;
    };
    $scope.getActiveTab();


    // Load data
    $scope.load = function(nodeId, refresh) {
        dataService.getZwaveData(function(ZWaveAPIData) {
            $scope.devices = angular.copy([]);
            $scope.deviceId = nodeId;
            setNavigation(ZWaveAPIData);
            setData(ZWaveAPIData, nodeId);
            $scope.ZWaveAPIData = ZWaveAPIData;
            dataService.cancelZwaveDataInterval();
            if (refresh) {
                dataService.joinedZwaveData(function(data) {
                    $scope.reset();
                    setNavigation(data.joined);
                    setData(data.joined, nodeId, true);
                    $scope.ZWaveAPIData = ZWaveAPIData;
                });
            }
        });
    };

    // Load
    if (parseInt($routeParams.nodeId, 10) > 0) {
        $scope.deviceId = $routeParams.nodeId;
        $scope.load($routeParams.nodeId, $scope.refresh);
        $cookies.configuration_id = $routeParams.nodeId;
    } else {
        $scope.deviceId = $scope.detailId;
        $scope.load($scope.detailId, $scope.refresh);
        $cookies.configuration_id = $scope.detailId;
        //$scope.redirectToDetail($scope.detailId);
    }

    // Watch for refresh change
    $scope.$watch('refresh', function() {
        if ($scope.refresh) {
            $scope.load($scope.deviceId, true);
        } else {
            dataService.cancelZwaveDataInterval();
        }

    });
    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });

    // Redirect to another device
    $scope.goToDetail = function(detailId) {
        $cookies.configuration_id = $routeParams.nodeId;
        $location.path('/config/configuration/' + detailId);
    };
    $scope.getNodeDevices = function() {
        var devices = [];
        angular.forEach($scope.devices, function(v, k) {
            if (devices_htmlSelect_filter($scope.ZWaveAPIData, 'span', v.id, 'node')) {
                return;
            }
            ;
            var obj = {};
            obj['id'] = v.id;
            obj['name'] = v.name;
            devices.push(obj);
        });
        return devices;
    };

    // Show modal device select dialog
    $scope.showModalDeviceSelect = function(target, nodeId) {
        dataService.getSelectZDDX(nodeId, function(data) {
            $scope.deviceZddx = data;
        });
        $(target).modal();

    };

    // Change device select
    $scope.changeDeviceSelect = function(selector, target) {
        var imageFile = $(selector).find(':selected').data('image');
        var image;
        if (imageFile == undefined) {
            image = $scope._t('no_device_image');
        } else {
            image = '<img src="' + imageFile + '" />';
        }
        $(target).html(image);
    };

    // Update device zddx file
    $scope.runCmdDeviceSelect = function(nodeId, file) {
        var cmd = 'devices[' + nodeId + '].LoadXMLFile("' + file + '")';
        dataService.runCmd(cmd, false, $scope._t('error_handling_data'));
        dataService.purgeCache();
        $scope.load(nodeId, false);
        $scope.load(nodeId, true);
        //$scope.refresh = true;
        //$window.location.reload();
        //$location.path('/config/configuration/' + nodeId);
        console.log($scope.refresh);
    };

    /**
     * Apply Config action
     *
     * @param {object} form
     * @returns {undefined}
     */
    $scope.submitApplyConfigCfg = function(form, cmd, cfg, hasBattery) {
        if (hasBattery) {
            alert($scope._t('conf_apply_battery'));
        }
        var sections = $('#' + form).find('.cfg-control-content');
        var data = $('#' + form).serializeArray();
        var dataValues = [];
        angular.forEach(data, function(v, k) {
            if (v.value !== '') {
                dataValues.push({"value": v.value, "name": v.name});
                //dataValues.push(v.name);
            }

        });

        //console.log(cfg);
        angular.forEach(dataValues, function(n, nk) {
            var lastNum = n.name.match(/\d+$/);
            if (!lastNum) {
                return;
            }
            var num = lastNum[0];
            var confSize = 0;
            //var lastNum = n.name.match(/\d+$/);
            var value = n.value;
            angular.forEach(cfg, function(cv, ck) {
                if (cv.confNum == num) {
                    confSize = cv.confSize;
                    //dataValues.push(v.name);
                }

            });
            var request = cmd + '(' + num + ',' + value + ',' + confSize + ')';
            dataService.runCmd(request, false, $scope._t('error_handling_data'));
        });
        $scope.refresh = true;
        var timeOut;
        timeOut = $timeout(function() {
            $scope.refresh = false;
        }, 10000);
        return;
    };

    /**
     * Apply Config action
     *
     * @param {object} form
     * @returns {undefined}
     */
    $scope.submitApplyConfig = function(form, cmd, hasBattery) {
        if (hasBattery) {
            alert($scope._t('conf_apply_battery'));
        }
        var data = $('#' + form).serializeArray();
        var dataJoined = [];
        angular.forEach(data, function(v, k) {
            if (v.value !== '') {
                dataJoined.push(v.value);
            }

        });
        var request = cmd + '(' + dataJoined.join() + ')';
        dataService.runCmd(request, false, $scope._t('error_handling_data'));
        $scope.refresh = true;
        var timeOut;
        timeOut = $timeout(function() {
            $scope.refresh = false;
        }, 10000);
        return;
    };

    /**
     * Update from device action
     *
     * @param {string} cmd
     * @returns {undefined}
     */
    $scope.updateFromDevice = function(cmd) {
        dataService.runCmd(cmd, false, $scope._t('error_handling_data'));
        $scope.refresh = true;
        var timeOut;
        timeOut = $timeout(function() {
            $scope.refresh = false;
        }, 10000);
        return;
    };
    /**
     * Update from device - configuration section
     *
     * @param {string} cmd
     * @param {obj} cfg
     * @returns {undefined}
     */
    $scope.updateFromDeviceCfg = function(cmd, cfg) {
        angular.forEach(cfg, function(v, k) {
            if (v.confNum) {
                var request = cmd + '(' + v.confNum + ')';
                dataService.runCmd(request);
            }
        });
        $scope.refresh = true;
        var timeOut;
        timeOut = $timeout(function() {
            $scope.refresh = false;
        }, 10000);
        return;
    };

    /// --- Private functions --- ///

    /**
     * Set page navigation
     */
    function setNavigation(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }

            var node = ZWaveAPIData.devices[nodeId];
            if (nodeId == $routeParams.nodeId) {
                $scope.deviceName = $filter('deviceName')(nodeId, node);
                $scope.deviceNameId = $filter('deviceName')(nodeId, node) + '(#' + nodeId + ')';
            }
            // Set object
            var obj = {};
            obj['id'] = nodeId;
            obj['rowId'] = 'row_' + nodeId;
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['slected'] = '';
            if (nodeId == $routeParams.nodeId) {

                obj['slected'] = 'selected';
            }
            $scope.devices.push(obj);
        });
    }
    ;
    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData, nodeId, refresh) {
        var node = ZWaveAPIData.devices[nodeId];
        if (!node) {
            return;
        }
        $scope.showDevices = true;
        $scope.deviceName = $filter('deviceName')(nodeId, node);
        $scope.deviceNameId = $filter('deviceName')(nodeId, node) + ' (#' + nodeId + ')';
        $scope.hasBattery = 0x80 in node.instances[0].commandClasses;
        var zddXmlFile = null;
        if (angular.isDefined(node.data.ZDDXMLFile)) {
            zddXmlFile = node.data.ZDDXMLFile.value;
            $scope.deviceZddxFile = node.data.ZDDXMLFile.value;
        }

        $scope.interviewCommands = interviewCommands(node);
        $scope.interviewCommandsDevice = node.data;
        if (zddXmlFile && zddXmlFile !== 'undefined') {
            var cachedZddXml = myCache.get(zddXmlFile);
            // Uncached file
            if (!cachedZddXml) {
                $http.get($scope.cfg.server_url + $scope.cfg.zddx_url + zddXmlFile).then(function(response) {
                    var x2js = new X2JS();
                    var zddXml = x2js.xml_str2json(response.data);
                    myCache.put(zddXmlFile, zddXml);
                    setCont(node, nodeId, zddXml, ZWaveAPIData, refresh);


                });
            } else {
                setCont(node, nodeId, cachedZddXml, ZWaveAPIData, refresh);
            }

        } else {

            setCont(node, nodeId, null, ZWaveAPIData, refresh);
        }
        /**
         * Expert commands
         */
        angular.forEach(node.instances, function(instance, instanceId) {
            angular.forEach(instance.commandClasses, function(commandClass, ccId) {
                var methods = getMethodSpec(ZWaveAPIData, nodeId, instanceId, ccId, null);
                var obj = {};
                obj['nodeId'] = nodeId;
                obj['rowId'] = 'row_' + nodeId + '_' + ccId;
                obj['instanceId'] = instanceId;
                obj['cmd'] = 'devices[' + nodeId + '].instances[' + instanceId + '].commandClasses[' + ccId + ']';
                obj['cmdData'] = ZWaveAPIData.devices[nodeId].instances[instanceId].commandClasses[ccId].data;
                obj['cmdDataIn'] = ZWaveAPIData.devices[nodeId].instances[instanceId].data;
                obj['commandClass'] = commandClass.name;
                obj['command'] = getCommands(methods, ZWaveAPIData);
                $scope.commands.push(obj);
            });
        });
        return;
    }
    /**
     * Set all conts
     */
    function setCont(node, nodeId, zddXml, ZWaveAPIData, refresh) {
        if (!zddXml) {
            $scope.noZddx = true;
        }
        // TODO: replace all with refresh function
        if (refresh == true) {
            refreshDescriptionCont(node, nodeId, zddXml, ZWaveAPIData);
        } else {
            $scope.descriptionCont = descriptionCont(node, nodeId, zddXml, ZWaveAPIData, refresh);
        }

        $scope.configCont = configCont(node, nodeId, zddXml);
        $scope.wakeupCont = wakeupCont(node, nodeId, ZWaveAPIData);
        $scope.switchAllCont = switchAllCont(node, nodeId, ZWaveAPIData);
        $scope.protectionCont = protectionCont(node, nodeId, ZWaveAPIData);
        $scope.fwupdateCont = fwupdateCont(node);
        $scope.assocCont = assocCont(node);
    }
    /**
     * Device description
     */
    function descriptionCont(node, nodeId, zddXml, ZWaveAPIData, refresh) {

        // Set device data
        var isPrimary = ZWaveAPIData.controller.data.isPrimary.value;
        var deviceImage = 'app/images/no_device_image.png';
        var deviceDescription = '';
        var productName = '';
        var inclusionNote = '';
        var brandName = node.data.vendorString.value;
        var wakeupNote = '';
        var ZWavePlusInfo = '';
        var ZWavePlusRoles = [];
        var securityInterview = '';
        var deviceDescriptionAppVersion = parseInt(node.data.applicationMajor.value, 10);
        var deviceDescriptionAppSubVersion = parseInt(node.data.applicationMinor.value, 10);
        if (isNaN(deviceDescriptionAppVersion))
            deviceDescriptionAppVersion = '-';
        if (isNaN(deviceDescriptionAppSubVersion))
            deviceDescriptionAppSubVersion = '-';
        var zwNodeName = '';
        if (0x77 in node.instances[0].commandClasses) {
            // NodeNaming
            zwNodeName = node.instances[0].commandClasses[0x77].data.nodename.value;
            if (zwNodeName != '') {
                zwNodeName = ' (' + zwNodeName + ')';
            }


        }
        // Security interview
        if (0x98 in node.instances[0].commandClasses) {
            securityInterview = node.instances[0].commandClasses[0x98].data.securityAbandoned.value;
        }

        var sdk;
        if (node.data.SDK.value == '') {
            sdk = '(' + node.data.ZWProtocolMajor.value + '.' + node.data.ZWProtocolMinor.value + ')';
        } else {
            sdk = node.data.SDK.value;
        }

        // Command class
        var ccNames = [];
        angular.forEach($scope.interviewCommands, function(v, k) {
            ccNames.push(v.ccName);
        });
        // Has device a zddx XML file
        if (zddXml) {
            var lang = 'en';
            var langs = {
                "en": "1",
                "de": "0",
                "ru": "2"
            };
            if (angular.isDefined(langs[$scope.lang])) {
                lang = $scope.lang;
            }
            var langId = langs[lang];
            if (angular.isDefined(zddXml.ZWaveDevice.deviceDescription.description.lang[langId])) {
                deviceDescription = zddXml.ZWaveDevice.deviceDescription.description.lang[langId].__text;
            }
            if ('productName' in zddXml.ZWaveDevice.deviceDescription) {
                productName = zddXml.ZWaveDevice.deviceDescription.productName;
            }
            if (angular.isDefined(zddXml.ZWaveDevice.deviceDescription.inclusionNote.lang[langId])) {
                inclusionNote = zddXml.ZWaveDevice.deviceDescription.inclusionNote.lang[langId].__text;
            }

            if ('brandName' in zddXml.ZWaveDevice.deviceDescription) {
                brandName = zddXml.ZWaveDevice.deviceDescription.brandName;
            }
            if (angular.isDefined(zddXml.ZWaveDevice.deviceDescription.wakeupNote.lang[langId])) {
                wakeupNote = zddXml.ZWaveDevice.deviceDescription.wakeupNote.lang[langId].__text;
            }
            if (angular.isDefined(zddXml.ZWaveDevice.resourceLinks)) {
                deviceImage = zddXml.ZWaveDevice.resourceLinks.deviceImage._url;
            }
            /**
             * TODO: finish ZWavePlusRoles
             */
            if (angular.isDefined(zddXml.ZWaveDevice.RoleTypes)) {
                angular.forEach(zddXml.ZWaveDevice.RoleTypes, function(v, k) {
                    ZWavePlusRoles.push(v);
                });
            }
        }

        // Set device image
        $scope.deviceImage = deviceImage;
        // OBJ
        var obj = {};
        obj["a"] = {"key": "device_node_id", "val": nodeId};
        obj["b"] = {"key": "device_node_name", "val": $filter('deviceName')(nodeId, node)};
        obj["c"] = {"key": "device_node_type", "val": ''};
        obj["d"] = {"key": "device_description_brand", "val": brandName};
        obj["e"] = {"key": "device_description_device_type", "val": node.data.deviceTypeString.value};
        obj["f"] = {"key": "device_description_product", "val": productName};
        obj["g"] = {"key": "device_description_description", "val": deviceDescription};
        obj["h"] = {"key": "device_description_inclusion_note", "val": inclusionNote};
        obj["i"] = {"key": "device_description_wakeup_note", "val": (wakeupNote ? wakeupNote : '')};
        obj["j"] = {"key": "device_description_interview", "val": interviewStage(ZWaveAPIData, nodeId)};
        obj["k"] = {"key": "device_sleep_state", "val": deviceState(node)};
        //obj["l"] = {"key": "device_queue_length", "val": queueLength(ZWaveAPIData, node)};
        obj["m"] = {"key": "device_description_app_version", "val": deviceDescriptionAppVersion + '.' + deviceDescriptionAppSubVersion};
        obj["o"] = {"key": "device_description_sdk_version", "val": sdk};
        //obj["p"] = {"key": "command_class", "val": ccNames.join(', ')};
        obj["p"] = {"key": "command_class", "val": ccNames};
        obj["q"] = {"key": "zwave_role_type", "val": ZWavePlusRoles.join(', ')};
        if (deviceService.isLocalyReset(node)) {
            obj["r"] = {"key": "device_reset_locally", "val": '<i class="' + $filter('checkedIcon')(true) + '"></i>'};
        }
        if (typeof securityInterview === 'boolean') {
            obj["s"] = {"key": "device_security_interview", "val": '<i class="' + $filter('checkedIcon')(securityInterview === true ? false : true) + '"></i>'};
        }
        return obj;
    }
    /**
     * Refresh description cont
     */
    function refreshDescriptionCont(node, nodeId, zddXml, ZWaveAPIData) {
        $('#device_sleep_state .config-interview-val').html(deviceState(node));
        $('#device_description_interview .config-interview-val').html(interviewStage(ZWaveAPIData, nodeId));
    }
    // Set interview stage
    function interviewStage(ZWaveAPIData, id) {
        var istages = [];
        istages.push((ZWaveAPIData.devices[id].data.nodeInfoFrame.value && ZWaveAPIData.devices[id].data.nodeInfoFrame.value.length) ? '+' : '-');
        istages.push('&nbsp;');
        istages.push((0x86 in ZWaveAPIData.devices[id].instances[0].commandClasses) ? (ZWaveAPIData.devices[id].instances[0].commandClasses[0x86].data.interviewDone.value ? '+' : (ZWaveAPIData.devices[id].instances[0].commandClasses[0x86].data.interviewCounter.value > 0 ? '.' : '&oslash;')) : '+'); // Version
        istages.push((0x72 in ZWaveAPIData.devices[id].instances[0].commandClasses) ? (ZWaveAPIData.devices[id].instances[0].commandClasses[0x72].data.interviewDone.value ? '+' : (ZWaveAPIData.devices[id].instances[0].commandClasses[0x72].data.interviewCounter.value > 0 ? '.' : '&oslash;')) : '+'); // ManufacturerSpecific
        istages.push((0x60 in ZWaveAPIData.devices[id].instances[0].commandClasses) ? (ZWaveAPIData.devices[id].instances[0].commandClasses[0x60].data.interviewDone.value ? '+' : (ZWaveAPIData.devices[id].instances[0].commandClasses[0x60].data.interviewCounter.value > 0 ? '.' : '&oslash;')) : '+'); // MultiChannel
        var moreCCs = false;
        for (var i in ZWaveAPIData.devices[id].instances) {
            istages.push('&nbsp;');
            var instance = ZWaveAPIData.devices[id].instances[i];
            for (var cc in instance.commandClasses) {
                moreCCs = true;
                if ((cc == 0x60 && i != 0) || ((cc == 0x86 || cc == 0x72 || cc == 0x60) && i == 0))
                    continue; // skip MultiChannel announced inside a MultiChannel and previously handled CCs.
                istages.push(instance.commandClasses[cc].data.interviewDone.value ? '+' : (instance.commandClasses[cc].data.interviewCounter.value > 0 ? '.' : '&oslash;'));
            }
        }
        ;
        if (!moreCCs) {
            istages.push('.');
        }

        var descr;
        if (istages.indexOf('&oslash;') == -1) {
            if (istages.indexOf('.') == -1 && istages.indexOf('-') == -1)
                descr = $scope._t('device_interview_stage_done');
            else
                descr = $scope._t('device_interview_stage_not_complete');
        } else
            descr = $scope._t('device_interview_stage_failed');
        return descr + '<br />' + istages.join('');
    }

    // Set device state
    function deviceState(node) {
        var out = '';
        if (!node.data.isListening.value && !node.data.sensor250.value && !node.data.sensor1000.value) {
            out = (node.data.isAwake.value ? '<i class="fa fa-certificate fa-lg text-orange""></i> ' + $scope._t('device_is_active') : '<i class="fa fa-moon-o fa-lg text-primary"></i> ' + $scope._t('device_is_sleeping'));
        } else {
            out = (node.data.isFailed.value ? '<i class="fa fa-check fa-lg text-danger"></i> ' + $scope._t('device_is_dead') : '<i class="fa fa-check fa-lg text-success"></i> ' + $scope._t('device_is_operating'));
        }
        return out;
    }

    // Queue length
    function queueLength(ZWaveAPIData, node) {
        var out = $scope._t('nm_queue_count_jobs_disabled');
        if (ZWaveAPIData.controller.data.countJobs.value) {
            out = node.data.queueLength.value;
        }
        return out;
    }

    // Interview commands
    function interviewCommands(node) {
        var interviews = [];
        for (var iId in node.instances) {
            var cnt = 0;
            for (var ccId in node.instances[iId].commandClasses) {
                var obj = {};
                obj['iId'] = iId;
                obj['ccId'] = ccId;
                obj['ccName'] = node.instances[iId].commandClasses[ccId].name;
                obj['interviewDone'] = node.instances[iId].commandClasses[ccId].data.interviewDone.value;
                obj['cmdData'] = node.instances[iId].commandClasses[ccId].data;
                obj['cmdDataIn'] = node.instances[iId].data;
                interviews.push(obj);
                cnt++;
            }
            ;
        }
        ;
        return interviews;
    }
    /**
     * Config cont
     */
    function configCont(node, nodeId, zddXml) {
        if (!0x70 in node.instances[0].commandClasses) {
            return null;
        }
        if (!zddXml) {
            return null;
        }

        if (!zddXml.ZWaveDevice.hasOwnProperty("configParams")) {
            return null;
        }
        var config_cont = [];
        var params = zddXml.ZWaveDevice.configParams['configParam'];
        var lang = 'en';
        var langs = {
            "en": "1",
            "de": "0"
        };
        if (angular.isDefined(langs[$scope.lang])) {
            lang = $scope.lang;
        }
        var langId = langs[lang];
        // Loop throught params
        var parCnt = 0;
        angular.forEach(params, function(conf_html, i) {
            //console.log(zddXml);
            if (!angular.isObject(conf_html)) {
                return;
            }

            have_conf_params = true;
            var conf = conf_html;
            var conf_num = conf['_number'];
            var conf_size = conf['_size'];
            var conf_name = deviceService.configGetZddxLang($filter('hasNode')(conf, 'name.lang'),$scope.lang) || $scope._t('configuration_parameter') + ' ' + conf_num;
            var conf_description = deviceService.configGetZddxLang($filter('hasNode')(conf, 'description.lang'),$scope.lang);
// TODO: remove            if (angular.isDefined(conf.name)) {
//
//                if (angular.isDefined(conf.name.lang[langId])) {
//                    conf_name = conf.name.lang[langId].__text;
//                } else if (angular.isDefined(conf.name.lang)) {
//                    conf_name = conf.name.lang.__text;
//                }
//            }
//            var conf_description = '';
//            if (angular.isDefined(conf.description)) {
//                if (angular.isDefined(conf.description.lang[langId])) {
//                    conf_description = conf.description.lang[langId].__text;
//                } else if (angular.isDefined(conf.description)) {
//                    conf_description = conf.description.lang.__text;
//                }
//            }
            var conf_size = conf['_size'];
            var conf_default_value = null;
            var conf_type = conf['_type'];
            var showDefaultValue = null;
            // get default value from the XML
            var conf_default = null;
            if (conf['_default'] !== undefined) {
                conf_default = parseInt(conf['_default'], 16);
                showDefaultValue = conf_default;
            }

            // get value from the Z-Wave data
            var config_zwave_value = null;

            if (angular.isDefined(node.instances[0].commandClasses[0x70])) {
                if (node.instances[0].commandClasses[0x70].data[conf_num] != null && node.instances[0].commandClasses[0x70].data[conf_num].val.value !== "") {
                    config_zwave_value = node.instances[0].commandClasses[0x70].data[conf_num].val.value;
                    conf_default = config_zwave_value;

                }

            }

            var isUpdated = true;
            var updateTime = '';
            if (angular.isDefined(node.instances[0].commandClasses[0x70])
                    && angular.isDefined(node.instances[0].commandClasses[0x70].data[conf_num])) {
                var uTime = node.instances[0].commandClasses[0x70].data[conf_num].updateTime;
                var iTime = node.instances[0].commandClasses[0x70].data[conf_num].invalidateTime;
                var updateTime = $filter('isTodayFromUnix')(uTime);
                var isUpdated = (uTime > iTime ? true : false);
            }

            // Switch
            var conf_method_descr;
            console.log(conf_type)
            switch (conf_type) {
                case 'constant':
                case 'rangemapped':
                    var param_struct_arr = [];
                    var conf_param_options = '';

                    angular.forEach(conf['value'], function(value_html, i) {
                        var value = value_html;
                        var value_from = parseInt(value['_from'], 16);
                        var value_to = parseInt(value['_to'], 16);
                        var value_description = deviceService.configGetZddxLang($filter('hasNode')(value, 'description.lang'),$scope.lang);
                        
                        
// TODO: remove
//                        if (angular.isDefined(value.description)) {
//                            //value_description = value.description.lang[1].__text;
//                            value_description = $filter('hasNode')(value, 'description.lang[1].__text');
//
//                            if (angular.isDefined(value.description.lang[langId])) {
//                                value_description = value.description.lang[langId].__text;
//                            }
//                        }
//                        if (angular.isDefined(value.lang)) {
//                            value_description = value.lang[1].text;
//                            angular.forEach(value.lang, function(lv, lk) {
//                                if (lk == langId) {
//                                    value_description = lv.__text;
//                                }
//                            });
//                        }
                        var value_repr = value_from; // representative value for the range
                        if (conf_default !== null)
                            if (value_from <= conf_default && conf_default <= value_to) {
                                conf_default_value = value_description;
                                value_repr = conf_default;
                            }
                        param_struct_arr.push({
                            label: value_description,
                            type: {
                                fix: {
                                    value: value_repr
                                }
                            }
                        });
                    });
                    conf_method_descr = {
                        nodeId: nodeId,
                        label: 'Nº ' + conf_num + ' - ' + conf_name,
                        type: {
                            enumof: param_struct_arr
                        },
                        name: 'input_' + nodeId + '_' + conf_num,
                        description: conf_description,
                        updateTime: updateTime,
                        isUpdated: isUpdated,
                        defaultValue: conf_default_value,
                        showDefaultValue: showDefaultValue,
                        confNum: conf_num,
                        confSize: conf_size
                    };

                    break;
                case 'range':

                    var param_struct_arr = [];
                    var rangeParam = conf['value'];
                    //console.log(rangeParam, conf_num);

                    if (!rangeParam) {
                        conf_method_descr = {
                            nodeId: nodeId,
                            label: 'Nº ' + conf_num + ' - ' + conf_name,
                            type: {
                                noval: null
                            },
                            name: 'input_' + nodeId + '_' + conf_num,
                            description: conf_description,
                            updateTime: updateTime,
                            isUpdated: isUpdated,
                            defaultValue: null,
                            showDefaultValue: showDefaultValue,
                            confNum: conf_num,
                            confSize: conf_size
                        };
                        break;
                    }
                    angular.forEach(rangeParam, function(value_html, ri) {
                        //console.log(ri);
                        var value = value_html;

                        if (ri == 'description') {
                            //console.log(ri);
                            var value_from = parseInt(rangeParam['_from'], 16);
                            var value_to = parseInt(rangeParam['_to'], 16);

                        } else {
                            var value_from = parseInt(value['_from'], 16);
                            var value_to = parseInt(value['_to'], 16);
                        }

//                        var value_description = '';
//                        if (angular.isDefined(value.description)) {
//                            //value_description = value.description.lang[1].__text;
//                            if (angular.isDefined(value.description.lang[langId])) {
//                                value_description = value.description.lang[langId].__text;
//                            } else if (angular.isDefined(value.description.lang)) {
//                                value_description = value.description.lang.__text;
//                            }
//                        }
//                        if (angular.isDefined(value.lang)) {
//
//                            if (angular.isDefined(value.lang['__text'])) {
//                                value_description = value.lang['__text'];
//                            } else if (angular.isDefined(value.lang[langId])) {
//                                value_description = value.lang[langId].__text;
//                            }
//                        }
                       var value_description = deviceService.configGetZddxLang($filter('hasNode')(value, 'description.lang'),$scope.lang);

                        if (conf_default !== null)
                            conf_default_value = conf_default;


                        if (value_from != value_to) {
                            if (value_description != '') {
                                var rangeVal = {
                                    label: value_description,
                                    type: {
                                        range: {
                                            min: value_from,
                                            max: value_to
                                        }
                                    }
                                };
                                param_struct_arr.push(rangeVal);
                            }
                        }
                        else // this is a fix value
                        if (value_description != '') {
                            param_struct_arr.push({
                                label: value_description,
                                type: {
                                    fix: {
                                        value: value_from
                                    }
                                }
                            });
                        }
                    });

                    if (param_struct_arr.length > 1)
                        conf_method_descr = {
                            nodeId: nodeId,
                            label: 'Nº ' + conf_num + ' - ' + conf_name,
                            type: {
                                enumof: param_struct_arr
                            },
                            hideRadio: false,
                            name: 'input_' + nodeId + '_' + conf_num,
                            description: conf_description,
                            updateTime: updateTime,
                            isUpdated: isUpdated,
                            defaultValue: conf_default_value,
                            showDefaultValue: showDefaultValue,
                            confNum: conf_num,
                            confSize: conf_size
                        };
                    else if (param_struct_arr.length == 1) {

                        conf_method_descr = {
                            nodeId: nodeId,
                            label: 'Nº ' + conf_num + ' - ' + conf_name,
                            type: {
                                enumof: param_struct_arr
                            },
                            name: 'input_' + nodeId + '_' + conf_num,
                            hideRadio: true,
                            description: conf_description,
                            updateTime: updateTime,
                            isUpdated: isUpdated,
                            defaultValue: conf_default_value,
                            showDefaultValue: showDefaultValue,
                            confNum: conf_num,
                            confSize: conf_size
                        };
                    }

                    break;
                case 'bitset':
                    var param_struct_arr = [];
                    var conf_param_options = '';
                    var conf_default_value_arr = new Object;
                    if (conf_default !== null) {
                        var bit = 0;
                        do {
                            if ((1 << bit) & conf_default)
                                conf_default_value_arr[bit] = 'Bit ' + bit + ' set';
                        } while ((1 << (bit++)) < conf_default);
                    }
                    ;
                    angular.forEach(conf['value'], function(value_html, i) {
                        var value = value_html;
                        var value_from = parseInt(value['_from'], 16);
                        var value_to = parseInt(value['_to'], 16);
                        var value_description = 'fdf';
                        var value_description = '';
                        if (conf_default !== null) {
                            if (value_from == value_to) {
                                if ((1 << value_from) & conf_default)
                                    conf_default_value_arr[value_from] = value_description;
                            } else {
                                conf_default_value_arr[value_from] = (conf_default >> value_from) & ((1 << (value_to - value_from + 1)) - 1)
                                for (var bit = value_from + 1; bit <= value_to; bit++)
                                    delete conf_default_value_arr[bit];
                            }
                        }
                        ;
                        if (value_from == value_to)
                            param_struct_arr.push({
                                label: value_description,
                                name: 'input_' + nodeId + '_' + conf_num,
                                type: {
                                    bitcheck: {
                                        bit: value_from
                                    }
                                }
                            });
                        else
                            param_struct_arr.push({
                                label: value_description,
                                name: 'input_' + nodeId + '_' + conf_num,
                                type: {
                                    bitrange: {
                                        bit_from: value_from,
                                        bit_to: value_to
                                    }
                                }
                            });
                    });
                    if (conf_default !== null) {
                        conf_default_value = '';
                        for (var ii in conf_default_value_arr)
                            conf_default_value += conf_default_value_arr[ii] + ', ';
                        if (conf_default_value.length)
                            conf_default_value = conf_default_value.substr(0, conf_default_value.length - 2);
                    }
                    conf_method_descr = {
                        nodeId: nodeId,
                        label: 'Nº ' + conf_num + ' - ' + conf_name,
                        type: {
                            bitset: param_struct_arr
                        },
                        name: 'input_' + nodeId + '_' + conf_num,
                        description: conf_description,
                        updateTime: updateTime,
                        isUpdated: isUpdated,
                        defaultValue: conf_default_value,
                        showDefaultValue: showDefaultValue,
                        confNum: conf_num,
                        confSize: conf_size
                    };
                    break;
                default:
                    return;
                    //conf_cont.append('<span>' + $.translate('unhandled_type_parameter') + ': ' + conf_type + '</span>');
            }
            ;
            config_cont.push(conf_method_descr);
            parCnt++;
        });

        return config_cont;
    }

    /**
     * Wakeup cont
     */
    function wakeupCont(node, nodeId, ZWaveAPIData) {
        var wakeup_cont = false;
        if (0x84 in node.instances[0].commandClasses) {
            var wakeup_zwave_min = (node.instances[0].commandClasses[0x84].data.version.value == 1) ? 0 : node.instances[0].commandClasses[0x84].data.min.value;
            var wakeup_zwave_max = (node.instances[0].commandClasses[0x84].data.version.value == 1) ? 0xFFFFFF : node.instances[0].commandClasses[0x84].data.max.value;
            var wakeup_zwave_value = node.instances[0].commandClasses[0x84].data.interval.value;
            var wakeup_zwave_default_value = (node.instances[0].commandClasses[0x84].data.version.value == 1) ? 86400 : node.instances[0].commandClasses[0x84].data['default'].value; // default is a special keyword in JavaScript
            var wakeup_zwave_nodeId = node.instances[0].commandClasses[0x84].data.nodeId.value;
            var uTime = node.instances[0].commandClasses[0x84].data.updateTime;
            var iTime = node.instances[0].commandClasses[0x84].data.invalidateTime;
            var updateTime = $filter('isTodayFromUnix')(uTime);
            var isUpdated = (uTime > iTime ? true : false);
            if (wakeup_zwave_min !== '' && wakeup_zwave_max !== '') {
                //var methods = getMethodSpec(ZWaveAPIData, nodeId, instanceId, ccId, null);
                var gui_descr = getMethodSpec(ZWaveAPIData, nodeId, 0, 0x84, 'Set');
                gui_descr[0].type.range.min = parseInt(wakeup_zwave_min, 10);
                gui_descr[0].type.range.max = parseInt(wakeup_zwave_max, 10);
                var wakeup_config = null;
                var wakeup_conf_el;
                var wakeup_conf_value;
                var wakeup_conf_nodeId;
                //if (wakeup_config.size() == 1) {
                if (wakeup_config) {
                    var re = new RegExp('\\[([0-9]+),([0-9]+)\\]');
                    var rem = re.exec(wakeup_config.attr("parameter"));
                    wakeup_conf_value = (rem) ? parseInt(rem[1], 10) : null;
                    wakeup_conf_nodeId = (rem) ? parseInt(rem[2], 10) : null;
                    wakeup_conf_el = wakeup_config.get(0);
                } else {
                    if (wakeup_zwave_value != "" && wakeup_zwave_value != 0 && wakeup_zwave_nodeId != "") {
                        // not defined in config: adopt devices values
                        wakeup_conf_value = parseInt(wakeup_zwave_value, 10);
                        wakeup_conf_nodeId = parseInt(wakeup_zwave_nodeId, 10);
                    } else {
                        // values in device are missing. Use defaults
                        wakeup_conf_value = parseInt(wakeup_zwave_default_value, 10);
                        wakeup_conf_nodeId = parseInt(ZWaveAPIData.controller.data.nodeId.value, 10);
                    }
                    ;
                }
                ;
                wakeup_cont = {
                    'params': gui_descr,
                    'values': {"0": wakeup_conf_value},
                    updateTime: updateTime,
                    isUpdated: isUpdated,
                    defaultValue: wakeup_conf_value,
                    cmd: 'devices[' + nodeId + '].instances[0].commandClasses[0x84]'
                };
            } else {
                //$('#wakeup_cont .cfg-block-content').append('<span>' + $scope._t('config_ui_wakeup_no_min_max') + '</span>');
            }
        }
        ;
        return wakeup_cont;
    }


    /**
     * Switch all cont
     */
    function switchAllCont(node, nodeId, ZWaveAPIData) {
        var switchall_cont = false;
        if (0x27 in node.instances[0].commandClasses) {
            var uTime = node.instances[0].commandClasses[0x27].data.mode.updateTime;
            var iTime = node.instances[0].commandClasses[0x27].data.mode.invalidateTime;
            var updateTime = $filter('isTodayFromUnix')(uTime);
            var isUpdated = (uTime > iTime ? true : false);
            var gui_descr = getMethodSpec(ZWaveAPIData, nodeId, 0, 0x27, 'Set');
            var switchall_conf_value;
            var switchall_conf_el;
            var switchall_config = null;
            if (switchall_config) {
                switchall_conf_value = 1;
            } else {
                switchall_conf_value = 1; // by default switch all off group only
            }
            switchall_cont = {
                'params': gui_descr,
                'values': {0: switchall_conf_value},
                updateTime: updateTime,
                isUpdated: isUpdated,
                defaultValue: switchall_conf_value,
                cmd: 'devices[' + nodeId + '].instances[0].commandClasses[0x27]'
            };
        }
        ;
        return switchall_cont;
    }

    /**
     * Protection cont
     */
    function protectionCont(node, nodeId, ZWaveAPIData) {
        var protection_cont = false;
        if (0x75 in node.instances[0].commandClasses) {
            var uTime = node.instances[0].commandClasses[0x75].data.state.updateTime;
            var iTime = node.instances[0].commandClasses[0x75].data.state.invalidateTime;
            var updateTime = $filter('isTodayFromUnix')(uTime);
            var isUpdated = (uTime > iTime ? true : false);
            var gui_descr = getMethodSpec(ZWaveAPIData, nodeId, 0, 0x75, 'Set');
            var protection_version = node.instances[0].commandClasses[0x75].data.version.value;
            var protection_config = null;
            var protection_conf_value;
            var protection_conf_rf_value;
            var protection_conf_el;
            if (protection_config) {
                protection_conf_value = 0;
                protection_conf_rf_value = 0;
            } else {
                protection_conf_value = 0; // by default protection is disabled
                protection_conf_rf_value = 0; // by default protection is disabled
            }

            protection_cont = {
                'params': gui_descr,
                'values': {0: protection_conf_value},
                updateTime: updateTime,
                isUpdated: isUpdated,
                defaultValue: protection_conf_value,
                cmd: 'devices[' + nodeId + '].instances[0].commandClasses[0x75]'
            };
        }
        ;
        return protection_cont;
    }

    /**
     * Fwupdate cont
     */
    function fwupdateCont(node) {
        var fwupdate_cont = false;
        if (0x7a in node.instances[0].commandClasses) {
            fwupdate_cont = true;
        }
        ;
        return fwupdate_cont;
    }

    /**
     * Assoc cont
     */
    function assocCont(node) {
        var assoc_cont = null;
        if (0x85 in node.instances[0].commandClasses) {
            assoc_cont = true;
        }
        ;
        return assoc_cont;
    }
    /**
     * Build expert commands
     * @returns {Array}
     */
    function getCommands(methods, ZWaveAPIData) {
        var methodsArr = [];
        angular.forEach(methods, function(params, method) {
            //str.split(',');
            var cmd = {};
            var values = repr_array(method_defaultValues(ZWaveAPIData, methods[method]));
            cmd['data'] = {
                'method': method,
                'params': methods[method],
                'values': method_defaultValues(ZWaveAPIData, methods[method])
            };
            cmd['method'] = method;
            cmd['params'] = methods[method];
            cmd['values'] = repr_array(method_defaultValues(ZWaveAPIData, methods[method]));
            methodsArr.push(cmd);
        });
        //console.log(methodsArr);
        return methodsArr;
    }
    ;
});
// Device config update controller
appController.controller('ConfigStoreController', function($scope, dataService) {
    $scope.formFirmware = {};
    // Store data on remote server
    $scope.store = function(btn) {
        var url = $scope.cfg.server_url + $scope.cfg.store_url + $(btn).attr('data-store-url');
        dataService.runCmd($(btn).attr('data-store-url'), false, $scope._t('error_handling_data'));
    };
    // Show modal dialog
    $scope.showModalInterview = function(target) {
        $(target).modal();
    };

    /**
     * Rename Device action
     *
     * @param {object} form
     * @returns {undefined}
     */
    $scope.renameDevice = function(form) {
        var deviceId = $scope.deviceId;
        var givenName = $('#' + form + ' #device_name').val();
        var cmd = 'devices[' + deviceId + '].data.givenName.value=\'' + givenName + '\'';
        dataService.runCmd(cmd, false, $scope._t('error_handling_data'));
        $('#config_device_name').html(givenName);
        $('#device_node_name').html(givenName);
        return;
    };

    /**
     * Submit expert commands form
     *
     * @param {obj} form
     * @param {obj} cmd
     * @returns {undefined}
     */
    $scope.submitExpertCommndsForm = function(form, cmd) {
        //var data = $('#' + form).serialize();
        var data = $('#' + form).serializeArray();
        var dataJoined = [];
        angular.forEach(data, function(v, k) {
            if (v.value !== '') {
                dataJoined.push(v.value);
            }

        });
        var request = cmd + '(' + dataJoined.join() + ')';
        dataService.runCmd(request, false, $scope._t('error_handling_data'));
        return;
    };
    /**
     * update Firmware
     */
    $scope.updateFirmware = function(nodeId) {
        if (($scope.formFirmware.url == '' && $scope.myFile == '') || $scope.formFirmware.targetId == '') {
            return;
        }
        // File upload test
        var data = {
            'url': $scope.formFirmware.url,
            'file': $scope.myFile,
            'targetId': $scope.formFirmware.targetId
        };
        dataService.fwUpdate(nodeId, data);
        return;
    };
});
// Controll controller
appController.controller('ControllController', function($scope, $filter, $timeout, $route, $upload, cfg, dataService) {
    $scope.devices = [];
    $scope.failedNodes = [];
    $scope.replaceNodes = [];
    $scope.failedBatteries = [];
    $scope.modelSucSicNode = 1;
    $scope.sucNodes = [];
    $scope.disableSUCRequest = true;
    $scope.controllerState = 0;
    $scope.secureInclusion;
    $scope.lastExcludedDevice;
    $scope.lastIncludedDevice;
    $scope.startLearnMode;
    $scope.lastIncludedDevice = null;
    $scope.lastExcludedDevice = null;
    $scope.restoreBackupStatus = 0;
    $scope.deviceInfo = {
        "id": null,
        "name": null
    };
    $scope.deviceClasses = [];
    $scope.goReset = false;
    $scope.refresh = true;
    $scope.reset = function(refresh) {
        $scope.devices = angular.copy([]);
        if (refresh) {
            $scope.failedNodes = angular.copy([]);
            $scope.replaceNodes = angular.copy([]);
            $scope.failedBatteries = angular.copy([]);
        }

    };

    // Load  device classes xml data
    $scope.loadDeviceClasses = function() {
        dataService.getDeviceClasses(function(data) {
            var lang = 'en';
            angular.forEach(data.DeviceClasses.Generic, function(val, key) {
                var obj = {};
                var langs = {
                    "en": "0",
                    "de": "1",
                    "ru": "2"
                };
                if (angular.isDefined(langs[$scope.lang])) {
                    lang = $scope.lang;
                }
                var langId = 0;
                obj['id'] = parseInt(val._id);
                obj['generic'] = val.name.lang[langId].__text;
                obj['specific'] = val.Specific;
                obj['langId'] = langId;
                $scope.deviceClasses.push(obj);
            });
        });
    };
    $scope.loadDeviceClasses();

    /**
     * Load data
     */
    $scope.load = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            setData(ZWaveAPIData, true);
            dataService.joinedZwaveData(function(data) {
                //$scope.reset($scope.refresh);
                //setData(data.joined, $scope.refresh);
                $scope.reset(false);
                setData(data.joined, false);
                refresh(data.update);
            });
        });
    };
    $scope.load();

    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });
    /**
     * Show modal window
     *
     * @returns {void}
     */
    $scope.showModal = function(target, id) {

        var obj = $filter('filter')($scope.devices, function(d) {
            return d.id == id;
        })[0];
        if (obj) {
            $scope.deviceInfo = {
                "id": obj.id,
                "name": obj.name
            };
        }
        $(target).modal();
        return;
    };
    /**
     * Run command
     *
     * @returns {void}
     */
    $scope.runCmd = function(cmd, hideModal, url, action) {
        var folder = (url ? url : '/ZWaveAPI/Run/');
        if (angular.isArray(cmd)) {
            angular.forEach(cmd, function(v, k) {
                dataService.runCmd(null, folder + v);
                //console.log(folder + v);

            });
        } else {
            dataService.runCmd(null, folder + cmd, $scope._t('error_handling_data'));
            //console.log(folder + cmd);
        }
        if (action) {
            switch (action.name) {
                case 'remove_option':
                    $(action.id + ' option[value=' + action.value + ']').remove();
                    break;
                case 'reset_controller':
                    $("#reset_confirm").attr('checked', false);
                    $scope.goReset = false;
                    console.log('reset_controller');
                    break;
            }
        }

        if (hideModal) {
            $(hideModal).modal('hide');
        }

        return;
    };
    /**
     * Send request restore backup
     * @returns {void}
     */
    $scope.restoreBackup = function($files, chip, show, hide) {
        chip = (!chip ? 0 : chip);
        //var url = 'upload.php?restore_chip_info=' + chip;
        var url = cfg.server_url + cfg.restore_url + '?restore_chip_info=' + chip;
        //$files: an array of files selected, each file has name, size, and type.
        $(show).show();
        $(hide).hide();
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            $upload.upload({
                url: url,
                fileFormDataName: 'config_backup',
                file: $file
            }).progress(function(evt) {
                $scope.restoreBackupStatus = 1;
                //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function(data, status, headers, config) {
                if (data && data.replace(/(<([^>]+)>)/ig, "") !== "null") {//Error
                    $scope.restoreBackupStatus = 3;
                } else {// Success
                    $scope.restoreBackupStatus = 2;
                }

                // file is uploaded successfully
                //console.log(data, status);
            }).error(function(data, status) {
                $scope.restoreBackupStatus = 3;
                //console.log(data, status);
            });

        }
    };

    /**
     * Close reset controller modal window
     *
     * @returns {void}
     */
    $scope.changeSelectNode = function(val) {
        if (val > 0) {
            $scope.refresh = false;
        } else {
            $scope.refresh = true;
        }

    };
    /**
     * Close reset controller modal window
     *
     * @returns {void}
     */
    $scope.closeResetController = function(modal) {
        $("#reset_confirm").attr('checked', false);
        $scope.goReset = false;
        $(modal).modal('hide');

    };
    /**
     * Close restore modal window
     *
     * @returns {void}
     */
    $scope.closeBackup = function(modal) {
        $('#btn_upload').show();
        $('.btn-spinner').hide();
        $("#restore_confirm").attr('checked', false);
        $("#restore_chip_info").attr('checked', false);
        $scope.goRestore = false;
        $scope.restoreBackupStatus = 0;
        $(modal).modal('hide');

        // $route.reload();
        //window.location.reload();

    };
    /**
     * Send request NIF from all devices
     *
     * @returns {void}
     */
    $scope.requestNifAll = function(btn) {
        angular.forEach($scope.devices, function(v, k) {
            var url = 'devices[' + v.id + '].RequestNodeInformation()';
            dataService.runCmd(url, false, $scope._t('error_handling_data'));
        });
        return;
    };

    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(ZWaveAPIData, refresh) {
        console.log(ZWaveAPIData.controller.data);
        $scope.showContent = true;
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        var isPrimary = ZWaveAPIData.controller.data.isPrimary.value;
        var isRealPrimary = ZWaveAPIData.controller.data.isRealPrimary.value;
        var isSIS = ZWaveAPIData.controller.data.SISPresent.value;
        var hasSUC = ZWaveAPIData.controller.data.SUCNodeId.value;
        var hasDevices = Object.keys(ZWaveAPIData.devices).length;
        $scope.controllerState = ZWaveAPIData.controller.data.controllerState.value;
        $scope.secureInclusion = ZWaveAPIData.controller.data.secureInclusion.value;
        $scope.startLearnMode = !isRealPrimary || hasDevices < 2 ? true : false;
        $scope.isPrimary = isPrimary;
        $scope.isSIS = isSIS;
        if (hasSUC && hasSUC != controllerNodeId) {
            $scope.disableSUCRequest = false;
        }

        console.log('Controller isPrimary: ' + isPrimary);
        console.log('Controller isSIS: ' + isSIS);
        console.log('and there are other devices: ' + hasDevices + ' - ' + (hasDevices > 1 ? 'true' : 'false'));
        console.log('Learn mode: ' + $scope.startLearnMode);
        /**
         * Loop throught devices
         */
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }
            $scope.devices.push({"id": nodeId, "name": $filter('deviceName')(nodeId, node)});
            if (node.data.basicType.value == 2) {
                $scope.sucNodes.push({"id": nodeId, "name": $filter('deviceName')(nodeId, node)});
            }
        });
        /**
         * Loop throught failed nodes
         */
        if (refresh) {
            if (ZWaveAPIData.controller.data.isPrimary.value) {
                angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
                    if (node.data.isFailed.value) {
                        $scope.failedNodes.push({"id": nodeId, "name": $filter('deviceName')(nodeId, node)});
                        $scope.replaceNodes.push({"id": nodeId, "name": $filter('deviceName')(nodeId, node)});
                    }
                    //if (dev.data.isFailed.value || (!dev.data.isListening.value && !dev.data.isFailed.value)) {
                    if (!node.data.isListening.value && !node.data.isFailed.value) {
                        $scope.failedBatteries.push({"id": nodeId, "name": $filter('deviceName')(nodeId, node)});
                    }
                });
            }
            ;
        }

    }


    /**
     * Refresh data
     */
    function refresh(data) {
        if ('controller.data.controllerState' in data) {
            $scope.controllerState = data['controller.data.controllerState'].value;
        }
        console.log('Controller state: ' + $scope.controllerState);

        // console.log('Learn mode 2: ' + $scope.learnMode);
        if ('controller.data.lastExcludedDevice' in data) {
            $scope.lastExcludedDevice = data['controller.data.lastExcludedDevice'].value;
        }

        if ('controller.data.lastIncludedDevice' in data) {
            $scope.lastIncludedDevice = data['controller.data.lastIncludedDevice'].value;
        }
        if ('controller.data.secureInclusion' in data) {
            $scope.secureInclusion = data['controller.data.secureInclusion'].value;
        }
        if ('controller.data.lastIncludedDevice' in data) {
            var deviceIncId = data['controller.data.lastIncludedDevice'].value;

            if (deviceIncId != null) {

                var givenName = 'Device_' + deviceIncId;
                var node = data.devices[deviceIncId];
                // Device type
                var deviceXml = $scope.deviceClasses;
                if (angular.isDefined(data.devices[deviceIncId])) {
                    var genericType = node.data.genericType.value;
                    var specificType = node.data.specificType.value;
                    angular.forEach(deviceXml, function(v, k) {
                        if (genericType == v.id) {
                            var deviceType = v.generic;
                            angular.forEach(v.specific, function(s, sk) {
                                if (specificType == s._id) {
                                    if (angular.isDefined(s.name.lang[v.langId].__text)) {
                                        deviceType = s.name.lang[v.langId].__text;
                                    }
                                }
                            });
                            givenName = deviceType + '_' + deviceIncId;
                            return;
                        }
                    });
                }
                var updateTime = $filter('isTodayFromUnix')(data['controller.data.lastIncludedDevice'].updateTime);
                //Run CMD
                var cmd = 'devices[' + deviceIncId + '].data.givenName.value=\'' + givenName + '\'';
                dataService.runCmd(cmd, false, $scope._t('error_handling_data'));
                $scope.lastIncludedDevice = $scope._t('nm_last_included_device') + '  (' + updateTime + ')  <a href="#config/configuration/' + deviceIncId + '"><strong>' + givenName + '</strong></a>';
            }


        }
        if ('controller.data.lastExcludedDevice' in data) {
            var deviceExcId = data['controller.data.lastExcludedDevice'].value;
            if (deviceExcId != null) {
                var updateTime = $filter('isTodayFromUnix')(data['controller.data.lastExcludedDevice'].updateTime);
                //var txt = $scope._t('nm_last_excluded_device') + ' ' + (deviceExcId != 0 ? deviceExcId : $scope._t('nm_last_excluded_device_from_foreign_network'));
                if (deviceExcId != 0) {
                    var txt = $scope._t('txt_device') + ' # ' + deviceExcId + ' ' + $scope._t('nm_excluded_from_network');
                } else {
                    var txt = $scope._t('nm_last_excluded_device_from_foreign_network');
                }
                $scope.lastExcludedDevice = txt + ' (' + updateTime + ')';
            }
        }
    }
    ;
});
// Routing controller
appController.controller('RoutingController', function($scope, $filter, dataService, cfg) {

    $scope.devices = [];
    $scope.nodes = {};
    $scope.data = {};
    $scope.ZWaveAPIData;
    $scope.updating = {};
    $scope.cellState = function(nodeId, nnodeId, routesCount, nodeName, nnodeName) {
        var node = $scope.nodes[nodeId].node;
        var nnode = $scope.nodes[nnodeId].node;
        var tooltip = nodeId + ': ' + nodeName + ' - ' + nnodeId + ': ' + nnodeName + ' ';
        var info;
        if ($filter('associationExists')(node, nnodeId)) {
            info = '*';
            tooltip += ' (' + $scope._t('rt_associated') + ')';
        } else {
            info = '';
        }
        var clazz = 'rtDiv line' + nodeId + ' ';
        if (nodeId == nnodeId
                || node.data.isVirtual.value
                || nnode.data.isVirtual.value
                || node.data.basicType.value == 1
                || nnode.data.basicType.value == 1) {
            clazz = 'rtDiv rtUnavailable';
        } else if ($.inArray(parseInt(nnodeId, 10), node.data.neighbours.value) != -1)
            clazz += 'rtDirect';
        else if (routesCount[nnodeId]
                && routesCount[nnodeId][1] > 1)
            clazz += 'rtRouted';
        else if (routesCount[nnodeId]
                && routesCount[nnodeId][1] == 1)
            clazz += 'rtBadlyRouted';
        else
            clazz += 'rtNotLinked';
        return {
            info: info,
            clazz: clazz,
            tooltip: tooltip
        };
    };
    $scope.processUpdateNodesNeighbours = function(current) {
        var done = function() {
            var spinner = $('#RoutingTable .fa-spinner');
            $('div.rtDiv').css({"border-color": ""});
            $scope.updating[current.nodeId] = false;
            spinner.fadeOut();
        };

        var spinner = $('#RoutingTable .fa-spinner');
        spinner.show();
        // process-states
        if (!("timeout" in current)) {
            current.timeout = (new Date()).getTime() + cfg.route_update_timeout;
        }
        $('div.line' + current.nodeId).css({"border-color": "blue"});
        dataService.store('devices[' + current.nodeId + '].RequestNodeNeighbourUpdate()', function(response) {
            var pollForNodeNeighbourUpdate = function() {
                dataService.updateZwaveDataSince(current.since, function(updateZWaveAPIData) {
                    if ("devices." + current.nodeId + ".data.neighbours" in updateZWaveAPIData) {
                        var obj = updateZWaveAPIData["devices." + current.nodeId + ".data.neighbours"]
                        $('#update' + current.nodeId).attr('class', $filter('getUpdated')(obj));
                        $('#update' + current.nodeId).html($filter('isTodayFromUnix')(obj.updateTime));
                        if (current.since < obj.updateTime && obj.invalidateTime < obj.updateTime) {
                            $scope.ZWaveAPIData.devices[current.nodeId].data.neighbours = obj;
                            $scope.nodes[current.nodeId].node = $scope.ZWaveAPIData.devices[current.nodeId];
                            $scope.updateData(current.nodeId);
                            done();
                            return;
                        }
                    }
                    if (current.timeout < (new Date()).getTime()) {
                        // timeout waiting for an update-route occured, proceed
                        done();
                        return;
                    }
                    // routes not yet updated, poll again
                    window.setTimeout(pollForNodeNeighbourUpdate, cfg.interval);
                });
            };
            // first polling
            pollForNodeNeighbourUpdate();
        });
    };
    // update a route
    $scope.update = function(nodeId) {
        dataService.purgeCache();
        // retry once
        if ($filter('updateable')($scope.nodes[nodeId].node, nodeId)) {
            var hasBattery = 0x80 in $scope.nodes[nodeId].node.instances[0].commandClasses;
            var current = {"nodeId": nodeId, "retry": 0, "type": (hasBattery ? "battery" : "mains"), "since": $scope.ZWaveAPIData.updateTime};
            // avoid overall routing-table updates during update
            $scope.updating[nodeId] = true;
            $scope.processUpdateNodesNeighbours(current, {});
        }
    };
    $scope.updateData = function(nodeId, nodeName) {
        var node = $scope.ZWaveAPIData.devices[nodeId];
        if (nodeId == 255 || node.data.isVirtual.value || node.data.basicType.value == 1)
            return;
        var routesCount = $filter('getRoutesCount')($scope.ZWaveAPIData, nodeId);
        var line = [];
        var nnodeName;
        angular.forEach($scope.ZWaveAPIData.devices, function(nnode, nnodeId) {
            if (nnodeId == 255 || nnode.data.isVirtual.value || nnode.data.basicType.value == 1) {
                return;
            }
            nnodeName = $filter('deviceName')(nnodeId, nnode);
            //console.log(nodeId + ' ' + nodeName + ' - ' + nnodeId + ' ' + nnodeName)    
            line[nnodeId] = $scope.cellState(nodeId, nnodeId, routesCount, nodeName, nnodeName);
        });
        $scope.data[nodeId] = line;
    };
    // Load data
    $scope.load = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            // Prepare devices and nodes
            angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
                if (nodeId == 255 || node.data.isVirtual.value || node.data.basicType.value == 1)
                    return;
                $scope.devices.push(nodeId);
                $scope.nodes[nodeId] = {"label": $filter('deviceName')(nodeId, node), "node": node};
            });
            // Loop throught devices and gather routesCount and cellState
            angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
                $scope.updateData(nodeId, $filter('deviceName')(nodeId, node));
            });
        });
    };
    $scope.load();
});
// Reorganization controller
appController.controller('ReorganizationController', function($scope, $log, $filter, $route, $interval, $timeout, dataService, cfg) {

    $scope.mainsPowered = true;
    $scope.batteryPowered = false;
    $scope.devices = [];
    $scope.nodes = {};
    $scope.ZWaveAPIData;
    $scope.processQueue = [];
    $scope.reorganizing = true;
    $scope.log = [];
    $scope.logged = "";
    $scope.appendLog = function(str, line) {
        if (line !== undefined) {
            $scope.log[line] += str;
        } else {
            $scope.log.push($filter('getTime')(new Date().getTime() / 1000) + ": " + str);
        }
        dataService.putReorgLog($scope.log.join("\n"));
        return $scope.log.length - 1;
    };
    $scope.downloadLog = function() {
        var hiddenElement = $('<a id="hiddenElement" href="' + cfg.server_url + cfg.reorg_log_url + '?at=' + (new Date()).getTime() + '" target="_blank" download="reorg.log"></a>').appendTo($('body'));
        hiddenElement.get(0).click();
        hiddenElement.detach();
    };
    var refreshLog = function() {
        // Assign to scope within callback to avoid data flickering on screen
        dataService.getReorgLog(function(log) {
            $scope.logged = log;
            // scroll to bottom
            var textarea = $("#reorg_log").get(0);
            textarea.scrollTop = textarea.scrollHeight;
        });
    };
    var promise = $interval(refreshLog, 1000);
    // Cancel interval on page changes
    $scope.$on('$destroy', function() {
        if (angular.isDefined(promise)) {
            $interval.cancel(promise);
            promise = undefined;
        }
    });
    $scope.reorgNodesNeighbours = function(current, result, doNext) {
        if (("complete" in current) && current.complete) {
            doNext();
            return;
        }
        dataService.store('devices[' + current.nodeId + '].RequestNodeNeighbourUpdate()', function(response) {
            var pollForNodeNeighbourUpdate = function(current) {
                dataService.updateZwaveDataSince(current.since, function(updateZWaveAPIData) {
                    $scope.appendLog(".", current.line);
                    try {
                        if ("devices." + current.nodeId + ".data.neighbours" in updateZWaveAPIData) {
                            var obj = updateZWaveAPIData["devices." + current.nodeId + ".data.neighbours"]
                            if (current.since < obj.updateTime && obj.invalidateTime < obj.updateTime) {
                                $scope.ZWaveAPIData.devices[current.nodeId].data.neighbours = obj;
                                $scope.nodes[current.nodeId].node = $scope.ZWaveAPIData.devices[current.nodeId];
                                // routes updated
                                var routesCount = $filter('getRoutesCount')($scope.ZWaveAPIData, current.nodeId);
                                $.each($scope.ZWaveAPIData.devices, function(nnodeId, nnode) {
                                    if (!routesCount[nnodeId]) {
                                        return;
                                    }
                                });
                                $scope.appendLog(" " + $scope._t('reorg_done'), current.line);
                                if (current.type == "battery") {
                                    if ("battery_completed" in result) {
                                        result.battery_completed++;
                                    } else {
                                        result.battery_completed = 1;
                                    }
                                } else {
                                    if ("mains_completed" in result) {
                                        result.mains_completed++;
                                    } else {
                                        result.mains_completed = 1;
                                    }
                                }
                                // mark all retries in processQueue as complete
                                for (var i = 0; i < $scope.processQueue.length; i++) {
                                    if ($scope.processQueue[i].nodeId == current.nodeId) {
                                        $scope.processQueue[i].complete = true;
                                    }
                                }
                                current.complete = true;
                                doNext();
                                return;
                            }
                        }
                    } catch (exception) {
                        $scope.appendLog(" " + e.message, current.line);
                    }
                    if (current.timeout < (new Date()).getTime()) {
                        // timeout waiting for an update-route occured, proceed
                        $scope.appendLog(" " + $scope._t('reorg_timeout'), current.line);
                        if (current.retry == 3) {
                            if (current.type == "battery") {
                                if ("battery_pending" in result) {
                                    result.battery_pending++;
                                } else {
                                    result.battery_pending = 1;
                                }
                            } else {
                                if ("mains_pending" in result) {
                                    result.mains_pending++;
                                } else {
                                    result.mains_pending = 1;
                                }
                            }
                        }
                        current.complete = true;
                        doNext();
                        return;
                    }
                    // routes not yet updated, poll again
                    window.setTimeout(pollForNodeNeighbourUpdate, cfg.interval, current);
                }, function(error) {
                    // error handler
                    $scope.appendLog(error, current.line);
                    if (current.retry == 3) {
                        if (current.type == "battery") {
                            if ("battery_pending" in result) {
                                result.battery_pending++;
                            } else {
                                result.battery_pending = 1;
                            }
                        } else {
                            if ("mains_pending" in result) {
                                result.mains_pending++;
                            } else {
                                result.mains_pending = 1;
                            }
                        }
                    }
                    current.complete = true;
                    doNext();
                });
            };
            // first polling
            pollForNodeNeighbourUpdate(current);
        }, function(error) {
            // error handler
            $scope.appendLog(error, current.line);
            if (current.type == "battery") {
                if ("battery_pending" in result) {
                    result.battery_pending++;
                } else {
                    result.battery_pending = 1;
                }
            } else {
                if ("mains_pending" in result) {
                    result.mains_pending++;
                } else {
                    result.mains_pending = 1;
                }
            }
            current.complete = true;
            doNext();
        });
    };
    $scope.processReorgNodesNeighbours = function(result, pos) {
        if ($scope.processQueue.length <= pos) {
            if ($scope.reorganizing) {
                $scope.appendLog($scope._t('reorg_completed') + ":");
                if ("mains_completed" in result)
                    $scope.appendLog(result.mains_completed + " " + $scope._t('reorg_mains_powered_done'));
                if ("battery_completed" in result)
                    $scope.appendLog(result.battery_completed + " " + $scope._t('reorg_battery_powered_done'));
                if ("mains_pending" in result)
                    $scope.appendLog(result.mains_pending + " " + $scope._t('reorg_mains_powered_pending'));
                if ("battery_pending" in result)
                    $scope.appendLog(result.battery_pending + " " + $scope._t('reorg_battery_powered_pending'));
                if ($.isEmptyObject(result))
                    $scope.appendLog($scope._t('reorg_nothing'));
                $scope.reorganizing = false;
            }
            return;
        }
        var current = $scope.processQueue[pos];
        if (!("complete" in current) || !current.complete) {
            if (!("line" in current)) {
                current.posInQueue = pos;
                current.line = $scope.appendLog($scope._t('reorg_reorg') + " " + current.nodeId + " " + (current.retry > 0 ? current.retry + ". " + $scope._t('reorg_retry') : "") + " ");
            }
            // process-states
            if (!("timeout" in current)) {
                current.timeout = (new Date()).getTime() + cfg.route_update_timeout;
            }
        }
        if (current.fork) {
            // batteries are processed in parallel, forking
            $scope.reorgNodesNeighbours(current, result, function() {
            });
            pos++;
            $scope.processReorgNodesNeighbours(result, pos);
        } else {
            // main powereds are processed sequential
            $scope.reorgNodesNeighbours(current, result, function() {
                pos++;
                $scope.processReorgNodesNeighbours(result, pos);
            });
        }
    };
    // reorgAll routes
    $scope.reorgAll = function() {
        $scope.reorganizing = true;
        $scope.log = [];
        $scope.appendLog($scope._t('reorg_started'));
        // retry each element up to 4 times
        $scope.processQueue = [];
        var logInfo = "";
        if ($scope.mainsPowered) {
            for (var retry = 0; retry < 4; retry++) {
                // first RequestNodeNeighbourUpdate for non-battery devices
                $.each($scope.devices, function(index, nodeId) {
                    if ($filter('updateable')($scope.nodes[nodeId].node, nodeId, false)) {
                        $scope.processQueue.push({"nodeId": nodeId, "retry": retry, "type": "mains", "since": $scope.ZWaveAPIData.updateTime, "fork": false});
                        if (retry == 0) {
                            if (logInfo != "") {
                                logInfo += ", ";
                            }
                            logInfo += nodeId;
                        }
                    }
                });
                if (retry == 0) {
                    $scope.appendLog($scope._t('reorg_all_mains') + ": " + logInfo);
                    logInfo = "";
                }
            }
        }
        if ($scope.batteryPowered) {
            for (var retry = 0; retry < 4; retry++) {
                // second RequestNodeNeighbourUpdate for battery devices
                $.each($scope.devices, function(index, nodeId) {
                    if ($filter('updateable')($scope.nodes[nodeId].node, nodeId, true)) {
                        $scope.processQueue.push({"nodeId": nodeId, "retry": retry, "type": "battery", "since": $scope.ZWaveAPIData.updateTime, "fork": true});
                        if (retry == 0) {
                            if (logInfo != "") {
                                logInfo += ", ";
                            }
                            logInfo += nodeId;
                        }
                    }
                });
                // use last in retry-group as sequential-blocker
                $scope.processQueue[$scope.processQueue.length - 1].fork = false;
                if (retry == 0) {
                    $scope.appendLog($scope._t('reorg_all_battery') + ": " + logInfo);
                }
            }
        }
        $scope.processReorgNodesNeighbours({}, 0);
    };
    // Load data
    $scope.load = function(lang) {
        dataService.getZwaveData(function(ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
            // Prepare devices and nodes
            angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
                if (nodeId == 255 || node.data.isVirtual.value || node.data.basicType.value == 1)
                    return;
                $scope.devices.push(nodeId);
                $scope.nodes[nodeId] = {"label": $filter('deviceName')(nodeId, node), "node": node};
            });
            $scope.reorganizing = false;
        });
    };
    $scope.load($scope.lang);
});
// Statistics controller
appController.controller('TimingController', function($scope, $filter, dataService) {
    $scope.devices = [];
    $scope.timing = [];
    $scope.reset = function() {
        $scope.devices = angular.copy([]);
        //$scope.timing = angular.copy([]);
    };



    // Load data
//    $scope.load = function() {
//        dataService.getZwaveData(function(ZWaveAPIData) {
//            console.log($scope.timing);
//            setData(ZWaveAPIData);
//            dataService.joinedZwaveData(function(data) {
//                $scope.reset();
//                //$scope.loadTiming();
//                setData(data.joined);
//            });
//        });
//    };

    //$scope.load();

    // Load timing data
    $scope.loadTiming = function() {
        dataService.getTiming(function(data) {
            dataService.getZwaveData(function(ZWaveAPIData) {
                setData(data, ZWaveAPIData);
//            dataService.joinedZwaveData(function(data) {
//                $scope.reset();
//                //$scope.loadTiming();
//                setData(data,data.joined);
//            });
            });
            $scope.timing = data;
        });
    };
    $scope.loadTiming();
    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelZwaveDataInterval();
    });

    // Reset statistics
    $scope.resetTiming = function(cmd) {
        console.log(cmd);
        //dataService.runCmd(cmd);
    };


    /// --- Private functions --- ///

    /**
     * Set zwave data
     */
    function setData(data, ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        // Loop throught devices
        angular.forEach(ZWaveAPIData.devices, function(node, nodeId) {
            if (nodeId == 255 || nodeId == controllerNodeId || node.data.isVirtual.value) {
                return;
            }
            var node = ZWaveAPIData.devices[nodeId];
            var type;
            var isListening = node.data.isListening.value;
            var isFLiRS = !isListening && (node.data.sensor250.value || node.data.sensor1000.value);
            var hasBattery = 0x80 in node.instances[0].commandClasses;
            var hasWakeup = 0x84 in node.instances[0].commandClasses;
            var totalPackets = 0;
            var okPackets = 0;
            var lastPackets = '';
            var basicType = node.data.basicType.value;
            var genericType = node.data.genericType.value;
            var specificType = node.data.specificType.value;

            // Device type
            if (isListening) {
                type = 'type_mains';
            } else if (!isListening && hasWakeup) {
                type = 'type_battery_wakup';
            } else if (!isListening && isFLiRS) {
                type = 'type_flirs';
            } else {
                type = 'type_remote';

            }

            // Packets
            var timingItems = data[nodeId];

            if (angular.isDefined(timingItems)) {
                totalPackets = timingItems.length;
                okPackets = getOkPackets(timingItems);
                lastPackets = getLastPackets(timingItems);
            }

            // Set object
            var obj = {};
            obj['id'] = nodeId;
            obj['rowId'] = 'row_' + nodeId;
            obj['name'] = $filter('deviceName')(nodeId, node);
            obj['type'] = type;
            obj['totalPackets'] = totalPackets;
            obj['okPackets'] = okPackets;
            obj['lastPackets'] = lastPackets;
            obj['basicType'] = basicType;
            obj['genericType'] = genericType;
            obj['specificType'] = specificType;
            $scope.devices.push(obj);
        });
    }

    /**
     * Get percentage of delivered packets
     */
    function getOkPackets(data) {
        var isDelivered = 0;
        var notDelivered = 0;
        angular.forEach(data, function(v, k) {
            if (v.delivered == true) {
                isDelivered++;
            } else {
                notDelivered++;
            }

        });
        var calcPercent = isDelivered / data.length * 100;
        var percent = 0;
        if (!isNaN(calcPercent)) {
            percent = calcPercent.toFixed(0);
        }
        return percent;

    }

    /**
     * Get list of last packets
     */
    function getLastPackets(data) {
        var packets = '&nbsp;';
        var deliveryTime = 0;
        var color;
        angular.forEach(data.slice(-20), function(v, k) {
            deliveryTime = parseInt(v.deliveryTime);
            if (!v.delivered) {
                color = 'red';
            } else {
                color = (deliveryTime > 100 ? 'black' : 'green');
            }
            var displayTime = deliveryTime / 10;
            packets += '<span class="' + color + ' timing-packet">' + displayTime.toFixed() + '</span> ';
        });
        return packets;

    }
});
// Controller controller
appController.controller('ControllerController', function($scope, $window, dataService) {
    $scope.funcList;
    $scope.ZWaveAPIData;
    $scope.info = {};
    $scope.runQueue = false;
    /**
     * Load data
     *
     */
    $scope.load = function() {
        dataService.getZwaveData(function(ZWaveAPIData) {
            $scope.ZWaveAPIData = ZWaveAPIData;
//        if (path == 'controller.data.nonManagmentJobs')
//		return; // we don't want to redraw this page on each (de)queued packet

            var homeId = ZWaveAPIData.controller.data.homeId.value;
            var nodeId = ZWaveAPIData.controller.data.nodeId.value;
            var canAdd = ZWaveAPIData.controller.data.isPrimary.value;
            var isRealPrimary = ZWaveAPIData.controller.data.isRealPrimary.value;
            var haveSIS = ZWaveAPIData.controller.data.SISPresent.value;
            //var isSUC = ZWaveAPIData.controller.data.isSUC.value;
            var SUCNodeID = ZWaveAPIData.controller.data.SUCNodeId.value;
            var vendor = ZWaveAPIData.controller.data.vendor.value;
            var ZWChip = ZWaveAPIData.controller.data.ZWaveChip.value;
            var productId = ZWaveAPIData.controller.data.manufacturerProductId.value;
            var productType = ZWaveAPIData.controller.data.manufacturerProductType.value;
            var sdk = ZWaveAPIData.controller.data.SDK.value;
            var libType = ZWaveAPIData.controller.data.libType.value;
            var api = ZWaveAPIData.controller.data.APIVersion.value;
            var revId = ZWaveAPIData.controller.data.softwareRevisionId.value;
            var revVer = ZWaveAPIData.controller.data.softwareRevisionVersion.value;
            var revDate = ZWaveAPIData.controller.data.softwareRevisionDate.value;
            var obj = {};
            $scope.info['ctrl_info_nodeid_value'] = nodeId;
            $scope.info['ctrl_info_homeid_value'] = '0x' + ('00000000' + (homeId + (homeId < 0 ? 0x100000000 : 0)).toString(16)).slice(-8);
            $scope.info['ctrl_info_primary_value'] = canAdd ? 'yes' : 'no';
            $scope.info['ctrl_info_real_primary_value'] = isRealPrimary ? 'yes' : 'no';
            $scope.info['ctrl_info_suc_sis_value'] = (SUCNodeID != 0) ? (SUCNodeID.toString() + ' (' + (haveSIS ? 'SIS' : 'SUC') + ')') : $scope._t('nm_suc_not_present');
            $scope.info['ctrl_info_hw_vendor_value'] = vendor;
            $scope.info['ctrl_info_hw_product_value'] = productType.toString() + " / " + productId.toString();
            $scope.info['ctrl_info_hw_chip_value'] = ZWChip;
            $scope.info['ctrl_info_sw_lib_value'] = libType;
            $scope.info['ctrl_info_sw_sdk_value'] = sdk;
            $scope.info['ctrl_info_sw_api_value'] = api;
            $scope.info['ctrl_info_sw_rev_ver_value'] = revVer;
            $scope.info['ctrl_info_sw_rev_id_value'] = revId;
            $scope.info['ctrl_info_sw_rev_date_value'] = revDate;
            /**
             * Function list
             */
            var funcList = '';
            var _fc = array_unique(ZWaveAPIData.controller.data.capabilities.value.concat(ZWaveAPIData.controller.data.functionClasses.value));
            _fc.sort(function(a, b) {
                return a - b
            });
            angular.forEach(_fc, function(func, index) {
                var fcIndex = ZWaveAPIData.controller.data.functionClasses.value.indexOf(func);
                var capIndex = ZWaveAPIData.controller.data.capabilities.value.indexOf(func);
                var fcName = (fcIndex != -1) ? ZWaveAPIData.controller.data.functionClassesNames.value[fcIndex] : 'Not implemented';
                funcList += '<span style="color: ' + ((capIndex != -1) ? ((fcIndex != -1) ? '' : 'gray') : 'red') + '">' + fcName + ' (0x' + ('00' + func.toString(16)).slice(-2) + ')</span>, ';
            });
            $scope.funcList = funcList;

        });
    };
    $scope.load();

    // Cancel interval on page destroy
    $scope.$on('$destroy', function() {
        dataService.cancelQueueDataInterval();
    });
    /**
     *
     * Run cmd
     */
    $scope.runCmd = function(cmd) {
        dataService.runCmd(cmd, false, $scope._t('error_handling_data'));
    };
    /**
     * Inspect Queue
     */
    $scope.inspectQueue = function(target, cancel) {
        $(target).modal();
        if (cancel) {
            dataService.cancelQueueDataInterval();
            return;
        }
        // Load queue
        dataService.getQueueData(function(data) {
            getQueueUpdate(data);
        });
        // Refresh queue
        dataService.updateQueueData(function(data) {
            getQueueUpdate(data);
        });
        return;


    };

    $scope.openQueue = function() {
        $window.open('#network/queue', 'MyWindow', "width=1200, height=400");
    };

    /// --- Private functions --- ///


    // Get Queue updates
    function getQueueUpdate(data) {
        var trs = '';
        angular.forEach(data, function(job, jobIndex) {
            var buff = '';
            for (var b in job[5]) {
                buff += job[5][b].toString(16) + ' ';
            }
            ;
            var progress;
            if (job[4] === null) {
                progress = '';
            } else if (typeof (job[4]) == 'string') {
                progress = job[4].replace(/\n/g, '<br/>')
            } else {
                job[4].join('<br />');
            }

            trs +=
                    '<tr>' +
                    '<td>' + job[1][0] + '</td>' +
                    '<td>' + (job[1][11] ? "U" : " ") + '</td>' +
                    '<td>' + (job[1][1] ? "W" : " ") + '</td>' +
                    '<td>' + (job[1][2] ? "S" : " ") + '</td>' +
                    '<td>' + (job[1][3] ? "E" : " ") + '</td>' +
                    '<td>' + (job[1][4] ? "D" : " ") + '</td>' +
                    '<td>' + (job[1][5] ? (job[1][6] ? "+" : "-") : " ") + '</td>' +
                    '<td>' + (job[1][7] ? (job[1][8] ? "+" : "-") : " ") + '</td>' +
                    '<td>' + (job[1][9] ? (job[1][10] ? "+" : "-") : " ") + '</td>' +
                    '<td>' + parseFloat(job[0]).toFixed(2) + '</td>' +
                    '<td>' + job[2] + '</td>' +
                    '<td class="alignleft">' + job[3] + '</td>' +
                    '<td class="alignleft">' + progress + '</td>' +
                    '<td class="alignleft">' + buff + '</td>' +
                    '</tr>\n';
        });
        if (trs == '') {
            trs = '<tr><td colspan="12"><i>' + $scope._t('inspect_queue_empty') + '</i></td></tr>';
        }
        $('#inspect_queue_len').html('Queue length: ' + data.length);
        $('#inspect_queue_table_body').html(trs);
        return trs;
    }
    ;
});
// Commands controller
appController.controller('QueueController', function($scope, dataService) {
    /**
     * Inspect Queue
     */
    $scope.inspectQueue = function() {
        // Load queue
        dataService.getQueueData(function(data) {
            getQueueUpdate(data);
        });
        // Refresh queue
        dataService.updateQueueData(function(data) {
            getQueueUpdate(data);
        });
        return;
    };

    $scope.inspectQueue();

    /// --- Private functions --- ///


    // Get Queue updates
    function getQueueUpdate(data) {
        var trs = '';
        angular.forEach(data, function(job, jobIndex) {
            var buff = '';
            for (var b in job[5]) {
                buff += job[5][b].toString(16) + ' ';
            }
            ;
            var progress;
            if (job[4] === null) {
                progress = '';
            } else if (typeof (job[4]) == 'string') {
                progress = job[4].replace(/\n/g, '<br/>')
            } else {
                job[4].join('<br />');
            }

            trs +=
                    '<tr>' +
                    '<td>' + job[1][0] + '</td>' +
                    '<td>' + (job[1][11] ? "U" : " ") + '</td>' +
                    '<td>' + (job[1][1] ? "W" : " ") + '</td>' +
                    '<td>' + (job[1][2] ? "S" : " ") + '</td>' +
                    '<td>' + (job[1][3] ? "E" : " ") + '</td>' +
                    '<td>' + (job[1][4] ? "D" : " ") + '</td>' +
                    '<td>' + (job[1][5] ? (job[1][6] ? "+" : "-") : " ") + '</td>' +
                    '<td>' + (job[1][7] ? (job[1][8] ? "+" : "-") : " ") + '</td>' +
                    '<td>' + (job[1][9] ? (job[1][10] ? "+" : "-") : " ") + '</td>' +
                    '<td>' + parseFloat(job[0]).toFixed(2) + '</td>' +
                    '<td>' + job[2] + '</td>' +
                    '<td class="alignleft">' + job[3] + '</td>' +
                    '<td class="alignleft">' + progress + '</td>' +
                    '<td class="alignleft">' + buff + '</td>' +
                    '</tr>\n';
        });
        if (trs == '') {
            trs = '<tr><td colspan="12"><i>' + $scope._t('inspect_queue_empty') + '</i></td></tr>';
        }
        $('#inspect_queue_len').html($scope._t('txt_queue_length') + ': ' + data.length);
        $('#inspect_queue_table_body').html(trs);
        return trs;
    }
    ;
});
// Command class modal window controller
appController.controller('CommandModalController', function($scope, $filter) {
    // Show modal dialog
    $scope.showModal = function(target, data) {
        // Modal example http://plnkr.co/edit/D29YjKGbY63OSa1EeixT?p=preview
        $(target).modal();
        // Formated output
        var getCmdData = function(data, name, space) {
            if (name == undefined) {
                return '';
            }
            var html = '<div class="cc-data-element">' + space + name + ': <span class="' + ((data.updateTime > data.invalidateTime) ? 'green' : 'red') + '">' + ((typeof (data.value) !== 'undefined' && data.value != null) ? data.value.toString() : 'None') + '</span>' + ' (<span class="' + ((data.updateTime > data.invalidateTime) ? '' : 'red') + '">' + $filter('isTodayFromUnix')(data.updateTime) + '</span>)</div>';
            angular.forEach(data, function(el, key) {

                if (key != 'type' && key != 'updateTime' && key != 'invalidateTime' && key != 'value' && // these are internal values
                        key != 'capabilitiesNames') { // these make the dialog monstrious
                    html += getCmdData(el, key, space + '&nbsp;&nbsp;&nbsp;&nbsp;');
                }
            });
            return html;
        };
        // Get data
        var html = getCmdData(data, '/', '');

        // Fill modal with data
        $(target).on('shown.bs.modal', function() {
            $(target + ' .modal-body').html(html);
        });
    };
});


/**
 * Common app functions
 * author Martin Vach
 */

///////////////////////////////// Works /////////////////////////////////
$(function() {
     /*** Expert commands **/
    // Set/Remove disabled on next text input
    $(document).on('click', '.form_commands .commands-data-chbx,#form_config .commands-data-chbx', function() {
       $(this).parent('.form-group').find('.commands-data-txt-chbx').attr('disabled',true);
        $(this).siblings('.commands-data-txt-chbx').attr('disabled',false);
    });
    
     /*** Spinner **/
    $(document).on('click', '.spin-true', function() {
       $(this).find('.fa-spin').show();
    });
    /*** Lock **/
    // Change status for lock buttons
    $(document).on('click', '.lock-controll .btn', function() {
        var parent = $(this).closest('tr').attr('id');
        $('#' + parent + ' .btn').removeClass('active');
        $(this).addClass('active');
    });
});
/*
 *  Angular RangeSlider Directive
 * 
 *  Version: 0.0.7
 *
 *  Author: Daniel Crisp, danielcrisp.com
 *
 *  The rangeSlider has been styled to match the default styling
 *  of form elements styled using Twitter's Bootstrap
 * 
 *  Originally forked from https://github.com/leongersen/noUiSlider
 *

    This code is released under the MIT Licence - http://opensource.org/licenses/MIT

    Copyright (c) 2013 Daniel Crisp

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.

*/

(function () {
    'use strict';

    /**
     * RangeSlider, allows user to define a range of values using a slider
     * Touch friendly.
     * @directive
     */
   angApp.directive('rangeSlider', ["$document", "$filter", "$log", function($document, $filter, $log) {

        // test for mouse, pointer or touch
        var EVENT = window.PointerEvent ? 1 : (window.MSPointerEvent ? 2 : ('ontouchend' in document ? 3 : 4)), // 1 = IE11, 2 = IE10, 3 = touch, 4 = mouse
            eventNamespace = '.rangeSlider',

            defaults = {
                disabled: false,
                orientation: 'horizontal',
                step: 0,
                decimalPlaces: 0,
                showValues: true,
                preventEqualMinMax: false
            },

            onEvent = (EVENT === 1 ? 'pointerdown' : (EVENT === 2 ? 'MSPointerDown' : (EVENT === 3 ? 'touchstart' : 'mousedown'))) + eventNamespace,
            moveEvent = (EVENT === 1 ? 'pointermove' : (EVENT === 2 ? 'MSPointerMove' : (EVENT === 3 ? 'touchmove' : 'mousemove'))) + eventNamespace,
            offEvent = (EVENT === 1 ? 'pointerup' : (EVENT === 2 ? 'MSPointerUp' : (EVENT === 3 ? 'touchend' : 'mouseup'))) + eventNamespace,

            // get standarised clientX and clientY
            client = function (f) {
                try {
                    return [(f.clientX || f.originalEvent.clientX || f.originalEvent.touches[0].clientX), (f.clientY || f.originalEvent.clientY || f.originalEvent.touches[0].clientY)];
                } catch (e) {
                    return ['x', 'y'];
                }
            },

            restrict = function (value) {

                // normalize so it can't move out of bounds
                return (value < 0 ? 0 : (value > 100 ? 100 : value));

            },

            isNumber = function (n) {
               // console.log(n);
                return !isNaN(parseFloat(n)) && isFinite(n);
            };

        if (EVENT < 4) {
            // some sort of touch has been detected
            angular.element('html').addClass('ngrs-touch');
        } else {
            angular.element('html').addClass('ngrs-no-touch');
        }


        return {
            restrict: 'A',
            replace: true,
            template: ['<div class="ngrs-range-slider">',
                         '<div class="ngrs-runner">',
                           '<div class="ngrs-handle ngrs-handle-min"><i></i></div>',
                           '<div class="ngrs-handle ngrs-handle-max"><i></i></div>',
                           '<div class="ngrs-join"></div>',
                         '</div>',
                         '<div class="ngrs-value ngrs-value-min" ng-show="showValues">{{min}}</div>',
                         '<div class="ngrs-value ngrs-value-max" ng-show="showValues">{{max}}</div>',
                       '</div>'].join(''),
            scope: {
                disabled: '=?',
                min: '=',
                max: '=',
                modelMin: '=?',
                modelMax: '=?',
                onHandleDown: '&', // calls optional function when handle is grabbed
                onHandleUp: '&', // calls optional function when handle is released 
                orientation: '@', // options: horizontal | vertical | vertical left | vertical right
                step: '@',
                decimalPlaces: '@',
                filter: '@',
                filterOptions: '@',
                showValues: '@',
                pinHandle: '@',
                preventEqualMinMax: '@'
            },
            link: function(scope, element, attrs, controller) {

                /** 
                 *  FIND ELEMENTS
                 */

                var $slider = angular.element(element),
                    handles = [element.find('.ngrs-handle-min'), element.find('.ngrs-handle-max')],
                    join = element.find('.ngrs-join'),
                    pos = 'left',
                    posOpp = 'right',
                    orientation = 0,
                    allowedRange = [0, 0],
                    range = 0;

                // filtered
                scope.filteredModelMin = scope.modelMin;
                scope.filteredModelMax = scope.modelMax;

                /**
                 *  FALL BACK TO DEFAULTS FOR SOME ATTRIBUTES
                 */

                attrs.$observe('disabled', function (val) {
                    if (!angular.isDefined(val)) {
                        scope.disabled = defaults.disabled;
                    }

                    scope.$watch('disabled', setDisabledStatus);
                });

                attrs.$observe('orientation', function (val) {
                    if (!angular.isDefined(val)) {
                        scope.orientation = defaults.orientation;
                    }

                    var classNames = scope.orientation.split(' '),
                        useClass;

                    for (var i = 0, l = classNames.length; i < l; i++) {
                        classNames[i] = 'ngrs-' + classNames[i];
                    }

                    useClass = classNames.join(' ');

                    // add class to element
                    $slider.addClass(useClass);

                    // update pos
                    if (scope.orientation === 'vertical' || scope.orientation === 'vertical left' || scope.orientation === 'vertical right') {
                        pos = 'top';
                        posOpp = 'bottom';
                        orientation = 1;
                    }
                });

                attrs.$observe('step', function (val) {
                    if (!angular.isDefined(val)) {
                        scope.step = defaults.step;
                    }
                });

                attrs.$observe('decimalPlaces', function (val) {
                    if (!angular.isDefined(val)) {
                        scope.decimalPlaces = defaults.decimalPlaces;
                    }
                });

                attrs.$observe('showValues', function (val) {
                    if (!angular.isDefined(val)) {
                        scope.showValues = defaults.showValues;
                    } else {
                        if (val === 'false') {
                            scope.showValues = false;
                        } else {
                            scope.showValues = true;
                        }
                    }
                });

                attrs.$observe('pinHandle', function (val) {
                    if (!angular.isDefined(val)) {
                        scope.pinHandle = null;
                    } else {
                        if (val === 'min' || val === 'max') {
                            scope.pinHandle = val;
                        } else {
                            scope.pinHandle = null;
                        }
                    }

                    scope.$watch('pinHandle', setPinHandle);
                });

                attrs.$observe('preventEqualMinMax', function (val) {
                    if (!angular.isDefined(val)) {
                        scope.preventEqualMinMax = defaults.preventEqualMinMax;
                    } else {
                        if (val === 'false') {
                            scope.preventEqualMinMax = false;
                        } else {
                            scope.preventEqualMinMax = true;
                        }
                    }
                });



                // listen for changes to values
                scope.$watch('min', setMinMax);
                scope.$watch('max', setMinMax);

                scope.$watch('modelMin', setModelMinMax);
                scope.$watch('modelMax', setModelMinMax);

                /**
                 * HANDLE CHANGES
                 */

                function setPinHandle (status) {
                    if (status === "min") {
                        angular.element(handles[0]).css('display', 'none');
                        angular.element(handles[1]).css('display', 'block');
                    } else if (status === "max") {
                        angular.element(handles[0]).css('display', 'block');
                        angular.element(handles[1]).css('display', 'none');
                    } else {
                        angular.element(handles[0]).css('display', 'block');
                        angular.element(handles[1]).css('display', 'block');
                    }
                }

                function setDisabledStatus (status) {
                    if (status) {
                        $slider.addClass('disabled');
                    } else {
                        $slider.removeClass('disabled');
                    }
                }

                function setMinMax () {

                    if (scope.min > scope.max) {
                        throwError('min must be less than or equal to max');
                    }

                    // only do stuff when both values are ready
                    if (angular.isDefined(scope.min) && angular.isDefined(scope.max)) {

                        // make sure they are numbers
                        if (!isNumber(scope.min)) {
                            throwError('min must be a number');
                        }

                        if (!isNumber(scope.max)) {
                            throwError('max must be a number');
                        }

                        range = scope.max - scope.min;
                        allowedRange = [scope.min, scope.max];

                        // update models too
                        setModelMinMax();

                    }
                }

                function setModelMinMax () {

                    if (scope.modelMin > scope.modelMax) {
                        throwWarning('modelMin must be less than or equal to modelMax');
                        // reset values to correct
                        scope.modelMin = scope.modelMax;
                    }

                    // only do stuff when both values are ready
                    if (
                        (angular.isDefined(scope.modelMin) || scope.pinHandle === 'min') &&
                        (angular.isDefined(scope.modelMax) || scope.pinHandle === 'max')
                    ) {

                        // make sure they are numbers
                        if (!isNumber(scope.modelMin)) {
                            if (scope.pinHandle !== 'min') {
                                throwWarning('modelMin must be a number');
                            }
                            scope.modelMin = scope.min;
                        }

                        if (!isNumber(scope.modelMax)) {
                            if (scope.pinHandle !== 'max') {
                                throwWarning('modelMax must be a number');
                            }
                            scope.modelMax = scope.max;
                        }

                        var handle1pos = restrict(((scope.modelMin - scope.min) / range) * 100),
                            handle2pos = restrict(((scope.modelMax - scope.min) / range) * 100);

                        // make sure the model values are within the allowed range
                        scope.modelMin = Math.max(scope.min, scope.modelMin);
                        scope.modelMax = Math.min(scope.max, scope.modelMax);

                        if (scope.filter) {
                            scope.filteredModelMin = $filter(scope.filter)(scope.modelMin, scope.filterOptions);
                            scope.filteredModelMax = $filter(scope.filter)(scope.modelMax, scope.filterOptions);
                        } else {
                            scope.filteredModelMin = scope.modelMin;
                            scope.filteredModelMax = scope.modelMax;
                        }

                        // check for no range
                        if (scope.min === scope.max && scope.modelMin == scope.modelMax) {

                            // reposition handles
                            angular.element(handles[0]).css(pos, '0%');
                            angular.element(handles[1]).css(pos, '100%');

                            // reposition join
                            angular.element(join).css(pos, '0%').css(posOpp, '0%');

                        } else {

                            // reposition handles
                            angular.element(handles[0]).css(pos, handle1pos + '%');
                            angular.element(handles[1]).css(pos, handle2pos + '%');

                            // reposition join
                            angular.element(join).css(pos, handle1pos + '%').css(posOpp, (100 - handle2pos) + '%');

                            // ensure min handle can't be hidden behind max handle
                            if (handle1pos >  95) {
                                angular.element(handles[0]).css('z-index', 3);
                            }
                        }

                    }

                }

                function handleMove(index) {

                    var $handle = handles[index];

                    // on mousedown / touchstart
                    $handle.bind(onEvent + 'X', function (event) {

                        var handleDownClass = (index === 0 ? 'ngrs-handle-min' : 'ngrs-handle-max') + '-down',
                            unbind = $handle.add($document).add('body'),
                            modelValue = (index === 0 ? scope.modelMin : scope.modelMax) - scope.min,
                            originalPosition = (modelValue / range) * 100,
                            originalClick = client(event),
                            previousClick = originalClick,
                            previousProposal = false;

                        if (angular.isFunction(scope.onHandleDown)) {
                            scope.onHandleDown();
                        }

                        // stop user accidentally selecting stuff
                        angular.element('body').bind('selectstart' + eventNamespace, function () {
                            return false;
                        });

                        // only do stuff if we are disabled
                        if (!scope.disabled) {

                            // add down class
                            $handle.addClass('ngrs-down');

                            $slider.addClass('ngrs-focus ' + handleDownClass);

                            // add touch class for MS styling
                            angular.element('body').addClass('ngrs-touching');

                            // listen for mousemove / touchmove document events
                            $document.bind(moveEvent, function (e) {
                                // prevent default
                                e.preventDefault();

                                var currentClick = client(e),
                                    movement,
                                    proposal,
                                    other,
                                    per = (scope.step / range) * 100,
                                    otherModelPosition = (((index === 0 ? scope.modelMax : scope.modelMin) - scope.min) / range) * 100;

                                if (currentClick[0] === "x") {
                                    return;
                                }

                                // calculate deltas
                                currentClick[0] -= originalClick[0];
                                currentClick[1] -= originalClick[1];

                                // has movement occurred on either axis?
                                movement = [
                                    (previousClick[0] !== currentClick[0]), (previousClick[1] !== currentClick[1])
                                ];

                                // propose a movement
                                proposal = originalPosition + ((currentClick[orientation] * 100) / (orientation ? $slider.height() : $slider.width()));

                                // normalize so it can't move out of bounds
                                proposal = restrict(proposal);

                                if (scope.preventEqualMinMax) {

                                    if (per === 0) {
                                        per = (1 / range) * 100; // restrict to 1
                                    }

                                    if (index === 0) {
                                        otherModelPosition = otherModelPosition - per;
                                    } else if (index === 1) {
                                        otherModelPosition = otherModelPosition + per;
                                    }
                                }

                                // check which handle is being moved and add / remove margin
                                if (index === 0) {
                                    proposal = proposal > otherModelPosition ? otherModelPosition : proposal;
                                } else if (index === 1) {
                                    proposal = proposal < otherModelPosition ? otherModelPosition : proposal;
                                }

                                if (scope.step > 0) {
                                    // only change if we are within the extremes, otherwise we get strange rounding
                                    if (proposal < 100 && proposal > 0) {
                                        proposal = Math.round(proposal / per) * per;
                                    }
                                }

                                if (proposal > 95 && index === 0) {
                                    $handle.css('z-index', 3);
                                } else {
                                    $handle.css('z-index', '');
                                }

                                if (movement[orientation] && proposal != previousProposal) {

                                    if (index === 0) {

                                        // update model as we slide
                                        scope.modelMin = parseFloat((((proposal * range) / 100) + scope.min)).toFixed(scope.decimalPlaces);

                                    } else if (index === 1) {

                                        scope.modelMax = parseFloat((((proposal * range) / 100) + scope.min)).toFixed(scope.decimalPlaces);
                                    }

                                    // update angular
                                    scope.$apply();

                                    previousProposal = proposal;

                                }

                                previousClick = currentClick;

                            }).bind(offEvent, function () {

                                if (angular.isFunction(scope.onHandleUp)) {
                                    scope.onHandleUp();
                                }

                                unbind.off(eventNamespace);

                                angular.element('body').removeClass('ngrs-touching');

                                // remove down class
                                $handle.removeClass('ngrs-down');

                                // remove active class
                                $slider.removeClass('ngrs-focus ' + handleDownClass);

                            });
                        }

                    });
                }

                function throwError (message) {
                    scope.disabled = true;
                    throw new Error("RangeSlider: " + message);
                }

                function throwWarning (message) {
                    $log.warn(message);
                }

                /**
                 * DESTROY
                 */

                scope.$on('$destroy', function () {

                    // unbind event from slider
                    $slider.off(eventNamespace);

                    // unbind from body
                    angular.element('body').off(eventNamespace);

                    // unbind from document
                    $document.off(eventNamespace);

                    // unbind from handles
                    for (var i = 0, l = handles.length; i < l; i++) {
                        handles[i].off(eventNamespace);
                        handles[i].off(eventNamespace + 'X');
                    }

                });

                /**
                 * INIT
                 */

                $slider
                    // disable selection
                    .bind('selectstart' + eventNamespace, function (event) {
                        return false;
                    })
                    // stop propagation
                    .bind('click', function (event) {
                        event.stopPropagation();
                    });

                // bind events to each handle
                handleMove(0);
                handleMove(1);

            }
        };
    }]);
    
    // requestAnimationFramePolyFill
    // http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function(){
        return window.requestAnimationFrame    ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
    })();
}());
