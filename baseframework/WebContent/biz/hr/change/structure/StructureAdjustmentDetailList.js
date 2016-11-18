var gridManager = null, refreshFlag = false;
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
		manageType:'hrReshuffleManage',
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
		html.push('异动明细');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>异动明细');
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
	var posLevelData=$('#mainPosLevel').combox('getJSONData');
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		},
		viewHandler: function(){
			updateHandler();
		}
	});
	
	    var columns=[
		 		// { display: "序号", name: "myRownum", width: 60, minWidth: 60, type: "string", align: "center" },
		 			{ display: "填表日期", name: "fillinDate", width: 80, minWidth: 60, type: "date", align: "left" },
		 			{ display: "单据号码", name: "billCode", width: 120, minWidth: 120, type: "string", align: "left" }
		 	    ];
	    var columnMaker={display: '制表人信息', columns:[]};
	    columnMaker.columns.push({ display: "部门", name: "deptName", width: 80, minWidth: 60, type: "string", align: "left" });
	    columnMaker.columns.push({ display: "岗位", name: "positionName", width: 100, minWidth: 60, type: "string", align: "left" });
	    columnMaker.columns.push({ display: "制表人", name: "personMemberName", width: 80, minWidth: 60, type: "string", align: "left"} );
	    columns.push(columnMaker);

	    columns.push({ display: "员工", name: "staffName", width: 60, minWidth: 60, type: "string", align: "center" });
	    columns.push({ display: "生效时间", name: "effectiveDate", width:80, minWidth: 100, type: "string", align: "left"});
	    
	    var columnAfter={display: '异动后情况', columns:[]};
	    columnAfter.columns.push({ display: "机构", name: "afterOrganName", width: 180, minWidth: 180, type: "string", align: "left"});
	    columnAfter.columns.push({ display: "中心", name: "afterCenterName", width: 120, minWidth: 120, type: "string", align: "left"});
	    columnAfter.columns.push({ display: "部门", name: "afterDeptName", width: 80, minWidth: 60, type: "string", align: "left"});
	    columnAfter.columns.push({ display: "岗位", name: "afterPositionName", width: 80, minWidth: 60, type: "string", align: "left"});
//	    columnAfter.columns.push({ display: "职级", name: "afterJobTitle",width: 80, minWidth: 60, type: "string", align: "left"});
//	    columnAfter.columns.push({ display: "层级", name: "afterPosTier", width: 80, minWidth: 60, type: "string", align: "left"});
		columnAfter.columns.push({ display: "行政级别", name: "afterPosLevel",width: 80, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return posLevelData[item.afterPosLevel];
			}	
		});
		columnAfter.columns.push({ display: "职位描述", name: "afterPosDesc",width: 150, minWidth: 60, type: "string", align: "left"});

	    

	
	
	    var columnBefore={display: '异动前情况', columns:[]};
		columnBefore.columns.push({display: "机构", name: "beforeOrganName", width: 180, minWidth: 180, type: "string", align: "left" });
		columnBefore.columns.push({ display: "中心", name: "beforeCenterName", width: 120, minWidth:120, type: "string", align: "left" });
		columnBefore.columns.push({ display: "部门", name: "beforeDeptName", width: 80, minWidth: 60, type: "string", align: "left" });
		columnBefore.columns.push({ display: "岗位", name: "beforePositionName", width: 80, minWidth: 60, type: "string", align: "left" });
//		columnBefore.columns.push({ display: "职级", name: "beforeJobTitle", width: 80, minWidth: 60, type: "string", align: "left" });
//		columnBefore.columns.push({ display: "层级", name: "beforePosTier", width: 80, minWidth: 60, type: "string", align: "left" });
		columnBefore.columns.push({ display: "行政级别", name: "beforePosLevel", width: 80, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return posLevelData[item.beforePosLevel];
			}	
	
		});
		columnBefore.columns.push({ display: "职位描述", name: "beforePosDesc",width:150, minWidth: 60, type: "string", align: "left"});
	//	columnBefore.columns.push({ display: "工资结算单位", name: "beforePayOrganName", width: 80, minWidth: 60, type: "string", align: "left" });
		columns.push(columnBefore);
	    columns.push({ display: "原因", name: "reason", width:300, minWidth: 200, type: "string", align: "left"});
		
		columns.push(columnAfter);
	
	gridManager = UICtrl.grid('#maingrid', {
		columns: columns,
		dataAction : 'server',
		url: web_app.name+'/structureAdjustmentAction!slicedQueryUnusualChangeDetailList.ajax',
		pageSize : 20,
		manageType:'hrReshuffleManage',
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'detailId',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.auditId);
		}

	});
	UICtrl.setSearchAreaToggle(gridManager);
}

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		auditId=row.auditId;
	}else{
		auditId=id;
	}
	
	parent.addTabItem({
		tabid: 'HRStructureAdjustmentList'+auditId,
		text: '组织架构调整查询',
		url: web_app.name + '/structureAdjustmentAction!showUpdate.job?bizId=' 
			+ auditId+'&isReadOnly=true'
	}
	);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	var isEffect=param['isEffect'];
	if(isEffect=='1'){
		param['isEffect']='0';
	}else{
	    param['isEffect']='';
	}
	UICtrl.gridSearch(gridManager, param);
}


//重置表单
function resetForm(obj) {
	$(obj).formClean();
	onFolderTreeNodeClick();
}