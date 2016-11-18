var gridManager = null, refreshFlag = false,archivesState=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	archivesState=$('#tempArchivesState').combox('getJSONData');
	initializeUI();
	initializeGrid();
	//是员工本人浏览需要验证访问密码
	PersonalPasswordAuth.showScreenOver();
	PersonalPasswordAuth.showDialog({
		okFun:function(){
			this.close();
			PersonalPasswordAuth.hideScreenOver();
		}
	});
});
function initializeUI(){
	$('#year').spinner({countWidth:80}).mask('nnnn').val(new Date().getFullYear());
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrPayChange,HRArchivesWage',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds : "ogn,dpt,pos"};
			}
			return {showDisabledOrg:0};
		},
		changeNodeIcon:function(data){
			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
		},
		IsShowMenu:false,
		onClick : onFolderTreeNodeClick
	});
	$('#state').combox({data:archivesState,checkbox:true}).combox('setValue','0,1');
	
	$('#wageOrgName').orgTree({filter:'ogn,dpt',param:{searchQueryCondition:"org_kind_id in('ogn','dpt')"},
		manageType:'hrPayChange,HRArchivesWage',
		back:{
			text:'#wageOrgName',
			value:'#wageOrgId',
			id:'#wageOrgId',
			name:'#wageOrgName'
		}
	});
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',name='';
	if(!data){
		html.push('员工信息');
	}else{
		fullId=data.fullId,name=data.name;
		html.push('<font style="color:Tomato;font-size:13px;">[',name,']</font>员工信息');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
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
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "姓名", name: "archivesName", width:60, minWidth: 60, type: "string", align: "left",frozen: true },
		{ display: "工资年", name: "year", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "工资类别标志", name: "wageKindTextView", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "发放单位名称", name: "registrationOrgName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "在职月", name: "inMonths", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "计奖月", name: "issueMonths", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "年薪酬总额", name: "standardPay", width: 100, minWidth: 60, type: "money", align: "left" },		   
		{ display: "月标准工资", name: "monthPay", width: 100, minWidth: 60, type: "money", align: "left" },		   
		{ display: "年度绩效工资标准", name: "performanceBonus", width: 100, minWidth: 60, type: "money", align: "left" },		   
		{ display: "分段计算后年度绩效工资标准", name: "computePerformanceBonus", width: 100, minWidth: 60, type: "money", align: "left" },		   
		{ display: "单位组织绩效考核系数", name: "orgPerformanceCoefficient", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "专业公司组织绩效考核系数", name: "specialtyOrgCoefficient", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "部门组织绩效考核系数", name: "deptPerformanceCoefficient", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "个人年度绩效工资系数", name: "personPerformanceCoefficient", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "调节系数", name: "adjustCoefficient", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "考核及调节后应发年度绩效工资金额", name: "adjustPerformanceBonus", width: 100, minWidth: 60, type: "money", align: "left" },		   
		{ display: "年终评优个人奖项", name: "personExcellenceAward", width: 100, minWidth: 60, type: "money", align: "left" },		   
		{ display: "春节节日费", name: "festivalFee", width: 100, minWidth: 60, type: "money", align: "left" },		   
		{ display: "奖励及其他", name: "otherAward", width: 100, minWidth: 60, type: "money", align: "left" },		   
		{ display: "其它单位绩效工资金额", name: "otherOrgPerformanceBonus", width: 100, minWidth: 60, type: "money", align: "left" },		   
		{ display: "其他扣款", name: "otherPenalty", width: 100, minWidth: 60, type: "money", align: "left" },		   
		{ display: "本次应发合计", name: "totalPay", width: 100, minWidth: 60, type: "money", align: "left" },		   
		{ display: "个人所得税", name: "incomeTax", width: 100, minWidth: 60, type: "money", align: "left" },		   
		{ display: "税后实发金额", name: "netPay", width: 100, minWidth: 60, type: "money", align: "left" },	
		{ display: "银行备注", name: "blankRemark", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "备注", name: "remark", width: 100, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/hrArchivesAction!slicedQueryDecemberBonus.ajax',
		parms:{state:'0,1'},
		manageType:'hrPayChange,HRArchivesWage',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		checkbox:false,
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
	$('#year').val(new Date().getFullYear());
	$('#state').combox('setValue','0,1');
}

