var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
	//浏览需要验证访问密码
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
		manageType:'hrBaseRecruitData,hRPayManage',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,orgKindId : "ogn,dpt"};
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
		html.push('录用申请单列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>录用申请单列表');
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
		}
	});
	var columns=[{ display: "录用员工", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left",frozen: true},
		{ display: "申请日期", name: "fillinDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
		{ display: "申请人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "申请状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "审批时间", name: "approveDate", width: 100, minWidth: 60, type: "date", align: "left" },
		{ display: "拟定单位", name: "employCompany", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "拟定中心", name: "employCenter", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "拟定部门", name: "employDept", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "录用职位", name: "employPosName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "工资类别", name: "wageKindTextView", width:80, minWidth: 60, type: "string", align: "left" }];
	columns.push({display:'转正薪酬',columns:[
		{ display: "年度标准(元)", name: "salaryYear", width: 120, minWidth: 60, type: "money", align: "right" },		   
		{ display: "月度标准(元)", name: "salaryMonth", width: 100, minWidth: 60, type: "money", align: "right" },
		{ display: "年度绩效工资(元)", name: "performanceRelatedPay", width: 100, minWidth: 60, type: "money", align: "right" },
		{ display: "全年季度绩效(元)", name: "quarterlyPerformance", width: 100, minWidth: 60, type: "money", align: "right" },
		{ display: "月职务消费(元)", name: "consumptionMonth", width: 100, minWidth: 60, type: "money", align: "right" },
		{ display: "(招采)特殊绩效(元)", name: "specialQuarterlyPerformance", width: 100, minWidth: 60, type: "money", align: "right" }
	]});
	columns.push({display:'试用期薪酬',columns:[
		{ display: "年度标准(元)", name: "proSalaryYear", width: 120, minWidth: 60, type: "money", align: "right" },		   
		{ display: "月度标准(元)", name: "proSalaryMonth", width: 100, minWidth: 60, type: "money", align: "right" },
		{ display: "年度绩效工资(元)", name: "proPerformanceRelatedPay", width: 100, minWidth: 60, type: "money", align: "right" },
		{ display: "全年季度绩效(元)", name: "proQuarterlyPerformance", width: 100, minWidth: 60, type: "money", align: "right" },
		{ display: "月职务消费(元)", name: "proConsumptionMonth", width: 100, minWidth: 60, type: "money", align: "right" }
	]});
	columns.push({ display: "到公司时间", name: "employedDate", width: 100, minWidth: 60, type: "date", align: "left" });
	gridManager = UICtrl.grid('#maingrid', {
		columns: columns,
		dataAction : 'server',
		url: web_app.name+'/employApplyAction!slicedQueryemployPay.ajax',
		parms:{status:'1,3'},
		manageType:'hrPayChange',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		sortName:'fillinDate',
		sortOrder:'desc',
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