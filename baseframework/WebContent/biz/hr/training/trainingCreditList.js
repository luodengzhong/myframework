var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	$('#year').spinner({countWidth:80}).mask('nnnn');
	initializeUI();
	initializeGrid();
});


function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrArchivesManage',
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
		html.push('培训学分查询');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>培训学分查询');
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
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
					{ display: "机构名称", name: "ognName", width: 180, minWidth: 140, type: "string", align: "center"},
					{ display: "一级中心", name: "centreName", width: 140, minWidth: 140, type: "string", align: "center"},
					{ display: "部门名称", name: "dptName", width: 140, minWidth: 140, type: "string", align: "center"},
					{ display: "岗位名称", name: "posName", width: 140, minWidth: 140, type: "string", align: "center"},
					{ display: "员工姓名", name: "staffName", width: 140, minWidth: 140, type: "string", align: "center"},
		  			{ display: "年度", name: "year", width: 140, minWidth: 140, type: "string", align: "center"},
					{ display: "总学分", name: "totalGainCredit", width: 140, minWidth: 140, type: "number", align: "center",totalSummary:UICtrl.getTotalSummary() }		   
		],
		dataAction : 'server',
		url: web_app.name+'/trainingSpecialClassAction!slicedQuerytrainingCredit.ajax',
		manageType:'hrArchivesManage',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'archivesId',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		enabledEdit: false,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.personId,data.staffName,data.year);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
}
//编辑按钮
function updateHandler(id,staffName,year){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.personId;
		staffName=row.staffName;
		year=row.year;
	}
	parent.addTabItem({
		tabid: 'HRScoreList'+id,
		text: '员工培训学分查询',
		url: web_app.name + '/trainingSpecialClassAction!forwardPersonnelTrainingScoreList.do?personId=' + id+'&year='+year+'&staffName='+encodeURI(encodeURI(staffName))
	}
	);
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


