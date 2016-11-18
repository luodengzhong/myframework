var gridManager = null, refreshFlag = false,yesOrNo = {0:'否', 1:'是'},
selectFunctionDialog=null;
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
}

function onFolderTreeNodeClick(data) {
	var html=[],id='',name='',orgKindId='',fullId='',fullName='';
	if(!data){
		html.push('会议秘书信息');
	}else{
		id=data.id,name=data.name,orgKindId=data.orgKindId,fullId=data.fullId,fullName=data.fullName;
		$('#fullId').val(fullId);
		$('#manageOrganId').val(id);
		$('#orgName').val(name);
		$('#mfullName').val(fullName);
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>会议秘书信息');
		refreshGrid();
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
}

//初始化表格
function initializeGrid() {
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "组织机构", name: "manageOrgName", width: 100, minWidth: 60, type: "string", align: "left" }, 
		{ display: "秘书机构名称", name: "orgName", width: 100, minWidth: 60, type: "string", align: "left" }, 
		{ display: "秘书名", name: "personName", width: 100, minWidth: 60, type: "string", align: "left",
			editor: { type: 'select', required: true, data: { type:"sys", name: "orgSelect", 
				getParam: function(){
					return { a: 1, b: 1, searchQueryCondition: "org_kind_id ='psm'" };
			}, 
			back:{personId:"personId", personMemberName: "personName",orgName:"orgName" }}}},
		{ display: "是否可用", name: "pstatus", width: 60, minWidth: 40, type: "string", align: "left",
			render: function (item) { 
			return yesOrNo[item.pstatus];
		}},	
		{ display: "序列号", name: "sequence", width: 60, minWidth: 50, type: "string", align: "left",
			editor: {type:'spinner',required:true}},
		{ display: "组织机构全路径", name: "fullName", width: 260, minWidth: 80, type: "string", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/meetingSecretaryAction!slicedQuery.ajax',
		parms: {manageOrganId:getManageOrgId()},
		pageSize : 20,
		delayLoad:false,
		enabledEdit: false,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

function getManageOrgId(){
	return $("#manageOrganId").val();
}

// 查询
function query(obj) {
	var manageOrgId = getManageOrgId();
	if(!manageOrgId){
		Public.tip("请选择左侧的组织机构");
		return;
	}
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

//查询
function refreshGrid(){
	var obj = $("#queryMainForm");
	query(obj);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}