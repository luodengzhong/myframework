var gridManager, refreshFlag = false, nodeTransactionId = 0, lastSelectedId = 0, bizId = 0, bizKindId = 0, operateCfg = {};

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

    function initializeOperateCfg() {
        var actionPath = web_app.name + "/nodeTransactionAction!";
        operateCfg.queryAction = actionPath + 'slicedQueryNodeTransaction.ajax';
        operateCfg.showInsertAction = actionPath
            + "showInsertNodeTransactionPage.do";

        operateCfg.insertAction = actionPath + 'insertNodeTransaction.ajax';
        operateCfg.deleteAction = actionPath + 'deleteNodeTransaction.ajax';
        operateCfg.updateSequenceAction = actionPath
            + "updateNodeTransactionSequence.ajax";

        operateCfg.showInsertTitle = "事务选择器";
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
            deleteHandler: deleteNodeTransaction,
            saveSortIDHandler: updateNodeTransactionSequence
        };
        var toolbarOptions = UICtrl.getDefaultToolbarOptions(toolbarparam);

        gridManager = UICtrl.grid("#maingrid", {
            columns: [
                {
                    display: '名称',
                    name: 'name',
                    width: 320,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                },
                {
                    display: '时限',
                    name: 'timeLimit',
                    width: 80,
                    minWidth: 60,
                    type: "string",
                    align: "right"
                },
                {
                    display: '描述',
                    name: 'description',
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
                            + item.nodeTransactionId
                            + "' class='textbox' value='"
                            + item.sequence + "' />";
                    }
                }
            ],
            dataAction: 'server',
            url: operateCfg.queryAction,
            parms: {
                bizId: bizId,
                bizKindId: bizKindId
            },
            title: '节点事务列表',
            usePager: true,
            rownumbers: true,
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

            }
        });

        UICtrl.setSearchAreaToggle(gridManager, false);
    }
});

function getId() {
    return parseInt($("#nodeTransactionId").val() || 0);
}

function showInsertDialog() {
    if (bizId <= 0) {
        Public.tip("未知的bizId:" + bizId);
        return;
    }
    parent.UICtrl.showFrameDialog({
        url: operateCfg.showInsertAction,
        title: operateCfg.showInsertTitle,
        param: {},
        width: PAUtil.dialogWidth,
        height: PAUtil.dialogHeight,
        ok: doSaveNodeTransaction,
        close: reloadGrid
    });
}

function doSaveNodeTransaction() {
    if (!this.iframe || !this.iframe.contentWindow)
        return;

    var data = this.iframe.contentWindow.getSelectedData();
    if (!data)
        return;

    var transactionDefineIds = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].transactionDefineId)
            transactionDefineIds[transactionDefineIds.length] = data[i].transactionDefineId;
    }

    var params = {
        bizId: bizId,
        bizKindId: bizKindId,
        transactionDefineIds: $.toJSON(transactionDefineIds)
    };

    var _self = this;
    Public.ajax(web_app.name + '/' + operateCfg.insertAction, params, function (data) {
        refreshFlag = true;
        _self.close();
    });
}

function deleteNodeTransaction() {
    var action = operateCfg.deleteAction;
    DataUtil.del({
        action: action,
        gridManager: gridManager,
        onSuccess: reloadGrid,
        idFieldName: "nodeTransactionId"
    });
}

function updateNodeTransactionSequence() {
    var action = operateCfg.updateSequenceAction;
    DataUtil.updateSequence({
        action: action,
        gridManager: gridManager,
        onSuccess: reloadGrid,
        idFieldName: 'nodeTransactionId',
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
