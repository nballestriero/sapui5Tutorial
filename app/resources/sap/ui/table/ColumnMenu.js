/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/unified/Menu','sap/ui/unified/MenuItem','sap/ui/unified/MenuTextFieldItem','sap/ui/Device','./TableUtils'],function(q,a,M,b,c,D,T){"use strict";var C=M.extend("sap.ui.table.ColumnMenu",{metadata:{library:"sap.ui.table"},renderer:"sap.ui.unified.MenuRenderer"});C.prototype.init=function(){if(M.prototype.init){M.prototype.init.apply(this,arguments);}this.addStyleClass("sapUiTableColumnMenu");this._oResBundle=sap.ui.getCore().getLibraryResourceBundle("sap.ui.table");this._bInvalidated=true;this._iPopupClosedTimeoutId=null;this._oColumn=null;this._oTable=null;this._attachPopupClosed();};C.prototype.exit=function(){if(M.prototype.exit){M.prototype.exit.apply(this,arguments);}window.clearTimeout(this._iPopupClosedTimeoutId);this._detachEvents();this._oColumn=this._oTable=null;};C.prototype.onThemeChanged=function(){if(this.getDomRef()){this._invalidate();}};C.prototype.setParent=function(p){this._detachEvents();this._invalidate();this._updateReferences(p);this._attachEvents();return M.prototype.setParent.apply(this,arguments);};C.prototype._updateReferences=function(p){this._oColumn=p;if(p){this._oTable=this._oColumn.getParent();if(this._oTable){}}};C.prototype._attachEvents=function(){if(this._oTable){this._oTable.attachColumnVisibility(this._invalidate,this);this._oTable.attachColumnMove(this._invalidate,this);}};C.prototype._detachEvents=function(){if(this._oTable){this._oTable.detachColumnVisibility(this._invalidate,this);this._oTable.detachColumnMove(this._invalidate,this);}};C.prototype._invalidate=function(){this._bInvalidated=true;};C.prototype._updateResourceBundle=function(){this._oResBundle=sap.ui.getCore().getLibraryResourceBundle("sap.ui.table");this._invalidate();};C.prototype._attachPopupClosed=function(){var t=this;if(!D.support.touch){this.getPopup().attachClosed(function(){t._iPopupClosedTimeoutId=window.setTimeout(function(){if(t._oColumn){if(t._lastFocusedDomRef){t._lastFocusedDomRef.focus();}else{t._oColumn.focus();}}},0);});}};C.prototype.open=function(){if(this._bInvalidated){this._bInvalidated=false;this.destroyItems();this._addMenuItems();}if(this.getItems().length>0){this._lastFocusedDomRef=arguments[4];M.prototype.open.apply(this,arguments);}};C.prototype._addMenuItems=function(){if(this._oColumn){this._addSortMenuItem(false);this._addSortMenuItem(true);this._addFilterMenuItem();this._addGroupMenuItem();this._addFreezeMenuItem();this._addColumnVisibilityMenuItem();}};C.prototype._addSortMenuItem=function(d){var o=this._oColumn;if(o.isSortableByMenu()){var s=d?"desc":"asc";var i=d?"sort-descending":"sort-ascending";this.addItem(this._createMenuItem(s,"TBL_SORT_"+s.toUpperCase(),i,function(e){o.sort(d,e.getParameter("ctrlKey")===true);}));}};C.prototype._addFilterMenuItem=function(){var o=this._oColumn;if(o.isFilterableByMenu()){var t=o.getParent();var d=t&&t.getEnableCustomFilter();if(d){this.addItem(this._createMenuItem("filter","TBL_FILTER_ITEM","filter",function(){t.fireCustomFilter({column:o});}));}else{this.addItem(this._createMenuTextFieldItem("filter","TBL_FILTER","filter",o.getFilterValue(),function(){o.filter(this.getValue());}));}}};C.prototype._addGroupMenuItem=function(){var o=this._oColumn;if(o.isGroupableByMenu()){var t=this._oTable;this.addItem(this._createMenuItem("group","TBL_GROUP",null,function(){t.setGroupBy(o);}));}};C.prototype._addFreezeMenuItem=function(){var o=this._oColumn;var t=this._oTable;var d=t&&t.getEnableColumnFreeze();if(d){var i=o.getIndex();var I=i+T.Column.getHeaderSpan(o)==t.getFixedColumnCount();this.addItem(this._createMenuItem("freeze",I?"TBL_UNFREEZE":"TBL_FREEZE",null,function(){var e=t.fireColumnFreeze({column:o});if(e){if(I){t.setFixedColumnCount(0);}else{t.setFixedColumnCount(i+1);}}}));}};C.prototype._addColumnVisibilityMenuItem=function(){var t=this._oTable;if(t&&t.getShowColumnVisibilityMenu()){var o=this._createMenuItem("column-visibilty","TBL_COLUMNS");this.addItem(o);var d=new M(o.getId()+"-menu");o.setSubmenu(d);var e=t.getColumns();if(t.getColumnVisibilityMenuSorter&&typeof t.getColumnVisibilityMenuSorter==="function"){var s=t.getColumnVisibilityMenuSorter();if(typeof s==="function"){e=e.sort(s);}}var B=t.getBinding();var A=T.isInstanceOf(B,"sap/ui/model/analytics/AnalyticalBinding");for(var i=0,l=e.length;i<l;i++){var f=e[i];if(A&&T.isInstanceOf(f,"sap/ui/table/AnalyticalColumn")){var Q=B.getAnalyticalQueryResult();var E=Q.getEntityType();var m=B.getModel().getProperty("/#"+E.getTypeDescription().name+"/"+f.getLeadingProperty()+"/sap:visible");if(m&&(m.value==="false"||m.value===false)){continue;}}var g=this._createColumnVisibilityMenuItem(d.getId()+"-item-"+i,f);d.addItem(g);}}};C.prototype._createColumnVisibilityMenuItem=function(i,o){function g(l){return l&&l.getText&&l.getText();}var t=o.getName()||g(o.getLabel());if(!t){o.getMultiLabels().forEach(function(l,d){if(T.Column.getHeaderSpan(o,d)===1){t=g(l)||t;}});}return new b(i,{text:t,icon:o.getVisible()?"sap-icon://accept":null,select:q.proxy(function(e){var m=e.getSource();var v=!o.getVisible();if(v||T.getVisibleColumnCount(this._oTable)>1){var d=o.getParent();var E=true;if(d&&T.isInstanceOf(d,"sap/ui/table/Table")){E=d.fireColumnVisibility({column:o,newVisible:v});}if(E){o.setVisible(v);}m.setIcon(v?"sap-icon://accept":null);}},this)});};C.prototype._createMenuItem=function(i,t,I,h){return new b(this.getId()+"-"+i,{text:this._oResBundle.getText(t),icon:I?"sap-icon://"+I:null,select:h||function(){}});};C.prototype._createMenuTextFieldItem=function(i,t,I,v,h){h=h||function(){};return new c(this.getId()+"-"+i,{label:this._oResBundle.getText(t),icon:I?"sap-icon://"+I:null,value:v,select:h||function(){}});};C.prototype._setFilterValue=function(v){var o=this.getParent();var t=(o?o.getParent():undefined);var f=sap.ui.getCore().byId(this.getId()+"-filter");if(f&&(t&&!t.getEnableCustomFilter())){f.setValue(v);}return this;};C.prototype._setFilterState=function(f){var o=this.getParent();var t=(o?o.getParent():undefined);var F=sap.ui.getCore().byId(this.getId()+"-filter");if(F&&(t&&!t.getEnableCustomFilter())){F.setValueState(f);}return this;};return C;});
