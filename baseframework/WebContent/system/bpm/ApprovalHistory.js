var gridManager;
$(function() {
	initializeGrid();

	function initializeGrid() {
		var bizId = Public.getQueryStringByName("bizId");
		gridManager = UICtrl.grid("#maingrid", {
			columns : [ 
			            { display : "环节名称", name : "name", width : 120, minWidth : 60, type : "string", align : "left" }, 
			            { display : "处理人", name : "handler", width : 200 , minWidth : 80, type : "string", align : "left" },
			            { display : "处理结果", name : "result", width : 60, minWidth : 60, type : "string", align : "left",
			               render: function(item){
			               	  return HandleResult.getDisplayName(item.result);
			               }
			             },
			            { display : "处理意见", name : "opinion", width : 220, minWidth : 60, type : "string", align : "left" },
                        { display : "任务类型", name : "taskKindTextView", width : 70 , minWidth : 60, type : "string", align : "left" },                      
                		{ display : "开始时间", name : "startTime", width : 130, minWidth : 60, type : "time", align : "left" },
			            { display : "结束时间", name : "endTime", width : 130, minWidth : 60, type : "time", align : "left" },
			            { display : "耗时(小时)", name : "duration", width : 60, minWidth : 60, type : "time", align : "left" },
			            { display : "状态", name : "statusName", width : 60, minWidth : 60, type : "time", align : "left" }
			             ],
			dataAction : "server",
			url : web_app.name + "/workflowAction!queryApprovalHistoryByBizId.ajax",
			parms: {bizId: bizId},
			usePager : false,
			width : "99.8%",
			height : "100%",
			rownumbers: true,
			heightDiff: -20,
			headerRowHeight : 25,
			rowHeight : 25,
			fixedCellHeight : true,
			selectRowButtonOnly : true,
			onAfterShowData: function (currentData) {
                setTimeout(function () {
                    UICtrl.setGridRowAutoHeight($('#maingrid'));
                }, 100);
            }			
		});
	}
});