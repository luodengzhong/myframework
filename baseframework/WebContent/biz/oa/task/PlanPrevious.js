
var treeManager = null, gridManager = null,gridManager_Document = null,gridManager_Guide = null,  refreshFlag = false, selectFunctionDialog, owningObjectId = 0,lastTemplateSelectedId = 0;

$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
	initializeDocumentGrid();
	initializeGuideGrid();
});

function initializeUI() {

	owningObjectId =  $('#owningObjectId').val();
//	UICtrl.initDefaulLayout();
	UICtrl.layout("#layout", {
        leftWidth: 200,
        heightDiff: -5,
        onSizeChanged: function () {
        	treeManager._onResize();
        	gridManager.reRender();
        }
    });
	treeManager = UICtrl.layout("#layoutplan", {
        onSizeChanged: function () {
            gridManager.reRender();
        }
    });
}


//初始化表格
function initializeDocumentGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		planSetHandler:{id:'planSet',text:'成果设置', click:addDocumentHandler, img:'page_edit.gif'}/*, 
		enableHandler: enableDocumentHandler,
		disableHandler: disableDocumentHandler*/
	});
	gridManager_Document = UICtrl.grid('#maingriddocument', {
		columns: [
		   
		{ display: "成果", name: "name", width: 160, minWidth: 60, type: "string", align: "left" },		   
		{ display: "更新时间", name: "updateDate", width: 160, minWidth: 60, type: "string", align: "left" },
		{ display: "版本", name: "documentVersion", width: 160, minWidth: 60, type: "string", align: "left" },
		{ display: "状态", name: "status", width: 160, minWidth: 60, type: "string", align: "left",	
				render : function(item) {
				return UICtrl.getStatusInfo(null == item.status?1:item.status);
			} }	/*,	
		{ display: "排序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left" ,
			render: function (item) {
              item.id = item.planTypeId;
              return UICtrl.sequenceRender(item);
          }}*/
		],
		dataAction : 'server',
		url: web_app.name+'/linkAction!slicedQueryPlanDocument.ajax',
		parms: {
			planId: $('#taskId').val(),
			owningObjectId:owningObjectId
      }, 
		pageSize : 20,
		width : '100%',
		height : '70%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			addDocumentHandler();
		}
	});
	UICtrl.setSearchAreaToggle(gridManager_Document);
}

//初始化表格
function initializeGuideGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		planSetHandler:{id:'planSet',text:'指引设置', click:addGuideHandler, img:'page_edit.gif'}/*,
		enableHandler: enableGuideHandler,
		disableHandler: disableGuideHandler*/
	});
	gridManager_Guide = UICtrl.grid('#maingridguide', {
		columns: [
		   
		{ display: "指引", name: "guideName", width: 160, minWidth: 60, type: "string", align: "left" },		   
		{ display: "更新时间", name: "updateDate", width: 160, minWidth: 60, type: "string", align: "left" },		   
		{ display: "版本", name: "guideVersion", width: 160, minWidth: 60, type: "string", align: "left" },
		{ display: "状态", name: "status", width: 160, minWidth: 60, type: "string", align: "left",	
			render : function(item) {
			return UICtrl.getStatusInfo(item.status);
		} }	/*,		   
		{ display: "排序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left",
			render: function (item) {
                item.id = item.planTypeId;
                return UICtrl.sequenceRender(item);
            } }*/
		],
		dataAction : 'server',
		url: web_app.name+'/linkAction!slicedQueryPlanGuide.ajax',
		parms: {
			planId: $('#taskId').val(),
			owningObjectId:owningObjectId
        }, 
		pageSize : 20,
		width : '100%',
		height : '70%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		enabledEdit: true,
		autoAddRowByKeydown:false,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			addGuideHandler();
		}
	});
	UICtrl.setSearchAreaToggle(gridManager_Guide);
}


//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
/*		addHandler: addlocalHandler, 
		updateHandler: function(){
			updateHandler();
		},*/
		planPreviousSetHandler:{id:'planPreviousSet',text:'前置任务设置', click:addHandler, img:'page_edit.gif'}/*, 
		deleteHandler: deleteHandler,
		enableHandler: enableHandler,
		disableHandler: disableHandler,
		saveSortIDHandler: saveSortIDHandler*/
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		   
		{ display: "前置类型", name: "previousTypeIdTextView", width: 160, minWidth: 60, type: "string", align: "left" },		   
		{ display: "前置计划", name: "previousPlanName", width: 160, minWidth: 60, type: "string", align: "left" },		   
		{ display: "延迟时间", name: "delayDays", width: 160, minWidth: 60, type: "string", align: "left" },		   
		{ display: "更新时间", name: "updateDate", width: 160, minWidth: 60, type: "string", align: "left" } 
		],
		dataAction : 'server',
		url: web_app.name+'/planSetAction!slicedQueryPlanPrevious.ajax',
		parms: {
			planId: $('#taskId').val(),
			owningObjectId:owningObjectId
        }, 
        pageSize : 20,
		width : '100%',
		height : '70%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		enabledEdit: true,
		autoAddRowByKeydown:false,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			addHandler();
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
	
}

//刷新表格
function reloadGrid() {
	  /* $("#maintree").commonTree('refresh', lastSelectedId);*/
		var params = $("#queryMainForm").formToJSON(); 
		UICtrl.gridSearch(gridManager, params);
		UICtrl.gridSearch(gridManager_Document, params);
		UICtrl.gridSearch(gridManager_Guide, params);
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

//维护计划类型的成果信息
function addHandler() {

	 var taskId  = $('#taskId').val();
	 var owningObjectId = $('#owningObjectId').val();
	 if (taskId == '') {
	     Public.tip("请选择需要修改前置任务的计划!");
	     return;
	 }
 var params = {
     "parentId": 0,
     "taskId": taskId,
     "owningObjectId": owningObjectId
 };

 UICtrl.showFrameDialog({
     title: "选择前置计划",
     url: web_app.name + "/planSetAction!showSelectPlanPreviousDialog.do",
     param: params,
     width: 700,
     height: 400,
     ok: function () {
//			var _self=this,data = _self.iframe.contentWindow.allData;
         var _self = this, data = _self.iframe.contentWindow.gridManager.rows;
         if (!data)
             return;
         selectPrevious(taskId, owningObjectId,data);
         _self.close();
     }
 });
}

function selectPrevious(taskId, owningObjectId, nodes) {
 var previousTypeIds = [];
 var previousTypeNames = [];
 var previousPlanIds = [];
 var previousPlanNames = [];
 var delayDayss = [];
 var sequences = [];
 
 $.each(nodes, function (index, data) {
	 previousTypeIds.splice(0, 0, data.previousTypeId);
	 previousTypeNames.splice(0, 0, data.previousTypeName);
	 previousPlanIds.splice(0, 0, data.previousPlanId);
	 previousPlanNames.splice(0, 0, data.previousPlanName);
	 delayDayss.splice(0, 0, data.delayDays);
	 sequences.splice(0, 0, data.sequence);
 });

 var params = {};
 params.owningObjectId = owningObjectId;
 params.taskId = taskId;
 params.modifyDocument = true;
 params.previousTypeIds = $.toJSON(previousTypeIds);
 params.previousTypeNames = $.toJSON(previousTypeNames);
 params.previousPlanIds = $.toJSON(previousPlanIds);
 params.previousPlanNames = $.toJSON(previousPlanNames);
 params.delayDayss = $.toJSON(delayDayss);
 params.sequences = $.toJSON(sequences);
 
 Public.ajax("planSetAction!insertPlanPreviousList.ajax", params, function (data) {
		//重新加载成果信息
	 reloadGrid();
 });
}


//维护计划类型的成果信息
function addDocumentHandler() {
 var planId = $('#taskId').val();
 if (planId == '') {
     Public.tip("请选择需要修改成果的计划!");
     return;
 }

 var params = {
     "planId": planId
 };

 UICtrl.showFrameDialog({
     title: "选择对应成果",
     url: web_app.name + "/linkAction!showSelectDocumentDialog.do",
     param: params,
     width: 700,
     height: 400,
     ok: function () {
//			var _self=this,data = _self.iframe.contentWindow.allData;
         var _self = this, data = _self.iframe.contentWindow.gridManager.rows;
         if (!data)
             return;
         selectDocument(planId, data);
         _self.close();
     }
 });
}

function selectDocument(planId, nodes) {
 var documentTypeIds = [];
 var documentTypeNames = [];
 var documentVersions = [];

 $.each(nodes, function (index, data) {
 	documentTypeIds.splice(0, 0, data.documentTypeId);
 	documentTypeNames.splice(0, 0, data.name);
 	documentVersions.splice(0, 0, data.documentVersion);
 });

 var params = {};
 params.planId = planId;
 params.modifyDocument = true;
 params.documentTypeIds = $.toJSON(documentTypeIds);
 params.documentTypeNames = $.toJSON(documentTypeNames);
 params.documentVersions = $.toJSON(documentVersions);
 
 Public.ajax("linkAction!insertPlanTypeDocumentList.ajax", params, function (data) {
		//重新加载成果信息
 	reloadDocumentGrid();
 });
}



/*//启用
function enableDocumentHandler(){
	DataUtil.updateById({ action: 'linkAction!updatePlanTypeDocumentStatus.ajax',
		gridManager: gridManager_Document,idFieldName:'planTypeDocumentId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadDocumentGrid();
		}
	});		
}
//禁用
function disableDocumentHandler(){
	DataUtil.updateById({ action: 'linkAction!updatePlanTypeDocumentStatus.ajax',
		gridManager: gridManager_Document,idFieldName:'planTypeDocumentId',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadDocumentGrid();
		}
	});		
}*/





/**
* 维护计划类型的指引信息
*/
function addGuideHandler() {

	 var planId = $('#taskId').val();
	 if (planId == '') {
	     Public.tip("请选择需要修改指引的计划!");
	     return;
	 }

	 var params = {
	     "planId": planId
	 };
	 
	    var params = {
	        "parentId": 0,/*
	        "nodeKindIds": "subject",*/
	        "planId": planId
	    };

	    UICtrl.showFrameDialog({
	        title: "选择对应指引",
	        url: web_app.name + "/linkAction!showSelectGuideDialog.do",
	        param: params,
	        width: 700,
	        height: 400,
	        ok: function () {
//				var _self=this,data = _self.iframe.contentWindow.allData;
	            var _self = this, data = _self.iframe.contentWindow.gridManager.rows;
	            if (!data)
	                return;
	            selectGuide(planId, data);
	            _self.close();
	        }
	    });
	}

	function selectGuide(planId, nodes) {
	    var guideIds = [];
	    var guideNames = [];
	    var guideVersions = [];

	    $.each(nodes, function (index, data) {
	    	guideIds.splice(0, 0, data.guideId);
	    	guideNames.splice(0, 0, data.guideName);
	    	guideVersions.splice(0, 0, data.guideVersion);
	    });

	    var params = {};
	    params.planId = planId;
	    params.modifyGuide = true;
	    params.guideIds = $.toJSON(guideIds);
	    params.guideNames = $.toJSON(guideNames);
	    params.guideVersions = $.toJSON(guideVersions);
	    
	    Public.ajax("linkAction!insertPlanTypeGuideList.ajax", params, function (data) {
	    	reloadGuideGrid();
	    });
	}


/*//启用
function enableGuideHandler(){
	DataUtil.updateById({ action: 'linkAction!updatePlanTypeGuideStatus.ajax',
		gridManager: gridManager_Guide,idFieldName:'planTypeGuideId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGuideGrid();
		}
	});		
}
//禁用
function disableGuideHandler(){
	DataUtil.updateById({ action: 'linkAction!updatePlanTypeGuideStatus.ajax',
		gridManager: gridManager_Guide,idFieldName:'planTypeGuideId',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGuideGrid();
		}
	});	
	
	
}*/

//刷新表格
function reloadDocumentGrid() {
	gridManager_Document.loadData();
} 

//刷新表格
function reloadGuideGrid() {
	gridManager_Guide.loadData();
} 

/*//删除按钮
function deleteHandler(){
	var rows = gridManager.getSelectedRows();
	  if (!rows || rows.length == 0) {
	      Public.tip("请选择你要删除的前置任务！");
	      return;
	  }	
	
	DataUtil.del({action:'linkAction!deleteTemplatePlanPrevious.ajax',
		gridManager:gridManager,idFieldName:'templatePlanPreviousId',
		onCheck:function(data){
		},
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}
*/
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
	var action = "linkAction!updateTemplatePlanPreviousSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'templatePlanPreviousId', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}*/


