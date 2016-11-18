var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();

});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		viewHandler:function(){
			viewHandler();
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "备份日期", name: "copyDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
		{ display: "年", name: "year", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "月", name: "month", width: 100, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/hRPersonnelQuotaAction!slicedQueryPersonnelQuatoCopy.ajax',
		pageSize : 50,
		manageType:'hrArchivesManage',
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'copyDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.copyId,data.year,data.month);
		}
	
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

function viewHandler(copyId,year,month){
	if(!copyId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		copyId=row.copyId;
		 year=row.year;
		 month=row.month;
	}
	parent.addTabItem({
		tabid: 'HRPersonnelQuatoCopy'+copyId,
		text: '人员快报备份查询',
		url: web_app.name + '/hRPersonnelQuotaAction!showUpdatePersonnelQuotaCopy.do?copyId=' 
			+ copyId+'&isReadOnly=true'+'&year='+year+'&month='+month
	}
	);
}


//刷新表格
function reloadGrid() {
	gridManager.loadData();
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
