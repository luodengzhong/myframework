function initializeInputParams() {
    for (var item in inputParams) {
        inputParams[item] = Public.getQueryStringByName(item);
    }
}

function initializeGrid() {
    $("#selectedOrgTitle").html("已选组织：");

    gridManager = UICtrl.grid("#handlerGrid", {
        columns: [
                { display: "名称", name: "name", width: 100, minWidth: 60, type: "string", align: "left",
                    render: function (item) {
                        return '<div title="' + item.fullName + '">' + item.name + '</div>';
                    }
                },
                { display: "类型", name: "orgKindName", width: 100, minWidth: 60, type: "string", align: "left",
                    render: function (item) {
                        return OpmUtil.getOrgKindDisplay(item.orgKindId);
                    }
                }
            ],
        rownumbers: true,
        data: selectedData,
        height: "100%",
        heightDiff: -7,
        headerRowHeight: 25,
        rowHeight: 25,
        checkbox: true,
        usePager: false,
        fixedCellHeight: true,
        selectRowButtonOnly: true,
        onDblClickRow: function (data, rowIndex, rowObj) {
            deleteOneNode(data);
            reloadGrid();
        }
    });
}

function deleteData() {
    var rows = gridManager.getSelecteds();
    if (!rows || rows.length < 1) {
        Public.tip('请选择要删除的数据。');
        return;
    }
    for (var i = 0; i < rows.length; i++) {
        deleteOneNode(rows[i]);
    }
    reloadGrid();
}

function deleteOneNode(data) {
    for (var j = 0; j < selectedData.length; j++) {
        if (selectedData[j].id == data.id) {
            selectedData.splice(j, 1);
            break;
        }
    }
}

function addData() {
    var rows = getChooseRowData();

    if (!rows || rows.length < 1) {
        Public.tip('请选择左侧组织节点!');
        return;
    }

    selectedData = selectedData || [];
    for (var i = 0; i < rows.length; i++) {
        addDataOneNode(rows[i]);
    }
    reloadGrid();
}

function reloadGrid() {
    var data = { Rows: selectedData };
    gridManager.options.data = data;
    gridManager.loadData();
}

function addDataOneNode(data) {
    if (inputParams.selectableOrgKinds.indexOf(data.orgKindId) == -1) {
        return;
    }

    if (inputParams.multiSelect == "false" && selectedData.length > 0) {
        Public.errorTip("当前业务不能选择多条组织数据。");
        return;
    }

    var added = false;
    for (var j = 0; j < selectedData.length; j++) {
        if (selectedData[j].id == data.id) {
            added = true;
            break;
        }
    }
    if (!added) {
        var org = {};
        for( var key in data ){
        	org[key] = data[key];
        }
        /*
        org.id = data.id;
        org.code = data.code;
        org.name = data.name;
        org.orgKindId = data.orgKindId;
        org.personId = data.personId;
        org.fullId = data.fullId;
        org.fullName = data.fullName;
        org.status = data.status;
        */
        selectedData[selectedData.length] = org;
    }
    
    cancelSelect(data);
}
