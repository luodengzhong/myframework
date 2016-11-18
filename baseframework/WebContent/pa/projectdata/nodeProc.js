var gridManager, refreshFlag = false, nodeProcId = 0, bizId = 0, bizKindId = 0, lastSelectedId = 0, operateCfg = {};

$(function () {
    getQueryParameters();
    initializeOperateCfg();
    bindEvents();
    initializeUI();
    initializeGrid();

    function getQueryParameters() {
        bizKindId = Public.getQueryStringByName("bizKindId") || 0;
        bizId = Public.getQueryStringByName("bizId") || 0;
    }

    /**
     * 初始化参数配置
     */
    function initializeOperateCfg() {
        var actionPath = web_app.name + "/nodeProcAction!";
        operateCfg.queryAction = actionPath + 'slicedQueryNodeProc.ajax';
        operateCfg.showInsertAction = actionPath
            + "showInsertNodeProcPage.load";
        operateCfg.showUpdateAction = actionPath
            + 'showUpdateNodeProcPage.load';

        operateCfg.insertAction = actionPath + 'insertNodeProc.ajax';
        operateCfg.updateAction = actionPath + 'updateNodeProc.ajax';
        operateCfg.deleteAction = actionPath + 'deleteNodeProc.ajax';
        operateCfg.queryAll = actionPath + "queryAllNodeProc.ajax";
        operateCfg.updateSequenceAction = actionPath
            + "updateNodeProcSequence.ajax";

        operateCfg.showInsertTitle = "添加节点流程配置";
        operateCfg.showUpdateTitle = "修改节点流程配置";
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
            deleteHandler: deleteNodeProc,
            saveSortIDHandler: updateNodeProcSequence
        };
        var toolbarOptions = UICtrl.getDefaultToolbarOptions(toolbarparam);

        gridManager = UICtrl.grid("#maingrid", {
            columns: [
                {
                    display: '流程Key',
                    name: 'procKey',
                    width: 200,
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
                            + item.nodeProcId
                            + "' class='textbox' value='"
                            + item.sequence + "' />";
                    }
                }
            ],
            dataAction: 'server',
            url: operateCfg.queryAction,
            parms: {
                keyProc: '',
                bizId: bizId,
                bizKindId: bizKindId
            },
            title: '节点流程配置列表',
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
                doShowUpdateDialog(data.nodeProcId);
            }
        });

        UICtrl.setSearchAreaToggle(gridManager, false);
    }
});

function getId() {
    return parseInt($("#nodeProcId").val() || 0);
}

function showInsertDialog() {
    UICtrl.showAjaxDialog({
        url: operateCfg.showInsertAction,
        title: operateCfg.showInsertTitle,
        param: {
            bizId: bizId,
            bizKindId: bizKindId
        },
        width: 400,
        ok: doSaveNodeProc,
        close: reloadGrid
    });
}

function doShowUpdateDialog(nodeProcId) {
    UICtrl.showAjaxDialog({
        url: operateCfg.showUpdateAction,
        param: {
            nodeProcId: nodeProcId
        },
        title: operateCfg.showUpdateTitle,
        width: 400,
        ok: doSaveNodeProc,
        close: reloadGrid
    });
}

function showUpdateDialog() {
    var row = gridManager.getSelectedRow();
    if (!row) {
        Public.tip("请选择数据！");
        return;
    }
    doShowUpdateDialog(row.nodeProcId);
}

function doSaveNodeProc() {
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

function deleteNodeProc() {
    var action = operateCfg.deleteAction;
    DataUtil.del({
        action: action,
        gridManager: gridManager,
        onSuccess: reloadGrid,
        idFieldName: "nodeProcId"
    });
}

function updateNodeProcSequence() {
    var action = operateCfg.updateSequenceAction;
    DataUtil.updateSequence({
        action: action,
        gridManager: gridManager,
        onSuccess: reloadGrid,
        idFieldName: 'nodeProcId',
        seqFieldName: 'sequence'
    });
}

function reloadGrid() {
    var params = $("#queryMainForm").formToJSON();
    UICtrl.gridSearch(gridManager, params);
}