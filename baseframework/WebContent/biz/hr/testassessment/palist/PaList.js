
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
		//enableHandler: enableHandler,
		//disableHandler: disableHandler,
		//saveSortIDHandler: saveSortIDHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		   
		{ display: "评分人id", name: "scorePersonId", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "评分人", name: "scorePersonName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "评分人级别", name: "scorePersonLevel", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "所占权重", name: "proportion", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "", name: "status", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "", name: "totalEva", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "", name: "evaDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "人员ID", name: "personMemberId", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "人员名称", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "部门ID", name: "deptId", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "机构名称", name: "organName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "full_id", name: "fullId", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "机构ID", name: "organId", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "岗位ID", name: "positionId", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "岗位名称", name: "positionName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "部门名称", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },
		   {}
		],
		dataAction : 'server',
		url: web_app.name+'/paListAction!slicedQuery.ajax',
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
	UICtrl.showAjaxDialog({url: web_app.name + '/paListAction!showInsert.load', ok: insert, close: dialogClose});
}

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	//所需参数需要自己提取 {id:row.id}
	UICtrl.showAjaxDialog({url: web_app.name + '/paListAction!showUpdate.load', param:{}, ok: update, close: dialogClose});
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/paListAction!delete.ajax', {}, function(){
			reloadGrid();
		});
	});
	/*
	DataUtil.del({action:'paListAction!delete.ajax',
		gridManager:gridManager,idFieldName:'id',
		onCheck:function(data){
		},
		onSuccess:function(){
			reloadGrid();		  
		}
	});*/
}

//新增保存
function insert() {
	/*
	var id=$('#detailId').val();
	if(id!='') return update();
	*/
	$('#submitForm').ajaxSubmit({url: web_app.name + '/paListAction!insert.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			//$('#detailId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/paListAction!update.ajax',
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
/*
//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "paListAction!updateSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'id', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'paListAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'id', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'paListAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'id',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
*/
