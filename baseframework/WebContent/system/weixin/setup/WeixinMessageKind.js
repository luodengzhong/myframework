var gridManager = null,refreshFlag = false,dataCollectionGridManager=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	UICtrl.initDefaulLayout();
	$('#maintree').commonTree({
		kindId : CommonTreeKind.weixinMessageKind,
		onClick : onFolderTreeNodeClick
	});
}
function onFolderTreeNodeClick(data,folderId) {
	var html=[],parentId=folderId;
	if(folderId==CommonTreeKind.weixinMessageKind){
		parentId="";
		html.push('类别列表');
	}else{
		html.push('<font style="color:Tomato;font-size:13px;">[',data.name,']</font>类别列表');
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
		{ display: "类别名称", name: "name", width: 120, minWidth: 60, type: "string", align: "left" },		   	   
		{ display: "类别编码", name: "code", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "发送类别", name: "msgTypeTextView", width: 80, minWidth: 60, type: "string", align: "left" },	
		{ display: "默认标题", name: "title", width: 220, minWidth: 60, type: "string", align: "left" },	
		{ display: "序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.sequenceRender(item,'weixinMessageKindId');
			}
		},		   
		{ display: "状态", name: "status", width: 60, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.getStatusInfo(item.status);
			}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/weixinSetupAction!slicedQueryWeixinMessageKind.ajax',
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
			updateHandler(data.weixinMessageKindId);
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
		url: web_app.name + '/weixinSetupAction!showInsertWeixinMessageKind.load',
		width:650,
		title:'消息类别',
		init:initDetailPage,
		ok: save
	});
}

//编辑按钮
function updateHandler(weixinMessageKindId){
	if(!weixinMessageKindId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		weixinMessageKindId=row.weixinMessageKindId;
	}
	UICtrl.showAjaxDialog({
		url: web_app.name + '/weixinSetupAction!showUpdateWeixinMessageKind.load', 
		param:{weixinMessageKindId:weixinMessageKindId},
		width:650,
		title:'消息类别',
		init:initDetailPage,
		ok: save
	});
}

var filetypeMap={
	text:[],
	news:['jpg','png'],
	image:['jpg','png'],
	voice:['amr'],
	video:['mp4'],
	file:[]
};
function initDetailPage(){
	$('#detailSequence').spinner({countWidth:80});
	var msgType=$('#detailMsgType').val();
	$('#weixinMessageKindIdFileList').fileList({filetype:filetypeMap[msgType]});
}

//删除按钮
function deleteHandler(){
	DataUtil.del({action:'weixinSetupAction!deleteWeixinMessageKind.ajax',
		gridManager:gridManager,idFieldName:'weixinMessageKindId',
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

//保存
function save() {
	var param={};
	if($('#detailWeixinMessageKindId').val()==''){
		param['parentId']=$('#treeParentId').val();
	}
	var _self=this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/weixinSetupAction!saveWeixinMessageKind.ajax',
		param:param,
		success : function(data) {
			reloadGrid(); 
			_self.close();
		}
	});
	return false;
}


//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "weixinSetupAction!updateWeixinMessageKindSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'weixinMessageKindId', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'weixinSetupAction!updateWeixinMessageKindStatus.ajax',
		gridManager: gridManager,idFieldName:'weixinMessageKindId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'weixinSetupAction!updateWeixinMessageKindStatus.ajax',
		gridManager: gridManager,idFieldName:'weixinMessageKindId',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}

function moveHandler(){
	UICtrl.showMoveTreeDialog({
		gridManager:gridManager,title:'移动类别',kindId:CommonTreeKind.weixinMessageKind,
		save:function(parentId){
			DataUtil.updateById({action:'weixinSetupAction!updateWeixinMessageKindFolderId.ajax',
				gridManager:gridManager,idFieldName:'weixinMessageKindId',param:{parentId:parentId},
				onSuccess:function(){
					reloadGrid();	
				}
			});
		}
	});
}
