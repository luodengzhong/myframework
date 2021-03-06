var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	initializeGrid();
});
//初始化表格
function initializeGrid() {
	var personMemberId=$('#personMemberId').val();
	gridManager = UICtrl.grid('#maingrDetailId', {
		columns: [
		{ display: "员工姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "培训类型", name: "trainTypeTextView", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "培训分数", name: "score", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "培训结果", name: "trainStatusTextView", width: 100, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/trainResultAction!slicedQueryDetail.ajax',
		parms: {personMemberId:personMemberId},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'staffName',
		sortOrder:'asc',
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		  onLoadData :function(){
				return !($('#writeId').val()=='');
			}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}



//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 




//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

