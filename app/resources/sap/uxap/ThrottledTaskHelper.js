/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global",'sap/ui/base/Object'],function(q,B){"use strict";var T=B.extend("ThrottledTask",{constructor:function(t,d,c){this._fnTask=t;this._iDelay=d;this._oContext=c;this._oPromise=null;this._fnResolvePromise=null;this._fnRejectPromise=null;this._iTimer=null;this._oTaskOptions=null;},reSchedule:function(i,t){var r=this._getPromise();if(this._iTimer){q.sap.clearDelayedCall(this._iTimer);this._iTimer=null;}this._oTaskOptions=this._mergeOptions(this._oTaskOptions||{},t);if(i){var s=this._fnTask.call(this._oContext,this._oTaskOptions);this._completePromise(s);return r;}this._iTimer=q.sap.delayedCall(this._iDelay,this,function(){if(this._oPromise){var s=this._fnTask.call(this._oContext,this._oTaskOptions);this._completePromise(s);}}.bind(this));return r;},_getPromise:function(){if(!this._oPromise){this._oPromise=new window.Promise(function(r,a){this._fnResolvePromise=r;this._fnRejectPromise=a;}.bind(this));}return this._oPromise;},_completePromise:function(s){var c=(s)?this._fnResolvePromise:this._fnRejectPromise;c();this._oPromise=null;this._fnResolvePromise=null;this._fnRejectPromise=null;this._oTaskOptions=null;},_mergeOptions:function(o,n){var m=q.extend({},o,n);q.each(m,function(k){m[k]=o[k]||n[k];});return m;}});return T;});
