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
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "人员编号", name: "empNo", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "人员名称", name: "empName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "打卡时间", name: "brushdatetime", width: 150, minWidth: 60, type: "datetime", align: "left" },
		{ display: "设备编号", name: "machinesn", width: 120, minWidth: 60, type: "string", align: "left" },
		{ display: "设备名称", name: "macName", width: 180, minWidth: 60, type: "string", align: "left" },
		{ display: "设备地址", name: "macAddress", width: 180, minWidth: 60, type: "string", align: "left" },
		{ display: "管理单位", name: "orgName", width: 180, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		parms:{otherOrgId:$('#mainOtherOrgId').val(),macSn:$('#mainMacSn').val(),datebegin:$('#datebegin').val(),dateend:$('#dateend').val()},
		url: web_app.name+'/zkAttAction!slicedQueryAttRecord.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'emp_no asc,brushdatetime',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.id);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
}


// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	if(!param) return;
	var startDate=$('#datebegin').val();
	var endDate=$('#dateend').val();
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

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}