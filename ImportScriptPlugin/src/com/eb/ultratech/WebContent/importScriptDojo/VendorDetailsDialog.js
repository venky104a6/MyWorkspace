define(["dojo/_base/declare",
		"dijit/Dialog",
		"dijit/form/ComboBox",
		"dojo/store/Memory",
		"dojo/on",
		"dojo/_base/lang",
		"dojo/_base/array",
		"ecm/model/Request",
		"dijit/Editor",
		"dijit/_editor/plugins/AlwaysShowToolbar",
		"dojo/data/ItemFileReadStore",
		"dijit/form/TextBox",
		"dijit/_WidgetBase",
		"dijit/_TemplatedMixin",
		"dijit/_WidgetsInTemplateMixin",
		"dojox/layout/TableContainer",
		"dojo/text!./templates/VendorDetailsDialog.html"
],function(declare,Dialog,ComboBox,Memory,on,lang,array,Request,Editor,AlwaysShowToolbar,ItemFileReadStore,TextBox,_WidgetBase,_TemplatedMixin,_WidgetsInTemplateMixin,TableContainer,template){
	
return declare("custom.widget.dialog.VendorDetailsDialog",[Dialog,_WidgetBase,_TemplatedMixin,_WidgetsInTemplateMixin],{
		
		templateString: template,
		widgetsInTemplate: true,
		title:'Vendor Details',
		postCreate:function(){
			this.inherited(arguments);
		},
		onCancel:function(){
			this.hide();
		},
		startup:function(){
			
		},
		cancel:function(){
			this.hide();
		},
	});
});