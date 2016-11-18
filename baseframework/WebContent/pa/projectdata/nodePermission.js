var gridManager, refreshFlag = false, operateCfg = {}, objectKindId, kindId, bizId, bizKindId;

$(function () {
    getQueryParameters();
    initializeOperateCfg();
    initializeUI();
    bindEvents();
    initializeGrid();

    function getQueryParameters() {
        objectKindId = parseInt(Public.getQueryStringByName("objectKindId") || 0);
        kindId = parseInt(Public.getQueryStringByName("kindId") || 0);

        bizKindId = parseInt(Public.getQueryStringByName("bizKindId") || 0);
        bizId = parseInt(Public.getQueryStringByName("bizId") || 0);
    }

    function initializeOperateCfg() {
        var actionPath = web_app.name + "/nodePermissionAction!";
        operateCfg.queryAction = actionPath + "slicedQueryNodePermission.ajax";
        operateCfg.queryRoleAction = actionPath + "slicedQueryNodePermissionRole.ajax";
        operateCfg.insertAction = actionPath + "insertNodePermission.ajax";
        operateCfg.deleteAction = actionPath + "deleteNodePermission.ajax";
        operateCfg.queryFunctionAction = actionPath + "slicedQueryNodePermissionForFun.ajax";
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
            deleteHandler: deleteNodePermission
        };
        var toolbarOptions = UICtrl
            .getDefaultToolbarOptions(toolbarparam);

        var url = operateCfg.queryAction;
        if (objectKindId == EOrgObjectKind.Role) {
            url = operateCfg.queryRoleAction;
        }else if(objectKindId === EOrgObjectKind.BaseFunctionType){
            url = operateCfg.queryFunctionAction;
        }

        gridManager = UICtrl.grid("#maingrid", {
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
                    width: 300,
                    minWidth: 100,
                    type: "string",
                    align: "left"
                }
                /*
                 * ,{ display: "排序号", name: "sequence", width: 60,
                 * minWidth: 60, type: "int", align: "left", render:
                 * function (item) { return "<input type='text'
                 * id='txtSequence_" + item.nodePermissionId + "'
                 * class='textbox' value='" + item.sequence + "'
                 * />"; } }
                 */
            ],
            dataAction: 'server',
            url: url,
            parms: {
                kindId: kindId,
                objectKindId: objectKindId,
                bizId: bizId,
                bizKindid: bizKindId
            },
            title: EProjectPermissionKind.getKindText(kindId)
                + EOrgObjectKind.getKindText(objectKindId)
                + '列表',
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
            selectRowButtonOnly: true
        });

        UICtrl.setSearchAreaToggle(gridManager, false);

        if(objectKindId === EOrgObjectKind.BaseFunctionType){
            initAddControl();
        }
    }
});

function showInsertDialog() {
    if(objectKindId === EOrgObjectKind.BaseFunctionType){
        return ;
    }

    var url = '', param = {}, displayableOrgKind = '', selectableOrgKind = '';
    switch (objectKindId) {
        case EOrgObjectKind.Person :
            displayableOrgKind = "ogn,dpt,pos,psm,fld,prj,grp";
            selectableOrgKind = "psm";
            break;
        case EOrgObjectKind.objectKindId :
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
    if (objectKindId === EOrgObjectKind.Role) {
        url = web_app.name + '/permissionAction!showSelectRoleDialog.do';
    } else {
        url = web_app.name + '/orgAction!showSelectOrgDialog.do';
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
    }

    parent.UICtrl.showFrameDialog({
        url: url,
        title: operateCfg.showBaseSelectDialogTitle,
        param: param,
        width: PAUtil.dialogWidth,
        height: PAUtil.dialogHeight,
        ok: doSaveNodePermission,
        close: reloadGrid
    });
}

function doSaveNodePermission() {
    var data, objectIds = [];
    if (!this.iframe || !this.iframe.contentWindow)
        return;

    if (parseInt(objectKindId) == EOrgObjectKind.Role) {
        var fn = this.iframe.contentWindow.getRoleData;
        data = fn();
    } else {
        data = this.iframe.contentWindow.selectedData;
    }

    if (!data)
        return;

    for (var i = 0; i < data.length; i++) {
        if (data[i].id)
            objectIds[objectIds.length] = data[i].id;
    }

    var params = {
        bizId: bizId,
        bizKindId: bizKindId,
        kindId: kindId,
        objectKindId: objectKindId,
        objectIds: $.toJSON(objectIds)
    };

    var _self = this;
    Public.ajax(operateCfg.insertAction, params, function (data) {
        refreshFlag = true;
        _self.close();
    });
}

function deleteNodePermission() {
    var action = operateCfg.deleteAction;
    DataUtil.del({
        action: action,
        gridManager: gridManager,
        onSuccess: reloadGrid,
        idFieldName: "nodePermissionId"
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

function initAddControl(){
    $('#maingrid #toolbar_menuAdd').comboDialog({ type: 'opm', name: 'selectBaseFunctonType', width: 480,
        dataIndex: 'id',
        title: "基础职能角色",
        checkbox: true,
        onChoose: function () {
            var baseFunctionTypeData = this.getSelectedRows();

            if (baseFunctionTypeData == null) {
                Public.errorTip("基础职能角色。");
                return;
            }
            //组装基础职能角色
            var baseFunctionTypeIds = [];
            $.each(baseFunctionTypeData, function (i, o) {
                baseFunctionTypeIds.push(o.id);
            });
            //保存数据

            var params = {
                bizId: bizId,
                bizKindId: bizKindId,
                kindId: kindId,
                objectKindId: objectKindId,
                objectIds: $.toJSON(baseFunctionTypeIds)
            };

            var url = operateCfg.insertAction;
            Public.ajax(url, params, function () {
                gridManager.loadData();
            });

            return true;
        }
    });
}