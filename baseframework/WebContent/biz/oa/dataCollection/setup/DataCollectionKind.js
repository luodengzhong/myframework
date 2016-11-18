var gridManager = null, groupGridManager = null;
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
		saveSortIDHandler: saveSortIDHandler,
		setField:{id:'setField',text:'字段设置',img:'page_dynamic.gif',click:setFieldHandler}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "名称", name: "name", width: 250, minWidth: 60, type: "string", align: "left" },		   
			{ display: "编码", name: "code", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return UICtrl.sequenceRender(item,'dataCollectionKindId');
				}
			},		   
			{ display: "描述", name: "description", width: 300, minWidth: 60, type: "string", align: "left" },
			{ display: "状态", name: "status", width: 60, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return UICtrl.getStatusInfo(item.status);
				} 
			}
		],
		dataAction : 'server',
		url: web_app.name+'/dataCollectionAction!slicedQueryDataCollectionKind.ajax',
		pageSize : 20,
		width : '99%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
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
	UICtrl.showAjaxDialog({url: web_app.name + '/dataCollectionAction!showInsertDataCollectionKind.load',title:'新增类别',width:600, ok: saveKind, init: initDetailPage});
}

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.dataCollectionKindId;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/dataCollectionAction!showUpdateDataCollectionKind.load', title:'编辑类别',param:{dataCollectionKindId:id},width:600, ok: saveKind, init: initDetailPage});
}
//编辑保存
function saveKind(){
	var detailData=DataUtil.getGridData({gridManager:groupGridManager,idFieldName:'kindFieldGroupId'});
	if(!detailData) return false;
	var _self=this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/dataCollectionAction!saveDataCollectionKind.ajax',
		param:{detailData:encodeURI($.toJSON(detailData))},
		success : function() {
			_self.close();
			reloadGrid();
		}
	});
}
function initDetailPage(){
	var dataCollectionKindId=$('#detailDataCollectionKindId').val();
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function(){
			UICtrl.addGridRow(groupGridManager);
		}, 
		deleteHandler: function(){}
	});
	groupGridManager = UICtrl.grid('#detailGroupgrid', {
		columns: [
		{ display: "分组名称", name: "groupName", width:400, minWidth: 60, type: "string", align: "left",
			editor: { type:'text',required: true}
		},		   
		{ display: "序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left",
			editor: { type:'spinner',min:1,max:100,mask:'nnn'}
		}	
		],
		dataAction : 'server',
		url: web_app.name+'/dataCollectionAction!slicedQueryDataCollectionFieldGroup.ajax',
		parms:{dataCollectionKindId:dataCollectionKindId},
		width : '99%',
		sortName:'sequence',
		sortOrder:'asc',
		height : 280,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		enabledEdit: true,
		usePager: false,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return !($('#detailDataCollectionKindId').val()=='');
		}
	});
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/dataCollectionAction!deleteDataCollectionKind.ajax', {dataCollectionKindId:row.dataCollectionKindId}, function(){
			reloadGrid();
		});
	});
}

//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "dataCollectionAction!updateDataCollectionKindSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'dataCollectionKindId', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'dataCollectionAction!updateDataCollectionKindStatus.ajax',
		gridManager: gridManager,idFieldName:'dataCollectionKindId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'dataCollectionAction!updateDataCollectionKindStatus.ajax',
		gridManager: gridManager,idFieldName:'dataCollectionKindId',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//字段设置
function setFieldHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择类别！'); return; }
	var id=row.dataCollectionKindId,name=row.name;
	var url=web_app.name + '/dataCollectionAction!forwardListDataCollectionFieldDefin.do?dataCollectionKindId='+id;
	parent.addTabItem({ tabid: 'dataCollectionFieldHandler'+id, text:name+'字段设置 ', url:url});
}
