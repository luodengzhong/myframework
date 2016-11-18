var gridManager, refreshFlag = false, nodeKindId, nodeDefineId = 0, lastSelectedId = 0, parentId = -1, operateCfg = {};

$(function () {
    initializeOperateCfg();
    bindEvents();
    loadTree();
    initializeUI();
    initializeGrid();

    function initializeOperateCfg() {
        var actionPath = web_app.name + "/nodeDefineAction!";
        operateCfg.queryAction = actionPath + 'slicedQueryNodeDefine.ajax';
        operateCfg.showInsertAction = actionPath
            + "showInsertNodeDefinePage.load";
        operateCfg.showUpdateAction = actionPath
            + 'showUpdateNodeDefinePage.load';

        operateCfg.showMoveAction = actionPath + 'showMoveNodeDefinePage.do';

        operateCfg.insertAction = actionPath + 'insertNodeDefine.ajax';
        operateCfg.updateAction = actionPath + 'updateNodeDefine.ajax';
        operateCfg.deleteAction = actionPath + 'deleteNodeDefine.ajax';
        operateCfg.queryAll = actionPath + "queryAllNodeDefine.ajax";
        operateCfg.updateSequenceAction = actionPath
            + "updateNodeDefineSequence.ajax";
        operateCfg.moveAction = actionPath + "moveNodeDefine.ajax";
        operateCfg.showNodeManage = actionPath + "showNodeManagePage.do";

        operateCfg.showInsertTitle = "添加节点定义";
        operateCfg.showUpdateTitle = "修改节点定义";
        operateCfg.showMoveTitle = "移动节点对话框";
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
            deleteHandler: deleteNodeDefine,
            saveSortIDHandler: updateNodeDefineSequence,
            moveHandler: moveNodeDefine
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
                    display: '简称',
                    name: 'shortName',
                    width: 100,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                },
                {
                    display: '图标',
                    name: 'iconUrl',
                    width: 60,
                    minWidth: 60,
                    type: "string",
                    align: "center",
                    isAutoWidth: 0,
                    render: function (item) {
                        if (item.iconUrl)
                            return DataUtil.getFunctionIcon(item.iconUrl);
                        else
                            return "";
                    }
                },
                {
                    display: '执行次数',
                    name: 'executionNum',
                    width: 80,
                    minWidth: 60,
                    type: "string",
                    align: "right"
                },
                {
                    display: '时限(天)',
                    name: 'timeLimit',
                    width: 80,
                    minWidth: 60,
                    type: "string",
                    align: "right"
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
                            + item.nodeDefineId
                            + "' class='textbox' value='"
                            + item.sequence + "' />";
                    }
                },
                {
                    display: "操作",
                    width: 80,
                    minWidth: 80,
                    isAllowHide: false,
                    render: function (item) {
                        return "<a class='GridStyle' href='javascript:void(null);' onclick=\"doShowNodeManageDialog("
                            + item.nodeDefineId
                            + ",'"
                            + item.shortName
                            + "')\">节点管理</a>";
                    }
                }
            ],
            dataAction: 'server',
            url: operateCfg.queryAction,
            parms: {
                parentId: -1,
                nodeKindId: ENodeKind.Data
            },
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
                doShowUpdateNodeDefineDialog(data.nodeDefineId);
                // doShowNodeManageDialog(data.nodeDefineId,
                // data.shortName);
            }
        });

        UICtrl.setSearchAreaToggle(gridManager, false);
    }
});

function getId() {
    return parseInt($("#nodeDefineId").val() || 0);
}

function showInsertDialog() {
    if (parentId < 0) {
        Public.tip("请选择分类");
        return;
    }
    UICtrl.showAjaxDialog({
        url: operateCfg.showInsertAction,
        title: operateCfg.showInsertTitle,
        param: {
            parentId: parentId,
            nodeKindId: ENodeKind.Data,
            timeLimit: 0,
            executionNum: 0
        },
        width: 400,
        ok: doSaveNodeDefine,
        close: reloadGrid
    });
}

function doShowNodeManageDialog(nodeDefineId, name) {
    parent.addTabItem({
        tabid: 'NodeManage' + nodeDefineId,
        text: '[' + name + ']节点管理',
        url: operateCfg.showNodeManage + '?bizId=' + nodeDefineId
            + '&bizKindId=' + ENodeBizKind.NodeDefine
    });
}

function doShowUpdateNodeDefineDialog(nodeDefineId) {
    UICtrl.showAjaxDialog({
        url: operateCfg.showUpdateAction,
        param: {
            id: nodeDefineId
        },
        title: operateCfg.showUpdateTitle,
        width: 400,
        ok: doSaveNodeDefine,
        close: reloadGrid
    });
}

function showUpdateDialog() {
    var row = gridManager.getSelectedRow();
    if (!row) {
        Public.tip("请选择数据！");
        return;
    }
    doShowUpdateNodeDefineDialog(row.nodeDefineId);
}

function doSaveNodeDefine() {
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

function deleteNodeDefine() {
    var action = operateCfg.deleteAction;
    DataUtil.del({
        action: action,
        gridManager: gridManager,
        onSuccess: reloadGrid,
        idFieldName: "nodeDefineId"
    });
}

function updateNodeDefineSequence() {
    var action = operateCfg.updateSequenceAction;
    DataUtil.updateSequence({
        action: action,
        gridManager: gridManager,
        onSuccess: reloadGrid,
        idFieldName: 'nodeDefineId',
        seqFieldName: 'sequence'
    });
}

function moveNodeDefine() {
    var rows = gridManager.getSelecteds();
    if (!rows || rows.length < 1) {
        Public.tip('请选择要移动的数据!');
        return;
    }

    UICtrl.showFrameDialog({
        url: operateCfg.showMoveAction,
        title: operateCfg.showMoveTitle,
        param: {
            item: EBaseDataItem.NodeDefine
        },
        width: 350,
        height: 400,
        ok: doMoveNodeDefine,
        close: onDialogCloseHandler
    });
}

function doMoveNodeDefine() {
    var fn = this.iframe.contentWindow.getSelectedTreeNodeData;
    var data = fn();
    if (!data) {
        return;
    }
    var ids = DataUtil.getSelectedIds({
        gridManager: gridManager,
        idFieldName: "nodeDefineId"
    });

    if (!ids)
        return;

    var _self = this;
    var params = {};
    params.parentId = data.nodeDefineId;
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
        idFieldName: 'nodeDefineId',
        title: '节点定义分类',
        onClick: function (node) {
            if (!node || !node.data)
                return;

            parentId = node.data.nodeId == 0 ? -1 : node.data.nodeId;
            gridManager.options.parms.fullId = node.data.fullId;

            if (node.data.nodeId == 0) {
                $('.l-layout-center .l-layout-header').html("节点定义列表");
            } else {
                $('.l-layout-center .l-layout-header')
                    .html("<font style=\"color:Tomato;font-size:13px;\">["
                        + node.data.name + "]</font>节点定义列表");
            }
            reloadGrid2();
        },
        onFormInit: function () {
            $('#iconUrl').parent().parent().parent().hide();
            $('#startMode1').parent().parent().hide();
            $('#executionNum').parent().parent().parent().hide();
            $('#timeLimit').parent().parent().parent().hide();
            $('#timeLimit').val(0);
            $('#executionNum').val(0);
            $('#iconUrl').val("");
        }
    });
}

/**
 * 选择功能点图标
 */
function chooseImg() {
    var imgUrl = '/desktop/images/functions/';
    var nowChooseImg = $('#iconUrl').val(), display = nowChooseImg == ''
        ? "none"
        : "";
    var html = ['<div id="showImgMain">'];
    html.push('<div id="showFunctionImgs"></div>');
    html.push('<div id="showChooseOk">');
    html.push('<input type="hidden" value="', nowChooseImg,
        '" id="nowChooseValue">');
    html.push('<p><img src="', web_app.name, nowChooseImg, '" style="display:',
        display, '" width="68" height="68" id="nowChooseImg"/></p>');
    html
        .push(
        '<p><input type="button" value="确 定" class="buttonGray" style="display:',
        display, '" id="nowChooseBut"/></p>');
    html.push('</div>');
    html.push('</div>');
    Public.dialog({
        title: '选择节点图片',
        content: html.join(''),
        width: 540,
        opacity: 0.1,
        onClick: function ($clicked) {
            if ($clicked.is('img')) {
                var icon = $clicked.parent().attr('icon');
                $('#nowChooseImg').attr('src',
                        web_app.name + imgUrl + icon).show();
                $('#nowChooseBut').show();
                $('#nowChooseValue').val(imgUrl + icon);
            } else if ($clicked.is('input')) {// 点击按钮
                $('#iconUrl').val($('#nowChooseValue').val());
                this.close();
            }
        }
    });
    setTimeout(function () {
        $('#showFunctionImgs').scrollLoad({
            url: web_app.name
                + '/permissionAction!getFunctionImgList.ajax',
            itemClass: 'functionImg',
            size: 20,
            scrolloffset: 70,
            onLoadItem: function (obj) {
                var imgHtml = ['<div class="functionImg" icon="', obj,
                    '">'];
                imgHtml.push('<img src="', web_app.name, imgUrl, obj,
                    '"  width="64" height="64"/>');
                imgHtml.push('</div>');
                return imgHtml.join('');
            }
        });
    }, 0);
}