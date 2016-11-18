
var gridManager = null, refreshFlag = false,welfareCommodityData=null ;

$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	welfareCommodityData=$('#welfareCommodityId').combox('getJSONData');
	initializeGrid();
	initializeUI();
});

//function initializeUI(){
//	$('#toolbar_menuAddBatch').comboDialog({type:'hr',name:'batchStaffChangeArchiveSelect',width:535,dataIndex:'archivesId',manageType:'hrReshuffleManage',
//		getParam:function(){return {searchQueryCondition:"full_id like '%"+$('#organId').val()+"%'"};},
//		checkbox:true,onChoose:function(){
//	    	var rows=this.getSelectedRows();
//	    	var addRows = [], addRow;
//	    	$.each(rows, function(i, o){
//	    		addRow = $.extend({}, o);
//
//	    		addRow["archivesId"] = o["archivesId"];
//	    		addRow["organizationId"] = o["ognId"];
//	    		addRow["organizationName"] = o["ognName"];
//	    		addRow["centerId"] = o["centreId"];
//	    		addRow["centerName"] = o["centreName"];
//	    		addRow["departmentId"] = o["dptId"];
//	    		addRow["departmentName"] = o["dptName"];
//	    		addRow["posId"] = o["posId"];
//	    		addRow["posName"] = o["posName"];
//	    		addRow["welfareCommodityId"]=$("#welfareCommodityId").val();
//	    		addRows.push(addRow);
//    	    }
//	    );
//	    gridManager.addRows(addRows);
//    	return true;
//    }});
//}

function initializeUI(){
	$('#mainfullId').val("-1");
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5,onSizeChanged:function(){
		try{detailGridManager.reRender();}catch(e){}
	}});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrPerFormAssessManage',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds : "ogn,dpt,pos,psm"};
			}
			return {showDisabledOrg:0};
		},
		changeNodeIcon:function(data){
			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
		},
		IsShowMenu:false,
		onClick : onFolderTreeNodeClick
	});
	$('div.l-layout-center').css({borderWidth:0});
}
function onFolderTreeNodeClick(data) {
	var fullId='',orgKindId='',html=[],fullName='';
	orgNode=null;
	if(data){
		fullId=data.fullId;
		fullName=data.fullName;
		$('#mainFullId').val(fullId);
		orgKindId=data.orgKindId;
		if(orgKindId=='psm'){//选择的是人员，新增时默认为选中人员
			orgNode=data;
		}
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>福利实物选择');
	}else{
		html.push('福利实物选择');
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
	var columns=[
	 			{ display: "员工", name: "staffName", width: 100, minWidth: 60, type: "string", align: "center" ,align: 'center'},
				{ display: "单位", name: "organizationName", width: 180, minWidth: 180, type: "string", align: "center" },	
				{ display: "中心", name: "centerName", width: 120, minWidth: 120, type: "string", align: "lecenterft" },	
				{ display: "部门", name: "departmentName", width: 100, minWidth: 60, type: "string", align: "center" },
				{ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "center" },
				{ display: "福利卡", name: "welfareCommodityId", width: 150, minWidth: 150, type: "string", align: "left",
					editor: { type:'combobox',data:welfareCommodityData},					
					render: function (item) { 
					    return welfareCommodityData[item.welfareCommodityId];
				    } 
				},
				{ display: "备注", name: "remark", width: 200, minWidth:150, type: "string",  align: "center",
					editor:{type:'text',maxLength:256}
				}
	 	];


	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler,
		saveHandler:saveHandler,
		deleteHandler: deleteHandler	
	});
	
	gridManager = UICtrl.grid('#maingrid', {
		columns:columns,
		dataAction : 'server',
		url: web_app.name+'/welfareSelectionAction!slicedQuery.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		enabledEdit: true,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true, 
		autoAddRow:{welfareSelectionId:'',organizationId:'',centerId:'',departmentId:'',posId:''}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//添加按钮 
function addHandler() {
	var fullId=$('#mainFullId').val();
	if(fullId==''||fullId=='-1'){
		Public.tip("请选择组织节点!");
		return;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/welfareSelectionAction!showInsertWelfareSelectionForm.load',
		ok: insert,
		title:"新增福利实物选择",
		width:350
	});
}

//新增保存
function insert() {
	var _self=this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/welfareSelectionAction!insert.ajax',
		param:{fullId:$("#mainFullId").val()},
		success : function(data) {
			_self.close();
			reloadGrid();
		}
	});
}
//删除按钮
function deleteHandler(){
	DataUtil.delSelectedRows({action:'welfareSelectionAction!delete.ajax',
		gridManager: gridManager,idFieldName:'welfareSelectionId',
		onSuccess:function(){
			gridManager.loadData();
		}
	});
}



function afterSave(){
	reloadGrid();
}

function saveHandler() {
	var detailData =getExtendedData();
	if(detailData===false){
		return;
	}
	$('#submitForm').ajaxSubmit({
		url : web_app.name + '/welfareSelectionAction!saveOrUpdate.ajax',
		param : $.extend({}, detailData),
		success : function(data) {
			afterSave();
		}
	});
}
function getExtendedData(){
	var detailData = DataUtil.getGridData({gridManager: gridManager});
	if(!detailData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(detailData))};
}
//查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
	
}


//重置表单
function resetForm(obj) {
	$(obj).formClean();
}


