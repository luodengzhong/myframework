var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		    {display: "序号", name: "squence", width: 100, minWidth: 60, type: "string", align: "center"},
			{display: "组名", name: "name", width: 100, minWidth: 60, type: "string", align: "center"},
			{display: "组长", name: "leader", width: 100, minWidth: 60, type: "string", align: "center"},
			{display: "人数", name: "studentNum", width: 100, minWidth: 60, type: "string", align: "center"},
			{display: "口号", name: "slogan", minWidth: 60, type: "string", align: "left"},
			{display: "结业得分", name: "graduatedScore", width: 100, minWidth: 60, type: "string", align: "left"},
			{display: "总分", name: "groupSummaryScore", width: 100, minWidth: 60, type: "string", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/trainingStudentGroupAction!slicedQuery.ajax',
		parms:{trainingSpecialClassId:$("#trainingSpecialClassId").val()},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'squence',
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
	$(obj).find("input").not(":hidden").not(":button").val('');
}

//添加按钮 
function addHandler() {
	UICtrl.showAjaxDialog({url: web_app.name + '/trainingStudentGroupAction!showInsert.load', 
	param:{trainingSpecialClassId:$("#trainingSpecialClassId").val()},ok: insert, close: dialogClose,
	title:'添加分组',width:500});
}

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.trainingStudentGroupId;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/trainingStudentGroupAction!showUpdate.load', 
	param:{trainingStudentGroupId:id}, ok: update, close: dialogClose,title:'修改分组信息',width:500});
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/trainingStudentGroupAction!delete.ajax', {trainingStudentGroupId:row.trainingStudentGroupId}, function(){
			reloadGrid();
		});
	});
}
//新增保存
function insert() {
	var id=$('#trainingStudentGroupId').val();
	if(id!='') return update();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/trainingStudentGroupAction!insert.ajax',
		success : function(data) {
			$('#trainingStudentGroupId').val(data);
			refreshFlag = true;
		}
	});
}
//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/trainingStudentGroupAction!update.ajax',
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
