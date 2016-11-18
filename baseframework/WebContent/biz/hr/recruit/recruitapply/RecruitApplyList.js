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
		html.push('招聘需求申报列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>招聘需求申报列表');
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
			viewHandler();
		},
		reStartHander:{id:'reStart',text:'重启招聘需求',img:'page_deny.gif',click:function(){
			reStart();
		}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		   
		{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
		{ display: "申请人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "招聘单位名称", name: "organName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "招聘部门名称", name: "recDptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "招聘岗位名称", name: "recPosName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "招聘人数", name: "recNum", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "已招聘人数", name: "beRecNum", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "人员类别", name: "staffKindTextView", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "编制状态", name: "staffingLevelTextView", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "申请状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left"},		   
		{ display: "审批时间", name: "approveDate", width: 100, minWidth: 60, type: "date", align: "left" }
		
		],
		dataAction : 'server',
		url: web_app.name+'/recruitApplyAction!slicedQuery.ajax',
		manageType:'hrBaseRecruitData',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		toolbar: toolbarOptions,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.jobApplyId);
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


function reStart(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var jobApplyId=row.jobApplyId;
	var status=row.status;
	if(status!=4){
		Public.tip('未归档,无需重启！'); return; 
	}
	Public.ajax(web_app.name + '/recruitApplyAction!reStart.ajax',{jobApplyId:jobApplyId},function(){
		reloadGrid();
	});
}

function viewHandler(jobApplyId){
	if(!jobApplyId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		jobApplyId=row.jobApplyId;
	}
	parent.addTabItem({
		tabid: 'HRRecruitApply'+jobApplyId,
		text: '招聘需求申报',
		url: web_app.name + '/recruitApplyAction!showUpdate.job?bizId=' 
			+ jobApplyId+'&isReadOnly=true'
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