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
	$('#askKindName').treebox({
		width:200,
		name:'askReportKindQuery',
		treeLeafOnly:true,
		showToolbar:false,
		changeNodeIcon:function(node){
			var url=web_app.name + "/themes/default/images/org/";
			var nodeType=node.nodeType;
			url +=nodeType=='f'?'roleType.gif':'dataRole.gif';
			node['nodeIcon']=url;
		},
		beforeChange:function(node){
			var nodeType=node.nodeType;
			if(nodeType=='f'){
				return false;
			}
			var askReportKindId=$('#askReportKindId').val();
			if(askReportKindId!=node.id){
				$('#askKindName').val(node.name);
				$('#askReportKindId').val(node.id);
			}
		}
	});
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('请示报告');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>请示报告');
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
		viewHandler:function(){
			viewHandler();
		},
		saveBackUpHandler:{id:'saveBackUpHandler',text:'报告备份并下载',img:'page_user.gif',click:saveBackUpHandler},
		deleteHandler:function(){
			deleteHandler();
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "填单日期", name: "fillinDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
			{ display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "请示类别", name: "askKindName", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "发文号", name: "dispatchNo", width: 150, minWidth: 60, type: "string", align: "left" },
			{ display: "主题", name: "subject", width: 300, minWidth: 60, type: "string", align: "left" },
			{ display: "主送", name: "reportToName", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "部门", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },	
			{ display: "岗位", name: "positionName", width: 100, minWidth: 60, type: "string", align: "left" },	
			{ display: "制表人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "状态", name: "statusTextView", width: 60, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/askReportAction!slicedQueryAskReport.ajax',
		parms:{statusFalg:1},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -15,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'askReportId',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.askReportId);
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
	onFolderTreeNodeClick();
}

function viewHandler(askReportId){
	if(!askReportId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		askReportId=row.askReportId;
	}
	var url=web_app.name + '/askReportAction!showUpdateAskReport.job?bizId='+askReportId+'&isReadOnly=true';
	parent.addTabItem({ tabid: 'askReport'+askReportId, text: '查看请示报告', url:url});
}

function saveBackUpHandler(){
	/*var ids=DataUtil.getSelectedIds({gridManager:gridManager,idFieldName:'askReportId'});
	if(!ids) return false;*/
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var askReportId=row.askReportId;
	UICtrl.downFile({action:'/askReportAction!saveBackUpAskReport.ajax',param:{askReportId:askReportId}});
}

function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var askReportId=row.askReportId;
	UICtrl.confirm( '您确定删除选中数据吗<font color=red>[删除后无法恢复]</font>?', function() {
		Public.ajax(web_app.name + '/askReportAction!deleteAskReportBySpecial.ajax' , {askReportId:askReportId}, function(data) {
			reloadGrid();
		});
	});
}