var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	initializeGrid();
});
//初始化表格
function initializeGrid() {
	var personMemberId=$('#personMemberId').val();
	gridManager = UICtrl.grid('#maingrDetailId', {
		columns: [
          { display: "被访人姓名", name: "name", width: 120, minWidth: 60, type: "string", align: "left" },		   
          { display: "被访人入司时间", name: "employDate", width: 120, minWidth: 60, type: "date", align: "left" },		   
          { display: "被访人岗位", name: "pos", width: 120, minWidth: 60, type: "string", align: "left" },		   
          { display: "被访人所在部门", name: "dept", width: 120, minWidth: 60, type: "string", align: "left" },		   
          { display: "被访人地址", name: "visitAddress", width: 120, minWidth: 60, type: "string", align: "left" },		   
          { display: "家访记录", name: "visitRecord", width: 120, minWidth: 60, type: "string", align: "left" },		   
          { display: "家访时间", name: "visitTime", width: 120, minWidth: 60, type: "date", align: "left" }	
		],
		dataAction : 'server',
		url: web_app.name+'/visitfamilyAction!slicedQueryDetail.ajax',
		parms: {personMemberId:personMemberId},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
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

