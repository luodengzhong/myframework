var gridManager, permissionGridManager, refreshFlag = false, nodeKindId, documentClassificationId = 0, lastSelectedId = 0, parentId = -1, operateCfg = {}, itemId = 1;

$(function () {
    initializeOperateCfg();
    bindEvents();
    initializeUI();
    loadTree();
    initializeGrid();
    initializePermissionGrid();

    function initializeOperateCfg() {
        var actionPath = web_app.name + "/documentClassificationAction!";
        operateCfg.queryAction = actionPath + 'slicedQueryDocumentClassification.ajax';
        operateCfg.showInsertAction = actionPath + "showInsertDocumentClassificationPage.load";
        operateCfg.showUpdateAction = actionPath + 'showUpdateDocumentClassificationPage.load';
        operateCfg.showMoveAction = actionPath + "showMoveDocumentClassificationPage.do";

        operateCfg.insertAction = actionPath + 'insertDocumentClassification.ajax';
        operateCfg.updateAction = actionPath + 'updateDocumentClassification.ajax';
        operateCfg.updateSequenceAction = actionPath + "updateDocumentClassificationSequence.ajax";
        operateCfg.moveAction = actionPath + "moveDocumentClassification.ajax";
        operateCfg.deleteAction = actionPath + 'deleteDocumentClassification.ajax';
        operateCfg.queryAll = actionPath + "queryAllDocumentClassification.ajax";

        operateCfg.showBaseSelectDialog = actionPath + "showResourcePermissionAllocationPage.do";
        operateCfg.insertResourcePermission = actionPath + "insertResourcePermission.ajax";
        operateCfg.deleteResourcePermission = actionPath + "deleteResourcePermission.ajax";
        operateCfg.queryResourcePermissionAction = actionPath + "slicedResourcePermission.ajax";
        /*
         * operateCfg.queryResourcePermissionRoleAction =
         * actionPath +
         * "slicedResourcePermissionRole.ajax";
         */

        operateCfg.showInsertTitle = "添加文档类别";
        operateCfg.showUpdateTitle = "修改文档类别";
        operateCfg.showMoveTitle = "移动文档类别对话框";
        operateCfg.showBaseSelectDialogTitle = "权限分配";
    }

    function bindEvents() {
        $("#btnQuery").click(function () {
            var params = $(this.form).formToJSON();
            UICtrl.gridSearch(gridManager, params);
        });

        $("#btnQueryPermission").click(function () {
            if (documentClassificationId <= 0) {
                Public.tip("请选择文档类别");
                return;
            }
            var params = $(this.form).formToJSON();
            UICtrl.gridSearch(permissionGridManager, params);
        });
    }

    function initializeUI() {
        UICtrl.autoSetWrapperDivHeight();
        UICtrl.layout("#layout", {
            leftWidth: 200,
            heightDiff: -5,
            rightWidth: 400,
            allowRightCollapse: false,
            space: 2
        });

        $("#objectKindId").combox({
            onChange: function (o) {
                refreshResourcePermission();
            }
        });
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
            idFieldName: 'documentClassificationId',
            title: '文档类别分类',
            onClick: function (node) {
                if (!node || !node.data)
                    return;
                parentId = node.data.nodeId == 0 ? -1 : node.data.nodeId;
                gridManager.options.parms.fullId = node.data.fullId;

                if (node.data.nodeId == 0) {
                    $('.l-layout-center .l-layout-header').html("文档类别列表");
                } else {
                    $('.l-layout-center .l-layout-header')
                        .html("<font style=\"color:Tomato;font-size:13px;\">["
                            + node.data.name + "]</font>文档类别列表");
                }
                reloadGrid();
            },
            onFormInit: function () {
                $('#hasUpload1').parent().parent().hide();
            }
        });
    }

    function initializeGrid() {
        UICtrl.autoSetWrapperDivHeight();
        var toolbarparam = {
            addHandler: showInsertDialog,
            updateHandler: showUpdateDialog,
            deleteHandler: deleteDocumentClassification,
            saveSortIDHandler: updateDocumentClassificationSequence,
            moveHandler: moveDocumentClassification
        };
        var toolbarOptions = UICtrl.getDefaultToolbarOptions(toolbarparam);

        gridManager = UICtrl.grid("#maingrid", {
            columns: [
                {
                    display: '编码',
                    name: 'code',
                    width: 60,
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
                    display: '描述',
                    name: 'description',
                    width: 150,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                },
                {
                    display: '是否必须上传',
                    name: 'hasUpload',
                    width: 90,
                    minWidth: 90,
                    type: "int",
                    align: "center",
                    render: function (item) {
                        return "<div class='"
                            + (item.hasUpload ? "Yes" : "No")
                            + "'/>";
                    }
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
                            + item.documentClassificationId
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
            usePager: true,
            sortName: "sequence",
            SortOrder: "asc",
            toolbar: toolbarOptions,
            width: '99%',
            height: '100%',
            heightDiff: -10,
            headerRowHeight: 25,
            rowHeight: 25,
            rownumbers: true,
            fixedCellHeight: true,
            selectRowButtonOnly: false,
            onDblClickRow: function (data, rowindex, rowobj) {
                doShowUpdateDialog(data.documentClassificationId);
            },
            onSelectRow: function (data, rowindex, rowobj) {
                documentClassificationId = data.documentClassificationId;
                $("#documentClassificationId")
                    .val(documentClassificationId);
                refreshResourcePermission();
            }
        });

        UICtrl.setSearchAreaToggle(gridManager, false);
    }

    function initializePermissionGrid() {
        var toolbarOptions = UICtrl.getDefaultToolbarOptions({
            addHandler: function () {
                if (documentClassificationId <= 0) {
                    Public.tip("请选择文档类别！");
                    return;
                }
                itemId = $('#objectKindId').val();
                // 获取请求Url和参数
                var url = '', param = {}, displayableOrgKind = "", selectableOrgKind = "";
                switch (parseInt(itemId)) {
                    case EOrgObjectKind.Person :
                        displayableOrgKind = "ogn,dpt,pos,psm,fld,prj,grp";
                        selectableOrgKind = "psm";
                        break;
                    case EOrgObjectKind.Role :
                        break;
                    case EOrgObjectKind.Position :
                        displayableOrgKind = "ogn,dpt,pos";
                        selectableOrgKind = "pos";
                        break;
                    case EOrgObjectKind.Dept :
                        displayableOrgKind = "ogn,dpt";
                        selectableOrgKind = "dpt";
                        break;
                }
                // 设置url和params
                switch (parseInt(itemId)) {
                    case EOrgObjectKind.Role :
                        url = web_app.name
                            + '/permissionAction!showSelectRoleDialog.do';
                        break;
                    case EOrgObjectKind.Dept :
                    case EOrgObjectKind.Position :
                    case EOrgObjectKind.Person :
                        url = web_app.name
                            + '/orgAction!showSelectOrgDialog.do';
                        param.filter = "";
                        param.multiSelect = false;
                        param.parentId = "orgRoot";
                        param.manageCodes = "";
                        param.displayableOrgKinds = displayableOrgKind; // 需要加载的
                        param.selectableOrgKinds = selectableOrgKind; // 能够选择的
                        param.showDisabledOrg = false;
                        param.listMode = false;
                        param.showCommonGroup = false;
                        param.cascade = true;
                        break;
                    case EOrgObjectKind.BaseFunctionType :
                        return;
                }

                UICtrl.showFrameDialog({
                    url: url,
                    title: operateCfg.showBaseSelectDialogTitle,
                    param: param,
                    width: 700,
                    height: 400,
                    ok: doResourcePermission,
                    close: refreshResourcePermission
                });
            },
            deleteHandler: function () {
                var rows = permissionGridManager.getSelectedRows();
                if (!rows) {
                    Public.tip("请选择数据！");
                }

                DataUtil.del({
                    action: operateCfg.deleteResourcePermission,
                    gridManager: permissionGridManager,
                    onSuccess: refreshResourcePermission,
                    idFieldName: "resourcePermissionId"
                });
            }
        });

        permissionGridManager = UICtrl.grid("#permissiongrid", {
            columns: [
                {
                    display: '名称',
                    name: 'name',
                    width: 150,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                },
                {
                    display: '全路径',
                    name: 'fullName',
                    width: 150,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                }
            ],
            dataAction: "server",
            url: operateCfg.queryResourcePermissionAction,
            parms: {
                objectKindId: 0
            },
            pageSize: 20,
            width: '100%',
            height: "100%",
            heightDiff: -10,
            headerRowHeight: 25,
            rowHeight: 25,
            toolbar: toolbarOptions,
            checkbox: true,
            sortName: 'sequence',
            sortOrder: 'asc',
            fixedCellHeight: true,
            selectRowButtonOnly: true,
            onLoadData: function () {
            }
        });

        UICtrl.setSearchAreaToggle(permissionGridManager,
            "queryPermissionTable", false);
    }
});

function getId() {
    return parseInt($("#documentClassificationId").val() || 0);
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
        ok: doSaveDocumentClassification,
        close: reloadGrid
    });
}

function doShowUpdateDialog(documentClassificationId) {
    UICtrl.showAjaxDialog({
        url: operateCfg.showUpdateAction,
        param: {
            id: documentClassificationId
        },
        title: "修改文档类别",
        width: 400,
        ok: doSaveDocumentClassification,
        close: reloadGrid
    });
}

function showUpdateDialog() {
    var row = gridManager.getSelectedRow();
    if (!row) {
        Public.tip("请选择数据！");
        return;
    }
    doShowUpdateDialog(row.documentClassificationId);
}

function doSaveDocumentClassification() {
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

function deleteDocumentClassification() {
    var action = operateCfg.deleteAction;
    DataUtil.del({
        action: action,
        gridManager: gridManager,
        onSuccess: reloadGrid,
        idFieldName: "documentClassificationId"
    });
}

function updateDocumentClassificationSequence() {
    var action = operateCfg.updateSequenceAction;
    DataUtil.updateSequence({
        action: action,
        gridManager: gridManager,
        onSuccess: reloadGrid,
        idFieldName: 'documentClassificationId',
        seqFieldName: 'sequence'
    });
}

function moveDocumentClassification() {
    var rows = gridManager.getSelecteds();
    if (!rows || rows.length < 1) {
        Public.tip('请选择要移动的数据!');
        return;
    }

    UICtrl.showFrameDialog({
        url: operateCfg.showMoveAction,
        title: operateCfg.showMoveTitle,
        param: {
            item: EBaseDataItem.DocumentClassification
        },
        width: 350,
        height: 400,
        ok: doMoveDocumentClassification,
        close: onDialogCloseHandler
    });
}

function doMoveDocumentClassification() {
    var fn = this.iframe.contentWindow.getSelectedTreeNodeData;
    var data = fn();
    if (!data) {
        return;
    }
    var ids = DataUtil.getSelectedIds({
        gridManager: gridManager,
        idFieldName: "documentClassificationId"
    });

    if (!ids)
        return;

    var _self = this;
    var params = {};
    params.parentId = data.documentClassificationId;
    params.ids = $.toJSON(ids);
    Public.ajax(operateCfg.moveAction, params, function () {
        refreshFlag = true;
        _self.close();
    });
    reloadGrid();
}

function doResourcePermission() {
    var data;
    if (parseInt(itemId) == EOrgObjectKind.Role) {
        var fn = this.iframe.contentWindow.getRoleData;
        data = fn();
    } else {
        data = this.iframe.contentWindow.selectedData;
    }

    if (data.length == 0) {
        Public.errorTip("请选择数据。");
        return;
    }

    var ids = [];
    for (var i = 0; i < data.length; i++) {
        ids[ids.length] = data[i].id;
    }

    var _self = this;
    var params = {};
    params.objectKindId = itemId;
    params.documentClassificationId = documentClassificationId;
    params.objectId = $.toJSON(ids);

    Public.ajax(operateCfg.insertResourcePermission, params, function () {
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
    var params = $("#queryMainForm").formToJSON();
    UICtrl.gridSearch(gridManager, params);
}

function refreshResourcePermission() {
    var objectKindId = $('#objectKindId').val();
    permissionGridManager.options.parms.documentClassificationId = documentClassificationId;
    permissionGridManager.options.parms.objectKindId = objectKindId;

    permissionGridManager.loadData();

    if (objectKindId == EOrgObjectKind.BaseFunctionType) {
        $('#permissiongrid #toolbar_menuAdd').comboDialog({
            type: 'opm',
            name: 'selectBaseFunctonType',
            width: 480,
            dataIndex: 'id',
            title: "基础职能角色",
            checkbox: true,
            onShow: function () {
                var objectKindId = parseInt($("#objectKindId").val() || 0);
                var rows = gridManager.getSelecteds();
                if (objectKindId != EOrgObjectKind.BaseFunctionType || !rows || rows.length < 1) {
                    return false;
                }

                return true;
            },
            onChoose: function () {
                var baseFunctionTypeData = this.getSelectedRows();

                if (baseFunctionTypeData == null) {
                    Public.errorTip("基础职能角色。");
                    return;
                }
                // 组装基础职能角色
                var baseFunctionTypeIds = [];
                $.each(baseFunctionTypeData, function (i, o) {
                    baseFunctionTypeIds.push(o.id);
                });
                // 保存数据
                var params = {};
                params.objectKindId = itemId;
                params.documentClassificationId = documentClassificationId;
                params.objectId = $.toJSON(baseFunctionTypeIds);

                var url = operateCfg.insertResourcePermission;
                Public.ajax(url, params, function () {
                    permissionGridManager.loadData();
                });

                return true;
            }
        });
    }
}