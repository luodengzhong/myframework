//完成通知任务
function saveCompleteTask(){
	var taskId=$('#mainPanelTaskId').val();
	Public.ajax(web_app.name + '/examTaskAction!saveCompleteNotifyTask.ajax', {taskId:taskId}, function(){
		UICtrl.closeAndReloadTabs("TaskCenter", null);
	});
}
//查看考试答案
function forwardQuestionAnswerList(){
	var examPersonTaskId=$('#examPersonTaskId').val();
	var url= web_app.name +'/examTaskAction!forwardQuestionAnswerList.do?examPersonTaskId='+examPersonTaskId;
	parent.addTabItem({ tabid: 'QuestionAnswerList'+examPersonTaskId, text: '查看考试答案 ', url:url});
}
//重新考试
function saveReStartExamTask(){
	var examPersonTaskId=$('#examPersonTaskId').val(),taskId=$('#mainPanelTaskId').val();
	Public.ajax(web_app.name + '/examTaskAction!saveReStartExamTask.ajax', {examPersonTaskId:examPersonTaskId,taskId:taskId}, function(data){
		var url= '/examTaskAction!forwardExamTask.do?isReadOnly=false&taskKindId=task&bizId='+data['examPersonTaskId']+'&taskId='+data['taskId'];
		//重新进入考试页面
		window.location.replace(web_app.name +url);
	});
}