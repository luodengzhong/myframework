var gridManager = null, refreshFlag = false,archivesState=null, organId = '';
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	archivesState=$('#tempArchivesState').combox('getJSONData');
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
	var html=[],fullId='',name='';
	if(!data){
		html.push('员工信息');
	}else{
		fullId=data.fullId,name=data.name;
		organId = data.orgId;
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
		},
		updateHandler: function(){
			updateHandler();
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "姓名", name: "staffName", width:60, minWidth: 60, type: "string", align: "left",frozen: true },
		{ display: "人员路径", name: "fullName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "所属单位", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "所属中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "部门", name: "dptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "行政级别", name: "posLevelTextView", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "职级", name: "staffingPostsRankTextView", width: 60, minWidth: 60, type: "string", align: "left" },
		{ display: "职级序列", name: "staffingPostsRankSequence", width: 60, minWidth: 60, type: "string", align: "left" },
		{ display: "工资费用归属", name: "wageAffiliationTextView", width: 80, minWidth: 60, type: "string", align: "left"},
		{ display: "薪资类别", name: "wageKindTextView", width: 80, minWidth: 60, type: "string", align: "left" },	
		{ display: "年收入工资标准", name: "wageStandard", width: 100, minWidth: 60, type: "money", align: "right" },
		//{ display: "特殊年薪", name: "specialWageStandard", width: 100, minWidth: 60, type: "money", align: "right" },
		//{ display: "合计年薪", name: "totalWageStandard", width: 100, minWidth: 60, type: "money", align: "right" },
		{ display: "现月标准工资总额", name: "wageMonth", width: 100, minWidth: 60, type: "money", align: "right" },		   
		{ display: "现月职务消费", name: "consumptionMonth", width: 100, minWidth: 60, type: "money", align: "right" },
		{ display: "现年度绩效工资标准", name: "performanceRelatedPay", width:100, minWidth: 60, type: "money", align: "right" },	
		{ display: "季度绩效奖金", name: "quarterlyPerformance", width: 80, minWidth: 60, type: "money", align: "right" },
		{ display: "特殊绩效薪酬(招采)", name: "specialQuarterlyPerformance", width: 80, minWidth: 60, type: "money", align: "right" },
		{ display: "异地津贴", name: "relAllowance", width: 80, minWidth: 60, type: "money", align: "right" },
		{ display: "社保缴存基数", name: "socialSecurityBase", width: 80, minWidth: 60, type: "money", align: "right" },
		{ display: "公积金缴存基数", name: "providentFundBase", width: 80, minWidth: 60, type: "money", align: "right" },
		{ display: "岗位津贴", name: "posRelAllowance", width: 80, minWidth: 60, type: "money", align: "right" },
		{ display: "入职时间", name: "employedDate", width: 80, minWidth: 60, type: "date", align: "left" },
		{ display: "集团工龄", name: "CWorkTime", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "性别", name: "sexTextView", width: 50, minWidth: 50, type: "string", align: "left" },
		{ display: "层级", name: "posTierTextView", width: 80, minWidth: 50, type: "string", align: "left" },
		{ display: "体系分类", name: "systemTypeTextView", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "编制状态", name: "staffingLevelTextView", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "独子状态", name: "isOneChild", width: 60, minWidth: 60, type: "string", align: "left" },
		{ display: "独生子女生日", name: "childBirthday", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "发放标志", name: "wageFlagTextView", width: 80, minWidth: 60, type: "string", align: "left" },		
		{ display: "工资主体单位", name: "wageOrgName", width: 80, minWidth: 60, type: "String", align: "right" },
		{ display: "工资归属单位", name: "companyName", width: 80, minWidth: 60, type: "String", align: "right" },
		{ display: "最近一次薪酬变动", name: "payLastChange", width: 180, minWidth: 60, type: "String", align: "right" },
		{ display: "状态", name: "state", width: 60, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return archivesState[item.state];
			} 
		}	
		],
		dataAction : 'server',
		url: web_app.name+'/hrArchivesAction!slicedQueryArchivesWage.ajax',
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
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			if($('#toolbar_menuUpdate').length>0){//存在编辑按钮
				updateHandler(data.archivesId);
			}else{
				viewHandler(data.archivesId);
			}
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	param['posLevelgt']='';
	param['posLevellt']='';
	param['posLeveleq']='';
	var posLevelSymbol=param['posLevelSymbol'];
	if(posLevelSymbol!=''){
		var posLevel=param['posLevel'];
		if(posLevel!=''){
			param['posLevel'+posLevelSymbol]=posLevel;
		}
	}
	UICtrl.gridSearch(gridManager, param);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
	$('#state').combox('setValue','0,1');
}

//编辑按钮
function updateHandler(archivesId){
	if(!archivesId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		archivesId=row.archivesId;
	}
	var url=web_app.name + '/hrArchivesAction!showUpdate.do?functionCode=HRArchivesMaintain&archivesId='+archivesId;
	parent.addTabItem({ tabid: 'HRArchivesAdd'+archivesId, text: '编辑人员 ', url:url});
}

function viewHandler(archivesId){
	if(!archivesId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		archivesId=row.archivesId;
	}
	var url=web_app.name + '/hrArchivesAction!showUpdate.do?functionCode=HRArchivesMaintain&archivesId='+archivesId+'&isReadOnly=true';
	parent.addTabItem({ tabid: 'HRArchivesView'+archivesId, text: '查看人员 ', url:url});
}