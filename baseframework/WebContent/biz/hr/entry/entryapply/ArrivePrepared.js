var gridManager = null, refreshFlag = false;
var dataSource={
		isFinish:{0:'否',1:'是'}
};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});


//初始化表格
function initializeGrid() {
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "序号", name: "sequence", width: 120, minWidth: 60, type: "string", align: "center" },		   
		{ display: "工作事项及准备资料", name: "content", width: 450, minWidth: 60, type: "string", align: "left" }	
		/*{ display: "是否完成", name: "isFinish", width: 200, minWidth: 60, type: "string", align: "left",
		   	editor: { type:'combobox',data:dataSource.isFinish,required: true},
			render: function (item) { 
				return dataSource.isFinish[item.isFinish];
			} }*/
		],
		dataAction : 'server',
		url: web_app.name+'/entryCheckAction!loadArrivePreparedDetail.ajax',
		parms:{id:$('#id').val()},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		fixedCellHeight : true,
		selectRowButtonOnly : true
		
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


