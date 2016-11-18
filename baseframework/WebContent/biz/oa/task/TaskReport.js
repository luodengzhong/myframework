var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		},
		viewHandler:function(){
			viewHandler();
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "完成进度", name: "percentComplete", width: 60, minWidth: 60, type: "string", align: "left" },		
			{ display: "完成情况说明", name: "reportContent", width: 600, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return ['<div title="',item.reportContent,'">',item.reportContent,'</div>'].join('');
				}
			},
			{ display: "提交日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "汇报人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "状态", name: "statusTextView", width: 60, minWidth: 60, type: "string", align: "left" },
			{ display: "实际开始日期", name: "actualStart", width: 100, minWidth: 60, type: "date", align: "left" },		   
			{ display: "实际完成日期", name: "actualFinish", width: 100, minWidth: 60, type: "date", align: "left" },		   
			{ display: "预计完成时间", name: "estimatedFinish", width: 100, minWidth: 60, type: "date", align: "left" }	
		],
		dataAction : 'server',
		url: web_app.name+'/planTaskManagerAction!slicedQueryTaskReport.ajax',
		parms:{planTaskId:$('#planTaskId').val()},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		toolbar: toolbarOptions,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data);
		}
	});
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}

function viewHandler(row){
	if(!row){
		row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
	}
	var url=web_app.name + '/planTaskManagerAction!showTaskReport.job?bizId='+row.taskReportId+'&isReadOnly=true';
	parent.parent.addTabItem({ tabid: 'taskReport'+row.taskReportId, text: '计划任务汇报', url:url});
}