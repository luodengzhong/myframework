var treeManager, gridManager, parentId = 0, refreshFlag = false, lastSelectedId = 0;
$(function() {
	bindEvents();
	loadOrgTemplateTreeView();
	InitializeUI();
	initializeGrid();	

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
		gridManager = UICtrl.grid("#maingrid", {
			columns : [
					{ display : "编码", name : "code", width : "100", minWidth : 60, type : "string", align : "left" },
					{ display : "名称", name : "name", width : "100", minWidth : 60, type : "string", align : "left" },
					{ display : "排序号", name : "sequence", width : "60", minWidth : 60, type : "string", align : "left"}
					],
			dataAction : "server",
			url : web_app.name + '/orgTemplateAction!queryOrgTemplates.ajax',
			parms : {
				parentId : 0
			},
			pageSize : 20,
			width : "99.9%",
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

	function InitializeUI() {
		$('html').addClass("html-body-overflow");
		$("#layout").ligerLayout({ leftWidth : 200,  heightDiff : -5 });
	}
});

function loadOrgTemplateTreeView() {
	$('#maintree').commonTree(	{	
				loadTreesAction : "/orgTemplateAction!queryOrgTemplates.ajax",
				isLeaf : function(data) {					
					data.nodeIcon = OpmUtil.getOrgImgUrl (data.orgKindId, true, false);
					return data.hasChildren == 0;
				},
				onClick : function(data) {
					if (data && lastSelectedId != data.id) {
						lastSelectedId = data.id;
						reloadGrid();
					}
				},
				IsShowMenu : false
			});
}

function reloadGrid() {
	var params = {parentId: lastSelectedId};
	UICtrl.gridSearch(gridManager, params);
}

function getOrgTemplateData(){
	var data = gridManager.getSelecteds();
    if (!data || data.length == 0) {
        Public.tip("请选择数据.");
        return;
    }

    if (data.length > 1) {
    	Public.tip('请选择一条数据!');
        return;
    }
    return data;
}