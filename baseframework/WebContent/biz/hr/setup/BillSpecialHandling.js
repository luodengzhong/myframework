function businessTripCode(){
	var billCode=$('#businessTripCode').val();
	if(billCode==''){
		return;
	}
	Public.ajax(web_app.name + '/attBusinessTripAction!saveSendBillToERP.ajax', {billCode:billCode});
}

function saveAbortedBusinessTrip(){
	var billCode=$('#businessTripCode').val();
	if(billCode==''){
		return;
	}
	var isAborted=$('#isAborted1').getValue();
	Public.ajax(web_app.name + '/attBusinessTripAction!saveAbortedBusinessTrip.ajax', {billCode:billCode,isAborted:isAborted});
}

function payChangeCode(flag){
	var billCode=$('#payChangeCode').val();
	if(billCode==''){
		return;
	}
	var isUpdateArchives=$('#isUpdateArchives1').getValue();
	var isDeleteTask=$('#isDeleteTask1').getValue();
	Public.ajax(web_app.name + '/hRPayChangeAction!updateArchivesByBillCode.ajax', {billCode:billCode,isUpdateArchives:isUpdateArchives,isDeleteTask:isDeleteTask});
}

function rewardPunishCode(){
	var billCode=$('#rewardPunishCode').val();
	if(billCode==''){
		return;
	}
	Public.ajax(web_app.name + '/hRrewardPunishAction!saveTestPass.ajax', {billCode:billCode});
}

function structureAdjustmentCode(){
	var billCode=$('#structureAdjustmentCode').val();
	if(billCode==''){
		return;
	}
	Public.ajax(web_app.name + '/structureAdjustmentAction!testUpdateOmit.ajax', {billCode:billCode});
}

function deleteUserASAllMsn(){
	var empNo=$('#mainEmpNo').val();
	if(empNo==''){
		return;
	}
	Public.ajax(web_app.name + '/zkAttAction!deleteUserASAllMsn.ajax', {empNo:empNo});
}