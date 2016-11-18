var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
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
	initializeDefaultUI();
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hRPayManage',
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
		html.push('绩效奖金计算');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>绩效奖金计算');
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
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler,
		isuse:{id:'isuse',text:'发放',img:'page_dynamic.gif',click:isuse}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "公司", name: "organName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "部门", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "岗位", name: "positionName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "制表人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "计算主体", name: "orgUnitName", width: 120, minWidth: 60, type: "string", align: "left" },
		{ display: "执行期间", name: "periodName", width: 140, minWidth: 60, type: "string", align: "left" },
		{ display: "年度", name: "year", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "考核期间", name: "periodCodeName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/payPerformanceAction!slicedQueryPayPerformanceMain.ajax',
		manageType:'hRPayManage',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data);
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
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	if(parseInt(row.status,10)!=0){
		Public.tip('数据已提交不能删除');
		return;
	}
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/payPerformanceAction!deletePayPerformanceMain.ajax',{performanceMainId:row.performanceMainId}, function(){
			reloadGrid();
		});
	});
}

function updateHandler(row){
	if(!row){
		row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
	}
	var isReadOnly=false;
	if(parseInt(row.status,10)!=0){
		isReadOnly=true;
	}
	var url=web_app.name + '/payPerformanceAction!showUpdatePayPerformance.do?performanceMainId='+row.performanceMainId+'&isReadOnly='+isReadOnly;
	parent.addTabItem({ tabid: 'HRpayPerformance'+row.performanceMainId, text: '绩效奖金计算', url:url});
}

function isuse(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	if(parseInt(row.status,10)!=0){
		Public.tip('数据已提交不能重新发放!');
		return;
	}
	UICtrl.confirm('确定要发放当前数据吗?',function(){
		Public.ajax(web_app.name + '/payPerformanceAction!savePayPerformancePublish.ajax',{performanceMainId:row.performanceMainId}, function(){
			reloadGrid();
		});
	});
}