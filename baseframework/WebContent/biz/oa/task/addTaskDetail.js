var taskReportingWork={};
$(document).ready(function() {
	taskReportingWork=$('#mainTaskReportingWork').combox('getFormattedData');
	initializeUI();
	taskKindChange();
	loadPersonArray();//加载人员信息
});
function initializeUI(){
	$('#planAuditDetailFileList').fileList();
	$('#taskReportKindId').combox({data:taskReportingWork,checkbox:true});
	if(canEidt()&&$('#taskKindName').val()){
		UICtrl.disable('#taskKindName');//类别不能重复选择
	}
	/************类别选择******************/
	$('#taskKindName').treebox({
    	treeLeafOnly: true, name: 'taskKind',width:200,height:230,
    	beforeChange:function(data){
    		if(data.nodeType=='f'){
    			return false;
    		}
    		$('#businessCode').val(data['extendedCode']);
    		if(!Public.isBlank(data.taskLevel)){
    			$('#taskLevel').combox('setValue',data.taskLevel);
    		}
    		taskKindChange();
    		return true;
    	},
    	beforClose:function(){
    		if($('#taskKindId').val()==''){
    			$('#businessCode').val('');
    		}
    	},
    	back:{
    		text:'#taskKindName',
    		value:'#taskKindId'
    	}
    });
	//注册责任人及责任部门选择
	initOwnerAndDeptChoose();//调用taskPersonChooseUtil.js中方法
    $('#finishDate').datepicker({left:function(){
		return $('#finishDate').offset().left-27;
	}}).mask('9999-99-99');
	if(Public.isReadOnly){
		hideChooseLink();//调用taskPersonChooseUtil.js中方法
	}
}
function taskKindChange(){
	clearExtendedField();
	var extendedCode=$('#businessCode').val();
	if(extendedCode!=''){
		var $el=$('#taskExtendedField');
    	$el.extendedField({businessCode:extendedCode,bizId:$('#taskId').val(),onInit:function(){
    		$el.attr('businessCode',extendedCode);
    		if(Public.isReadOnly){
    			UICtrl.setReadOnly($el);
    		}
    		$el.css('width','99.9%');
    	}});
	}

	var managerType=$('#managerType').val();

	if ('0' == managerType) {
		setTimeout(function(){UICtrl.enable($('#planPrivateKind'));},0)		
	}else{
		setTimeout(function(){UICtrl.disable($('#planPrivateKind'));},0)
	}

	var taskKindId=$('#taskKindId').val();
	if (taskKindId) {
		setTimeout(function(){UICtrl.disable($('#taskKindName'));},0)		
	}
}

function canEidt(){
	var taskId=$('#taskId').val();
	return !(taskId=='');
}
function  clearExtendedField() {
    $('#taskExtendedField').empty().removeAttr('businessCode').removeData();
}

function saveHandler(relevanceTaskId){
	 //扩展属性
	var param={};
    if($('#taskExtendedField').attr('businessCode')){
        param = $('#taskExtendedField').extendedField('getExtendedFieldValue');
    }
    if(!param) return false;
	var startDate=getStartDate();
	var finishDate=getFinishDate();
	if(!startDate||!finishDate) return false;
	if(!Public.compareDate(finishDate,startDate)){
		Public.errorTip("完成时间不能小于开始时间!");
		return false;
	}
	param['finishDate']=finishDate+' 23:59:59';
	var constraintType=param['constraintType'];
	var constraintDate=param['constraintDate'];
    //任务限制
    if (constraintType == 0 || constraintType == 1) {
         constraintDate='';
     }else if (constraintDate == '') {
            if (constraintType == 2 || constraintType == 4 || constraintType == 5) constraintDate=startDate;
            if (constraintType == 3 || constraintType == 6 || constraintType == 7) constraintDate=finishDate;
    }
	param['constraintDate']=constraintDate;
	getOwnerArray(1);
	param['taskExecutors']=getExecutorArray();//调用taskPersonChooseUtil.js中方法
	param['taskManager']=getManagerArray(1);//调用taskPersonChooseUtil.js中方法
	param['relevanceTaskId']=relevanceTaskId;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/planAuditAction!savePlanAuditDetail.ajax',
		param:param,
		success : function(id) {
			$('#taskId').val(id);
			$('#planAuditDetailFileList').fileList({bizId:id});
			UICtrl.disable('#taskKindName');//类别不能重复选择
		}
	});
}

function savenewHandler(relevanceTaskId){
	 //扩展属性
	var param={};
    if($('#taskExtendedField').attr('businessCode')){
        param = $('#taskExtendedField').extendedField('getExtendedFieldValue');
    }
    if(!param) return false;
	var startDate=getStartDate();
	var finishDate=getFinishDate();
	if(!startDate||!finishDate) return false;
	if(!Public.compareDate(finishDate,startDate)){
		Public.errorTip("完成时间不能小于开始时间!");
		return false;
	}
	param['finishDate']=finishDate+' 23:59:59';
	var constraintType=param['constraintType'];
	var constraintDate=param['constraintDate'];
    //任务限制
    if (constraintType == 0 || constraintType == 1) {
         constraintDate='';
     }else if (constraintDate == '') {
            if (constraintType == 2 || constraintType == 4 || constraintType == 5) constraintDate=startDate;
            if (constraintType == 3 || constraintType == 6 || constraintType == 7) constraintDate=finishDate;
    }
	param['constraintDate']=constraintDate;
	getOwnerArray(1);
	param['taskExecutors']=getExecutorArray();//调用taskPersonChooseUtil.js中方法
	param['taskManager']=getManagerArray(1);//调用taskPersonChooseUtil.js中方法
	param['relevanceTaskId']=relevanceTaskId;
	param['taskId']='';
	$('#submitForm').ajaxSubmit({url: web_app.name + '/planAuditAction!savePlanAuditDetail.ajax',
		param:param,
		success : function(id) {
			$('#taskId').val(id);
			$('#planAuditDetailFileList').fileList({bizId:id});
			UICtrl.disable('#taskKindName');//类别不能重复选择
		}
	});
}
/**********人员信息选择处理*************/
//加载已存在的处理人信息
function loadPersonArray(){
	var taskId=$('#taskId').val();
	if(taskId==''){
		//是否存在复制新增的数据
		taskId=$('#copyTaskId').val();
		if(taskId==''){
			return;
		}
	}
	queryTaskPerson(taskId);//调用taskPersonChooseUtil.js中方法
	
	
}

//打开人员选择对话框覆盖taskPersonChooseUtil.js中方法
function showSelectOrgDialog(options){
	parent.showSelectOrgDialog(options);
}
//打开处理人对话框覆盖taskPersonChooseUtil.js中方法
function showManagerDialog(options){
	parent.showManagerDialog(options);
}
