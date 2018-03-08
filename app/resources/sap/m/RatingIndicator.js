/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/ui/core/theming/Parameters','jquery.sap.keycodes'],function(q,l,C,P){"use strict";var R=l.RatingIndicatorVisualMode;var a=C.extend("sap.m.RatingIndicator",{metadata:{interfaces:["sap.ui.core.IFormContent"],library:"sap.m",properties:{enabled:{type:"boolean",group:"Behavior",defaultValue:true},maxValue:{type:"int",group:"Behavior",defaultValue:5},value:{type:"float",group:"Behavior",defaultValue:0,bindable:"bindable"},iconSize:{type:"sap.ui.core.CSSSize",group:"Behavior",defaultValue:null},iconSelected:{type:"sap.ui.core.URI",group:"Behavior",defaultValue:null},iconUnselected:{type:"sap.ui.core.URI",group:"Behavior",defaultValue:null},iconHovered:{type:"sap.ui.core.URI",group:"Behavior",defaultValue:null},visualMode:{type:"sap.m.RatingIndicatorVisualMode",group:"Behavior",defaultValue:R.Half},displayOnly:{type:"boolean",group:"Behavior",defaultValue:false},editable:{type:"boolean",group:"Behavior",defaultValue:true}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{change:{parameters:{value:{type:"int"}}},liveChange:{parameters:{value:{type:"float"}}}},designTime:true}});a.prototype.init=function(){this.allowTextSelection(false);this._iIconCounter=0;this._fHoverValue=0;this._oResourceBundle=sap.ui.getCore().getLibraryResourceBundle('sap.m');};a.prototype.setValue=function(v){v=this.validateProperty("value",v);if(v<0){return this;}if(isNaN(v)){q.sap.log.warning('Ignored new rating value "'+v+'" because it is NAN');}else if(this.$().length&&(v>this.getMaxValue())){q.sap.log.warning('Ignored new rating value "'+v+'" because it is out  of range (0-'+this.getMaxValue()+')');}else{v=this._roundValueToVisualMode(v);this.setProperty("value",v,true);this._fHoverValue=v;if(this.$().length){this._updateUI(v);}}return this;};a.prototype.setIconSize=function(i){if(this.$().length){this._iPxIconSize=this._toPx(i)||16;}this.setProperty("iconSize",i,false);return this;};a.prototype.onThemeChanged=function(e){this.invalidate();};a.prototype.onBeforeRendering=function(){var v=this.getValue(),m=this.getMaxValue(),i;if(v>m){this.setValue(m);q.sap.log.warning("Set value to maxValue because value is > maxValue ("+v+" > "+m+").");}else if(v<0){this.setValue(0);q.sap.log.warning("Set value to 0 because value is < 0 ("+v+" < 0).");}if(this.getIconSize()){this._iPxIconSize=this._toPx(this.getIconSize());i="sapUiRIIconPadding"+this._getIconSizeLabel(this._iPxIconSize);this._iPxPaddingSize=this._toPx(P.get(i));}else{if(this.getDisplayOnly()){this._iPxIconSize=this._toPx(P.get("sapUiRIIconSizeDisplayOnly"));this._iPxPaddingSize=this._toPx(P.get("sapUiRIIconPaddingDisplayOnly"));}else{var d=this._getDensityMode();this._iPxIconSize=this._toPx(P.get("sapUiRIIconSize"+d));this._iPxPaddingSize=this._toPx(P.get("sapUiRIIconPadding"+d));}}};a.prototype.onAfterRendering=function(){this._updateAriaValues();};a.prototype.exit=function(){this._iIconCounter=null;this._fStartValue=null;this._iPxIconSize=null;this._iPxPaddingSize=null;this._fHoverValue=null;this._oResourceBundle=null;};a.prototype._getDensityMode=function(){var d=[{name:"Cozy",style:"sapUiSizeCozy"},{name:"Compact",style:"sapUiSizeCompact"},{name:"Condensed",style:"sapUiSizeCondensed"}],D,s,i;for(i in d){D=d[i].style;if(q("html").hasClass(D)||q("."+D).length>0){s=d[i].name;}}return s||d[0].name;};a.prototype._getIconSizeLabel=function(p){switch(true){case(p>=32):return"L";case(this._iPxIconSize>=22):return"M";case(this._iPxIconSize>=16):return"S";case(this._iPxIconSize>=12):return"XS";default:return"M";}};a.prototype._toPx=function(c){var s=Math.round(c),b;if(isNaN(s)){if(RegExp("^(auto|0)$|^[+-]?[0-9].?([0-9]+)?(px|em|rem|ex|%|in|cm|mm|pt|pc)$").test(c)){b=q('<div style="display: none; width: '+c+'; margin: 0; padding:0; height: auto; line-height: 1; font-size: 1; border:0; overflow: hidden">&nbsp;</div>').appendTo(sap.ui.getCore().getStaticAreaRef());s=b.width();b.remove();}else{return false;}}return Math.round(s);};a.prototype._updateUI=function(v,h){var s=this.$("sel"),u=this.$("unsel-wrapper"),H=this.$("hov"),i=this._iPxIconSize,I=this._iPxPaddingSize,b="px",S=this.getMaxValue(),c=v*i+(Math.round(v)-1)*I,w=S*(i+I)-I;this._fHoverValue=v;if(c<0){c=0;}this._updateAriaValues(v);u.width((w-c)+b);if(h){H.width(c+b);s.hide();H.show();}else{s.width(c+b);H.hide();s.show();}q.sap.log.debug("Updated rating UI with value "+v+" and hover mode "+h);};a.prototype._updateAriaValues=function(n){var $=this.$();var v;if(n===undefined){v=this.getValue();}else{v=n;}var m=this.getMaxValue();$.attr("aria-valuenow",v);$.attr("aria-valuemax",m);var V=this._oResourceBundle.getText("RATING_VALUEARIATEXT",[v,m]);$.attr("aria-valuetext",V);};a.prototype._calculateSelectedValue=function(e){var s=-1.0,p=0.0,c=this.$(),f=(c.innerWidth()-c.width())/2,E,r=sap.ui.getCore().getConfiguration().getRTL();if(e.targetTouches){E=e.targetTouches[0];}else{E=e;}if(!E||!E.pageX){E=e;if((!E||!E.pageX)&&e.changedTouches){E=e.changedTouches[0];}}if(!E.pageX){return parseFloat(s);}if(E.pageX<c.offset().left){s=0;}else if((E.pageX-c.offset().left)>c.innerWidth()-f){s=this.getMaxValue();}else{p=(E.pageX-c.offset().left-f)/c.width();s=p*this.getMaxValue();}if(r){s=this.getMaxValue()-s;}return this._roundValueToVisualMode(s,true);};a.prototype._roundValueToVisualMode=function(v,i){if(i){if(v<0.25){v=0;}else if(v<this.getMaxValue()-0.25){v+=0.25;}v=Math.round(v);}else{if(this.getVisualMode()===R.Full){v=Math.round(v);}else if(this.getVisualMode()===R.Half){v=Math.round(v*2)/2;}}return parseFloat(v);};a.prototype._getIncreasedValue=function(){var m=this.getMaxValue(),v=this.getValue()+this._getValueChangeStep();if(v>m){v=m;}return v;};a.prototype._getDecreasedValue=function(){var v=this.getValue()-this._getValueChangeStep();if(v<0){v=0;}return v;};a.prototype._getValueChangeStep=function(){var v=this.getVisualMode(),s;switch(v){case R.Full:s=1;break;case R.Half:if(this.getValue()%1===0.5){s=0.5;}else{s=1;}break;default:q.sap.log.warning("VisualMode not supported",v);}return s;};a.prototype.ontouchstart=function(e){if(e.which==2||e.which==3||!this.getEnabled()||this.getDisplayOnly()||!this.getEditable()){return;}e.setMarked();if(!this._touchEndProxy){this._touchEndProxy=q.proxy(this._ontouchend,this);}if(!this._touchMoveProxy){this._touchMoveProxy=q.proxy(this._ontouchmove,this);}q(document).on("touchend.sapMRI touchcancel.sapMRI mouseup.sapMRI",this._touchEndProxy);q(document).on("touchmove.sapMRI mousemove.sapMRI",this._touchMoveProxy);this._fStartValue=this.getValue();var v=this._calculateSelectedValue(e);if(v>=0&&v<=this.getMaxValue()){this._updateUI(v,true);if(this._fStartValue!==v){this.fireLiveChange({value:v});}}};a.prototype._ontouchmove=function(e){if(e.isMarked("delayedMouseEvent")){return;}e.preventDefault();if(this.getEnabled()){var v=this._calculateSelectedValue(e);if(v>=0&&v<=this.getMaxValue()){this._updateUI(v,true);if(this._fStartValue!==v){this.fireLiveChange({value:v});}}}};a.prototype._ontouchend=function(e){if(e.isMarked("delayedMouseEvent")){return;}if(this.getEnabled()){var v=this._calculateSelectedValue(e);if(this.getValue()===1&&v===1){v=0;}this.setProperty("value",v,true);this._updateUI(v,false);if(this._fStartValue!==v){this.fireLiveChange({value:v});this.fireChange({value:v});}q(document).off("touchend.sapMRI touchcancel.sapMRI mouseup.sapMRI",this._touchEndProxy);q(document).off("touchmove.sapMRI mousemove.sapMRI",this._touchMoveProxy);delete this._fStartValue;}};a.prototype.ontouchcancel=a.prototype.ontouchend;a.prototype.onsapincrease=function(e){var v=this._getIncreasedValue();this._handleKeyboardValueChange(e,v);};a.prototype.onsapdecrease=function(e){var v=this._getDecreasedValue();this._handleKeyboardValueChange(e,v);};a.prototype.onsaphome=function(e){var v=0;this._handleKeyboardValueChange(e,v);};a.prototype.onsapend=function(e){var v=this.getMaxValue();this._handleKeyboardValueChange(e,v);};a.prototype.onsapselect=function(e){var v;if(this.getValue()===this.getMaxValue()){v=0;}else{v=this._getIncreasedValue();}this._handleKeyboardValueChange(e,v);};a.prototype.onkeyup=function(e){var m=this.getMaxValue();if(!this.getEnabled()||this.getDisplayOnly()||!this.getEditable()){return false;}switch(e.which){case q.sap.KeyCodes.DIGIT_0:case q.sap.KeyCodes.NUMPAD_0:this.setValue(0);break;case q.sap.KeyCodes.DIGIT_1:case q.sap.KeyCodes.NUMPAD_1:this.setValue(1);break;case q.sap.KeyCodes.DIGIT_2:case q.sap.KeyCodes.NUMPAD_2:this.setValue(Math.min(2,m));break;case q.sap.KeyCodes.DIGIT_3:case q.sap.KeyCodes.NUMPAD_3:this.setValue(Math.min(3,m));break;case q.sap.KeyCodes.DIGIT_4:case q.sap.KeyCodes.NUMPAD_4:this.setValue(Math.min(4,m));break;case q.sap.KeyCodes.DIGIT_5:case q.sap.KeyCodes.NUMPAD_5:this.setValue(Math.min(5,m));break;case q.sap.KeyCodes.DIGIT_6:case q.sap.KeyCodes.NUMPAD_6:this.setValue(Math.min(6,m));break;case q.sap.KeyCodes.DIGIT_7:case q.sap.KeyCodes.NUMPAD_7:this.setValue(Math.min(7,m));break;case q.sap.KeyCodes.DIGIT_8:case q.sap.KeyCodes.NUMPAD_8:this.setValue(Math.min(8,m));break;case q.sap.KeyCodes.DIGIT_9:case q.sap.KeyCodes.NUMPAD_9:this.setValue(Math.min(9,m));break;}};a.prototype._handleKeyboardValueChange=function(e,v){if(!this.getEnabled()||this.getDisplayOnly()||!this.getEditable()){return;}if(v!==this.getValue()){this.setValue(v);this.fireLiveChange({value:v});this.fireChange({value:v});}if(e){e.preventDefault();e.stopPropagation();}};a.prototype.getAccessibilityInfo=function(){var b=sap.ui.getCore().getLibraryResourceBundle("sap.m");return{role:"slider",type:b.getText("ACC_CTR_TYPE_RATING"),description:b.getText("ACC_CTR_STATE_RATING",[this.getValue(),this.getMaxValue()]),focusable:this.getEnabled()&&!this.getDisplayOnly(),enabled:this.getEnabled(),editable:this.getEditable()};};return a;});
