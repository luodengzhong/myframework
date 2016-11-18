var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		kindId : CommonTreeKind.Parameter,
		onClick : onFolderTreeNodeClick
	});
}
function onFolderTreeNodeClick(data,folderId) {
	var html=[],parentId=folderId;
	if(folderId==CommonTreeKind.Parameter){
		parentId="";
		html.push('系统参数列表');
	}else{
		html.push('<font style="color:Tomato;font-size:13px;">[',data.name,']</font>系统参数列表');
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
			updateParameter();
		},
		deleteHandler: deleteHandler,
		moveHandler:moveHandler,
		syncCache:{id:'syncCache',text:'同步缓存',img:'page_dynamic.gif',click:function(){
			Public.ajax(web_app.name + "/parameterAction!syncCacheParameter.ajax");
		}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "编码", name: "code", width: 200, minWidth: 60, type: "string", align: "left" },		   
		{ display: "名称", name: "name", width: 200, minWidth: 60, type: "string", align: "left" },		   
		{ display: "参数值", name: "value", width: 220, minWidth: 60, type: "string", align: "left" },		   
		{ display: "备注", name: "remark", width: 300, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/parameterAction!slicedQueryParameter.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		sortName:'code',
		sortOrder:'asc',
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		checkbox: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateParameter(data.id);
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
		url: web_app.name + '/parameterAction!showInsertParameter.load',
		title:'添加系统参数',
		width:400, 
		ok: insert, 
		close: dialogClose
		});
}

//编辑按钮
function updateParameter(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	
	UICtrl.showAjaxDialog({
		url: web_app.name + '/parameterAction!showUpdateParameter.load',
		title:'修改系统参数', 
		param:{id:id}, 
		width:400,
		ok: update, 
		close: dialogClose});
}

//删除按钮
function deleteHandler(){
	DataUtil.del({action:'parameterAction!deleteParameter.ajax',
		gridManager:gridManager,idFieldName:'id',
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

//新增保存
function insert() {
	var parameterID=$('#parameterID').val();
	if(parameterID!='') return update();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/parameterAction!insertParameter.ajax',
		param:{parentId:$('#treeParentId').val()},
		success : function(id) {
			$('#parameterID').val(id);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/parameterAction!updateParameter.ajax',
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
		gridManager:gridManager,title:'移动系统参数',kindId:CommonTreeKind.Parameter,
		save:function(parentId){
			DataUtil.updateById({action:'parameterAction!moveParameter.ajax',
				gridManager:gridManager,idFieldName:'id',param:{parentId:parentId},
				onSuccess:function(){
					reloadGrid();
				}
			});
		}
	});
}
