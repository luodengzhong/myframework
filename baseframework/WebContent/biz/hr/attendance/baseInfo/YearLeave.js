var gridManager = null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
	$('#year').spinner({countWidth:80}).mask('nnnn');
	$('#personName').searchbox({ type:"hr", name: "queryAllArchiveSelect",manageType:'hrBaseAttManage',
		back:{
                 staffName:"#personName",personId:"#personId"
		}
	});
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrBaseZKAtt',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds : "ogn,dpt,pos"};
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
	var html=[],id='',fullName='';
	if(!data){
		html.push('截止年底年假信息');
	}else{
		id=data.id,fullName=data.fullName;
		$('#orgId').val(id);
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>截止年底年假信息');
		refreshGrid();
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
}

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		exportExcelHandler: function(){
			var params = {};
			params.datas = $.toJSON(gridManager.rows);
			UICtrl.gridExport(gridManager, params);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "机构名称", name: "orgName", width: 150, minWidth: 60, type: "string", align: "left" },		   
			{ display: "部门名称", name: "deptName", width: 120, minWidth: 60, type: "string", align: "left" },		   
			{ display: "岗位名称", name: "positionName", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "人员", name: "name", width:140, minWidth: 140, type: "string", align: "left"},
			{ display: "年假天数", name: "total", width: 120, minWidth: 60, type: "string", align: "left"},	
			{ display: "剩余天数", name: "balance", width: 120, minWidth: 60, type: "string", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/attBaseInfoAction!slicedQueryYearLeave.ajax',
		parms: {orgId:getOrgId(),personId:getPersonId(),year:$('#year').val()},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'orgseq,psnseq',
		sortOrder:'asc',
		checkbox:false,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData: function(){
			return (getOrgId()!="");
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

function getPersonId(){
	return $("#personId").val();
}

function getOrgId(){
	return $("#orgId").val();
}

// 查询
function query(obj) {
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