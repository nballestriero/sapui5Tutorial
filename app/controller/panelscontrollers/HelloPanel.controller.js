sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast"
], function (Controller, MessageToast) {
   "use strict";
   return Controller.extend("app.controller.panelscontrollers.HelloPanel", {
      onShowHello : function () {
         // read msg from i18n model
         var oBundle = this.getView().getModel("i18n").getResourceBundle();
         var sRecipient = this.getView().getModel().getProperty("/recipient/name");
         var sMsg = oBundle.getText("helloMsg", [sRecipient]);
         // show message
         MessageToast.show(sMsg);
      },
      onOpenDialog : function () {
	var oView = this.getView();
	var oDialog = oView.byId("helloDialog");
	// create dialog lazily
	if (!oDialog) {
		// create dialog via fragment factory be carefull about the third parameter this
		oDialog = sap.ui.xmlfragment(oView.getId(), "app.view.fragments.HelloDialog",this);
		oView.addDependent(oDialog);
	}
	oDialog.open();
     },
     onCloseDialog : function () {
		this.getView().byId("helloDialog").close();
     }
   });
});
