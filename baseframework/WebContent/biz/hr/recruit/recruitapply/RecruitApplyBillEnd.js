var  bizId;

$(document).ready(function() {
	$.getFormButton([{name:'转交任务',event:transfer},{name:'完成招聘任务 ',event:function(){
		completeRecruitTask();
		}},{name:'招聘计划调整 ',event:function(){
			recruitTaskChange();}}]);
});


function doTransfer(){
	var data = this.iframe.contentWindow.selectedData;
	if (data.length == 0) {
		Public.tip("请选择转交人员。");
		return;
	}
	
	var _self = this;
	
	var params = {};
	params = $.extend({},  { executorId: data[0].id }, getApprovalParams());
	params.catalogId =  "task";	
	
	$('#submitForm').ajaxSubmit({
			url : web_app.name + '/workflowAction!transmit.ajax',
			param : params,
			success : function() {	
				parent.Public.successTip("当前任务已成功转交。");
				_self.close();
				UICtrl.closeAndReloadTabs("TaskCenter", null);
			}
	});
}

function getApprovalParams() {
	approvalParam = {};
	var taskId=$('#taskId').val();
	approvalParam.bizId = bizId || getId();
	approvalParam.taskId = taskId;

	return approvalParam;
}

//转交
function transfer() {
	var selectOrgparams = OpmUtil.getSelectOrgDefaultParams();
	var options = { params: selectOrgparams, confirmHandler: doTransfer, 
			closeHandler: onDialogCloseHandler, title : "选择转交人员" };
	OpmUtil.showSelectOrgDialog(options);
}

function completeRecruitTask(){
	var  beRecNum=$('#beRecNum').val();
	var  recNum=$('#recNum').val();
	if(beRecNum!=recNum){
		Public.tip("已招聘人数和招聘人数不相等,不能正常关闭招聘计划");
		return;
	}
	
	$('#submitForm').ajaxSubmit({url: web_app.name + '/recruitApplyAction!completeRecruitTask.ajax',
		success : function() {
			UICtrl.closeAndReloadTabs("TaskCenter", null);	
			}
	});
	
}
function getId() {
	return $("#jobApplyId").val() || 0;
}

function onDialogCloseHandler() {
}

function  recruitTaskChange(){
	var jobApplyId=$('#jobApplyId').val();
	var taskId=$('#taskId').val();
	 UICtrl.showAjaxDialog({url: web_app.name + '/recruitApplyAction!showInsertChangeReason.load', 
			title:"提示：请填写招聘计划调整原因",
			param:{jobApplyId:jobApplyId,taskId:taskId},
			ok: function (){
				saveChangeTask();
			}, 
			width:400,
			height:100,
			close: this.close()});  
	
}
function saveChangeTask(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/recruitApplyAction!completeRecruitTask.ajax',
		success : function() {
			UICtrl.closeAndReloadTabs("TaskCenter", null);	
			}
	});
	
}