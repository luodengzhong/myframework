var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "姓名", name: "personName", width: 80, minWidth: 60, type: "string", align: "left" },		   
		{ display: "打卡时间", name: "checkTime", width: 140, minWidth: 120, type: "string", align: "center" },
		{ display: "打卡机器", name: "macName", width: 140, minWidth: 100, type: "string", align: "center" }	,
		{ display: "打卡地点", name: "macAddress", width: 180, minWidth: 80, type: "string", align: "center" }
		],
		dataAction : 'server',
		url: web_app.name+'/attStatisticsAction!slicedQueryChkDetail.ajax',
		parms:{workDate:$('#workDate').val(),personId:$('#personId').val()},
		usePager : false,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'checkTime',
		sortOrder:'asc',
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
	UICtrl.setSearchAreaToggle(gridManager);
}