var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
		initializeUI();
	initializeGrid();
});
function initializeUI() {
	UICtrl.layout("#layout", {
		leftWidth : 200,
		heightDiff : -5
	});
	$('#maintree').commonTree(
			{
				loadTreesAction : 'orgAction!queryOrgs.ajax',
				parentId : 'orgRoot',
		        manageType:'hrBaseRecruitData',
				getParam : function(e) {
					if (e) {
						return {
							showDisabledOrg : 0,
							displayableOrgKinds : "ogn,dpt"
						};
					}
					return {
						showDisabledOrg : 0
					};
				},
				changeNodeIcon : function(data) {
					data[this.options.iconFieldName] = OpmUtil.getOrgImgUrl(
							data.orgKindId, data.status);
				},
				IsShowMenu : false,
				onClick : onFolderTreeNodeClick
			});
}

function onFolderTreeNodeClick(data) {

	var html = [], fullId = '', fullName = '';
	if (!data) {
		html.push('延期转正面谈记录列表');
	} else {
		fullId = data.fullId, fullName = data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[', fullName,
				']</font>延期转正面谈记录列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#mainFullId').val(fullId);
	if (gridManager && fullId != '') {
		UICtrl.gridSearch(gridManager, {
			fullId : fullId
		});
	} else {
		gridManager.options.parms['fullId'] = '';
	}

}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		viewHandler: function(){
			updateHandler();
		}
		
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		 { display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left" },		     
		{ display: "机构", name: "organName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "部门", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "岗位", name: "positionName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "员工姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "面谈人姓名", name: "speakPersonMemberName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left" },		
		{ display: "性别", name: "sexTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "年龄", name: "age", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "最高学历", name: "educationTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "到公司时间", name: "employedDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "原定转正时间", name: "beformalDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "延期后转正时间", name: "delayBeformalDate", width: 100, minWidth: 60, type: "string", align: "left" }		   
		],
		dataAction : 'server',
		url: web_app.name+'/delayInterviewAction!slicedQuery.ajax',
		pageSize : 20,
		manageType:'hrBaseRecruitData',
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.delayInterviewId);
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


//编辑按钮
function updateHandler(delayInterviewId){
	if(!delayInterviewId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		delayInterviewId=row.delayInterviewId;
	}
  parent.addTabItem({
		tabid : 'HRDelayInterviewApply' + delayInterviewId,
		text : '延期转正面谈记录明细',
		url : web_app.name + '/delayInterviewAction!showUpdate.job?bizId='
				+ delayInterviewId + '&isReadOnly=true'
	});

}



//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}
/*
//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "delayInterviewAction!updateSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'id', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'delayInterviewAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'id', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'delayInterviewAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'id',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
*/
