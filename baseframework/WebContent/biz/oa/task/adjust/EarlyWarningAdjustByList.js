
var taskAdjustGridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});

//初始化表格
function initializeGrid() {

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
        + '/planTaskManagerAction!slicedQueryEarlyWarningAdjust.ajax',
        pageSize: 50,
        width: '100%',
        height: '100%',
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
	UICtrl.setSearchAreaToggle(taskAdjustGridManager);
}
// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(taskAdjustGridManager, param);
}

//刷新表格
function reloadGrid() {
	taskAdjustGridManager.loadData();
} 

function viewTaskAdjust(row) {
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
    parent.addTabItem({
        tabid: 'taskAdjust' + bizid,
        text: '计划任务调整',
        url: url
    });
}


