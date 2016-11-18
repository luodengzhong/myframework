$(document).ready(function() {
	$('#deleteProcessInstance,#deleteProcessInstance_line').hide();
});


function save(){
	 $('#submitForm').ajaxSubmit({url: web_app.name + '/teacherPlanAction!saveTeacherPLanContent.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			$('#teacherPlanId').val(data);
			refreshFlag = true;
		}
	});
}

function isApplyProcUnit(){
  return true;
}

function advance(){
	 $('#submitForm').ajaxSubmit({url: web_app.name + '/teacherPlanAction!advanceTeacherPLanContent.ajax',
		success : function() {
			UICtrl.closeAndReloadTabs("TaskCenter", null);
		}
	});
}