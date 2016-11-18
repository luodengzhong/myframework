var gridManager=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	queryGridColumns();
});

function initializeUI(){
    //初始化条件下拉框
	$('input.selectField').each(function(){
		var name=$(this).attr('name');
		var obj=$('#'+name+'DataSource');
		if(obj.length>0){
			$(this).combox({data:obj.combox('getFormattedData'),checkbox:true});
		}
	});
	setTimeout(function(){
		if(Public.isReadOnly){
			UICtrl.setEditable($('#queryDiv'));
		}
	},0);
}
//查询列表表头
function queryGridColumns(){
	var dataCollectionKindId=$('#mainDataCollectionKindId').val();
    Public.ajax(web_app.name + '/dataCollectionAction!loadListShowFields.ajax', {dataCollectionKindId:dataCollectionKindId}, function(data) {
		var gridColumns=new Array();
		var type=null,align=null,fieldType=null;
		$.each(data,function(i,o){
			fieldType=o['fieldType'];
			align="left";
			if(fieldType=='NUMBER'){
				type="string";
				align="right";
			}else if(fieldType=='DATE'){
				type="date";
			}else {
				type="string";
			}
			var filed={
				display:o['displayName'],
				name: o['viewName'],
				width:o['showWidth']||100,
				minWidth: 60,
				type:type,
				align:align,
				sortField:o['fieldName'].toLowerCase()
			};
			gridColumns.push(filed);
		});
		initializeGrid(gridColumns);
	});
}

function queryForm(obj){
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}
//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 
function resetForm(obj){
	$(obj).formClean();
}

function initializeGrid(gridColumns) {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		viewHandler: viewHandler, 
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns:gridColumns,
		dataAction : 'server',
		url: web_app.name+'/dataCollectionAction!slicedQueryDataCollection.ajax',
		parms:{dataCollectionKindId:$('#mainDataCollectionKindId').val()},
		pageSize : 10,
		width : '99.5%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return !($('#mainDataCollectionKindId').val()=='');
		},
		onDblClickRow : function(data, rowindex, rowobj) {
			if($('#toolbar_menuUpdate').length>0){//存在编辑按钮
				updateHandler(data.dataCollectionId);
			}else{
				viewHandler(data.dataCollectionId);
			}
		}
	});
}
function addHandler(){
	var dataCollectionKindId=$('#mainDataCollectionKindId').val();
	var dataCollectionKindName=$('#mainDataCollectionKindName').val();
	var url=web_app.name + '/dataCollectionAction!showInsertDataCollection.job?useRightHandlerPage=0&dataCollectionKindId='+dataCollectionKindId;
	parent.addTabItem({ tabid: 'dataCollectionInsert'+dataCollectionKindId, text:'新增'+dataCollectionKindName, url:url});
}
function viewHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var dataCollectionId=row.dataCollectionId;
	var dataCollectionKindId=$('#mainDataCollectionKindId').val();
	var dataCollectionKindName=$('#mainDataCollectionKindName').val();
	var url=web_app.name + '/dataCollectionAction!showUpdateDataCollection.do?isReadOnly=true&dataCollectionKindId='+dataCollectionKindId+'&dataCollectionId='+dataCollectionId;
	parent.addTabItem({ tabid: 'dataCollectionView'+dataCollectionId, text:'查看'+dataCollectionKindName, url:url});
}

function updateHandler(dataCollectionId){
	if(!dataCollectionId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		dataCollectionId=row.dataCollectionId;
	}
	var dataCollectionKindId=$('#mainDataCollectionKindId').val();
	var dataCollectionKindName=$('#mainDataCollectionKindName').val();
	var url=web_app.name + '/dataCollectionAction!showUpdateDataCollection.job?useRightHandlerPage=0&dataCollectionKindId='+dataCollectionKindId+'&dataCollectionId='+dataCollectionId;
	parent.addTabItem({ tabid: 'dataCollectionUpdate'+dataCollectionId, text:'编辑'+dataCollectionKindName, url:url});
}
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var dataCollectionId=row.dataCollectionId;
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/dataCollectionAction!deleteDataCollection.ajax', {dataCollectionId:dataCollectionId}, function(){
			reloadGrid();
		});
	});
}