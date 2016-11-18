var gridManager, refreshFlag = false, nodeKindId, nodeDefineId = 0, lastSelectedId = 0, parentId = -1, operateCfg = {};

$(function () {
    initializeOperateCfg();
    bindEvents();
    initializeUI();
    initializeGrid();

    function initializeOperateCfg() {
        var actionPath = web_app.name + "/nodePermissionAction!";
        operateCfg.queryAction = actionPath + 'slicedQueryNodePermissionForReceive.ajax';
        operateCfg.queryBaseFunctionAction = actionPath + 'slicedQueryNodePermissionForBaseFunction.ajax';
        operateCfg.deleteAction = actionPath + "deleteNodePermission.ajax";
        operateCfg.updateTaskReceive = actionPath + "updateNodePermissionObjectId.ajax";

        operateCfg.showOrgTitle = "组织机构对话框";
    }

    function initializeUI() {
        UICtrl.initDefaulLayout();

        $("#objectKindId").combox({
            onChange: function (o) {
                refreshResourcePermission();
            }
        });
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
            deleteHandler: deleteNodePermission
        };
        var toolbarOptions = UICtrl.getDefaultToolbarOptions(toolbarparam);
        toolbarOptions.items[toolbarOptions.items.length] = {
            id: 'updateTaskReceive',
            text: '更改接收人',
            img: 'themes/default/images/icons/cut.gif',
            click: updateTaskReceive
        };

        gridManager = UICtrl.grid("#maingrid", {
            columns: [
                {
                    display: '项目名称',
                    name: 'projectName',
                    width: 100,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                },
                {
                    display: '节点名称',
                    name: 'projectNodeName',
                    width: 150,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                },
                {
                    display: '功能名称',
                    name: 'projectNodeFunctionName',
                    width: 100,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                },
                {
                    display: '人员名称',
                    name: 'objectName',
                    width: 100,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                },
                {
                    display: '全路径',
                    name: 'fullName',
                    width: 200,
                    minWidth: 60,
                    type: "string",
                    align: "left"
                }
            ],
            dataAction: 'server',
            url: operateCfg.queryAction,
            parms: {objectKindId: EOrgObjectKind.Person},
            usePager: true,
            rownumbers: true,
            sortName: "projectName",
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

/*function getId() {
 return parseInt($("#nodeDefineId").val() || 0);
 }*/


function deleteNodePermission() {
    var action = operateCfg.deleteAction;
    DataUtil.del({
        action: action,
        gridManager: gridManager,
        onSuccess: reloadGrid,
        idFieldName: "nodePermissionId"
    });
}

function updateTaskReceive() {
    var rows = gridManager.getSelecteds();
    if (!rows || rows.length < 1) {
        Public.tip('请选择要更改的数据!');
        return;
    }

    var param = {}, displayableOrgKind, selectableOrgKind;
    var objectKindId = parseInt($("#objectKindId").val() || 0);
    if (objectKindId == EOrgObjectKind.BaseFunctionType) {
        return;
    }
    
    switch (objectKindId) {
        case EOrgObjectKind.Person :
            displayableOrgKind = "ogn,dpt,pos,psm,fld,prj,grp";
            selectableOrgKind = "psm";
            break;
        case EOrgObjectKind.Position :
            displayableOrgKind = "ogn,dpt,pos";
            selectableOrgKind = "pos";
            break;
    }

    param.filter = "";
    param.multiSelect = false;
    param.parentId = "orgRoot";
    param.manageCodes = "";
    param.displayableOrgKinds = displayableOrgKind;// 需要加载的
    param.selectableOrgKinds = selectableOrgKind; // 能够选择的
    param.showDisabledOrg = false;
    param.listMode = false;
    param.showCommonGroup = false;
    param.cascade = true;

    parent.UICtrl.showFrameDialog({
        url: web_app.name + '/orgAction!showSelectOrgDialog.do',
        title: operateCfg.showOrgTitle,
        param: param,
        width: PAUtil.dialogWidth,
        height: PAUtil.dialogHeight,
        ok: doSaveNodePermission,
        close: reloadGrid
    });
}

function doSaveNodePermission() {
    var data, objectId;

    if (!this.iframe || !this.iframe.contentWindow)
        return;

    data = this.iframe.contentWindow.selectedData;
    if (!data)
        return;
    if (data.length != 1) {
        this.iframe.contentWindow.Public.tip("只能选择一个！");
        return;
    } else {
        objectId = data[0].id;
    }

    var _self = this;
    Public.ajax(operateCfg.updateTaskReceive, getParams(objectId), function (data) {
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

function getParams(objectId) {
    var options = {
        gridManager: gridManager,
        idFieldName: "nodePermissionId"
    };
    var nodePermissionIds = DataUtil.getSelectedIds(options);
    var params = {
        objectId: objectId,
        nodePermissionIds: $.toJSON(nodePermissionIds)
    };

    return params;
}

function refreshResourcePermission() {
    var objectKindId = parseInt($('#objectKindId').val() || 0);
    gridManager.options.parms = $("#queryMainForm").formToJSON();
    if (objectKindId == EOrgObjectKind.BaseFunctionType) {
        gridManager.options.url = operateCfg.queryBaseFunctionAction;
    } else {
        gridManager.options.url = operateCfg.queryAction;
    }

    gridManager.loadData();

    if (objectKindId == EOrgObjectKind.BaseFunctionType) {
        $('#maingrid #toolbar_updateTaskReceive').comboDialog({
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

                var objectId;
                if (baseFunctionTypeIds.length != 1) {
                    Public.tip("只能选择一种职能！");
                    return;
                } else {
                    objectId = baseFunctionTypeIds[0];
                }

                // 保存数据
                Public.ajax(operateCfg.updateTaskReceive, getParams(objectId), function (data) {
                    refreshFlag = true;
                });
                reloadGrid();
                return true;
            }
        });
    }
}
