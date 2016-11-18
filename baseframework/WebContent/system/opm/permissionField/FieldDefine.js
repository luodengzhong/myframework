var gridManager = null, refreshFlag = false,dictDetalGridManager=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	UICtrl.initDefaulLayout();
	
	$('#maintree').commonTree({
		kindId : CommonTreeKind.PermissionField,
		onClick : onFolderTreeNodeClick
	});
}
function onFolderTreeNodeClick(data,folderId) {
	var html=[],parentId=folderId;
	if(folderId==CommonTreeKind.PermissionField){
		parentId="";
		html.push('权限字段列表');
	}else{
		html.push('<font style="color:Tomato;font-size:13px;">[',data.name,']</font>权限字段列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#treeParentId').val(folderId);
	if (gridManager) {
		UICtrl.gridSearch(gridManager,{parentId:parentId});
	}
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		addHandler: addHandler,
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler,
		enableHandler: enableHandler,
		disableHandler: disableHandler,
		moveHandler:moveHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "字段编码", name: "fieldCode", width: 150, minWidth: 60, type: "string", align: "left" },		   	
		{ display: "字段名称", name: "fieldName", width: 150, minWidth: 60, type: "string", align: "left" },		   	   
		{ display: "字段类别", name: "fieldTypeTextView", width: 80, minWidth: 60, type: "string", align: "left"},		   
		{ display: "默认权限", name: "fieldAuthorityTextView", width:80, minWidth: 60, type: "string", align: "left" },		   
		{ display: "状态", name: "status", width: 60, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.getStatusInfo(item.status);
			} 
		}
		],
		dataAction : 'server',
		url: web_app.name+'/permissionFieldAction!slicedQueryPermissionfield.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		sortName:'fieldCode',
		sortOrder:'asc',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		checkbox: true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data);
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
	var parentId=$('#treeParentId').val();
	if(parentId==''){
		Public.tip('请选择类别树！'); 
		return;
	}
	UICtrl.showAjaxDialog({
		title:'添加权限字段',
		url: web_app.name + '/permissionFieldAction!showInsertPermissionfield.load',
		param:{parentId:parentId},
		ok: insert, 
		close: dialogClose,
		width:320
	});
}

//编辑按钮
function updateHandler(data){
	if(!data){
		data = gridManager.getSelectedRow();
		if (!data) {Public.tip('请选择数据！'); return; }
	}
	UICtrl.showAjaxDialog({
		title:'修改权限字段',
		url: web_app.name + '/permissionFieldAction!showUpdatePermissionfield.load', 
		param:{fieldId:data.fieldId},
		width:320,
		ok: update, 
		close: dialogClose
	});
}

//删除按钮
function deleteHandler(){
	DataUtil.del({action:'permissionFieldAction!deletePermissionfield.ajax',
		gridManager:gridManager,idFieldName:'fieldId',
		onCheck:function(data){
			if(parseInt(data.status)!=0){
				Public.tip(data.name+'不是草稿状态,不能删除!');
				return false;
			}
		},
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

//新增保存
function insert() {
	var fieldId=$('#fieldId').val();
	if(fieldId!='') return update();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/permissionFieldAction!insertPermissionfield.ajax',
		param:{parentId:$('#treeParentId').val()},
		success : function(id) {
			$('#fieldId').val(id);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/permissionFieldAction!updatePermissionfield.ajax',
		success : function() {
			refreshFlag = true;
			dictDetalGridManager.loadData();
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

function moveHandler(){
	UICtrl.showMoveTreeDialog({
		gridManager:gridManager,kindId:CommonTreeKind.PermissionField,
		save:function(parentId){
			DataUtil.updateById({action:'permissionFieldAction!updatePermissionfieldParentId.ajax',
				gridManager:gridManager,idFieldName:'fieldId',param:{parentId:parentId},
				onSuccess:function(){
					reloadGrid();	
				}
			});
		}
	});
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'permissionFieldAction!updatePermissionfieldStatus.ajax',
		gridManager: gridManager,idFieldName:'fieldId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}

//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'permissionFieldAction!updatePermissionfieldStatus.ajax',
		gridManager: gridManager,idFieldName:'fieldId', param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});			
}