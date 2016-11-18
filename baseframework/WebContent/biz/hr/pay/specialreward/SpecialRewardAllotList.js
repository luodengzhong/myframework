var gridManager = null, refreshFlag = false,specialRewardStatus=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	specialRewardStatus=$('#specialRewardStatus').combox('getJSONData');
	$('#yesorno').combox('setValue',1);
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
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('专项奖罚分配');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>专项奖罚分配');
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
		addPersion:{id:'addPersion',text:'详情',img:'page_boy.gif' ,click:function(){
			showAllotPage();
		}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		   { display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		   { display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left" },
		   { display: "主单据号码", name: "mainBillCode", width: 100, minWidth: 60, type: "string", align: "left" },
		   { display: "发起人", name: "mainPersonMemberName", width: 100, minWidth: 60, type: "string", align: "left" },
		   { display: "奖罚事由", name: "title", width: 200, minWidth: 60, type: "string", align: "left" },
		   { display: "单位", name: "organName", width: 100, minWidth: 60, type: "string", align: "left" },
		   { display: "分配处理人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },
		   { display: "分期确认人", name: "confirmStagingName", width: 100, minWidth: 60, type: "string", align: "left" },
		   { display: "类别", name: "rewardApplyKindTextView", width: 80, minWidth: 60, type: "string", align: "left" },
		   { display: "单位", name: "organName", width:130, minWidth: 60, type: "string", align: "left" },
		   { display: "金额", name: "allAmount", width:120, minWidth: 60, type: "money", align: "right" },
		   { display: "是否主单据", name: "isMain", width:120, minWidth: 60, type: "money", align: "right",
		  	   render: function (item) { 
					return item.isMain==1?'是':'否';
				}
		   },
		   { display: "状态", name: "status", width: 100, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return specialRewardStatus[item.status];
				} 
			}
		],
		dataAction : 'server',
		url: web_app.name+'/hRSpecialRewardAction!slicedQuerySpecialRewardAllot.ajax',
		parms:{yesorno:1},
		pageSize : 20,
		width : '100%',
		height : '100%',
		manageType:'hrSpecialRewardManage',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			showAllotPage(data);
		}
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

function showAllotPage(row){
	if(!row){
		row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
	}
	var param='&bizId='+row.auditId+'&allotParentId='+row.allotParentId;
	parent.addTabItem({ 
		tabid: 'HRSpecialRewardAllot'+row.auditId,
		text: '专项奖罚分配',
		url: web_app.name + '/hRSpecialRewardAction!showAllotPage.job?isReadOnly=true' +param
	});
}
