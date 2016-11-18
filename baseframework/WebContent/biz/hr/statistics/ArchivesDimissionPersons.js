var gridManager = null;
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
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('人员列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>人员列表');
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
		saveDHandler:{id:'saveDHandler',text:'禁用系统账号',img:'page_user_dark.gif',click:function(){
				DataUtil.delSelectedRows({action:'hrSystemStatisticsAction!updateDisablePerson.ajax',
					message:'您确定禁用选中数据吗?',
					gridManager:gridManager,idFieldName:'id',
					onSuccess:function(){
						reloadGrid();
					}
				});
		}}
	});
	var columns=[
	      { display: "姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left"},	
	      { display: "用户名", name: "loginName", width: 90, minWidth: 60, type: "string", align: "left"},	
	      { display: "证件号", name: "idCardNo", width: 100, minWidth: 60, type: "string", align: "left"},
	      { display: "性别", name: "sexTextView", width: 70, minWidth: 60, type: "string", align: "left"},
	      { display: "单位", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left" },		   
	      { display: "所属一级中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" },		   
	      { display: "部门", name: "dptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
	      { display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },
	      { display: "离职日期", name: "departurDate", width: 100, minWidth: 60, type: "date", align: "left" }
	];
	gridManager = UICtrl.grid('#maingrid', {
		columns:columns,
		dataAction : 'server',
		url: web_app.name+'/hrSystemStatisticsAction!slicedQueryArchivesDimissionPersons.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		enabledEdit: true,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		checkbox:true,
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
	onFolderTreeNodeClick();
}
