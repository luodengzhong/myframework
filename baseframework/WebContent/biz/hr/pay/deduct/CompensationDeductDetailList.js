var gridManager = null, refreshFlag = false,compensateKind=null;
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
		manageType:'hRDeductManage',
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
		manageType:'hRDeductManage',
		back:{
			text:'#orgUnitName',
			value:'#orgUnitId',
			id:'#orgUnitId',
			name:'#orgUnitName'
		}
	});
	//修改业务期间 按钮初始化
	PayPublic.updateOperationPeriodByMultilRow(gridManager,'hRDeductAction!updateOperationPeriod.ajax');
	//页面期间查询条件初始化
	PayPublic.initPeriodSearchbox();
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('补发补扣明细');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>补发补扣明细');
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
		updateOperationPeriod:{id:'updateOperationPeriod',text:'修改业务期间',img:'page_component.gif'},
		saveDisable:{id:'saveDisable',text:'作废',img:'page_cross.gif',click:function(){
			DataUtil.updateById({ action: 'hRDeductAction!saveDisableDetail.ajax',
				gridManager: gridManager,idFieldName:'detailId',
				message:'您确定要作废选中数据吗?',
				onSuccess:function(){
					reloadGrid();	
				}
			});		
		}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "序号", name: "myRownum", width: 60, minWidth: 60, type: "string", align: "center" ,exportAble:false,totalSummary:{
				render: function (suminf, column, data){
					return '合 计';
				},
				align: 'center'
			}},
			{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
			{ display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "部门", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },	
			{ display: "岗位", name: "positionName", width: 100, minWidth: 60, type: "string", align: "left" },	
			{ display: "制表人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "机构名称", name: "organNameDetail", width: 100, minWidth: 60, type: "string", align: "left" },	
			{ display: "所属一级中心", name: "centreNameDetail", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "部门名称", name: "deptNameDetail", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "岗位", name: "posNameDetail", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "姓名", name: "archivesName", width: 100, minWidth: 60, type: "string", align: "left"},		   
			{ display: "类别", name: "compensateKindTextView", width: 100, minWidth: 60, type: "string", align: "left"},		   
			{ display: "补发金额", name: "compensateMoney", width: 100, minWidth: 60, type: "money", align: "left",totalSummary:UICtrl.getTotalSummary()},	
			{ display: "补扣金额", name: "deductMoney", width: 100, minWidth: 60, type: "money", align: "left",totalSummary:UICtrl.getTotalSummary()},	  
			{ display: "异地津贴", name: "distanceAllowance", width: 100, minWidth: 60, type: "money", align: "left",totalSummary:UICtrl.getTotalSummary()},	  
			{ display: "提前发放应计税收入", name: "otherMoney", width: 100, minWidth: 60, type: "money", align: "left",totalSummary:UICtrl.getTotalSummary()},	  
			{ display: "执行时间", name: "executionTime", width: 100, minWidth: 60, type: "date", align: "left"},
			{ display: "执行期间", name: "periodName", width: 180, minWidth: 60, type: "string", align: "left"},
			{ display: "执行状态", name: "isEffectTextView", width: 60, minWidth: 60, type: "string", align: "left",exportAble:false,
				render: function (item) { 
					return PayPublic.getIsEffectfo(item.isEffect);
				} 
			},
			{ display: "原因", name: "content", width: 300, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/hRDeductAction!slicedQueryCompensationDeductDetailList.ajax',
		manageType:'hRDeductManage',
		parms:{totalFields:'compensateMoney,deductMoney,distanceAllowance,otherMoney'},
		pageSize : 20,
		sortName:'fillinDate',
		sortOrder:'desc',
		width : '100%',
		height : '100%',
		heightDiff : -15,
		headerRowHeight : 25,
		rowHeight : 25,
		checkbox:true,
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