﻿var procInstId, bizId, taskId, previousId, processDefinitionKey, procUnitId, processDefinitionFile, 
  activityModel, taskKindId, procInstEndTime, taskStatusId;
var operateKind = operateKind || {};
var pageHiTaskinstRelations = {}; //关联任务信息
var jobLayoutManager = null;
var handleOpinionDefaultValue = '请输入处理意见！';
var freeFlowDesiger;
var flowControlCmd;

$(document).ready(function () {

    getQueryParameters();
    initializeJobPageUI();

    refreshBtnStatus();

    initFloatHandleDialog(); //初始化快捷处理对话框
    initHiTaskinstRelations(); //初始化关联任务显示
    initAddCommentDiv(); //初始化添加评论按钮

    function getQueryParameters() {
        /** 
        * 流程模板编码和流程环节
        */
        processDefinitionFile = Public.getQueryStringByName("processDefinitionFile") || getProcessDefinitionFile();
        processDefinitionKey = Public.getQueryStringByName("processDefinitionKey") || getProcessDefinitionKey();
        procUnitId = Public.getQueryStringByName("procUnitId") || getProcUnitId();

        procInstId = Public.getQueryStringByName("procInstId");
        bizId = Public.getQueryStringByName("bizId");
        bizCode = Public.getQueryStringByName("bizCode");
        taskId = Public.getQueryStringByName("taskId");
        taskKindId = Public.getQueryStringByName("taskKindId") || 'task';
        taskStatusId = Public.getQueryStringByName("taskStatusId") || TaskStatus.READY;
        previousId = Public.getQueryStringByName("previousId");
        activityModel = (Public.getQueryStringByName("isReadOnly") == "true") ? "detail" : "do";
        procInstEndTime =  Public.getQueryStringByName("procInstEndTime");
    }

    operateKind.Save = FlowControlCmd.SAVE;
    operateKind.Advance = FlowControlCmd.ADVANCE;
    operateKind.Delete = FlowControlCmd.DELETE;
});

function getOpinion(){
	var result = $.trim($("#handleOpinion").val());
	return result == handleOpinionDefaultValue ? "" : result;
}

function getApprovalParams() {
    var approvalParam = {};

    approvalParam.bizId = bizId || getId();
    approvalParam.procUnitId = procUnitId;
    approvalParam.procInstId = procInstId;
    approvalParam.taskKindId = taskKindId;
    approvalParam.taskId = taskId;
    approvalParam.flowKind = getFlowKind();

    approvalParam.currentHandleId = $("#currentHandleId").val();
    approvalParam.currentHandleSequence = $("#currentHandleSequence").val();
    approvalParam.currentHandleGroupId = $("#currentHandleGroupId").val();
    approvalParam.currentHandleCooperationModelId = $("#currentHandleCooperationModelId").val();
    //撤回任务后，第一个处理人为自己
    if (isApplyProcUnit()) {
        approvalParam.currentHandleSequence = 0;
        approvalParam.currentHandleGroupId = 0;
    }
    var tmpHandleResult=parseInt($("#handleResult").val(),10);
    tmpHandleResult=isNaN(tmpHandleResult)?0:tmpHandleResult;
    approvalParam.handleResult = tmpHandleResult;
    approvalParam.handleOpinion = getOpinion();
    
    return approvalParam;
}

function initializeJobPageUI() {
    UICtrl.autoSetWrapperDivHeight();
    var layout = $("#jobPageLayout"), bodyHeight = $(window).height() - 40;
    var rightWidth = $(window).width() * 0.18;
    if (rightWidth < 250) {
        rightWidth = 250;
    }
    jobLayoutManager = UICtrl.layout(layout, {
        topHeight: 25,
        heightDiff: -5,
        rightWidth: rightWidth,
        isRightCollapse: true,
        allowBottomResize: false,
        allowTopResize: false,
        allowRightResize: false,
        onHeightChanged: function (options) {
            var bodyHeight = layout.height() - 30;
            $('#jobPageCenter').height(bodyHeight);
            $('#jobPageRight').height(bodyHeight - 26);
            var handleDiv = $('#jobPageFloatHandleDiv');
            if (handleDiv.length > 0) {
                $('#showHiTaskinstRelations').height($('#jobPageRight').height() - $('#jobPageFloatHandleDiv').height() - 35);
            } else {
                $('#showHiTaskinstRelations').height($('#jobPageRight').height() - 35);
            }
        }
    });
    $('#jobPageCenter').height(bodyHeight).on('scroll', function () {
        try {
            $.closeCombox();
        } catch (e) {
        }
        try {
            $.datepicker.close();
        } catch (e) {
        }
        $('#jobCommentToolBar').hide();
    });
    $('#jobPageRight').height(bodyHeight - 26);
    var toolBarOptions={
    	titleLang:TaskButtonLang,
    	items:[{ id: 'save', name: '保存', icon: 'save', event: save},
	          	  { line: true, id: 'save_line' },
	          	  { id: 'back', name: '回退', icon: 'back', event: back},
	          	  { line: true, id: 'back_line' },
	          	  { id: 'advance', name: '提交', icon: 'turn', event: advance},
	          	  { line: true, id: 'advance_line' },
	              { id: 'transfer', name: '交办', icon: 'transfer', event: transfer},
	          	  { line: true, id: 'transfer_line' },
	          	  { id: 'counterSign', name: '加减签', icon: 'counterSign', event: counterSign},
	          	  { line: true, id: 'transfer_line' },
	          	  { id: 'assist', name: '协审', icon: 'assist', event: assist},
	          	  { line: true, id: 'assist_line' },
	          	  { id: 'makeACopyFor', name: '知会', icon: 'makeACopyFor', event: makeACopyFor},
	          	  { line: true, id: 'makeACopyFor_line' },
	          	  { id: 'sleep', name: '暂缓', icon: 'sleep', event: sleep },
	          	  { line: true, id: 'sleep_line' },	          		     
	          	  { id: 'abort', name: '终止', icon: 'stop', event: abort},
	          	  { line: true, id: 'abort_line' },
	          	  { id: 'relate', name: '协同关联', icon: 'relation', event: relate},
		          { line: true },
		          { id: 'print', name: '打印', icon: 'print', event: print },
	          	  { line: true, id: 'print_line' },
	              { id: 'showChart', name: '流程图', icon: 'chart', event: showChart},
	          	  { line: true, id: 'showChart_line' },
	          	  { id: 'showApprovalHistory', name: '流程轨迹', icon: 'tables', event: showApprovalHistory},
	          	  { line: true, id: 'showApprovalHistory_line' },
	          	  { id: 'taskCollect', name: '收藏任务', icon: 'collect', event: saveTaskCollect},
	          	  { line: true, id: 'taskCollect_line' }
	       ]
    };
    $('#toolBar').toolBar(toolBarOptions);
    setTimeout(function () {
        handleOpinionEvent();
        if ($('#show_error_info').length > 0) {//错误页面弹出
            $('#toolBar').toolBar('disable');
        }
        if (isFullFreeFlow()){
        	setToolBarCounterSignTitle("流程环节");
        }
    }, 10);
}

function setToolBarCounterSignTitle(value){
	$("#counterSign a.counterSign span").text(value);
}

/**
 * 流程类别
 * @return {}
 */
function getFlowKind(){
	return FlowKind.APPROVAL;
}

function isFullFreeFlow(){
	return getFlowKind() == FlowKind.FULL_FREE;
}

function getId() {
    return 0;
}

function handleOpinionEvent() {
    var $handleOpinion = $("#handleOpinion");
    if ($handleOpinion.hasClass('textReadonly')) {
        return;
    }
    $handleOpinion.blur(function () {
        if (this.value == '') {
            this.value = handleOpinionDefaultValue;
            this.style.color = '#999';
        } else {
            this.style.color = '#000';
        }
    }).focus(function () {
        if ($.trim(this.value) == handleOpinionDefaultValue) {
            this.value = '';
            this.style.color = '#000';
        }
    }).triggerHandler('blur');
}

function onDialogCloseHandler() {

}

/**
* 检查约束
* 
*/
function checkConstraints() {
    return true;
}

/**
* 启动流程
*/
function startup(operate, fn, showTips) {
    var extendedData = getExtendedData();
    if (extendedData === false) {
        return;
    }
    var params = $.extend({}, {
        processDefinitionKey: processDefinitionKey,
        operateKind: operate,
        flowKind: getFlowKind()
    }, extendedData);

    if (showTips) {
        params.showTips = showTips;
    }

    $('#submitForm').ajaxSubmit({
        url: web_app.name + '/workflowAction!startProcessInstanceByKey.ajax',
        param: params,
        async: false,
        success: function (data) {
            // 直接提交，不预览
            if (operate == operateKind.Advance) {
                UICtrl.closeAndReloadTabs("TaskCenter", null);
            } else {
                // 新增，给ID赋值
                if (!getId()) {
                    setId(data.bizId);

                    bizId = data.bizId;
                    procInstId = data.procInstId;
                    taskId = data.taskId;
                }
                reloadGrid();
                refreshBtnStatus();
                afterSave(data.bizData);
                //预览提交
                if ($.isFunction(fn)) {
                    fn.call(window);
                }
            }
        }
    });
}

// 保存
function save(fn, showTips) {
	flowControlCmd = FlowControlCmd.SAVE;
	
    var extendedData = getExtendedData();
    if (extendedData === false) {
        return;
    }

    if (beforeSave() == false) {
        return;
    }

    if (!getId()) {
        startup(operateKind.Save);
        return;
    }
    var params = $.extend({}, getApprovalParams(), extendedData);
    if (showTips) {
        params.showTips = showTips;
    }
    $('#submitForm').ajaxSubmit({
        url: web_app.name + '/workflowAction!saveBizData.ajax',
        param: params,
        success: function (data) {
            if ($.isFunction(fn)) {	
                fn.call(window);
            } else {
                reloadGrid();
                refreshBtnStatus();
                afterSave(data.bizData);
            }
        }
    });
}

function doQueryAdvance() {
    var data = getAdvanceQueryHandlers();
    if (!data || data.length == 0) {
        return;
    }

    var extendedData = getExtendedData();
    if (!extendedData) {
        return;
    }

    var _self = this;

    var params = $.extend({}, getApprovalParams(), extendedData);
    params.procUnitHandlers = encodeURI($.toJSON(data));

    $('#submitForm').ajaxSubmit({
        url: web_app.name + '/workflowAction!queryAdvance.ajax',
        param: params,
        success: function () {
            _self.close();
            UICtrl.closeAndReloadTabs("TaskCenter", null);
        }
    });
}

function doQueryHandlers() {
    var extendedData = getExtendedData();
    if (extendedData === false) {
        return;
    }
    
    //显示预览处理人
    var params = $.extend({}, getApprovalParams(), extendedData);
    $('#submitForm').ajaxSubmit({
        url: web_app.name + '/workflowAction!queryHandlers.ajax',
        param: params,
        success: function (data) {
            window['advanceQueryDialog']= UICtrl.showDialog({
             	content:'<div id="advanceQueryGrid"></div>',
             	title: '流转确认',
             	width: 800,
                height: 360,               
                cancel: "取消",
                init: function (){
                	initAdvanceQueryGrid(data);
                },
                ok: doQueryAdvance,
                close: onDialogCloseHandler
             });
        }
    });
}

function advanceByShowQueryHandlers(fn) {
    Public.ajax(web_app.name + '/workflowAction!showQueryHandlers.ajax',
    	{ processDefinitionKey: processDefinitionKey, procUnitId: procUnitId },
    	function (data) {
    	    if (data == 'true') {
    	        //预览处理人
    	        if (!getId()) {
    	            //启动流程后，弹出预览人
    	            startup(operateKind.Save, doQueryHandlers, "false");
    	        } else {
    	            //保存数据    	        	
    	            save(doQueryHandlers, "false");
    	        }
    	    } else {
    	        //直接提交，不预览处理人
    	        fn.call(window);
    	    }
    	}
    );
}

/**
 * 检查处理意见
 * @return {Boolean}
 */
function checkHandleOpinion(){
	var approvalParams = getApprovalParams();
    if (!approvalParams.handleResult) {
    	Public.errorTip("没有选择处理意见，不能提交。");
    	return false;
    }
     if (approvalParams.handleResult == HandleResult.DISAGREE && !$.trim(approvalParams.handleOpinion)) {
     	Public.errorTip("您选择的处理结果为“不同意”，请输入处理意见。");
        return false;
     }
     return true;
}

// 提交
function advance() {
	flowControlCmd = FlowControlCmd.ADVANCE;
    var confirmAdvance = function () {
        UICtrl.confirm("您是否提交当前任务？", function () {
            switch (taskKindId) {
                case TaskKind.TASK:                	
                    if (isApproveProcUnit()) {//审批环节检查审批意见
                        if  (!checkHandleOpinion()){
                        	return;
                        }
                    } else {
                    	//协同任务或者非申请环节的约束检查
                    	if (!(processDefinitionKey && isApplyProcUnit()) && !checkConstraints())
                            return;
                    } 
                	
                    if (!(processDefinitionKey && isApplyProcUnit()) && !checkConstraints()){
                    	return;
                    } 
                    
                    if (processDefinitionKey){//流程任务
                    	doAdvance();
                    }else{//协同任务
                    	doCompleteTask();
                    }
                    
                    break;
                case TaskKind.NOTICE:
                case TaskKind.MAKE_A_COPY_FOR:
                    doCompleteTask();
                    break;
                case TaskKind.MEND:
                    if  (!checkHandleOpinion()){
                    	return;
                    }
                    doCompleteMendTask();
                    break;
                case TaskKind.REPLENISH:
                    doCompleteReplenishTask();
                    break;
            }
        });
    };
    
    if (processDefinitionKey && isApplyProcUnit()) {//流程的申请环节
        if (!checkConstraints()) {
            return;
        }
        var formCheckBack = $('#submitForm').formToJSON();
        if (formCheckBack === false) {
            return;
        }
        var extendedData = getExtendedData();
        if (extendedData === false) {
            return;
        }

        if (isQueryHandlers()) {
            advanceByShowQueryHandlers(confirmAdvance);
        } else {
            confirmAdvance();
        }
    } else {
    	//流程的其他审批环节
        if (processDefinitionKey) {
            Public.ajax(web_app.name + '/workflowAction!showQueryHandlers.ajax',
    	{ processDefinitionKey: processDefinitionKey, procUnitId: procUnitId }, function (data) {
    	    if (data == 'true') {
    	        save(doQueryHandlers, "false");
    	    }
    	    else {    	    	
    	        confirmAdvance();
    	    }
    	});
        } else { //非流程环节
            confirmAdvance();
        }
    }
}

function doCompleteTask() {
    Public.ajax(web_app.name + '/workflowAction!completeTask.ajax',
			{ taskId: taskId }, function (data) {
			    UICtrl.closeAndReloadTabs("TaskCenter", null);
			});
}

function doCompleteMendTask() {
    var params = $.extend({}, getApprovalParams(), { operateKind: operateKind.Advance });
    Public.ajax(web_app.name + '/workflowAction!completeMendTask.ajax',
        params,
        function (data) {
            UICtrl.closeAndReloadTabs("TaskCenter", null);
        }
    );
}

function doCompleteReplenishTask(){
	var extendedData = getExtendedData();
    if (!extendedData) {
        return;
    }
	var params = $.extend({}, getApprovalParams(), extendedData);

    $('#submitForm').ajaxSubmit({
        url: web_app.name + '/workflowAction!completeReplenishTask.ajax',
        param: params,
        success: function () {
            UICtrl.closeAndReloadTabs("TaskCenter", null);
        }
    });	
}

function doAdvance() {	
	if (!isApplyProcUnit() && !this.getId()){
		Public.errorTip("系统错误，没有取到业务ID。");
		return;
	}
	
    if (!taskId) {
        startup(operateKind.Advance);
        return;
    }

    var extendedData = getExtendedData();
    if (!extendedData) {
        return;
    }
    
    var params = $.extend({}, getApprovalParams(), extendedData);

    $('#submitForm').ajaxSubmit({
        url: web_app.name + '/workflowAction!advance.ajax',
        param: params,
        success: function () {
            UICtrl.closeAndReloadTabs("TaskCenter", null);
        }
    });
}

/**
* 是否为申请环节
*/
function isApplyProcUnit() {
    return procUnitId == "Apply";
}

/**
 * 流程实例是否完成
 */
function isProcInstCompleted(){
	return !!procInstEndTime;
}

function isApproveProcUnit() {
    return procUnitId == "Approve";
}

function deleteProcessInstance() {
    if (isApplyProcUnit()) {
        UICtrl.confirm("您是否要删除当前流程？", function () {
            Public.ajax(web_app.name + '/workflowAction!deleteProcessInstance.ajax',
			{ procInstId: procInstId }, function () {
			    UICtrl.closeAndReloadTabs("TaskCenter", null);
			});
        });
    }
}

//回退
function back() {
	if (isApproveProcUnit() && !getOpinion()){
		Public.errorTip("回退请输入处理意见。");
		return;
	}
	if (isFullFreeFlow()){
		showFreeFlowBackDialog();
	}else{
		showBackDialog({ title: "回退确认",  confirmHandler: doBack });	
	}
}

function showBackDialog(options){	
	var groupId = $("#currentHandleGroupId").val();
    UICtrl.showFrameDialog({
        title: options.title,
        width: 500,
        height: 380,
        url: web_app.name + '/workflowAction!showBackQuery.do',
        param: { bizCode: bizCode, procUnitId: procUnitId, groupId: groupId },
        ok: internalDoBack,
        cancel: true,
        close: onDialogCloseHandler
    });
}

function showFreeFlowBackDialog(){
    UICtrl.showFrameDialog({
        title:  "回退确认",
        width: 500,
        height: 400,
        url: web_app.name + '/freeFlowAction!showBackQuery.do',
        param: { bizId: bizId, procInstId: procInstId, taskId: taskId },
        ok: internalDoBack,
        cancel: true,
        close: onDialogCloseHandler
    });
}

function internalDoBack(){
	var backModel = this.iframe.contentWindow.getBackModel();
    if (backModel == "back"){
    	flowControlCmd = FlowControlCmd.BACK;
    	doBack.call(this);    
    }else{
    	flowControlCmd = FlowControlCmd.REPLENISH;
    	doReplenish.call(this);
    }
}

function isBackSaveBizData(){
	return false;
}

function onDefaultSuccess(opt){
	if (opt.dialog){
		opt.dialog.close();
	}
	UICtrl.closeAndReloadTabs("TaskCenter", null);
}

function doBack() {	
    var data = this.iframe.contentWindow.getBackProcUnitData();
    if (!data || data.length == 0) {
        return;
    }

    var _self = this;

    var approvalParams = getApprovalParams();
    var extendedData = getExtendedData();
    var params;
    if (isFullFreeFlow()){
		params = $.extend({}, { bizId: bizId, taskId: taskId, activityId: data[0].id},
			approvalParams, extendedData);
    }else{
    	params = $.extend({}, { destActivityId: data[0].taskDefKey, backToProcUnitHandlerId: data[0].procUnitHandlerId },
			approvalParams, extendedData);
    }
    
    params.isBackSaveBizData = isBackSaveBizData();
    
    var url = web_app.name + '/workflowAction!back.ajax';

    $('#submitForm').ajaxSubmit({
    	isCheck: params.isBackSaveBizData,
        url: url,
        param: params,
        success: function () {
        	onDefaultSuccess({ dialog: _self});
        }
    });
    /*
    if (params.isBackSaveBizData){
        $('#submitForm').ajaxSubmit({
            url: url,
            param: params,
            success: function () {
            	onDefaultSuccess({ dialog: _self});
            }
        });
    }else{
    	Public.ajax(url, params, function () {
    		onDefaultSuccess({ dialog: _self});
    	});
    }*/
}

function doReplenish(){
	var data = this.iframe.contentWindow.getBackProcUnitData();
    if (!data || data.length == 0) {
        return;
    }

    var _self = this;

    var approvalParams = getApprovalParams();
    var extendedData = getExtendedData();
    var params;
    if (isFullFreeFlow()){
    	params = $.extend({}, { backToActivityId: data[0].id }, approvalParams, extendedData);
    }else{
    	params = $.extend({}, { backToTaskId: data[0].id }, approvalParams, extendedData);
    }
    
    params.isBackSaveBizData = isBackSaveBizData();
    
    var url = web_app.name + '/workflowAction!replenish.ajax';
    $('#submitForm').ajaxSubmit({
    	isCheck: params.isBackSaveBizData,
        url: url,
        param: params,
        success: function () {
        	onDefaultSuccess({ dialog: _self});
        }
    });
    /*
    if (params.isBackSaveBizData){
    	$('#submitForm').ajaxSubmit({
            url: url,
            param: params,
            success: function () {
            	onDefaultSuccess({ dialog: _self});
            }
        });
    }else{
    	var billData = $('#submitForm').formToJSON({ check: false });
    	params = $.extend({}, billData, params);
    	
    	Public.ajax(url, params, function () {
    		onDefaultSuccess({ dialog: _self});
    	});
    }*/
}

//交办
function transfer() {
	flowControlCmd = FlowControlCmd.TRANSMIT;
    var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();
    selectOrgParams = $.extend({}, selectOrgParams, { multiSelect: false, showPosition: false });
    var options = { params: selectOrgParams, confirmHandler: doTransfer,
        closeHandler: onDialogCloseHandler, title: "选择交办人员"
    };
    OpmUtil.showSelectOrgDialog(options);
}

function doTransfer() {
    var data = this.iframe.contentWindow.selectedData;
    if (data.length == 0) {
        Public.errorTip("请选择交办人员。");
        return;
    }

    var _self = this;

    var extendedData = getExtendedData();

    var params = $.extend({}, { executorId: data[0].id }, getApprovalParams(), extendedData);
    params.catalogId = !!procInstId ? "process" : "task";
    
    //!!procInstId 等价于 procInstId ? true : false;

    $('#submitForm').ajaxSubmit({
        url: web_app.name + '/workflowAction!transmit.ajax',
        param: params,
        success: function () {
            _self.close();
            UICtrl.closeAndReloadTabs("TaskCenter", null);
        }
    });
}

function makeACopyFor() {
	flowControlCmd = FlowControlCmd.MAKE_A_COPYFOR;
	if (!taskId) {
        return;
    }
    var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();
    selectOrgParams = $.extend({}, selectOrgParams, { showPosition: false });
    var options = { params: selectOrgParams, confirmHandler: doMakeACopyFor,
        closeHandler: onDialogCloseHandler, title: "选择知会人员"
    };
    OpmUtil.showSelectOrgDialog(options);
}

function sleep(){
	flowControlCmd = FlowControlCmd.SLEEP;
    Public.ajax(web_app.name + '/workflowAction!sleep.ajax',
    { taskId:  taskId}, function () {
    	 UICtrl.closeAndReloadTabs("TaskCenter", null);
    });
}

function doMakeACopyFor() {
    var data = this.iframe.contentWindow.selectedData;
    if (data.length == 0) {
        Public.errorTip("请选择知会人员。");
        return;
    }
    var _self = this;

    var receivers = [];

    for (var i = 0; i < data.length; i++) {
        receivers[receivers.length] = data[i].id;
    }

    var params = {};
    params.taskId = taskId;
    params.receivers = $.toJSON(receivers);
    Public.ajax(web_app.name + '/workflowAction!makeACopyFor.ajax',
			params, function () {
			    _self.close();
			});
}

/**
 * 显示自由流设计器
 */
function showFreeFlowDesiger(){
    if (!getId()){
        Public.errorTip("请先保存请假单。");
        return;
    }
    var params = {};

    params.bizId = bizId;
    params.procInstId = procInstId;
    params.procUnitId = procUnitId;
    params.isDoModel = isDoModel();
     
    freeFlowDesiger = UICtrl.showFrameDialog({
            title: '流程环节',
            width : 800,
            height : 450,
            url: web_app.name + '/freeFlowAction!forwardDesigner.do',
            param: params,
            ok : false,
            cancel: false
        });
}

function counterSign() {
	if (isFullFreeFlow()){
		showFreeFlowDesiger();
		return;
	}
	//申请环节 判断流程的当环节是否审批环节，只有审批环节才能加减签
    if (isApplyProcUnit()){    	
    	Public.ajax(web_app.name + '/workflowAction!getProcessInstanceActiveActivityId.ajax',
    	{ procInstId:  procInstId }, function (data) {
    		if (data.indexOf("Approve") > -1){
    			showCounterSignDialog();
    		}			
    		else{
    			Public.errorTip("流程实例的当前环节不是审批环节，不能加减签。");
    		}
		});
    }else{
    	 var params = $.extend({}, getApprovalParams());
         params.showTips =  "false";
         params.onlySaveHandlerData = "true";
         
         Public.ajax(web_app.name + '/workflowAction!saveBizData.ajax',
         params, function (data) {
           showCounterSignDialog();
        });   	
    }
} 

function showCounterSignDialog(){
	var params = {};
    var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();

    params.counterSignKindId = "chief";
    params.procInstId = procInstId;
    params.bizId = bizId;
    params.bizCode = bizCode;
    params.procUnitId = procUnitId;
    params.taskKindId = taskKindId;//任务类型ID
    
    params.groupId = $("#currentHandleGroupId").val();
    
    params = $.extend({}, params, selectOrgParams, { showPosition: false });
    
    UICtrl.showFrameDialog({
        title: '加减签确认',
        width: 800,
        height: 380,
        url: web_app.name + '/workflowAction!showCounterSignDialog.do',
        param: params,
        ok: doCounterSign,
        close: onDialogCloseHandler,
        cancelVal: '关闭',
        cancel: true
    });
}

function doCounterSign() {
    var params = this.iframe.contentWindow.getCounterSignData();
    if (!params) {
        return;
    }

    params.procUnitHandlerId = $("#currentHandleId").val();
    
    var _self = this;

    Public.ajax(web_app.name + '/workflowAction!saveCounterSignHandler.ajax',
			params, function () {
				if (isApplyProcUnit()){ 
					reLoadJobTaskExecutionList(bizId);
				}else{
					reLoadJobTaskExecutionList(bizId, procUnitId);
				}
			    _self.close();
			});
}

/**
* 协审
*/
function assist() {
	flowControlCmd = FlowControlCmd.ASSIST;
    var params = {};
    var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();

    params.bizId = bizId;
    params.procUnitId = procUnitId;
    params.chiefId = $("#currentHandleId").val();
    params = $.extend({}, params, selectOrgParams, { showPosition: false });

    UICtrl.showFrameDialog({
        title: '协审确认',
        width: 800,
        height: 380,
        url: web_app.name + '/workflowAction!showAssistDialog.do',
        param: params,
        ok: doAssist,
        close: onDialogCloseHandler,
        cancelVal: '关闭',
        cancel: true
    });
}

function doAssist() {
    var params = this.iframe.contentWindow.getAssistData();
    if (!params) {
        return;
    }

    params.bizId = bizId;
    params.taskId = taskId;
    params.flowKind = getFlowKind();
    params.procUnitHandlerId = $("#currentHandleId").val();

    var _self = this;

    Public.ajax(web_app.name + '/workflowAction!assist.ajax',
			params, function () {
			    reLoadJobTaskExecutionList(bizId, procUnitId);
			    _self.close();
			});
}

/**
* 是否循环审批环节
*/
function isLoopApprovalProc() {
    return $("#currentHandleAllowAbort").length > 0;
}

// 终止
function abort() {
	flowControlCmd = FlowControlCmd.ABORT;
    //终止任务
    var approvalParams = getApprovalParams();
    if (!procInstId) {
        UICtrl.confirm("您是否要终止当前任务？", function () {
            Public.ajax(web_app.name + '/workflowAction!abortTask.ajax',
                approvalParams, function (data) {
                    UICtrl.closeAndReloadTabs("TaskCenter", null);
                }
            );
        });
        return;
    }

    //终止流程
    if (!isApplyProcUnit() && isLoopApprovalProc() && approvalParams.handleResult != HandleResult.DISAGREE) {
        Public.errorTip("终止操作，处理意见请选择“不同意”。");
        return;
    }

    var extendedData = getExtendedData();
    var params = $.extend({}, { procInstId: procInstId }, approvalParams, extendedData);

    UICtrl.confirm("您是否要终止当前流程？", function () {
        $('#submitForm').ajaxSubmit({
            url: web_app.name + '/workflowAction!abort.ajax',
            param: params,
            success: function () {
                UICtrl.closeAndReloadTabs("TaskCenter", null);
            }
        });
    });
}

/**
* 打印
*/
function print() {
	var url = location.href;
	url=url.replace(/\.(job)\?/g,'.print?');
	window.open(url);
}

// 流程图
function showChart() {
	if (isFullFreeFlow()){
		showFreeFlowDesiger();
		return;
	}
	
    if (!bizId) {
        return;
    }
    UICtrl.showFrameDialog({
        title: '流程图',
        url: web_app.name + '/workflowAction!showFlowChart.load',
        param: { procInstId: procInstId, bizId: bizId, taskId: taskId },
        resize: true,
        width: getDefaultDialogWidth(),
        height: getDefaultDialogHeight(),
        ok: false,
        cancelVal: '关闭',
        cancel: true
    });
}

/**
* 显示审批历史
*/
function showApprovalHistory() {
    if (!bizId) {
        return;
    }
    UICtrl.showFrameDialog({
        title: '流程轨迹',
        width: getDefaultDialogWidth(),
        height: getDefaultDialogHeight(),
        url: web_app.name + '/workflowAction!showApprovalHistory.do',
        param: { bizId: bizId },
        resize: true,
        ok: false,
        cancelVal: '关闭',
        cancel: true
    });
}

function getExtendedData() {
    return {};
}

function getProcessDefinitionFile() {
    return $("#processDefinitionFile").val();
}

function getProcessDefinitionKey() {
    return $("#processDefinitionKey").val();
}

function getProcUnitId() {
    return $("#procUnitId").val();
}

//保存前的逻辑处理，继续执行返回true，中断处理返回false
function beforeSave() {
    return true;
}

function afterSave(bizData) {

}

function reloadGrid() {

}

/**
* 是否为查看模式
* @returns {Boolean}
*/
//function isDetailModel(){
//	return activityModel == "detail";
//}

/**
* 是否为处理模式
* @returns {Boolean}
*/
function isDoModel() {
    return activityModel == "do" && TaskStatus.isToDoStatus(taskStatusId);
}

/**
* 是否流程任务
* @returns {Boolean}
*/
function isProcessTask() {
    return (taskKindId == TaskKind.TASK);
}

function canSave() {
    return isDoModel() && (isProcessTask() || ( TaskKind.isMendTask(taskKindId)) || TaskKind.isReplenishTask(taskKindId));
}

function canDeleteProcessInstance() {
    return isDoModel() && isApplyProcUnit() && procInstId ;
}

function canBack() {
    return isDoModel() && isProcessTask() ; // && (isApproveProcUnit() || (isApplyProcUnit() && previousId));
}

function canSleep(){
	return activityModel == "do" && isProcessTask() && TaskStatus.isReayStatus(taskStatusId) && isApproveProcUnit();
}

function canReplenish(){
	return canBack() && !isApplyProcUnit();
}

function canAdvance() {
    return isDoModel() && (taskKindId != TaskKind.MAKE_A_COPY_FOR && taskKindId != TaskKind.NOTICE);
}

function allowTransfer() {
    return $("#currentHandleAllowTransfer").val() == "1";
}

function canTransfer() {
    return isDoModel() && isProcessTask() && allowTransfer();
}

function allowAdd() {
    return $("#currentHandleAllowAdd").val() == "1";
}

function canAddExecutor() {
	//1、处理的流程任务，配置了允许加减签规则
	//2、申请环节没有结束的流程实例，申请人可以加减签
	//3、完全自由流	
    return !!procInstId && ((isDoModel() && allowAdd()) || (this.isApplyProcUnit() && !isDoModel() && !isProcInstCompleted()))
    || (isDoModel() && isFullFreeFlow());
}

function allowMinusSign() {
    return $("#currentHandleAllowSubtract").val() == "1";
}

function canMinusSign() {
    return isDoModel() && isProcessTask() && allowMinusSign();
}

function canMakeACopyFor() {
    return getId();
}

function canAssist() {
    return !isApplyProcUnit() && isDoModel() && isProcessTask();
}

function allowAbort() {
    return ($("#currentHandleAllowAbort").length == 0) || $("#currentHandleAllowAbort").val() == "1";
}

//流程任务允许终止 或者 非流程任务
function canAbort() {
    return isDoModel() && (isProcessTask() && (allowAbort() || isApplyProcUnit())) && (!TaskKind.isReplenishTask(taskKindId)) ;
}

function canRelate() {
    return isDoModel() && (!!taskId);
}

function canShowChart() {
    return !!procInstId || TaskKind.isReplenishTask(taskKindId) || isFullFreeFlow();
}

function canShowApprovalHistory() {
    return canShowChart();
}

function refreshBtnStatus() {
    if (canSave()) {
        $("#toolBar").toolBar("enable", "save");
    } else {
        $("#toolBar").toolBar("disable", "save");
    }

    if (canDeleteProcessInstance()) {
        $("#toolBar").toolBar("enable", "deleteProcessInstance");
    } else {
        $("#toolBar").toolBar("disable", "deleteProcessInstance");
    }

    if (canBack()) {
        $("#toolBar").toolBar("enable", "back");
    } else {
        $("#toolBar").toolBar("disable", "back");
    }

    if (canReplenish()){
        $("#toolBar").toolBar("enable", "replenish");
    } else {
        $("#toolBar").toolBar("disable", "replenish");
    }
    
    if (canAdvance()) {
        $("#toolBar").toolBar("enable", "advance");
    } else {
        $("#toolBar").toolBar("disable", "advance");
    }

    if (canTransfer()) {
        $("#toolBar").toolBar("enable", "transfer");
    } else {
        $("#toolBar").toolBar("disable", "transfer");
    }

    if (canAddExecutor()) {
        $("#toolBar").toolBar("enable", "counterSign");
    } else {
        $("#toolBar").toolBar("disable", "counterSign");
    }

    if (canMinusSign()) {
        $("#toolBar").toolBar("enable", "minusSign");
    } else {
        $("#toolBar").toolBar("disable", "minusSign");
    }

    if (canAssist()) {
        $("#toolBar").toolBar("enable", "assist");
    } else {
        $("#toolBar").toolBar("disable", "assist");
    }

    if (canAbort()) {
        $("#toolBar").toolBar("enable", "abort");
    } else {
        $("#toolBar").toolBar("disable", "abort");
    }
    
    if (canSleep()) {
        $("#toolBar").toolBar("enable", "sleep");
    } else {
        $("#toolBar").toolBar("disable", "sleep");
    }

    if (canMakeACopyFor()) {
        $("#toolBar").toolBar("enable", "makeACopyFor");
    } else {
        $("#toolBar").toolBar("disable", "makeACopyFor");
    }

    if (canRelate()) {
        $("#toolBar").toolBar("enable", "relate");
    } else {
        $("#toolBar").toolBar("disable", "relate");
    }

    if (canShowChart()) {
        $("#toolBar").toolBar("enable", "showChart");
    } else {
        $("#toolBar").toolBar("disable", "showChart");
    }

    if (canShowApprovalHistory()) {
        $("#toolBar").toolBar("enable", "showApprovalHistory");
    } else {
        $("#toolBar").toolBar("disable", "showApprovalHistory");
    }
}

//AJAX刷新处理人列表
function reLoadJobTaskExecutionList(bizId, procUnitId) {
    procUnitId = procUnitId || 'Approve';
    $("#jobTaskExecutionList").load(web_app.name + "/common/TaskExecutionList.jsp",
			{ bizId: bizId, procUnitId: procUnitId, taskId: taskId }, function () {
			    Public.autoInitializeUI($("#jobTaskExecutionList"));
			}
	);
}

//收藏任务
function saveTaskCollect() {
    if (!bizId) {
        return;
    }
    if (!taskId) {
        return;
    }
    Public.ajax(web_app.name + '/personOwnAction!insertTaskCollect.ajax',
		{ taskId: taskId },
		function () {
		    Public.successTip("任务收藏成功！");
		}
	);
}
/**查询任务关联**/
function getTaskinstRelationsBizId(){
	return bizId;
}

function queryHiTaskinstRelations(fn) {
	var queryBizId= getTaskinstRelationsBizId();
    if (!queryBizId || queryBizId == '') return;
    Public.ajax(web_app.name + "/workflowAction!queryHiTaskinstRelations.ajax", { bizId:queryBizId }, function (data) {
        fn.call(window, data);
    });
}

/**
* 任务关联
*/
function relate() {
    queryHiTaskinstRelations(function (data) {
        UICtrl.showFrameDialog({ title: '协同关联', width: getDefaultDialogWidth(), height: getDefaultDialogHeight(),
            url: web_app.name + '/workflowAction!showSelectTaskDialog.do',
            resize: true,
            init: function () {
                //初始化数据
                var appendRow = this.iframe.contentWindow.appendRow;
                if ($.isFunction(appendRow)) {
                    $.each(data.Rows, function (i, o) {
                        var row = $.extend({}, o);
                        row.id = o.relatedTaskId;
                        appendRow.call(window, row);
                    });
                    //刷新列表
                    var reloadGrid = this.iframe.contentWindow.reloadGrid;
                    reloadGrid.call(window);
                }
            },
            ok: doRelate,
            cancelVal: '关闭',
            cancel: true
        });
    });
}

function doRelate() {
    var _self = this;

    var rows = this.iframe.contentWindow.selectedData;
    /*
    if (!rows || rows.length == 0) {
    Public.errorTip("请选择数据。");
    return false;
    }
    */

    $.each(rows, function (i, o) {
        o.relatedTaskId = o.id;
        o.id = "";
    });

    Public.ajax(web_app.name + "/workflowAction!saveHiTaskinstRelation.ajax", { taskId: taskId, bizId: getTaskinstRelationsBizId(), procInstId: procInstId, data: encodeURI($.toJSON(rows)) }, function () {
        refreshFlag = true;
        _self.close();
        showHiTaskinstRelations(rows);
    });
}
/**
* 初始化关联任务显示
* **/
function initHiTaskinstRelations() {
	if(!$('#jobPageRight').length) return;
    queryHiTaskinstRelations(function (data) {
        showHiTaskinstRelations(data.Rows);
    });
    //绑定关联任务点击事件
    $('#showHiTaskinstRelations').on('click', function (e) {
        var $clicked = $(e.target || e.srcElement);
        if ($clicked.is('a.GridStyle')) {
            var id = $clicked.attr('id'), task = pageHiTaskinstRelations[id];
            if (task) {
                browseTask(task);
            }
        }
    });
    var handleDiv = $('#jobPageFloatHandleDiv');
    if (handleDiv.length > 0) {
        $('#showHiTaskinstRelations').height($('#jobPageRight').height() - $('#jobPageFloatHandleDiv').height() - 35);
    } else {
        $('#showHiTaskinstRelations').height($('#jobPageRight').height() - 35);
    }
}
function showHiTaskinstRelations(data) {
    pageHiTaskinstRelations = {}; //清空数据
    var flag = $('#handleOpinion').length > 0;
    var div = $('#showHiTaskinstRelations');
    if (data && data.length > 0) {
        var html = ['<div>'], title = null;
        $.each(data, function (i, o) {
            pageHiTaskinstRelations[o.relatedTaskId] = $.extend({}, o, { id: o.relatedTaskId }); //写入数据注意id 的处理
            html.push('<div style="margin-left:5px; " class="list_view">');
            html.push('<a href="javascript:void(0);" id="', o.relatedTaskId, '" class="GridStyle">');
            html.push(o.description);
            html.push('</a>');
            html.push('</div>');
        });
        html.push('</div>');
        div.html(html.join('')).show();
        flag = true;
    } else {
        div.empty().hide();
    }
    jobLayoutManager.setRightCollapse(!flag);
}

//隐藏默认toolbar上的按钮
function removeToolBarItem(items) {
    var toolBar = $("#toolBar");
    $.each(items, function (i, p) {
        toolBar.toolBar('removeItem', p, p + '_line');
    });
}

/**
* 是否查询预览处理人
* 系统默认为true
*/
function isQueryHandlers() {
    return true;
}

/**
* 得到子环节ID
*/
function getSubProcUnitId() {
    return $("#currentHandleKindId").val();
}
//初始化浮动处理对话框
function initFloatHandleDialog() {
    if (Public.isReadOnly) {
        return;
    }
    var handleOpinion = $('#handleOpinion');
    var flag = handleOpinion.length > 0;
    if (flag) {//存在操作框
        jobLayoutManager.setRightCollapse(!flag); //显示右边
        var handleResult = $('#handleResult');
        var handleResultData = handleResult.combox('getFormattedData');
        var html = ['<div id="jobPageFloatHandleDiv">'];
        html.push('<div id="navTitle" class="navTitle"><a href="javascript:void(0);" hidefocus class="togglebtn" hideTable="#jobPageFloatHandleOpinionDiv" title="show or hide"></a>');
        html.push('<span class="group">&nbsp;</span>&nbsp;<span class="titleSpan">快捷处理栏</span></div><div class="navline"></div>')
        html.push('<div id="jobPageFloatHandleOpinionDiv">');
        html.push('<textarea id="jobPageFloatHandleOpinion" class="textarea" style="height:56px;">', handleOpinion.val(), '</textarea>');
        html.push('<div style="padding-top:5px;padding-left:5px;padding-bottom:5px;" id="jobPageFloatHandleResultDiv">');
        html.push('<div style="float:left;">');
        $.each(handleResultData, function (i, o) {
        	html.push('<span id="jobPageFloatHandleResultSpan',o['value'],'">');
            html.push('<input type="radio" name="jobPageFloatHandleResult" id="jobPageFloatHandleResult', o['value'], '" value="', o['value'], '"');
            if (o.value == handleResult.val()) {
                html.push(' checked');
            }
            html.push('/>', '<label for="jobPageFloatHandleResult', o['value'], '">', o['text'], '</label>');
            html.push('</span>');
        });
        html.push('</div>');
        html.push('<div id="jobPageFloatHandleDivToolBar"></div>');
        html.push('</div>');
        html.push('</div>');
        html.push('</div>');
        var floatDiv = $(html.join('')).appendTo('#jobPageRight');
        UICtrl.autoGroupAreaToggle(floatDiv);
        $('#jobPageFloatHandleOpinion').maxLength({ maxlength: 300 });
        $('#jobPageFloatHandleDivToolBar').toolBar([{ id: 'floatSubmit', name: '提交', icon: 'turn', event: advance}]);
        $('#jobPageFloatHandleOpinion').on('keyup paste cut', function () {
            setTimeout(function () {
                $('#handleOpinion').val($('#jobPageFloatHandleOpinion').val()).trigger('blur');
            }, 0);
        });
        $('#jobPageFloatHandleResultDiv').on('click', function (e) {
            var $clicked = $(e.target || e.srcElement);
            if ($clicked.is('input')) {
                setTimeout(function () {
                    var value = $clicked.getValue();
                    $('#handleResult').combox('setValue', value);
                }, 0);
            }
        });
        /*floatDiv.drag({ handle: '.navTitle',opacity: 0.8,start:function(){
        floatDiv.css({'bottom':'auto',top:floatDiv.offset().top});
        }});*/
    }
}
//初始化添加评论按钮
function initAddCommentDiv() {
    //if(isDoModel()){//可操作 暂时取消该判断 任何时候允许添加评论
    //保存评论操作
    var doSaveComment = function (handleId, message, fn) {
        var url = web_app.name + "/workflowAction!insertComment.ajax";
        Public.ajax(url, { handleId: handleId, bizId: bizId, message: Public.encodeURI(message) }, function (data) {
            fn.call(window, data);
        });
    };
    //处理关闭按钮时间事件
    var hoverTimer = null;
    var clearHoverTimer = function () { if (hoverTimer) clearTimeout(hoverTimer); };
    var setHoverTimer = function () { hoverTimer = setTimeout(function () { toolBar.hide(); hoverTimer = null }, 500); };
    //添加按钮
    var toolBar = $('<div  id="jobCommentToolBar" style="position:absolute;display:none;z-index:100;"></div>').appendTo('body');
    toolBar.toolBar([
		     { id: 'jobComment', name: '回复意见', icon: 'add', event: function () {
		         var id = toolBar.attr('handleId'),handlerName=toolBar.attr('handlerName');
		         var html = ['<textarea id="jobCommentTextArea" class="textarea" style="height:76px;"></textarea>'];
		         html.push('<div style="text-align:right;padding-right:10px;">', '<input type="button" value="确定" class="buttonGray ok"/>');
		         html.push('&nbsp;&nbsp;', '<input type="button" value="取消" class="buttonGray close"/>', '</div>');
		         var options = { title: '回复['+handlerName+']意见', content: html.join(''), width: 350, opacity: 0.1, onClick: function (e) {
		             if (e.is('input.close')) {
		                 this.close();
		             } else if (e.is('input.ok')) {
		                 var _self = this, comment = $('#jobCommentTextArea').val();
		                 if (comment == '') {
		                     Public.tip("请输入意见回复内容!");
		                     return false;
		                 }
		                 doSaveComment(id, $('#jobCommentTextArea').val(), function (data) {
		                     _self.close();
		                    //刷新页面显示
		                    var showCommentDiv = $('#opinionTextTD' + id);
		                    $("div.comment", showCommentDiv).remove(); //先删除以前数据
		                    //重新组合数据显示
		                    $.each(data, function (i, o) {
		                          var html = ['<div class="comment" style="color:#555555;font-style:italic;">'];
		                          html.push('<b>&nbsp;@', o['userId'], '&nbsp;', o['time'], '&nbsp;:&nbsp;</b>');
		                          html.push(o['fullMessage'], '</div>');
		                          showCommentDiv.append(html.join(''));
		                     });
		                 });
		             }
		         } 
		         };
		         Public.dialog(options);
		         $('#jobCommentTextArea').maxLength({ maxlength: 1000 });
		     } 
		     }
		 ]);
    var toolBarWidth = toolBar.width();
    //opinionTextTD 在标签模板中根据任务处理状态控制是否存在
    $('td.opinionTextTD').hover(function () {
        var offset = $(this).offset(), id = $('input[name="id"]', $(this)).val();
        var handlerName=$(this).attr('handlerName');
        clearHoverTimer();
        toolBar.attr({handleId:id,handlerName:handlerName}).css({ top: offset.top + 1, left: offset.left + $(this).width() - toolBarWidth }).show();
    }, function () {
        clearHoverTimer();
        setHoverTimer();
    });
    toolBar.hover(function () { clearHoverTimer(); }, function () { clearHoverTimer(); setHoverTimer(); });
    //}
}

//隐藏处理结果中已阅选项
function cancelIsReadHandleResult(){
	var handleResult = $('#handleResult');
	if(handleResult.length>0){
		handleResult.combox('setData',{'1':'同意','2':'不同意'});
	}
	var span=$('#jobPageFloatHandleResultSpan3');
	if(span.length>0){
		span.remove();
	}
}