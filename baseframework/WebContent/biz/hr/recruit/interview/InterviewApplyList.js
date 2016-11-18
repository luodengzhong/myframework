var gridManager = null, refreshFlag = false;
var recruitWay=null;
var interviewStatus=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	 initializeGrid();
//	 initializeUI();
	 recruitWay=$('#recruitWay').combox('getJSONData');
	 interviewStatus=$('#interviewStatus').combox('getJSONData');
	
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
		onClick : onFolderTreeNodeClick});
}

function onFolderTreeNodeClick(data) {

	var html=[],fullId='',fullName='';
	if(!data){
		html.push('面试申请单列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>面试申请单列表');
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
		updateHandler:function(){
			updateHandler();
		},
		viewHandler:viewHandler,
		deleteHandler:deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "面试时间", name: "viewTime", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "面试岗位", name: "applyPosName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "应聘者", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "面试官", name: "viewMemberName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "面试意见", name: "viewOpinionTextView", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "状态", name: "status", width: 100, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return interviewStatus[item.status];
			}},		   
		{ display: "希望待遇", name: "expecteSalary", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "应聘来源", name: "sourceType", width: 100, minWidth: 60, type: "string", align: "left",
			editor: { type:'combobox',data:recruitWay},
			render: function (item) { 
				return recruitWay[item.sourceType];
			} },		   
		{ display: "拟定单位", name: "employCompany", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "拟定中心", name: "employCenter", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "拟定部门", name: "employDept", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "拟定职位", name: "applyPosName", width: 100, minWidth: 60, type: "string", align: "left" },		   
	
		{ display: "综合评价", name: "bsicAssessment", width: 300, minWidth: 60, type: "string", align: "left" }		   
		],
		dataAction : 'server',
		url: web_app.name+'/interviewApplyAction!slicedQuery.ajax',
		manageType:'hrBaseRecruitData',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'viewTime',
		sortOrder:'desc',
		fixedCellHeight : true,
		toolbar: toolbarOptions,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.interviewApplyId);
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

function updateHandler(writeId){
	
	if(!writeId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		writeId=row.writeId;
	}
	parent.addTabItem({
		tabid: 'HRInterViewApply'+writeId,
		text: '修改面试测评',
		url: web_app.name + '/interviewApplyAction!showInsertDetailByWriteId.do?writeId=' 
			+ writeId+'&queryFlag='+"all"
	}
	);
	
}

function deleteHandler(){
	var row = gridManager.getSelectedRow();
	 var fn=function(){Public.successTip("面试任务删除成功!");
	 reloadGrid()};
		if (!row) {Public.tip('请选择数据！'); return; }
		var interviewApplyId=row.interviewApplyId;
		var writeId=row.writeId;
		var viewMemberId=row.viewMemberId;
	 UICtrl.confirm('您确定删除选中面试任务吗?',function(){
    		Public.ajax(web_app.name + '/interviewApplyAction!deleteInterviewTask.ajax',{interviewApplyId:interviewApplyId,writeId:writeId,viewMemberId:viewMemberId},fn);
    	});	
		
}
function viewHandler(interviewApplyId){
	if(!interviewApplyId){
	    var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		interviewApplyId=row.interviewApplyId;
	}
	parent.addTabItem({
		tabid: 'HRInterViewApply'+interviewApplyId,
		text: '面试测评',
		url: web_app.name + '/interviewApplyAction!showInsert.do?interviewApplyId=' 
			+ interviewApplyId
	}
	);
}



//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

