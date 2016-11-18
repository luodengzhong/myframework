$(document).ready(function() {
    var resInvType=$('#resInvType').val();
    	var evaluateSelfWorkTr=$('#evaluateSelfWorkTr');
    	var forOgnOpinionTr=$('#forOgnOpinionTr');
	    var dptOpinionTr=$('#dptOpinionTr');
    	var dptRetainOpinionTr=$('#dptRetainOpinionTr');
    if(resInvType==2){
    	//表示是人力面谈
         $('#dptOpinion').removeAttr('required');
		 $('#dptRetainOpinion').removeAttr('required');
		 $('div,span',dptOpinionTr).add(dptOpinionTr).hide();
 		 $('div,span',dptRetainOpinionTr).add(dptRetainOpinionTr).hide();
    }else if(resInvType==1){
    	//1表示是部门面谈
    	  $('#evaluateSelfWork').removeAttr('required');
		 $('#forOgnOpinion').removeAttr('required');
		 $('div,span',evaluateSelfWorkTr).add(evaluateSelfWorkTr).hide();
 		 $('div,span',forOgnOpinionTr).add(forOgnOpinionTr).hide();
    }
});
function save(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/personalInterviewAction!save.ajax',
		success : function() {
			refreshFlag = true;
		}
	});

}

function advance(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/personalInterviewAction!advance.ajax',
		success : function() {
			UICtrl.closeAndReloadTabs("TaskCenter", null);

		}
	});
}

function getId() {
	return $("#id").val();
}