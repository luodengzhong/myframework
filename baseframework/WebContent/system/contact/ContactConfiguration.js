var gridManager = null;
var contactWay = null;
$(document).ready(function () {
    contactWay = $("#contactWay").combox('getFormattedData');
    initConfigurationGrid();
});


function enableHandler() {
    changeStatus(1);
}

function changeStatus(stauts) {
    DataUtil.updateById({ action: 'contactAction!updateStatus.ajax',
        gridManager: gridManager, idFieldName: 'contactConfigurationId', param: {status: stauts},
        message: status == 1 ? '确实要启用选中数据吗?' : '确实要禁用选中的数据吗?',
        onSuccess: function () {
            gridManager.loadData();
        }
    });
}

function disableHandler() {
    changeStatus(-1);
}

var initConfigurationGrid = function () {
    var toolbarOptions = UICtrl.getDefaultToolbarOptions({
        addHandler: addHandler,
        deleteHandler: deleteHandler,
        saveHandler: saveHandler,
        enableHandler: enableHandler,
        disableHandler: disableHandler
    });

    gridManager = UICtrl.grid('#configurationGrid', {
        columns: [
            {display: "业务编码", name: "bizCode", width: 200, minWidth: 60, type: "string", align: "left",
                editor: { type: 'text', required: true}
            },
            {display: "联系方式", name: "key", width: 200, minWidth: 60, type: "string", align: "left",
                editor: { type: 'combobox', data: contactWay, required: true},
                render: function (item, index, columnValue, columnInfo) {
                    return DictUtil.getNameByValue(contactWay, columnValue);
                }
            },
            {display: "状态", name: "status", width: 60, minWidth: 60, type: "string", align: "left",
                render: function (item) {
                    return UICtrl.getStatusInfo(item.status);
                }
            }
        ],
        url: web_app.name + '/contactAction!sliceQueryConfiguration.ajax',
        usePager: true,
        pageSize: 20,
        sortName: "bizCode",
        SortOrder: "asc",
        toolbar: toolbarOptions,
        width: '99.8%',
        height: '100%',
        heightDiff: -13,
        headerRowHeight: 25,
        rowHeight: 25,
        checkbox: true,
        fixedCellHeight: true,
        enabledEdit: true,
        selectRowButtonOnly: true,
        autoAddRow: {status: 1}
    });
};

function saveHandler() {

    var updatedData = DataUtil.getUpdateAndAddData(gridManager);
    var deletedData = gridManager.getDeleted();

    if (!updatedData && !deletedData) {
        Public.tip("未改变任何数据!");
        return;
    }

    var params = {};
    if (updatedData) {
        var updatedDataTmp = [];
        $.each(updatedData, function (index, data) {
            if (data.key != "" || data.bizCode != "") {
                updatedDataTmp.splice(0, 0, data);
            }
        });

        params.updatedData = encodeURI($.toJSON(updatedDataTmp));
    }
    if (deletedData) {
        params.deletedData = encodeURI($.toJSON(deletedData));
    }

    $('#submitForm').ajaxSubmit({url: web_app.name + '/contactAction!saveConfiguration.ajax',
        param: params,
        success: function (id) {
            gridManager.loadData();
        }
    });
}

function addHandler() {
    UICtrl.addGridRow(gridManager);
}

function deleteHandler() {
    var rows = gridManager.getSelectedRows();
    if (!rows || rows.length == 0) {
        Public.tip("请选择你要删除的数据!");
        return;
    }
    gridManager.deleteSelectedRow();
}

function query(obj) {
    var params = $("#queryMainForm").formToJSON();
    UICtrl.gridSearch(gridManager, params);
}
