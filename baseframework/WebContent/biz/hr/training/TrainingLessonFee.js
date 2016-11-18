var gridManager = null, refreshFlag = false;
var feeStatusMap=null,monthMap=null,teacherLevelMap=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	feeStatusMap = $("#status").combox("getJSONData");
	monthMap = $("#month").combox("getJSONData");
	teacherLevelMap = $("#teacherLevel").combox("getJSONData");
});
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		updateHandler: function(){
			updateHandler();
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{display: "讲师姓名", name: "trainingTeacherName", width: 100, minWidth: 60, type: "string", align: "center"},
			{display: "讲师级别", name: "trainingTeacherLevel", width: 100, minWidth: 60, type: "string", align: "center",render:function(item){
				return teacherLevelMap[item.teacherLevel];
			}},
			{display: "年度", name: "year", width: 100, minWidth: 60, type: "string", align: "center"},
			{display: "月度", name: "month", width: 100, minWidth: 60, type: "string", align: "center",render:function(item){
				return monthMap[item.month];
			}},
			{display: "标准", name: "normalCriteria", width: 100, minWidth: 60, type: "string", align: "center"},
		    {display: "课时", name: "normalAmount", width: 100, minWidth: 60, type: "string", align: "center"},
			{display: "课时费", name: "normalFee", width: 100, minWidth: 60, type: "string", align: "center"},
			{display: "课时费状态", name: "status", width: 100, minWidth: 60, type: "string", align: "center",render:function(item){
				return feeStatusMap[item.status];
			}},
			{display: "班级名称", name: "className", width: 100, minWidth: 60, type: "string", align: "center"},
			{display: "课程名称", name: "name", width: 100, minWidth: 60, type: "string", align: "center"},
			{display: "开始时间", name: "courseStartTime", width: 100, minWidth: 60, type: "string", align: "center"},
			{display: "结束时间", name: "courseEndTime", width: 100, minWidth: 60, type: "string", align: "center"},
			{display: "上课地点", name: "coursePlace", width: 100, minWidth: 60, type: "string", align: "center"}
		],
		dataAction : 'server',
		url: web_app.name+'/trainingLessonFeeAction!slicedQuery.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'trainingLessonFeeId',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.id);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}
// 查询
function query(obj) {
	var param = $(obj).formToJSON();
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

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.trainingLessonFeeId;
	}
	//所需参数需要自己提取 {id:row.id}
	UICtrl.showAjaxDialog({url: web_app.name + '/trainingLessonFeeAction!showUpdate.load', 
	param:{trainingLessonFeeId:id}, ok: update, close: dialogClose,title:"更新课时费状态",width:300});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/trainingLessonFeeAction!update.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

