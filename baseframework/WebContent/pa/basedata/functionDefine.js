var gridManager, refreshFlag = false, nodeKindId, functionDefineId = 0, lastSelectedId = 0, parentId = -1, operateCfg = {};

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
        var actionPath = web_app.name + "/functionDefineAction!";
        operateCfg.queryAction = actionPath + 'slicedQueryFunctionDefine.ajax';
        operateCfg.showInsertAction = actionPath + "showInsertFunctionDefinePage.load";
        operateCfg.showUpdateAction = actionPath + 'showUpdateFunctionDefinePage.load';
        operateCfg.showMoveAction = actionPath + "showMoveFunctionDefinePage.do";

        operateCfg.insertAction = actionPath + 'insertFunctionDefine.ajax';
        operateCfg.updateAction = actionPath + 'updateFunctionDefine.ajax';
        operateCfg.deleteAction = actionPath + 'deleteFunctionDefine.ajax';
        operateCfg.queryAll = actionPath + "queryAllFunctionDefine.ajax";
        operateCfg.updateSequenceAction = actionPath + "updateFunctionDefineSequence.ajax";
        operateCfg.moveAction = actionPath + "moveFunctionDefine.ajax";

        operateCfg.showInsertTitle = "添加功能定义";
        operateCfg.showUpdateTitle = "修改功能定义";
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
            deleteHandler: deleteFunctionDefine,
            saveSortIDHandler: updateFunctionDefineSequence,
            moveHandler: moveFunctionDefine
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
                    display: '图标',
                    name: 'iconUrl',
                    width: 60,
                    minWidth: 60,
                    type: "string",
                    align: "center",
                    isAutoWidth: 0,
                    render: function (item) {
                        if (item.iconUrl)
                            return DataUtil
                                .getFunctionIcon(item.iconUrl);
                        else
                            return "";
                    }
                },
                {
                    display: '执行类型',
                    name: 'kindName',
                    sortName: 'kindId',
                    width: 70,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                },
                {
                    display: '参数值',
                    name: 'parameterValue',
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
                            + item.functionDefineId
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
                doShowUpdateDialog(data.functionDefineId, data.kindId);
            }
        });

        UICtrl.setSearchAreaToggle(gridManager, false);
    }
});

function getId() {
    return parseInt($("#functionDefineId").val() || 0);
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
            nodeKindId: ENodeKind.Data,
            sysFunId:0
        },
        width: 400,
        ok: doSaveFunctionDefine,
        close: reloadGrid
    });
}

function doShowUpdateDialog(functionDefineId, kindId) {
    UICtrl.showAjaxDialog({
        url: operateCfg.showUpdateAction,
        param: {
            id: functionDefineId
        },
        title: operateCfg.showUpdateTitle,
        width: 400,
        ok: doSaveFunctionDefine,
        close: reloadGrid,
        init: function () {
            setSysFunUI(kindId);
        }
    });
}

function showUpdateDialog() {
    var row = gridManager.getSelectedRow();
    if (!row) {
        Public.tip("请选择数据！");
        return;
    }
    doShowUpdateDialog(row.functionDefineId, row.kindId);
}

function doSaveFunctionDefine() {
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

function deleteFunctionDefine() {
    var action = operateCfg.deleteAction;
    DataUtil.del({
        action: action,
        gridManager: gridManager,
        onSuccess: reloadGrid,
        idFieldName: "functionDefineId"
    });
}

function updateFunctionDefineSequence() {
    var action = operateCfg.updateSequenceAction;
    DataUtil.updateSequence({
        action: action,
        gridManager: gridManager,
        onSuccess: reloadGrid,
        idFieldName: 'functionDefineId',
        seqFieldName: 'sequence'
    });
}

function moveFunctionDefine() {
    var rows = gridManager.getSelecteds();
    if (!rows || rows.length < 1) {
        Public.tip('请选择要移动的数据!');
        return;
    }

    UICtrl.showFrameDialog({
        url: operateCfg.showMoveAction,
        title: operateCfg.showMoveTitle,
        param: {
            item: EBaseDataItem.FunctionDefine
        },
        width: 350,
        height: 400,
        ok: doMoveFunctionDefine,
        close: onDialogCloseHandler
    });
}

function doMoveFunctionDefine() {
    var fn = this.iframe.contentWindow.getSelectedTreeNodeData;
    var data = fn();
    if (!data) {
        return;
    }
    var ids = DataUtil.getSelectedIds({
        gridManager: gridManager,
        idFieldName: "functionDefineId"
    });

    if (!ids)
        return;

    var _self = this;
    var params = {};
    params.parentId = data.functionDefineId;
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
        idFieldName: 'functionDefineId',
        title: '功能定义分类',
        onClick: function (node) {
            if (!node || !node.data)
                return;
            parentId = node.data.nodeId == 0 ? -1 : node.data.nodeId;
            // gridManager.options.parms.parentId = parentId;
            gridManager.options.parms.fullId = node.data.fullId;

            if (node.data.nodeId == 0) {
                $('.l-layout-center .l-layout-header').html("功能定义列表");
            } else {
                $('.l-layout-center .l-layout-header')
                    .html("<font style=\"color:Tomato;font-size:13px;\">["
                        + node.data.name + "]</font>功能定义列表");
            }
            reloadGrid2();
        },
        onFormInit: function () {
            $('#sysFunId').val(0);
            $('#sysFunName').parent().parent().parent().hide();
            $('#iconUrl').parent().parent().parent().hide();
            $('#kindId1').parent().parent().hide();
            $('#parameterValue').parent().parent().hide();
        }
    });
}

// 选择功能点图标
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
    html.push('<p><input type="button" value="确 定" class="buttonGray" style="display:',
        display, '" id="nowChooseBut"/></p>');
    html.push('</div>');
    html.push('</div>');
    Public.dialog({
        title: '选择功能图片',
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

function checkMemu(n, d) {
    $('#parameterValue').val(d.url);
    $('#description').val(d.description);
    $('#name').val(d.name);
    $('#code').val(d.code);
    $('#iconUrl').val(d.icon);
}

function kindIdChange(el) {
    var kindId = parseInt($(el).val());
    setSysFunUI(kindId);
}

function setSysFunUI(kindId) {
    if (EFunctionDefineKind.Page == kindId) {
        $('#sysFunName').parent().parent().parent().show();
    } else {
        $('#sysFunName').parent().parent().parent().hide();
        $('#sysFunId').val(0);
        $('#sysFunName').val("");
    }
}