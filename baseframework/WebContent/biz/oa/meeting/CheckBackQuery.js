var gridManager;
$(function() {
	initializeGrid();

	function initializeGrid() {
		var procInstId = Public.getQueryStringByName("procInstId");
		var approvalRuleId = Public.getQueryStringByName("approvalRuleId");
		var groupId = Public.getQueryStringByName("groupId");
		
		gridManager = UICtrl.grid("#maingrid", {
			columns : [ 
			            { display : "环节名称", name : "name", width : 120, minWidth : 60, type : "string", align : "left" }, 
			            { display : "处理人", name : "executorFullName", width : 300 , minWidth : 60, type : "string", align : "left" }
			             ],
			dataAction : "server",
			url : web_app.name + "/meetingAction!queryCheckBackProcUnit.ajax",
			parms: {procInstId: procInstId, approvalRuleId: approvalRuleId, groupId: groupId},
			checkbox: true,
			usePager : false,
			width : "99.8%",
			height : "100%",
			rownumbers: true,
			heightDiff : -10,
			headerRowHeight : 25,
			rowHeight : 25,
			fixedCellHeight : true,
			selectRowButtonOnly : true
		});
	}
});

function getCheckBackProcUnitData(){
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