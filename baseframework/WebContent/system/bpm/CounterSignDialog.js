var minusData = [];
var counterSignKindId, bizId, bizCode, procUnitId, groupId, beginGroupId, endGroupId, procUnitName;

function initializeInputParams() {	
    for (var item in inputParams) {
        inputParams[item] = Public.getQueryStringByName(item);
    }

    counterSignKindId = Public.getQueryStringByName("counterSignKindId");
    bizId = Public.getQueryStringByName("bizId");
    bizCode = Public.getQueryStringByName("bizCode");
    procUnitId = Public.getQueryStringByName("procUnitId");
    
    beginGroupId = Public.getQueryStringByName("beginGroupId");
    endGroupId = Public.getQueryStringByName("endGroupId");
    procUnitName = Public.getQueryStringByName("procUnitName");
    
    switch(counterSignKindId){
    case CounterSignKind.CHIEF:// 主审中的加减签	
    	groupId = $("#groupId").val();
    	if (procUnitId == "Apply") {
            procUnitId = $("#procUnitId").val();
            //groupId = $("#groupId").val();
        } 
    	//else {
        //    groupId = Public.getQueryStringByName("groupId");
        //}
    	break;
    case CounterSignKind.MEND://补审	
    	procUnitId = $("#procUnitId").val();
        groupId = $("#groupId").val();
    	break;
    case CounterSignKind.MANUAL_SELECTION:
    	break;
    }
   
}

function initializeGrid() {
    $("#handlerTd").width(425);
    $("#handlerDiv").width(420);

    $("#selectedOrgTitle").html("处理人列表：");

    gridManager = UICtrl.grid('#handlerGrid', {
        columns: [
	            { display: "环节描述", name: "handleKindName", width: 150, minWidth: 60, type: "string", align: "left",
	                editor: { type: 'text', required: true }
	            },
	            { display: "处理人", name: "handlerName", width: 80, minWidth: 60, type: "string", align: "left" },
	            { display: "分组号", name: "groupId", width: 60, minWidth: 60, type: "string", align: "left",
	                editor: { type: 'spinner', required: true }
	            }
	        ],
        dataAction: 'server',
        url: web_app.name + '/workflowAction!queryCounterSignHandler.ajax',
        parms: { bizId: bizId, procUnitId: procUnitId },
        pageSize: 20,
        width: '99%',
        height: '100%',
        sortName: 'groupId , sequence',
        sortOrder: 'asc, asc',
        usePager: false,
        heightDiff: -10,
        headerRowHeight: 25,
        rowHeight: 25,
        fixedCellHeight: true,
        selectRowButtonOnly: true,
        enabledEdit: true,
        rownumbers: true,
        checkbox: true,
        autoAddRowByKeydown: false,
        onLoadData: function () {
            return !(Public.isBlank(bizId));
        },
        //禁止全选
        onBeforeCheckAllRow: function () {
            return false;
        },
        onBeforeCheckRow: function (checked, data, rowid, rowdata) {
            //没有分组ID可随意编辑
            if (Public.isBlank(groupId)) {
                return true;
            }
            if (counterSignKindId == CounterSignKind.MEND && (data.cooperationModelId == "chief" || data.id)) {
                return false;
            }
            //当前审批组后面的可被减签的或者加签的人员可以被减签
            return (parseInt(data.groupId) > parseInt(groupId)) && (data.allowSubtract == 1 || data.allowSubtract === "");
        },
        onBeforeEdit: function (editParm) {
            //没有分组ID可随意编辑
            if (Public.isBlank(groupId)) {
                return true;
            }

            var data = editParm.record;
            //补审
            if (counterSignKindId == CounterSignKind.MEND && (data.cooperationModelId == "chief" || data.id)) {
                return false;
            }

            var c = editParm.column;
            if (c.name == 'handleKindName' || c.name == "groupId" || c.name == "sequence") {
                return (parseInt(data.groupId) > parseInt(groupId)) && (data.allowSubtract == 1 || data.allowSubtract === "");
            }
            return false;
        },
        onBeforeSubmitEdit: function (e) {
            if (e.column.name == "groupId") {
                if (!e.value) {
                    Public.errorTip("请输入分组号。");
                    return false;
                }
                if (isNaN(e.value)) {
                    Public.errorTip("请输入数字。");
                    return false;
                }
                
                if (counterSignKindId == CounterSignKind.MANUAL_SELECTION){
                	if (parseInt(e.value) < beginGroupId || parseInt(e.value) >= endGroupId){
                		Public.errorTip("分组号必须在“[" + beginGroupId + "," + endGroupId + ")”之间。");
                		return false;
                	}
                }else{
                	if (parseInt(e.value) <= parseInt(groupId)) {
                		Public.errorTip("分组号必须大于“" + groupId + "”。");
                		return false;
                	}
                }
                return true;
            }
        }
    });
    //处理人选择不能全选
    $('#handlerGrid').find('div.l-grid-hd-cell-btn-checkbox').hide();
}

function deleteData() {
    var rows = gridManager.getSelecteds();
    if (!rows || rows.length < 1) {
        Public.errorTip('请选择处理人。');
        return;
    }

    UICtrl.confirm("您是否要删除选择的人员？", function () {
        for (var i = 0; i < rows.length; i++) {
            if ((parseInt(rows[i].groupId) > parseInt(groupId)) && rows[i].id) {
                minusData.push(rows[i].id);
            }
            gridManager.deleteRow(rows[i]);
        }
        gridManager.deletedRows = null;
    });
}

function getNextGroupId() {
	//手工选择
	if (counterSignKindId == CounterSignKind.MANUAL_SELECTION){
		return parseInt(beginGroupId);
	}
	
    var rows = gridManager.getData();
    var result = 0, currentGroupId;
    
    for (var i = 0; i < rows.length; i++) {
    	currentGroupId = parseInt(rows[i].groupId);
    	if (result < currentGroupId) {
            result = rows[i].groupId;
        }
    }
    result = parseInt(result) + 10;
    return result;
}

function addData(rowData) {
	var rows = getChooseRowData();
    if (rowData) {
        rows.push(rowData);
    }
    
    if (!rows || rows.length < 1) {
        Public.tip('请选择左侧组织。');
        return;
    }

    for (var i = 0; i < rows.length; i++) {
        addDataOneNode(rows[i]);
    }
}

function addDataOneNode(data) {
    if (isSelectedGroupPage()) {
        delete data.groupId;
    }
    if (inputParams.selectableOrgKinds.indexOf(data.orgKindId) == -1) {
        return;
    }
    var row = gridManager.getSelectedRow();
    var sequence = gridManager.getData().length + 1;
    var currentGroupId = null;
    if (data['groupId']) {
        currentGroupId = data['groupId'];
    } else {
        currentGroupId = getNextGroupId();
    }

    var handleKindName;
    if (CounterSignKind.isManualSelection(counterSignKindId)){
    	handleKindName = procUnitName;
    }else{
    	handleKindName = data['handleKindName'];
    	if (Public.isBlank(handleKindName)) {
            if (Public.isBlank(data.positionName)) {
                handleKindName = data.name + "审核";
            } else {
                handleKindName = data.positionName + "审核";
            }
        }    	
    }

    var status = (counterSignKindId == CounterSignKind.MANUAL_SELECTION || counterSignKindId == CounterSignKind.CHIEF) ? 0 : -2
    
    var cooperationModelId = counterSignKindId;
    if (counterSignKindId == CounterSignKind.MANUAL_SELECTION){
    	cooperationModelId = "chief";
    }
    
    gridManager.addRow({
        bizId: bizId,
        bizCode: bizCode,
        procUnitId: procUnitId,
        orgId: data.orgId,
        orgName: data.orgName,
        deptId: data.deptId,
        deptName: data.deptName,
        positionId: data.positionId,
        positionName: data.positionName,
        handleKindName: handleKindName,
        handlerName: data.name || data.handlerName,
        handlerId: data.id || data.handlerId,
        fullId: data.fullId,
        fullName: data.fullName,
        orgKindId: data.orgKindId,
        status: status, //加减签状态
        cooperationModelId: cooperationModelId,
        chiefId: 0,
        assistantSequence: 0,
        groupId: currentGroupId,
        sequence: sequence,
        allowSubtract: 1
    }, row, false);

    cancelSelect(data);
}

/**
* 检查组内人员是否重复
*/
function checkDuplicateInGroup() {
    var rows = gridManager.getData();
    var currentRowId, rowId, currentHandlerId, handlerId, currentGroupId, groupId, handlerName, currentPersonId, personId;
    for (var i = 0; i < rows.length; i++) {
        currentRowId = rows[i]["__id"];
        currentHandlerId = rows[i]["handlerId"];
        currentPersonId = OpmUtil.getPersonIdFromPsmId(currentHandlerId);
        currentGroupId = rows[i]["groupId"];
        for (var j = 0; j < rows.length; j++) {
            rowId = rows[j]["__id"];
            handlerId = rows[j]["handlerId"];
            personId = OpmUtil.getPersonIdFromPsmId(handlerId);
            groupId = rows[j]["groupId"];
            if (currentRowId != rowId && currentPersonId == personId && currentGroupId == groupId) {
                handlerName = rows[i]["handlerName"];
                Public.errorTip("审批分组“" + groupId + "”人员“" + handlerName + "”重复。");
                return true;
            }
        }
    }
    return false;
}

function reloadGrid() {
	
}

function getCounterSignData() {
    var detailData = DataUtil.getGridData({ gridManager: gridManager });
    if (!detailData) {
        return false;
    }

    if (checkDuplicateInGroup()) {
        return false;
    }

    var data = {};
    data.deleted = encodeURI($.toJSON(minusData));
    data.detailData = encodeURI($.toJSON(detailData));
    data.bizId = bizId;
    data.procUnitId = $("#procUnitId").val();
    data.hiProcUnitHandlerInstVersion = $("#hiProcUnitHandlerInstVersion").val();
    return data;
}

function getChooseGridData() {
    var detailData = DataUtil.getGridData({ gridManager: gridManager });
    if (!detailData) {
        return false;
    }

    if (checkDuplicateInGroup()) {
        return false;
    }

    return detailData;
}