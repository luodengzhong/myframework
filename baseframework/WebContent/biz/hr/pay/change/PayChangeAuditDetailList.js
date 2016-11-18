var gridManager = null, refreshFlag = false,rewardorpunish=null,wageKindDate;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
	var wageChangeKindList=$('#wageChangeKindList').combox('getJSONData');
	$('#wageChangeKind').combox({data:wageChangeKindList,checkbox:true});
	wageKindDate=$('#oldWageKind').combox('getJSONData');
	PersonalPasswordAuth.showScreenOver();
		PersonalPasswordAuth.showDialog({
			okFun:function(){
				this.close();
				PersonalPasswordAuth.hideScreenOver();
			}
	});
});
function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrPayChange',
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
	$('#archivesName').searchbox({type:'hr',name:'personArchiveSelect',manageType:'hrPayChange',back:{archivesId:'#archivesId',staffName:'#archivesName'}});
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('薪酬变动明细');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>薪酬变动明细');
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
		//moveHandler:testUpdateArchivesByTaskScheduling,
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "变动员工姓名", name: "archivesName", width: 100, minWidth: 60, type: "string", align: "left",frozen:true},
			{ display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "机构名称", name: "organNameDetail", width: 100, minWidth: 60, type: "string", align: "left" },	
			{ display: "所属一级中心", name: "centreNameDetail", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "部门名称", name: "deptNameDetail", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "岗位", name: "posNameDetail", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "薪酬变动类别", name: "wageChangeKindTextView", width: 100, minWidth: 60, type: "string", align: "left"},	
			{ display: "原薪酬类别", name: "oldWageKindTextView", width: 100, minWidth: 60, type: "string", align: "left"},
			{ display: "调整后薪酬类别", name: "newWageKindTextView", width: 100, minWidth: 60, type: "string", align: "left"},
			{ display: "原年薪酬标准", name: "oldWageStandard", width: 100, minWidth: 60, type: "money", align: "right"},
			{ display: "调整后年薪酬标准", name: "newWageStandard", width: 120, minWidth: 60, type: "money", align: "right"},
			{ display: "原月标准工资", name: "oldWagMonth", width: 100, minWidth: 60, type: "money", align: "right"},
			{ display: "调整后月标准工资", name: "newWagMonth", width: 120, minWidth: 60, type: "money", align: "right"},
			{ display: "原季度绩效奖金", name: "oldQuarterlyPerformance", width: 100, minWidth: 60, type: "money", align: "right"},
			{ display: "调整后季度绩效奖金", name: "newQuarterlyPerformance", width: 120, minWidth: 60, type: "money", align: "right"},
			{ display: "原年度绩效工资", name: "oldPerformanceRelatedPay", width: 100, minWidth: 60, type: "money", align: "right"},
			{ display: "调整后年度绩效工资", name: "newPerformanceRelatedPay", width: 120, minWidth: 60, type: "money", align: "right"},
			{ display: "原特殊绩效薪酬", name: "oldSpecialPerformance", width: 100, minWidth: 60, type: "money", align: "right"},
			{ display: "调整后特殊绩效薪酬", name: "newSpecialPerformance", width: 120, minWidth: 60, type: "money", align: "right"},
			{ display: "调薪事由", name: "cause", width: 250, minWidth: 60, type: "string", align: "left"},
			{ display: "生效日期", name: "executionTime", width: 100, minWidth: 60, type: "date", align: "left"},
			{ display: "是否生效", name: "isEffectTextView", width: 60, minWidth: 60, type: "string", align: "left"},
			{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
			{ display: "部门", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },	
			{ display: "岗位", name: "positionName", width: 100, minWidth: 60, type: "string", align: "left" },	
			{ display: "制表人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/hRPayChangeAction!slicedQueryPayChangeDetailList.ajax',
		manageType:'hrPayChange',
		pageSize : 20,
		sortName:'executionTime',
		sortOrder:'desc',
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true
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
	onFolderTreeNodeClick();
}

function testUpdateArchivesByTaskScheduling(){
	Public.ajax(web_app.name + "/hRPayChangeAction!testUpdateArchivesByTaskScheduling.ajax");
}