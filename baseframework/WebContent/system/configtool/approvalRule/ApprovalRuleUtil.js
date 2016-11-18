var treeManager;

function loadProcTreeView() {
    if (treeManager){
    	treeManager.clear();
    }        
    treeManager = $('#maintree').commonTree({
        loadTreesAction: '/processManageAction!loadTreeLeaf.ajax?flag=o',
        idFieldName: 'reProcdefTreeId',
        parentIDFieldName: "parentId",
        textFieldName: "name",
        onClick: function (data) {
            if (!data)
                return;
            procNodeClick(data);
        },
        IsShowMenu: false
    });
}

function onBeforeExpand(node) {
    if (node.data.hasChildren) {
        if (!node.data.children || node.data.children.length == 0) {
            Public.ajax(web_app + "/workflowAction!getUserTaskActivitiesByProcessDefinitionId.ajax", {
                processDefinitionId: node.data.id
            }, function (data) {
                treeManager.append(node.target, data);
            });
        }
    }
}

function refreshNode(options) {
    var parentData;
    if (options.pNode)
        parentData = options.pNode;
    else
        parentData = options.manager.getDataByID(options.params.parentId);
    if (parentData) {
        if (parentData.children && parentData.children.length > 0) {
            for (var i = 0; i < parentData.children.length; i++) {
                options.manager.remove(parentData.children[i].treedataindex);
            }
        }
        var params = $.extend(options.params, { parentId: parentData.id });
        Public.ajax(web_app.name + options.queryAction, params,
            function (data) {
                if (!data.Rows || data.Rows.length == 0) {
                    var pn = options.manager.getParent(parentData.treedataindex);
                    if (pn)
                        refreshNode({manager: options.manager, queryAction: options.queryAction,
                            params: options.params, pNode: pn });
                } else {
                    options.manager.append(parentData, data.Rows);
                }
            });
    }
}