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
	manageType:'hrArchivesManage',
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
	html.push('回流员工列表');
}else{
	fullId=data.fullId,fullName=data.fullName;
	html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>回流员工列表');
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
		/*viewHandler: function(){
			viewHandler();
		}*/
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "单位名称", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "员工姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "原入职时间", name: "hireDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "原离职时间", name: "departurDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "离职时个人信息描述", name: "departurRemark", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "离职时行政级别", name: "departurDuty", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "离职时职级", name: "staffingPostsRankTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "离职时集团工龄", name: "leaveWorkTime", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "新入职时间", name: "newHireDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "离职时月份", name: "leaveWorkMonth", width: 100, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/hrArchivesAction!sliceBackFlowListQuery.ajax',
		manageType:'hrArchivesManage',
		pageSize : 20,
		width : '99%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'archivesId',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.archivesId);
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
function viewHandler(archivesId){
	if(!archivesId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		archivesId=row.archivesId;
	}
	parent.addTabItem({
		tabid: 'HRbackFlowList'+archivesId,
		text: '回流员工明细',
		url: web_app.name + '/specialFamilyVisitAction!showUpdate.job?bizId=' 
			+ specialId+'&isReadOnly=true'
	}
	);
}


