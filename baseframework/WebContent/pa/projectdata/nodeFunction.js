var gridManager, refreshFlag = false, nodeFunctionId = 0, lastSelectedId = 0, bizId = 0, bizKindId = 0, operateCfg = {},executionNodeList;

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
        var actionPath = web_app.name + "/nodeFunctionAction!";
        operateCfg.queryAction = actionPath + 'slicedQueryNodeFunction.ajax';
        operateCfg.showInsertAction = actionPath + "showInsertNodeFunctionPage.do";

        operateCfg.insertAction = actionPath + 'insertNodeFunction.ajax';
        operateCfg.deleteAction = actionPath + 'deleteNodeFunction.ajax';
        operateCfg.updateSequenceAction = actionPath + "updateNodeFunctionSequence.ajax";

        operateCfg.updateExecutionNodeAction = actionPath + "updateNodeFunctionExecutionNode.ajax";

        operateCfg.showNodeManage = web_app.name + "/nodeDefineAction!showNodeManagePage.do";

        operateCfg.showInsertTitle = "功能选择器";
    }

    function initializeUI() {
        UICtrl.initDefaulLayout();
        executionNodeList = $("#executionNodeId").combox("getFormattedData");
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
            deleteHandler: deleteNodeFunction,
            saveSortIDHandler: updateNodeFunctionSequence
        };
        var toolbarOptions = UICtrl.getDefaultToolbarOptions(toolbarparam);

        toolbarOptions.items[toolbarOptions.items.length] = {
            id : 'updateNodeEventExecutionNode',
            text : '保存执行节点',
            img : web_app.name + '/themes/default/images/icons/note.gif',
            click : updateNodeFunctionExecutionNode
        };

        toolbarOptions.items[toolbarOptions.items.length] = {
            id : "line",
            line : true
        };

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
                    display: "排序号",
                    name: "sequence",
                    width: 60,
                    minWidth: 60,
                    type: "int",
                    align: "left",
                    render: function (item) {
                        return "<input type='text' id='txtSequence_"
                            + item.nodeFunctionId
                            + "' class='textbox' value='"
                            + item.sequence + "' />";
                    }
                },
                {
                    display : "执行节点",
                    name : "executionNode",
                    width : 120,
                    minWidth : 120,
                    type : "int",
                    align : "left",
                    render : function(item) {
                        var executionNodeControl = "";

                        if (executionNodeList != null
                            && executionNodeList.length > 0) {
                            executionNodeControl = "<select id='slExecutionNode_"
                            + item.nodeFunctionId
                            + "' style='width:100%;height:22px; margin-top:1px;'>";
                            for (var i = 0; i < executionNodeList.length; i++) {

                                var selected = (executionNodeList[i].value == item.noticeTypeId
                                    ? 'selected="true"'
                                    : '');
                                executionNodeControl += '<option value="'
                                + executionNodeList[i].value + '" '
                                + selected + '>'
                                + executionNodeList[i].text
                                + '</option>';
                            }
                            executionNodeControl += "</select>";
                        }
                        return executionNodeControl;
                    }
                },
                {
                    display: "操作",
                    width: 70,
                    minWidth: 70,
                    isAllowHide: false,
                    render: function (item) {
                        return "<a class='GridStyle' href='javascript:void(null);' onclick=\"showRightManagePage("
                            + item.nodeFunctionId
                            + ",'"
                            + item.name
                            + "')\">任务接收人</a>";
                    }
                }
            ],
            dataAction: 'server',
            url: operateCfg.queryAction,
            parms: {
                bizId: bizId,
                bizKindId: bizKindId
            },
            title: '节点功能列表',
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

function updateNodeFunctionExecutionNode(){
    var data = gridManager.getData();
    if (!data || data.length < 1) {
        Public.tip("没有数据，无法保存!");
        return;
    }
    var updateRowCount = 0;
    var idFieldName = "nodeFunctionId";
    var fieldName = "noticeTypeId";
    var params = new Map();
    for (var i = 0; i < data.length; i++) {
        var slExecutionNode = "#slExecutionNode_" + data[i][idFieldName];
        var executionNodeValue = $.trim($(slExecutionNode).val());
        if (executionNodeValue == "") {
            Public.tip("请输入执行节点.");
            $(slExecutionNode).focus();
            return;
        }
        if (data[i][fieldName] != executionNodeValue) {
            params.put(data[i][idFieldName], executionNodeValue);
            updateRowCount++;
        }
    }

    if (updateRowCount == 0) {
        Public.tip("没有数据修改!");
        return;
    }
    Public.ajax(operateCfg.updateExecutionNodeAction, {
        data : params.toString()
    }, function(data) {
        reloadGrid();
    });
}

function getId() {
    return parseInt($("#nodeFunctionId").val() || 0);
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
        ok: doSaveNodeFunction,
        close: reloadGrid
    });
}

function doSaveNodeFunction() {
    if (!this.iframe || !this.iframe.contentWindow)
        return;

    var data = this.iframe.contentWindow.getSelectedData();
    if (!data)
        return;

    var functionDefineIds = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].functionDefineId)
            functionDefineIds[functionDefineIds.length] = data[i].functionDefineId;
    }

    var params = {
        bizId: bizId,
        bizKindId: bizKindId,
        functionDefineIds: $.toJSON(functionDefineIds)
    };

    var _self = this;
    Public.ajax(web_app.name + '/' + operateCfg.insertAction, params, function (data) {
        refreshFlag = true;
        _self.close();
    });
}

function deleteNodeFunction() {
    var action = operateCfg.deleteAction;
    DataUtil.del({
        action: action,
        gridManager: gridManager,
        onSuccess: reloadGrid,
        idFieldName: "nodeFunctionId"
    });
}

function updateNodeFunctionSequence() {
    var action = operateCfg.updateSequenceAction;
    DataUtil.updateSequence({
        action: action,
        gridManager: gridManager,
        onSuccess: reloadGrid,
        idFieldName: 'nodeFunctionId',
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

function showRightManagePage(id, name) {
    var url = operateCfg.showNodeManage + '?bizId=' + id + '&bizKindId='
        + ENodeBizKind.NodeFunction;

    top.addTabItem({
        tabid: 'NodeManage' + id,
        text: '[' + name + ']任务接收人',
        url: url
    });
}