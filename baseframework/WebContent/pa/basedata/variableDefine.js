var gridManager, refreshFlag = false, nodeKindId, variableDefineId = 0, lastSelectedId = 0, parentId = -1, operateCfg = {};

$(function () {
    initializeOperateCfg();
    bindEvents();
    loadTree();
    initializeUI();
    initializeGrid();

    /**
     * 初始化参数配置
     */
    function initializeOperateCfg() {
        var actionPath = web_app.name + "/variableDefineAction!";
        operateCfg.queryAction = actionPath + 'slicedQueryVariableDefine.ajax';
        operateCfg.showInsertAction = actionPath + "showInsertVariableDefinePage.load";
        operateCfg.showUpdateAction = actionPath + 'showUpdateVariableDefinePage.load';
        operateCfg.showMoveAction = actionPath + "showMoveVariableDefinePage.do";

        operateCfg.insertAction = actionPath + 'insertVariableDefine.ajax';
        operateCfg.updateAction = actionPath + 'updateVariableDefine.ajax';
        operateCfg.deleteAction = actionPath + 'deleteVariableDefine.ajax';
        operateCfg.queryAll = actionPath + "queryAllVariableDefine.ajax";
        operateCfg.updateSequenceAction = actionPath + "updateVariableDefineSequence.ajax";
        operateCfg.moveAction = actionPath + "moveVariableDefine.ajax";

        operateCfg.showInsertTitle = "添加变量定义";
        operateCfg.showUpdateTitle = "修改变量定义";
        operateCfg.showMoveTitle = "移动事务对话框";
    }

    function initializeUI() {
        UICtrl.initDefaulLayout();
    }

    function bindEvents() {
        $("#btnQuery").click(function () {
            var params = $(this.form).formToJSON();
            UICtrl.gridSearch(gridManager, params);
        });
    }

    function initializeGrid() {
        UICtrl.autoSetWrapperDivHeight();
        var toolbarparam = {
            addHandler: showInsertDialog,
            updateHandler: showUpdateDialog,
            deleteHandler: deleteVariableDefine,
            saveSortIDHandler: updateVariableDefineSequence,
            moveHandler: moveVariableDefine
        };
        var toolbarOptions = UICtrl.getDefaultToolbarOptions(toolbarparam);

        gridManager = UICtrl.grid("#maingrid", {
            columns: [
                {
                    display: '编码',
                    name: 'code',
                    width: 100,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                },
                {
                    display: '名称',
                    name: 'name',
                    width: 150,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                },
                {
                    display: '变量类型',
                    name: 'kindName',
                    sortName: "kindId",
                    width: 100,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                },
                {
                    display: '数据来源',
                    name: 'dataSourceName',
                    sortName: "dataSourceId",
                    width: 150,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                },
                {
                    display: '数据来源配置',
                    name: 'dataSourceConfig',
                    width: 150,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                },
                {
                    display: '描述',
                    name: 'description',
                    width: 150,
                    minWidth: 60,
                    type: "string",
                    align: "left"
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
                            + item.variableDefineId
                            + "' class='textbox' value='"
                            + item.sequence + "' />";
                    }
                }
            ],
            dataAction: 'server',
            url: operateCfg.queryAction,
            parms: {
                parentId: -1,
                nodeKindId: ENodeKind.Data
            },
            rownumbers: true,
            usePager: true,
            sortName: "sequence",
            SortOrder: "asc",
            toolbar: toolbarOptions,
            width: '100%',
            height: '100%',
            heightDiff: -10,
            headerRowHeight: 25,
            rowHeight: 25,
            checkbox: true,
            fixedCellHeight: true,
            selectRowButtonOnly: true,
            onDblClickRow: function (data, rowindex, rowobj) {
                doShowUpdateDialog(data.variableDefineId);
            }
        });

        UICtrl.setSearchAreaToggle(gridManager, false);
    }
});

function getId() {
    return parseInt($("#variableDefineId").val() || 0);
}

function showInsertDialog() {
    if (parentId <= 0) {
        Public.tip("请选择分类！");
        return;
    }
    UICtrl.showAjaxDialog({
        url: operateCfg.showInsertAction,
        title: operateCfg.showInsertTitle,
        param: {
            parentId: parentId,
            nodeKindId: ENodeKind.Data
        },
        width: 400,
        ok: doSaveVariableDefine,
        close: reloadGrid
    });
}

function doShowUpdateDialog(variableDefineId) {
    UICtrl.showAjaxDialog({
        url: operateCfg.showUpdateAction,
        param: {
            id: variableDefineId
        },
        title: operateCfg.showUpdateTitle,
        width: 400,
        ok: doSaveVariableDefine,
        close: reloadGrid
    });
}

function showUpdateDialog() {
    var row = gridManager.getSelectedRow();
    if (!row) {
        Public.tip("请选择数据！");
        return;
    }
    doShowUpdateDialog(row.variableDefineId);
}

function doSaveVariableDefine() {
    var _self = this;
    var id = getId();
    $('#submitForm').ajaxSubmit({
        url: (id ? operateCfg.updateAction : operateCfg.insertAction),
        success: function () {
            refreshFlag = true;
            _self.close();
        }
    });
}

function deleteVariableDefine() {
    var action = operateCfg.deleteAction;
    DataUtil.del({
        action: action,
        gridManager: gridManager,
        onSuccess: reloadGrid,
        idFieldName: "variableDefineId"
    });
}

function updateVariableDefineSequence() {
    var action = operateCfg.updateSequenceAction;
    DataUtil.updateSequence({
        action: action,
        gridManager: gridManager,
        onSuccess: reloadGrid,
        idFieldName: 'variableDefineId',
        seqFieldName: 'sequence'
    });
}

function moveVariableDefine() {
    var rows = gridManager.getSelecteds();
    if (!rows || rows.length < 1) {
        Public.tip('请选择要移动的数据!');
        return;
    }

    UICtrl.showFrameDialog({
        url: operateCfg.showMoveAction,
        title: operateCfg.showMoveTitle,
        param: {
            item: EBaseDataItem.VariableDefine
        },
        width: 350,
        height: 400,
        ok: doMoveVariableDefine,
        close: onDialogCloseHandler
    });
}

function doMoveVariableDefine() {
    var data = this.iframe.contentWindow.getSelectedTreeNodeData();
    if (!data) {
        return;
    }
    var ids = DataUtil.getSelectedIds({
        gridManager: gridManager,
        idFieldName: "variableDefineId"
    });

    if (!ids)
        return;

    var _self = this;
    var params = {};
    params.parentId = data.variableDefineId;
    params.ids = $.toJSON(ids);
    Public.ajax(operateCfg.moveAction, params, function () {
        refreshFlag = true;
        _self.close();
    });
    reloadGrid();
}

function onDialogCloseHandler() {
    if (refreshFlag) {
        reloadGrid();
        refreshFlag = false;
    }
}

function reloadGrid() {
    reloadGrid2();
}

function reloadGrid2() {
    var params = $("#queryMainForm").formToJSON();
    UICtrl.gridSearch(gridManager, params);
}

function loadTree() {

    PACommonTree.createTree({
        loadAction: operateCfg.queryAll,
        showAddAction: operateCfg.showInsertAction,
        showUpdateAction: operateCfg.showUpdateAction,
        deleteAction: operateCfg.deleteAction,
        updateAction: operateCfg.updateAction,
        insertAction: operateCfg.insertAction,
        updateSequenceAction: operateCfg.updateSequenceAction,
        treeId: "#maintree",
        parentId: parentId,
        idFieldName: 'variableDefineId',
        title: '变量定义分类',
        onClick: function (node) {
            if (!node || !node.data)
                return;
            parentId = node.data.nodeId == 0 ? -1 : node.data.nodeId;

            gridManager.options.parms.fullId = node.data.fullId;
            if (node.data.nodeId == 0) {
                $('.l-layout-center .l-layout-header').html("变量定义列表");
            } else {
                $('.l-layout-center .l-layout-header').html("<font style=\"color:Tomato;font-size:13px;\">[" + node.data.name + "]</font>变量定义列表");
            }
            reloadGrid2();
        },
        onFormInit: function () {
            $('#kindId1').parent().parent().hide();
            $('#dataSourceId').parent().parent().hide();
            $('#dataSourceConfig').parent().parent().hide();
        }
    });
}