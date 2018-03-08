/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/Device","sap/ui/core/Component","sap/ui/core/Fragment","sap/ui/core/UIComponent","sap/ui/model/Filter","sap/ui/model/Sorter","sap/m/GroupHeaderListItem","../util/ToggleFullScreenHandler","sap/ui/demokit/explored/view/base.controller","jquery.sap.storage"],function(q,D,C,F,U,a,S,G,T,B){"use strict";return B.extend("sap.ui.demokit.explored.view.master",{_bIsViewUpdatedAtLeastOnce:false,_oVSDialog:null,_mGroupFunctions:{"name":function(c){var k=c.getProperty("name").charAt(0);return{key:k,text:k};},"namespace":true,"category":true,"since":true,"formFactors":true},onInit:function(){this.router=U.getRouterFor(this);this.router.attachRoutePatternMatched(this.onRouteMatched,this);this._component=C.getOwnerComponentFor(this.getView());this._component.getEventBus().subscribe("app","selectEntity",this.onSelectEntity,this);this._sCurrentGroup=this._oDefaultSettings.groupProperty;this.getView().addEventDelegate({onBeforeFirstShow:q.proxy(this.onBeforeFirstShow,this)});},onBeforeFirstShow:function(){if(!this._bIsViewUpdatedAtLeastOnce){this._updateView();}},onRouteMatched:function(e){var r=e.getParameter("name");if(r!=="home"&&r!="notFound"){var v=e.getParameter('view');if(v){var t=v.byId("toggleFullScreenBtn");if(t){T.updateControl(t,v);}}return;}this._updateView();},onOpenAppSettings:function(e){if(!this._oSettingsDialog){this._oSettingsDialog=sap.ui.xmlfragment("sap.ui.demokit.explored.view.appSettingsDialog",this);this.getView().addDependent(this._oSettingsDialog);}q.sap.delayedCall(0,this,function(){var A=sap.ui.getCore().getConfiguration();var c=this._oViewSettings.compactOn;var r=this._oViewSettings.rtl;var u=q.sap.getUriParameters().get("sap-theme");var s=q.sap.getUriParameters().get("sap-ui-rtl");if(u){sap.ui.getCore().byId("ThemeButtons").setSelectedKey(u);}else{sap.ui.getCore().byId("ThemeButtons").setSelectedKey(A.getTheme());}sap.ui.getCore().byId("CompactModeButtons").setState(c);if(s){sap.ui.getCore().byId("RTLButtons").setState(s==="true"?true:false);}else{sap.ui.getCore().byId("RTLButtons").setState(r);}this._oSettingsDialog.open();});},onSaveAppSettings:function(e){this._oSettingsDialog.close();if(!this._oBusyDialog){q.sap.require("sap.m.BusyDialog");var b=sap.ui.require("sap/m/BusyDialog");this._oBusyDialog=new b();this.getView().addDependent(this._oBusyDialog);}var c=sap.ui.getCore().byId('CompactModeButtons').getState();var t=sap.ui.getCore().byId('ThemeButtons').getSelectedKey();var r=sap.ui.getCore().byId('RTLButtons').getState();var R=(r!==this._oViewSettings.rtl);this._oBusyDialog.open();q.sap.delayedCall(1000,this,function(){this._oBusyDialog.close();});this._oViewSettings.compactOn=c;this._oViewSettings.themeActive=t;this._oViewSettings.rtl=r;this._oViewSettings.version=this._oDefaultSettings.version;var s=JSON.stringify(this._oViewSettings);this._oStorage.put(this._sStorageKey,s);this._component.getEventBus().publish("app","applyAppConfiguration",{themeActive:t,compactOn:c});if(R){this._handleRTL(r);}},onDialogCloseButton:function(){this._oSettingsDialog.close();},onSelectEntity:function(c,e,d){var v=this.getView(),l=v.byId("list"),m=v.getModel("entity");var s=null;var I=l.getItems();q.each(I,function(i,o){var b=o.getBindingContext("entity");if(b){var p=b.getPath();var E=m.getProperty(p);if(E.id===d.id){s=o;return false;}}});if(s){l.setSelectedItem(s);}else{l.removeSelections();}},onOpenViewSettings:function(){if(!this._oVSDialog){this._oVSDialog=sap.ui.xmlfragment(this.getView().getId(),"sap.ui.demokit.explored.view.viewSettingsDialog",this);this.getView().addDependent(this._oVSDialog);}q.sap.delayedCall(0,this,function(){var f={};q.each(this._oViewSettings.filter,function(p,v){q.each(v,function(i,V){f[V]=true;});});this._oVSDialog.setSelectedFilterKeys(f);this._oVSDialog.setSelectedGroupItem(this._oViewSettings.groupProperty);this._oVSDialog.setGroupDescending(this._oViewSettings.groupDescending);q('body').toggleClass("sapUiSizeCompact",this._oViewSettings.compactOn).toggleClass("sapUiSizeCozy",!this._oViewSettings.compactOn);this._oVSDialog.open();});},onConfirmViewSettings:function(e){var t=this;this._oViewSettings.filter={};var f=e.getParameter("filterItems");q.each(f,function(i,I){var k=I.getKey();var p=I.getParent().getKey();if(!t._oViewSettings.filter.hasOwnProperty(p)){t._oViewSettings.filter[p]=[];}t._oViewSettings.filter[p].push(k);});var g=e.getParameter("groupItem");var n=(g)?g.getKey():null;this._oViewSettings.groupProperty=n;this._oViewSettings.groupDescending=e.getParameter("groupDescending");var s=JSON.stringify(this._oViewSettings);this._oStorage.put(this._sStorageKey,s);this._updateView();},onSearch:function(){this._updateView();},onNavToEntity:function(e){var i=e.getParameter("listItem");var I=(i)?i:e.getSource();var p=I.getBindingContext("entity").getPath();var E=this.getView().getModel("entity").getProperty(p);var r=!D.system.phone;this.router.navTo("entity",{id:E.id,part:"samples"},r);},_updateView:function(){this._applyViewConfigurations();this._updateFilterBarDisplay();this._updateListBinding();},_updateFilterBarDisplay:function(){var f="";q.each(this._oViewSettings.filter,function(p,V){q.each(V,function(i,b){f+=b+", ";});});if(f.length>0){var I=f.lastIndexOf(", ");f=f.substring(0,I);}var v=this.getView();v.byId("vsFilterBar").setVisible(f.length>0);v.byId("vsFilterLabel").setText(f);},_updateListBinding:function(){var f=[],s=[],b=false,g=false,o=this.getView().byId("searchField"),l=this.getView().byId("list"),c=l.getBinding("items");var Q=o.getValue().trim();b=true;f.push(new a("searchTags","Contains",Q));q.each(this._oViewSettings.filter,function(p,v){var P=[];q.each(v,function(i,V){var O=(p==="formFactors")?"Contains":"EQ";P.push(new a(p,O,V));});var d=new a(P,false);b=true;f.push(d);});if(b&&f.length===0){c.filter(f,"Application");}else if(b&&f.length>0){var d=new a(f,true);c.filter(d,"Application");}if(this._oViewSettings.groupProperty&&this._oViewSettings.groupProperty!==this._sCurrentGroup){g=true;}else if(this._oViewSettings.groupProperty&&this._oViewSettings.groupDescending!==this._bCurrentlyGroupedDescending){g=true;}if(g){var e=new S(this._oViewSettings.groupProperty,this._oViewSettings.groupDescending,this._mGroupFunctions[this._oViewSettings.groupProperty]);s.push(e);s.push(new S("name",false));c.sort(s);}this._sCurrentGroup=this._oViewSettings.groupProperty;this._bCurrentlyGroupedDescending=this._oViewSettings.groupDescending;this._bIsViewUpdatedAtLeastOnce=true;},getGroupHeader:function(g){return new G({title:g.key,upperCase:false});}});});
