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
		"dojo/text!./templates/PaymentProcessDailog.html"
],function(declare,Dialog,ComboBox,Memory,on,lang,array,Request,Editor,AlwaysShowToolbar,ItemFileReadStore,TextBox,_WidgetBase,_TemplatedMixin,_WidgetsInTemplateMixin,template){
	
return declare("custom.widget.dialog.PaymentProcessDailog",[Dialog,_WidgetBase,_TemplatedMixin,_WidgetsInTemplateMixin],{
		
		templateString: template,
		widgetsInTemplate: true,
		title:'Payment Posting - F110',
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