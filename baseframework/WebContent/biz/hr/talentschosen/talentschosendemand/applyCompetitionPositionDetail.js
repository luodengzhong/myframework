$(document).ready(function() {
  $.getFormButton([{name:'报 名 ',event:apply},{name:'取 消',event:cancel}]);
	
});

function apply(){
	var competePositionId=$('#competePositionId').val();
	parent.addTabItem({ 
		tabid: 'HRTalentsChosenApply'+competePositionId,
		text: '人才选拨申请 ',
		url: web_app.name + '/talentschosenapplyAction!forwardTalentsChosenApplyBill.do?competePositionId=' 
			+ competePositionId+'&speechType=1'
		}); 
}

function cancel(){
				UICtrl.closeAndReloadTabs(null, null);

}