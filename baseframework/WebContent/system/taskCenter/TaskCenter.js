var gridManager, dateRangeKindId = 1, currentTask, requestViewTaskKind, orgTree, parentId;
var shortcutTaskSearchData = {};

$(function () {
    bindEvents();
    UICtrl.autoSetWrapperDivHeight();
    requestViewTaskKind = Public.getQueryStringByName("viewTaskKind");
    if (Public.isBlank(requestViewTaskKind)) {
        requestViewTaskKind = '1';
    }

    initializateUI();
    refreshBtnStatus();
    initializeGrid();
    initToggle();
    
    loadOrgTreeView();
    loadProcTreeView();
    initializateProcKind();
});

function initializateProcKind(){
	var proc=$('#procKindChoose'),offset=proc.offset();
	var bar=$('#uiCssNavigationBar'),ul=$('#uiCssNavigationBarUl');
	bar.css({left:offset.left,top:offset.top,width:proc.width(),height:proc.height()}).show();
	Public.ajax(web_app.name + "/processManageAction!queryGroupProcTree.ajax", {}, function (data) {
		var html=[];
		$.each(data,function(i,o){
			html.push('<li class="a1">');
			html.push('<div class=tx><a href="javascript:;" id="',o['fullId'],'" class="data"><i>&nbsp;</i>',o['name'],'</a> </div>');
			html.push('</li>');
		});
		ul.html(html.join(''));
	});
	bar.on('click',function(e){
		 var $clicked = $(e.target || e.srcElement);
		 if($clicked.is('a.data')){
			 var id=$clicked.attr('id');
			$('#uiCssNavigationTitle').text($clicked.text());
			doQueryByProcKind(id);
		 }
	});
}

function doQueryByProcKind(procFullId){
	UICtrl.gridSearch(gridManager, {procFullId:procFullId});
}

function initializateUI() {
	var toolBarOptions={
		titleLang:TaskButtonLang,
		items:[ { id: 'processTask', name: '处理', icon: 'turn', event: function(){processTask(currentTask); }},
	     { line: true },
	     { id: 'browseTask', name: '查看', icon: 'view', event: function(){browseTask(currentTask);}},
	     { line: true },
	     { id: 'withdrawTask', name: '回收', icon: 'withdraw', event: withdrawTask},
	     { line: true },
	      { id: 'mend', name: '补审', icon: 'assist', event: mend },
	     { line: true },
	     { id: 'recallProcessInstance', name: '撤销', icon: 'recall', event: recallProcessInstance},
         { line: true },
	     { id: 'deleteProcessInstance', name: '删除', icon: 'delete', event: deleteProcessInstance},
	     { line: true },
	     { id: 'showChart', name: '流程图', icon: 'chart', event: processChart},
	     { line: true },
	     { id: 'showApprovalHistory', name: '流程轨迹', icon: 'tables', event: showApprovalHistory},
	     { line: true },
	     { id: 'taskCollect', name: '收藏任务', icon: 'collect', event: saveTaskCollect},
	     { line: true },
	     { id: 'deleteCollect', name: '取消收藏', icon: 'un_collect', event: deleteTaskCollect},
	     { line: true },
	     { id: 'queryTask', name: '高级搜索>>', icon: 'query', event: showTaskQueryDialog},
	     { line: true }]
	};
    $('#taskBar').toolBar(toolBarOptions);
    $("#selectViewTaskKind").combox({ data: $("#selectViewTaskKind1").combox("getJSONData") });
    //$("#searchFieldList").combox({ data: $("#searchFieldList1").combox("getJSONData") });
    //UICtrl.autoGroupAreaToggle();
    //查询条件默认不显示
    //$('#titleConditionArea').find('a.togglebtn').trigger('click');
    //处理快速搜索显示
    $('#titleShortcutTaskSearch').hide();
    queryTaskQueryScheme(); //查询用户定义的查询
    //添加查询输入框
    UICtrl.createQueryBtn('#taskBar', function (value) {
        UICtrl.gridSearch(gridManager, { searchContent: encodeURI(value) });
    });
    $('#taskBar').find('div.ui-grid-query-div').css({ position: 'relative', top: '-4px', margin: '0px' });
}

function bindEvents() {    	
	$("#queryMainForm a.togglebtn").click(function(){
		
	});
	
    $("#selectDateRange").combox({
        onChange: function (item) {
            dateRangeKindId = item.value;
            (dateRangeKindId == 10) ? $("#customDataRange").show() : $("#customDataRange").hide();
        }
    });

    $("#selectViewTaskKind").combox( { checkbox: true });
    //我的任务事件绑定
    $('#myselfTaskSearch').bind('click', function (e) {
        var $clicked = $(e.target || e.srcElement);
        $('div.taskCenterChoose').removeClass('taskCenterChoose');
        if ($clicked.is('div.taskCenterSearch')) {
            requestViewTaskKind = $clicked.attr('taskKind')
            $clicked.addClass('taskCenterChoose');
            //var taskKind = $clicked.attr('taskKind');
            //$clicked.addClass('taskCenterChoose');
         	//reloadTaskGrid(taskKind);
        }
    });
    //快捷查询事件绑定
    $('#shortcutTaskSearch').bind('click', function (e) {
        var $clicked = $(e.target || e.srcElement);
        if ($clicked.is('div.taskCenterSearch')) {
            $('div.taskCenterChoose').removeClass('taskCenterChoose');
            $clicked.addClass('taskCenterChoose');
            var schemeId = $clicked.attr('id');
            var param = shortcutTaskSearchData[schemeId];
            if (param) {
                var tmpParam = {}; //这里需要对中文编码
                tmpParam.queryCategory = "taskQuery";
                $.each(param, function (p, o) {
                    tmpParam[p] = encodeURI(o);
                });
                clearQueryInput();
                UICtrl.gridSearch(gridManager, tmpParam);
                closeTaskQueryDialog();
            }
        } else if ($clicked.hasClass('ui-icon-trash')) {//删除
            deleteTaskQueryScheme($clicked.parent().attr('id'), $clicked.parent().text());
        } else if ($clicked.hasClass('ui-icon-edit')) {//编辑
            var schemeId = $clicked.parent().attr('id');
            var param = shortcutTaskSearchData[schemeId];
            $('#queryMainForm').formSet(param);
            if ($('#divConditionArea').is(':hidden')) {
                $('#titleConditionArea').find('a.togglebtn').trigger('click');
            }
            $('div.updateTaskQueryScheme').removeClass('updateTaskQueryScheme');
            //时间是否显示
            (param.dateRange == 10) ? $("#customDataRange").show() : $("#customDataRange").hide();
            $clicked.parent().addClass('updateTaskQueryScheme');
        }
    });
}


function initializeGrid() {
    gridManager = UICtrl.grid("#maingrid", {
        columns: [
                    { display: "任务分类", name: "procSysName", width:80, minWidth: 60, type: "string", align: "left",
                    	render: function (item) {
                    		var procSysName=item.procSysName;
                    		if(Public.isBlank(procSysName)){
                    			procSysName='协同';
                    		}
                    		return procSysName;
                    	}
                    },
		            { display: "名称", name: "name", width: 120, minWidth: 60, type: "string", align: "left" },
		            { display: "主题", name: "description", width: 300, minWidth: 60, type: "string", align: "left" },
		            { display: "申请人", name: "applicantPersonMemberName", width: 80, minWidth: 60, type: "string", align: "left" },
		            { display: "提交人", name: "creatorPersonMemberName", width: 80, minWidth: 60, type: "string", align: "left" },
		            { display: "提交人机构", name: "creatorOgnName", width: 80, minWidth: 60, type: "string", align: "left" },
		            { display: "提交人部门", name: "creatorDeptName", width: 80, minWidth: 60, type: "string", align: "left" },
		            { display: "类型", name: "catalogId", width: 80, minWidth: 60, type: "string", align: "left",
		                render: function (item) {
		                    var catalogName = "";
		                    if (item.catalogId == "process") {
		                        catalogName = "流程任务";
		                    } else {
		                        catalogName = "协同任务";
		                    }
		                    return catalogName;
		                }
		            },
		            { display: "状态", name: "statusName", width: 80, minWidth: 60, type: "string", align: "left" },
		            { display: "编码", name: "bizCode", width: 120, minWidth: 60, type: "string", align: "left" },
		            { display: "提交时间", name: "startTime", width: 140, minWidth: 60, type: "time", align: "left" },
		            { display: "执行人", name: "executorPersonMemberName", width: 80, minWidth: 60, type: "string", align: "left" },
		            { display: "执行时间", name: "endTime", width: 140, minWidth: 60, type: "time", align: "left" }
		 ],
        dataAction: "server",
        url: web_app.name + "/workflowAction!queryTasks.ajax",
        pageSize: 20,
        parms: { queryCategory: "myTransaction", viewTaskKindList: requestViewTaskKind },
        width: "99.8%",
        height: '100%',
        rownumbers: true,
        heightDiff: -10,
        headerRowHeight: 25,
        rowHeight: 25,
        sortName: 'startTime',
        sortOrder: 'desc',
        fixedCellHeight: true,
        selectRowButtonOnly: true,
        onSuccess: function () {
            currentTask = null;
            refreshBtnStatus();
        },
        onDblClickRow: function (data, rowIndex, rowObj) {
            if (canExecute()) {
                processTask(data);
            }
            else {
                browseTask(data);
            }
        },
        onSelectRow: function (data, rowindex, rowobj) {
            currentTask = data;
            refreshBtnStatus();
        },
        rowAttrRender: function (item, rowid) {
            currentTask = item;
            if (isToDoStatus() && isExecutor()) {
                return "style='font-weight:bold;'";
            }
            return '';
        }
    });
}

function getStartDate() {
    return $("#editStartDate").val();
}

function getEndDate() {
    return $("#editEndDate").val();
}
function clearQueryInput() {
    $('#taskBar').find('div.ui-grid-query-div').find('input').val('');
}

function isMySelfTaskKind(){
	return requestViewTaskKind  == "5";
}

function getAdministrativeOrgFullId(){
	//if (!isMySelfTaskKind()){
    var org = $('#orgTree').commonTree('getSelected');
   	if (org) {
   		var hasPermission = org.managerPermissionFlag;
   		if (hasPermission){
   			return org.fullId;
		}
	}
	 //}	
	 return "";
}

function getProcDefineId(){
	var proc = $('#procTree').commonTree('getSelected');
	if (proc){
		return proc.key;
	}
	 return "";
}

function query(obj) {
    if (dateRangeKindId == 10 && (!getStartDate() || !getEndDate())) {
        Public.tip("请选择开始日期和结束日期！");
        return;
    }
    //$('div.taskCenterChoose').removeClass('taskCenterChoose');
    clearQueryInput();
    var params = $(obj).formToJSON();
    
    params.queryCategory = "taskQuery";
    
    params.viewTaskKindList = requestViewTaskKind;
    params.administrativeOrgFullId = getAdministrativeOrgFullId();
	params.procDefineId =	getProcDefineId();
	params.onlyQueryApplyProcUnit = $("#onlyQueryApplyProcUnit1").is(":checked");
	params.singleProcInstShowOneTask = $("#singleProcInstShowOneTask1").is(":checked"); 

    UICtrl.gridSearch(gridManager, params);
    closeTaskQueryDialog();//关闭对话框
}

//刷新表格
function reloadGrid() {
    gridManager.loadData();
}

function hasData() {
	try{
		return gridManager.getData().length > 0 && currentTask;
	}catch(e){
		return false;
	}
}

function isToDoStatus() {
	return TaskStatus.isToDoStatus(currentTask.statusId);
}

function isCompletedStatus(){
	return TaskStatus.isCompletedStatus(currentTask.statusId); 
}

/**
* 是否为创建者
* 
* @returns {Boolean}
*/
function isCreator() {
    var creatorFullId = currentTask.creatorFullId;
    var operator = ContextUtil.getOperator();
    var id = operator["id"];

    return (creatorFullId.indexOf("/" + id) != -1);
}

/**
 * 是否流程起始任务
 * @return {}
 */
function   isRootTask(){
	return !currentTask.previousId;
}

function isApplyActivity() {
    return currentTask.taskDefKey == "Apply";
}

/**
* 是否为执行人
* 
* @param task
* @returns {Boolean}
*/
function isExecutor() {
    var executorFullId = currentTask.executorFullId;
    var operator = ContextUtil.getOperator();
    var id = operator["id"];

    var result = false;
    if (executorFullId) {
        if (executorFullId.indexOf("/" + id) != -1) {
            result = true;
        } else {
            /*var items = Public.Context.getAllPersonMemberFIDs();
            if (items!=null){
            for(var i = 0; i < items.length; i++) {
            //有设计问题：当前认为一个人不仅可以处理自己的任务，而且还可以处理自己上层组织(包括所有上层)的任务
            if (startsWith(items[i], executorFullId)){
            result = true;
            break;
            }
            }
            }
            */
        }
    }
    return result;
};

/**
* 是否可以执行
* 
* @returns {Boolean}
*/
function canExecute() {
    return hasData() && isToDoStatus() && isExecutor();
}

function canBrowse() {
    return hasData();
}

function isFlow() {
    return !!currentTask.procInstId;
}

function isProcInstCompleted(){
	return !!currentTask.procInstEndTime;
}

function isProcessTask() {
    return (currentTask.catalogId == "process");
}

function canShowChart() {
    return hasData() && (isFlow() || TaskKind.isReplenishTask(currentTask.kindId));
}

function canShowApprovalHistory() {
    return hasData() &&  (isFlow() || TaskKind.isReplenishTask(currentTask.kindId));
}

function canShowTaskCollect() {
    return hasData() && (isFlow() || TaskKind.isMakeACopyFor(currentTask.kindId));
}

function canRecallProcessInstance(){
	return hasData() && isCreator() && isFlow() && isApplyActivity() && isCompletedStatus() && !isProcInstCompleted();
}

function canDeleteProcessInstance() {
    //我的正在处理的申请流程任务
	return hasData() && isCreator() && isFlow()  && isApplyActivity() && isToDoStatus()&& isRootTask();
}

function canMend(){
	return hasData() && isCreator() && isFlow() && isApplyActivity() && isProcInstCompleted();
}

function canWithdraw() {
    return hasData() && isToDoStatus() && isCreator() && isProcessTask() && !isApplyActivity();
}

function refreshBtnStatus() {
    if (canExecute()) {
        $("#taskBar").toolBar("enable", "processTask");
    } else {
        $("#taskBar").toolBar("disable", "processTask");
    }

    if (canBrowse()) {
        $("#taskBar").toolBar("enable", "browseTask");
    } else {
        $("#taskBar").toolBar("disable", "browseTask");
    }

    if (canWithdraw()) {
        $("#taskBar").toolBar("enable", "withdrawTask");
    } else {
        $("#taskBar").toolBar("disable", "withdrawTask");
    }

    if (canShowChart()) {
        $("#taskBar").toolBar("enable", "showChart");
    } else {
        $("#taskBar").toolBar("disable", "showChart");
    }

    if (canShowApprovalHistory()) {
        $("#taskBar").toolBar("enable", "showApprovalHistory");
    } else {
        $("#taskBar").toolBar("disable", "showApprovalHistory");
    }

    if (canShowTaskCollect()) {
        $("#taskBar").toolBar("enable", "taskCollect");
        $("#taskBar").toolBar("enable", "deleteCollect");
    } else {
        $("#taskBar").toolBar("disable", "taskCollect");
        $("#taskBar").toolBar("disable", "deleteCollect");
    }

    if (canDeleteProcessInstance()) {
        $("#taskBar").toolBar("enable", "deleteProcessInstance");
    } else {
        $("#taskBar").toolBar("disable", "deleteProcessInstance");
    }
    
    if (canMend()){
        $("#taskBar").toolBar("enable", "mend");
    } else {
        $("#taskBar").toolBar("disable", "mend");
    }
    
    if (canRecallProcessInstance()){
    	$("#taskBar").toolBar("enable", "recallProcessInstance");
    } else {
        $("#taskBar").toolBar("disable", "recallProcessInstance");
    }
};

/**
* 回收任务
*/
function withdrawTask() {
    if (currentTask) {
        UICtrl.confirm("您要回收当前选中的任务吗？", function () {
            Public.ajax(web_app.name + '/workflowAction!withdrawTask.ajax',
			{ taskId: currentTask.id, previousId: currentTask.previousId, operateKind: "withdraw" }, function () {
			    Public.successTip("您已成功回收任务。");
			    reloadGrid();
			});
        });
    }
}

/**
* 显示流程图
*/
function processChart() {
    if (currentTask) {
        UICtrl.showFrameDialog({
            title: '流程图',
            url: web_app.name + '/workflowAction!showFlowChart.do',
            param: { procInstId: currentTask.procInstId, bizId: currentTask.bizId, taskId: currentTask.id },
            resize: true,
            width: getDefaultDialogWidth(),
            height: getDefaultDialogHeight(),
            ok: false,
            cancelVal: '关闭',
            cancel: true
        });
    }
}

/**
* 显示审批历史
*/
function showApprovalHistory() {
    if (currentTask) {
        UICtrl.showFrameDialog({
            title: '流程轨迹',
            width: getDefaultDialogWidth(),
            height: getDefaultDialogHeight(),
            url: web_app.name + '/workflowAction!showApprovalHistory.do',
            param: { bizId: currentTask.bizId },
            resize: true,
            ok: false,
            cancelVal: '关闭',
            cancel: true
        });
    }
}

//保存任务查询方案
function saveQueryScheme(obj) {
    if (dateRangeKindId == 10 && (!getStartDate() || !getEndDate())) {
        Public.tip("请选择开始日期和结束日期！");
        return;
    }
    var param = $(obj).formToJSON({ encode: false });
    //附件参数
    param.administrativeOrgFullId = getAdministrativeOrgFullId();
	param.procDefineId =	getProcDefineId();
	param.onlyQueryApplyProcUnit = $("#onlyQueryApplyProcUnit1").is(":checked");
	param.singleProcInstShowOneTask = $("#singleProcInstShowOneTask1").is(":checked"); 
	param.viewTaskKindList = requestViewTaskKind;
	
    var div = $('#shortcutTaskSearch').find('div.updateTaskQueryScheme');
    var schemeId = '', schemeName = '';
    if (div.length > 0) {
        schemeId = div.attr('id');
        schemeName = div.text();
    }
    var html = ['<div style="width:240px">', '方案名称&nbsp;'];
    html.push('<font color=red>*</font>:&nbsp;');
    html.push('<input type="text" class="text" style="width:170px;" maxlength="30" id="taskQuerySchemeName" value="', schemeName, '">');
    html.push('</div>');
    UICtrl.showDialog({
        title: '保存查询方案', width: 250, height: 60,
        content: html.join(''),
        ok: function () {
            var _self = this;
            var name = $('#taskQuerySchemeName').val();
            if (name == '') {
                Public.tip("请输入查询方案名称!");
                return;
            }
            var url = web_app.name + '/personOwnAction!saveQueryScheme.ajax';
            Public.ajax(url, { schemeId: schemeId, schemeKind: 'task', name: encodeURI(name), param: encodeURI($.toJSON(param)) }, function (data) {
                queryTaskQueryScheme();
                _self.close();
            });
        }
    });
}

/*获取任务查询方案列表*/
function queryTaskQueryScheme() {
    var url = web_app.name + '/personOwnAction!queryQueryScheme.ajax';
    var div = $('#shortcutTaskSearch').find('div.updateTaskQueryScheme'), schemeId = '';
    if (div.length > 0) {
        schemeId = div.attr('id');
    }
    Public.ajax(url, { schemeKind: 'task' }, function (data) {
        var div = $('#shortcutTaskSearch'), length = data.length;
        if (length > 0) {
            $('#titleShortcutTaskSearch').show();
            $('#shortcutTaskSearch').show();
        } else {
            $('#titleShortcutTaskSearch').hide();
            $('#shortcutTaskSearch').hide();
        }
        shortcutTaskSearchData = {};
        var style = '', className = '', html = [];
        $.each(data, function (i, o) {
            style = '';
            className = 'taskCenterSearch';
            if (i == length - 1) {
                style = 'style="border: 0px;"';
            }
            if (schemeId == o.schemeId) {//选中样式处理
                className += ' updateTaskQueryScheme';
            }
            html.push('<div class="', className, '" id="', o.schemeId, '" ', style, '>');
            html.push('<span class="ui-icon-trash" title="删除"></span>');
            html.push('<span class="ui-icon-edit" title="编辑"></span>');
            html.push(o.name);
            html.push('</div>');
            shortcutTaskSearchData[o.schemeId] = $.evalJSON(o.param);
        });
        div.html(html.join(''));
    });
}

//删除查询方案
function deleteTaskQueryScheme(schemeId, name) {
    UICtrl.confirm('您确定删除<font color=red>[' + name + ']</font>吗?', function () {
        Public.ajax(web_app.name + '/personOwnAction!deleteQueryScheme.ajax', { schemeId: schemeId }, function () {
            queryTaskQueryScheme();
        });
    });
}

//撤销流程
function recallProcessInstance(){
	//流程实例没有完成 、申请环节已提交才能撤销流程实例
	if (currentTask  && currentTask.taskDefKey == "Apply" ) {
        UICtrl.confirm("您是否要撤销当前流程？", function () {
            Public.ajax(web_app.name + '/workflowAction!recallProcessInstance.ajax',
			{ procInstId: currentTask.procInstId, taskId: currentTask.id }, function () {
			    Public.successTip("您已成功撤销当前流程。");
			    reloadGrid();
			});
        });
    }
}

//删除流程实例
function deleteProcessInstance() {
    if (currentTask) {
        UICtrl.confirm("您是否要删除当前选中的任务？", function () {
            Public.ajax(web_app.name + '/workflowAction!deleteProcessInstance.ajax',
			{ procInstId: currentTask.procInstId },
			function () {
			    Public.successTip("您已成功删除当前流程。");
			    reloadGrid();
			});
        });
    }
}

function showMendDialog(){
	var params = {};
    var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();

    params.procInstId = currentTask.procInstId;
    params.bizId = currentTask.bizId;
    params.bizCode = currentTask.bizCode;
    params.counterSignKindId = "mend";
    
    params = $.extend({}, params, selectOrgParams);
    
    UICtrl.showFrameDialog({
        title: '补审确认',
        width: 800,
        height: 380,
        url: web_app.name + '/workflowAction!showCounterSignDialog.do',
        param: params,
        ok: doMend,
        close: onDialogCloseHandler,
        cancelVal: '关闭',
        cancel: true
    });
}

function doMend() {
	var counterSignWindow = this.iframe.contentWindow;
    var params = counterSignWindow.getCounterSignData();
    if (!params) {
        return;
    }

    params.bizId = currentTask.bizId;
    params.procUnitId = counterSignWindow.procUnitId;
    
    var _self = this;

    Public.ajax(web_app.name + '/workflowAction!mend.ajax',
			params, function () {
				_self.close();
			});
}

//补审
function mend(){
   if (currentTask) {
        UICtrl.confirm("您是否对当前流程实例发起补审？", function () {
            showMendDialog();
        });
    }
}

//保存收藏任务
function saveTaskCollect() {
    if (currentTask) {
        Public.ajax(web_app.name + '/personOwnAction!insertTaskCollect.ajax',
			{ taskId: currentTask.id },
			function () {
			    Public.successTip("任务收藏成功。");
			}
		);
    }
}

//取消任务收藏
function deleteTaskCollect() {
    if (currentTask) {
        UICtrl.confirm("您是否要取消收藏当前选中的任务？", function () {
            Public.ajax(web_app.name + '/personOwnAction!deleteTaskCollect.ajax',
			{ taskId: currentTask.id },
			function () {
			    Public.successTip("您已成功取消收藏当前任务。");
			    if ($('#myselfCollect').hasClass('taskCenterChoose')||requestViewTaskKind  == "6") {
			        reloadGrid();
			    }
			});
        });
    }
}
//刷新任务列表
function reloadTaskGrid(taskKind){
	   gridManager.options.parms = {};
       clearQueryInput();
       closeTaskQueryDialog();
       requestViewTaskKind=taskKind;
       UICtrl.gridSearch(gridManager, { queryCategory: "myTransaction", viewTaskKindList: taskKind });
       $('#uiCssNavigationTitle').text('流程任务分类');
}
//打开高级搜索对话框
function showTaskQueryDialog(){
	var div=$('#advancedQueryDiv');
	var initFlag=div.attr('initFlag');
	if(!initFlag){//事件只绑定一次
		div.drag({ handle: '.title',opacity: 0.8,start:function(){
			div.addClass('ui_state_drag');
		},stop:function(){
			div.removeClass('ui_state_drag');
		}});
		div.on('mousedown',function(e){
			var $clicked = $(e.target || e.srcElement);
			if($clicked.is('a.close')){
				closeTaskQueryDialog();
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
		});
		div.attr('initFlag',true);
	}
	var screenOver=$('#jquery-screen-over');
	if(!screenOver.length){
		screenOver=$('<div id="jquery-screen-over" style="position:absolute;top:0px;left:0px;width:0;height:0;z-index:10000;display:none;"></div>').appendTo('body');
	}
	var d = $(document), w=d.width(), h=d.height(), mt = d.scrollTop(), ml = d.scrollLeft();
	var rootEl=document.compatMode=='CSS1Compat'?document.documentElement:document.body;	//根元素
	var width=500,opacity=0.1;
	var diagtop =34,diagleft = (rootEl.clientWidth-width+ml)/2;
	div.css({width:width,top:diagtop,left:diagleft,zIndex:101}).show();
	$("#myselfTaskSearch div.taskCenterChoose[taskKind='" + requestViewTaskKind + "']").addClass("taskCenterChoose");
	screenOver.css({
			width:'100%',
			height:'100%',
			background:'#001',
			zIndex:100,
			filter:'alpha(opacity='+(opacity*100)+')',
			opacity:opacity
	}).show();
}
function closeTaskQueryDialog(){
	$('#advancedQueryDiv').hide();
	$('#jquery-screen-over').hide();
}

function loadOrgTreeView() {
    $('#orgTree').commonTree({
        loadTreesAction:  web_app.name + '/orgAction!queryOrgs.ajax',
        parentId: 'orgRoot',
        getParam: function (e) {
            if (e) {
                return { showDisabledOrg: 0, displayableOrgKinds: "ogn,dpt,pos,psm" };
            }
            return { showDisabledOrg: 0 };
        },
        manageType: 'taskQuery,admin',
        isLeaf: function (data) {
            data.nodeIcon = OpmUtil.getOrgImgUrl(data.orgKindId, data.status, false);
        },
        IsShowMenu: false
    });
}

function loadProcTreeView(){
	$('#procTree').commonTree({
        loadTreesAction: '/processManageAction!slicedQueryProc.ajax',
        idFieldName: 'reProcdefTreeId',
        parentIDFieldName: "parentId",
        textFieldName: "name",
        parentId: 0,
        IsShowMenu: false
    });
}

function internalInitToggle(el){	
	$(el + "  a.togglebtn").addClass("togglebtn-down");
	  
    $(el +" a.togglebtn").click(function () {
    	  if ($(this).hasClass("togglebtn-down")){
    	  	var hasClass = $(this).hasClass("togglebtn-down");
    	  	$(el + " .tableInput").hide();
	    	$(el + " a.togglebtn").addClass("togglebtn-down");
	    	
	    	var hideTable=$(this).attr('hideTable');
	    	if(!Public.isBlank(hideTable)){
	    		$.each(hideTable.split(','),function(i,expr){
	    			$(expr).toggle();
	    		 });
	    	}
	    	$(this).removeClass('togglebtn-down');
    	 }
    });
    
    $(el + " a.togglebtn::eq(0)").trigger("click");
}

function initToggle(){
	internalInitToggle("#taskKind");
    internalInitToggle("#condition");
}