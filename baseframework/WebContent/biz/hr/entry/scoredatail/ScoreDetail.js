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
		   
		{ display: "内容", name: "content", width: 800, minWidth: 60, type: "string", align: "left" },		   
		{ display: "分值", name: "totalScore", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "类别", name: "typeTextView", width: 100, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/scoreDetailAction!slicedQuery.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'type',
		sortOrder:'asc',
		checkbox:true,
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
	UICtrl.showAjaxDialog({url: web_app.name + '/scoreDetailAction!showInsert.load', 
		ok: insert, 
		width:400,
		title:'新增评分指标',
		close: dialogClose});
}

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/scoreDetailAction!showUpdate.load', 
		param:{id:id}, 
		ok: update, 
		width:400,
		close: dialogClose});
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/scoreDetailAction!delete.ajax', {id:row.id}, function(){
			reloadGrid();
		});
	});
}

//新增保存
function insert() {
	var id=$('#id').val();
	if(id!='') return update();
	
	$('#submitForm').ajaxSubmit({url: web_app.name + '/scoreDetailAction!insert.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			$('#id').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/scoreDetailAction!update.ajax',
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

