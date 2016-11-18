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
	html.push('特殊家访申请单列表');
}else{
	fullId=data.fullId,fullName=data.fullName;
	html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>特殊家访申请单列表');
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
		{ display: "部门名称", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "岗位名称", name: "positionName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "申请人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "家访地址", name: "visitAdress", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "申请事由", name: "reason", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "申请状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/specialFamilyVisitAction!slicedQuery.ajax',
		manageType:'hrBaseRecruitData',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.specialId);
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
function viewHandler(specialId){
	if(!specialId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		specialId=row.specialId;
	}
	parent.addTabItem({
		tabid: 'HRSpecailFamilyVisitApply'+specialId,
		text: '特殊家访申请流程',
		url: web_app.name + '/specialFamilyVisitAction!showUpdate.job?bizId=' 
			+ specialId+'&isReadOnly=true'
	}
	);
}


