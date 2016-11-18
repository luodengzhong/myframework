
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
		html.push('借调明细');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>借调明细');
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
	var type=$('#type').val();
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		viewHandler: function(){
			updateHandler();
		}
		
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			  	{ display: "借调开始时间", name: "beginDate", width: 100, minWidth: 60, type: "Date", align: "center" },	
				{ display: "借调结束时间", name: "endDate", width: 100, minWidth: 60, type: "Date", align: "center" },
		  		{ display: "借调员工", name: "staffName", width: 100, minWidth: 60, type: "string", align: "center" },		   
				{ display: "借出单位", name: "fromOrganName", width: 180, minWidth: 180, type: "string", align: "center" },	
				{ display: "借出中心", name: "fromCenterName", width: 120, minWidth: 120, type: "string", align: "lecenterft" },	
				{ display: "借出部门", name: "fromDeptName", width: 100, minWidth: 60, type: "string", align: "center" },
				{ display: "原工资主体单位", name: "fromWageOrgName", width: 100, minWidth: 60, type: "string", align: "center" },
				{ display: "原工资归属单位", name: "fromPayOrganName", width: 100, minWidth: 60, type: "string", align: "center" },
				{ display: "借入单位", name: "toOrganName", width: 100, minWidth: 60, type: "string", align: "center" },	
				{ display: "借入中心", name: "toCenterName", width: 100, minWidth: 60, type: "string", align: "center" },	
				{ display: "借入部门", name: "toDeptName", width: 100, minWidth: 60, type: "string", align: "center" },	
				{ display: "工资主体单位", name: "toWageOrgName", width: 100, minWidth: 60, type: "string", align: "center" },
				{ display: "工资归属单位", name: "toPayOrganName", width: 100, minWidth: 60, type: "string", align: "center" },
				{ display: "借调原因", name: "reason", width: 400, minWidth: 150, type: "string", align: "center"},
				{ display: "状态", name: "statusTextView", width: 80, minWidth: 60, type: "string", align: "center"},
				{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "center" },		   
				{ display: "单据号码", name: "billCode", width: 140, minWidth: 140, type: "string", align: "center" },
				{ display: "制表人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "center" }
		],
		dataAction : 'server',
		url: web_app.name+'/secondmentAction!slicedQuerySecondment.ajax',
		pageSize : 20,
		parms:{type:type},
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		manageType:'hrReshuffleManage',
		rowHeight : 25,
		sortName:'beginDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		enabledEdit: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.auditId);
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
		auditId=row.auditId;
	}else{
		auditId=id;
	}
	parent.addTabItem({
		tabid: 'HRSecondmentList'+auditId,
		text: '员工借调查询',
		url: web_app.name + '/secondmentAction!showUpdate.job?bizId=' 
			+ auditId+'&isReadOnly=true'
	});
}

function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/secondmentAction!updateSecondment.ajax',
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


