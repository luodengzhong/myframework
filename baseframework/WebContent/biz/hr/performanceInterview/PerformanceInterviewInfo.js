$(document).ready(function() {
	 $('#interviewerName').searchbox({ type:"hr", name: "resignationChoosePerson",
			back:{
				archivesId:"#interviewerId",staffName:"#interviewerName"
			    }
	 });
	 $('#periodIndex').combox({checkbox:false,data:{1:'1季度',
			2:'2季度',
			3:'3季度',
			4:'4季度'}});
	var auditId=$("#auditId").val();
	$.getFormButton([{name:'保存并提交',event:function(){
		saveInfo();
		}},{name:'关闭',event:function(){
			UICtrl.closeAndReloadTabs(null, null);	}}]);
});


function saveInfo(){
	var taskId=$('#taskId').val();
		//执行修改操作
	$('#submitForm').ajaxSubmit({url: web_app.name + '/performanceInterviewAction!updatePerformanceInterviewInfo.ajax',
		success : function() {
			//如果不关闭对话框这里需要对主键赋值
			UICtrl.closeAndReloadTabs(null, null);	
		}
	});
	
}