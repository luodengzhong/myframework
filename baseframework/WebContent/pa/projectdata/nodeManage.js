var treeManager, bizKindId, bizId, projectId;
$(function() {
	getQueryParameters();
	bindEvents();
	loadTree();
	initializeUI();
	initializeGrid();
	setContentSrc();

	function getQueryParameters() {
		bizKindId = Public.getQueryStringByName("bizKindId") || 0;
		bizId = Public.getQueryStringByName("bizId") || 0;
		projectId = Public.getQueryStringByName("projectId") || 0;
	}

	function bindEvents() {

	}

	function initializeUI() {
		UICtrl.initDefaulLayout();

		var url = 'nodeFunctionAction.do';
		if (bizKindId == ENodeBizKind.NodeFunction) {
			url = 'nodePermissionAction.do?objectKindId='
					+ EOrgObjectKind.BaseFunctionType + "&kindId="
					+ EProjectPermissionKind.Operate;
		}

		setContentSrc(url);
	}

	function loadTree() {
		treeManager = $("#maintree").ligerTree({
					data : [{
								id : 'BaseInfo',
								text : '项目节点管理',
								icon : '',
								url : '',
								isexpand : true,
								children : getTreeItem()
							}],
					onClick : function(node) {
						if (node && node.data && node.data.url != '') {
							setContentSrc(node.data.url);
						}
					}
				});
	}

	function initializeGrid() {

	}

	function setContentSrc(url) {
		if (!url)
			return;
		if (url.indexOf("?") > 0)
			url += '&';
		else
			url += '?';

		url += 'bizKindId=' + bizKindId + '&bizId=' + bizId + '&projectId='
				+ projectId + '&source=projectMge';

		if ($('#mainiframe').attr('src') != url)
			document.getElementById('mainiframe').src = url;
	}

	function getTreeItem() {
		var gridCol = null;
		if (bizKindId == ENodeBizKind.NodeFunction) {
			gridCol = [{
				text : '任务接收人',
				icon : '',
				url : '',
				isexpand : false,
				children : [
						/*
						 * { text: '部门', icon: '', url:
						 * 'nodePermissionAction.do?objectKindId=' +
						 * EOrgObjectKind.Dept + "&kindId=" +
						 * EProjectPermissionKind.Operate },
						 */
						{
					text : '职能',
					icon : '',
					url : 'nodePermissionAction.do?objectKindId='
							+ EOrgObjectKind.BaseFunctionType + "&kindId="
							+ EProjectPermissionKind.Operate

				}, {
					text : '岗位',
					icon : '',
					url : 'nodePermissionAction.do?objectKindId='
							+ EOrgObjectKind.Position + "&kindId="
							+ EProjectPermissionKind.Operate

				}, {
					text : '人员',
					icon : '',
					url : 'nodePermissionAction.do?objectKindId='
							+ EOrgObjectKind.Person + "&kindId="
							+ EProjectPermissionKind.Operate
				}/*
					 * , { text : '角色', icon : '', url :
					 * 'nodePermissionAction.do?objectKindId=' +
					 * EOrgObjectKind.Role + "&kindId=" +
					 * EProjectPermissionKind.Operate }
					 */
				]
			}];
		} else if (bizKindId != ENodeBizKind.NodeDefine) {
			gridCol = [{
						text : '节点功能',
						icon : '',
						url : 'nodeFunctionAction.do',
						isexpand : false
					}, {
						text : '节点文档',
						icon : '',
						url : 'nodeDocumentAction.do',
						isexpand : false
					}, {
						text : '节点事务',
						icon : '',
						url : bizKindId <= ENodeBizKind.ProjectTemplateNode
								? 'nodeTransactionAction.do'
								: 'transactionHandleAction.do'
					}, {
						text : '节点流程配置',
						icon : '',
						url : 'nodeProcAction.do'
					}, {
						text : '节点事件',
						icon : '',
						url : 'nodeEventAction.do',
						isexpand : false
					}, {
						text : '节点变量',
						icon : '',
						url : bizKindId <= ENodeBizKind.ProjectTemplateNode
								? 'nodeVariableAction.do'
								: 'projectVariableAction.do'
					}, {
						text : '管理权限',
						icon : '',
						url : '',
						isexpand : false,
						children : [
								/*
								 * { text: '部门', icon: '', url:
								 * 'nodePermissionAction.do?objectKindId=' +
								 * EOrgObjectKind.Dept + "&kindId=" +
								 * EProjectPermissionKind.Manage },
								 */
								{
							text : '职能',
							icon : '',
							url : 'nodePermissionAction.do?objectKindId='
									+ EOrgObjectKind.BaseFunctionType
									+ "&kindId="
									+ EProjectPermissionKind.Manage

						}, {
							text : '岗位',
							icon : '',
							url : 'nodePermissionAction.do?objectKindId='
									+ EOrgObjectKind.Position + "&kindId="
									+ EProjectPermissionKind.Manage

						}, {
							text : '人员',
							icon : '',
							url : 'nodePermissionAction.do?objectKindId='
									+ EOrgObjectKind.Person + "&kindId="
									+ EProjectPermissionKind.Manage
						}/*
							 * , { text : '角色', icon : '', url :
							 * 'nodePermissionAction.do?objectKindId=' +
							 * EOrgObjectKind.Role + "&kindId=" +
							 * EProjectPermissionKind.Manage }
							 */
						]
					}, {
						text : '操作权限',
						icon : '',
						url : '',
						isexpand : false,
						children : [
								/*
								 * { text: '部门', icon: '', url:
								 * 'nodePermissionAction.do?objectKindId=' +
								 * EOrgObjectKind.Dept + "&kindId=" +
								 * EProjectPermissionKind.Operate },
								 */
								{
							text : '职能',
							icon : '',
							url : 'nodePermissionAction.do?objectKindId='
									+ EOrgObjectKind.BaseFunctionType
									+ "&kindId="
									+ EProjectPermissionKind.Operate

						}, {
							text : '岗位',
							icon : '',
							url : 'nodePermissionAction.do?objectKindId='
									+ EOrgObjectKind.Position + "&kindId="
									+ EProjectPermissionKind.Operate

						}, {
							text : '人员',
							icon : '',
							url : 'nodePermissionAction.do?objectKindId='
									+ EOrgObjectKind.Person + "&kindId="
									+ EProjectPermissionKind.Operate
						}/*
							 * , { text : '角色', icon : '', url :
							 * 'nodePermissionAction.do?objectKindId=' +
							 * EOrgObjectKind.Role + "&kindId=" +
							 * EProjectPermissionKind.Operate }
							 */
						]
					}, {
						text : '资源权限',
						icon : '',
						url : '',
						isexpand : false,
						children : [
								/*
								 * { text: '部门', icon: '', url:
								 * 'nodePermissionAction.do?objectKindId=' +
								 * EOrgObjectKind.Dept + "&kindId=" +
								 * EProjectPermissionKind.Resources },
								 */
								{
							text : '职能',
							icon : '',
							url : 'nodePermissionAction.do?objectKindId='
									+ EOrgObjectKind.BaseFunctionType
									+ "&kindId="
									+ EProjectPermissionKind.Resources

						}, {
							text : '岗位',
							icon : '',
							url : 'nodePermissionAction.do?objectKindId='
									+ EOrgObjectKind.Position + "&kindId="
									+ EProjectPermissionKind.Resources

						}, {
							text : '人员',
							icon : '',
							url : 'nodePermissionAction.do?objectKindId='
									+ EOrgObjectKind.Person + "&kindId="
									+ EProjectPermissionKind.Resources
						} /*
							 * ,{ text : '角色', icon : '', url :
							 * 'nodePermissionAction.do?objectKindId=' +
							 * EOrgObjectKind.Role + "&kindId=" +
							 * EProjectPermissionKind.Resources }
							 */
						]
					}, {
						text : '节点关系',
						icon : '',
						isexpand : false,
						children : [{
							text : '前置节点',
							icon : '',
							url : 'nodeRelationshipAction.do?relationshipKindId='
									+ ERelationshipKind.Precursor
						}, {
							text : '后继节点',
							icon : '',
							url : 'nodeRelationshipAction.do?relationshipKindId='
									+ ERelationshipKind.Successor
						}, {
							text : '回退节点',
							icon : '',
							url : 'nodeRelationshipAction.do?relationshipKindId='
									+ ERelationshipKind.Rollback
						}]
					}];
		} else {
			gridCol = [{
						text : '节点功能',
						icon : '',
						url : 'nodeFunctionAction.do',
						isexpand : false
					}, {
						text : '节点文档',
						icon : '',
						url : 'nodeDocumentAction.do',
						isexpand : false
					}, {
						text : '节点事务',
						icon : '',
						url : 'nodeTransactionAction.do'
					}, {
						text : '节点流程配置',
						icon : '',
						url : 'nodeProcAction.do'
					}];
		}
		return gridCol;

	}
});