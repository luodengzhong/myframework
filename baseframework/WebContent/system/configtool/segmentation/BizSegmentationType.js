var gridManager, refreshFlag, operateCfg = {};

$(function() {
	bindEvents();
	initializeOperateCfg();
	initializeGrid();
	initializeUI();
	
	function initializeOperateCfg(){
		var  path = web_app.name + '/segmentationAction!';
		operateCfg.queryAction = path +'slicedQueryBizSegmentationTypes.ajax';		
		operateCfg.showInsertAction = path +'showInsertBizSegmentationType.load';
		operateCfg.showUpdateAction = path +'showUpdateBizSegmentationType.load';		
		operateCfg.insertAction = path +'insertBizSegmentationType.ajax';
		operateCfg.updateAction = path +'updateBizSegmentationType.ajax';	
		operateCfg.deleteAction = path +'deleteBizSegmentationType.ajax';	
		operateCfg.updateSequenceAction = path +'updateBizSegmentationTypeSequence.ajax';	
		operateCfg.moveAction = path +'updateBizSegmentationTypeFolderId.ajax';	
		
		operateCfg.insertTitle = "添加业务段类别";
		operateCfg.updateTitle = "修改业务段类别";
	}

	function bindEvents() {
		$("#btnQuery").click(function() {
			var params = $(this.form).formToJSON();
			UICtrl.gridSearch(gridManager, params);
		});
		$("#btnReset").click(function() {
			$(this.form).formClean();
		});
	}
	
	function initializeGrid() {
		UICtrl.autoSetWrapperDivHeight();
		var toolbarparam = { addHandler : showInsertDialog, updateHandler : showUpdateDialog, deleteHandler : deleteBizSegmentationType, saveSortIDHandler : updateBizSegmentationTypeSequence,moveHandler:moveHandler};
		var toolbarOptions = UICtrl.getDefaultToolbarOptions(toolbarparam);
		
		gridManager = UICtrl.grid("#maingrid", {
			columns : [
					{ display : "编码", name : "code", width : 200, minWidth : 60, type : "string", align : "left" },
					{ display : "名称", name : "name", width : 200, minWidth : 60, type : "string", align : "left" },
					{ display: "类别", name: "kindId", width: 160, minWidth: 60, type: "string", align: "left",
						render:function(item){
							return item.kindId == 0 ? '系统' : '自定义';
						}},
					{ display : "排序号", name : "sequence", width : "60", minWidth : 60, type : "string", align : "left",
						render : function(item) {
							return "<input type='text' id='txtSequence_"
									+ item.bizSegmentationTypeId + "' class='textbox' value='"
									+ item.sequence + "' />";
						}
					}
					],
			dataAction : "server",
			url : operateCfg.queryAction,
			pageSize : 20,
			toolbar : toolbarOptions,
			width : "100%",
			height : "100%",
			sortName: "sequence",
			sortOrder: "asc",
			heightDiff : -10,
			headerRowHeight : 25,
			rowHeight : 25,
			checkbox : true,
			fixedCellHeight : true,
			selectRowButtonOnly : true,
			onDblClickRow : function(data, rowIndex, rowObj) {
				doShowUpdateDialog(data.bizSegmentationTypeId);
			}
		});
		UICtrl.setSearchAreaToggle(gridManager);
	}
	function initializeUI(){
		UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
		$('#maintree').commonTree({
			kindId : CommonTreeKind.BizSegmentationType,
			onClick : onFolderTreeNodeClick
		});
	}
});
function onFolderTreeNodeClick(data,folderId) {
	var html=[];
	if(folderId==CommonTreeKind.BizSegmentationType){
		folderId="";
		html.push('业务段类别列表');
	}else{
		html.push('<font style="color:Tomato;font-size:13px;">[',data.name,']</font>业务段类别列');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#treeFolderId').val(folderId);
	if (gridManager) {
		UICtrl.gridSearch(gridManager,{folderId:folderId});
	}
}
function getId() {
	return parseInt($("#bizSegmentationTypeId").val() || 0);
}

function showInsertDialog() {
	var folderId=$('#treeFolderId').val();
	if(!folderId || folderId == CommonTreeKind.BizSegmentationType ){
		Public.tip('请选择类别树！'); 
		return;
	}
	UICtrl.showAjaxDialog({
		title : operateCfg.insertTitle,
		width : 340,
		param : {
			folderId : folderId
		},
		url : operateCfg.showInsertAction,
		ok : doSaveBizSegmentationType,
		close : onDialogCloseHandler
	});
}

function doShowUpdateDialog(id){
	UICtrl.showAjaxDialog({
		url : operateCfg.showUpdateAction,
		param : {
			bizSegmentationTypeId : id
		},
		title : operateCfg.updateTitle,
		width : 340,
		ok : doSaveBizSegmentationType,
		close : onDialogCloseHandler
	});
}

function showUpdateDialog() {
	var row = gridManager.getSelectedRow();
	if (!row) {
		Public.tip("请选择数据！");
		return;
	}
	doShowUpdateDialog(row.bizSegmentationTypeId);
}

function doSaveBizSegmentationType() {
	var _self = this;
	var id = getId();	
	var param={};
	if(!id){//新增时加入目录ID
		param.folderId = $('#treeFolderId').val();
	}
	$('#submitForm').ajaxSubmit({
		url : web_app.name + (id ? operateCfg.updateAction : operateCfg.insertAction),
		param:param,
		success : function() {
			refreshFlag = true;
			_self.close();
		}
	});
}

function deleteBizSegmentationType() {
	DataUtil.del({ action:operateCfg.deleteAction, gridManager: gridManager,  idFieldName:  getIdFieldName(), onSuccess: reloadGrid });
}

function updateBizSegmentationTypeSequence() {	
	DataUtil.updateSequence({ action: operateCfg.updateSequenceAction, gridManager: gridManager,  idFieldName:  getIdFieldName(), onSuccess: reloadGrid });
}

function reloadGrid() {
	var params = $("#queryMainForm").formToJSON();
	UICtrl.gridSearch(gridManager, params);
}

function onDialogCloseHandler() {
	if (refreshFlag) {
		reloadGrid();
		refreshFlag = false;
	}
}

function getIdFieldName(){
	return "bizSegmentationTypeId";
}

//移动
function moveHandler(){
	UICtrl.showMoveTreeDialog({
		gridManager:gridManager,title:'移动业务段类别', kindId: CommonTreeKind.BizSegmentationType,
		save:function(parentId){
			DataUtil.updateById({action: operateCfg.moveAction,
				gridManager: gridManager,  idFieldName:  getIdFieldName(), param: {folderId:parentId},
				onSuccess:function(){
					reloadGrid();
				}
			});
		}
	});
}