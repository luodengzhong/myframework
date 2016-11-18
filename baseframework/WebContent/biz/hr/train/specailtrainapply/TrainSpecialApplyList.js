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
		manageType:'hrBasePersonquatoData',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,orgKindId : "ogn,dpt"};
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
		html.push('专项培训申请列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>专项培训申请列表');
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
			updateHandler();
		},
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
		{ display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "申请公司", name: "applyCompany", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "申请部门", name: "applyDept", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "申请状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "培训级别", name: "trainingLevelTextView", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "培训项目名称", name: "applyName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "课程大纲", name: "trainCourse", width: 100, minWidth: 60, type: "string", align: "left" },		   
        { display: "培训开始时间", name: "trainStartTime", width: 100, minWidth: 60, type: "date", align: "left" },		   
		{ display: "培训结束时间", name: "trainEndTime", width: 100, minWidth: 60, type: "date", align: "left" },		   
		{ display: "费用预算", name: "trainFee", width: 100, minWidth: 60, type: "string", align: "left" },		  
		{ display: "申请人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "机构名称", name: "organName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "部门名称", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "岗位名称", name: "positionName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "申请原因", name: "trainAddReason", width: 100, minWidth: 60, type: "string", align: "left" }		   
		  
		],
		dataAction : 'server',
		url: web_app.name+'/specailtrainapplyAction!slicedQueryTrainSpecialApply.ajax',
		pageSize : 20,
		manageType:'hrBasePersonquatoData',
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
			updateHandler(data.trainSpecialApplyId);
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
function updateHandler(trainSpecialApplyId){
	if(!trainSpecialApplyId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		trainSpecialApplyId=row.trainSpecialApplyId;
	}
		parent.addTabItem({
		tabid: 'HRTrainOutApplyList'+trainSpecialApplyId,
		text: '专项培训申请明细',
		url: web_app.name + '/specailtrainapplyAction!showUpdateTrainSpecialApply.do?bizId=' 
			+ trainSpecialApplyId+'&isReadOnly=true'
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

