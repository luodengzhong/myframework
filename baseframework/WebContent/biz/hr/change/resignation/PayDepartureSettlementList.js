
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
		html.push('离职结算单明细');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>离职结算单明细');
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
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			    { display: "离职员工", name: "archivesName", width: 100, minWidth: 60, type: "string", align: "center" },		   
				{ display: "单位", name: "ognName", width: 100, minWidth: 60, type: "string", align: "center" },	
				{ display: "部门", name: "dptName", width: 100, minWidth: 60, type: "string", align: "center" },
				{ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "center" },
			  	{ display: "申请状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "center" },
			  	{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "center" },		   
				{ display: "单据号码", name: "billCode", width: 140, minWidth: 140, type: "string", align: "center" },
				{ display: "制表人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "center" }
		],
		dataAction : 'server',
		url: web_app.name+'/resignationSettlementAction!slicedQueryPayDepartureSettlement.ajax',
		pageSize : 20,
		manageType:'hrReshuffleManage',
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
		rowHeight : 25,
		toolbar: toolbarOptions,
		enabledEdit: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.departureSettlementMainId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

//function save(){
//	$('#submitForm').ajaxSubmit({url: web_app.name + '/resignationAction!saveResignationProcedures.ajax',
//		success : function(data) {
//			refreshFlag = true;
//		}
//	});
//}


//重置表单
function resetForm(obj) {
	$(obj).formClean();
}


//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		auditId=row.departureSettlementMainId;
	}else{
		auditId=id;
	}
	parent.addTabItem({
		tabid: 'HRPayDepartureList'+auditId,
		text: '离职结算单',
		url: web_app.name + '/resignationSettlementAction!showUpdate.job?bizId=' 
			+ auditId+'&isReadOnly=true'
	}
	);
}


function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/resignationSettlementAction!saveResignationSettlements.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
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



