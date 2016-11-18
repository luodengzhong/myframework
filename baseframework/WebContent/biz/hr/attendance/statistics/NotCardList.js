var gridManager = null, refreshFlag = false,checkTimes={"onDuty":'上班', "offDuty":'下班'},notCardKindList=null,levelsAll={};;
$(document).ready(function() {
	notCardKindList=$('#notCardKindId').combox('getJSONData');
	delete notCardKindList['Other'];
	UICtrl.autoSetWrapperDivHeight();
	//排班班次
	getWorkShift();
	//行政班
	levelsAll["onDuty"]="上午上班";
	levelsAll["offDuty"]="下午下班";
	initializeGrid();
	initializeUI();
});

function getWorkShift(){
	//获取机构排班班次
	 $.ajax({
    	async: false,
			type: "post",
			url: web_app.name+'/attNotCardCertificateAction!queryPersonDuty.ajax',
			success: function (data) {
				var resultData = data.data;
				$.each(resultData, function (index, data) {
					levelsAll[data.id] = data.name;
               });
			},
			dataType: 'json'
    });
}

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
		html.push('未打卡说明');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>未打卡说明');
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
					{ display: "单位", name: "organName", width: 180, minWidth: 180, type: "string", align: "center" },	
				    { display: "中心", name: "centerName", width: 120, minWidth: 120, type: "string", align: "lecenterft" },	
				    { display: "未打卡日期", name: "fdate", width: 100, minWidth: 60, type: "date", align: "center" },
				    { display: "未打卡时间", name: "checkTime", width: 100, minWidth: 60, type: "string", align: "center",
						render: function (item) { 
							//return checkTimes[item.checkTime];
							return levelsAll[item.checkTime];
						}		
	
				    },
				    { display: "未打卡类别", name: "kindId", width: 100, minWidth: 60, type: "string", align: "center",
						render: function (item) { 
							return notCardKindList[item.kindId];
						}
				    },
				    { display: "状态", name: "statusTextView", width: 80, minWidth: 60, type: "string", align: "center"}
		],
		dataAction : 'server',
		url: web_app.name+'/attStatisticsAction!slicedQueryNotCardList.ajax',
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
			updateHandler(data.notCardCertificateId);
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
		auditId=row.notCardCertificateId;
	}else{
		auditId=id;
	}

	parent.addTabItem({
		tabid: 'HRNotCardList'+auditId,
		text: '未打卡说明单据查询',
		url: web_app.name + '/attNotCardCertificateAction!showUpdate.job?bizId=' 
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


