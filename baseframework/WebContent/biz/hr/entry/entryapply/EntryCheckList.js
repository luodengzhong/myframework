var gridManager = null, refreshFlag = false;
var dataSource={
		isTrain:{0:'否',1:'是'}
};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
//	initializeUI();
	initializeGrid();
});
/*function initializeUI(){
	  UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrBaseRecruitData',
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
		html.push('入职手续办理列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>入职手续办理列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#mainFullId').val(fullId);
	if (gridManager&&fullId!='') {
		UICtrl.gridSearch(gridManager,{fullId:fullId});
	}else{
		gridManager.options.parms['fullId']='';
	}
	
}*/
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		//deleteHandler: deleteHandler
		viewHandler:function(){
			viewHandler();
		}
	});
	
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		 { display: "申请时间", name: "fillinDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
		{ display: "申请人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "员工姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "入职时间", name: "entryTime", width: 100, minWidth: 60, type: "date", align: "left" },
		{ display: "督导师姓名", name: "teacher", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "是否参加培训", name: "isTrain", width: 100, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return dataSource.isTrain[item.isTrain];
			} },		   
		{ display: "培训时间", name: "trainDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
		{ display: "申请状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left" }	 
		],
		dataAction : 'server',
		url: web_app.name+'/entryCheckAction!slicedQuery.ajax',
		manageType:'hrBaseRecruitData',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
		fixedCellHeight : true,
		toolbar: toolbarOptions,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.id);
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


function viewHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	parent.addTabItem({ 
		tabid: 'HREntryApply'+id,
		text: '新员工入职手续查看',
		url: web_app.name + '/entryCheckAction!showUpdate.job?bizId=' 
			+ id +'&isReadOnly=true'
		}); 
}

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}


