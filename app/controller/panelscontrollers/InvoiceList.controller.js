sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"app/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, JSONModel,Formatter,Filter, FilterOperator) {
	"use strict";

	return Controller.extend("app.controller.panelscontrollers.InvoiceList", {
	        formatter: Formatter,
		// The Sorter, with a custom compare function, and the Grouper
		oSorter : null,
		groups: null,
		
		onInit : function () {
			// add currency
			var oViewModel = new JSONModel({
				currency: "EUR"
			});
			this.getView().setModel(oViewModel, "view");

			var groups = new JSONModel({
				elements: []
			});
			this.getView().setModel(groups, "groups");
		},
		onAfterRendering: function(){
			var list = this.getView().byId("invoiceList");
			console.log(list);
			
			this.oSorter = new sap.ui.model.Sorter("ProductName", false, this.fGrouper);
        		this.oSorter.fnCompare = function(a, b) {
				console.log(a);
				console.log(b);
				//console.log(getGroupFunction(a));
            			// Determine the group and group order
            			var agroup = "ACME";
            			var bgroup = "ACME";
            			// Return sort result, by group ...
            			if (agroup < bgroup) return -1;
            			if (agroup > bgroup) return  1;
            			// ... and then within group (when relevant)
            			if (a < b) return -1;
            			if (a == b) return 0;
            			if (a > b) return  1;
        		};
			var binding = null;
			console.log(list.getBinding("items"));
			binding = list.getBinding("items");
  			//binding.sort(this.oSorter);
		
		},
        
		onFilterInvoices : function (oEvent) {

			// build filter array
			//var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				//aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
				//aFilter.push(new Filter("Status", FilterOperator.Contains, sQuery));
				var aFilter = new Filter({
    						filters: [
      							new Filter("ProductName", FilterOperator.Contains, sQuery),
     						        new Filter("ShipperName", FilterOperator.Contains, sQuery)
    						],
    						and: false
  					   });
			}
			
			// filter binding
			var oList = this.byId("invoiceList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},
		// Grouper function to be supplied as 3rd parm to Sorter
        	fGrouper : function(oContext) {
            		var v = oContext.getProperty("ShipperName");
			return {"key": v, "text":v };
        	},
		getGroupHeader: function(oGroup){
    			return new sap.m.GroupHeaderListItem( {
        			title: oGroup.key,
        			upperCase: true
    			});

		},


	});
});

