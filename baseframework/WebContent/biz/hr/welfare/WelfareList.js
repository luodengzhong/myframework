
var gridManager = null, refreshFlag = false,welfareCommodityData=null,welfareTypeData=null ;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	welfareCommodityData=$('#welfareCommodityId').combox('getJSONData');
	welfareTypeData=$('#welfareTypeId').combox('getJSONData');
	initializeGrid();
	initializeUI();
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrReshuffleManage',
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
		html.push('福利明细');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>福利明细');
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
		
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		 			{ display: "员工", name: "staffName", width: 100, minWidth: 60, type: "string", align: "center" ,align: 'center'},
					{ display: "单位", name: "organizationName", width: 180, minWidth: 180, type: "string", align: "center" },	
					{ display: "中心", name: "centerName", width: 120, minWidth: 120, type: "string", align: "lecenterft" },	
					{ display: "福利类型", name: "welfareTypeId", width: 100, minWidth: 60, type: "string", align: "center",
						render: function (item) { 
						    return welfareTypeData[item.welfareTypeId];
					    } 					
					},
					{ display: "福利卡", name: "welfareCommodityId", width: 150, minWidth: 150, type: "string", align: "left",
						render: function (item) { 
						    return welfareCommodityData[item.welfareCommodityId];
					    } 
					},
					{ display: "金额", name: "sum", width: 100, minWidth: 60, type: "string", align: "center" },
					{ display: "录入时间", name: "welfareDate", width: 120, minWidth: 120, type: "date", align: "center" },
					{ display: "备注", name: "remark", width: 200, minWidth:150, type: "string",  align: "left",maxLength:256}
		],
		dataAction : 'server',
		url: web_app.name+'/welfareAction!slicedQueryWelfare.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		//manageType:'hrReshuffleManage',
		rowHeight : 25,
		sortName:'welfareDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		enabledEdit: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
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

//刷新表格
function reloadGrid() {
	gridManager.loadData();
}


