var gridManager, refreshFlag = false, operateCfg = {}, bizKindId, bizId;

$(function () {
    getQueryParameters();
    initializeOperateCfg();
    initializeUI();
    bindEvents();
    initializeGrid();

    function getQueryParameters() {
        bizKindId = Public.getQueryStringByName("bizKindId") || 0;
        bizId = Public.getQueryStringByName("bizId") || 0;
    }

    function initializeOperateCfg() {
        var actionPath = web_app.name + "/nodeVariableAction!";
        operateCfg.queryAction = actionPath + "slicedQueryNodeVariable.ajax";
        operateCfg.insertAction = actionPath + "insertNodeVariable.ajax";
        operateCfg.deleteAction = actionPath + "deleteNodeVariable.ajax";
        operateCfg.updateSequenceAction = actionPath
            + "updateNodeVariableSequence.ajax";
        operateCfg.showInsertAction = actionPath
            + "showVariableDefineDialog.do";

        operateCfg.showInsertTitle = "选择变量";
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
            deleteHandler: deleteNodeVariable,
            saveSortIDHandler: updateNodeVariableSequence
        };
        var toolbarOptions = UICtrl.getDefaultToolbarOptions(toolbarparam);

        gridManager = UICtrl.grid("#maingrid", {
            columns: [
                {
                    display: '编码',
                    name: 'variableCode',
                    width: 150,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                },
                {
                    display: '名称',
                    name: 'variableName',
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
                            + item.nodeVariableId
                            + "' class='textbox' value='"
                            + item.sequence + "' />";
                    }
                }
            ],
            title: '节点变量列表',
            dataAction: 'server',
            url: operateCfg.queryAction,
            parms: {
                bizKindId: bizKindId,
                bizId: bizId
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
            selectRowButtonOnly: true
        });

        UICtrl.setSearchAreaToggle(gridManager, false);
    }
});

function showInsertDialog() {
    parent.UICtrl.showFrameDialog({
        url: operateCfg.showInsertAction,
        title: operateCfg.showInsertTitle,
        param: {},
        width: PAUtil.dialogWidth,
        height: PAUtil.dialogHeight,
        ok: doSaveNodeVariable,
        close: reloadGrid
    });
}

function doSaveNodeVariable() {
    var data, variableDefineIds = [];
    if (!this.iframe || !this.iframe.contentWindow)
        return;

    data = this.iframe.contentWindow.getSelectedData();
    if (!data)
        return;

    for (var i = 0; i < data.length; i++) {
        if (data[i].variableDefineId)
            variableDefineIds[variableDefineIds.length] = data[i].variableDefineId;
    }

    var params = {
        bizId: bizId,
        bizKindId: bizKindId,
        variableDefineIds: $.toJSON(variableDefineIds)
    };

    var _self = this;
    Public.ajax(operateCfg.insertAction, params, function (data) {
        refreshFlag = true;
        _self.close();
    });
}

function deleteNodeVariable() {
    var action = operateCfg.deleteAction;
    DataUtil.del({
        action: action,
        gridManager: gridManager,
        onSuccess: reloadGrid,
        idFieldName: "nodeVariableId"
    });
}

function updateNodeVariableSequence() {
    var action = operateCfg.updateSequenceAction;
    DataUtil.updateSequence({
        action: action,
        gridManager: gridManager,
        onSuccess: reloadGrid,
        idFieldName: 'nodeVariableId',
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