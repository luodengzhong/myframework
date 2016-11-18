var gridManager;
$(function() {
	initializeGrid();

	function initializeGrid() {
		var bizCode = Public.getQueryStringByName("bizCode");
		var  procUnitId = Public.getQueryStringByName("procUnitId");
		var groupId = Public.getQueryStringByName("groupId");
		
		gridManager = UICtrl.grid("#maingrid", {
			columns : [ 
			            { display : "环节名称", name : "name", width : 120, minWidth : 60, type : "string", align : "left" }, 
			            { display : "处理人", name : "executorFullName", width : 230 , minWidth : 60, type : "string", align : "left" },
			             { display : "状态", name : "statusName", width : 100 , minWidth : 60, type : "string", align : "left" }
			             ],
			dataAction : "server",
			url : web_app.name + "/workflowAction!queryBackTasksByBizCode.ajax",
			parms: { bizCode: bizCode, procUnitId: procUnitId, groupId: groupId },
			checkbox: true,
			usePager : false,
			width : "99.8%",
			height : "80%",
			rownumbers: true,
			heightDiff : -10,
			headerRowHeight : 25,
			rowHeight : 25,
			fixedCellHeight : true,
			selectRowButtonOnly : true
		});
	}
});

function getBackModel(){
	return $("input[name='backModel']:checked").val();
}

function getBackProcUnitData(){
	var data = gridManager.getSelecteds();
    if (!data || data.length == 0) {
        Public.tip("请选择数据.");
        return;
    }

    if (data.length > 1) {
    	Public.tip('请选择一条数据!');
        return;
    }
    return data;
}