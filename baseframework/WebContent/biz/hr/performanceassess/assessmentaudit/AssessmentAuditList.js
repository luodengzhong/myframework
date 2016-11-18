
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
	manageType:'hrPerFormAssessManage',
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
	html.push('考评审核列表');
}else{
	fullId=data.fullId,fullName=data.fullName;
	html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>考评审核列表');
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
		viewHandler: viewHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "考评名称", name: "assessPaName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "机构名称", name: "organName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "部门名称", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "岗位名称", name: "positionName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "人员名称", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left" }	   
		],
		dataAction : 'server',
		url: web_app.name+'/assessmentauditAction!slicedQueryAssessmentAudit.ajax',
		pageSize : 20,
		manageType:'hrPerFormAssessManage',
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.auditId);
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
function viewHandler(auditId){
	if(!auditId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		auditId=row.auditId;
	}
	
	parent.addTabItem({
		tabid: 'HRAssessmentList'+auditId,
		text: '考评审核',
		url: web_app.name + '/assessmentauditAction!showUpdateAssessmentAudit.job?bizId=' 
			+ auditId+'&isReadOnly=true'
	  }
	);
}
