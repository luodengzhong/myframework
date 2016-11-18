var taskReportingWork={};
$(document).ready(function() {
	taskReportingWork=$('#mainTaskReportingWork').combox('getFormattedData');
	changeToolBar();
	initializeUI();
	bindEvent();
	initUIByIsReceive();
	taskKindChange();
	loadPersonArray();//加载人员信息
});
function getId() {
	return $("#receiveTaskId").val() || 0;
}
function setId(value){
	$("#receiveTaskId").val(value);
}
//加载已存在的处理人信息
function loadPersonArray(){
	var taskId=$('#receiveTaskId').val();
	if(taskId==''){
		return;
	}
	queryTaskPerson(taskId);//调用taskPersonChooseUtil.js中方法
}
function changeToolBar(){
	$('#toolBar').toolBar('removeItem');
	$('#toolBar').toolBar('addItem',[
		 { id:'save',name:'保存',icon:'save',event:doSave}, 
		 {line:true},
	     {id:'turn',name:'提交',icon:'turn',event: doSubmitTask},
	     {line:true},
	     {id:'stop',name:'关闭',icon:'stop',event: closeWindow},
	     {line:true}  		     
	]);
}
function initializeUI(){
	$('#taskDetailFileList').fileList();
	$('#detailTab').tab();
	$('#mainInfoTab').tab();
	$('#taskReportKindId').combox({data:taskReportingWork,checkbox:true});
	/*********父级任务选择*********/
	$('#parentTaskName').searchbox({type:'oa',name:'queryCurrentPlanTask',back:{taskId:'#parentTaskId',taskName:'#parentTaskName',startDate:'#parentStartDate',finishDate:'#parentFinishDate'}});
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
	if(!UICtrl.isApplyProcUnit()){
		hideChooseLink();
	}
}
function initUIByIsReceive(){
	var isReceive=$('#isReceive1').getValue();
	if(isReceive==1){
		$('#receiveTaskDiv').show();
		$('#notReceiveTaskDiv').hide();
	}else{
		$('#receiveTaskDiv').hide();
		$('#notReceiveTaskDiv').show();
	}
}
function bindEvent(){
	$('#isReceive1').parent('dd').on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
    	if($clicked.is('input')){
    		setTimeout(initUIByIsReceive,0);
    	} 
	});
}
function taskKindChange(){
	clearExtendedField();
	var extendedCode=$('#businessCode').val();
	if(extendedCode!=''){
		var $el=$('#taskExtendedField');
    	$el.extendedField({businessCode:extendedCode,bizId:getId(),onInit:function(){
    		$el.attr('businessCode',extendedCode);
    		if(Public.isReadOnly){
    			UICtrl.setReadOnly($el);
    		}
    		$el.css('width','99.9%');
    	}});
	}
}
function  clearExtendedField() {
    $('#taskExtendedField').empty().removeAttr('businessCode').removeData();
}

function getExtendedData(){
	var isReceive=$('#isReceive1').getValue();
	var param={isReceive:isReceive};
	if(isReceive==1){
		var extendedFieldParam={};
	    if($('#taskExtendedField').attr('businessCode')){
	        extendedFieldParam = $('#taskExtendedField').extendedField('getExtendedFieldValue');
	    }
	    if(!extendedFieldParam) return false;
	    params = $.extend(param, extendedFieldParam);
		var startDate=getStartDate();
		var finishDate=getFinishDate();
		if(!startDate||!finishDate) return false;
		if(!Public.compareDate(finishDate,startDate)){
			Public.errorTip("计划完成时间不能小于计划开始时间!");
			return false;
		}
		param['finishDate']=finishDate+' 23:59:59';
		param['taskExecutors']=getExecutorArray();//调用taskPersonChooseUtil.js中方法
	    param['taskManager']=getManagerArray(1);//调用taskPersonChooseUtil.js中方法
	}
	return param;
}

//保存方法用于反馈信息
function doSave(){
	var param=getExtendedData();
	if(!param) return false;
	var isReceive=$('#isReceive1').getValue();
	var fromId=isReceive==1?'#submitForm':'#notReceiveSubmitForm';
	$(fromId).ajaxSubmit({
        url: web_app.name + '/planAuditAction!updateReceivePlanTask.ajax',
        param: param,
        success: function (data) {
            reloadGrid();
        }
    });
}

function doSubmitTask(){
	var param=getExtendedData();
	if(!param) return false;
	param['taskId']=taskId;
	UICtrl.confirm('您是否提交当前信息？',function(){
		var isReceive=$('#isReceive1').getValue();
		var fromId=isReceive==1?'#submitForm':'#notReceiveSubmitForm';
		$(fromId).ajaxSubmit({
	        url: web_app.name + '/planAuditAction!saveSubmitReceivePlanTask.ajax',
	        param: param,
	        success: function (data) {
	            UICtrl.closeAndReloadTabs("TaskCenter", null);
	        }
	    });
	});
}

function closeWindow(){
	UICtrl.closeCurrentTab();
}