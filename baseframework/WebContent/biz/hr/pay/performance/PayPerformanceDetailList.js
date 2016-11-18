var gridManager = null, refreshFlag = false, organId='';
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
	//需要验证访问密码
	PersonalPasswordAuth.showScreenOver();
	PersonalPasswordAuth.showDialog({
		okFun:function(){
			this.close();
			PersonalPasswordAuth.hideScreenOver();
		}
	});
});
function initializeUI(){
	initializeDefaultUI();
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hRPayManage',
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
	$('#orgUnitName').orgTree({filter:'ogn,dpt',param:{searchQueryCondition:"org_kind_id in('ogn','dpt')"},
		back:{
			text:'#orgUnitName',
			value:'#orgUnitId',
			id:'#orgUnitId',
			name:'#orgUnitName'
		}
	});
	
	$('#wageKindList').searchbox({type:'hr',name:'wageKindChooseByOrganId',
		getParam:function(){
			var orgId=organId;
			if(Public.isBlank(orgId)){
				orgId=$('#myOrganId').val();
			}
			return {organId: orgId};
		},
	back:{name:'#wageKindList',value:'#wageKind'}
	});
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('绩效奖金');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		organId = data.orgId;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>绩效奖金');
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
		exportExcelHandler:{id:'exportExcelHandler',text:'导出',img:'page_down.gif',click:function(){
			UICtrl.gridExport(gridManager);
		}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "制表人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "计算主体", name: "orgUnitName", width: 120, minWidth: 60, type: "string", align: "left" },
		{ display: "执行期间", name: "periodName", width: 140, minWidth: 60, type: "string", align: "left" },
		{ display: "年度", name: "year", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "考核期间", name: "periodCodeName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "公司", name: "organName", width: 100, minWidth: 60, type: "string", align: "left" },		
		{ display: "中心名称", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "部门名称", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "岗位名称", name: "posName", width: 80, minWidth: 60, type: "string", align: "left" },		   
		//{ display: "层级", name: "posTierTextView", width: 80, minWidth: 60, type: "string", align: "left" },		   
		{ display: "行政级别", name: "posLevelTextView", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "姓名", name: "archivesName", width: 80, minWidth: 60, type: "string", align: "left" },	
		{ display: "工资类别", name: "wageKindTextView", width: 120, minWidth: 60, type: "string", align: "left" },		   
		{ display: "计算标准", name: "basisOfCalculation", width: 100, minWidth: 60, type: "money", align: "right"},		   
		{ display: "考核得分", name: "effectiveScore", width: 60, minWidth: 60, type: "string", align: "left"},		   
		{ display: "考核等级", name: "effectiveRankName", width: 60, minWidth: 60, type: "string", align: "left"},		   
		{ display: "计算结果", name: "result", width: 100, minWidth: 60, type: "money", align: "right" },		   
		{ display: "绩效奖金", name: "performanceBonus", width: 100, minWidth: 60, type: "money", align: "right"},		   
		{ display: "说明", name: "remark", width: 200, minWidth: 60, type: "string", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/payPerformanceAction!slicedQueryPayPerformanceDetailList.ajax',
		manageType:'hRPayManage',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
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
}