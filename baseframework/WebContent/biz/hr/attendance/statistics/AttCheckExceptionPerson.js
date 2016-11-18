var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	var columns=[
	    { display: "姓名", name: "staffName", width: 120, minWidth: 80, type: "string", align: "center" }   
	];
	var amColumns={display: '上午', columns:[]};
	amColumns.columns.push({ display: "上班时间", name: "amStartTime", width: 130, minWidth: 80, type: "datetime", align: "center" });
	amColumns.columns.push({ display: "打卡时间", name: "amCheckTime", width: 130, minWidth: 80, type: "datetime", align: "center" });
	amColumns.columns.push({ display: "打卡状态", name: "amStatus", width: 80, minWidth: 80, type: "string", align: "center" });	
	columns.push(amColumns);
	var pmColumns={display: '下午', columns:[]};
	pmColumns.columns.push({ display: "下班时间", name: "pmEndTime", width: 130, minWidth: 80, type: "datetime", align: "center" });
	pmColumns.columns.push({ display: "打卡时间", name: "pmCheckTime", width: 130, minWidth: 80, type: "datetime", align: "center" });
	pmColumns.columns.push({ display: "打卡状态", name: "pmStatus", width: 80, minWidth: 80, type: "string", align: "center" });	
	columns.push(pmColumns);
	gridManager = UICtrl.grid('#maingrid', {
		columns:columns, 
		dataAction : 'server',
		url: web_app.name+'/attStatisticsAction!slicedQueryComprehensiveAttCheckExceptions.ajax',
		parms:{ownerPersonId:$('#ownerPersonId').val(),ownerPeriodId:$('#ownerPeriodId').val()},
		pageSize : 10,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		enabledEdit: true,
		sortName:'amStartTime',
		sortOrder:'asc',
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
}