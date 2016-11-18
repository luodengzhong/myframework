/**
 * 项目基础框架工具类
 */
function PAUtil() {
}

PAUtil.dialogWidth = 850;
PAUtil.dialogHeight = 450;

function EProjectNodeTimeOutStatus() {
}

EProjectNodeTimeOutStatus.None = 0;
EProjectNodeTimeOutStatus.Warning = 1;
EProjectNodeTimeOutStatus.TimeOut = 2;

EProjectNodeTimeOutStatus.getTimeOutName = function(timeOutStatus) {
	var result = "";
	switch (timeOutStatus) {
	case EProjectNodeTimeOutStatus.None:
		result = "正常";
		break;
	case EProjectNodeTimeOutStatus.Warning:
		result = "警告";
		break;
	case EProjectNodeTimeOutStatus.TimeOut:
		result = "超时";
		break;
	}

	return result;
}

function EFunctionDefineKind() {
}

EFunctionDefineKind.Page = 2;
EFunctionDefineKind.Script = 1;

function ENodeKind() {
}

ENodeKind.None = 0;
ENodeKind.Classification = 1;
ENodeKind.Data = 2;

function EBaseDataItem() {
}

EBaseDataItem.TransactionDefine = 1;
EBaseDataItem.EventDefine = 2;
EBaseDataItem.VariableDefine = 3;
EBaseDataItem.ContractClassification = 4;
EBaseDataItem.DocumentClassification = 5;
EBaseDataItem.FileTemplate = 6;
EBaseDataItem.FunctionDefine = 7;
EBaseDataItem.ProjectNode = 8;
EBaseDataItem.NodeDefine = 9;
EBaseDataItem.ProjectVariableClass = 11;
EBaseDataItem.ProjectTemplate = 12;

function EFileTemplate() {
}
EFileTemplate.Default = 0; // 默认
EFileTemplate.Contract = 1; // 合同模板

EFileTemplate.getFileTemplateText = function(value) {
	var text = "";
	if (EBaseDataItem.TransactionDefine == value) {
		text = "合同模板";
	} else {
		text = "未知类";
	}

	return text;
}

function EAeareLevel() {
}
EAeareLevel.None = 0;
EAeareLevel.City = 1;

/**
 * 节点业务类型Id
 */
function ENodeBizKind() {
}

ENodeBizKind.NodeDefine = 1;
ENodeBizKind.ProjectTemplateNode = 2;
ENodeBizKind.ProjectNode = 3;
ENodeBizKind.Project = 4;
ENodeBizKind.ProjectEvent = 5;
ENodeBizKind.ProjectNodeEvent = 6;
ENodeBizKind.ProjectTemplateNodeEvent = 7;
ENodeBizKind.NodeFunction = 8;
ENodeBizKind.NodeDocument = 9;
ENodeBizKind.ProjectVariableEvent = 10;

function ETransactionHandleStatus() {
}

ETransactionHandleStatus.Untreated = 0; // 未处理
ETransactionHandleStatus.Treatment = 1; // 处理中
ETransactionHandleStatus.Processed = 2; // 已处理

/**
 * 节点配置业务类型Id
 */
function ENodeConfigBizKind() {
}

ENodeConfigBizKind.ProjectTemplate = 1;
ENodeConfigBizKind.Project = 2;

/**
 * 组织权限类型Id
 * 
 * @constructor
 */
function EProjectPermissionKind() {
}
EProjectPermissionKind.Manage = 1;
EProjectPermissionKind.Operate = 2;
EProjectPermissionKind.Resources = 3;
EProjectPermissionKind.Manage_Operate = 4;

EProjectPermissionKind.getKindText = function(value) {
	var text = "";
	if (EProjectPermissionKind.Manage == value) {
		text = "管理权限";
	} else if (EProjectPermissionKind.Operate == value) {
		text = "操作权限";
	} else if (EProjectPermissionKind.Resources == value) {
		text = "资源权限";
	}

	return text;
}

function EOrgObjectKind() {
}

EOrgObjectKind.Person = 1;
EOrgObjectKind.Role = 2;
EOrgObjectKind.Position = 3;
EOrgObjectKind.Dept = 4;
EOrgObjectKind.BaseFunctionType = 5;

EOrgObjectKind.getKindText = function(value) {
	var text = "";
	if (EOrgObjectKind.Person == value) {
		text = "人员";
	} else if (EOrgObjectKind.Role == value) {
		text = "角色";
	} else if (EOrgObjectKind.Position == value) {
		text = "岗位";
	} else if (EOrgObjectKind.Dept == value) {
		text = "部门";
	} else if (EOrgObjectKind.BaseFunctionType == value) {
		text = "项目职能";
	}

	return text;
}

function ERelationshipKind() {
}
ERelationshipKind.None = 0;
ERelationshipKind.Precursor = 1;
ERelationshipKind.Successor = 2;
ERelationshipKind.Rollback = 3;

ERelationshipKind.getKindText = function(value) {
	var text = "";
	if (ERelationshipKind.Precursor == value) {
		text = "前置";
	} else if (ERelationshipKind.Successor == value) {
		text = "后继";
	} else if (ERelationshipKind.Rollback == value) {
		text = "回退";
	}

	return text;
}

function EProjectStatus() {
}
EProjectStatus.Reserve = 0;
EProjectStatus.Construction = 1;
EProjectStatus.Complated = 2;
EProjectStatus.Paused = 3;
EProjectStatus.Aborted = 4;
EProjectStatus.Execute = 9;
EProjectStatus.View = 10;

EProjectStatus.getStatusName = function(value) {
	var text = "";
	if (EProjectStatus.Reserve == value) {
		text = "储备";
	} else if (EProjectStatus.Construction == value) {
		text = "建设";
	} else if (EProjectStatus.Complated == value) {
		text = "竣工";
	} else if (EProjectStatus.Paused == value) {
		text = "已暂停";
	} else if (EProjectStatus.Aborted == value) {
		text = "已终止";
	}

	return text;
}

function EProjectNodeStatus() {
}
// 未处理
EProjectNodeStatus.UNTREATED = 0;
// 处理中
EProjectNodeStatus.PROCESSING = 1;
// 已完成
EProjectNodeStatus.COMPLATED = 2;
// 已暂停
EProjectNodeStatus.PAUSED = 3;
// 终止
EProjectNodeStatus.ABORTED = 4;

EProjectNodeStatus.getStatusName = function(value) {
	var text = "";
	if (EProjectNodeStatus.UNTREATED == value) {
		text = "未处理";
	} else if (EProjectNodeStatus.PROCESSING == value) {
		text = "处理中";
	} else if (EProjectNodeStatus.COMPLATED == value) {
		text = "已完成";
	} else if (EProjectNodeStatus.PAUSED == value) {
		text = "已暂停";
	} else if (EProjectNodeStatus.ABORTED == value) {
		text = "已终止";
	}

	return text;
}

function EFunctionExecKind() {
}
EFunctionExecKind.Script = 1;
EFunctionExecKind.Page = 2;

/**
 * 加载基础数据的通用树
 */
var PACommonTree = {
	contextMenu : null,
	treeManager : null,
	operateCfgTree : {},
	folderId : 0,
	nodeKindId : 0,
	treeID : null,
	parentId : 0,
	refreshFlag : false,
	idFieldName : 'id',
	title : '文件夹',
	bizKindId : 0,
	bizId : 0,
	rootIs0 : true,
	templateKindId : 0,
	status : -1,
	onFormInit : null
};
$(function() {
	PACommonTree.initializeContextmenu();
});

PACommonTree.initializeContextmenu = function() {
	PACommonTree.contextMenu = UICtrl.menu({
		top : 100,
		left : 100,
		width : 120,
		items : [ {
			id : "menuAdd",
			text : '新建分类',
			click : PACommonTree.folderMenuItemClick,
			icon : "add"
		}, {
			id : "menuUpdate",
			text : '修改分类',
			click : PACommonTree.folderMenuItemClick,
			icon : "edit"
		}, {
			id : "menuLine1",
			line : true
		}, {
			id : "menuDelete",
			text : '删除分类',
			click : PACommonTree.folderMenuItemClick,
			icon : "delete"
		}, {
			id : "menuLine2",
			line : true
		}, {
			id : "menuRefresh",
			text : '刷新',
			click : PACommonTree.folderMenuItemClick,
			icon : "refresh"
		}, {
			id : "menuLine2",
			line : true
		}, {
			id : "menuUp",
			text : '上移',
			click : PACommonTree.folderMenuItemClick,
			icon : "arrow_up"
		}, {
			id : "menuDown",
			text : '下移',
			click : PACommonTree.folderMenuItemClick,
			icon : "arrow_down"
		} ]
	});
}

PACommonTree.createTree = function(op) {
	this.options = op || {};

	PACommonTree.operateCfgTree.loadAction = this.options.loadAction || ""; // 加载树的链接
	PACommonTree.operateCfgTree.showAddAction = this.options.showAddAction
			|| ""; // 显示添加树出来的页面
	PACommonTree.operateCfgTree.showUpdateAction = this.options.showUpdateAction
			|| ""; // 显示修改树出来的页面
	PACommonTree.operateCfgTree.deleteAction = this.options.deleteAction || ""; // 删除树的链接
	PACommonTree.operateCfgTree.updateAction = this.options.updateAction || ""; // 执行修改树的链接
	PACommonTree.operateCfgTree.insertAction = this.options.insertAction || ""; // 添加树的节点的链接
	PACommonTree.operateCfgTree.updateSequenceAction = this.options.updateSequenceAction
			|| ""; // 修改树节点排序的连接，上下移动
	PACommonTree.parentId = this.options.parentId || 0;
	PACommonTree.treeId = this.options.treeId || '#maintree';
	PACommonTree.idFieldName = this.options.idFieldName || 'id';
	PACommonTree.title = this.options.title || '';
	PACommonTree.onFormInit = this.options.onFormInit || null;
	PACommonTree.bizKindId = this.options.bizKindId || 0;
	PACommonTree.bizId = this.options.bizId || 0;
	PACommonTree.templateKindId = this.options.templateKindId || 0;
	PACommonTree.status = this.options.status || -1;
	PACommonTree.rootIs0 = this.options.rootIs0 == undefined ? true
			: this.options.rootIs0; 
	
	Public.ajax(PACommonTree.operateCfgTree.loadAction, {
		parentId : PACommonTree.parentId,
		nodeKindId : ENodeKind.Classification,
		bizKindId : PACommonTree.bizKindId,
		bizId : PACommonTree.bizId,
		templateKindId : PACommonTree.templateKindId,
		status : PACommonTree.status
	}, function(data) {
		PACommonTree.treeManager = UICtrl.tree(PACommonTree.treeId, {
			data : data.Rows,
			childIcon : "folder",
			idFieldName : "nodeId",
			parentIDFieldName : "parentId",
			textFieldName : "nodeText",
			checkbox : false,
			iconFieldName : "nodeIcon",
			btnClickToToggleOnly : true,
			single : true,
			nodeWidth : 180,
			topParentIDValue : PACommonTree.bizId,
			onBeforeExpand : function(node) {
				if (node.data.hasChildren) {
					if (!node.data.children || node.data.children.length == 0) {
						Public.ajax(op.loadAction, {
							bizId : PACommonTree.bizId,
							bizKindId : PACommonTree.bizKindId,
							parentId : node.data.nodeId,
							nodeKindId : ENodeKind.Classification,
							templateKindId : PACommonTree.templateKindId,
							status : PACommonTree.status
						}, function(data) {
							PACommonTree.treeManager.append(node.target,
									data.Rows);
						});
					}
				}
			},
			isLeaf : function(data) {
				if (data.nodeIcon) {
					data.nodeIcon = PACommonTree.getNodeIcon(data.nodeIcon);
				}

				data.children = [];
				return parseInt(data.hasChildren) == 0;
			},
			onClick : function(node) {
				if (op.onClick)
					op.onClick(node);
			},
			onContextmenu : function(node, e) {
				if (op.isShowMenu == false)
					return false;

				PACommonTree.folderId = node.data.nodeId;
				PACommonTree.nodeKindId = node.data.nodeKindId;
				if (node.data.parentId == -1) {
					PACommonTree.contextMenu.setDisable("menuUp");
					PACommonTree.contextMenu.setDisable("menuDown");
					PACommonTree.contextMenu.setDisable("menuUpdate");
					PACommonTree.contextMenu.setDisable("menuDelete");
				} else {
					PACommonTree.contextMenu.setEnable("menuUpdate");
					PACommonTree.contextMenu.setEnable("menuDelete");
				}
				if (node.target.className == "l-first l-last l-onlychild ") {
					PACommonTree.contextMenu.setEnable("menuUp");
					PACommonTree.contextMenu.setDisable("menuDown");
				}
				if (node.target.className.indexOf('l-onlychild') >= 0) {
					PACommonTree.contextMenu.setDisable("menuUp");
					PACommonTree.contextMenu.setDisable("menuDown");
				} else if (node.target.className.indexOf('l-first') >= 0) {
					PACommonTree.contextMenu.setDisable("menuUp");
					PACommonTree.contextMenu.setEnable("menuDown");
				} else if (node.target.className.indexOf('l-last') >= 0) {
					PACommonTree.contextMenu.setEnable("menuUp");
					PACommonTree.contextMenu.setDisable("menuDown");
				} else {
					PACommonTree.contextMenu.setEnable("menuUp");
					PACommonTree.contextMenu.setEnable("menuDown");
				}
				PACommonTree.contextMenu.show({
					top : e.pageY,
					left : e.pageX
				});

				var oldNode = PACommonTree.treeManager.getSelected();
				if (oldNode)
					PACommonTree.treeManager.cancelSelect(oldNode.target);

				PACommonTree.treeManager.selectNode(node.target);

				return false;
			}
		});
	});
}

PACommonTree.getNodeIcon = function(value) {
	var icon = web_app.name + "/themes/default/images/icons/";
	switch (value) {
	case "Project":
		icon += "icon_package_get";
		break;
	default:
		return "";
		break;
	}
	icon += '.gif';

	return icon;
}

PACommonTree.addFolder = function() {
	UICtrl.showAjaxDialog({
		url : PACommonTree.operateCfgTree.showAddAction,
		param : {
			parentId : PACommonTree.folderId,
			nodeKindId : ENodeKind.Classification,
			bizKindId : PACommonTree.bizKindId,
			bizId : PACommonTree.bizId,
			templateKindId : PACommonTree.templateKindId,
			status : PACommonTree.status,
			fileTemplateId : 0
		},
		title : "添加" + PACommonTree.title,
		width : 400,
		ok : PACommonTree.updateCommonTree,
		close : PACommonTree.commonTreeDialogCloseHandler,
		init : PACommonTree.onFormInit
	});
}

PACommonTree.updateFolder = function() {
	UICtrl.showAjaxDialog({
		url : PACommonTree.operateCfgTree.showUpdateAction,
		param : {
			id : PACommonTree.folderId
		},
		title : "修改" + PACommonTree.title,
		width : 400,
		ok : PACommonTree.updateCommonTree,
		close : PACommonTree.commonTreeDialogCloseHandler,
		init : PACommonTree.onFormInit
	});
}

PACommonTree.updateCommonTree = function(doc) {
	var _self = this;
	var id = PACommonTree.getId();
	$('#submitForm').ajaxSubmit(
			{
				url : (id ? PACommonTree.operateCfgTree.updateAction
						: PACommonTree.operateCfgTree.insertAction),
				success : function() {
					PACommonTree.refreshFlag = true;
					_self.close();
				}
			});
}

PACommonTree.deleteFolder = function(folderId) {
	var ids = new Array();
	ids[0] = folderId;

	UICtrl.confirm('确定删除所选' + PACommonTree.title + '吗?', function() {
		Public.ajax(PACommonTree.operateCfgTree.deleteAction, {
			ids : $.toJSON(ids)
		}, function() {
			Public.successTip('删除' + PACommonTree.title + '成功!');
			if (PACommonTree.treeManager) {
				var node = PACommonTree.treeManager.getSelected();
				if (node) {
					var parentNode = PACommonTree.treeManager
							.getParentTreeItem(node.target);
					PACommonTree.refreshNode(parentNode);
				} else
					alert('请先选择需要删除的' + PACommonTree.title + '.');
			}

		});
	});
}

PACommonTree.moveUpFolder = function() {
	if (PACommonTree.treeManager) {
		var node = PACommonTree.treeManager.getSelected();
		if (node) {
			prevData = PACommonTree.treeManager.getNodeData($(node.target)
					.prev());
			if (prevData) {
				currentData = node.data;
				var params = new Map();
				params.put(currentData.nodeId, prevData.sequence);
				params.put(prevData.nodeId, currentData.sequence);
				Public.ajax(PACommonTree.operateCfgTree.updateSequenceAction, {
					data : params.toString()
				}, function() {
					Public.tip('上移' + PACommonTree.title + '成功!');
					var parentNode = PACommonTree.treeManager
							.getParentTreeItem(node.target);
					PACommonTree.refreshNode(parentNode);
				});
			}
		}
	}
}

PACommonTree.moveDownFolder = function() {
	if (PACommonTree.treeManager) {
		var node = PACommonTree.treeManager.getSelected();
		if (node) {
			nextData = PACommonTree.treeManager.getNodeData($(node.target)
					.next());
			if (nextData) {
				currentData = node.data;
				var params = new Map();
				params.put(currentData.nodeId, nextData.sequence);
				params.put(nextData.nodeId, currentData.sequence);
				Public.ajax(PACommonTree.operateCfgTree.updateSequenceAction, {
					data : params.toString()
				}, function() {
					Public.tip('下移' + PACommonTree.title + '成功!');
					var parentNode = PACommonTree.treeManager
							.getParentTreeItem(node.target);
					PACommonTree.refreshNode(parentNode);
				});
			}
		}
	}
}

PACommonTree.folderMenuItemClick = function(item, i) {
	if (item.id == "menuAdd") {
		PACommonTree.addFolder(PACommonTree.folderId);
	} else if (item.id == "menuUpdate") {
		PACommonTree.updateFolder(PACommonTree.folderId);
	} else if (item.id == "menuDelete") {
		PACommonTree.deleteFolder(PACommonTree.folderId);
	} else if (item.id == "menuRefresh") {
		var node = PACommonTree.treeManager.getSelected();
		if (node)
			PACommonTree.refreshNode(node.target);
	} else if (item.id == "menuUp") {
		PACommonTree.moveUpFolder();
	} else if (item.id == "menuDown") {
		PACommonTree.moveDownFolder();
	}
}

PACommonTree.refreshNodeByParentId = function(parentId) {
	var parentNode = PACommonTree.treeManager.getDataByID(parentId);

	PACommonTree.refreshNode(parentNode);
}

PACommonTree.refreshNode = function(parentNode) {
	var parentData = PACommonTree.treeManager.getNodeData(parentNode);
	if (parentData) {
		if (parentData.children && parentData.children.length > 0) {
			for (var i = 0; i < parentData.children.length; i++) {
				PACommonTree.treeManager
						.remove(parentData.children[i].treedataindex);
			}
		}
		Public.ajax(PACommonTree.operateCfgTree.loadAction, {
			parentId : parentData.nodeId,
			nodeKindId : ENodeKind.Classification,
			bizKindId : PACommonTree.bizKindId,
			bizId : PACommonTree.bizId,
			templateKindId : PACommonTree.templateKindId,
			status : PACommonTree.status,
			fileTemplateId : 0
		},

				function(data) {
					if (!data.Rows || data.Rows.length == 0) {
						var pn = PACommonTree.treeManager
								.getParentTreeItem(parentNode);
						PACommonTree.refreshNode(pn);
					} else {
						PACommonTree.treeManager.append(parentData, data.Rows);
					}
				});
	}
}

PACommonTree.commonTreeDialogCloseHandler = function() {
	if (PACommonTree.refreshFlag) {
		var node = PACommonTree.treeManager.getSelected();
		if (node) {
			if (!PACommonTree.rootIs0) {
				if (PACommonTree.folderId != PACommonTree.bizId) {
					var parentNode = PACommonTree.treeManager
							.getParentTreeItem(node.target);
					PACommonTree.refreshNode(parentNode);
				} else {
					PACommonTree.refreshNode(node.target);
				}

			} else {
				if (PACommonTree.folderId > 1) {
					var parentNode = PACommonTree.treeManager
							.getParentTreeItem(node.target);
					PACommonTree.refreshNode(parentNode);
				} else {
					PACommonTree.refreshNode(node.target);
				}
			}
		}
	}
}

PACommonTree.getId = function() {
	return parseInt($("#" + PACommonTree.idFieldName).val() || 0);
}

PAUtil.checkProjectOperateRight = function(projectId, projectNodeId,
		nodeVerification) {
	var result = false;

	Public.syncAjax(web_app.name + "/projectMainAction!loadProject.ajax", {
		projectId : projectId
	}, function(data) {
		if (data && parseInt(data.phaseStatus) == EProjectStatus.Reserve) {
			result = true;
		}
	});

	if (!result && nodeVerification == true) {
		result = PAUtil.checkProjectNodeOperateRight(projectNodeId,
				EProjectPermissionKind.Manage);
	}
	return result;
}

PAUtil.checkProjectNodeOperateRight = function(projectNodeId, kindId) {
	return PAUtil.checkNodePermission(projectNodeId, 0, kindId);
}

PAUtil.checkDocumentResourceRight = function(projectNodeId,
		documentClassifacationId, kindId) {
	return PAUtil.checkNodePermission(projectNodeId, documentClassifacationId,
			kindId);
}

PAUtil.checkNodePermission = function(projectNodeId, documentClassifacationId,
		kindId) {
	var result = true;
	Public.syncAjax(web_app + "/nodePermissionAction!checkNodePermission.ajax",
			{
				bizId : projectNodeId,
				bizKindId : ENodeBizKind.ProjectNode,
				kindId : kindId,
				documentClassifacationId : documentClassifacationId
			}, function(data) {
				if (data) {
					result = data.flag;
				}
			});
	return result;
}

PAUtil.tipNoRightOperate = function() {
	Public.errorTip("当前项目已经启动，不能进行维护操作");
}

PAUtil.tipExecuteNodeError = function() {
	Public.errorTip("当前操作只能在项目执行中操作.");
}

PAUtil.loadProjectNavTitle = function(projectNodeId, title) {
	var result = title;
	var projectId;
	Public.syncAjax(web_app.name
			+ "/projectNodeMainAction!loadProjectNode.ajax", {
		projectNodeId : projectNodeId
	}, function(data) {
		if (data) {
			projectId = data.bizId || 0;
			result = data.name + " > " + result;

		}
	});

	Public.syncAjax(web_app.name + "/projectMainAction!loadProject.ajax", {
		projectId : projectId
	}, function(data) {
		if (data) {
			result = data.name + " > " + result;
		}
	});

	return result;
}