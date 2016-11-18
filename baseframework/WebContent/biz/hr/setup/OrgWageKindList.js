var gridManager = null, refreshFlag = false,selectFunctionDialog=null;
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
		//manageType:'hrBusinessRegistrationManage',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds : "ogn"};
			}
			return {showDisabledOrg:0};
		},
		changeNodeIcon:function(data){
			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
		},
		IsShowMenu:false,
		onClick : onFolderTreeNodeClick
	});
	 $('#wageKind').searchbox({type:'hr',name:'wageKindChoose',
			back:{name:'#wageKind',detailId:'#wageKindId'}
	 });
}
function onFolderTreeNodeClick(data) {
	var html=[],organId='',name='';
	if(!data){
		html.push('机构工资类别');
	}else{
		organId=data.id,name=data.name;
		html.push('<font style="color:Tomato;font-size:13px;">[',name,']</font>机构工资类别');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#mainOrganId').val(organId);
	$('#mainOrganName').val(name);
	if (gridManager&&organId!='') {
		UICtrl.gridSearch(gridManager,{organId:organId});
	}else{
		gridManager.options.parms['organId']='';
	}
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler,
		saveHandler:saveHandler, 
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [		   
		{ display: "机构", name: "organName", width: 200, minWidth: 60, type: "string", align: "left" },
		{ display: "名称", name: "parentName", width: 150, minWidth: 60, type: "string", align: "left" },
		{ display: "成员名称", name: "name", width:220, minWidth: 60, type: "string", align: "left" },
		{ display: "成员值", name: "value", width: 120, minWidth: 60, type: "string", align: "left" },		
		{ display: "成员类别", name: "type", width: 120, minWidth: 60, type: "string", align: "left" },		
		{ display: "实付工资月数", name: "realWageMonth", width: 120, minWidth: 60, type: "string", align: "left",
			editor: { type:'text',mask:'nn'} 
		}
		],
		dataAction : 'server',
		url: web_app.name+'/hrSetupAction!slicedQueryOrgWageKind.ajax',
	//	manageType:'hrBusinessRegistrationManage',
		parms:{organId: 1},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		checkbox:true,
		enabledEdit: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//添加按钮 
function addHandler() {
	var organId=$('#mainOrganId').val();
	if(organId==''){
		Public.tip('请选择单位！'); 
		return;
	}
	
	var wageKindId=$('#wageKindId').val();
	if(wageKindId==''){
		Public.tip('请选择工资类别！'); 
		return;
	}

	$('#queryMainForm').ajaxSubmit({url: web_app.name + '/hrSetupAction!saveOrgWageKind.ajax',
		success : function() {
			reloadGrid();	
		}
	});
}

function saveHandler(){
	var detailData=DataUtil.getGridData({gridManager:gridManager});
	if(!detailData) return false;
	if(detailData.length==0){
		Public.tip('没有数据被修改！');
		return false;
	}
	Public.ajax(web_app.name + '/hrSetupAction!updateOrgWageKind.ajax', {orgWageKindData:encodeURI($.toJSON(detailData))}, function(data) {
		reloadGrid();
	});
	return false;
}
//删除按钮
function deleteHandler(){
	DataUtil.del({action:'hrSetupAction!deleteOrgWageKind.ajax',
		gridManager:gridManager, 
		idFieldName: 'orgWageKindId',
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}
//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}
