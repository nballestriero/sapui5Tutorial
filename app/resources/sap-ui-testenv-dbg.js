/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine('jquery.sap.strings',['jquery.sap.global'],function(q){"use strict";
q.sap.endsWith=function endsWith(s,e){if(typeof(e)!="string"||e==""){return false;}var p=s.lastIndexOf(e);return p>=0&&p==s.length-e.length;};
q.sap.endsWithIgnoreCase=function endsWithIgnoreCase(s,e){if(typeof(e)!="string"||e==""){return false;}s=s.toUpperCase();e=e.toUpperCase();return q.sap.endsWith(s,e);};
q.sap.startsWith=function startsWith(s,S){if(typeof(S)!="string"||S==""){return false;}if(s==S){return true;}return s.indexOf(S)==0;};
q.sap.startsWithIgnoreCase=function startsWithIgnoreCase(s,S){if(typeof(S)!="string"||S==""){return false;}s=s.toUpperCase();S=S.toUpperCase();return q.sap.startsWith(s,S);};
q.sap.charToUpperCase=function charToUpperCase(s,p){if(!s){return s;}if(!p||isNaN(p)||p<=0||p>=s.length){p=0;}var C=s.charAt(p).toUpperCase();if(p>0){return s.substring(0,p)+C+s.substring(p+1);}return C+s.substring(p+1);};
q.sap.padLeft=function padLeft(s,p,l){if(!s){s="";}while(s.length<l){s=p+s;}return s;};
q.sap.padRight=function padRight(s,p,l){if(!s){s="";}while(s.length<l){s=s+p;}return s;};
var r=/-(.)/ig;
q.sap.camelCase=function camelCase(s){return s.replace(r,function(m,C){return C.toUpperCase();});};
var a=/([A-Z])/g;
q.sap.hyphen=function hyphen(s){return s.replace(a,function(m,C){return"-"+C.toLowerCase();});};
var b=/[[\]{}()*+?.\\^$|]/g;
q.sap.escapeRegExp=function escapeRegExp(s){return s.replace(b,"\\$&");};
q.sap.formatMessage=function formatMessage(p,v){if(arguments.length>2||(v!=null&&!Array.isArray(v))){v=Array.prototype.slice.call(arguments,1);}v=v||[];return p.replace(c,function($,d,e,f,o){if(d){return"'";}else if(e){return e.replace(/''/g,"'");}else if(f){return String(v[parseInt(f,10)]);}throw new Error("formatMessage: pattern syntax error at pos. "+o);});};
var c=/('')|'([^']+(?:''[^']*)*)(?:'|$)|\{([0-9]+(?:\s*,[^{}]*)?)\}|[{}]/g;return q;});
sap.ui.predefine('sap/ui/debug/Highlighter',['jquery.sap.global','jquery.sap.dom','jquery.sap.script'],function(q){"use strict";var H=function(i,f,c,b){this.sId=i||q.sap.uid();this.bFilled=(f==true);this.sColor=c||'blue';if(isNaN(b)){this.iBorderWidth=2;}else if(b<=0){this.iBorderWidth=0;}else{this.iBorderWidth=b;}};
H.prototype.highlight=function(d){if(!d||!d.parentNode){return;}var h=q.sap.domById(this.sId);if(!h){h=d.ownerDocument.createElement("DIV");h.setAttribute("id",this.sId);h.style.position="absolute";h.style.border=this.iBorderWidth+"px solid "+this.sColor;h.style.display="none";h.style.margin="0px";h.style.padding="0px";if(this.bFilled){h.innerHTML="<div style='background-color:"+this.sColor+";opacity:0.2;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=20);height:100%;width:100%'>&nbsp;</div>";}d.ownerDocument.body.appendChild(h);}var r=q(d).rect();h.style.top=(r.top-this.iBorderWidth)+"px";h.style.left=(r.left-this.iBorderWidth)+"px";h.style.width=(r.width)+"px";h.style.height=(r.height)+"px";h.style.display="block";};
H.prototype.hide=function(){var h=q.sap.domById(this.sId);if(!h){return;}h.style.display="none";};
return H;},true);
sap.ui.predefine('sap/ui/test/ControlTree',['jquery.sap.global','sap/ui/core/Element','jquery.sap.strings'],function(q,E){"use strict";var C=function(c,w){this.oWindow=w;this.oCore=c;this.oCore.attachUIUpdated(this.renderDelayed,this);this.renderDelayed();};
C.prototype.renderDelayed=function(){if(this.oTimer){this.oWindow.jQuery.sap.clearDelayedCall(this.oTimer);}this.oTimer=this.oWindow.jQuery.sap.delayedCall(500,this,"initDT");restoreLockState(this);supplySelectedTheme(this.oCore.getConfiguration().getTheme());};
C.prototype.initDT=function(){restoreTreeCallback();var u=null,U=this.oCore.mUIAreas;for(var i in U){var u=U[i];var r=u.getContent();for(var i=0,l=r.length;i<l;i++){this.renderNodeDT(r[i],0);}}};
C.prototype.createTreeNodeDT=function(i,l,t){callback(i,l,t);};
C.prototype.createAssocTreeNodeDT=function(i,l,t,s,a){callback(i,l,t,s,a);};
C.prototype.renderNodeDT=function(c,l){if(!c){return;}var M=c.getMetadata();var p=M.getAllProperties();for(var P in p){var a=c["get"+P];var N=P;if(!a){N=q.sap.charToUpperCase(N,0);}var v=c["get"+N]();addProperty(c.getId(),P,p[P].type,v!=null?v:"");}var A=M.getAllAggregations();for(var n in A){var b=c.getAggregation(A[n].name);if(b&&b.length){for(var i=0;i<b.length;i++){var o=b[i];if(o instanceof E){this.renderNodeDT(b[i],l+1);}}}else if(b instanceof E){this.renderNodeDT(b,l+1);}}var d=M.getAllAssociations();for(var m in d){var e=c.getAssociation(d[m].name);if(e!=null){var f=d[m].name+e;this.createAssocTreeNodeDT(f,l+2,"Association",c.getId(),e);addProperty(f,d[m].name,"assoc_type",e);addProperty(f,"Name","string",d[m].name);}}};
return C;},true);
sap.ui.predefine('sap/ui/test/TestEnv',['jquery.sap.global','sap/ui/debug/Highlighter','./ControlTree'],function(q,H,C){"use strict";var T=function(){};
T.prototype.startPlugin=function(c){this.oCoreOther=c;this.oCore=c;this.oCore.attachControlEvent(this.onControlEvent,this);this.oWindow=window;this.oControlTree=new C(this.oCore,window);};
T.prototype.stopPlugin=function(){this.oCore.detachControlEvent(this.onControlEvent,this);this.oCore=null;};
T.prototype.onControlEvent=function(e){if(this.oCore.isLocked()){var b=e.getParameter("browserEvent");if(b.type=="click"){var E=b.srcControl;if(E){var s=new H('sap-ui-testsuite-SelectionHighlighter');s.highlight(E.getDomRef());if(selectControl){selectControl(E.getId());}}}}};
(function(){var t=new T();sap.ui.getCore().registerPlugin(t);}());return T;},true);
sap.ui.requireSync("sap/ui/test/TestEnv");
//# sourceMappingURL=sap-ui-testenv.js.map