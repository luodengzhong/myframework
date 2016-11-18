var gridManager = null, refreshFlag = false,contractSignType=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	contractSignType=$('#contractSignType').combox('getJSONData');
	archivesState=$('#tempArchivesState').combox('getJSONData');
	$('#state').combox({data:archivesState,checkbox:true}).combox('setValue','0,1');
	initializeUI();
	initializeGrid();
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrBaseContractRenewManage',
		getParam : function(e){
			if(e){
				return {showDisabledOrg: 0, displayableOrgKinds : "ogn,dpt"};
			}
			return {showDisabledOrg: 0};
		},
		changeNodeIcon: function(data){
			data[this.options.iconFieldName] = OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
		},
		IsShowMenu:false,
		onClick : onFolderTreeNodeClick});
}

function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('劳动合同列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>劳动合同列表');
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
	var toolbarOptions =  UICtrl.getDefaultToolbarOptions({ 
		 exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "单位", name: "organRenewName", width: 150, minWidth: 60, type: "string", align: "left" },	
		{ display: "所属一级中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "部门", name: "deptRenewName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "岗位", name: "posRenewName", width: 100, minWidth: 60, type: "string", align: "left" },		
		{ display: "员工姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "人员类别", name: "staffKindTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "合同种类", name: "contractKindTextView", width: 100, minWidth: 60, type: "string", align: "left" },		
		{ display: "合同签订类型", name: "contractSigningKindTextView", width: 100, minWidth: 60, type: "string", align: "left"
			},	
	    { display: "合同/协议甲方", name: "contracCompany", width: 100, minWidth: 60, type: "string", align: "left" },	
	   	{ display: "合同起始时间", name: "contracBeginDate", width: 100, minWidth: 60, type: "date", align: "left" },

	  	{ display: "合同终止时间", name: "contracEndDate", width: 100, minWidth: 60, type: "date", align: "left" }

	
		],
		dataAction : 'server',
		url: web_app.name+'/hRContractAction!sliceQueryContractDetail.ajax',
		manageType:'hrBaseContractRenewManage',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'contracEndDate',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		checkbox:'true',
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
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

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}