var gridManager = null, refreshFlag = false,archivesState=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	archivesState=$('#tempArchivesState').combox('getJSONData');
	initializeUI();
	initializeGrid();
});
function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrBaseTrainManageData',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,orgKindId : "ogn,dpt"};
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
		html.push('学员培训记录');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>学员培训记录');
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
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "单位", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "所属一级中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "部门", name: "dptName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "学员姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "班级", name: "className", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "开班时间", name: "openTime", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "结业时间", name: "graduatedTime", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "课堂表现得分", name: "gainShowScore", width: 100, minWidth: 60, type: "string", align: "left"},
        { display: "培训考试分数", name: "examScore", width: 100, minWidth: 60, type: "string", align: "left"},
		{ display: "所获学分", name: "gainCredit", width: 60, minWidth: 60, type: "string", align: "left" }
		/*{ display: "学分明细", name: "", width: 100, minWidth: 60, type: "string", align: "left",
		 render: function (item){
	    		return '<a href="javascript:viewCreditDetail('+item.trainingStudentId+');" class="GridStyle">' + "查看" + '</a>';
		}}*/
		],
		dataAction : 'server',
		url: web_app.name+'/trainingStudentArchiveAction!slicedQuery.ajax',
		manageType:'hrBaseTrainManageData',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'trainingStudentId',
		sortOrder:'asc',
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
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

