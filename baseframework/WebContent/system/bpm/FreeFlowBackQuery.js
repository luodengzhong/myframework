var gridManager, bizId, procInstId, taskId;
$(function() {
	bindEvents();
	initializeGrid();

	function initializeGrid() {
		bizId = Public.getQueryStringByName("bizId");
		procInstId = Public.getQueryStringByName("procInstId");
		taskId = Public.getQueryStringByName("taskId");
		
		gridManager = UICtrl.grid("#maingrid", {
			columns : [ 
			            { display : "环节名称", name : "text", width : 120, minWidth : 60, type : "string", align : "left" }, 
			            { display : "处理人", name : "fullName", width : 230 , minWidth : 60, type : "string", align : "left" },
			             { display : "状态", name : "status", width : 100 , minWidth : 60, type : "string", align : "left" }
			             ],
			dataAction : "server",
			url : web_app.name + "/freeFlowAction!queryBackProcActivity.ajax",
			parms: { bizId: bizId, procInstId: procInstId, taskId: taskId, kindId: "back" },
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
	
   function bindEvents() {
		$(":radio").click(function(){
			var backModel = $(this).val();
			var params = { kindId:  backModel };
			UICtrl.gridSearch(gridManager, params);			
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