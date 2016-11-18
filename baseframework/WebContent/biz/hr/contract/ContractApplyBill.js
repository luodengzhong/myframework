var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	setEditable();	//设置审批页面中字段为可读写
	var renewType=$("#renewType").val();
	checkIsLimit(renewType);
	$('#renewType').combox({onChange:function(o){
		checkIsLimit(o.value);
	}})
});
function setEditable(){
	if(isApproveProcUnit()){//是审核中
	  setTimeout(function(){
		   UICtrl.enable('#renewType');
	       UICtrl.enable('#renewTime');
		},0);
	}
}
function checkIsLimit(renewType){
	if(renewType==1){
		showRenewTime();
	}else{
		hideRenewTime();
	}
}

function showRenewTime(){
	var tr=$('#renewTimeTr');
     $('div,span',tr).add(tr).show();

}

function hideRenewTime(){
	var tr=$('#renewTimeTr');
     $('div,span',tr).add(tr).hide();

}
function getId() {
	return $("#contractApplyId").val() || 0;
}

function setId(value){
	$("#contractApplyId").val(value);
	gridManager.options.parms['contractApplyId'] =value;
}
