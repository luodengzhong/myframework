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
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('奖罚分配明细');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>奖罚分配明细');
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
		showRowStages:{id:'showRowStages',text:'分期信息',img:'page_favourites.gif',click:function(){
			showRowStages();
		}},
		updatePerson:{id:'updatePerson',text:'修改执行人员',img:'page_user.gif',click:function(){}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
			{ display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "奖罚原因", name: "title", width: 200, minWidth: 60, type: "string", align: "left" },
			{ display: "奖罚类别", name: "rewardApplyKindTextView", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "部门", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },	
			{ display: "岗位", name: "positionName", width: 100, minWidth: 60, type: "string", align: "left" },	
			{ display: "制表人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "机构名称", name: "organNameDetail", width: 100, minWidth: 60, type: "string", align: "left" },	
			{ display: "中心", name: "centreNameDetail", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "部门", name: "deptNameDetail", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "岗位", name: "posNameDetail", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "姓名", name: "archivesName", width: 100, minWidth: 60, type: "string", align: "left"},		   
			{ display: "金额", name: "amount", width: 80, minWidth: 60, type: "money", align: "right"},		  
			{ display: "已执行金额", name: "effectAmount", width: 80, minWidth: 60, type: "money", align: "right"},
			{ display: "最新执行期间", name: "periodName", width: 200, minWidth: 60, type: "string", align: "right"},
			{ display: "是否分期", name: "isByStages", width: 60, minWidth: 60, type: "string", align: "center",
				render: function (item) { 
					return yesOrNo[item.isByStages];
				}
			},
			{ display: "是否执行完成", name: "isOver", width: 60, minWidth: 60, type: "string", align: "center",
				render: function (item) { 
					return yesOrNo[item.isOver];
				}
			},

			{ display: "是否为团队基金", name: "isGroupAmount", width: 100, minWidth: 60, type: "string", align: "left",
					render: function (item) { 
						return yesOrNo[item.isGroupAmount];
					} 
				}	
		],
		dataAction : 'server',
		url: web_app.name+'/hRSpecialRewardAction!slicedQuerySpecialRewardDetailList.ajax',
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
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
	UICtrl.setSearchAreaToggle(gridManager);
	initUpdatePersonButton();
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

function showRowStages(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var speciaId=row.speciaId,orgId=row.orgId;
	UICtrl.showDialog({title:'分期明细',width:520,
		content:'<div id="stagesGrid'+speciaId+'"></div>',
		init:function(){
			initStagesGrid(speciaId,orgId);
		},
		ok:false
   });
}
function initStagesGrid(speciaId,orgId){
	  var toolbarOptions = UICtrl.getDefaultToolbarOptions({
			updateOperationPeriod:{id:'updateOperationPeriod'+speciaId,text:'修改业务期间',img:'page_component.gif'}
		});
	    stagesGridManager=UICtrl.grid('#stagesGrid'+speciaId, {
	    	 columns:[
	             { display: '分期金额', name: 'stagesAmount',type:'money',width: 120, minWidth: 60},
	             { display: '执行期间', name: 'periodName',width: 180,type:'string' },
	             { display: '执行时间', name: 'executionTime',type:'date' },
	             { display: "是否生效", name: "isEffect", width: 60, minWidth: 60, type: "string", align: "left",
	 				render: function (item) { 
	 					return PayPublic.getIsEffectfo(item.isEffect);
	 				} 
	 			 }
	         ],
	         dataAction : 'server',
	 		 url: web_app.name+'/hRSpecialRewardAction!slicedQuerySpecialRewardByStages.ajax',
	 		 parms:{speciaId:speciaId,pagesize:'1000'},
	         showToggleColBtn: false, 
	         height:500,
	         width:500, 
	         usePager:false,
	         showTitle: false,
	 		 fixedCellHeight : true,
	 		 selectRowButtonOnly : true,
	         toolbar: toolbarOptions,
	         onBeforeEdit:function(editParm){
	 			return editParm.record['isEffect']==0;
	 		 },
	         columnWidth: 100
	     });
	    PayPublic.updateOperationPeriod({
	    	button:'#toolbar_menuupdateOperationPeriod'+speciaId,
	    	onShow:function(){
				var row = stagesGridManager.getSelectedRow();
				if (!row) {Public.tip('请选择数据！'); return false; }
			},
			getParam:function(){
				var year = new Date().getFullYear();
				return {organId:orgId,paramValue:year};
			},
			onChoose:function(){
				var row=this.getSelectedRow();
				if (!row) {Public.tip('请选择数据！'); return; }
				var periodId=row['periodId'];
				var gridRow = stagesGridManager.getSelectedRow();	
				Public.ajax(web_app.name + "/hRSpecialRewardAction!updateOperationPeriod.ajax",
		    	    	{periodId:periodId,stagesId:gridRow['stagesId']},
		    	    	function(){
		    	    		stagesGridManager.loadData();
		    	    	}
		    	);
				return true;
			}	
	    });
}
//变更执行人员
function initUpdatePersonButton(){
	$('#toolbar_menuupdatePerson').comboDialog({type:'hr',name:'personArchiveSelect',width:635,
		onShow:function(){
			var row = gridManager.getSelectedRow();
			if (!row) {Public.tip('请选择数据！'); return false; }
			var effectAmount=parseInt(row.effectAmount,10);
			if(!isNaN(effectAmount)&&effectAmount>0){
				Public.tip('单据已被执行,不能变更执行人员！'); 
				return false;
			}
			return true;
		},
		onChoose:function(){
			var row = gridManager.getSelectedRow();
			var speciaId=row.speciaId,archivesId=row.archivesId;
	    	var data=this.getSelectedRow();
	    	if (!data) {Public.tip('请选择人员！'); return false; }
	    	if(data['archivesId']==archivesId){
	    		return true;
	    	}
	    	var param=$.extend({speciaId:speciaId}, data);
	    	var dptId=data["dptId"],dptName=data["dptName"];
	    	if(Public.isBlank(dptId)){
	    		dptId=data["centreId"],dptName=data["centreName"];
	    	}
	    	param["organId"] =dptId;
	    	param["organName"] = dptName;
	    	param["archivesName"] = data["staffName"];
	    	Public.ajax(web_app.name + "/hRSpecialRewardAction!updateOperationExecutor.ajax",param, function(){
	    		reloadGrid();
	    	});
	    	return true;
		}
	});
}