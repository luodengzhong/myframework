$(document).ready(function() {
	bindEvent();
});
function bindEvent(){
	$('#mainTable').on('click',function(e){
		var $el = $(e.target || e.srcElement);
		if($el.hasClass('fileLink')){
			var div=$el.parent(),id=div.attr('id');
			$("div.file",$('#mainTable')).removeClass('fileSelected');
			div.addClass('fileSelected');
			AttachmentUtil.downFileByAttachmentId(id);
		}
		if($el.hasClass('ui-button')){
			var parent=$el.parent(),param={superAskReportApprove:"true"};
			parent.find('input').each(function(){
				param[$(this).attr('name')]=$(this).val();
			});
			if($el.hasClass('ui-button-save')){
				doAgreeAdvance(param);
			}
			if($el.hasClass('ui-button-delete')){
				doBack(param);
			}
			if($el.hasClass('ui-button-next')){
				doReplenish(param);
			}
		}
	});
}
function querySupperAskReport(){
	Public.load(web_app.name + '/askReportAction!querySupperAskReport.load',{},function(data){
		$('#supperAskReportTbody').html(data);
	});
}
//同意提交
function doAgreeAdvance(param) {
	param['handleResult']='1';//默认处理结果1(同意)
	UICtrl.confirm("您确定<font color='green' style='font-size:14px;font-weight:bold;'>[同意]</font>当前报告吗？", function () {
		Public.ajax(web_app.name + '/workflowAction!advance.ajax',param,function(data){
			querySupperAskReport();
	    });
    });
}
//重新报批
function doBack(param) {
	param['handleResult']='2';//默认处理结果1(同意)
	param['destActivityId']='Apply';//默认退回到申请环节
	param['backToProcUnitHandlerId']='0';
	UICtrl.confirm("您确定<font color='red' style='font-size:14px;font-weight:bold;'>[重新报批]</font>当前报告吗？", function () {
		Public.ajax(web_app.name + '/workflowAction!back.ajax',param,function(data){
			querySupperAskReport();
	    });
    });
}
//打回
function doReplenish(param) {
	param['handleResult']='2';//默认处理结果1(同意)
	UICtrl.confirm("您确定<font color='red' style='font-size:14px;font-weight:bold;'>[打回]</font>当前报告吗？", function () {
		//查询申请环节任务ID
		Public.ajax(web_app.name + '/workflowAction!queryApplyTaskIdByBizId.ajax',{bizId:param['bizId']},function(data){
			param['backToTaskId']=data;
			param['currentTaskId']=param['taskId'];
			Public.ajax(web_app.name + '/workflowAction!replenish.ajax',param,function(data){
				querySupperAskReport();
		    });
	    });
    });
}
//查看请示报告单
function showAskReport(bizId){
	var url=web_app.name + '/askReportAction!showUpdateAskReport.job?bizId='+bizId+'&isReadOnly=true';
	parent.addTabItem({ tabid: 'askReport'+bizId, text: '查看请示报告', url:url});
}