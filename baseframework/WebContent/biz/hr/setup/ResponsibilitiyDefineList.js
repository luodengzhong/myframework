var gridManager = null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	UICtrl.initDefaulLayout();
	$('#maintree').commonTree({
		kindId : CommonTreeKind.Responsibilitiykind,
		onClick : onFolderTreeNodeClick
	});
}
function onFolderTreeNodeClick(data,folderId) {
	var html=[],parentId=folderId;
	if(folderId==CommonTreeKind.Responsibilitiykind){
		parentId="";
		html.push('职能列表');
	}else{
		html.push('<font style="color:Tomato;font-size:13px;">[',data.name,']</font>职能列表');
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
		saveSortIDHandler: saveSortIDHandler,
		moveHandler:moveHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "职能名称", name: "name", width: 100, minWidth: 60, type: "string", align: "left" },		   	   
		{ display: "职能编码", name: "code", width: 100, minWidth: 60, type: "string", align: "left" },		
		{ display: "职能大类", name: "parentName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "描述", name: "description", width: 200, minWidth: 60, type: "string", align: "left" },		    
		{ display: "序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.sequenceRender(item,'responsibilitiyDefineId');
			}
		},		   
		{ display: "状态", name: "status", width: 100, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.getStatusInfo(item.status);
			}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/responsibilitiyAction!slicedQueryResponsibilitiyDefine.ajax',
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
			updateHandler(data.responsibilitiyDefineId);
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
		Public.tip('请选择职能大类！'); 
		return;
	}
	UICtrl.showAjaxDialog({
		url: web_app.name + '/responsibilitiyAction!showInsertResponsibilitiyDefine.load',
		width:320,
		init:initDetailPage,
		ok: save
	});
}

//编辑按钮
function updateHandler(responsibilitiyDefineId){
	if(!responsibilitiyDefineId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		responsibilitiyDefineId=row.responsibilitiyDefineId;
	}
	UICtrl.showAjaxDialog({
		url: web_app.name + '/responsibilitiyAction!showUpdateResponsibilitiyDefine.load', 
		param:{responsibilitiyDefineId:responsibilitiyDefineId},
		width:320,
		init:initDetailPage,
		ok: save
	});
}

function initDetailPage(){
	$('#detailSequence').spinner({countWidth:80});
}

//删除按钮
function deleteHandler(){
	DataUtil.del({action:'responsibilitiyAction!deleteResponsibilitiyDefine.ajax',
		gridManager:gridManager,idFieldName:'responsibilitiyDefineId',
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
	if($('#detailResponsibilitiyDefineId').val()==''){
		param['parentId']=$('#treeParentId').val();
	}
	var _self=this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/responsibilitiyAction!saveResponsibilitiyDefine.ajax',
		param:param,
		success : function(data) {
			_self.close();
			reloadGrid();		  
		}
	});
}

//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "responsibilitiyAction!updateResponsibilitiyDefineSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'responsibilitiyDefineId', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'responsibilitiyAction!updateResponsibilitiyDefineStatus.ajax',
		gridManager: gridManager,idFieldName:'responsibilitiyDefineId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'responsibilitiyAction!updateResponsibilitiyDefineStatus.ajax',
		gridManager: gridManager,idFieldName:'responsibilitiyDefineId',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}

function moveHandler(){
	UICtrl.showMoveTreeDialog({
		gridManager:gridManager,title:'移动类别',kindId:CommonTreeKind.Responsibilitiykind,
		save:function(parentId){
			DataUtil.updateById({action:'responsibilitiyAction!updateFolderId.ajax',
				gridManager:gridManager,idFieldName:'responsibilitiyDefineId',param:{parentId:parentId},
				onSuccess:function(){
					reloadGrid();	
				}
			});
		}
	});
}

