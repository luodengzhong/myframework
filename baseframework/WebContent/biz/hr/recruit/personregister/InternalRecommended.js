var  gridManager = null,refreshFlag = false; var fullId=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
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
		onClick : onFolderTreeNodeClick});
}

function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('内部推荐岗位列表');
	}else{
		fullId=data.fullId,fullName=data.fullName,id=data.id;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>内部推荐岗位列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#mainFullId').val(fullId);
	if (gridManager&&fullId!='') {
		UICtrl.gridSearch(gridManager,{fullId:fullId});
	}else{
		gridManager.options.parms['fullId']='';
	}
	
}

function initializeGrid(){
	
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		viewPosDetailHandler: {id:'viewPosDetail',text:'应聘',img:'page_user.gif',click:function(){
			viewPosDetail();
		}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "招聘岗位", name: "name", width: 160, minWidth: 60, type: "string", align: "left"},	
		{ display: "招聘部门", name: "deptName", width: 200, minWidth: 60, type: "string", align: "left" },	
		{ display: "招聘单位", name: "organName", width: 200, minWidth: 60, type: "string", align: "left" },
		{ display: "招聘人数", name: "recNumber", width: 120, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/personregisterAction!sliceInternalRecommendPosList.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewPosDetail(data.recPosId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager,false);

}
function viewPosDetail(recPosId){
	if(!recPosId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		recPosId=row.recPosId;
	}
 window.location.href =web_app.name + '/personregisterAction!forwardPosDetail.do?posId='+recPosId+'&sourceType='+5;
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

