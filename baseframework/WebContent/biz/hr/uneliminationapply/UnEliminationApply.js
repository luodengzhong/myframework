var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
		initializeUI();
	initializeGrid();
});


function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrBaseTalentsChosenData',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds : "ogn,dpt"};
			}
			return {showDisabledOrg:0};
		},
		changeNodeIcon:function(data){
			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
		},
		IsShowMenu:false,
		onClick : onFolderTreeNodeClick});
}


function onFolderTreeNodeClick(data) {

	var html=[],fullId='',fullName='';
	if(!data){
		html.push('暂不淘汰人员申请单');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>暂不淘汰人员申请单');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#mainFullId').val(fullId);
	if (gridManager&&fullId!='') {
		UICtrl.gridSearch(gridManager,{fullId:fullId});
	}else{
		gridManager.options.parms['fullId']='';
	}
	
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		viewHandler: function(){
			viewHandler();
		}
		
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		   
		{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left" },		

		{ display: "申请状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "岗位名称", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "机构名称", name: "orgnizationName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "中心名称", name: "centerName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "部门", name: "departmentName", width: 100, minWidth: 60, type: "string", align: "left" }	,
		{ display: "申请人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "机构名称", name: "organName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "部门名称", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "岗位名称", name: "positionName", width: 100, minWidth: 60, type: "string", align: "left" },		  
		{ display: "行政级别", name: "posLevelTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "入职时间", name: "employedDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "年龄", name: "age", width: 100, minWidth: 60, type: "string", align: "left" }	   
		],
		dataAction : 'server',
		url: web_app.name+'/unEliminationApplyAction!slicedQuery.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.unEliminationApplyId);
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

//编辑按钮
function viewHandler(unEliminationApplyId){
	if(!unEliminationApplyId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		unEliminationApplyId=row.unEliminationApplyId;
	}
	parent.addTabItem({
		tabid: 'HRProbationPosApply'+unEliminationApplyId,
		text: '暂不淘汰申请单详情',
		url: web_app.name + '/unEliminationApplyAction!showUpdate.job?bizId=' 
			+ unEliminationApplyId+'&isReadOnly=true'
	}
	);
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
	var action = "unEliminationApplyAction!updateSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'id', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'unEliminationApplyAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'id', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'unEliminationApplyAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'id',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
*/
