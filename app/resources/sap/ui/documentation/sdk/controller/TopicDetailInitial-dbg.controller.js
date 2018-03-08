/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/*global location */
sap.ui.define([
		"sap/ui/documentation/sdk/controller/BaseController",
		"sap/ui/Device"
	], function (BaseController, Device) {
		"use strict";

		return BaseController.extend("sap.ui.documentation.sdk.controller.TopicDetailInitial", {

			/**
			 * Called when the controller is instantiated.
			 * @public
			 */
			onInit: function () {
				BaseController.prototype.onInit.call(this);

				// manually call the handler once at startup as device API won't do this for us
				this._onOrientationChange({
					landscape: Device.orientation.landscape
				});
			},

			/**
			 * Called before the view is rendered.
			 * @public
			 */
			onBeforeRendering: function() {
				this._deregisterOrientationChange();
			},

			/**
			 * Called after the view is rendered.
			 * @public
			 */
			onAfterRendering: function() {
				this._registerOrientationChange();
			},

			/**
			 * Called when the controller is destroyed.
			 * @public
			 */
			onExit: function() {
				this._deregisterOrientationChange();
			},

			/**
			 * Opens the developer's guide in a pdf format and in a new tab.
			 * @public
			 */
			onDownloadButtonPress: function () {
				window.open(this._determineFileLocation(), "_blank");
			},

			/**
			 * Determines the downloaded PDF's file location.
			 * @returns {string} The location of the PDF file
			 * @private
			 */
			_determineFileLocation: function () {
				var oVersionModel = this.getModel("versionData"),
					bIsDevVersion = oVersionModel.getProperty('/isDevVersion'),
					bIsOpenUI5 = oVersionModel.getProperty('/isOpenUI5');

				if (bIsOpenUI5) {
					return 'https://help.sap.com/OpenUI5_PDF/OpenUI5.pdf';
				}

				return bIsDevVersion ? 'https://help.sap.com/DRAFT/SAPUI5_Internal_PDF/SAPUI5_Internal.pdf' : 'https://help.sap.com/SAPUI5_PDF/SAPUI5.pdf';
			}
		});
	}
);