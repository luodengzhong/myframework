var gridManager, refreshFlag = false, nodeRelationshipId = 0, lastSelectedId = 0, bizId = 0, bizKindId = 0, relationshipKindId = 0, operateCfg = {};

$(function () {
    getQueryParameters();
    initializeOperateCfg();
    bindEvents();
    initializeUI();
    initializeGrid();

    function getQueryParameters() {
        bizKindId = Public.getQueryStringByName("bizKindId") || 0;
        bizId = Public.getQueryStringByName("bizId") || 0;
        relationshipKindId = Public.getQueryStringByName("relationshipKindId")
            || ERelationshipKind.Precursor;
    }

    function initializeOperateCfg() {
        var actionPath = web_app.name + "/nodeRelationshipAction!";
        operateCfg.queryAction = actionPath + 'slicedQueryNodeRelationship.ajax';
        operateCfg.showInsertAction = actionPath
            + "showInsertNodeRelationshipPage.do";

        operateCfg.insertAction = actionPath + 'insertNodeRelationship.ajax';
        operateCfg.deleteAction = actionPath + 'deleteNodeRelationship.ajax';
        operateCfg.updateSequenceAction = actionPath
            + "updateNodeRelationshipSequence.ajax";

        operateCfg.showInsertTitle = "节点选择器";
    }

    function initializeUI() {
        UICtrl.initDefaulLayout();
    }

    function bindEvents() {

    }

    function initializeGrid() {
        UICtrl.autoSetWrapperDivHeight();
        var toolbarparam = {
            addHandler: showInsertDialog,
            deleteHandler: deleteNodeRelationship,
            saveSortIDHandler: updateNodeRelationshipSequence
        };
        var toolbarOptions = UICtrl.getDefaultToolbarOptions(toolbarparam);

        gridManager = UICtrl.grid("#maingrid", {
            columns: [
                {
                    display: '编码',
                    name: 'code',
                    width: 150,
                    minWidth: 60,
                    type: "string",
                    align: "left",
                    isSort: false
                },
                {
                    display: '名称',
                    name: 'name',
                    width: 150,
                    minWidth: 60,
                    type: "string",
                    align: "left",
                    isSort: false
                },
                {
                    display: '简称',
                    name: 'shortName',
                    width: 150,
                    minWidth: 60,
                    type: "string",
                    align: "left",
                    isSort: false
                },
                {
                    display: "排序号",
                    name: "sequence",
                    width: 60,
                    minWidth: 60,
                    type: "int",
                    align: "left",
                    render: function (item) {
                        return "<input type='text' id='txtSequence_"
                            + item.nodeRelationshipId
                            + "' class='textbox' value='"
                            + item.sequence + "' />";
                    }
                }
            ],
            dataAction: 'server',
            url: operateCfg.queryAction,
            parms: {
                bizId: bizId,
                bizKindId: bizKindId,
                relationshipKindId: relationshipKindId
            },
            usePager: true,
            rownumbers: true,
            sortName: "sequence",
            SortOrder: "asc",
            toolbar: toolbarOptions,
            width: '100%',
            height: '100%',
            title: ERelationshipKind.getKindText(relationshipKindId)
                + '节点关系列表',
            heightDiff: -10,
            headerRowHeight: 25,
            rowHeight: 25,
            checkbox: true,
            fixedCellHeight: true,
            selectRowButtonOnly: true,
            onDblClickRow: function (data, rowindex, rowobj) {

            }
        });
    }
});

function getId() {
    return parseInt($("#nodeRelationshipId").val() || 0);
}

function showInsertDialog() {
    if (bizId <= 0) {
        Public.tip("未知的bizId:" + bizId);
        return;
    }
    parent.UICtrl.showFrameDialog({
        url: operateCfg.showInsertAction,
        title: operateCfg.showInsertTitle,
        param: {
            bizId: bizId,
            bizKindId: bizKindId,
            relationshipKindId: relationshipKindId
        },
        width: PAUtil.dialogWidth,
        height: PAUtil.dialogHeight,
        ok: doSaveNodeRelationship,
        close: reloadGrid
    });
}

function doSaveNodeRelationship() {
    if (!this.iframe || !this.iframe.contentWindow)
        return;

    var data = this.iframe.contentWindow.getSelectedData();
    if (!data)
        return;

    var projectNodeIds = [];
    for (var i = 0; i < data.length; i++) {
        if (bizKindId == ENodeBizKind.NodeDefine) {
            if (data[i].nodeDefineId)
                projectNodeIds[projectNodeIds.length] = data[i].nodeDefineId;
        } else {
            if (data[i].projectNodeId)
                projectNodeIds[projectNodeIds.length] = data[i].projectNodeId;
        }
    }

    var params = {
        bizId: bizId,
        bizKindId: bizKindId,
        relationshipKindId: relationshipKindId,
        projectNodeIds: $.toJSON(projectNodeIds)
    };

    var _self = this;
    Public.ajax(web_app.name + '/' + operateCfg.insertAction, params, function (data) {
        refreshFlag = true;
        _self.close();
    });
}

function deleteNodeRelationship() {
    var action = operateCfg.deleteAction;
    DataUtil.del({
        action: action,
        gridManager: gridManager,
        onSuccess: reloadGrid,
        idFieldName: "nodeRelationshipId"
    });
}

function updateNodeRelationshipSequence() {
    var action = operateCfg.updateSequenceAction;
    DataUtil.updateSequence({
        action: action,
        gridManager: gridManager,
        onSuccess: reloadGrid,
        idFieldName: 'nodeRelationshipId',
        seqFieldName: 'sequence'
    });
}

function onDialogCloseHandler() {
    if (refreshFlag) {
        reloadGrid();
        refreshFlag = false;
    }
}

function reloadGrid() {
    var params = $("#queryMainForm").formToJSON();
    UICtrl.gridSearch(gridManager, params);
}
