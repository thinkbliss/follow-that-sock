// JavaScript Document
;
(function () {

    "use strict";

    var iframeId = 'sweepsiframe'; //id of the DJA sweepstakes iframe 
    var origin = '*'; //allowed origin

    function onDocumentReady() {
        //var sIframeUrl = document.getElementById(iframeId);
        var sIframeUrl = document.getElementById(iframeId).src;

        if (window.location.search) {
        	var sParam = window.location.search.substring(1);
        	sIframeUrl += (sIframeUrl.indexOf('?') == -1 ? '?' + sParam : '&' + sParam);
        }
        if (window.location.hash.length) {
        	sIframeUrl += window.location.hash;
        }

        document.getElementById(iframeId).src = sIframeUrl;
    }

    function receiveMessage(e) {

        if (!e || !e.data || (origin != '*' && e.origin != origin)) return;

        try {
            var iframe = document.getElementById(iframeId);
            var msg = typeof e.data != 'object' ? JSON.parse(e.data) : e.data;

            if ((typeof msg == 'object' && msg.action == 'resize' && typeof msg.value != 'undefined') || typeof msg == 'number') {
                iframe.style.height = parseInt((typeof msg.value != 'undefined' ? msg.value : msg)) + "px";
            }

            if (typeof msg == 'object' && (msg.action == 'scroll' || msg.action == 'getIframeOffsets')) {

                var box = {
                    top: 0,
                    left: 0
                };

                if (typeof iframe.getBoundingClientRect !== 'undefined') {
                    box = iframe.getBoundingClientRect();
                }

                var offset = {
                    top: box.top + (window.pageYOffset || iframe.scrollTop) - (iframe.clientTop || 0),
                    left: box.left + (window.pageXOffset || iframe.scrollLeft) - (iframe.clientLeft || 0)
                };

                if (msg.action == 'scroll') {
                    window.scrollTo(offset.left, typeof msg.value != 'undefined' ? parseInt(msg.value) : offset.top);
                } else {
                    iframe.contentWindow.postMessage({
                        type: 'iframeOffsets',
                        offsets: offset
                    }, origin);
                }

            }

            if (typeof msg == 'object' && msg.action == 'getScrollPositions') {

                iframe.contentWindow.postMessage({
                    type: 'scrollPositions',
                    offsets: {
                        x: window.pageXOffset,
                        y: window.pageYOffset
                    }
                }, origin);

            }

        } catch (err) {}
    }

    if (window.addEventListener) {
        document.addEventListener("DOMContentLoaded", onDocumentReady, false);
        window.addEventListener("message", receiveMessage, false);
    } else if (window.attachEvent) {
        document.attachEvent("onreadystatechange", onDocumentReady, false);
        window.attachEvent("onmessage", receiveMessage, false);
    }

})();

"object"!=typeof JSON&&(JSON={}),function(){"use strict"
function f(t){return 10>t?"0"+t:t}function quote(t){return escapable.lastIndex=0,escapable.test(t)?'"'+t.replace(escapable,function(t){var e=meta[t]
return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var r,n,o,f,u,p=gap,i=e[t]
switch(i&&"object"==typeof i&&"function"==typeof i.toJSON&&(i=i.toJSON(t)),"function"==typeof rep&&(i=rep.call(e,t,i)),typeof i){case"string":return quote(i)
case"number":return isFinite(i)?i+"":"null"
case"boolean":case"null":return i+""
case"object":if(!i)return"null"
if(gap+=indent,u=[],"[object Array]"===Object.prototype.toString.apply(i)){for(f=i.length,r=0;f>r;r+=1)u[r]=str(r,i)||"null"
return o=0===u.length?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+p+"]":"["+u.join(",")+"]",gap=p,o}if(rep&&"object"==typeof rep)for(f=rep.length,r=0;f>r;r+=1)"string"==typeof rep[r]&&(n=rep[r],o=str(n,i),o&&u.push(quote(n)+(gap?": ":":")+o))
else for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(o=str(n,i),o&&u.push(quote(n)+(gap?": ":":")+o))
return o=0===u.length?"{}":gap?"{\n"+gap+u.join(",\n"+gap)+"\n"+p+"}":"{"+u.join(",")+"}",gap=p,o}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()})
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","    ":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep
"function"!=typeof JSON.stringify&&(JSON.stringify=function(t,e,r){var n
if(gap="",indent="","number"==typeof r)for(n=0;r>n;n+=1)indent+=" "
else"string"==typeof r&&(indent=r)
if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw Error("JSON.stringify")
return str("",{"":t})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){function walk(t,e){var r,n,o=t[e]
if(o&&"object"==typeof o)for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(n=walk(o,r),void 0!==n?o[r]=n:delete o[r])
return reviver.call(t,e,o)}var j
if(text+="",cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j
throw new SyntaxError("JSON.parse")})}();// JavaScript Document