var gridManager = null, refreshFlag = false,yesOrNo={1:'是',0:'否'};
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
		manageType:'hrSpecialRewardManage',
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
	    manageType:'hrSpecialRewardManage',
		back:{
			text:'#orgUnitName',
			value:'#orgUnitId',
			id:'#orgUnitId',
			name:'#orgUnitName'
		}
	});
	//页面期间查询条件初始化
	$('#year').val(new Date().getFullYear());
	PayPublic.initPeriodSearchbox();
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('奖罚分配分期明细');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>奖罚分配分期明细');
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
		updateYearPeriodEffect:{id:'updateYearPeriodEffect',text:'年终期间数据生效',img:'page_user.gif',click:function(){updateYearPeriodEffect();}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
			{ display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "奖罚原因", name: "title", width: 200, minWidth: 60, type: "string", align: "left" },
			{ display: "奖罚类别", name: "rewardApplyKindTextView", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "制表人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "机构名称", name: "organNameDetail", width: 100, minWidth: 60, type: "string", align: "left" },	
			{ display: "中心", name: "centreNameDetail", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "部门", name: "deptNameDetail", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "岗位", name: "posNameDetail", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "姓名", name: "archivesName", width: 100, minWidth: 60, type: "string", align: "left"},		   
			{ display: "总金额", name: "amount", width: 80, minWidth: 60, type: "money", align: "right"},		  
			{ display: "分期金额", name: "stagesAmount", width: 80, minWidth: 60, type: "money", align: "right"},
			{ display: "执行期间", name: "periodName", width: 200, minWidth: 60, type: "string", align: "right"},
			{ display: "是否分期", name: "isByStages", width: 60, minWidth: 60, type: "string", align: "center",
				render: function (item) { 
					return yesOrNo[item.isByStages];
				}
			},
			{ display: "是否执行", name: "isEffect", width: 60, minWidth: 60, type: "string", align: "center",
				render: function (item) { 
					return yesOrNo[item.isEffect];
				}
			},
			{ display: "是否为团队基金", name: "isGroupAmount", width: 100, minWidth: 60, type: "string", align: "left",
					render: function (item) { 
						return yesOrNo[item.isGroupAmount];
					} 
			}	
		],
		dataAction : 'server',
		url: web_app.name+'/hRSpecialRewardAction!slicedQuerySpecialRewardStages.ajax',
		manageType:'hrSpecialRewardManage',
		pageSize : 20,
		sortName:'fillinDate',
		sortOrder:'desc',
		width : '100%',
		height : '100%',
		heightDiff : -15,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
	UICtrl.setSearchAreaToggle(gridManager);
	PayPublic.updateOperationPeriod({
	    	button:'#toolbar_menuupdateOperationPeriod',
	    	onShow:function(){
				var row = gridManager.getSelectedRow();
				if (!row) {Public.tip('请选择数据！'); return false; }
			},
			getParam:function(){
				var year = new Date().getFullYear();
				return {paramValue:year};
			},
			onChoose:function(){
				var row=this.getSelectedRow();
				if (!row) {Public.tip('请选择数据！'); return; }
				var periodId=row['periodId'];
				var ids=[];
				var gridRows = gridManager.getSelectedRows();	
				$.each(gridRows,function(i,o){
					ids.push(o['stagesId']);
				});
				Public.ajax(web_app.name + "/hRSpecialRewardAction!updateOperationPeriodByIds.ajax",
		    	    	{periodId:periodId,ids:ids.join(',')},
		    	    	function(){
		    	    		reloadGrid();
		    	    	}
		    	);
				return true;
			}	
	    });
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

function updateYearPeriodEffect(){
	DataUtil.updateById({ action: 'hRSpecialRewardAction!updateYearPeriodEffect.ajax',
		gridManager: gridManager,idFieldName:'stagesId',
		message:'您确定要自动生效选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}