var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
	posLevelData=$('#mainPosLevel').combox('getJSONData');
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrPerFormAssessManage',
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
		html.push('绩效面谈');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>绩效面谈');
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
	var year=$('#year').val();
	var periodIndex=$('#periodIndex').val();
	
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		viewHandler: function(){
			updateHandler();
		},
		urgeHandler:{id:'urge',text:'催办',img:'page_user.gif',click:function(){
			urge();
		}}
		
	});
	
    var columns=[
		 			{ display: "序号", name: "myRownum", width: 60, minWidth: 60, type: "string", align: "center" },
		 			{ display: "填表日期", name: "fillinDate", width: 80, minWidth: 60, type: "date", align: "left" },
		 			{ display: "单据号码", name: "billCode", width: 120, minWidth: 120, type: "string", align: "left" },
		 			{ display: "申请状态", name: "statusTextView", width: 80, minWidth: 60, type: "string", align: "left" },
		 			{ display: "考核时间", name: "year", width: 80, minWidth: 60, type: "string", align: "left" },
		 			{ display: "周期", name: "periodCodeName", width: 80, minWidth: 60, type: "string", align: "left" },
		 		    { display: "等级", name: "effectiveRankTextView", width: 80, minWidth: 60, type: "string", align: "left" },
		 			{ display: "周期索引", name: "periodIndex", width: 60, minWidth: 60, type: "string", align: "left" }
		 	    ];
	    var columnMaker={display: '被面谈人信息', columns:[]};
	   columnMaker.columns.push({ display: "员工姓名", name: "staffName", width: 80, minWidth:80, type: "string", align: "left" });
	    columnMaker.columns.push({ display: "单位", name: "orgnizationName", width: 100, minWidth:100, type: "string", align: "left" });
	    columnMaker.columns.push({ display: "中心", name: "centerName", width: 100, minWidth:100, type: "string", align: "left" });
	    columnMaker.columns.push({ display: "部门", name: "departmentName", width: 100, minWidth:100, type: "string", align: "left" });
	    columnMaker.columns.push({ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" });
	    columnMaker.columns.push({ display: "行政级别", name: "posLevel",width: 80, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return posLevelData[item.posLevel];
			}	
		});	    
	    var columnAfter={display: '整改计划', columns:[]};
	    columnAfter.columns.push({ display: "开始时间", name: "rectificationStartDate", width: 80, minWidth: 80, type: "date", align: "left"});
	    columnAfter.columns.push({ display: "结束时间", name: "rectificationEndDate", width: 80, minWidth: 80, type: "date", align: "left"});
	    columnAfter.columns.push({ display: "整改计划", name: "rectificationPlan", width: 160, minWidth: 160, type: "string", align: "left"});

	    var columnBefore={display: '面谈记录', columns:[]};
		columnBefore.columns.push({display: "面谈人", name: "interviewerName", width: 180, minWidth: 180, type: "string", align: "left" });
		columnBefore.columns.push({ display: "面谈时间", name: "interviewTime", width: 80, minWidth: 80, type: "date", align: "left" });
		columnBefore.columns.push({ display: "面谈地点", name: "interviewLocation", width: 120, minWidth: 120, type: "string", align: "left" });
		columnBefore.columns.push({ display: "面谈记录", name: "interviewRecord", width: 160, minWidth: 160, type: "string", align: "left" });

		columns.push(columnMaker);
		columns.push(columnAfter);
		columns.push(columnBefore);
	
	gridManager = UICtrl.grid('#maingrid', {
		columns: columns,
		dataAction : 'server',
		url: web_app.name+'/performanceInterviewAction!slicedQueryPerformanceInterview.ajax',
		manageType:'hrPerFormAssessManage',
		pageSize : 20,
		parms:{year:year,periodIndex:periodIndex},
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		enabledEdit: false,
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
		tabid: 'HRPerformanceInterviewList'+auditId,
		text: '员工绩效面谈查询',
		url: web_app.name + '/performanceInterviewAction!showUpdate.job?bizId=' 
			+ auditId+'&isReadOnly=true'
	}
	);
}

function urge(){
	//催办  督促员工和领导进行绩效面谈
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var  archivesId=row.archivesId;
	var  periodIndex=row.periodIndex;
	var periodCode=row.periodCode;
	var personId=row.personId;
	var year=row.year;
	var rank=row.effectiveRank;
	var organArchivesId=row.organArchivesId;
	var  staffName=row.staffName;
	var performanceRankGroupId=row.performanceRankGroupId;
	Public.ajax(web_app.name + '/performanceInterviewAction!urgeInterview.ajax', {
			archivesId : archivesId,
			performanceRankGroupId : performanceRankGroupId,
			organArchivesId:organArchivesId,
			periodIndex:periodIndex,
			periodCode:periodCode,
			rank:rank,
			personId:personId,
			year:year,
			staffName:staffName
		}, function() {
			reloadGrid();
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


