var gridManager = null,queryType=null;
var payMainId=null,payOrgnId=null;
$(document).ready(function() {
	payMainId = Public.getQueryStringByName("payMainId");
	payOrgnId = Public.getQueryStringByName("payOrgnId");
	initializeUI();
	initializeGrid();
});
function initializeUI(){
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
		html.push('人员列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>人员列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#mainFullId').val(fullId);
	if (gridManager&&fullId!='') {
		UICtrl.gridSearch(gridManager,{qFullId:fullId});
	}else{
		gridManager.options.parms['qFullId']='';
	}
}
//初始化表格
function initializeGrid() {
	var url= web_app.name+'/paymasterAction!slicedQueryNotExistsPerson.ajax';
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	var columns= [
	   { display: "姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left" },	   
	   { display: "中心", name: "centreName", width: 130, minWidth: 60, type: "string", align: "left" },		   
	   { display: "部门", name: "dptName", width: 130, minWidth: 60, type: "string", align: "left" },		   
	   { display: "岗位", name: "posName", width: 80, minWidth: 60, type: "string", align: "left" },
	   { display: "入职时间", name: "employedDate", width: 80, minWidth: 60, type: "date", align: "left" },
	   { display: "离职办理中", name: "isLeave", width: 80, minWidth: 60, type: "string", align: "left",
		   render: function (item) { 
				return item.isLeave==1?'离职办理中':'';
			}
	   },
	   { display: "工资发放标志", name: "wageFlagTextView", width: 80, minWidth: 60, type: "string", align: "left" },
	   { display: "工资主体单位", name: "wageOrgName", width: 120, minWidth: 60, type: "string", align: "left" },
	   { display: "工资归属单位", name: "companyName", width: 120, minWidth: 60, type: "string", align: "left" }
	];
	gridManager = UICtrl.grid('#maingrid', {
		columns:columns,
		dataAction : 'server',
		url:url,
		parms:{payMainId:payMainId,payOrgnId:payOrgnId},
		pageSize : 20,
		width : '100%',
		height : '100%',
		sortName:'sequence',
		sortOrder:'asc',
		heightDiff : -15,
		headerRowHeight : 25,
		toolbar: toolbarOptions,
		rowHeight : 25,
		fixedCellHeight : true,
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