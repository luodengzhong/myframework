var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		kindId : CommonTreeKind.PaIndexType,
		onClick : onFolderTreeNodeClick
	});
}

function  onFolderTreeNodeClick(data,folderId){
	var html=[],parentId=folderId;
	if(folderId==CommonTreeKind.PaIndexType){
		parentId="";
		html.push('绩效考评指标库');
	}else{
		html.push('<font style="color:Tomato;font-size:13px;">[',data.name,']</font>绩效考评指标库');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#treeParentId').val(parentId);
	if (gridManager) {
		UICtrl.gridSearch(gridManager,{parentId:parentId});
	}
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler,
		saveSortIDHandler: saveSortIDHandler
		
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "主项目", name: "mainContent", width: 100, minWidth: 60, type: "string", align: "left" },	
			{ display: "指标名称", name: "partContent", width: 150, minWidth: 60, type: "string", align: "left" },	
			{ display: "序号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "center",
				 render: function (item) { 
				     return "<input type='text' id='txtSequence_" + item.indexId + "' class='textbox' value='" + item.sequence + "' />";
	       	   } 
			},
			{ display: "指标要求", name: "desption", width: 600, minWidth: 60, type: "string", align: "left" }	   
		],
		dataAction : 'server',
		url: web_app.name+'/performassessAction!slicedQueryPerformAssessIndex.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 30,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.indexId);
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
	var parentId=$('#treeParentId').val();
	if(parentId==''){
		Public.tip('请选择指标库类别！');
		return false ;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/performassessAction!showInsertPerformAssessIndex.load', 
		param:{parentId:parentId},
		ok: insert, 
		width:400,
		title:"新增考核指标",
		close: dialogClose});
}

//编辑按钮
function updateHandler(indexId){
	if(!indexId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		indexId=row.indexId;
	}
	//所需参数需要自己提取 {id:row.id}
	UICtrl.showAjaxDialog({url: web_app.name + '/performassessAction!showUpdatePerformAssessIndex.load', 
		param:{indexId:indexId}, 
		width:400,
		title:"修改考核指标",
		ok: update, close: dialogClose});
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/performassessAction!deletePerformAssessIndex.ajax',
			{indexId:row.indexId}, 
			function(){
			reloadGrid();
		});
	});
}

//新增保存
function insert() {
	var indexId=$('#indexId').val();
	if(indexId!='') return update();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/performassessAction!insertPerformAssessIndex.ajax',
		param:{parentId:$('#treeParentId').val()},
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			$('#indexId').val(data);
			refreshFlag = true;
		}
	});
}

   //保存排序号
function saveSortIDHandler(){
	var action = "performassessAction!updatePerformAssessIndexSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'indexId', onSuccess: function(){
		reloadGrid();
	}});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/performassessAction!updatePerformAssessIndex.ajax',
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
