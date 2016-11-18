var operateCfg = {}, parentId = -1, item, bizId, bizKindId;
$(function () {
    getQueryParameters();
    loadTree();

    function getQueryParameters() {
        item = parseInt(Public.getQueryStringByName("item")) || 1;
        bizId = parseInt(Public.getQueryStringByName("bizId")) || 0;
        bizKindId = parseInt(Public.getQueryStringByName("bizKindId"))
            || 0;
        if (bizId > 0 && item != EBaseDataItem.ProjectVariableClass)
            parentId = bizId;
    }

    function getLoadActionUrl() {
        var url = web_app.name;
        switch (item) {
            case EBaseDataItem.NodeDefine :
                url += "/nodeDefineAction!queryAllNodeDefine.ajax";
                break;
            case EBaseDataItem.ProjectNode :
                url += "/projectNodeAction!queryAllProjectNode.ajax";
                break;
            case EBaseDataItem.ProjectVariableClass :
                url += "/projectVariableAction!queryAllProjectVariableClass.ajax";
                break;
            case EBaseDataItem.ProjectTemplate :
                url += "/projectTemplateConfigAction!queryAllProjectTemplate.ajax";
                break;
        }

        return url;
    }

    function loadTree() {
        PACommonTree.createTree({
            loadAction: getLoadActionUrl(),
            isShowMenu: false,
            treeId: "#maintree",
            parentId: parentId,
            bizId: bizId,
            bizKindId: bizKindId
        });
    }

});

function getSelectedTreeNodeData() {
    var node = PACommonTree.treeManager.getSelected();
    if (!node) {
        parent.Public.tip('请选择分类!');
        return;
    }
    if (!node.data.nodeId) {
        parent.Public.tip('不能选择根节点!');
        return;
    }
    return node.data;
}