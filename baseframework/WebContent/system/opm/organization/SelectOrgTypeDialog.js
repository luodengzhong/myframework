var gridManager, orgKindId, isMultipleSelect, folderId;
$(function() {
	getQueryParameters();
	initializeUI();
	bindEvents();
	loadFolderTree({
		kindId : getCommonTreeKindId(),
		onClick : onFolderTreeNodeClick,
		IsShowMenu : true
	});
	
	initializeGrid();
	$('.l-layout-header-inner').html(getTabCaption() + "树");	
	
	function getQueryParameters() {
		orgKindId = $("#orgKindId").val();
		isMultipleSelect = $("#isMultipleSelect").val();
	}

	function initializeUI() {
		UICtrl.layout("#orgTypeLayout", {
			leftWidth : 200,
			heightDiff : -5
		});
		
		$('.l-layout-center .l-layout-header').html(getTabCaption() + "列表");
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
		
		gridManager = UICtrl.grid("#orgTypeGrid", {
			columns : [{ display : "编码", name : "code", width : "100", minWidth : 60, type : "string", align : "left" },
						{ display : "名称", name : "name", width : "100", minWidth : 60, type : "string", align : "left" },
						{ display : "排序号", name : "sequence", width : "60", minWidth : 60, type : "string", align : "left" }, 
						{ display : "状态", name : "status", width : "60", minWidth : 60, type : "string", align : "center",
							render : function(item) {
								return "<div class='" + (item.status ? "Yes" : "No" ) + "'/>";							
							}
						}],
			dataAction : "server",
			url : web_app.name + '/orgTypeAction!slicedQueryOrgTypes.ajax',
			parms : {
				folderId: 0,
				orgKindId: orgKindId,
				code : "",
				name : ""
			},
			pageSize : 20,
			sortName: "sequence",
			sortOrder: "asc",
			width : "100%",
			height : "100%",
			heightDiff : -7,
			headerRowHeight : 25,
			rowHeight : 25,
			checkbox : true,
			fixedCellHeight : true,
			selectRowButtonOnly : true
		});

		UICtrl.setSearchAreaToggle(gridManager, false);
	}
});

function onFolderTreeNodeClick(node) {
	if (folderId != node.data.id) {
		if (!node.data.parentId) {
			$('.l-layout-center .l-layout-header').html(getTabCaption() + "列表");
			folderId = 0;
		} else {
			$('.l-layout-center .l-layout-header').html(
					"<font style=\"color:Tomato;font-size:13px;\">["
							+ node.data.name + "]</font>" + getTabCaption()
							+ "列表");
			folderId = node.data.id;
		}
		reloadGrid();
	}
}

function refreshFolderTree() {
	loadFolderTree({
		kindId : getCommonTreeKindId(),
		onClick : onFolderTreeNodeClick
	});
}

function reloadGrid() {
	UICtrl.gridSearch(gridManager,{ folderId:folderId });
}

function getTabCaption() {
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

function getOrgTypeData(){
	var data = gridManager.getSelecteds();
    if (!data || data.length == 0) {
        Public.tip("请选择数据.");
        return;
    }

    if (isMultipleSelect == "false" && data.length > 1) {
    	Public.tip('请选择一条数据!');
        return;
    }
    return data;
}