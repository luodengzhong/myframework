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
		manageType:'hrAccumulationFundImp',
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
		manageType:'hrAccumulationFundImp',
		back:{
			text:'#orgUnitName',
			value:'#orgUnitId',
			id:'#orgUnitId',
			name:'#orgUnitName'
		}
	});
	PayPublic.updateOperationPeriodByRow(gridManager,'staffWelfareAction!updateOperationPeriod.ajax');
	PayPublic.initPeriodSearchbox();
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('公积金明细');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>公积金明细');
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
		deleteHandler:deleteHandler,
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
					queryType:'providentFund'
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
		   { display: "姓名", name: "archivesName", width: 100, minWidth: 60, type: "string", align: "left",frozen: true},		 
		   { display: "执行期间", name: "periodName", width: 180, minWidth: 60, type: "string", align: "left",frozen: true },	
		   { display: "单位", name: "orgName", width: 130, minWidth: 60, type: "string", align: "left" },		   
		   { display: "中心", name: "centerName", width: 130, minWidth: 60, type: "string", align: "left" },		   
		   { display: "部门", name: "deptName", width: 130, minWidth: 60, type: "string", align: "left" },		   
		   { display: "基数", name: "cardinalNumber", width: 60, minWidth: 60, type: "money", align: "right" },		   
		   { display: "公司额", name: "companyLimit", width: 80, minWidth: 60, type: "money", align: "right",totalSummary:UICtrl.getTotalSummary()},		   
		   { display: "个人额", name: "personageLimit", width: 80, minWidth: 60, type: "money", align: "right",totalSummary:UICtrl.getTotalSummary()},
		   { display: "是否执行", name: "isEffect", width: 60, minWidth: 60, type: "string", align: "left",
			   render: function (item) { 
				   return PayPublic.getIsEffectfo(item.isEffect);
			   } 
		   },	
		   { display: "执行时间", name: "executionTime", width: 100, minWidth: 60, type: "date", align: "left" },
		   { display: "备注", name: "remark", width: 200, minWidth: 60, type: "string", align: "left" },
		   { display: "导入时间", name: "createDate", width: 80, minWidth: 60, type: "date", align: "left" },	
		   { display: "导入人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/staffWelfareAction!slicedQueryAccumulationFund.ajax',
		parms:{totalFields:'companyLimit,personageLimit'},
		manageType:'hrAccumulationFundImp',
		pageSize : 20,
		sortName:'createDate',
		sortOrder:'desc',
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
	DataUtil.del({action:'staffWelfareAction!deleteAccumulationFund.ajax',
		gridManager:gridManager,idFieldName:'detailId',
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}