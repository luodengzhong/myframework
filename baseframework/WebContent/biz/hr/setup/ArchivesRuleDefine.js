var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler,
		enableHandler: enableHandler,
		disableHandler: disableHandler,
		saveSortIDHandler: saveSortIDHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		       { display: "字段", name: "display", width: 120, minWidth: 60, type: "string", align: "left" }, 
		       { display: "字段状态", name: "fieldStatus", width: 100, minWidth: 60, type: "string", align: "left",
		    	   render: function (item) { 
					 return UICtrl.getStatusInfo(item.fieldStatus);
				   } 
		       },
		       { display: "规则状态", name: "status", width: 100, minWidth: 60, type: "string", align: "left", 
		    	   render: function (item) { 
						return UICtrl.getStatusInfo(item.status);
				   } 
		       },
		       { display: "薪酬字段", name: "isWageField", width: 100, minWidth: 60, type: "string", align: "left", 
		    	   render: function (item) { 
						return UICtrl.getStatusInfo(item.isWageField);
				   } 
		       },
		       { display: "计算规则", name: "ruleContent", width: 400, minWidth: 60, type: "string", align: "left" },
		       { display: "序号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left",
		    	   render: function (item) { 
					     return UICtrl.sequenceRender(item);
		       	   } 
		       },
		       { display: "编辑", width: 60, minWidth: 60, type: "string", align: "center",
					render: function (item) {
						return '<a href="javascript:updateByOrg('+item.id+',\''+item.display+'\');" class="GridStyle">编辑</a>';
					} 
		       }
		],
		dataAction : 'server',
		url: web_app.name+'/hrSetupAction!slicedQueryArchivesRuleDefine.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		checkbox:true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.id);
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

//添加按钮 
function addHandler() {
	UICtrl.showAjaxDialog({url: web_app.name + '/hrSetupAction!showInsertArchivesRuleDefine.load',width:630, ok: insert, close: dialogClose});
}

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	//所需参数需要自己提取 
	UICtrl.showAjaxDialog({url: web_app.name + '/hrSetupAction!showUpdateArchivesRuleDefine.load', width:630,param:{id:id}, ok: update, close: dialogClose});
}

//删除按钮
function deleteHandler(){
	DataUtil.del({action:'hrSetupAction!deleteArchivesRuleDefine.ajax',
		gridManager:gridManager,idFieldName:'id',
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

//新增保存
function insert() {
	var id=$('#detailId').val();
	if(id!='') return update();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/hrSetupAction!insertArchivesRuleDefine.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			$('#detailId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/hrSetupAction!updateArchivesRuleDefine.ajax',
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
//启用
function enableHandler(){
	DataUtil.updateById({ action: 'hrSetupAction!updateArchivesRuleDefineStatus.ajax',
		gridManager: gridManager,idFieldName:'id', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'hrSetupAction!updateArchivesRuleDefineStatus.ajax',
		gridManager: gridManager,idFieldName:'id',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}

//保存排序号
function saveSortIDHandler(){
	var action = "hrSetupAction!updateArchivesRuleDefineSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager, onSuccess: function(){
		reloadGrid();
	}});
}

//行编辑按钮
function updateByOrg(id, display){
	UICtrl.showFrameDialog({
		title:'编辑['+display+']规则',
		url: web_app.name + '/hrSetupAction!forwardArchivesRuleDefineOrg.do', 
		param:{id:id},
		height:290,
		width:650,
		okVal:'保存',
		ok:doSaveRuleByOrg,
		cancel:true
	});
}
function doSaveRuleByOrg(){
	var iframeWindow=this.iframe.contentWindow;
	var fn = iframeWindow.getData;
	if($.isFunction(fn)){
		var data=fn();
		Public.ajax(web_app.name + '/hrSetupAction!saveArchivesRuleDefineOrg.ajax', data, function(id) {
			iframeWindow.setId(id);
		});
	}
}

