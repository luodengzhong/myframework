var gridManager = null, refreshFlag = false,yesOrNo={1:'是',0:'否'};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	$('#year').val(new Date().getFullYear());
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrSocialImp',
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
		manageType:'hrSocialImp',
		back:{
			text:'#orgUnitName',
			value:'#orgUnitId',
			id:'#orgUnitId',
			name:'#orgUnitName'
		}
	});
	PayPublic.updateOperationPeriodByRow(gridManager,'staffWelfareAction!updateSocialSecurityOperationPeriod.ajax');
	PayPublic.initPeriodSearchbox();
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('社保明细');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>社保明细');
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
		deleteHandler: deleteHandler,
		updateOperationPeriod:{id:'updateOperationPeriod',text:'修改业务期间',img:'page_component.gif'},
		noProvidentFundPerson:{id:'noProvidentFundPerson',text:'查询导入遗漏人员',img:'page_find.gif',click:function(){
			var row = gridManager.getSelectedRow();
			var organId=ContextUtil.getOperator('orgId');
			if(row){
				organId=row['organId'];
			}
			UICtrl.showFrameDialog({
				url :web_app.name + "/biz/hr/pay/staffwelfare/noStaffwelfarePerson.jsp",
				param : {
					impOrganId : organId,
					//impSerialId : serialId,
					queryType:'socialSecurity'
				},
				title : "导入遗漏人员",
				width : 880,
				height : 400,
				cancelVal: '关闭',
				ok :false,
				cancel:true
			});
		}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		   { display: "姓名", name: "personName", width: 100, minWidth: 60, type: "string", align: "left",frozen: true},		 
		   { display: "执行期间", name: "periodName", width: 180, minWidth: 60, type: "string", align: "left",frozen: true },	
		   { display: "单位", name: "orgName", width: 130, minWidth: 60, type: "string", align: "left" },		   
		   { display: "中心", name: "centerName", width: 130, minWidth: 60, type: "string", align: "left" },		   
		   { display: "部门", name: "deptName", width: 130, minWidth: 60, type: "string", align: "left" },		   
		   { display: "单位合计", name: "companyTotal", width: 100, minWidth: 60, type: "money", align: "right",totalSummary:UICtrl.getTotalSummary() },		   
		   { display: "个人合计", name: "personageTotal", width: 100, minWidth: 60, type: "money", align: "right",totalSummary:UICtrl.getTotalSummary() },		   
		   { display: "总合计", name: "allTotal", width: 100, minWidth: 60, type: "money", align: "right",totalSummary:UICtrl.getTotalSummary() },		   
		   { display: "养老缴费基数", name: "oldAgeBenefitBase", width: 100, minWidth: 60, type: "money", align: "right" },		   
		   { display: "养老单位缴费金额", name: "companyOldAgeBenefit", width: 100, minWidth: 60, type: "money", align: "right" },		   
		   { display: "养老个人缴费金额", name: "personageOldAgeBenefit", width: 100, minWidth: 60, type: "money", align: "right" },		   
		   { display: "其他缴费基数", name: "otherBase", width: 100, minWidth: 60, type: "money", align: "right" },		   
		   { display: "医疗单位缴费金额", name: "companyMedicare", width: 100, minWidth: 60, type: "money", align: "right" },		   
		   { display: "医疗个人缴费金额", name: "personageMedicare", width: 100, minWidth: 60, type: "money", align: "right" },		   
		   { display: "生育单位缴费金额", name: "companyBirthInsurance", width: 100, minWidth: 60, type: "money", align: "right" },		   
		   { display: "失业单位缴费金额", name: "companyUnemploymentFund", width: 100, minWidth: 60, type: "money", align: "right" },		   
		   { display: "失业个人缴费金额", name: "personageUnemploymentFund", width: 100, minWidth: 60, type: "money", align: "right" },		   
		   { display: "工伤单位缴费金额", name: "industrialInjury", width: 100, minWidth: 60, type: "money", align: "right" },		   
		   { display: "大病单位缴费金额", name: "companyIllnessInsurance", width: 100, minWidth: 60, type: "money", align: "right" },		   
		   { display: "大病个人缴费金额", name: "personageIllnessInsurance", width: 100, minWidth: 60, type: "money", align: "right" },	
		   { display: "是否执行", name: "isEffect", width: 60, minWidth: 60, type: "string", align: "left",
			   render: function (item) { 
				   return PayPublic.getIsEffectfo(item.isEffect);
			   } 
		   },	
		   { display: "执行时间", name: "executionTime", width: 100, minWidth: 60, type: "date", align: "left" },
		   { display: "导入时间", name: "createDate", width: 80, minWidth: 60, type: "date", align: "left" },	
		   { display: "导入人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/staffWelfareAction!slicedQuerySocialSecurity.ajax',
		parms:{totalFields:'companyTotal,personageTotal,allTotal'},
		manageType:'hrSocialImp',
		sortName:'createDate',
		sortOrder:'desc',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -15,
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
	$('#year').val(new Date().getFullYear());
	onFolderTreeNodeClick();
}

function deleteHandler(){
	DataUtil.del({action:'staffWelfareAction!deleteSocialSecurity.ajax',
		gridManager:gridManager,idFieldName:'detailId',
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}