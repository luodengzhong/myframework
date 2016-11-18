var refreshFlag = false;
$(document).ready(function() {
	
	$.getFormButton([{name:'保 存 ',event:saveApply},{name:'提 交',event:submitApply}]);
	 $('#talentsChosenApplyFileList').fileList();
	//从竞聘岗位管理中选择竞聘岗位
		 $('#chosenPosName').searchbox({type:'hr',name:'competitionPositionSelect',
 			back:{chosenPosName:'#chosenPosName',chosenPosId:'#chosenPosId',competePositionId:'#competePositionId',chosenOrganId:'#chosenOrganId',
 			   	chosenCenterId:'#chosenCenterId',chosenDeptId:'#chosenDeptId',chosenOrganName:'#chosenOrganName',chosenCenterName:'#chosenCenterName',
 			   	chosenDeptName:'#chosenDeptName',talentsChosenDemandId:'#talentsChosenDemandId',posLevel:'#posLevel'}
 	 });
});

function saveApply(){
	var  chosenApplyId=$('#chosenApplyId').val();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/talentschosenapplyAction!insertTalentsChosenApply.ajax',
		success : function(data) {
			$('#chosenApplyId').val(data);
			  $('#talentsChosenApplyFileList').fileList({bizId:data});
			refreshFlag=true;
		}
	});
	
	
}


function submitApply(){
	var  chosenApplyId=$('#chosenApplyId').val();
		UICtrl.confirm('确定提交吗?',function(){
			$('#submitForm').ajaxSubmit({url: web_app.name + '/talentschosenapplyAction!insertTalentsChosenApply.ajax',
		     success : function(data) {
			  $('#chosenApplyId').val(data);
			  $('#talentsChosenApplyFileList').fileList({bizId:data});
			  //关闭页面
			  UICtrl.closeAndReloadTabs(null, null);

		}
	   });
	});
	
	
}