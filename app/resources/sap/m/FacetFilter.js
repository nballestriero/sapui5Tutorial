/*!
* UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/
sap.ui.define(['jquery.sap.global','./NavContainer','./library','sap/ui/core/Control','sap/ui/core/IconPool','sap/ui/core/delegate/ItemNavigation','sap/ui/core/InvisibleText','sap/ui/Device','sap/ui/base/ManagedObject','sap/ui/core/Icon','sap/ui/model/Filter','jquery.sap.keycodes'],function(q,N,l,C,I,a,b,D,M,c,F){"use strict";var T=l.ToolbarDesign;var L=l.ListType;var d=l.ListMode;var e=l.FacetFilterListDataType;var B=l.ButtonType;var P=l.PlacementType;var f=l.FacetFilterType;var g=C.extend("sap.m.FacetFilter",{metadata:{interfaces:["sap.ui.core.IShrinkable"],library:"sap.m",properties:{showPersonalization:{type:"boolean",group:"Appearance",defaultValue:false},type:{type:"sap.m.FacetFilterType",group:"Appearance",defaultValue:f.Simple},liveSearch:{type:"boolean",group:"Behavior",defaultValue:true},showSummaryBar:{type:"boolean",group:"Behavior",defaultValue:false},showReset:{type:"boolean",group:"Behavior",defaultValue:true},showPopoverOKButton:{type:"boolean",group:"Appearance",defaultValue:false}},defaultAggregation:"lists",aggregations:{lists:{type:"sap.m.FacetFilterList",multiple:true,singularName:"list"},buttons:{type:"sap.m.Button",multiple:true,singularName:"button",visibility:"hidden"},removeFacetIcons:{type:"sap.ui.core.Icon",multiple:true,singularName:"removeFacetIcon",visibility:"hidden"},popover:{type:"sap.m.Popover",multiple:false,visibility:"hidden"},addFacetButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"},dialog:{type:"sap.m.Dialog",multiple:false,visibility:"hidden"},summaryBar:{type:"sap.m.Toolbar",multiple:false,visibility:"hidden"},resetButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"},arrowLeft:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"},arrowRight:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"}},events:{reset:{},confirm:{}}}});g.SCROLL_STEP=264;g.prototype.setType=function(t){var s=this.getAggregation("summaryBar");if(D.system.phone){this.setProperty("type",f.Light);s.setActive(true);}else{this.setProperty("type",t);s.setActive(t===f.Light);}if(t===f.Light){if(this.getShowReset()){this._addResetToSummary(s);}else{this._removeResetFromSummary(s);}}return this;};g.prototype.setShowReset=function(v){this.setProperty("showReset",v);var s=this.getAggregation("summaryBar");if(v){if(this.getShowSummaryBar()||this.getType()===f.Light){this._addResetToSummary(s);}}else{if(this.getShowSummaryBar()||this.getType()===f.Light){this._removeResetFromSummary(s);}}return this;};g.prototype.setShowSummaryBar=function(v){this.setProperty("showSummaryBar",v);if(v){var s=this.getAggregation("summaryBar");if(this.getShowReset()){this._addResetToSummary(s);}else{this._removeResetFromSummary(s);}s.setActive(this.getType()===f.Light);}return this;};g.prototype.setLiveSearch=function(v){this.setProperty("liveSearch",v);if(this._displayedList){var o=this._displayedList;var s=sap.ui.getCore().byId(o.getAssociation("search"));s.detachLiveChange(o._handleSearchEvent,o);if(v){s.attachLiveChange(o._handleSearchEvent,o);}}return this;};g.prototype.getLists=function(){var h=this.getAggregation("lists");if(!h){h=[];}if(this._displayedList){h.splice(this._listAggrIndex,0,this._displayedList);}return h;};g.prototype.removeList=function(o){var h=M.prototype.removeAggregation.call(this,"lists",o);this._removeList(h);return h;};g.prototype.removeAggregation=function(){var o=M.prototype.removeAggregation.apply(this,arguments);if(arguments[0]==="lists"){this._removeList(o);}return o;};g.prototype.openFilterDialog=function(){var o=this._getFacetDialog();var n=this._getFacetDialogNavContainer();o.addContent(n);this.getLists().forEach(function(h){h._preserveOriginalActiveState();});o.setInitialFocus(n.getPages()[0].getContent()[0].getItems()[0]);o.open();return this;};g.prototype.init=function(){this._pageSize=5;this._addDelegateFlag=false;this._invalidateFlag=false;this._closePopoverFlag=false;this._lastCategoryFocusIndex=0;this._aDomRefs=null;this._previousTarget=null;this._addTarget=null;this._aRows=null;this._bundle=sap.ui.getCore().getLibraryResourceBundle("sap.m");this.data("sap-ui-fastnavgroup","true",true);this._buttons={};this._aOwnedLabels=[];this._removeFacetIcons={};this._listAggrIndex=-1;this._displayedList=null;this._lastScrolling=false;this._bPreviousScrollForward=false;this._bPreviousScrollBack=false;this._getAddFacetButton();this._getSummaryBar();this.setAggregation("resetButton",this._createResetButton());if(q.sap.touchEventMode==="ON"&&!D.system.phone){this._enableTouchSupport();}if(D.system.phone){this.setType(f.Light);}};g.prototype.exit=function(){var o;sap.ui.getCore().detachIntervalTimer(this._checkOverflow,this);if(this.oItemNavigation){this.removeDelegate(this.oItemNavigation);this.oItemNavigation.destroy();}if(this._aOwnedLabels){this._aOwnedLabels.forEach(function(i){o=sap.ui.getCore().byId(i);if(o){o.destroy();}});this._aOwnedLabels=null;}};g.prototype.onBeforeRendering=function(){if(this.getShowSummaryBar()||this.getType()===f.Light){var s=this.getAggregation("summaryBar");var t=s.getContent()[0];t.setText(this._getSummaryText());t.setTooltip(this._getSummaryText());}sap.ui.getCore().detachIntervalTimer(this._checkOverflow,this);};g.prototype.onAfterRendering=function(){if(this.getType()!==f.Light&&!D.system.phone){sap.ui.getCore().attachIntervalTimer(this._checkOverflow,this);}this._startItemNavigation();};g.prototype._startItemNavigation=function(){var o=this.getDomRef(),r=o.getElementsByClassName("sapMFFHead"),h=[];if(r.length>0){for(var i=0;i<r[0].childNodes.length;i++){if(r[0].childNodes[i].id.indexOf("ff")<0&&r[0].childNodes[i].id.indexOf("icon")<0&&r[0].childNodes[i].id.indexOf("add")<0){h.push(r[0].childNodes[i]);}if(r[0].childNodes[i].id.indexOf("add")>=0){h.push(r[0].childNodes[i]);}}}if(h!=""){this._aDomRefs=h;}if((!this.oItemNavigation)||this._addDelegateFlag==true){this.oItemNavigation=new a();this.addDelegate(this.oItemNavigation);this._addDelegateFlag=false;}this._aRows=r;for(var i=0;i<this.$().find(":sapTabbable").length;i++){if(this.$().find(":sapTabbable")[i].id.indexOf("add")>=0){this._addTarget=this.$().find(":sapTabbable")[i];break;}}this.oItemNavigation.setRootDomRef(o);this.oItemNavigation.setItemDomRefs(h);this.oItemNavigation.setCycling(false);this.oItemNavigation.setPageSize(this._pageSize);};g.prototype.onsapdelete=function(E){var o,h;if(!this.getShowPersonalization()){return;}o=sap.ui.getCore().byId(E.target.id);if(!o){return;}h=sap.ui.getCore().byId(o.getAssociation("list"));if(!h){return;}if(!h.getShowRemoveFacetIcon()){return;}h.removeSelections(true);h.setSelectedKeys();h.setProperty("active",false,true);this.invalidate();var t=this.$().find(":sapTabbable");q(t[t.length-1]).focus();var n=this.oItemNavigation.getFocusedIndex();q(E.target).blur();this.oItemNavigation.setFocusedIndex(n+1);this.focus();if(this.oItemNavigation.getFocusedIndex()==0){for(var k=0;k<this.$().find(":sapTabbable").length-1;k++){if(t[k].id.indexOf("add")>=0){q(t[k]).focus();}}}};g.prototype.onsaptabnext=function(E){this._previousTarget=E.target;if(E.target.parentNode.className=="sapMFFHead"){for(var i=0;i<this.$().find(":sapTabbable").length;i++){if(this.$().find(":sapTabbable")[i].parentNode.className=="sapMFFResetDiv"){q(this.$().find(":sapTabbable")[i]).focus();E.preventDefault();E.setMarked();return;}}}this._lastCategoryFocusIndex=this.oItemNavigation.getFocusedIndex();if(this._invalidateFlag==true){this.oItemNavigation.setFocusedIndex(-1);this.focus();this._invalidateFlag=false;}if(this._closePopoverFlag==true){this.oItemNavigation.setFocusedIndex(-1);this.focus();this._closePopoverFlag=false;}};g.prototype.onsaptabprevious=function(E){if(E.target.parentNode.className=="sapMFFResetDiv"&&this._previousTarget==null){q(this.$().find(":sapTabbable")[0]).focus();E.preventDefault();E.setMarked();return;}if(E.target.parentNode.className=="sapMFFResetDiv"&&this._previousTarget!=null&&this._previousTarget.id!=E.target.id){q(this._previousTarget).focus();E.preventDefault();E.setMarked();return;}if(E.target.id.indexOf("add")>=0||E.target.parentNode.className=="sapMFFHead"){this._previousTarget=E.target;q(this.$().find(":sapTabbable")[0]).focus();}};g.prototype.onsapend=function(E){if(this._addTarget!=null){q(this._addTarget).focus();E.preventDefault();E.setMarked();}else{q(this._aRows[this._aRows.length-1]).focus();E.preventDefault();E.setMarked();}this._previousTarget=E.target;};g.prototype.onsaphome=function(E){q(this._aRows[0]).focus();E.preventDefault();E.setMarked();this._previousTarget=E.target;};g.prototype.onsappageup=function(E){this._previousTarget=E.target;};g.prototype.onsappagedown=function(E){this._previousTarget=E.target;};g.prototype.onsapincreasemodifiers=function(E){if(E.which==q.sap.KeyCodes.ARROW_RIGHT){this._previousTarget=E.target;var h=this.oItemNavigation.getFocusedIndex()-1;var n=h+this._pageSize;q(E.target).blur();this.oItemNavigation.setFocusedIndex(n);this.focus();}};g.prototype.onsapdecreasemodifiers=function(E){var h=0;if(E.which==q.sap.KeyCodes.ARROW_LEFT){this._previousTarget=E.target;h=this.oItemNavigation.getFocusedIndex()+1;var n=h-this._pageSize;q(E.target).blur();this.oItemNavigation.setFocusedIndex(n);this.focus();}};g.prototype.onsapdownmodifiers=function(E){this._previousTarget=E.target;var h=0;h=this.oItemNavigation.getFocusedIndex()-1;var n=h+this._pageSize;q(E.target).blur();this.oItemNavigation.setFocusedIndex(n);this.focus();};g.prototype.onsapupmodifiers=function(E){this._previousTarget=E.target;var h=0;h=this.oItemNavigation.getFocusedIndex();if(h!=0){h=h+1;}var n=h-this._pageSize;q(E.target).blur();this.oItemNavigation.setFocusedIndex(n);this.focus();};g.prototype.onsapexpand=function(E){this._previousTarget=E.target;var n=this.oItemNavigation.getFocusedIndex()+1;q(E.target).blur();this.oItemNavigation.setFocusedIndex(n);this.focus();};g.prototype.onsapcollapse=function(E){this._previousTarget=E.target;var n=this.oItemNavigation.getFocusedIndex()-1;q(E.target).blur();this.oItemNavigation.setFocusedIndex(n);this.focus();};g.prototype.onsapdown=function(E){this._previousTarget=E.target;if(E.target.parentNode.className=="sapMFFResetDiv"){q(E.target).focus();E.preventDefault();E.setMarked();return;}};g.prototype.onsapup=function(E){this._previousTarget=E.target;if(E.target.parentNode.className=="sapMFFResetDiv"){q(E.target).focus();E.preventDefault();E.setMarked();}};g.prototype.onsapleft=function(E){this._previousTarget=E.target;if(E.target.parentNode.className=="sapMFFResetDiv"){q(E.target).focus();E.preventDefault();E.setMarked();}};g.prototype.onsapright=function(E){this._previousTarget=E.target;if(E.target.parentNode.className=="sapMFFResetDiv"){q(E.target).focus();E.preventDefault();E.setMarked();}};g.prototype.onsapescape=function(E){if(E.target.parentNode.className=="sapMFFResetDiv"){return;}var n=this._lastCategoryFocusIndex;q(E.target).blur();this.oItemNavigation.setFocusedIndex(n);this.focus();};g.prototype._getPopover=function(){var p=this.getAggregation("popover");if(!p){var t=this;p=new sap.m.Popover({placement:P.Bottom,beforeOpen:function(E){if(t._displayedList){t._displayedList._setSearchValue("");}this.setCustomHeader(t._createFilterItemsSearchFieldBar(t._displayedList));var s=this.getSubHeader();if(!s){this.setSubHeader(t._createSelectAllCheckboxBar(t._displayedList));}h(t._displayedList);},afterClose:function(E){t._addDelegateFlag=true;t._closePopoverFlag=true;if(D.browser.internet_explorer&&D.browser.version<10){q.sap.delayedCall(100,t,t._handlePopoverAfterClose);}else{t._handlePopoverAfterClose();}},horizontalScrolling:false});this.setAggregation("popover",p,true);p.setContentWidth("30%");if(D.browser.internet_explorer&&D.browser.version<10){p.setContentWidth("30%");}p.addStyleClass("sapMFFPop");var h=function(o){if(!o){return;}var i=t._getFacetRemoveIcon(o);if(i){i._bTouchStarted=false;}};}if(this.getShowPopoverOKButton()){this._addOKButtonToPopover(p);}else{p.destroyAggregation("footer");}return p;};g.prototype._handlePopoverAfterClose=function(){var p=this.getAggregation("popover"),o=this._displayedList;if(!p){return;}var i=this._getFacetRemoveIcon(o);if(i&&i._bTouchStarted){return;}this._restoreListFromDisplayContainer(p);this._displayRemoveIcon(false,o);o._fireListCloseEvent();this._fireConfirmEvent();this.destroyAggregation("popover");if(this._oOpenPopoverDeferred){q.sap.delayedCall(0,this,function(){this._oOpenPopoverDeferred.resolve();this._oOpenPopoverDeferred=undefined;});}};g.prototype._fireConfirmEvent=function(){this.fireEvent('confirm');};g.prototype._openPopover=function(p,o){if(!p.isOpen()){var h=sap.ui.getCore().byId(o.getAssociation("list"));h.fireListOpen({});this._moveListToDisplayContainer(h,p);p.openBy(o);if(h.getShowRemoveFacetIcon()){this._displayRemoveIcon(true,h);}if(h.getWordWrap()){p.setContentWidth("30%");}h._applySearch();}return this;};g.prototype._getAddFacetButton=function(){var o=this.getAggregation("addFacetButton");if(!o){var t=this;var o=new sap.m.Button(this.getId()+"-add",{icon:I.getIconURI("add-filter"),type:B.Transparent,tooltip:this._bundle.getText("FACETFILTER_ADDFACET"),press:function(E){t.openFilterDialog();}});this.setAggregation("addFacetButton",o,true);}return o;};g.prototype._getButtonForList=function(o){if(this._buttons[o.getId()]){this._setButtonText(o);return this._buttons[o.getId()];}var t=this;var h=new sap.m.Button({type:B.Transparent,press:function(E){var i=this;var O=function(){var p=t._getPopover();t._openPopover(p,i);};o._preserveOriginalActiveState();if(D.browser.internet_explorer&&D.browser.version<10){q.sap.delayedCall(100,this,O);}else{var p=t._getPopover();if(p.isOpen()){q.sap.delayedCall(100,this,function(){if(p.isOpen()){return;}t._oOpenPopoverDeferred=q.Deferred();t._oOpenPopoverDeferred.promise().done(O);});}else{q.sap.delayedCall(100,this,O);}}}});this._buttons[o.getId()]=h;this.addAggregation("buttons",h);h.setAssociation("list",o.getId(),true);this._setButtonText(o);return h;};g.prototype._setButtonText=function(o){var h=this._buttons[o.getId()];if(o._iAllItemsCount===undefined&&o.getMaxItemsCount()){o._iAllItemsCount=o.getMaxItemsCount();}if(h){var t="";var s=Object.getOwnPropertyNames(o._oSelectedKeys);var i=s.length;if(i===1){var S=o._oSelectedKeys[s[0]];t=this._bundle.getText("FACETFILTER_ITEM_SELECTION",[o.getTitle(),S]);}else if(i>0&&i===(o._iAllItemsCount?o._iAllItemsCount:0)){t=this._bundle.getText("FACETFILTER_ALL_SELECTED",[o.getTitle()]);}else if(i>0){t=this._bundle.getText("FACETFILTER_ITEM_SELECTION",[o.getTitle(),i]);}else{t=o.getTitle();}h.setText(t);h.setTooltip(t);}};g.prototype._getFacetRemoveIcon=function(o){var t=this,i=this._removeFacetIcons[o.getId()];if(!i){i=new c({src:I.getIconURI("sys-cancel"),tooltip:this._bundle.getText("FACETFILTER_REMOVE"),press:function(){i._bPressed=true;}});i.addDelegate({ontouchstart:function(){i._bTouchStarted=true;i._bPressed=false;},ontouchend:function(){t._displayRemoveIcon(false,o);i._bTouchStarted=false;q.sap.delayedCall(100,this,p);}},true);var p=function(){if(i._bPressed){o.removeSelections(true);o.setSelectedKeys();o.setProperty("active",false,true);}t._handlePopoverAfterClose();};i.setAssociation("list",o.getId(),true);i.addStyleClass("sapMFFLRemoveIcon");this._removeFacetIcons[o.getId()]=i;this.addAggregation("removeFacetIcons",i);this._displayRemoveIcon(false,o);}return i;};g.prototype._displayRemoveIcon=function(h,o){if(this.getShowPersonalization()){var i=this._removeFacetIcons[o.getId()];if(h){i.removeStyleClass("sapMFFLHiddenRemoveIcon");i.addStyleClass("sapMFFLVisibleRemoveIcon");}else{i.removeStyleClass("sapMFFLVisibleRemoveIcon");i.addStyleClass("sapMFFLHiddenRemoveIcon");}}};g.prototype._getFacetDialogNavContainer=function(){var n=new N({autoFocus:false});var o=this._createFacetPage();n.addPage(o);n.setInitialPage(o);var t=this;n.attachAfterNavigate(function(E){var h=E.getParameters()["to"];var i=E.getParameters()['from'];if(i===o){var j=(t._displayedList.getMode()===d.MultiSelect)?h.getContent(0)[1].getItems()[0]:h.getContent(0)[0].getItems()[0];if(j){j.focus();}}if(h===o){i.destroySubHeader();i.destroyContent();t._selectedFacetItem.invalidate();h.invalidate();q.sap.focus(t._selectedFacetItem);t._selectedFacetItem=null;}});return n;};g.prototype._createFacetPage=function(){var o=this._createFacetList();var h=new sap.m.SearchField({width:"100%",tooltip:this._bundle.getText("FACETFILTER_SEARCH"),liveChange:function(E){var i=o.getBinding("items");if(i){var j=new F("text",sap.ui.model.FilterOperator.Contains,E.getParameters()["newValue"]);i.filter([j]);}}});var p=new sap.m.Page({enableScrolling:true,title:this._bundle.getText("FACETFILTER_TITLE"),subHeader:new sap.m.Bar({contentMiddle:h}),content:[o]});return p;};g.prototype._createFilterItemsPage=function(){var t=this;var p=new sap.m.Page({showNavButton:true,enableScrolling:true,navButtonPress:function(E){var n=E.getSource().getParent();t._navFromFilterItemsPage(n);}});return p;};g.prototype._getFilterItemsPage=function(n){var o=n.getPages()[1];if(o){n.removePage(o);o.destroy();}var p=this._createFilterItemsPage();n.addPage(p);return p;};g.prototype._createFilterItemsSearchFieldBar=function(o){var t=this;var s=true;if(o.getDataType()!=e.String){s=false;}var S=new sap.m.SearchField({value:o._getSearchValue(),width:"100%",enabled:s,tooltip:this._bundle.getText("FACETFILTER_SEARCH"),search:function(E){t._displayedList._handleSearchEvent(E);}});if(this.getLiveSearch()){S.attachLiveChange(o._handleSearchEvent,o);}var h=new sap.m.Bar({contentMiddle:S});o.setAssociation("search",S);return h;};g.prototype._getFacetDialog=function(){var o=this.getAggregation("dialog");if(!o){var t=this;o=new sap.m.Dialog({showHeader:false,stretch:D.system.phone?true:false,afterClose:function(){t._addDelegateFlag=true;t._invalidateFlag=true;var n=this.getContent()[0];var h=n.getPages()[1];if(n.getCurrentPage()===h){var i=t._restoreListFromDisplayContainer(h);i._updateActiveState();i._fireListCloseEvent();i._search("");}this.destroyAggregation("content",true);t.invalidate();},beginButton:new sap.m.Button({text:this._bundle.getText("FACETFILTER_ACCEPT"),tooltip:this._bundle.getText("FACETFILTER_ACCEPT"),press:function(){t._closeDialog();}}),contentHeight:"500px"});o.addStyleClass("sapMFFDialog");o.onsapentermodifiers=function(E){if(E.shiftKey&&!E.ctrlKey&&!E.altKey){var n=this.getContent()[0];t._navFromFilterItemsPage(n);}};this.setAggregation("dialog",o,true);}return o;};g.prototype._closeDialog=function(){var o=this.getAggregation("dialog");if(o&&o.isOpen()){o.close();this._fireConfirmEvent();}};g.prototype._closePopover=function(){var p=this.getAggregation("popover");if(p&&p.isOpen()){p.close();}};g.prototype._createFacetList=function(){var o=new sap.m.List({mode:d.None,items:{path:"/items",template:new sap.m.StandardListItem({title:"{text}",counter:"{count}",type:L.Navigation,customData:[new sap.ui.core.CustomData({key:"index",value:"{index}"})]})}});var h=[];for(var i=0;i<this.getLists().length;i++){var j=this.getLists()[i];h.push({text:j.getTitle(),count:j.getAllCount(),index:i});}var m=new sap.ui.model.json.JSONModel({items:h});if(h.length>100){m.setSizeLimit(h.length);}var t=this;o.attachUpdateFinished(function(){for(var i=0;i<o.getItems().length;i++){var k=this.getItems()[i];k.detachPress(t._handleFacetListItemPress,t);k.attachPress(t._handleFacetListItemPress,t);}});o.setModel(m);return o;};g.prototype._createSelectAllCheckboxBar=function(o){if(!o.getMultiSelect()){return null;}var s=o.getActive()&&o.getItems().length>0&&Object.getOwnPropertyNames(o._oSelectedKeys).length===o.getItems().length;var h=new sap.m.CheckBox(o.getId()+"-selectAll",{text:this._bundle.getText("FACETFILTER_CHECKBOX_ALL"),tooltip:this._bundle.getText("FACETFILTER_CHECKBOX_ALL"),selected:s,select:function(E){h.setSelected(E.getParameter("selected"));o._handleSelectAllClick(E.getParameter("selected"));}});o.setAssociation("allcheckbox",h);var i=new sap.m.Bar();i.addEventDelegate({ontap:function(E){if(E.srcControl===this){o._handleSelectAllClick(h.getSelected());}}},i);i.addContentLeft(h);i.addStyleClass("sapMFFCheckbar");return i;};g.prototype._handleFacetListItemPress=function(E){this._navToFilterItemsPage(E.getSource());};g.prototype._navToFilterItemsPage=function(o){this._selectedFacetItem=o;var n=this.getAggregation("dialog").getContent()[0];var h=o.getCustomData();var i=h[0].getValue();var j=this.getLists()[i];this._listIndexAgg=this.indexOfAggregation("lists",j);if(this._listIndexAgg==i){var k=this._getFilterItemsPage(n);j.fireListOpen({});this._moveListToDisplayContainer(j,k);k.setSubHeader(this._createFilterItemsSearchFieldBar(j));var m=this._createSelectAllCheckboxBar(j);if(m){k.insertContent(m,0);}k.setTitle(j.getTitle());n.to(k);}};g.prototype._navFromFilterItemsPage=function(n){var o=n.getPages()[1];var h=this._restoreListFromDisplayContainer(o);h._updateActiveState();h._fireListCloseEvent();h._search("");this._selectedFacetItem.setCounter(h.getAllCount());n.backToTop();};g.prototype._moveListToDisplayContainer=function(o,h){this._listAggrIndex=this.indexOfAggregation("lists",o);M.prototype.removeAggregation.call(this,"lists",o,true);h.addAggregation("content",o,false);o.setAssociation("facetFilter",this,true);this._displayedList=o;};g.prototype._restoreListFromDisplayContainer=function(o){var h=o.removeAggregation("content",this._displayedList,true);this.insertAggregation("lists",h,this._listAggrIndex,h.getActive());this._listAggrIndex=-1;this._displayedList=null;return h;};g.prototype._getSequencedLists=function(){var m=-1;var s=[];var h=this.getLists();if(h.length>0){for(var i=0;i<h.length;i++){if(h[i].getActive()){if(h[i].getSequence()<-1){h[i].setSequence(-1);}else if(h[i].getSequence()>m){m=h[i].getSequence();}s.push(h[i]);}else if(!h[i].getRetainListSequence()){h[i].setSequence(-1);}}for(var j=0;j<s.length;j++){if(s[j].getSequence()<=-1){m+=1;s[j].setSequence(m);}}if(s.length>1){s.sort(function(k,n){return k.getSequence()-n.getSequence();});}}return s;};g.prototype._getSummaryBar=function(){var s=this.getAggregation("summaryBar");if(!s){var t=new sap.m.Text({maxLines:1});var h=this;s=new sap.m.Toolbar({content:[t],active:this.getType()===f.Light?true:false,design:T.Info,press:function(E){h.openFilterDialog();}});var i=sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("FACETFILTER_ARIA_FACET_FILTER"),j=new b({text:i}).toStatic().getId();this._aOwnedLabels.push(j);s._setRootAccessibilityRole("button");s._sInternalAriaLabelId=j;this.setAggregation("summaryBar",s);}return s;};g.prototype._createResetButton=function(){var t=this;var o=new sap.m.Button({type:B.Transparent,icon:I.getIconURI("undo"),tooltip:this._bundle.getText("FACETFILTER_RESET"),press:function(E){t._addDelegateFlag=true;t._invalidateFlag=true;t.fireReset();var h=t.getLists();for(var i=0;i<h.length;i++){h[i]._searchValue="";h[i]._applySearch();q.sap.focus(h[i].getItems()[0]);}t.invalidate();}});return o;};g.prototype._addOKButtonToPopover=function(p){var o=p.getFooter();if(!o){var t=this;var o=new sap.m.Button({text:this._bundle.getText("FACETFILTER_ACCEPT"),tooltip:this._bundle.getText("FACETFILTER_ACCEPT"),width:"100%",press:function(){t._closePopover();}});p.setFooter(o);}return o;};g.prototype._getSummaryText=function(){var h=", ";var S=" ";var s="";var k=true;var m=this.getLists();if(m.length>0){for(var i=0;i<m.length;i++){var o=m[i];if(o.getActive()){var n=this._getSelectedItemsText(o);var t="";for(var j=0;j<n.length;j++){t=t+n[j]+h;}if(t){t=t.substring(0,t.lastIndexOf(h)).trim();if(k){s=this._bundle.getText("FACETFILTER_INFOBAR_FILTERED_BY",[o.getTitle(),t]);k=false;}else{s=s+S+this._bundle.getText("FACETFILTER_INFOBAR_AND")+S+this._bundle.getText("FACETFILTER_INFOBAR_AFTER_AND",[o.getTitle(),t]);}}}}}if(!s){s=this._bundle.getText("FACETFILTER_INFOBAR_NO_FILTERS");}return s;};g.prototype._getSelectedItemsText=function(o){var t=o.getSelectedItems().map(function(v){return v.getText();});o._oSelectedKeys&&Object.getOwnPropertyNames(o._oSelectedKeys).forEach(function(v){t.indexOf(o._oSelectedKeys[v])===-1&&t.push(o._oSelectedKeys[v]);});return t;};g.prototype._addResetToSummary=function(s){if(s.getContent().length===1){s.addContent(new sap.m.ToolbarSpacer({width:""}));var o=this._createResetButton();s.addContent(o);o.addStyleClass("sapUiSizeCompact");o.addStyleClass("sapMFFRefresh");o.addStyleClass("sapMFFBtnHoverable");}};g.prototype._removeResetFromSummary=function(s){if(s.getContent().length===3){var S=s.removeAggregation("content",1);S.destroy();var o=s.removeAggregation("content",1);o.destroy();}};g.prototype._removeList=function(o){if(o){var h=this._buttons[o.getId()];if(h){this.removeAggregation("buttons",h);h.destroy();}var r=this._removeFacetIcons[o.getId()];if(r){this.removeAggregation("removeIcons",r);r.destroy();}delete this._buttons[o.getId()];delete this._removeFacetIcons[o.getId()];}};g.prototype._getScrollingArrow=function(n){var A=null;var p={src:"sap-icon://navigation-"+n+"-arrow"};if(n==="left"){A=this.getAggregation("arrowLeft");if(!A){p.id=this.getId()+"-arrowScrollLeft";A=I.createControlByURI(p);var h=["sapMPointer","sapMFFArrowScroll","sapMFFArrowScrollLeft"];for(var i=0;i<h.length;i++){A.addStyleClass(h[i]);A.setTooltip(this._bundle.getText("FACETFILTER_PREVIOUS"));}this.setAggregation("arrowLeft",A);}}else if(n==="right"){A=this.getAggregation("arrowRight");if(!A){p.id=this.getId()+"-arrowScrollRight";A=I.createControlByURI(p);var j=["sapMPointer","sapMFFArrowScroll","sapMFFArrowScrollRight"];for(var i=0;i<j.length;i++){A.addStyleClass(j[i]);A.setTooltip(this._bundle.getText("FACETFILTER_NEXT"));}this.setAggregation("arrowRight",A);}}else{q.sap.log.error("Scrolling arrow name "+n+" is not valid");}return A;};g.prototype._checkOverflow=function(){var o=this.getDomRef("head"),$=q(o),h=this.$(),s=false,S=false,i=false,j=null,k=null,m=null;if(o){j=o.scrollLeft;k=o.scrollWidth;m=o.clientWidth;if(k>m){if(k-m==1){k=m;}else{i=true;}}h.toggleClass("sapMFFScrolling",i);h.toggleClass("sapMFFNoScrolling",!i);this._lastScrolling=i;if(!this._bRtl){s=j>0;S=(k>m)&&(k>j+m);}else{S=$.scrollLeftRTL()>0;s=$.scrollRightRTL()>0;}if((S!=this._bPreviousScrollForward)||(s!=this._bPreviousScrollBack)){h.toggleClass("sapMFFNoScrollBack",!s);h.toggleClass("sapMFFNoScrollForward",!S);}}};g.prototype.onclick=function(E){var t=E.target.id;if(t){var i=this.getId(),o=E.target;E.preventDefault();if(t==i+"-arrowScrollLeft"){o.tabIndex=-1;o.focus();this._scroll(-g.SCROLL_STEP,500);}else if(t==i+"-arrowScrollRight"){o.tabIndex=-1;o.focus();this._scroll(g.SCROLL_STEP,500);}}};g.prototype._scroll=function(i,h){var o=this.getDomRef("head");var s=o.scrollLeft;if(!D.browser.internet_explorer&&this._bRtl){i=-i;}var S=s+i;q(o).stop(true,true).animate({scrollLeft:S},h);};g.prototype._enableTouchSupport=function(){var t=this;var h=function(k){var s=t.getType();if(s===f.Light){return;}k.preventDefault();if(t._iInertiaIntervalId){window.clearInterval(t._iInertiaIntervalId);}t.startScrollX=t.getDomRef("head").scrollLeft;t.startTouchX=k.touches[0].pageX;t._bTouchNotMoved=true;t._lastMoveTime=new Date().getTime();};var i=function(k){var s=t.getType();if(s===f.Light){return;}var m=k.touches[0].pageX-t.startTouchX;var o=t.getDomRef("head");var n=o.scrollLeft;var p=t.startScrollX-m;o.scrollLeft=p;t._bTouchNotMoved=false;var r=new Date().getTime()-t._lastMoveTime;t._lastMoveTime=new Date().getTime();if(r>0){t._velocity=(p-n)/r;}k.preventDefault();};var j=function(k){var s=t.getType();if(s===f.Light){return;}if(t._bTouchNotMoved===false){k.preventDefault();var o=t.getDomRef("head");var m=50;var n=Math.abs(t._velocity/10);t._iInertiaIntervalId=window.setInterval(function(){t._velocity=t._velocity*0.80;var p=t._velocity*m;o.scrollLeft=o.scrollLeft+p;if(Math.abs(t._velocity)<n){window.clearInterval(t._iInertiaIntervalId);t._iInertiaIntervalId=undefined;}},m);}else if(t._bTouchNotMoved===true){t.onclick(k);k.preventDefault();}t._bTouchNotMoved=undefined;t._lastMoveTime=undefined;};this.addEventDelegate({ontouchstart:h},this);this.addEventDelegate({ontouchend:j},this);this.addEventDelegate({ontouchmove:i},this);};return g;});