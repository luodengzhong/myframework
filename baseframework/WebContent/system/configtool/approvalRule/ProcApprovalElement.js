var gridManager = null, refreshFlag = false;

$(document).ready(function () {
    UICtrl.autoSetWrapperDivHeight();
    UICtrl.initDefaulLayout();
    loadProcTreeView();
    initializeGrid();

    // 对话框为何要和控件绑定!!!
    $('#toolbar_menuAdd').comboDialog({
        title: "选择审批要素",
        dataIndex:'id',
        type: 'bpm', name: 'approvalBizElement', width: 500, checkbox: true,
        onShow: function () {
            var nodeData = $('#maintree').commonTree("getSelected");
            if (!nodeData||!nodeData.procUnitId) {
                Public.tip('请选择流程环节！');
                return false;
            }
            return true;
        },
        onChoose: function () {
            var rows = this.getSelectedRows();
            if (!rows || rows.length < 1) {
                Public.tip('请选择审批要素!');
                return;
            }

            var approvalElementIds = [];
            for (var i = 0; i < rows.length; i++) {
                approvalElementIds[approvalElementIds.length] = rows[i].id;
            }

            var procUnit = $('#maintree').commonTree("getSelected");
            if (!procUnit) {
                Public.tip('请选择流程环节!');
                return;
            }

            Public.ajax(web_app.name + '/approvalRuleAction!insertProcApprovalElement.ajax', {
                procKey: procUnit.key,
                procUnitId: procUnit.procUnitId,
                procUnitName: procUnit.name,
                procId: procUnit.procId,
                approvalElementIds: $.toJSON(approvalElementIds)
            }, function (data) {
                reloadGrid();
            });
            return true;
        }});
});

// 初始化表格
function initializeGrid() {
    var toolbarOptions = UICtrl.getDefaultToolbarOptions({
        addHandler: addHandler,
        deleteHandler: deleteHandler,
        saveSortIDHandler: updateSequence
    });
    gridManager = UICtrl.grid('#maingrid', {
        columns: [
            { display: "流程KEY", name: "procKey", width: 200, minWidth: 60, type: "string", align: "left" },
            { display: "流程名称", name: "procName", width: 200, minWidth: 60, type: "string", align: "left" },
            { display: "环节ID", name: "procUnitId", width: 150, minWidth: 60, type: "string", align: "left" },
            { display: "环节名称", name: "procUnitName", width: 200, minWidth: 60, type: "string", align: "left" },
            { display: "审批要素", name: "elementName", width: 200, minWidth: 60, type: "string", align: "left" },
            { display: "排序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left",
                render: UICtrl.sequenceRender
            }
        ],
        dataAction: 'server',
        url: web_app.name
            + '/approvalRuleAction!queryProcApprovalElement.ajax',
        pageSize: 20,
        parms: {
            procKey: "@",
            procUnitId: "@"
        },
        width: '99.9%',
        height: '100%',
        heightDiff: -10,
        headerRowHeight: 25,
        rowHeight: 25,
        checkbox: true,
        sortName: 'sequence',
        sortOrder: 'asc',
        toolbar: toolbarOptions,
        fixedCellHeight: true,
        selectRowButtonOnly: true
    });
}

// 查询
function query(obj) {
    var param = $(obj).formToJSON();
    UICtrl.gridSearch(gridManager, param);
}

// 刷新表格
function reloadGrid() {
    gridManager.loadData();
}

function resetForm(obj) {
    $(obj).formClean();
}

function addHandler() {

}

function deleteHandler() {
    var action = '/approvalRuleAction!deleteProcApprovalElement.ajax';
    DataUtil.del({
        action: action,
        gridManager: gridManager,
        onSuccess: reloadGrid
    });
}

function insert() {
    $('#submitForm').ajaxSubmit(
        {
            url: web_app.name
                + '/approvalRuleAction!insertProcApprovalElement.ajax',
            success: function () {
                refreshFlag = true;
            }
        });
}

function updateSequence() {
    var action = "approvalRuleAction!updateProcApprovalElementSequence.ajax";
    DataUtil.updateSequence({
        action: action,
        gridManager: gridManager,
        onSuccess: reloadGrid
    });
}

function dialogClose() {
    if (refreshFlag) {
        reloadGrid();
        refreshFlag = false;
    }
}

function procNodeClick(node) {
    if (node.key) {
        gridManager.options.parms.procKey = node.key;
        gridManager.options.parms.procUnitId = node.procUnitId;
        $('.l-layout-center .l-layout-header').html(
                "<font style=\"color:Tomato;font-size:13px;\">["
                + node.name + "]</font>审批要素列表");
    } else {
        gridManager.options.parms.procKey = "@";
        gridManager.options.parms.procUnitId = "@";
        $('.l-layout-center .l-layout-header').html(node.name);
    }
    reloadGrid();
}