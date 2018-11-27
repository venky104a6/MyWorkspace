require(["dojo/_base/declare", "dojo/_base/lang",
    "ecm/widget/dialog/StatusDialog", "ecm/model/Message", "ecm/widget/dialog/ErrorDialog", "ecm/model/Request",
    "dojo/io-query", "importScriptDojo/PaymentProcessDailog", "ecm/widget/dialog/StatusDialog","dojo/aspect","ecm/model/Desktop","dojo/store/Memory",
    "importScriptDojo/VendorDetailsDialog","dojox/layout/TableContainer","dijit/form/TextBox","dijit/form/FilteringSelect"
], function(declare, lang,
    StatusDialog, Message, ErrorDialog, Request, ioQuery, PaymentProcessDailog, StatusDialog,aspect,Desktop,Memory,VendorDetailsDialog,TableContainer,TextBox,FilteringSelect) {
    /**
     * Use this function to add any global JavaScript methods your plug-in requires.
     */
	
	
    console.log("Project is externallise");
    lang.setObject("RunPaymentProcess", function(payload, currentObject) {
        //postButton
        try {
            var payment_process_Dialog = new PaymentProcessDailog();
            console.log(payment_process_Dialog);
            console.log("processDialog is displaying");
            console.log(currentObject);
            
            payment_process_Dialog.show();
            var processedItems=[];
            var dispatchAllWorkItems=function(currentWobItems){
            	var wobNums=[];
            	dojo.forEach(currentWobItems,function(currentWob,index){
            		wobNums.push(currentWob.id);
            		console.log("constructing wobNums array");
            		console.log(wobNums);
            		if(index == currentWobItems.length-1){
            			
            		}
            	});
            };
            var payment_post_service = function() {
                console.log("user name and password");
                console.log(payment_process_Dialog.userNameText.value);
                console.log(payment_process_Dialog.passwordText.value);
                if (!payment_process_Dialog.userNameText.value && !payment_process_Dialog.passwordText.value) {
                    payment_process_Dialog._messageArea.innerHTML = "Provide valid user name or password";
                } else {
                    console.log(payload);
                    console.log(currentObject);
                    var workItems = [];
                    console.log(payload.WorkItem);
                    //console.log(payload.WorkItem.length);
                    if (payload.WorkItem.length != undefined) {
                        //console.log("Length is defined");
                        //console.log(payload.WorkItem.length);
                        workItems = workItems.concat(payload.WorkItem);
                        //console.log(workItems);
                    } else {
                        workItems.push(payload.WorkItem);
                    }
                    console.log(workItems);
                    
                    var requestProerties = 
                     {
                        "iParam1": '',
                        "iParam2": payload.Solution.prefix === 'R2R'?'R2R':'',
                        "iParam3": "",
                        "iParam4": "",
                        "iParam5": "",
                        "UserId": payment_process_Dialog.userNameText.value,
                        "Password": payment_process_Dialog.passwordText.value
                    };
                    
                    var requestParams = [];
                    var paymentRunProcess=function(currentWorkItem,index, currentWobs){
                    	//apayment_status.show();
                        console.log(currentWorkItem._fullAttrsRetrieved);
                        var attributes = currentWorkItem.attributes;
                        var currentRow = {
                                CompanyCode: attributes.UKSC_CompanyCode,
                                CaseId: attributes.UKSC_InWardID,
                                Vendor: attributes.UKSC_Vendorcode,
                                FiDoc: "",
                                Amount: attributes.UKSC_InvoiceAmount,
                                FiscalYear: attributes.UKSC_FiscalYear,
                                PmntMethod: "",
                                VendorBankAcc: attributes.UKSC_PBankAccountNumber == undefined?"":attributes.UKSC_PBankAccountNumber,
                                HouseBank: attributes.UKSC_PHouseBank== undefined?"":attributes.UKSC_PHouseBank,
                                HouseBankId: attributes.UKSC_PHouseBankId== undefined?"":attributes.UKSC_PHouseBankId,
                                RunDate: "",
                                Param1: "",
                                Param2: "",
                                Param3: "",
                                Param4: attributes.UKSC_PPaymentMethod == undefined?"":attributes.UKSC_PPaymentMethod,
                                Param5: "",
                                IParam1: "",
                                "WobNumber":currentWorkItem.id
                            };
                            requestParams.push(currentRow);
                           
                       
                      //  statusText += "<strong>" + workItems.length + " <\strong> <br> Completed : <strong>" + (index + 1) + "<\strong>";
                        //payment_status.contentNode.innerHTML = statusText;
                    };
                    dojo.forEach(workItems, lang.hitch(this, function(currentWorkItem, index) {
                        console.log("attributes are retrieving");
                        console.log(currentWorkItem._fullAttrsRetrieved);
                       // if (!currentWorkItem._fullAttrsRetrieved) {
                        
                        var currentWobs=[];
                            currentWorkItem.retrieveAttributes(function(currentWob) {
                            	currentWobs.push(currentWob);
                            	//requestParams.length
                                paymentRunProcess(currentWorkItem,index,currentWobs);
                            	 console.log(index +"    "+workItems.length+"   "+requestParams.length);
                                 if (requestParams.length == workItems.length) {
                                     console.log("Payment Request Parameters");
                                     console.log(requestParams);
                                     console.log("Send here the above report to F110 Payment Service");
                                     var serviceParams={};
                                     serviceParams.serviceHeader=JSON.stringify(requestProerties);
                                     serviceParams.rows=JSON.stringify(requestParams);
                                     console.log("requesting parameters");
                                     console.log(serviceParams);
                                     Request.invokePluginService("UltraTechPlugin","DispatchWorkItems",{
                                     	requestParams :serviceParams,
                                     	requestCompleteCallback:lang.hitch(this,function(response){
                                     		     console.log("Requet completed");
                                     		     console.log(response);
                                     		     currentObject.onBroadcastEvent("icm.Refresh", {});
                                     		     payment_process_Dialog.hide();
                                     	})
                                     });
                                 }
                            });
                            
                       // }
//                        else{
//                        	paymentRunProcess(currentWorkItem,index,currentWob);
//                        	console.log("workitem attribiutes are already retrieved");
//                        }
                    }));
                }
            };
            dojo.connect(payment_process_Dialog.postButton, "onClick", function() {
                payment_post_service();
            });
           
            /*currentWorkItem.retrieveAttributes(function (currentWob) {
    	          var currentWIE = currentWob.createEditable();
    			  currentWIE.lockStep(function(currentWIE) {
    			  //propEditable = currentWIE.getProperty("F_CaseTask", "SFG_TaskTeam");
    			  //propEditable.setValue(Team);
    			  //propEditable = currentWIE.getProperty("F_CaseTask", "SFG_TaskOwner");
    			  //propEditable.setValue(User);
    			  //currentWIE.setSelectedResponse("Complete");
    			  currentWIE.completeStep(function(){
    			   processedItems.push(idx);
    			   if (processedItems.length == selectedWorkItems.length) {
    			    self.onBroadcastEvent("icm.Refresh", {});
    			   }
    			 
    			  });*/
        } catch (e) {
            console.log("Error in payment run" + e);
        }
    });
    lang.setObject("RenderVenodrBankDetails", function(payload, sriptAdapter, collectionController, vndr, fetchvenodrController) {
    	try{
	        console.log("Rendering Vendor bank details");
	        var vendorCode = vndr.get("value");
	        console.log(collectionController);
	        var companyCode = collectionController.getPropertyController("UKSC_CompanyCode").get("value");
	        //var plant = collectionController.getPropertyController("UKSC_Plant").get("value");
	        var plant = collectionController.getPropertyController("UKSC_PurchaseOrganization").get("value");
	        var bankAccntCtrl = collectionController.getPropertyController("UKSC_PBankAccountNumber");
	        //var bankBranchCtrl = collectionController.getPropertyController("UKSC_PBankBranch");
	        //var bankCityCtrl = collectionController.getPropertyController("UKSC_PBankCity");
	        var bankKeyCtrl = collectionController.getPropertyController("UKSC_PBankKey");
	        //var bankNameCtrl = collectionController.getPropertyController("UKSC_PBankName");
	        var paymentMethodCtrl = collectionController.getPropertyController("UKSC_PPaymentMethod");
	        //var paymentMethodDescCtrl = collectionController.getPropertyController("UKSC_PPaymentMethodDesc");
	        var houseBankCtrl = collectionController.getPropertyController("UKSC_PHouseBank");
	        var husebankIdCtrl = collectionController.getPropertyController("UKSC_PHouseBankId");
	        var vendorNameCtrl=collectionController.getPropertyController("UKSC_VendorName");
	        var vendorGSTINCtrl=collectionController.getPropertyController("UKSC_VendorGSTIN");
	        var panNumber=collectionController.getPropertyController("UKSC_VendorAccountNumber");
	        var businessLine= collectionController.getPropertyController("UKSC_BusinessPlace").get("value");
	        var actionUser=collectionController.getPropertyController("UKSC_ActionUser");
	        var actionRole=collectionController.getPropertyController("UKSC_ActionRole");
	        var action=collectionController.getPropertyController("UKSC_Actions");
	        var actionDate=collectionController.getPropertyController("UKSC_ActionDate");
	        var singleormultiple=collectionController.getPropertyController("UKSC_F48HeaderText");
	        
	        var vendorDetailsDialog=new VendorDetailsDialog();
	        vendorDetailsDialog._onKey = function() { };
	        dojo.connect(vendorDetailsDialog.ok_button, "onClick", function() {
	        	var statusDialog=new StatusDialog();
	        	statusDialog.show();
	        	 collectionController.beginChangeSet();
	        	bankAccntCtrl.set("value", vendorDetailsDialog.vendorbankAcs.value);
	        	bankKeyCtrl.set("value", vendorDetailsDialog.bankkeys.value);
	        	paymentMethodCtrl.set("value", vendorDetailsDialog.paymentMethods.value);
	        	houseBankCtrl.set("value", vendorDetailsDialog.houseBanks.value);
	        	husebankIdCtrl.set("value", vendorDetailsDialog.houseBankIds.value);
	        	vendorNameCtrl.set("value", vendorDetailsDialog.houseBankIds.value);
	        	vendorNameCtrl.set("value", vendorDetailsDialog.vendorN.value);
	        	vendorGSTINCtrl.set("value",vendorDetailsDialog.vendorgstin.value);
           	    panNumber.set("value",vendorDetailsDialog.vendorPan.value);
           	    
           	    
           	    
           	    bankAccntCtrl.set("readOnly", true);
	        	bankKeyCtrl.set("readOnly", true);
	        	paymentMethodCtrl.set("readOnly", true);
	        	houseBankCtrl.set("readOnly", true);
	        	husebankIdCtrl.set("readOnly", true);
	        	vendorNameCtrl.set("readOnly", true);
	        	vendorNameCtrl.set("readOnly", true);
	        	vendorGSTINCtrl.set("readOnly", true);
        	    panNumber.set("readOnly", true);
	        	collectionController.endChangeSet();
	        	console.log("vendorDetailsDialog");
	        	fetchvenodrController.set("value",false);
	        	console.log(vendorDetailsDialog);
	        	
	        	vendorDetailsDialog.destroy();
	        	statusDialog.hide();
            });
	        if (vendorCode) {
	            var parameters = {
	                    businessValue: businessLine,
	                    plantValue: plant,
	                    methodName: "purchaseOrganisation"
	                };
	            Request.invokePluginService("MainPlugin","MailRoomService",{
	            	requestParams :parameters,
	            	requestCompleteCallback:lang.hitch(this,function(response){
	            		//plant = response.business.purchaseOrgId;
	            		 var requestparams = {
	            	                ICompanyCode: companyCode,
	            	                IParam1: "",
	            	                IParam2: "",
	            	                IParam3: "",
	            	                IParam4: "",
	            	                IParam5: "",
	            	                IPlant: plant,
	            	                IVendor: vendorCode
	            	            };
	            		 Request.invokePluginService("UltraTechPlugin", "GetVendorBankDetails", {
	                         requestParams: requestparams,
	                         requestCompleteCallback: lang.hitch(this, function(GVBDresponse) {
	                             console.log(GVBDresponse.vendorDetails);
	                             
	                            
	                             /*bankAccntCtrl.set("choices",["1","2"]);
	                             bankKeyCtrl.set("choices", ["1","2"]);
	                             paymentMethodCtrl.set("choices",["1","2"]);
	                             houseBankCtrl.set("choices", ["1","2"]);
	                             husebankIdCtrl.set("choices", ["1","2"]);*/
	                             
	                             var vendorDetails = GVBDresponse.vendorDetails;
	                             collectionController.beginChangeSet();
	                            if(vendorDetails && vendorDetails.UKSC_PBankAccountNumber && vendorDetails.UKSC_PBankAccountNumber !=undefined){
	                             /*bankAccntCtrl.set("choices", vendorDetails.UKSC_PBankAccountNumber);
	                             bankKeyCtrl.set("choices", vendorDetails.UKSC_PBankKey);
	                             paymentMethodCtrl.set("choices",vendorDetails.UKSC_PPaymentMethodDesc);
	                             houseBankCtrl.set("choices", vendorDetails.UKSC_PHouseBank);
	                             husebankIdCtrl.set("choices", vendorDetails.UKSC_PHouseBankId);*/
	                            
	                            
	                             if(vendorDetails.UKSC_PBankAccountNumber[0] != undefined){
	                            	/*if(vendorDetails.UKSC_PBankAccountNumber.length > 0){
	                            	    bankAccntCtrl.set("value", vendorDetails.UKSC_PBankAccountNumber[0].value);
	                            		bankAccntCtrl.set("choices", vendorDetails.UKSC_PBankAccountNumber);
	                            	}*/
	                            	
	                            	
	                            	 var bankAccounts = new Memory({
		                                 data: vendorDetails.UKSC_PBankAccountNumber
		                             });
	                            	 vendorDetailsDialog.vendorbankAcs.set("store",bankAccounts);
	                            	 vendorDetailsDialog.vendorbankAcs.set("value",vendorDetails.UKSC_PBankAccountNumber[0].name);
	                            	
	                             }
	                             console.log(bankAccntCtrl.get("value"));
	                             if(vendorDetails.UKSC_PBankKey[0] != undefined){
	                            	 /*if(vendorDetails.UKSC_PBankKey.length > 0){
	                            		bankKeyCtrl.set("value", vendorDetails.UKSC_PBankKey[0].value);
	                            		 bankKeyCtrl.set("choices", vendorDetails.UKSC_PBankKey);
	                            	 }*/
	                            	 var bankkeys=new Memory({
		                                 data: vendorDetails.UKSC_PBankKey
		                             });
	                            	 vendorDetailsDialog.bankkeys.set("store",bankkeys);
	                            	 vendorDetailsDialog.bankkeys.set("value",vendorDetails.UKSC_PBankKey[0].name);
	                            	 
	                             }
	                             if(vendorDetails.UKSC_PPaymentMethodDesc[0] != undefined){
	                            	 /*if(vendorDetails.UKSC_PPaymentMethodDesc.length>0){
	                            		 paymentMethodCtrl.set("value", vendorDetails.UKSC_PPaymentMethodDesc[0].value);
	                            		 paymentMethodCtrl.set("choices",vendorDetails.UKSC_PPaymentMethodDesc);
	                            		
	                            	 }*/
	                            	 var paymentMethods=new Memory({
		                                 data: vendorDetails.UKSC_PPaymentMethodDesc
		                             });
	                            	 vendorDetailsDialog.paymentMethods.set("store",paymentMethods);
	                            	 vendorDetailsDialog.paymentMethods.set("value",vendorDetails.UKSC_PPaymentMethodDesc[0].name);
	                            	
	                             }
	                             if(vendorDetails.UKSC_PHouseBank[0] != undefined){
	                            	 /*if(vendorDetails.UKSC_PHouseBank.length > 0){
	                            		 houseBankCtrl.set("value", vendorDetails.UKSC_PHouseBank[0].value);
	                            		 houseBankCtrl.set("choices", vendorDetails.UKSC_PHouseBank);
	                            	 }*/
	                            	 var houseBanks=new Memory({
		                                 data: vendorDetails.UKSC_PHouseBank
		                             });
	                            	 vendorDetailsDialog.houseBanks.set("store",houseBanks);
	                            	 vendorDetailsDialog.houseBanks.set("value",vendorDetails.UKSC_PHouseBank[0].name);
	                            	 
	                             }
	                             if(vendorDetails.UKSC_PHouseBankId[0] != undefined){
	                            	/* if(vendorDetails.UKSC_PHouseBankId.length > 0){
	                            		 husebankIdCtrl.set("value", vendorDetails.UKSC_PHouseBankId[0].value);
	                            		 husebankIdCtrl.set("choices", vendorDetails.UKSC_PHouseBankId);
	                            	 }*/
	                            	 var houseBankIds=new Memory({
		                                 data: vendorDetails.UKSC_PHouseBankId
		                             });
	                            	 vendorDetailsDialog.houseBankIds.set("store",houseBankIds);
	                            	 vendorDetailsDialog.houseBankIds.set("value",vendorDetails.UKSC_PHouseBankId[0].name);
	                            	 
	                            	 
	                             }
	                             if(vendorDetails.eParam4){
	                            	 vendorDetailsDialog.vendorN.set("value",vendorDetails.eParam4);
		                              //vendorNameCtrl.set("value", vendorDetails.eParam4);
		                            }
	                             if(vendorDetails.eParam2){
	                            	 vendorDetailsDialog.vendorgstin.set("value",vendorDetails.eParam2);
	                            	// vendorGSTINCtrl.set("value",vendorDetails.eParam2);
	                             }
	                             if(vendorDetails.eParam1){
	                            	 vendorDetailsDialog.vendorPan.set("value",vendorDetails.eParam1);
	                            	 //panNumber.set("value",vendorDetails.eParam1);
	                             }
	                             if(vendorDetails.eFlag){
	                            	 singleormultiple.set("value",vendorDetails.eFlag);
	                            	 singleormultiple.set("readOnly",true);
	                             }
	                             if(fetchvenodrController.get("value")){
	                            	 vendorDetailsDialog.show();
	                             }
	                             else{
	                            	 console.log(fetchvenodrController.get("value"));
	                            	 console.log("UKSC_AutoMR8M is false");
	                             }
	                             
	                            }
	                            /*console.log("actions property controller");
	                            console.log(action);
	                            console.log(action.get("value"));
	                            if(action){
	                            	var actionList=action.get("value");
	                            	actionList.push('Open');
	                            	console.log(actionList);
	                            	action.set("value",actionList);
	                            	var actionUserList=actionUser.get("value");
	                            	var actionRoleList=actionRole.get("value");
	                            	var actionDateList=actionDate.get("value");
	                            	actionUserList.push(ecm.model.desktop.userId);
	                            	actionRoleList.push("AE Open");
	                            	actionDateList.push(new Date());
	                            	actionDate.set("value",actionDateList);
	                            	actionUser.set("value",actionUserList);
	                            	actionRole.set("value",actionRoleList);
	                            }*/
	                            console.log("setting is finished");
	                             collectionController.endChangeSet();
	                             
	                            /* bankAccntCtrl.set("choices", vendorDetails.UKSC_PBankAccountNumber);
	                             if (vendorDetails.UKSC_PBankAccountNumber[0]) {
	                                 bankAccntCtrl.set("value", vendorDetails.UKSC_PBankAccountNumber[0].value);
	                             }
	                            /* bankBranchCtrl.set("choices", vendorDetails.UKSC_PBankBranch);
	                             if (vendorDetails.UKSC_PBankBranch[0]) {
	                                 bankBranchCtrl.set("value", vendorDetails.UKSC_PBankBranch[0].value);
	                             }
	                             bankCityCtrl.set("choices", vendorDetails.UKSC_PBankCity);
	                             if (vendorDetails.UKSC_PBankCity[0]) {
	                                 bankCityCtrl.set("value", vendorDetails.UKSC_PBankCity[0].value);
	                             }*/
	                             
	                             /*bankKeyCtrl.set("choices", vendorDetails.UKSC_PBankKey);
	                             if (vendorDetails.UKSC_PBankKey[0]) {
	                                 bankKeyCtrl.set("value", vendorDetails.UKSC_PBankKey[0].value);
	                             }/*
	                             bankNameCtrl.set("choices", vendorDetails.UKSC_PBankName);
	                             if (vendorDetails.UKSC_PBankName[0]) {
	                                 bankNameCtrl.set("value", vendorDetails.UKSC_PBankName[0].value);
	                             }*/
	                            
	                            /* paymentMethodCtrl.set("choices",vendorDetails.UKSC_PPaymentMethodDesc);
	                             if(vendorDetails.UKSC_PPaymentMethodDesc[0]){
	                            	 paymentMethodCtrl.set("value", vendorDetails.UKSC_PPaymentMethodDesc[0].value);
	                             }
	                             
	                             /*paymentMethodDescCtrl.set("choices", vendorDetails.UKSC_PPaymentMethodDesc);
	                             if(vendorDetails.UKSC_PPaymentMethodDesc[0]){
	                            	paymentMethodDescCtrl.set("value", vendorDetails.UKSC_PPaymentMethodDesc[0].value);
	                             }*/
	                            
	                             /*houseBankCtrl.set("choices", vendorDetails.UKSC_PHouseBank);
	                             if (vendorDetails.UKSC_PHouseBank[0]) {
	                                 houseBankCtrl.set("value", vendorDetails.UKSC_PHouseBank[0].value);
	                             }
	                             husebankIdCtrl.set("choices", vendorDetails.UKSC_PHouseBankId);
	                             if (vendorDetails.UKSC_PHouseBankId[0]) {
	                                 husebankIdCtrl.set("value", vendorDetails.UKSC_PHouseBankId[0].value);
	                             }*/
	                         })
	
	                     });
	            	})
	            });
	        }
    	}
    	catch(e){
    		console.log("Exception in fetching vendor details"+e);
    	}
    });
    
    lang.setObject("ActionHistoryRecording",function(caseType,stepName,collectionController){
    	var setProperty=function(symbolicName){
    		var accountExectiveProperty=collectionController.getPropertyController(symbolicName);
    	    accountExectiveProperty.set("value",window.workItem.repository.userId);
    		console.log("vlaue for account executive is");
    		console.log(accountExectiveProperty.get("value"));
    		console.log(window.workItem.repository.userId);
    	    window.workItem.saveStep();
    	    console.log("setting is finished");
    	};
    	if(stepName === 'Account Executive'){
    		setProperty("UKSC_AEUserId");
    	}
    	else if(stepName === 'Supervisor'){
    		setProperty("UKSC_Supervisor");
    	}
    	else if(stepName === 'Approver'){
    		setProperty("UKSC_Approver");
    	}
    	else if(stepName === 'Payment Executive'){
    		setProperty("UKSC_PaymentExecutive");
    	}
    	else if(stepName === 'QueryStep'){
    		setProperty("UKSC_QueryTo");
    	}
    	else{
    		console.log("No Step Name specified");
    	}
    });
    
    lang.setObject("RenderActionHistoryToFolder",function(repositoryId,collectionController,stepName){
    	repositoryId=window.workItem.repository.id;
    	console.log(repositoryId);
    	console.log("RepositoryId");
    	console.log(repositoryId);
    	var caseID=caseID=window.workItem.getCaseFolderId();
    	
    	var requestparams={
    			repository : repositoryId,
    			caseId : caseID,
    			stepName : stepName,
    			userName:window.workItem.repository.userId
    	};
    	Request.invokePluginService("R2RPlugin","SetFolderProperties",{
    		 requestParams: requestparams,
             requestCompleteCallback: lang.hitch(this, function(response) {
            	 console.log("response from actionProperties");
            	 console.log(response);
    	     })
    	});
    });
});



/*//currentWob.ecmWorkItem.completeStep();
var currentWIE = currentWob.createEditable();
	 currentWIE.lockStep(function(currentWIE) {
	  //propEditable = currentWIE.getProperty("F_CaseTask", "SFG_TaskTeam");
	  //propEditable.setValue(Team);
	  //propEditable = currentWIE.getProperty("F_CaseTask", "SFG_TaskOwner");
	  //propEditable.setValue(User);
	  //currentWIE.setSelectedResponse("Complete");
	  currentWIE.completeStep(function(){
		  console.log("workitem(s) dispatched");
	   processedItems.push(idx);
	   if (processedItems.length == currentWobItems.length) {
	    currentObject.onBroadcastEvent("icm.Refresh", {});
	   }
	  });});*/