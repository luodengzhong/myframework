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
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "讲师级别名称", name: "teacherLevelName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "讲师级别编码", name: "teacherLevelCode", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "正常费用标准", name: "normalCriteria", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "节假日费用标准", name: "holidayCriteria", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "状态", name: "status", width: 100, minWidth: 60, type: "string", align: "left",
		render: function (item) { 
				return UICtrl.getStatusInfo(item.status);
			}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/trainingTeacherArchiveAction!slicedTeacherlevelQuery.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'levelId',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.levelId);
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

//添加按钮 
function addHandler() {
	UICtrl.showAjaxDialog({url: web_app.name + '/trainingTeacherArchiveAction!showInsertTeacherLevel.load', 
	ok: insert, 
	width:480,
	title:'新增讲师级别',
	close: dialogClose});
}

//编辑按钮
function updateHandler(levelId){
	if(!levelId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		levelId=row.levelId;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/trainingTeacherArchiveAction!showUpdateTeacherLevel.load',
	param:{levelId:levelId}, 	width:480,ok: update, close: dialogClose});
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/trainingTeacherArchiveAction!deleteTeacherLevel.ajax', {levelId:levelId}, function(){
			reloadGrid();
		});
	});
}

//新增保存
function insert() {
	var id=$('#levelId').val();
	if(id!='') return update();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/trainingTeacherArchiveAction!insertTeacherLevel.ajax',
		success : function(data) {
			$('#levelId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/trainingTeacherArchiveAction!updateTeacherLevel.ajax',
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
