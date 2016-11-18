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
		html.push('离职结算单明细');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>离职结算单明细');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#mainFullId').val(fullId);
	if (gridManager&&fullId!='') {
		UICtrl.gridSearch(gridManager,{archiveFullId:fullId});
	}else{
		gridManager.options.parms['archiveFullId']='';
	}
}

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		viewHandler: function(){
			viewHandler();
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			    { display: "离职员工", name: "archivesName", width: 100, minWidth: 60, type: "string", align: "center",frozen: true },		
			    { display: "工资费用归属", name: "wageAffiliationTextView", width: 100, minWidth: 60, type: "string", align: "center" },	
				{ display: "单位", name: "organName", width: 100, minWidth: 60, type: "string", align: "center" },	
				{ display: "部门", name: "centreName", width: 100, minWidth: 60, type: "string", align: "center" },
			  	{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "center" },		   
				{ display: "单据号码", name: "billCode", width: 140, minWidth: 140, type: "string", align: "center" },
				{ display: "制表人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "center" },
				{ display: "结算类型", name: "accountsTypeTextView", width: 100, minWidth: 60, type: "string", align: "center" },
				{ display: "月工资标准", name: "standardPay", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "基本工资", name: "basePay", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "绩效工资", name: "performancePay", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "工龄工资", name: "seniorityPay", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "加班补贴", name: "overtime", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "独子补贴", name: "oneChildPay", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "误餐补贴", name: "mealAllowance", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "异地津贴", name: "distanceAllowance", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "岗位津贴", name: "pay10", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "销售提成", name: "salesCommissions", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "结婚礼金", name: "pay03", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "生日礼金", name: "pay04", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "奖励合计", name: "award", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "补发工资", name: "backPay", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "离职补偿", name: "pay05", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "税后补发", name: "pay01", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "考勤截止日期", name: "attendanceDate", width: 100, minWidth: 60, type: "date", align: "left" },
				{ display: "计薪天数", name: "allDays", width: 100, minWidth: 60, type: "number", align: "right" },
				{ display: "未出勤天数", name: "vacancyDays", width: 100, minWidth: 60, type: "number", align: "right" },
				{ display: "病假天数", name: "sickDays", width: 100, minWidth: 60, type: "number", align: "right" },
				{ display: "事假天数", name: "affairsDays", width: 100, minWidth: 60, type: "number", align: "right" },
				{ display: "病假扣款", name: "pay06", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "事假扣款", name: "pay07", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "迟到早退扣款", name: "pay08", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "缺勤扣款", name: "pay09", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "养老保险扣款", name: "oldAgeBenefit", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "医疗保险扣款", name: "medicare", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "失业保险扣款", name: "unemploymentInsurance", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "扣住房公积金", name: "housingFund", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "罚款合计", name: "penalty", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "其他扣款", name: "deductPay", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "税后补扣", name: "pay02", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "关联单据计税工资", name: "relevanceTaxablePay", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "关联单据所得税", name: "relevanceIncomeTax", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "计税工资", name: "taxablePay", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "个人所得税", name: "incomeTax", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "应发工资", name: "totalPay", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "扣款合计", name: "deductAll", width: 100, minWidth: 60, type: "money", align: "right" },
				{ display: "实发工资", name: "netPay", width: 100, minWidth: 60, type: "money", align: "right" }
		],
		dataAction : 'server',
		url: web_app.name+'/resignationSettlementAction!slicedQueryPayDepartureSettlementDetail.ajax',
		pageSize : 20,
		manageType:'hrReshuffleManage',
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
		rowHeight : 25,
		toolbar: toolbarOptions,
		enabledEdit: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.departureSettlementMainId);
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

//刷新表格
function reloadGrid() {
	gridManager.loadData();
}

function viewHandler(departureSettlementMainId){
	if(!departureSettlementMainId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		departureSettlementMainId=row.departureSettlementMainId;
	}
	parent.addTabItem({
		tabid: 'HRPayDepartureList'+departureSettlementMainId,
		text: '离职结算单',
		url: web_app.name + '/resignationSettlementAction!showUpdate.job?bizId=' 
			+ departureSettlementMainId+'&isReadOnly=true'
	});
}

