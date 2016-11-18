var gridManager = null, refreshFlag = false;
var interviewStatus=null;
$(document).ready(function() {
	 interviewStatus=$('#interviewStatus').combox('getJSONData');
	initializeGrid();
});
//初始化表格
function initializeGrid() {
	var writeId=$('#writeId').val();
	var status=$('#status').val();
	gridManager = UICtrl.grid('#maingrDetailId', {
		columns: [
		{ display: "应聘者", name: "staffName", width: 70, minWidth: 60, type: "string", align: "left" },
		{ display: "面试官", name: "viewMemberName", width: 70, minWidth: 60, type: "string", align: "left" },
		{ display: "状态", name: "status", width: 80, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return interviewStatus[item.status];
			}},
		{ display: "面试意见", name: "viewOpinionTextView", width: 70, minWidth: 60, type: "string", align: "left" },	
		{ display: "面试时间", name: "viewTime", width: 130, minWidth: 60, type: "string", align: "left" },	
		{ display: "综合评价", name: "bsicAssessment", width: 500, minWidth: 60, type: "string", align: "left" }	   
		],
		dataAction : 'server',
		url: web_app.name+'/interviewApplyAction!slicedQuery.ajax',
		parms: {writeId:writeId},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 'auto',
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

