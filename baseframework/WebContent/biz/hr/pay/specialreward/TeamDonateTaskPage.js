function doSave(form){
   $('#submitForm').ajaxSubmit({url: web_app.name + '/hRSpecialRewardAction!saveTeamDonateTask.ajax'});
}

function doSubmit(form){
	UICtrl.confirm( '您确定提交数据吗?', function() {
		$('#submitForm').ajaxSubmit({url: web_app.name + '/hRSpecialRewardAction!submitTeamDonateTask.ajax',
			success : function() {
				UICtrl.closeAndReloadTabs("TaskCenter", null);
			}
		});
	});
}