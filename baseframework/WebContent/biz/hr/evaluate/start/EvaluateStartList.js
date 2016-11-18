var gridManager = null, refreshFlag = false,manageType="hrEvaluateManage";
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
		manageType:manageType,
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
		html.push('评价列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>评价列表');
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
		addHandler: addHandler, 
		viewHandler:function(){
			viewHandler();
		},
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler,
		saveTurnHandler:{id:'turn',text:'发起评价',img:'page_next.gif',click:function(){
			saveDoStartEvaluate();
		}},
		saveCancelHandler:{id:'saveCancel',text:'作废',img:'page_cross.gif',click:function(){
			saveCancelEvaluateStart();
		}},
		saveAbortedHandler:{id:'saveAborted',text:'结束评价',img:'page_url.gif',click:function(){
			saveCompletedEvaluateStart();
		}},
		saveStatHandler:{id:'saveStat',text:'评价结果查询',img:'page_php.gif',click:function(){
			saveStatHandler();
		}},
		saveChartsHandler:{id:'saveStat',text:'图表展示',img:'page_colors.gif',click:function(){
			saveChartsHandler();
		}},
		saveReportHandler:{id:'saveReportHandler',text:'评价报告',img:'page_link.gif',click:function(){
			saveReportHandler();
		}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "部门", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "发起人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "主题", name: "subject", width: 350, minWidth: 60, type: "string", align: "left" },
		{ display: "状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/evaluateStartAction!slicedQueryEvaluateStart.ajax',
		manageType:manageType,
		pageSize : 20,
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
			if(parseInt(data.status,10)!=3){
				updateHandler(data.evaluateStartId);
			}else{
				viewHandler(data.evaluateStartId);
			}
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
//发起
function saveDoStartEvaluate(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	if(parseInt(row.status,10)!=0){
		Public.tip('数据已提交不能重复发起!');
		return;
	}
	UICtrl.confirm('确定发起评价吗?',function(){
		Public.ajax(web_app.name + '/evaluateStartAction!saveDoStartEvaluate.ajax', {evaluateStartId:row['evaluateStartId']}, function(){
			reloadGrid();
		});
	});
}
//作废
function saveCancelEvaluateStart(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	if(parseInt(row.status,10)==3){
		Public.tip('已完成单据不能作废!');
		return;
	}
	UICtrl.confirm('确定作废评价吗?',function(){
		Public.ajax(web_app.name + '/evaluateStartAction!saveCancelEvaluateStart.ajax', {evaluateStartId:row['evaluateStartId']}, function(){
			reloadGrid();
		});
	});
}

function saveCompletedEvaluateStart(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	if(parseInt(row.status,10)!=1){
		Public.tip('只能结束已发起的评价!');
		return;
	}
	UICtrl.confirm('确定结束评价吗?',function(){
		Public.ajax(web_app.name + '/evaluateStartAction!saveCompletedEvaluateStart.ajax', {evaluateStartId:row['evaluateStartId']}, function(){
			reloadGrid();
		});
	});
}
function addHandler(){
	var url=web_app.name + '/evaluateStartAction!showInsertEvaluateStart.job';
	parent.addTabItem({ tabid: 'HRExamDoStart', text: '发起双向评价', url:url});
}
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	if(parseInt(row.status,10)!=0){
		Public.tip('数据已提交不能删除!');
		return;
	}
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/evaluateStartAction!deleteEvaluateStart.ajax', {evaluateStartId:row['evaluateStartId']}, function(){
			reloadGrid();
		});
	});
}
function updateHandler(evaluateStartId){
	if(!evaluateStartId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		evaluateStartId=row.evaluateStartId;
	}
	var url=web_app.name + '/evaluateStartAction!showUpdateEvaluateStart.job?evaluateStartId='+evaluateStartId;
	parent.addTabItem({ tabid: 'HREvaluateStartModif'+evaluateStartId, text: '编辑评价发起', url:url});
}
function viewHandler(evaluateStartId){
	if(!evaluateStartId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		evaluateStartId=row.evaluateStartId;
	}
	var url=web_app.name + '/evaluateStartAction!showUpdateEvaluateStart.job?evaluateStartId='+evaluateStartId+'&isReadOnly=true';
	parent.addTabItem({ tabid: 'HREvaluateStartView'+evaluateStartId, text: '查看评价发起', url:url});
}
function saveStatHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	if(parseInt(row.status,10)!=3){
		Public.tip('只能统计已结束的评价!');
		return;
	}
	var evaluateStartId=row.evaluateStartId;
	var url=web_app.name + '/evaluateStatAction!forwardEvaluateStatScore.do?evaluateStartId='+evaluateStartId;
	parent.addTabItem({ tabid: 'HREvaluateStat'+evaluateStartId, text: '评价结果', url:url});
}

function saveChartsHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	if(parseInt(row.status,10)!=3){
		Public.tip('只能统计已结束的评价!');
		return;
	}
	var evaluateStartId=row.evaluateStartId;
	var url=web_app.name + '/evaluateStatAction!forwardEvaluateStartCharts.do?evaluateStartId='+evaluateStartId;
	parent.addTabItem({ tabid: 'HREvaluateCharts'+evaluateStartId, text: '评价结果', url:url});
}

function saveReportHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	if(parseInt(row.status,10)!=3){
		Public.tip('只能统计已结束的评价!');
		return;
	}
	var evaluateStartId=row.evaluateStartId;
	var url=web_app.name + '/evaluateStartAction!showModifEvaluateReport.do?evaluateStartId='+evaluateStartId;
	parent.addTabItem({ tabid: 'HREvaluateReportApply'+evaluateStartId, text: '评价结果', url:url});
}