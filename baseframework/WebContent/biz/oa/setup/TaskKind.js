var gridManager = null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	UICtrl.initDefaulLayout();

	$('#maintree').commonTree({
		kindId : CommonTreeKind.TaskKind,
		onClick : onFolderTreeNodeClick
	});
}
function onFolderTreeNodeClick(data,folderId) {
	var html=[],parentId=folderId;
	if(folderId==CommonTreeKind.TaskKind){
		parentId="";
		html.push('类别列表');
	}else{
		html.push('<font style="color:Tomato;font-size:13px;">[',data.name,']</font>类别列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#treeParentId').val(folderId);
	if (gridManager) {
		UICtrl.gridSearch(gridManager,{folderId:parentId});
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
		saveSortIDHandler: saveSortIDHandler,
		moveHandler:moveHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "类别名称", name: "taskKindName", width: 80, minWidth: 60, type: "string", align: "left" },		   	   
		{ display: "类别编码", name: "taskKindCode", width: 80, minWidth: 60, type: "string", align: "left" },		   
		{ display: "默认级别", name: "taskLevelTextView", width: 80, minWidth: 60, type: "string", align: "left" },	
		{ display: "扩展属性编码", name: "extendedCode", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "附件编码", name: "fileCode", width: 60, minWidth: 60, type: "string", align: "left" },		   
		{ display: "创建类", name: "createClass", width: 150, minWidth: 60, type: "string", align: "left" },		   
		{ display: "创建函数", name: "createFun", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "查看连接", name: "showUrl", width: 200, minWidth: 60, type: "string", align: "left" },		   
		{ display: "序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.sequenceRender(item,'taskKindId');
			}
		},		   
		{ display: "状态", name: "status", width: 100, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.getStatusInfo(item.status);
			}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/taskKindAction!slicedQuery.ajax',
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
			updateHandler(data.taskKindId);
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
		url: web_app.name + '/taskKindAction!showInsert.load',
		width:650,
		init:initDetailPage,
		ok: save
	});
}

//编辑按钮
function updateHandler(taskKindId){
	if(!taskKindId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		taskKindId=row.taskKindId;
	}
	UICtrl.showAjaxDialog({
		url: web_app.name + '/taskKindAction!showUpdate.load', 
		param:{taskKindId:taskKindId},
		width:650,
		init:initDetailPage,
		ok: save
	});
}

function initDetailPage(){
	$('#detailSequence').spinner({countWidth:80});
	//$('#calendarName').searchbox({type:'oa',name:'choosePlanCalendar',back:{calendarId:'#calendarId',calendarName:'#calendarName'}});
}

//删除按钮
function deleteHandler(){
	DataUtil.del({action:'taskKindAction!delete.ajax',
		gridManager:gridManager,idFieldName:'taskKindId',
		onCheck:function(data){
			if(parseInt(data.status)!=0){
				Public.tip(data.taskKindName+'不是草稿状态,不能删除!');
				return false;
			}
		},
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

//保存
function save() {
	var param={};
	if($('#detailTaskKindId').val()==''){
		param['folderId']=$('#treeParentId').val();
	}
	var _self=this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/taskKindAction!save.ajax',
		param:param,
		success : function(data) {
			_self.close();
			reloadGrid();
		}
	});
}


//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "taskKindAction!updateSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'taskKindId', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'taskKindAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'taskKindId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'taskKindAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'taskKindId',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}

function moveHandler(){
	UICtrl.showMoveTreeDialog({
		gridManager:gridManager,title:'移动类别',kindId:CommonTreeKind.TaskKind,
		save:function(parentId){
			DataUtil.updateById({action:'taskKindAction!updateFolderId.ajax',
				gridManager:gridManager,idFieldName:'taskKindId',param:{folderId:parentId},
				onSuccess:function(){
					reloadGrid();	
				}
			});
		}
	});
}

