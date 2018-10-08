sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/Device",
	'sap/m/Button',
	'sap/ui/core/Fragment'
], function(Controller, MessageToast, Device, Button, Fragment) {
	"use strict";

	return Controller.extend("sap.ui.demo.controller.MainPage", {
		onInit: function() {
			this._initializeI18NModel();
			this._attachRouteMatchedEvents();
		},
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		_initializeI18NModel: function() {
			this._oI18nModel = this.getOwnerComponent().getModel("i18n");
			this.getView().setModel(this._oI18nModel, "i18n");
		},

		_attachRouteMatchedEvents: function() {
			this.getRouter().attachRoutePatternMatched(function(oEvent) {
				var sPattern = oEvent.getParameter("name");
				var sObjectId = oEvent.getParameter("arguments").objectId;
				switch (sPattern) {
					case "MainPage":
						this._createMasterRouteMatched(this);
						break;
					case "DetailPage":
						this._createDetailRouteMatched(sObjectId);
						break;
					default:
						break;
				}
			}, this);
		},
		_createMasterRouteMatched: function(oController) {
			var oModel=oController.getView().getModel();
			oModel.attachRequestCompleted(function(){
			var oList=oController.getView().byId("list").getItems()[0];
			oController._showDetail(oList);
			});
		},
		_createDetailRouteMatched: function(sObjectId) {
			var sObjectPath = this.getView().getModel().getContext('/Data/' + sObjectId);
			this._bindView(sObjectPath);
		},
		_bindView: function(sObjectPath) {
			this.getView().setBindingContext(sObjectPath);
		},
		onSelectionChange: function(oEvent) {
			this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
		},
		_showDetail: function(oItem) {
			var context = oItem.getBindingContext();
			var path = context.sPath;
			var start = path.lastIndexOf('/') + 1;
			var objectId = path.substring(start, path.length);
			this.getRouter().navTo("DetailPage", {
				objectId: objectId
			}, true);
		}

	});
});