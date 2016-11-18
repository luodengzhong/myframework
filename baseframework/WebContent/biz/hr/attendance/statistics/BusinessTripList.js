var attendanceStatus=null;
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
	attendanceStatus=$('#attendanceStatus').combox('getJSONData');
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('出差单');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>出差单');
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
			  		{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "center" },		   
					{ display: "单据号码", name: "billCode", width: 140, minWidth: 140, type: "string", align: "center" },
					{ display: "制表人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "center" },
					{ display: "出差人", name: "staffName", width: 100, minWidth: 60, type: "string", align: "center" },
					{ display: "出差人单位", name: "organName", width: 180, minWidth: 180, type: "string", align: "center" },	
				    { display: "出差人中心", name: "centerName", width: 120, minWidth: 120, type: "string", align: "lecenterft" },	
				    { display: "出差地点", name: "address", width: 150, minWidth: 60, type: "string", align: "center" },
				    { display: "开始时间", name: "startDate", width: 130, minWidth: 60, type: "datetime", align: "center" },
				    { display: "结束时间", name: "endDate", width: 130, minWidth: 60, type: "datetime", align: "center" },
				    { display: "状态", name: "statusTextView", width: 80, minWidth: 60, type: "string", align: "center",
				    	render: function (item) { 
							return attendanceStatus[item.status];
						}
				    }
		],
		dataAction : 'server',
		url: web_app.name+'/attStatisticsAction!slicedQueryBusinessTripList.ajax',
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
			updateHandler(data.businessTripId);
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
		auditId=row.businessTripId;
	}else{
		auditId=id;
	}

	parent.addTabItem({
		tabid: 'HRBusinessTripList'+auditId,
		text: '出差单据查询',
		url: web_app.name + '/attBusinessTripAction!showUpdate.job?bizId=' 
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


