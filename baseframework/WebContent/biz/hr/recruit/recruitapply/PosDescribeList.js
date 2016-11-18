var gridManager = null, refreshFlag = false;
var recPosId=null;
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
		manageType:'hrBaseRecruitData',
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
		html.push('岗位列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>岗位列表');
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
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "单位名称", name: "orgName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "中心名称", name: "centerName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "部门名称", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },		             
		{ display: "岗位名称", name: "recPosName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "身高要求", name: "heightReq", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "年龄要求", name: "ageReq", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "专业资格", name: "professionalReq", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "最低学历", name: "eduReq", width: 100, minWidth: 60, type: "string", align: "left"},		   
		{ display: "专业年限", name: "yearReq", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "户籍属地", name: "address", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "岗位职责", name: "posDesReq", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "任职要求", name: "takeJobReq", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "其他要求", name: "otherReq", width: 100, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/recruitApplyAction!slicedPosDesQuery.ajax',
		manageType:'hrBaseRecruitData',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.posDeclareId);
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


function initDialog(){
	var fullId=$('#fullId').val();
	 $('#recPosName').searchbox({type:'hr',name:'hrPosSelect',
			back:{id:'#recPosId',name:'#recPosName'},
			param:{searchQueryCondition:"full_id like '%"+fullId+"%'"}
		});
}

//编辑按钮
function updateHandler(posDeclareId){
	if(!posDeclareId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
	    recPosId=row.recPosId;
		posDeclareId=row.posDeclareId;
	}
	if(posDeclareId.length<1){
		UICtrl.showAjaxDialog({url: web_app.name + '/recruitApplyAction!show.load',
	    	 title:"添加岗位描述",
	    	 param:{recPosId:recPosId}, 
	    	 ok: insert, 
	    	 width:400,
	         close: dialogClose});

	}else{
		UICtrl.showAjaxDialog({url: web_app.name + '/recruitApplyAction!show.load', 
			title:"修改岗位描述",
			param:{recPosId:recPosId}, 
			ok: update, 
			 width:400,
			close: dialogClose});
	}
}


//新增保存
function insert() {
	
	var posDeclareId=$('#posDeclareId').val();
	if(posDeclareId!='') return update();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/recruitApplyAction!insert.ajax',
		success : function(data) {
			$('#posDeclareId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/recruitApplyAction!update.ajax',
		success : function() {
			refreshFlag = true;
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
