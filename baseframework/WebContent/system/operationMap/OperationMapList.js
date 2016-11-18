var gridManager = null,refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	UICtrl.initDefaulLayout();
	$('#maintree').commonTree({
		kindId : CommonTreeKind.OperationMapKind,
		onClick : onFolderTreeNodeClick
	});
}
function onFolderTreeNodeClick(data,folderId) {
	var html=[],folderId=folderId;
	if(folderId==CommonTreeKind.OperationMapKind){
		folderId="";
		html.push('类别列表');
	}else{
		html.push('<font style="color:Tomato;font-size:13px;">[',data.name,']</font>类别列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#treeParentId').val(folderId);
	if (gridManager) {
		UICtrl.gridSearch(gridManager,{folderId:folderId});
	}
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: function(){
				DataUtil.del({action:'operationMapAction!delete.ajax',
					gridManager:gridManager,idFieldName:'operationMapId',
					onSuccess:function(){
						reloadGrid();		  
					}
				});
		},
		enableHandler: enableHandler,
		disableHandler: disableHandler,
		saveSortIDHandler: saveSortIDHandler,
		moveHandler:moveHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "名称", name: "mapName", width: 200, minWidth: 60, type: "string", align: "left" },		   	   
		{ display: "编码", name: "mapCode", width: 100, minWidth: 60, type: "string", align: "left" },		
		{ display: "序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.sequenceRender(item,'operationMapId');
			}
		},		   
		{ display: "状态", name: "status", width: 100, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.getStatusInfo(item.status);
			}
		},
		{ display: "图形定义", width:80, minWidth: 60, type: "string", align: "center",
			render: function (item) { 
				return '<a href="##" class="GridStyle" onclick="showCharPage('+item.operationMapId+')">图形定义</a>'
			}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/operationMapAction!slicedQuery.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox:true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.operationMapId);
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

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}


//添加按钮 
function addHandler() {
	var parentId=$('#treeParentId').val();
	if(parentId==''){
		Public.tip('请选择类别树！'); 
		return;
	}
	UICtrl.showAjaxDialog({
		url: web_app.name + '/operationMapAction!showInsert.load',
		width:450,
		title:'业务导图类别',
		ok: save,
		close: dialogClose
	});
}

//编辑按钮
function updateHandler(operationMapId){
	if(!operationMapId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		operationMapId=row.operationMapId;
	}
	UICtrl.showAjaxDialog({
		url: web_app.name + '/operationMapAction!showUpdate.load', 
		param:{operationMapId:operationMapId},
		width:450,
		title:'业务导图类别',
		ok: save,
		close: dialogClose
	});
}

//保存
function save() {
	var parentId=$('#treeParentId').val(),_self=this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/operationMapAction!save.ajax',
		param:{folderId:parentId},
		success : function(data) {
			_self.close();
			reloadGrid();
		}
	});
	return false;
}


//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "operationMapAction!updateSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'operationMapId', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'operationMapAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'operationMapId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'operationMapAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'operationMapId',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}

function moveHandler(){
	UICtrl.showMoveTreeDialog({
		gridManager:gridManager,title:'移动类别',kindId:CommonTreeKind.OperationMapKind,
		save:function(parentId){
			DataUtil.updateById({action:'operationMapAction!updateFolderId.ajax',
				gridManager:gridManager,idFieldName:'operationMapId',param:{folderId:parentId},
				onSuccess:function(){
					reloadGrid();	
				}
			});
		}
	});
}

function showCharPage(id){
	var url=web_app.name + '/operationMapAction!showCharPage.do?operationMapId='+id;
	parent.addTabItem({ tabid: 'operationMap'+id, text: '图形定义', url:url});
}