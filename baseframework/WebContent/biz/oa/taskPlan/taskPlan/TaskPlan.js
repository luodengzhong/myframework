
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
		   
		{ display: "联系单ID", name: "workContactId", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "联系事项ID", name: "detailId", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "标题", name: "title", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "当前处理人ID", name: "dealPersonId", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "当前处理人名称", name: "dealPersonName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "任务状态", name: "workStatue", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "创建时间", name: "createDate", width: 100, minWidth: 60, type: "string", align: "left" } 
		],
		dataAction : 'server',
		url: web_app.name+'/taskPlanAction!slicedQueryTaskPlan.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'id',
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

//添加按钮 
function addHandler() {
	UICtrl.showAjaxDialog({url: web_app.name + '/taskPlanAction!showInsertTaskPlan.load',init:initSerchBox, ok: insert, close: dialogClose});
}

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	//所需参数需要自己提取 {id:row.id}
	UICtrl.showAjaxDialog({url: web_app.name + '/taskPlanAction!showUpdateTaskPlan.load', param:{id:id},init:initSerchBox, ok: update, close: dialogClose});
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/taskPlanAction!deleteTaskPlan.ajax?id=' + row.id, {}, function(){
			reloadGrid();
		});
	});
}

//新增保存
function insert() {
	$('#submitForm').ajaxSubmit({url: web_app.name + '/taskPlanAction!insertTaskPlan.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/taskPlanAction!updateTaskPlan.ajax',
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