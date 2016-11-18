var attendanceStatus=null;
var gridManager = null, refreshFlag = false,overtimeListData=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
	overtimeListData=$('#overtimeKindId').combox('getJSONData');
	delete overtimeListData['Normal'];
	overtimeListData['']='';
	$('#overtimeKindId').combox('setData',overtimeListData);
	$('#overtimeKindId').combox('setValue','');
	attendanceStatus=$('#attendanceStatus').combox('getJSONData');
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrBaseAttManage',
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
		html.push('加班单');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>加班单');
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
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			  		{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "center" },		   
					{ display: "单据号码", name: "billCode", width: 140, minWidth: 140, type: "string", align: "center" },
					{ display: "加班人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "center" },
					{ display: "加班类别", name: "overtimeKindId", width: 100, minWidth: 60, type: "string", align: "center",
						render: function (item) { 
							return overtimeListData[item.overtimeKindId];
						}
					},
				    { display: "开始时间", name: "startDate", width: 130, minWidth: 60, type: "datetime", align: "center" },
				    { display: "结束时间", name: "endDate", width: 130, minWidth: 60, type: "datetime", align: "center" },
				    { display: "核销开始时间", name: "verificationStartDate", width: 130, minWidth: 60, type: "datetime", align: "center" },
				    { display: "核销结束时间", name: "verificationEndDate", width: 130, minWidth: 60, type: "datetime", align: "center" },
				    { display: "状态", name: "status", width: 80, minWidth: 60, type: "string", align: "center",
				   	   render: function (item) { 
							return attendanceStatus[item.status];
						}
				    }
		],
		dataAction : 'server',
		url: web_app.name+'/attStatisticsAction!slicedQueryOvertimeList.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		manageType:'hrBaseAttManage',
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		enabledEdit: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.overtimeId);
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
		auditId=row.overtimeId;
	}else{
		auditId=id;
	}

	parent.addTabItem({
		tabid: 'HROvertimeList'+auditId,
		text: '加班单据查询',
		url: web_app.name + '/attOvertimeAction!showUpdate.job?bizId=' 
			+ auditId+'&isReadOnly=true&useDefaultHandler=0'
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


