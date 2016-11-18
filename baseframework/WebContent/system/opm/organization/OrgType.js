var gridManager, orgKindId, folderId = 0, refreshFlag, moveDialog, closeDetail;

$(function() {
	getQueryParameters();
	bindEvents();
	initializeUI();
	initializeTree();
	initializeGrid();

	function getQueryParameters() {
		orgKindId = Public.getQueryStringByName("OrgKindId");
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
	
	function initializeUI() {
		UICtrl.initDefaulLayout();
		$('.l-layout-header-inner').html(getTabCaption() + "树");
		$('.l-layout-center .l-layout-header').html(getTabCaption() + "列表");
	}

	function initializeTree(){
		$('#orgTypeTree').commonTree(
				{	
					loadTreesAction : "/configurationAction!loadCommonTrees.ajax",
					kindId: getCommonTreeKindId(),
					onClick : function(data) {
						onFolderTreeNodeClick(data);
					},
					IsShowMenu : true
				});
	}
	
	function initializeGrid() {
		UICtrl.autoSetWrapperDivHeight();
		var toolbarParam = { addHandler : showInsertDialog, updateHandler : showUpdateDialog, deleteHandler : deleteOrgType, saveSortIDHandler : updateOrgTypeSequence,
			moveHandler : moveOrgType
		};
		var toolbarOptions = UICtrl.getDefaultToolbarOptions(toolbarParam);
		
		gridManager = UICtrl.grid("#maingrid", {
			columns : [
					{ display : "编码", name: "code", width : 100, minWidth : 60, type : "string", align : "left" },
					{ display : "名称", name: "name", width : 200, minWidth : 60, type : "string", align : "left" },
					{ display : "排序号", name: "sequence", width : 60, minWidth : 60, type : "string", align : "left",
						render : function(item) {
							return "<input type='text' id='txtSequence_" + item.id + "' class='textbox' value='" + item.sequence + "' />";
						}
					}, 
					{ display : "状态", name : "status", width : 60, minWidth : 60, type : "string", align : "center",
						render : function(item) {
							return "<div class='" + (item.status ? "Yes" : "No" ) + "'/>";							
						}
					} ],
			dataAction : "server",
			url : web_app.name + '/orgTypeAction!slicedQueryOrgTypes.ajax',
			parms : {
				folderId: folderId,
				orgKindId: orgKindId,
				code : "",
				name : ""	
			},
			pageSize : 20,
			sortName: 'sequence',
			sortOrder: 'asc',
			toolbar : toolbarOptions,
			width : "99.8%",
			height : "100%",
			heightDiff : -10,
			headerRowHeight : 25,
			rowHeight : 25,
			checkbox : true,
			fixedCellHeight : true,
			selectRowButtonOnly : true,
			onDblClickRow : function(data, rowIndex, rowObj) {
				doShowUpdateDialog(data.id);
			}
		});
		UICtrl.setSearchAreaToggle(gridManager, false);
	}
});

function onEditNameBlur(){
	var code = $.chineseLetter($("#editName").val());
	var oldCode = $("#editCode").val();
	if (!oldCode){
		$("#editCode").val(code);
	}
}

function getId() {
	return parseInt($("#editId").val() || 0);
}

function getSequence(){
	return  parseInt($("#editSequence").val() || 0);
}

var addedButton = [{
	id : 'saveInsert',
	name : '保存新增',
	callback : saveInsert
}];

function initDetail(){
	$("#editId").val("");
	$("#editCode").val("");
	$("#editName").val("");
	$("#editSequence").val(getSequence() + 1);
}

function saveInsert(){
	closeDetail = false;
	doSaveOrgType();
	return false;
}

function getTitle(addOrUpdate){
	var result = (addOrUpdate == "add") ? "添加" : "修改";
	switch(orgKindId){
	case "ogn":
		result += "机构类型"; 
		break;
	case "dpt":
		result += "部门类型"; 
		break;
	case "pos":
		result += "岗位类型"; 
		break;
	}
	return result;
}

function showInsertDialog() {
	if (!folderId || folderId == 0) {
		Public.tip("请选择父节点!");
		return;
	}
	
	UICtrl.showAjaxDialog({
		title : getTitle("add"),
		param: { folderId: folderId, orgKindId: orgKindId },
		width : 400,
		url : web_app.name + '/orgTypeAction!showOrgTypeDetail.load',
		ok : saveOrgType,
		close : onDialogCloseHandler,
		button: addedButton
	});
}

function doShowUpdateDialog(id){
	UICtrl.showAjaxDialog({
		url : web_app.name + '/orgTypeAction!loadOrgType.load',
		param : {
			id : id
		},
		title : getTitle("update"),
		width : 400,
		ok : doSaveOrgType,
		close : onDialogCloseHandler
	});
}

function showUpdateDialog() {
	var row = gridManager.getSelectedRow();
	if (!row) {
		Public.tip("请选择数据！");
		return;
	}
	doShowUpdateDialog(row.id);
}

function saveOrgType(){
	closeDetail = true;
	doSaveOrgType();
}

function doSaveOrgType() {
	var _self = this;
	var id = getId();
	$('#submitForm').ajaxSubmit({
				url : web_app.name + (id ? '/orgTypeAction!updateOrgType.ajax' : '/orgTypeAction!insertOrgType.ajax'),
				success : function() {
					refreshFlag = true;
					if (closeDetail){
					   _self.close();
					}
					else{
						initDetail();
					}
				}
			});
}

function deleteOrgType() {
	var action = "orgTypeAction!deleteOrgType.ajax";
	DataUtil.del({ action: action, gridManager: gridManager, onSuccess: reloadGrid });
}

function updateOrgTypeSequence() {
	var action = "orgTypeAction!updateOrgTypeSequence.ajax";
	DataUtil.updateSequence({ action: action, gridManager: gridManager,  onSuccess: reloadGrid });
}

function moveOrgType() {
	var rows = gridManager.getSelecteds();
	if (!rows || rows.length < 1) {
		Public.tip('请选择要移动的数据!');
		return;
	}
	
	if(!moveDialog){
		moveDialog=UICtrl.showDialog({title:'移动组织', width:300,
			content:'<div style="overflow-x: hidden; overflow-y: auto; width: 290px; height:250px;"><ul id="movetree"></ul></div>',
			init: function(){
				$('#movetree').commonTree({
					kindId : getCommonTreeKindId,
					IsShowMenu : false
				});
			},
			ok: doMoveOrgType,
			close: function () {
				reloadGrid();
		        this.hide();
		        return false;
		    }
		});
	}else{
		$('#movetree').commonTree('refresh');
		moveDialog.show().zindex();
	}
}

function onFolderTreeNodeClick(data) {
	if (folderId != data.id) {
		if (!data.parentId) {
			$('.l-layout-center .l-layout-header').html(getTabCaption() + "列表");
			folderId = 0;
		} else {
			$('.l-layout-center .l-layout-header').html(
					"<font style=\"color:Tomato;font-size:13px;\">["
							+ data.name + "]</font>" + getTabCaption()
							+ "列表");
			folderId = data.id;
		}
		reloadGrid();
	}
}


function reloadGrid() {
	UICtrl.gridSearch(gridManager, { folderId: folderId });
}

function getTabCaption(action) {
	var result;
	switch (orgKindId) {
	case "ogn":
		result = "机构类型";
		break;
	case "dpt":
		result = "部门类型";
		break;
	case "pos":
		result = "岗位类型";
		break;
	case "prj":
		result = "项目组类型";
	default:
		result = "";
	}
	switch (action) {
	case "Add":
		result = "添加" + result;
		break;
	case "Update":
		result = "修改" + result;
		break;
	}
	return result;
}

function getCommonTreeKindId() {
	switch (orgKindId) {
	case "ogn":
		result = 1;
		break;
	case "dpt":
		result = 2;
		break;
	case "pos":
		result = 3;
		break;
	case "prj":
		result = 4;
		break;
	default:
		result = -1;
	}
	return result;
}

function onDialogCloseHandler() {
	if (refreshFlag) {
		reloadGrid();
		refreshFlag = false;
	}
}

function doMoveOrgType() {
	var parentId = $('#movetree').commonTree('getSelectedId');
	
	if (!parentId || parentId== getCommonTreeKindId()){
		Public.tip("不能移动到根节点！");
	}
	
	if(parentId == folderId){
		Public.tip("移动的源节点和目标节点相同！");
		return;
	}
	
	var ids = DataUtil.getSelectedIds({ gridManager: gridManager });
	if(!ids) return;	
	
	var _self = this;
	var params = {};
	params.folderId = parentId;
	params.ids = $.toJSON(ids);
	Public.ajax(web_app.name + "/orgTypeAction!moveOrgType.ajax",
			params, function() {
				refreshFlag = true;
				_self.close();
			});
}