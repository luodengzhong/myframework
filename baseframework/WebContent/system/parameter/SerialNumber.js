var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});

function initializeUI(){
	UICtrl.initDefaulLayout();
	$('#maintree').commonTree({
		kindId : CommonTreeKind.SerialNumber,
		onClick : onFolderTreeNodeClick
	});
}

function onFolderTreeNodeClick(data,folderId) {
	var html=[],parentId=folderId;
	if(folderId==CommonTreeKind.SerialNumber){
		parentId="";
		html.push('单据编号列表');
	}else{
		html.push('<font style="color:Tomato;font-size:13px;">[',data.name,']</font>单据编号列表');
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
		moveHandler:moveHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "编码", name: "code", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "名称", name: "name", width: 140, minWidth: 60, type: "string", align: "left" },		   
		{ display: "编码规则", name: "codeRule", width: 200, minWidth: 60, type: "string", align: "left" },		   
		{ display: "当前值", name: "value", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "最后更新日期", name: "lastUpdateDate", width: 100, minWidth: 60, type: "date", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/parameterAction!slicedQuerySerialNumber.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'code',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		checkbox: true,
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
	var parentId=$('#treeParentId').val();
	if(parentId==''){
		Public.tip('请选择类别树！'); 
		return;
	}
	UICtrl.showAjaxDialog({
		url: web_app.name + '/parameterAction!showInsertSerialNumber.load',
		title: "添加单据编号规则",
		width:600, 
		ok: insert, 
		close: dialogClose
		});
}

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	UICtrl.showAjaxDialog({
		url: web_app.name + '/parameterAction!showUpdateSerialNumber.load',
		title: "修改单据编号规则",
		width:600, 
		param:{id:id}, 
		ok: update, 
		close: dialogClose
		});
}

//删除按钮
function deleteHandler(){
	DataUtil.del({action:'parameterAction!deleteSerialNumber.ajax',
		gridManager:gridManager,idFieldName:'id',
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

//新增保存
function insert() {
	var serialNumberID=$('#serialNumberID').val();
	if(serialNumberID!='') return update();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/parameterAction!insertSerialNumber.ajax',
		param:{parentId:$('#treeParentId').val()},
		success : function(id) {
			$('#serialNumberID').val(id);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/parameterAction!updateSerialNumber.ajax',
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

//移动
function moveHandler(){
	UICtrl.showMoveTreeDialog({
		gridManager:gridManager,title:'移动到...',kindId:CommonTreeKind.SerialNumber,
		save:function(parentId){
			DataUtil.updateById({action:'parameterAction!moveSerialNumber.ajax',
				gridManager:gridManager,idFieldName:'id',param:{parentId:parentId},
				onSuccess:function(){
					reloadGrid();
				}
			});
		}
	});
}