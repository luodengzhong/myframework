
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
		html.push('编制定员申请单列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>编制定员申请单列表');
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
		viewHandler:function(){
			updateHandler();
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		
		columns: [
		   
		{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
		{ display: "推荐人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "被推荐人姓名", name: "recomName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "推荐单位", name: "recomOrgName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "推荐部门", name: "recomDptName", width: 100, minWidth: 60, type: "string", align: "left" },		   

		{ display: "推荐职位", name: "recomPosName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "现就职单位", name: "nowCompany", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "现任职务", name: "nowPos", width: 100, minWidth: 60, type: "string", align: "left" },		
		{ display: "性别", name: "sexTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "联系方式", name: "telephone", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "最高学历", name: "educationTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "与推荐人关系", name: "relation", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "推荐理由", name: "recomReason", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "审批时间", name: "approveDate", width: 100, minWidth: 60, type: "date", align: "left" }
		
		],
		dataAction : 'server',
		url: web_app.name+'/specialTalentRecomAction!slicedQuery.ajax',
		manageType:'hrBaseRecruitData',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		toolbar: toolbarOptions,
		sortOrder:'desc',
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.recomId);
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
function updateHandler(recomId){
	if(!recomId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		recomId=row.recomId;
	}
	parent.addTabItem({
		tabid: 'HRSpecialTalentRecom'+recomId,
		text: '特殊人才推荐表',
		url: web_app.name + '/specialTalentRecomAction!showUpdate.job?bizId=' 
			+ recomId+'&isReadOnly=true'
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
