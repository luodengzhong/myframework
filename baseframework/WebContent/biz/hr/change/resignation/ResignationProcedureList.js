
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
	var flowFlag=$('#flowFlag').val();
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		viewHandler: function(){
			updateHandler();
		}
		
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			  	{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 100, type: "string", align: "center" },		   
		  		{ display: "异动员工", name: "staffName", width: 100, minWidth: 60, type: "string", align: "center" },	
		  		{ display: "手续类型", name: "flowFlagTextView", width: 100, minWidth: 60, type: "string", align: "center" },		   
				{ display: "入职日期", name: "employedDate",  width: 100, minWidth: 100, type:"date",  align: "center" },
				{ display: "目前单位", name: "orgnizationName", width: 180, minWidth: 180, type: "string", align: "center" },	
				{ display: "目前中心", name: "centerName", width: 120, minWidth: 120, type: "string", align: "lecenterft" },	
				{ display: "目前部门", name: "departmentName", width: 100, minWidth: 60, type: "string", align: "center" },
				{ display: "目前岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "center" },
				{ display: "申请状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "center" },
				{ display: "单据号码", name: "billCode", width: 140, minWidth: 140, type: "string", align: "center" },
				{ display: "制表人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "center" }
//				{ display: "借(贷)款情况手续", name: "borrowLoan", width: 400, minWidth: 150, type: "string", align: "center"},
//				{ display: "本部门手续", name: "currentDept", width: 400, minWidth: 150, type: "string", align: "center"},
//				{ display: "行政后勤类手续", name: "administrativeLogistics", width: 400, minWidth: 150, type: "string", align: "center"},
//				{ display: "信息类手续", name: "it", width: 400, minWidth: 150, type: "string", align: "center" }, 
//				{ display: "培 训 (借用光碟、培训协议等)", name: "training", width: 400, minWidth: 150, type: "string", align: "center" },
//				{ display: "薪 酬 绩 效 ", name: "performancePay", width: 400, minWidth: 150, type: "string", align: "center" },
//				{ display: "应 计 工 资", name: "totalPay", width: 400, minWidth: 150, type: "string", align: "center" },
//				{ display: "合计应付金额", name: "sumPay", width: 400, minWidth: 150, type: "string", align: "center" }
		],
		dataAction : 'server',
		url: web_app.name+'/resignationProcedureAction!slicedQueryResignationProcedure.ajax',
		pageSize : 20,
		parms:{flowFlag:flowFlag},
		width : '100%',
		height : '100%',
		heightDiff : -10,
		manageType:'hrReshuffleManage',
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		enabledEdit: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.resignationProcedureId);
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
		auditId=row.resignationProcedureId;
	}else{
		auditId=id;
	}
	
	parent.addTabItem({
		tabid: 'HRResignationProcedureList'+auditId,
		text: '员工异动手续查询',
		url: web_app.name + '/resignationProcedureAction!showUpdate.job?bizId=' 
			+ auditId+'&isReadOnly=true'
	}
	);
}

function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/resignationProcedureAction!updateResignationProcedure.ajax',
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

function getId() {
	return $("#auditId").val() || 0;
}

function setId(value){
	$("#auditId").val(value);
	gridManager.options.parms['auditId'] =value;
}
function afterSave(){
	reloadGrid();
}
//保存按钮 
function save() {
	var Data =getExtendedData();
	if(detailData===false){
		return;
	}
	$('#submitForm').ajaxSubmit({
		url : web_app.name + '/resignationProcedureAction!saveResignationProcedures.ajax',
		param : $.extend({}, detailData),
		success : function(data) {
			if (!getId())
				setId(data);
			afterSave();
		}
	});
	
}
function getExtendedData(){
	var detailData = DataUtil.getGridData({gridManager: gridManager});
	if(!detailData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(detailData))};
}



