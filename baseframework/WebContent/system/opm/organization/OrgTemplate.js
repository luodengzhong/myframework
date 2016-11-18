var treeManager, gridManager, parentId = 0, refreshFlag = false, toolbar;

$(function() {
	bindEvents();
	loadOrgTemplateTreeView();
	initializeGrid();
	InitializeUI();
	initializeToolButtons();

	function bindEvents() {
		$("#btnQuery").click(function() {
			var params = $(this.form).formToJSON();
			UICtrl.gridSearch(gridManager, params);
		});

		$("#btnReset").click(function() {
			$(this.form).formClean();
		});
	}
	
	function initializeToolButtons(){
		toolbar.setDisabled("addDept");
		toolbar.setDisabled("addPosition");
	}
	
	function initializeGrid() {
		UICtrl.autoSetWrapperDivHeight();
		var url = web_app.name + '/themes/default/images/icons/';
		var toolbarOptions = {
			items : [
			         { id : "addOrg", text : "添加机构", click : addOrgTemplate,  img : url + "page_new.gif" }, 
			         { id : "addDept", text : "添加部门", click : addOrgTemplate,  img : url + "page_new.gif" },
			         { id : "addPosition", text : "添加岗位", click : addOrgTemplate,  img : url + "page_new.gif" }, 
			         { id : "orgLine", line : true },
			         { id : "delete", text : "删除", click : deleteOrgTemplate, img : url + "page_delete.gif" },
			         { id : "deleteLine", line : true },
			         {id: "saveSequence", text : '保存排序号',click : updateOrgTemplateSequence, img : url + "save.gif" },
			         { line : true } 
			]
		};

		gridManager = UICtrl.grid("#maingrid", {
			columns : [
					{ display : "编码", name : "code", width : "100", minWidth : 60, type : "string", align : "left" },
					{ display : "名称", name : "name", width : "100", minWidth : 60, type : "string", align : "left" },
					{ display : "排序号", name : "sequence", width : "60", minWidth : 60, type : "string", align : "left",
						render : function(item) {
							return "<input type='text' id='txtSequence_" + item.id  + "' class='textbox' value='" + item.sequence + "' />";
						}
					} ],
			dataAction : "server",
			url : web_app.name + '/orgTemplateAction!queryOrgTemplates.ajax',
			parms : {
				parentId : 0
			},
			usePager: false,
			sortName: "sequence", sortOrder: "asc",
			toolbar : toolbarOptions,
			width : "99.8%",  height : "100%",	heightDiff : -13, headerRowHeight : 25, rowHeight : 25,
			checkbox : true, fixedCellHeight : true, selectRowButtonOnly : true
		});
		toolbar = gridManager.toolbarManager;
		UICtrl.setSearchAreaToggle(gridManager);
	}

	function InitializeUI() {
		UICtrl.initDefaulLayout();
	}

	function addOrgTemplate(item) {
		var kindId = "";
		switch (item.id) {
		case "addOrg":
			kindId = "ogn";
			break;
		case "addDept":
			kindId = "dpt";
			break;
		case "addPosition":
			kindId = "pos";
			break;
		}
		var params = { orgKindId: kindId, confirmHandler: doSaveOrgTemplate, closeHandler: onDialogCloseHandler, isMultipleSelect: "true" };
		OpmUtil. showSelectOrgTypeDialog(params);
	}

	function deleteOrgTemplate() {
		var action = "orgTemplateAction!deleteOrgTemplate.ajax";
		DataUtil.del({ action : action,  gridManager : gridManager, onSuccess : reloadGrid });
	}
});

function hideToolButtons(){
	toolbar.setDisabled("addOrg");
	toolbar.setDisabled("addDept");
	toolbar.setDisabled("addPosition");
	toolbar.setDisabled("delete");
	toolbar.setDisabled("saveSequence");
}

function loadOrgTemplateTreeView() {
	if (treeManager)
		treeManager.clear();
	Public.ajax(web_app.name + "/orgTemplateAction!queryOrgTemplates.ajax", {
		parentId : 0
	}, function(data) {
		treeManager = UICtrl.tree("#maintree", {
			data : data.Rows,
			idFieldName : "id",
			parentIDFieldName : "parentId",
			textFieldName : "name",
			checkbox : false,
			iconFieldName : "icon",
			btnClickToToggleOnly : true,
			nodeWidth : 180,
			isLeaf : function(data) {
				data.children = [];
				data.icon = OpmUtil.getOrgImgUrl (data.orgKindId, true);
				return data.hasChildren==0;
			},
			onBeforeExpand : onBeforeExpand,
			onClick : function(node) {
				if (!node || !node.data)
					return;
				if (parentId != node.data.id) {
					var caption = "机构模板列表";
					if (node.data.parentId == 0) {
						$('.l-layout-center .l-layout-header').html(caption);
					} else {
						$('.l-layout-center .l-layout-header').html(
										"<font style=\"color:Tomato;font-size:13px;\">["
												+ node.data.name + "]</font>"
												+ caption);
					}
					parentId = node.data.id;
					parentOrgKindId = node.data.orgKindId;

					gridManager.options.parms.parentId = parentId;
					gridManager.options.newPage = 1;
					
					hideToolButtons();
					switch (parentOrgKindId) {
					case "root":
						toolbar.setEnabled("addOrg");
						toolbar.setEnabled("delete");
						toolbar.setEnabled("saveSequence");
						break;
					case "ogn":
						toolbar.setEnabled("addOrg");
						toolbar.setEnabled("addDept");
						toolbar.setEnabled("delete");
						toolbar.setEnabled("saveSequence");
						break;
					case "dpt":
						toolbar.setEnabled("addDept");
						toolbar.setEnabled("addPosition");
						toolbar.setEnabled("delete");
						toolbar.setEnabled("saveSequence");
					case "pos":
						break;
					}
					reloadGrid2();
				}
			}
		});
	});
}

function doSaveOrgTemplate() {
	var data = this.iframe.contentWindow.getOrgTypeData();
	if (!data)
		return;
	
	var orgTypeIds = new Array();
	for (var i = 0; i < data.length; i++) {
		orgTypeIds[i] = data[i].id;
	}
	
	var _self = this;

	var params = {};
	params.parentId = parentId;
	params.orgTypeIds = $.toJSON(orgTypeIds);
	Public.ajax(web_app.name + "/orgTemplateAction!insertOrgTemplate.ajax",
			params, function() {
				refreshFlag = true;
				//_self.close();
			});
}

function onDialogCloseHandler() {
	if (refreshFlag) {
		reloadGrid();
		refreshFlag = false;
	}
}

function updateOrgTemplateSequence() {
	var action = "orgTemplateAction!updateOrgTemplateSequence.ajax";
	DataUtil.updateSequence({action: action,  gridManager: gridManager, onSuccess: reloadGrid});
}

function reloadGrid() {
	refreshNode();
	reloadGrid2();
}

function reloadGrid2() {
	var params = $(this.form).formToJSON();
	UICtrl.gridSearch(gridManager, params);
}

function onBeforeExpand(node) {
	if (node.data.hasChildren) {
		if (!node.data.children || node.data.children.length == 0) {
			Public.ajax(web_app + "/orgTemplateAction!queryOrgTemplates.ajax",
					{
						parentId : node.data.id
					}, function(data) {
						treeManager.append(node.target, data.Rows);
					});
		}
	}
}

function refreshNode(pNodeData) {
	var parentData;
	if (pNodeData)
		parentData = pNodeData;
	else
		parentData = treeManager.getDataByID(parentId);
	if (parentData) {
		if (parentData.children && parentData.children.length > 0) {
			for (var i = 0; i < parentData.children.length; i++) {
				treeManager.remove(parentData.children[i].treedataindex);
			}
		}
		Public.ajax(web_app.name + "/orgTemplateAction!queryOrgTemplates.ajax",
				{
					parentId : parentData.id
				}, function(data) {
					if (!data.Rows || data.Rows.length == 0) {
						var pn = treeManager.getParent(parentData.treedataindex);
						if (pn)
							refreshNode(pn);
					} else {
						treeManager.append(parentData, data.Rows);
					}
				});
	}
}