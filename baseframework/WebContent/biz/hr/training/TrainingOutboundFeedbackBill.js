$(document).ready(function() {
	//屏蔽保存按钮
	 $('#assist,#assist_line').hide();
	 $('#abort,#abort_line').hide();
});

function getId() {
	return $("#trainingOutboundFeedbackId").val() || 0;
}

function setId(value){
	$("#trainingOutboundFeedbackId").val(value);
}
function afterSave(){
	reloadGrid();
}

function reloadGrid() {
} 

function save(){
	 $('#submitForm').ajaxSubmit({
        url: web_app.name + '/trainingOutboundFeedbackAction!save.ajax',
        success: function (data) {
               setId(data);
        }
    });
}


function advance(){
	 $('#submitForm').ajaxSubmit({
        url: web_app.name + '/trainingOutboundFeedbackAction!advance.ajax',
        success: function (data) {
             UICtrl.closeAndReloadTabs("TaskCenter", null);
        }
    });
}

//中止
function  abort() {
	var taskId=$('#taskId').val();
	Public.ajax(web_app.name+'/trainingOutboundFeedbackAction!abort.ajax',
			    		{taskId:taskId},
			    		function(){
			    			UICtrl.closeAndReloadTabs("TaskCenter", null);
			    		}
			    	);
}