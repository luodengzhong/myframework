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
		{ display: "序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "名称", name: "name", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "编码", name: "code", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "值(分)", name: "value", width: 100, minWidth: 60, type: "string", align: "left" }		   
		],
		dataAction : 'server',
		url: web_app.name+'/scoreLevelAction!slicedQuery.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
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
	UICtrl.showAjaxDialog({url: web_app.name + '/scoreLevelAction!showInsert.load', 
		ok: insert, 
		width:300,
		title:"新增评分等级",
		close: dialogClose});
}

//编辑按钮
function updateHandler(levelId){
	if(!levelId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		levelId=row.levelId;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/scoreLevelAction!showUpdate.load', 
		param:{levelId:levelId}, 
		ok: update, 
		width:300,
		title:"修改评分等级",
		close: dialogClose});
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/scoreLevelAction!delete.ajax', {levelId:row.levelId}, function(){
			reloadGrid();
		});
	});
}

//新增保存
function insert() {
	
	var levelId=$('#levelId').val();
	if(levelId!='') return update();
	
	$('#submitForm').ajaxSubmit({url: web_app.name + '/scoreLevelAction!insert.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			$('#levelId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/scoreLevelAction!update.ajax',
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
