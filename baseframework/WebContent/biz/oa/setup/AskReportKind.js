var gridManager = null,taskLevelData={};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	taskLevelData = $("#taskLevelId").combox("getJSONData");
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	UICtrl.initDefaulLayout();

	$('#maintree').commonTree({
		kindId : CommonTreeKind.AskReportKind,
		onClick : onFolderTreeNodeClick
	});
}
function onFolderTreeNodeClick(data,folderId) {
	var html=[],parentId=folderId;
	if(folderId==CommonTreeKind.AskReportKind){
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
		{ display: "类别名称", name: "name", width: 100, minWidth: 60, type: "string", align: "left" },		   	   
		{ display: "类别编码", name: "code", width: 80, minWidth: 60, type: "string", align: "left" },		   
		{ display: "扩展属性编码", name: "extendedFieldCode", width: 100, minWidth: 60, type: "string", align: "left" },		
		{ display: "备案管理权限", name: "recordManageType", width: 130, minWidth: 60, type: "string", align: "left" },		
		{ display: "级别", name: "reportLevel", width: 100, minWidth: 60, type: "string", align: "left",
			render: function(item){
				return taskLevelData[item.reportLevel];
			}
		},	
		{ display: "序号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.sequenceRender(item,'askReportKindId');
			}
		},
		{ display: "可选", name: "isChoose", width: 60, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return item.isChoose=='1'?'是':'否';
			}
		},	
		{ display: "附件必传", name: "isNeedAttachment", width: 60, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return item.isNeedAttachment=='1'?'是':'否';
			}
		},
		{ display: "发文号", name: "isNeedDispatchNo", width: 60, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return item.isNeedDispatchNo=='1'?'是':'否';
			}
		},
		{ display: "自由流程", name: "isFreeFlow", width: 60, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return item.isFreeFlow=='1'?'是':'否';
			}
		},
		{ display: "产生计划", name: "isBuildTask", width: 60, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return item.isBuildTask=='1'?'是':'否';
			}
		},
		{ display: "状态", name: "status", width: 60, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.getStatusInfo(item.status);
			}
		},
		{ display: "备注", name: "remark", width: 250, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/askReportKindAction!slicedQuery.ajax',
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
			updateHandler(data.askReportKindId);
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
		url: web_app.name + '/askReportKindAction!showInsert.load',
		width:330,
		title:'新增类别',
		init:initDetailPage,
		ok: save
	});
}

//编辑按钮
function updateHandler(askReportKindId){
	if(!askReportKindId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		askReportKindId=row.askReportKindId;
	}
	UICtrl.showAjaxDialog({
		url: web_app.name + '/askReportKindAction!showUpdate.load', 
		title:'编辑类别',
		param:{askReportKindId:askReportKindId},
		width:330,
		init:initDetailPage,
		ok: save
	});
}

function initDetailPage(){
	$('#detailSequence').spinner({countWidth:80});
}

//删除按钮
function deleteHandler(){
	DataUtil.del({action:'askReportKindAction!delete.ajax',
		gridManager:gridManager,idFieldName:'askReportKindId',
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

//保存
function save() {
	var param={};
	if($('#detailAskReportKindId').val()==''){
		param['parentId']=$('#treeParentId').val();
	}
	var _self=this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/askReportKindAction!save.ajax',
		param:param,
		success : function(data) {
			//$('#detailAskReportKindId').val(data);
			//refreshFlag = true;
			_self.close();
			reloadGrid();
		}
	});
}

//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "askReportKindAction!updateSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'askReportKindId', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'askReportKindAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'askReportKindId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'askReportKindAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'askReportKindId',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}

function moveHandler(){
	UICtrl.showMoveTreeDialog({
		gridManager:gridManager,title:'移动类别',kindId:CommonTreeKind.AskReportKind,
		save:function(parentId){
			DataUtil.updateById({action:'askReportKindAction!updateFolderId.ajax',
				gridManager:gridManager,idFieldName:'askReportKindId',param:{folderId:parentId},
				onSuccess:function(){
					reloadGrid();	
				}
			});
		}
	});
}

