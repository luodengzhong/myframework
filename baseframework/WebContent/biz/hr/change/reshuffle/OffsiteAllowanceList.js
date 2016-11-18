
var gridManager = null, refreshFlag = false;
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
		manageType:'hrReshuffleManage',
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
		html.push('异动津贴');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>异动津贴');
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
		}
		
	});
	
    var columns=[
		 			{ display: "员工姓名", name: "staffName", width: 80, minWidth: 80, type: "string", align: "center" },
		 			{ display: "填表日期", name: "fillinDate", width: 80, minWidth: 60, type: "date", align: "left" },
		 			{ display: "单据号码", name: "billCode", width: 120, minWidth: 120, type: "string", align: "left" },
		 			{ display: "津贴标准/月", name: "allowanceStandard", width: 120, minWidth: 120, type: "string", align: "left" },
		 			{ display: "开始时间", name: "beginDate", width: 120, minWidth: 120, type: "date", align: "left" },
		 			{ display: "结束时间", name: "endDate", width: 80, minWidth: 60, type: "date", align: "left" },
		 			{ display: "申请状态", name: "statusTextView", width: 80, minWidth: 60, type: "string", align: "left" }
		 	    ];
	
	gridManager = UICtrl.grid('#maingrid', {
		columns: columns,
		dataAction : 'server',
		url: web_app.name+'/offsiteAllowanceAction!slicedQuery.ajax',
		manageType:'hrReshuffleManage',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		enabledEdit: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.offsiteAllowanceId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}


//重置表单
function resetForm(obj) {
	$(obj).formClean();
}


//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		auditId=row.offsiteAllowanceId;
	}else{
		auditId=id;
	}
	
	parent.addTabItem({
		tabid: 'HROffsiteAllowanceList'+auditId,
		text: '员工异动津贴',
		url: web_app.name + '/offsiteAllowanceAction!showUpdate.job?bizId=' 
			+ auditId+'&isReadOnly=true'
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

//刷新表格
function reloadGrid() {
	gridManager.loadData();
}


