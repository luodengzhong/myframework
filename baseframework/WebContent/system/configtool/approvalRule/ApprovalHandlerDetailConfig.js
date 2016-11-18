var assistantGrid = null, ccGrid = null, fieldPermissionGrid;
function configStepHandler() {
    if (!handlerGridManager) {
        return;
    }

    var rows = handlerGridManager.getSelectedRows();
    if (!rows || rows.length == 0) {
        Public.tip("请选择处理人节点!");
        return;
    }
    if (rows.length > 1) {
        Public.tip("只能选择一个处理人节点进行配置!");
        return;
    }

    UICtrl.showAjaxDialog({
        title: "处理人节点详细配置",
        width: 700,
        url: web_app.name + '/approvalRuleAction!forwardToApprovalHandlerDetailConfig.load',
        param: {id: rows[0].id, approvalRuleId: rows[0].approvalRuleId},
        ok:  doUpdateHandlerDetailConfig,
        close: function () {
        },
        init: function () {
            fieldPermissionGrid = null;
            iniAssistantGrid();
            iniCCGrid();
            initializateTabPannel();
            UICtrl.autoGroupAreaToggle();
            $("a.togglebtn:gt(0)").trigger("click");
        }
    });


}

function initializateTabPannel() {
    UICtrl.layout("#layout", {
        leftWidth: 200,
        heightDiff: -5
    });
    $('#tabPage').tab().bind('click', function (e) {
        var $clicked = $(e.target || e.srcElement);
        if ($clicked.is('li')) {
            var divid = $clicked.attr('divid');
            var div = $('#' + divid);
            $.each(['d1', 'd2'], function (i, o) {
                $('#' + o).hide();
            });
            //d2的时候初始化并显示列表
            if (divid == 'd2' && fieldPermissionGrid == null) {
                iniFieldPermissionGrid();
            }
            div.show();
        }
    });
}

function doUpdateHandlerDetailConfig() {
	if (Public.isReadOnly) return;
	
    var param = {};

    var assistantDetailData = assistantGrid.rows;
    if (!(!assistantDetailData || assistantDetailData.length == 0)) {
        param.assistantList = encodeURI($.toJSON(assistantDetailData));
    }
    var ccDetailData = ccGrid.rows;
    if (!(!ccDetailData || ccDetailData.length == 0)) {
        param.ccList = encodeURI($.toJSON(ccDetailData));
    }

    if (fieldPermissionGrid == null) {
        param.needUpdatefieldPermission = false;
    } else {
        param.needUpdatefieldPermission = true;
        var fieldPermissionData = fieldPermissionGrid.rows;
        if (!(!fieldPermissionData || fieldPermissionData.length == 0)) {
            param.fieldPermissionList = encodeURI($.toJSON(fieldPermissionData));
        }
    }

    $('#submitForm').ajaxSubmit({url: web_app.name + '/approvalRuleAction!updateHandlerDetailConfig.ajax',
        param: param,
        success: function () {
        }
    });
}

function iniAssistantGrid() {
    var toolbarOptions = UICtrl.getDefaultToolbarOptions({
        addHandler: function () {
            UICtrl.addGridRow(assistantGrid, { sequence: assistantGrid.getData().length + 1 });
        },
        deleteHandler: function () {
            assistantGrid.deleteSelectedRow();
        }
    });
    var param = {chiefId: $("#id").val(), kindId: 'assistant', approvalRuleId: $("#approvalRuleId").val()}
    assistantGrid = UICtrl.grid('#assistantGrid', {
        columns: [
            { display: "描述", name: "description", width: 150, minWidth: 60, type: "string", align: "left", frozen: true,
                editor: { type: 'text', required: true} },
            { display: "审批人类别", name: "handlerKindName", width: 100, minWidth: 60, type: "string", align: "left", frozen: true,
                editor: { type: 'select', data: { type: "bpm", name: "approvalHandlerKind", back: { code: "handlerKindCode", name: "handlerKindName", dataSourceConfig: "dataSourceConfig" }}, required: true} },
            { display: "审批人ID", name: "handlerId", width: 100, minWidth: 60, type: "string", align: "left", frozen: true,
                editor: { type: 'text', required: true} },
            { display: "审批人", name: "handlerName", width: 150, minWidth: 60, type: "string", align: "left", frozen: true,
                editor: {type: "dynamic", getEditor: function (row) {
                    var dataSourceConfig = row['dataSourceConfig'] || "";
                    if (!dataSourceConfig) return {};
                    return  (new Function("return " + dataSourceConfig))();
                }
                }  },
            { display: "排序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left",
                editor: { type: 'spinner', required: true} }
        ],
        dataAction: 'server',
        url: web_app.name + '/approvalRuleAction!queryAssistantHandler.ajax',
        parms: param,
        height: '40%',
        sortName: 'sequence',
        sortOrder: 'asc',
        heightDiff: -60,
        headerRowHeight: 25,
        rowHeight: 25,
        toolbar: toolbarOptions,
        enabledEdit: true,
        usePager: false,
        checkbox: true,
        fixedCellHeight: true,
        selectRowButtonOnly: true,
        autoAddRow: { kindId: "assistant", dataSourceConfig: "", approvalRuleId: $("#approvalRuleId").val(), chiefId: $("#id").val()},
        onBeforeEdit: function (editParm) {
            var c = editParm.column;
            if (c.name == 'value') {//启用的数据value 不能编辑
                return editParm.record['status'] === 0;
            }
            return true;
        }
    });
}

function iniCCGrid() {
    var toolbarOptions = UICtrl.getDefaultToolbarOptions({
        addHandler: function () {
            UICtrl.addGridRow(ccGrid, { sequence: ccGrid.getData().length + 1 });
        },
        deleteHandler: function () {
            ccGrid.deleteSelectedRow();
        }
    });
    var param = {chiefId: $("#id").val(), kindId: 'cc', approvalRuleId: $("#approvalRuleId").val()}
    ccGrid = UICtrl.grid('#ccGrid', {
        columns: [
            { display: "描述", name: "description", width: 150, minWidth: 60, type: "string", align: "left", frozen: true,
                editor: { type: 'text', required: true} },
            { display: "审批人类别", name: "handlerKindName", width: 100, minWidth: 60, type: "string", align: "left", frozen: true,
                editor: { type: 'select', data: { type: "bpm", name: "approvalHandlerKind", back: { code: "handlerKindCode", name: "handlerKindName", dataSourceConfig: "dataSourceConfig" }}, required: true} },
            { display: "审批人ID", name: "handlerId", width: 100, minWidth: 60, type: "string", align: "left", frozen: true,
                editor: { type: 'text', required: true} },
            { display: "审批人", name: "handlerName", width: 150, minWidth: 60, type: "string", align: "left", frozen: true,
                editor: {type: "dynamic", getEditor: function (row) {
                    var dataSourceConfig = row['dataSourceConfig'] || "";
                    if (!dataSourceConfig) return {};
                    return  (new Function("return " + dataSourceConfig))();
                }
                }  },
            { display: "排序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left",
                editor: { type: 'spinner', required: true} }
        ],
        dataAction: 'server',
        url: web_app.name + '/approvalRuleAction!queryCCHandler.ajax',
        parms: param,
        height: '40%',
        sortName: 'sequence',
        sortOrder: 'asc',
        heightDiff: -60,
        headerRowHeight: 25,
        rowHeight: 25,
        toolbar: toolbarOptions,
        enabledEdit: true,
        usePager: false,
        checkbox: true,
        fixedCellHeight: true,
        selectRowButtonOnly: true,
        autoAddRow: {kindId: "cc", dataSourceConfig: "", approvalRuleId: $("#approvalRuleId").val(), chiefId: $("#id").val()},
        onBeforeEdit: function (editParm) {
            var c = editParm.column;
            if (c.name == 'value') {//启用的数据value 不能编辑
                return editParm.record['status'] === 0;
            }
            return true;
        }
    });
}

function iniAddFieldPermissionHandler() {
    $("#fieldPermissionGrid div[toolbarid='menuAdd']").comboDialog({
        type: 'sys',
        name: 'permissionField',
        dataIndex:'fieldId',
        width: 400,
        lock: false,
        checkbox: true,
        onChoose: function () {
            var rows = this.getSelectedRows();
            var addRows = [];
            $.each(rows, function (i, o) {
                o.approvalRuleId = $("#approvalRuleId").val();
                o.handlerId = $("#id").val();
                o.kindId =
                    addRows.push(o);
            });
            fieldPermissionGrid.addRows(addRows);
            return true;
        }
    });

}

function iniFieldPermissionGrid() {
    var toolbarOptions = UICtrl.getDefaultToolbarOptions({
        addHandler: function () {

        },
        deleteHandler: function () {
            fieldPermissionGrid.deleteSelectedRow();
        }
    });
    var param = {handlerId: $("#id").val(), approvalRuleId: $("#approvalRuleId").val()}
    fieldPermissionGrid = UICtrl.grid('#fieldPermissionGrid', {
        columns: [
            { display: "字段编码", name: "fieldCode", width: 150, minWidth: 60, type: "string", align: "left",
                editor: { type: 'text', required: true} },
            { display: "字段名", name: "fieldName", width: 100, minWidth: 60, type: "string", align: "left",
                editor: { type: 'text', required: true} },
            { display: "字段类别", name: "fieldType", width: 100, minWidth: 60, type: "string", align: "left",
                editor: { type: 'combobox', data: fieldType, required: true},
                render: function (item) {
                    return fieldType[item.fieldType];
                } },
            { display: "权限", name: "fieldAuthority", width: 150, minWidth: 60, type: "string", align: "left",
                editor: { type: 'combobox', data: fieldAuthority, required: true},
                render: function (item) {
                    return fieldAuthority[item.fieldAuthority];
                }}
        ],
        dataAction: 'server',
        url: web_app.name + '/approvalRuleAction!queryFieldPermission.ajax',
        parms: param,
        sortName: 'sequence',
        sortOrder: 'asc',
        width: 700,
        height: '100%',
        heightDiff: -60,
        headerRowHeight: 25,
        rowHeight: 25,
        toolbar: toolbarOptions,
        usePager: false,
        checkbox: true,
        fixedCellHeight: true,
        selectRowButtonOnly: true,
        enabledEdit: true,
        onLoadData: function () {
            iniAddFieldPermissionHandler();
        }
    });
}
