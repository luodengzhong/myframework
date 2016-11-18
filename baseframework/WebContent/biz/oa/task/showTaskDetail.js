var reportGridManager = null, taskAuditGridManager = null, taskAdjustGridManager = null, gridManager_Previous = null, selectPlanTypeDialog, gridManager_Document = null, gridManager_Guide = null, owningObjectId = 0;
var taskReportingWork = {};
$(document).ready(function () {
    taskReportingWork = $('#mainTaskReportingWork').combox('getFormattedData');
    initializeUI();
    bindEvent();
    queryTaskPerson($('#taskId').val());// 调用taskPersonChooseUtil.js中方法
    enableAdjustTaskBill();
//    initTaskProcess();
    completeOATask();
});
//readOnly:$el.attr('readOnly')||false,//只读不能编辑
function initializeUI() {
    owningObjectId = $('#owningObjectId').val();
    var managerType = $('#managerType').val();
    $('#mainInfoTab').tab();
    $('#detailTab').tab();
    $('#taskReportKindId').combox({
        data: taskReportingWork,
        checkbox: true
    });
    UICtrl.disable($('#taskReportKindId'));
    var pageType = $('#pageType').val();
    var isPlanningSpecialist = $('#isPlanningSpecialist').val();
    var isDutyPerson = $('#isDutyPerson').val();
    if (pageType == 'backstage' || isPlanningSpecialist == 1 || isDutyPerson >=1) {
	    $('#taskDetailFileList').fileList(
	        {
	            readOnly: true,
	            downloadEnable:isDutyPerson ==1?false:true,//是否允许下载附件 可以为一个函数,执行人不允许下载
	            bizId: $('#taskId').val(),
	            autoload: true,
	            queryUrl: web_app.name
	            + '/planTaskManagerAction!queryAttachmentList.ajax'// 这里需要把任务相关的全部附件查询出来
	        });
	    var rows = $("div.ui-attachment-list");
	    $.each(rows, function (index, market) {
	        $('#' + market.id).fileList(
	    	        {
	    	            readOnly: true,
	    	            downloadEnable:isDutyPerson ==1?false:true//是否允许下载附件 可以为一个函数,执行人不允许下载
	    	        });
	    });
    }
    initOwnerAndDeptChoose();// 调用taskPersonChooseUtil.js中方法
    if (managerType == 1) {
        $('#toolBar').toolBar([{
            id: 'save',
            name: '保存',
            icon: 'save',
            event: savePlan
        }, /*{
            id: 'criticalLink',
            name: '关联总控',
            icon: 'assist',
            event: function () {
                criticalLink();
            }
        },*/ {
            line: true,
            id: 'save_line'
        }, {
            id: 'supervisePlan',
            name: '督办',
            icon: 'assist',
            event: function () {
                collectionPlan("supervise");
            }
        }, {
            line: true,
            id: 'save_line'
        },
            // { id: 'unSupervisePlan', name: '取消督办', replenish: 'stop', event:
            // function () {unCollectionPlan("supervise");} },
            // { line: true, id: 'advance_line' },
            {
                id: 'attentionPlan',
                name: '关注',
                icon: 'relation',
                event: function () {
                    collectionPlan("attention");
                }
            }, {
                id: 'unAattentionPlan',
                name: '取消关注',
                icon: 'back',
                event: function () {
                    unCollectionPlan("attention");
                }
            }, {
                line: true,
                id: 'advance_line'
            }, {
                id: 'collectionPlan',
                name: '收藏',
                icon: 'collect',
                event: function () {
                    collectionPlan("collection");
                }
            }, {
                id: 'unCollectionPlan',
                name: '取消收藏',
                icon: 'replenish',
                event: function () {
                    unCollectionPlan("collection");
                }
            }, {
                line: true,
                id: 'transfer_line'
            }, {
                id: 'progressReporting',
                name: '汇报',
                icon: 'view',
                event: function () {
                    progressReporting();
                }
            }, {
                id: 'applyEdit',
                name: '调整',
                icon: 'edit',
                event: function () {
                    applyEdit();
                }
            }, {
                line: true,
                id: 'transfer_line'
            }]);
    } else {

        $('#toolBar').toolBar([{
            id: 'save',
            name: '保存',
            icon: 'save',
            event: savePlan
        }, {
            line: true,
            id: 'save_line'
        }, {
            id: 'supervisePlan',
            name: '督办',
            icon: 'assist',
            event: function () {
                collectionPlan("supervise");
            }
        }, {
            line: true,
            id: 'save_line'
        },
            // { id: 'unSupervisePlan', name: '取消督办', replenish: 'stop', event:
            // function () {unCollectionPlan("supervise");} },
            // { line: true, id: 'advance_line' },
            {
                id: 'attentionPlan',
                name: '关注',
                icon: 'relation',
                event: function () {
                    collectionPlan("attention");
                }
            }, {
                id: 'unAattentionPlan',
                name: '取消关注',
                icon: 'back',
                event: function () {
                    unCollectionPlan("attention");
                }
            }, {
                line: true,
                id: 'advance_line'
            }, {
                id: 'collectionPlan',
                name: '收藏',
                icon: 'collect',
                event: function () {
                    collectionPlan("collection");
                }
            }, {
                id: 'unCollectionPlan',
                name: '取消收藏',
                icon: 'replenish',
                event: function () {
                    unCollectionPlan("collection");
                }
            }, {
                line: true,
                id: 'transfer_line'
            }, {
                id: 'progressReporting',
                name: '汇报',
                icon: 'view',
                event: function () {
                    progressReporting();
                }
            }, {
                id: 'applyEdit',
                name: '调整',
                icon: 'edit',
                event: function () {
                    applyEdit();
                }
            }, {
                line: true,
                id: 'transfer_line'
            }]);

    }
}

function bindEvent() {
    $('#mainInfoTab').on('click', function (e) {
        var $clicked = $(e.target || e.srcElement);
        if ($clicked.is('li')) {
            var id = $clicked.attr('id');
            if (id == 'showExtendedField') {// 扩展字段加载
                var $el = $('#taskExtendedField');
                var extendedCode = $('#businessCode').val();
                var code = $el.attr('businessCode') || '';
                if (extendedCode == code)
                    return;
                $el.empty().removeAttr('businessCode').removeData();
                if (extendedCode == '')
                    return;
                $el.extendedField({
                    businessCode: extendedCode,
                    bizId: $('#taskId').val(),
                    onInit: function () {
                        $el.attr('businessCode', extendedCode);
                        UICtrl.setReadOnly($el);
                    }
                });
            }
        }
    });
    $('#detailTab').on(
        'click',
        function (e) {
            var $clicked = $(e.target || e.srcElement);
            if ($clicked.is('li')) {
                var id = $clicked.attr('id');
                if (id == 'taskReportList') {
                    if (!reportGridManager) {
                        initializeReportGrid();
                    }
                    reportGridManager._onResize.ligerDefer(
                        reportGridManager, 50);
                } else if (id == 'taskauditList') {
                    if (!taskAuditGridManager) {
                        initializeTaskAddAuditGridGrid();
                    }
                    taskAuditGridManager._onResize.ligerDefer(
                        taskAuditGridManager, 50);
                } else if (id == 'taskadjustList') {
                    if (!taskAdjustGridManager) {
                        initializeTaskAdjustGridGrid();
                    }
                    taskAdjustGridManager._onResize.ligerDefer(
                        taskAdjustGridManager, 50);
                } else if (id == 'docGuideList') {
                    if (!gridManager_Document || !gridManager_Guide) {
                        initializeDocumentGrid();
                        initializeGuideGrid();
                    }
                    gridManager_Document._onResize.ligerDefer(
                        gridManager_Document, 50);
                    gridManager_Guide._onResize.ligerDefer(
                        gridManager_Guide, 50);
                } else if (id == 'previousTaskList') {
                    if (!gridManager_Previous) {
                        initializePreviousGrid();
                    }
                    gridManager_Previous._onResize.ligerDefer(
                        gridManager_Previous, 50);
                }
            }
        });
}

function initializeReportGrid() {
    reportGridManager = UICtrl.grid('#taskReportGrid', {
        columns: [
            {
                display: "完成进度",
                name: "percentComplete",
                width: 60,
                minWidth: 60,
                type: "string",
                align: "left"
            },
            {
                display: "完成情况说明",
                name: "reportContent",
                width: 600,
                minWidth: 60,
                type: "string",
                align: "left",
                render: function (item) {
                    return ['<div title="', item.reportContent, '">',
                        item.reportContent, '</div>'].join('');
                }
            }, {
                display: "提交日期",
                name: "fillinDate",
                width: 100,
                minWidth: 60,
                type: "string",
                align: "left"
            }, {
                display: "汇报人",
                name: "personMemberName",
                width: 100,
                minWidth: 60,
                type: "string",
                align: "left"
            }, {
                display: "状态",
                name: "statusTextView",
                width: 60,
                minWidth: 60,
                type: "string",
                align: "left"
            }, {
                display: "实际开始日期",
                name: "actualStart",
                width: 100,
                minWidth: 60,
                type: "date",
                align: "left"
            }, {
                display: "实际完成日期",
                name: "actualFinish",
                width: 100,
                minWidth: 60,
                type: "date",
                align: "left"
            }, {
                display: "预计完成时间",
                name: "estimatedFinish",
                width: 100,
                minWidth: 60,
                type: "date",
                align: "left"
            }],
        dataAction: 'server',
        url: web_app.name
        + '/planTaskManagerAction!slicedQueryTaskReport.ajax',
        parms: {
            planTaskId: $('#taskId').val()
        },
        pageSize: 10,
        width: '99.5%',
        height: '300',
        headerRowHeight: 25,
        rowHeight: 25,
        sortName: 'fillinDate',
        sortOrder: 'desc',
        fixedCellHeight: true,
        selectRowButtonOnly: true,
        isShowDetailToggle: function (item) {
            return parseInt(item.percentComplete, 10) == 100;
        },
        detail: {
            height: 'auto',
            onShowDetail: function (row, detailPanel, callback) {
                var url = web_app.name + '/common/TaskExecutionList.jsp';
                Public.load(url, {
                    procUnitId: 'Approve',
                    bizId: row.taskReportId
                }, function (data) {
                    var div = $('<div></div>').css({
                        'paddingLeft': '20px',
                        'paddingTop': '5px',
                        overflow: 'hidden'
                    });
                    div.html(data);
                    $(detailPanel).append(div);
                });
            }
        },
        onDblClickRow: function (data, rowindex, rowobj) {
            viewTaskReport(data);
        }
    });
}
//initializeTaskAdjustGrid Grid
function initializeTaskAdjustGridGrid() {
    taskAdjustGridManager = UICtrl.grid('#taskAdjustGrid', {
        columns: [{
            display: "填表日期",
            name: "fillinDate",
            width: 100,
            minWidth: 60,
            type: "date",
            align: "left"
        }, {
            display: "单据号码",
            name: "billCode",
            width: 100,
            minWidth: 60,
            type: "string",
            align: "left"
        }, {
            display: "提交人",
            name: "personMemberName",
            width: 100,
            minWidth: 60,
            type: "string",
            align: "left"
        }, {
            display: "主题",
            name: "subject",
            width: 100,
            minWidth: 60,
            type: "string",
            align: "left"
        }, {
            display: "调整类型",
            name: "adjustTaskKindTextView",
            width: 100,
            minWidth: 60,
            type: "string",
            align: "left"
        }, {
            display: "调整原因",
            name: "adjustReason",
            width: 200,
            minWidth: 60,
            type: "string",
            align: "left"
        }, {
            display: "调整前任务级别",
            name: "oldTaskLevelTextView",
            width: 100,
            minWidth: 60,
            type: "string",
            align: "left"
        }, {
            display: "原计划开始时间",
            name: "oldStartDate",
            width: 100,
            minWidth: 60,
            type: "date",
            align: "left"
        }, {
            display: "原计划结束时间",
            name: "oldFinishDate",
            width: 100,
            minWidth: 60,
            type: "date",
            align: "left"
        }, {
            display: "调整后任务级别",
            name: "taskLevelTextView",
            width: 100,
            minWidth: 60,
            type: "string",
            align: "left"
        }, {
            display: "调整后计划开始时间",
            name: "startDate",
            width: 100,
            minWidth: 60,
            type: "date",
            align: "left"
        }, {
            display: "调整后计划结束时间",
            name: "finishDate",
            width: 100,
            minWidth: 60,
            type: "date",
            align: "left"
        }],
        dataAction: 'server',
        url: web_app.name
        + '/planTaskManagerAction!slicedQueryTaskAdjust.ajax',
        parms: {
            taskId: $('#taskId').val()
        },
        pageSize: 10,
        width: '99.5%',
        height: '300',
        headerRowHeight: 25,
        rowHeight: 25,
        sortName: 'fillinDate',
        sortOrder: 'desc',
        fixedCellHeight: true,
        selectRowButtonOnly: true,
        detail: {
            height: 'auto',
            onShowDetail: function (row, detailPanel, callback) {
                var url = web_app.name + '/common/TaskExecutionList.jsp';
                Public.load(url, {
                    procUnitId: 'Approve',
                    bizId: null == row.billCode ? row.relationAdjustAskId
                        : row.adjustAskId
                }, function (data) {
                    var div = $('<div></div>').css({
                        'paddingLeft': '20px',
                        'paddingTop': '5px',
                        overflow: 'hidden'
                    });
                    div.html(data);
                    $(detailPanel).append(div);
                });
            }
        },
        onDblClickRow: function (data, rowindex, rowobj) {
            viewTaskAdjust(data);
        }
    });
}

//initializeTaskAddAuditGrid Grid
function initializeTaskAddAuditGridGrid() {
    taskAuditGridManager = UICtrl.grid('#taskAddAuditGrid', {
        columns: [{
            display: "填表日期",
            name: "fillinDate",
            width: 100,
            minWidth: 60,
            type: "date",
            align: "left"
        }, {
            display: "单据号码",
            name: "billCode",
            width: 100,
            minWidth: 60,
            type: "string",
            align: "left"
        }, {
            display: "提交人",
            name: "personMemberName",
            width: 100,
            minWidth: 60,
            type: "string",
            align: "left"
        }, {
            display: "主题",
            name: "subject",
            width: 100,
            minWidth: 60,
            type: "string",
            align: "left"
        }, {
            display: "公司名称",
            name: "organName",
            width: 100,
            minWidth: 60,
            type: "string",
            align: "left"
        }, {
            display: "部门",
            name: "deptName",
            width: 200,
            minWidth: 60,
            type: "string",
            align: "left"
        }, {
            display: "全路径",
            name: "planFullName",
            width: 100,
            minWidth: 60,
            type: "string",
            align: "left"
        }

        ],
        dataAction: 'server',
        url: web_app.name + '/planAuditAction!slicedQueryPlanAudit.ajax',
        parms: {
            planAuditId: $('#auditId').val()
        },
        pageSize: 10,
        width: '99.5%',
        height: '300',
        headerRowHeight: 25,
        rowHeight: 25,
        sortName: 'fillinDate',
        sortOrder: 'desc',
        fixedCellHeight: true,
        selectRowButtonOnly: true,
        detail: {
            height: 'auto',
            onShowDetail: function (row, detailPanel, callback) {
                var url = web_app.name + '/common/TaskExecutionList.jsp';
                Public.load(url, {
                    procUnitId: 'Approve',
                    bizId: row.planAuditId
                }, function (data) {
                    var div = $('<div></div>').css({
                        'paddingLeft': '20px',
                        'paddingTop': '5px',
                        overflow: 'hidden'
                    });
                    div.html(data);
                    $(detailPanel).append(div);
                });
            }
        },
        onDblClickRow: function (data, rowindex, rowobj) {
            viewTaskAudit(data);
        }
    });
}

function viewTaskAudit(row) {
	//判断是否有权限查看制定功能
    var pageType = $('#pageType').val();
    var isPlanningSpecialist = $('#isPlanningSpecialist').val();
    var isDutyPerson = $('#isDutyPerson').val();
    if (pageType == 'backstage' || isPlanningSpecialist == 1 || isDutyPerson >=1) {
	    var url = web_app.name + '/planAuditAction!showUpdatePlanAudit.job?bizId='
	        + row.planAuditId + '&isReadOnly=true';
	    parent.parent.addTabItem({
	        tabid: 'taskAudit' + row.planAuditId,
	        text: '计划任务制定',
	        url: url
	    });    	
    }
}

function viewTaskReport(row) {
    var pageType = $('#pageType').val();
    var isPlanningSpecialist = $('#isPlanningSpecialist').val();
    var isDutyPerson = $('#isDutyPerson').val();
    if (pageType == 'backstage' || isPlanningSpecialist == 1 || isDutyPerson >=2) {
	    var url = web_app.name + '/planTaskManagerAction!showTaskReport.job?bizId='
	        + row.taskReportId + '&isReadOnly=true';
	    parent.parent.addTabItem({
	        tabid: 'taskReport' + row.taskReportId,
	        text: '计划任务汇报',
	        url: url
	    });
    }
}

function endTaskReport() {
    var pageType = $('#pageType').val();
    var isPlanningSpecialist = $('#isPlanningSpecialist').val();
    var isDutyPerson = $('#isDutyPerson').val();
    if (pageType == 'backstage' || isPlanningSpecialist == 1 || isDutyPerson >=2) {
    	var row = reportGridManager.getSelectedRow();
    	if (!row) {Public.tip('请选择数据！'); return; }
    	var  status= row.status;
    	if(1!=status){
    		Public.tip('非审批中的汇报,不需要进行终止操作！'); return; 
    	}
        UICtrl.confirm("您是否要中止当前选中的任务？", function () {
        	var param = {
        			taskReportId: row.taskReportId//bizId
        	    };
    	    var url = web_app.name + '/planTaskManagerAction!endTaskReport.ajax'; 
//            Public.ajax(web_app.name + '/workflowAction!abortProcessInstanceByBizId.ajax',
            		Public.ajax(url, 
            		param,
			function () {
			    Public.successTip("您已成功中止当前流程。");
			    reportGridManager.loadData();			  
			});
        });
     	/*var param = {
    			taskReportId: row.taskReportId
    	    };
	    var url = web_app.name + '/planTaskManagerAction!endTaskReport.ajax'; 
	    Public.ajax(url, param, function (id) {
	    });*/
    }
}


function viewTaskAdjust(row) {
    var pageType = $('#pageType').val();
    var isPlanningSpecialist = $('#isPlanningSpecialist').val();
    var isDutyPerson = $('#isDutyPerson').val();
    if (pageType == 'backstage' || isPlanningSpecialist == 1 || isDutyPerson >=1) {
    	  var bizid;
    	    if (row.relationAdjustAskId) {
    	        bizid = row.relationAdjustAskId;
    	    } else {
    	        bizid = row.adjustAskId;
    	    }
    	    if((row.taskKindId&&'7' == row.taskKindId)||(row.myGuid&&'7'==row.myGuid)){
    	    	 var url = web_app.name + '/planTaskManagerPlanAction!showUpdateAdjustAllTask.job?bizId='
    	         + bizid + '&isReadOnly=true';
    		     parent.parent.addTabItem({
    		         tabid: 'taskAdjust' + bizid,
    		         text: '计划刷版',
    		         url: url
    		     });
    	    	return 
    	    }
    	    var url = web_app.name + '/planAuditAction!showUpdateAdjustTask.job?bizId='
    	        + bizid + '&isReadOnly=true';
    	    parent.parent.addTabItem({
    	        tabid: 'taskAdjust' + bizid,
    	        text: '计划任务调整',
    	        url: url
    	    });
    }
  
}

function initializeReportGrid() {

    var pageType = $('#pageType').val();
    var isPlanningSpecialist = $('#isPlanningSpecialist').val();
    var isDutyPerson = $('#isDutyPerson').val();
    var toolbarOptions;
    if (pageType == 'backstage' || isPlanningSpecialist == 1 || isDutyPerson >=2) {
    	toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
    		endTaskReportHandler: {id: 'endTaskReportHandler', text: '停止汇报', img: 'edit.png', click: endTaskReport}
    	});    	
    }else{
		toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		});
	}	
    reportGridManager = UICtrl.grid('#taskReportGrid', {
        columns: [
            {
                display: "完成进度",
                name: "percentComplete",
                width: 60,
                minWidth: 60,
                type: "string",
                align: "left"
            },
            {
                display: "完成情况说明",
                name: "reportContent",
                width: 600,
                minWidth: 60,
                type: "string",
                align: "left",
                render: function (item) {
                    return ['<div title="', item.reportContent, '">',
                        item.reportContent, '</div>'].join('');
                }
            }, {
                display: "提交日期",
                name: "fillinDate",
                width: 100,
                minWidth: 60,
                type: "string",
                align: "left"
            }, {
                display: "汇报人",
                name: "personMemberName",
                width: 100,
                minWidth: 60,
                type: "string",
                align: "left"
            }, {
                display: "状态",
                name: "statusTextView",
                width: 60,
                minWidth: 60,
                type: "string",
                align: "left"
            }, {
                display: "实际开始日期",
                name: "actualStart",
                width: 100,
                minWidth: 60,
                type: "date",
                align: "left"
            }, {
                display: "实际完成日期",
                name: "actualFinish",
                width: 100,
                minWidth: 60,
                type: "date",
                align: "left"
            }, {
                display: "预计完成时间",
                name: "estimatedFinish",
                width: 100,
                minWidth: 60,
                type: "date",
                align: "left"
            }],
        dataAction: 'server',
        url: web_app.name
        + '/planTaskManagerAction!slicedQueryTaskReport.ajax',
        parms: {
            planTaskId: $('#taskId').val()
        },
        pageSize: 10,
        width: '99.5%',
        height: '300',
        headerRowHeight: 25,
		toolbar: toolbarOptions,
        rowHeight: 25,
        sortName: 'fillinDate',
        sortOrder: 'desc',
        fixedCellHeight: true,
        selectRowButtonOnly: true,
        isShowDetailToggle: function (item) {
            return parseInt(item.percentComplete, 10) == 100;
        },
        detail: {
            height: 'auto',
            onShowDetail: function (row, detailPanel, callback) {
                var url = web_app.name + '/common/TaskExecutionList.jsp';
                Public.load(url, {
                    procUnitId: 'Approve',
                    bizId: row.taskReportId
                }, function (data) {
                    var div = $('<div></div>').css({
                        'paddingLeft': '20px',
                        'paddingTop': '5px',
                        overflow: 'hidden'
                    });
                    div.html(data);
                    $(detailPanel).append(div);
                });
            }
        },
        onDblClickRow: function (data, rowindex, rowobj) {
            viewTaskReport(data);
        }
    });
}

// 初始化表格
function initializeDocumentGrid() {
    gridManager_Document = UICtrl.grid('#docGrid', {
        columns: [

            {
                display: "成果",
                name: "name",
                width: 100,
                minWidth: 60,
                type: "string",
                align: "left"
            },
            {
                display: "更新时间",
                name: "updateDate",
                width: 100,
                minWidth: 60,
                type: "string",
                align: "left"
            },
            {
                display: "版本",
                name: "documentVersion",
                width: 100,
                minWidth: 60,
                type: "string",
                align: "left"
            },
            {
                display: "状态",
                name: "status",
                width: 100,
                minWidth: 60,
                type: "string",
                align: "left",
                render: function (item) {
                    return UICtrl.getStatusInfo(null == item.status ? 1
                        : item.status);
                }
            } /*
             * , { display: "排序号", name: "sequence", width: 100,
             * minWidth: 60, type: "string", align: "left" , render:
             * function (item) { item.id = item.paySchemeKindId; return
             * UICtrl.sequenceRender(item); }}
             */
        ],
        dataAction: 'server',
        url: web_app.name + '/linkAction!slicedQueryPlanDocument.ajax',
        parms: {
            planId: $('#taskId').val(),
            owningObjectId: owningObjectId
        },
        pageSize: 10,
        width: '99.5%',
        height: '230',
        heightDiff: -10,
        headerRowHeight: 25,
        rowHeight: 25,
        sortName: 'sequence',
        sortOrder: 'asc',
        fixedCellHeight: true,
        selectRowButtonOnly: true,
        onDblClickRow: function (data, rowindex, rowobj) {
            updateDocumentHandler(data.documentTypeId);
        }
    });
    UICtrl.setSearchAreaToggle(gridManager_Document);
}

// 初始化表格initializeDocumentGrid initializeGuideGrid
function initializeGuideGrid() {
    gridManager_Guide = UICtrl.grid('#guideGrid', {
        columns: [

            {
                display: "指引",
                name: "guideName",
                width: 100,
                minWidth: 60,
                type: "string",
                align: "left"
            },
            {
                display: "更新时间",
                name: "updateDate",
                width: 100,
                minWidth: 60,
                type: "string",
                align: "left"
            },
            {
                display: "版本",
                name: "guideVersion",
                width: 100,
                minWidth: 60,
                type: "string",
                align: "left"
            },
            {
                display: "状态",
                name: "status",
                width: 100,
                minWidth: 60,
                type: "string",
                align: "left",
                render: function (item) {
                    return UICtrl.getStatusInfo(null == item.status ? 1
                        : item.status);
                }
            } /*
             * , { display: "排序号", name: "sequence", width: 100,
             * minWidth: 60, type: "string", align: "left", render:
             * function (item) { item.id = item.paySchemeKindId; return
             * UICtrl.sequenceRender(item); } }
             */
        ],
        dataAction: 'server',
        url: web_app.name + '/linkAction!slicedQueryPlanGuide.ajax',
        parms: {
            planId: $('#taskId').val(),
            owningObjectId: owningObjectId
        },
        pageSize: 20,
        width: '99.5%',
        height: '230',
        heightDiff: -10,
        headerRowHeight: 25,
        rowHeight: 25,
        sortName: 'sequence',
        sortOrder: 'asc',
        fixedCellHeight: true,
        enabledEdit: true,
        autoAddRowByKeydown: false,
        selectRowButtonOnly: true,
        onDblClickRow: function (data, rowindex, rowobj) {
            updateGuideHandler();
        }
    });
    UICtrl.setSearchAreaToggle(gridManager_Guide);
}

// 初始化表格
function initializePreviousGrid() {
    gridManager_Previous = UICtrl.grid('#previousTaskGrid', {
        columns: [

            {
                display: "前置类型",
                name: "previousTypeIdTextView",
                width: 160,
                minWidth: 60,
                type: "string",
                align: "left"
            }, {
                display: "前置计划",
                name: "previousPlanName",
                width: 160,
                minWidth: 60,
                type: "string",
                align: "left"
            }, {
                display: "延迟时间",
                name: "delayDays",
                width: 160,
                minWidth: 60,
                type: "string",
                align: "left"
            }, {
                display: "更新时间",
                name: "updateDate",
                width: 160,
                minWidth: 60,
                type: "string",
                align: "left"
            } /*
             * , { display: "排序号", name: "sequence", width: 160, minWidth: 60,
             * type: "string", align: "left" , render: function (item) { item.id =
             * item.templatePlanPreviousId; return UICtrl.sequenceRender(item); }}
             *//*
             * , { display: "版本号", name: "version", width: 100, minWidth: 60,
             * type: "string", align: "left" }, {}
             */
        ],
        dataAction: 'server',
        url: web_app.name + '/planSetAction!slicedQueryPlanPrevious.ajax',
        parms: {
            planId: $('#taskId').val(),
            owningObjectId: owningObjectId
        },
        pageSize: 20,
        width: '99.5%',
        height: '230',
        heightDiff: -10,
        headerRowHeight: 25,
        rowHeight: 25,
        sortName: 'sequence',
        sortOrder: 'asc',
        fixedCellHeight: true,
        enabledEdit: true,
        autoAddRowByKeydown: false,
        selectRowButtonOnly: true,
        onDblClickRow: function (data, rowindex, rowobj) {
            /* addHandler(); */
        }
    });
    UICtrl.setSearchAreaToggle(gridManager_Previous);

}
// 编辑成果按钮
function updateDocumentHandler(documentTypeId) {
    if (!documentTypeId) {
        var rows = gridManager_Document.getSelectedRows();
        if (!rows || rows.length == 0) {
            Public.tip("请选择你要查看附件的文档类别！");
            return;
        }
        if (rows.length > 1) {
            Public.tip("只能选择一条数据修改！");
            return;
        }
        documentTypeId = rows[0].documentTypeId;
    }
    // 所需参数需要自己提取 {id:row.id}
    UICtrl.showAjaxDialog({
        title: "查看文档类别附件",
        url: web_app.name + '/documentAction!showUpdateDocumentType.load',
        param: {
            documentTypeId: documentTypeId
        },
        init: initDocumentChooseInput,
        width: 800,
        close: dialogClose
    });
}

function initDocumentChooseInput() {
    UICtrl.setReadOnly($('#submitForm'));
    $("#deptName").orgTree({
        filter: 'dpt',
        param: {
            searchQueryCondition: "org_kind_id in('ogn','dpt')"
        },
        back: {
            text: '#deptName',
            value: '#deptId',
            id: '#deptId',
            name: '#deptName'
        }
    });
    $("#authorName").searchbox({
        type: "sys",
        name: "orgSelect",
        getParam: function () {
            return {
                a: 1,
                b: 1,
                searchQueryCondition: " org_kind_id ='psm'"
            };// kind_id in (1,2,3)
        },
        back: {
            id: "#authorId",
            personMemberName: "#authorName"
        }
    });
    if ($("#documentTypeId").val()) {
        $('#documentTypeIdAttachment').fileList({
            bizId: $("#documentTypeId").val()
        });
    }
}
// 编辑指引按钮
function updateGuideHandler(guideId) {
    if (!guideId) {
        var rows = gridManager_Guide.getSelectedRows();
        if (!rows || rows.length == 0) {
            Public.tip("请选择你要查看指引附件的指引！");
            return;
        }
        if (rows.length > 1) {
            Public.tip("只能选择一条数据查看！");
            return;
        }
        guideId = rows[0].guideId;
    }
    // 所需参数需要自己提取 {id:row.id}
    UICtrl.showAjaxDialog({
        title: "查看指引附件",
        url: web_app.name + '/guideAction!showGuideDocument.load',
        param: {
            guideId: guideId
        },
        init: initGuideChooseInput,
        width: 600,
        close: dialogClose
    });
}

function initGuideChooseInput() {
    // if($("#documentTypeId").val()){
    // $('#documentTypeIdAttachment').fileList({bizId:$("#documentTypeId").val()});
    // }

    var rows = $("div.ui-attachment-list");
    $.each(rows, function (index, market) {
        $('#' + market.id).fileList();
    });

}

function savePlan() {
    // 读取计划状态，执行中，允许编辑
    var status = $('#status').val();
    if (status != 0) {
        // 不允许编辑
        Public.tip("非执行中状态不允许编辑保存！");
    }
    var param = $("#submitForm").formToJSON();
    if (!param)
        return false;
    param['taskExecutors'] = getExecutorArray();// 调用taskPersonChooseUtil.js中方法
    param['taskManager'] = getManagerArray(1);// 调用taskPersonChooseUtil.js中方法
    var url = web_app.name + "/planTaskManagerAction!saveTaskChange.ajax";
    Public.ajax(url, param, function (id) {
    });
    /*
     * $('#submitForm').ajaxSubmit({ url: web_app.name +
     * '/planTaskManagerAction!saveTaskChange.ajax', param: param, success:
     * function (data) { } });
     */

}

function collectionPlan(collectionType) {
    // 获取任务IDtaskId
    var taskId = $('#taskId').val()
    if (!taskId)
        return false;
    var param = {
        collectionType: collectionType,
        taskId: taskId
    };
    if (!param)
        return false;
    var url = web_app.name + "/planSetAction!insertCollection.ajax";
    Public.ajax(url, param, function (id) {
    });
}

// 取消关注、收藏、督办
function unCollectionPlan(collectionType) {
    // 获取任务IDtaskId
    var taskId = $('#taskId').val()
    if (!taskId)
        return false;
    var param = {
        collectionType: collectionType,
        taskId: taskId
    };
    if (!param)
        return false;
    var url = web_app.name + "/planSetAction!deleteCollection.ajax";
    Public.ajax(url, param, function (id) {
    });
}

// 关联总控
//relateKeyPlan
function criticalLink() {
    // 获取任务IDtaskId
    var taskId = $('#taskId').val()
    var critical = $('#critical').val()

    if (!taskId) {
        Public.tip("当前计划不存在！");
        return false;
    }
    if (critical == '1') {
        Public.tip("总控计划不能设置关联！");
        return false;
    }
    if (!taskId) {
        return false;
    }

    // 打开对话框，选择总控计划，或者选择非总控计划，关联计划改造

    if (!selectPlanTypeDialog) {
        owningObjectId = $('#owningObjectId').val();
        selectPlanTypeDialog = UICtrl
            .showDialog({
                title: "设置总控关联计划。",
                width: 350,
                /*
                 * content: '<x:hidden name="criticalLinkId"/><x:selectTD
                 * name="criticalLinkName" required="false" label="关联计划"
                 * wrapper="tree" maxLength="64" />',
                 */
                content: ' <div class="ui-combox-wrap" id="ownerName_click"><input type="hidden" name="criticalLinkId"  id="criticalLinkId"><input type="hidden" name="criticalLinkparameter"  id="criticalLinkparameter"><input type="text" name="criticalLinkName"  id="criticalLinkName" class="text ui-combox-input ui-combox-element" label="关联计划" select="true"><span class="select"></div>',

                /*
                 * <div style="overflow-x: hidden; overflow-y: auto; width:
                 * 340px;height:250px;"><input type="text"
                 * name="criticalLink" id="criticalLink" label="总控关联"
                 * select="true"></div>',
                 */init: function () {

                    $("#mainplantree").ligerTree({
                        checkbox: false
                    });
                    $('#criticalLinkName')
                        .searchbox(
                        {
                            type: 'ep',
                            name: 'planSelect',
                            getParam: function () {
                                return {
                                    obi: owningObjectId,
                                    ddi: owningObjectId,
                                    searchQueryCondition: " and critical = '1'  and status = '0' "
                                };
                            },
                            back: {
                                taskId: '#criticalLinkId',
                                taskName: '#criticalLinkName',
                                parameter: '#criticalLinkparameter'
                            }
                        });
                },

                ok: function () {
                    var _self = this;

                    var criticalLinkId = $('#criticalLinkId').val();
                    var criticalLinkName = $('#criticalLinkName').val();
                    var parameter = $('#criticalLinkparameter').val();
                    saveCriticalLink(criticalLinkId, parameter);
                    this.hide();
                },
                close: function () {
                    this.hide();
                    return false;
                }
            });
    } else {
        /* $('#selectPlanTypetree').commonTree('refresh'); */
        selectPlanTypeDialog.show().zindex();
    }

}

function saveCriticalLink(criticalLinkId, parameter) {
    if (!criticalLinkId) {
        Public.tip("请选择关联计划！");
    }
    var taskId = $('#taskId').val()
    var params = {
        taskId: taskId,
        criticalLinkId: criticalLinkId,
        parameter: parameter
    };
    var url = web_app.name + "/planTaskManagerPlanAction!saveCriticalLink.ajax";
    Public.ajax(url, params, function (id) {
    });
}

function enableAdjustTaskBill() {
    // 读取计划状态，执行中，允许编辑
    // 读取后台标识，后台标识的时候，可以编辑
    var pageType = $('#pageType').val();
    var isPlanningSpecialist = $('#isPlanningSpecialist').val();
    var isDutyPerson = $('#isDutyPerson').val();
    var status = $('#status').val();
    if (pageType == 'backstage') {
        $("#toolBar").toolBar("enable", "save");
        return;
    } else if (isPlanningSpecialist == 1 && status == 0) {
        $('#GridStylehref1').hide();
        $('#GridStylehref2').hide();
        $('#GridStylehref5').hide();
        $('#GridStylehref6').hide();

    } else if (isDutyPerson > 1 && status == 0) {
        $('#GridStylehref1').hide();
        $('#GridStylehref2').hide();
        $('#GridStylehref5').hide();
        $('#GridStylehref6').hide();
    }
    else {
        // 不允许编辑
        $('#GridStylehref1').hide();
        $('#GridStylehref2').hide();
        $('#GridStylehref3').hide();
        $('#GridStylehref4').hide();
        $('#GridStylehref5').hide();
        $('#GridStylehref6').hide();
        // x选择清空去除。
        // 保存按钮设置为不可用
        $("#toolBar").toolBar("disable", "save");
        setTimeout(function () {
            UICtrl.disable($('#dutyDeptName'));
        }, 0)
        setTimeout(function () {
            UICtrl.disable($('#ownerName'));
        }, 0)

    }
    if (status == 0) {
        // 允许编辑
        $("#toolBar").toolBar("enable", "save");
        setTimeout(function () {
            UICtrl.disable($('#dutyDeptName'));
        }, 0)
        setTimeout(function () {
            UICtrl.disable($('#ownerName'));
        }, 0)
        $('#GridStylehref1').hide();
        $('#GridStylehref2').hide();
        $('#GridStylehref5').hide();
        $('#GridStylehref6').hide();
    } else {
        // 不允许编辑
        setTimeout(function () {
            UICtrl.disable($('#dutyDeptName'));
        }, 0)
        setTimeout(function () {
            UICtrl.disable($('#ownerName'));
        }, 0)
        $('#GridStylehref1').hide();
        $('#GridStylehref2').hide();
        $('#GridStylehref3').hide();
        $('#GridStylehref4').hide();
        $('#GridStylehref5').hide();
        $('#GridStylehref6').hide();
        // x选择清空去除。
        // 保存按钮设置为不可用
        $("#toolBar").toolBar("disable", "save");
    }
  /*//关键字允许编辑 附件允许修改
	setTimeout(function(){
		UICtrl.enable('#keywords');
		UICtrl.enable('#effectiveTime');
		UICtrl.enable('#invalidTime');
		UICtrl.enable('#priority');
		UICtrl.enable('#ownOrganName');
		UICtrl.enable('#hasFeedBack1');
		UICtrl.enable('#isAllowMultiFeedback1');
		UICtrl.enable('#hasFeedBackAttachment1');
		UICtrl.enable('#isHideReceiver1');
		UICtrl.enable('#feedbackWidth');
		//UICtrl.enable('#isCreateReadTask1');
		if(isFinalizeFun()){//未定稿的可以修改正文
			$("#toolBar").toolBar("removeItem", "save");
		}else{
			$('#infoTextBody').fileList('enable');
			$('#infoAttachment').fileList('enable');
		}
	},0);*/
}

/** ********汇报任务进度********** */
function progressReporting() {
    completeOATask();
    progressReport(web_app.name
    + "/planTaskManagerPlanAction!checkTaskReport.ajax");// 都可以汇报

}

var OAPlanStatus = {}

OAPlanStatus.RUNNING = 0; //执行中
OAPlanStatus.COMPLETED = 1; //已完成
OAPlanStatus.ABORTED = 2; //已中止
OAPlanStatus.UNFINISH = 3; //未完

function checkTaskStatus(operateName) {
    var status = $('#status').val();
    if (status == 1) {
        Public.tip('任务已完成不能重复汇报完成任务!');
        return false;
    }
    if (status != 0) {
        Public.tip('任务非执行中状态不能汇报任务!');
        return false;
    }

    var taskKindId = $('#taskKindId').val();
    if ("-111" == taskKindId) {
        Public.tip('目录不能汇报!');
        return;
    }
    return true;
}

function progressReport(url) {

    var status = $('#status').val();
    if (status == 1) {
        Public.tip('任务已完成不能重复汇报完成任务!');
        return;
    }
    if (status != 0) {
        Public.tip('任务非执行中状态不能汇报任务!');
        return;
    }
    var taskKindId = $('#taskKindId').val();
    if ("-111" == taskKindId) {
        Public.tip('目录不能汇报!');
        return;
    }
    owningObjectId = $('#owningObjectId').val();
    var managerType = $('#managerType').val();
    var taskId = $('#taskId').val();


    var planTaskId = $('#taskId').getValue();
    var url = web_app.name + '/planTaskManagerAction!showTaskReportPage.job?planTaskId=' + planTaskId + '&owningObjectId=' + owningObjectId;
    parent.addTabItem({tabid: 'reportPage' + planTaskId, text: '进度汇报', url: url});


}

/** ********申请调整计划********** */
//
function applyEdit() {
    completeOATask();
    var taskId = $('#taskId').val();
    applyEditByURl(web_app.name
    + '/planAuditAction!showInsertAdjustTask.job?planTaskId=' + taskId);
}

// 申请修改计划
function applyEditByURl(url) {
    var status = $('#status').val();
    if (status == 1) {
        Public.tip('任务已完成不能调整!');
        return;
    }
    if (status != 0) {
        Public.tip('任务非执行中状态不能调整!');
        return;
    }
    var taskKindId = $('#taskKindId').val();
    if ("-111" == taskKindId) {
        Public.tip('目录不能调整!');
        return;
    }
    parent.addTabItem({
        tabid: 'adjustTask',
        text: '任务计划调整',
        url: url
    });
}


/** ********计划汇报到期提醒待办任务********** */

function initTaskProcess() {
    var needTiming = $('#needTiming').val();
    if(!needTiming || 1 != needTiming){
	    completeOATask();
	    $('#bizTaskId').val("");
    }
}

function getBizTaskId() {
    return bizTaskId = $('#bizTaskId').val();
}

//completeOATask
//doSmothing
function completeOATask() {
    var bizTaskId = getBizTaskId();
    if (!bizTaskId) {
        return;
    }
    Public.ajax(web_app.name + '/workflowAction!completeTask.ajax', {
        taskId: bizTaskId
    }, function (data) {
        $('#bizTaskId').val("");
    });
}

// 关闭对话框
function dialogClose() {
}
