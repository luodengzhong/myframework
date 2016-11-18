var gridManager = null,refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		//manageType:'hrBusinessRegistrationManage',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds : "ogn"};
			}
			return {showDisabledOrg:0};
		},
		changeNodeIcon:function(data){
			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
		},
		IsShowMenu:false,
		onClick : onFolderTreeNodeClick
	});
}
function onFolderTreeNodeClick(data) {
	var html=[],organId='',name='';
	if(!data){
		html.push('人员职级序列');
	}else{
		organId=data.id,name=data.name;
		html.push('<font style="color:Tomato;font-size:13px;">[',name,']</font>人员职级序列');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#organId').val(organId); 
	if (gridManager&&organId!='') {
		UICtrl.gridSearch(gridManager,{organId:organId});
	}else{
		gridManager.options.parms['organId']='';
	}
}
function defaultNodeClick() {
	var html=[],organId='0'; 
	html.push('人员职级序列'); 
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#organId').val(organId); 
	if (gridManager) {
		UICtrl.gridSearch(gridManager,{organId:organId});
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
		saveSortIDHandler: saveSortIDHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "编码", name: "code", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "名称", name: "name", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "职级", name: "staffingPostsRankTextView", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "权重", name: "weight", width: 100, minWidth: 60, type: "string", align: "left" },		
		{ display: "序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.sequenceRender(item,'postsRankSequenceId');
			}
		},		   
		{ display: "状态", name: "status", width: 100, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.getStatusInfo(item.status);
			}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/hrSetupAction!slicedQueryPostsRankSequence.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.postsRankSequenceId);
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
	UICtrl.showAjaxDialog({url: web_app.name + '/hrSetupAction!showInsertPostsRankSequence.load?organId='+ gridManager.options.parms['organId'],width:320, ok: save});
}

//编辑按钮
function updateHandler(postsRankSequenceId){
	if(!postsRankSequenceId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		postsRankSequenceId=row.postsRankSequenceId;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/hrSetupAction!showUpdatePostsRankSequence.load',width:320, param:{postsRankSequenceId:postsRankSequenceId}, ok: save});
}

//删除按钮
function deleteHandler(){
	DataUtil.del({action:'hrSetupAction!deletePostsRankSequence.ajax',
		gridManager:gridManager,idFieldName:'postsRankSequenceId',
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

//新增保存
function save() {
	var _self=this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/hrSetupAction!savePostsRankSequence.ajax',
		success : function(data) {
			_self.close();
			reloadGrid();		  
		}
	});
}


//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "hrSetupAction!updatePostsRankSequenceSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'postsRankSequenceId', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'hrSetupAction!updatePostsRankSequenceStatus.ajax',
		gridManager: gridManager,idFieldName:'postsRankSequenceId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'hrSetupAction!updatePostsRankSequenceStatus.ajax',
		gridManager: gridManager,idFieldName:'postsRankSequenceId',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}

