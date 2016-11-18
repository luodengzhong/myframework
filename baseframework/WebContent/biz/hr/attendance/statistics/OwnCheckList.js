var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});



//初始化表格
function initializeGrid() {
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "姓名", name: "personName", width: 120, minWidth: 180, type: "string", align: "center" },		   
			{ display: "打卡时间", name: "checkTime", width: 180, minWidth: 80, type: "string", align: "center" }	,
			{ display: "打卡机器", name: "macName", width: 180, minWidth: 80, type: "string", align: "center" }	,
			{ display: "打卡地点", name: "macAddress", width: 180, minWidth: 80, type: "string", align: "center" }	
		],
		dataAction : 'server',
		url: web_app.name+'/attStatisticsAction!slicedQueryOwnCheckList.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		sortName:'checkTime',
		sortOrder:'desc',
		heightDiff : -5,
		delayLoad:true,
		headerRowHeight : 25,
		rowHeight : 25,
		enabledEdit: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	if(!param) return false;
	var startDate=$('#startDate').val();
	var endDate=$('#endDate').val();
	var dateDiff=Public.dateDiff('d',endDate,startDate);
	if(dateDiff<0){
		Public.errorTip('开始日期不能大于结束日期!');
		return false;
	}
	if(dateDiff>61){
		Public.errorTip('时间跨度不能大于2个月');
		return false;
	}
	UICtrl.gridSearch(gridManager, param);
}


//重置表单
function resetForm(obj) {
	$(obj).formClean();
}



//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
}


