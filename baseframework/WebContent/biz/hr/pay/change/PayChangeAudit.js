var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	var changeOrgName=$('#changeOrgName');
	changeOrgName.orgTree({
		filter:'dpt,ogn',
		manageType:'hrPayChange',
		param:{searchQueryCondition:"org_kind_id in('ogn','dpt')"},
		back:{
			text:changeOrgName,
			value:'#changeOrgId',
			id:'#changeOrgId',
			name:changeOrgName
		}
	});
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrPayChange',
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
		onClick : onFolderTreeNodeClick
	});
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('申请列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>申请列表');
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
		//deleteHandler: deleteHandler
		viewHandler:function(){
			viewHandler();
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "变化人员", name: "changePersonName", width: 300, minWidth: 60, type: "string", align: "left" },
		{ display: "变化单位", name: "changeOrgName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left" },
	    { display: "单位", name: "organName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "部门", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "岗位", name: "positionName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "制表人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" }	   
		],
		dataAction : 'server',
		url: web_app.name+'/hRPayChangeAction!slicedQueryPayChangeAudit.ajax',
		manageType:'hrPayChange',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
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
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	if(parseInt(row.status,10)!=0){
		Public.tip('数据已提交不能删除');
		return;
	}
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/hRPayChangeAction!deletePayChangeAudit.ajax',{auditId:row.auditId}, function(){
			reloadGrid();
		});
	});
}
function viewHandler(auditId){
	if(!auditId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		auditId=row.auditId;
	}
	var url=web_app.name + '/hRPayChangeAction!showUpdate.job?bizId='+auditId+'&isReadOnly=true';
	parent.addTabItem({ tabid: 'HRPayChangeView'+auditId, text: '查看薪酬变动审批表', url:url});
}