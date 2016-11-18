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
		}
	});
	var columns=[
	    { display: "姓名", name: "staffName", width: 120, minWidth: 80, type: "string", align: "center" },
	    { display: "日期", name: "workDate", width: 100, minWidth: 60, type: "string", align: "center" },
	    { display: "上班时间", name: "amStartTime", width: 120, minWidth: 80, type: "string", align: "center" },
	    { display: "上班打卡时间", name: "amCheckTime", width: 120, minWidth: 80, type: "string", align: "center" },
	    { display: "上班打卡状态", name: "amStartStatus", width: 120, minWidth: 80, type: "string", align: "center" },
	    { display: "下班时间", name: "pmEndTime", width: 120, minWidth: 80, type: "string", align: "center" },
	    { display: "下班打卡时间", name: "pmCheckTime", width: 120, minWidth: 80, type: "string", align: "center" },
	    { display: "下班打卡状态", name: "pmEndStatus", width: 120, minWidth: 80, type: "string", align: "center" },
	    { display: "晚上状态", name: "nightStatus", width: 120, minWidth: 80, type: "string", align: "center" },
	    /*行政班查询当天打卡，排班查询班次上班前三个小时到下班后三个小时期间*/
	    { display: "打卡详情", name: "checkDetail", width: 160, minWidth: 120, type: "string", align: "center"}
	];
	gridManager = UICtrl.grid('#maingrid', {
		columns:columns, 
		dataAction : 'server',
		url: web_app.name+'/attStatisticsAction!slicedQueryComprehensiveAttAttendance.ajax',
		parms:{archiviesId:$('#archiviesId').val(),periodId:$('#periodId').val()},
		pageSize : 10,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		enabledEdit: true,
		sortName:'workDate,amStartTime',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
}
