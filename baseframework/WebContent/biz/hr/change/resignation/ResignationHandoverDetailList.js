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
		html.push('异动明细');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>异动明细');
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
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		},
	viewHandler: function(){
		updateHandler();
	}
	});
	
	    var columns=[
		 			{ display: "序号", name: "myRownum", width: 60, minWidth: 60, type: "string", align: "center" },
		 			{ display: "填表日期", name: "fillinDate", width: 80, minWidth: 60, type: "date", align: "left" },
		 			{ display: "单据号码", name: "billCode", width:120, minWidth: 120, type: "string", align: "left" },
		 			{ display: "制表人", name: "personMemberName", width: 80, minWidth: 60, type: "string", align: "left"} ,
		 			{ display: "离职员工", name: "staffName", width: 80, minWidth: 60, type: "string", align: "left"} ,
		 			{ display: "工作内容", name: "workContent", width: 250, minWidth: 250, type: "string", align: "left"},		   
		 			{ display: "完成时间", name: "finishDate", width: 100, minWidth: 100, type: "string", align: "left"},		   
		 			{ display: "完成状况", name: "finishStatus", width: 150, minWidth: 150, type: "string", align: "left" },		   
		 			{ display: "完成进度", name: "finishProgress", width: 150, minWidth: 150, type: "string", align: "left"},		   
		 			{ display: "质量要求", name: "qualityRequirement", width: 150, minWidth: 150, type: "string", align: "left"},	
		 			{ display: "交接人", name: "handoverStaffName", width: 150, minWidth: 150, type: "string", align: "left"}
		 	    ];
	
	gridManager = UICtrl.grid('#maingrid', {
		columns: columns,
		dataAction : 'server',
		url: web_app.name+'/resignationHandoverAction!slicedQueryResignationHandoveDetail.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		manageType:'hrReshuffleManage',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.auditId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}
//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		auditId=row.auditId;
	}else{
		auditId=id;
	}
	
	parent.addTabItem({
		tabid: 'HRResignationHandoverDetailList'+auditId,
		text: '员工异动查询',
		url: web_app.name + '/resignationHandoverAction!showUpdate.job?bizId=' 
			+ auditId+'&isReadOnly=true'
	}
	);
}
// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	var isEffect=param['isEffect'];
	if(isEffect=='1'){
		param['isEffect']='0';
	}else{
	    param['isEffect']='';
	}
	UICtrl.gridSearch(gridManager, param);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
	onFolderTreeNodeClick();
}