var minusData = [];
var bizId, procUnitId, chiefId;

function initializeInputParams() {
    for (var item in inputParams) {
        inputParams[item] = Public.getQueryStringByName(item);
    }

    bizId = Public.getQueryStringByName("bizId");
    procUnitId = Public.getQueryStringByName("procUnitId");
    chiefId = Public.getQueryStringByName("chiefId");
}

function initializeGrid() {
    $("#handlerTd").width(425);
    $("#handlerDiv").width(420);

    $("#selectedOrgTitle").html(" 处理人列表：");

    gridManager = UICtrl.grid('#handlerGrid', {
        columns: [
	            { display: "机构", name: "orgName", width: 80, minWidth: 60, type: "string", align: "left" },
	            { display: "部门", name: "deptName", width: 80, minWidth: 60, type: "string", align: "left" },
	            { display: "协审人", name: "handlerName", width: 80, minWidth: 60, type: "string", align: "left" }
	        ],
        dataAction: 'server',
        url: web_app.name + '/workflowAction!queryAssistHandler.ajax',
        parms: { bizId: bizId, procUnitId: procUnitId, chiefId: chiefId },
        pageSize: 20,
        width: '99%',
        height: '100%',
        usePager: false,
        heightDiff: -10,
        headerRowHeight: 25,
        rowHeight: 25,
        fixedCellHeight: true,
        selectRowButtonOnly: true,
        enabledEdit: true,
        rownumbers: true,
        checkbox: true,
        //禁止全选
        onBeforeCheckAllRow: function () {
            return false;
        }
    });
}

function deleteData() {
    var rows = gridManager.getSelecteds();
    if (!rows || rows.length < 1) {
        Public.tip('请选择处理人!');
        return;
    }

    UICtrl.confirm("您是否要删除选择的协审人员？", function () {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].id) {
                minusData.push(rows[i].id);
            }
            gridManager.deleteRow(rows[i]);
        }
        gridManager.deletedRows = null;
    });
}

function addData() {
	 var rows = getChooseRowData();
  
    if (!rows || rows.length < 1) {
        Public.tip('请选择左侧组织!');
        return;
    }

    for (var i = 0; i < rows.length; i++) {
        addDataOneNode(rows[i]);
    }
}

function addDataOneNode(data) {
    if (inputParams.selectableOrgKinds.indexOf(data.orgKindId) == -1) {
        return;
    }

    var added = false;
    var handlers = gridManager.getData();

    for (var j = 0; j < handlers.length; j++) {
        if (data.id == handlers[j].handlerId) {
            added = true;
            break;
        }
    }

    if (!added) {
        var row = gridManager.getSelectedRow();
        gridManager.addRow({
            bizId: bizId,
            procUnitId: procUnitId,
            orgId: data.orgId,
            orgName: data.orgName,
            deptId: data.deptId,
            deptName: data.deptName,
            positionId: data.positionId,
            positionName: data.positionName,
            handlerName: data.name,
            handlerId: data.id,
            fullId: data.fullId,
            fullName: data.fullName,
            status: 0,
            cooperationModelId: "assistant",
            chiefId: 0,
            assistantSequence: 0,
            groupId: gridManager.getData().length + 1,
            sequence: 1,
            allowSubtract: 1
        }, row, false);
    }
    
   cancelSelect(data);
}

function reloadGrid() {

}

function getAssistData() {
    var detailData = DataUtil.getGridData({ gridManager: gridManager });
    if (!detailData) {
        return false;
    }

    var executors = [];
    for (var i = 0; i < detailData.length; i++) {
        if (!detailData[i].id) {
            executors.push(detailData[i].handlerId);
        }
    }

    var data = {};
    data.deleted = encodeURI($.toJSON(minusData));
    data.executors = encodeURI($.toJSON(executors));
    return data;
}