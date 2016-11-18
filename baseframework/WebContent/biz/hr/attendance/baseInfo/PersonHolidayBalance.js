var gridManager = null , leaveKindData = [];
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	leaveKindData = $("#leaveKindList").combox("getFormattedData"); 
	initializeGrid();
	initializeUI();
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrBaseAttManage',
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
		html.push('假期余额');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>假期余额');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	if (gridManager&&fullId!='') {
		UICtrl.gridSearch(gridManager,{fullId:fullId});
	}else{
		gridManager.options.parms['fullId']='';
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
		{ display: "机构名称", name: "organName", width: 150, minWidth: 60, type: "string", align: "left" },		   
		{ display: "部门名称", name: "deptName", width: 120, minWidth: 60, type: "string", align: "left" },		   
		{ display: "岗位名称", name: "positionName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "人员", name: "staffName", width:140, minWidth: 140, type: "string", align: "left",
			editor: { type: 'select',  data: { type:"sys", name: "orgSelect", manageType:'hrBaseAttManage',
				getParam: function(){
				 return { a: 1, b: 1, searchQueryCondition:  " org_id like '%" + getOrganId() +  "%'  and  org_kind_id ='psm' and instr(full_id, '.prj') = 0"  };
				}, back:{fullId: "fullId", orgId: "organId", orgName: "organName", centerId: "centerId", centerName: "centerName",
					deptId: "deptId", deptName: "deptName", positionId: "positionId", positionName: "positionName",
					personId: "personId", personMemberName: "staffName" }
				
		}}},		   
		{ display: "假期类别", name: "leaveKindIdTextView", width: 100, minWidth: 60, type: "string", align: "left",
			editor: { type: 'combobox', data: leaveKindData, valueField: "leaveKindId", required: true} 
		},
		{ display: "假期天数", name: "total", width: 100, minWidth: 60, type: "string", align: "left",
			editor: { type: 'text', mask: "nn.nn", required:true}  },	
		{ display: "已用天数", name: "used", width: 100, minWidth: 60, type: "string", align: "left",
				editor: { type: 'text', mask: "nn.nn", required:true}  },	
		{ display: "剩余天数", name: "balance", width: 100, minWidth: 60, type: "string", align: "left",
			editor: { type: 'text', mask: "nn.nn", required:true}  },		   
		{ display: "备注", name: "remark", width: 100, minWidth: 60, type: "string", align: "left",
			editor: { type: 'text'}}
		],
		dataAction : 'server',
		url: web_app.name+'/attBaseInfoAction!slicedQueryPersonHolidayBalance.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		manageType:'hrBaseAttManage',
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		autoAddRow:{fullId: "", organId:"", centerId:"", deptId:"", positionId: "", personId: ""},
		enabledEdit: true,
		checkbox: true
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
}

function getOrganId(){
	return $("#organId").val();
}

function getCenterId(){
	return $("#centerId").val();
}

function resetForm(obj) {
	$(obj).formClean();
}

function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

function reloadGrid() {
	gridManager.loadData();
} 

function resetForm(obj) {
	$(obj).formClean();
}

function addHandler() {
	UICtrl.addGridRow(gridManager);
}

function saveHandler(id){
	var detailData = DataUtil.getGridData({gridManager:gridManager});
	if(!detailData || detailData.length == 0) return false;
	Public.ajax(web_app.name +'/attBaseInfoAction!savePersonHolidayBalance.ajax',
		{
			detailData:encodeURI($.toJSON(detailData))
		},
		function(){
			reloadGrid();
		}
	);
}

function deleteHandler(){
	DataUtil.delSelectedRows({ action:'attBaseInfoAction!deletePersonHolidayBalance.ajax', 
		gridManager: gridManager, idFieldName: 'personHolidayBalId',
		onSuccess:function(){
			reloadGrid();
		}
	});
}
