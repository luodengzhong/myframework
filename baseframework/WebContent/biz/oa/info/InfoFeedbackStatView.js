var gridManager = null;
$(document).ready(function() {
	initializeGrid();
});


//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns:[
		     { display: "标题", name: "name", width: 200, minWidth: 60, type: "sting", align: "left" },
		     { display: "反馈内容", name: "itemResult", width: 200, minWidth: 60, type: "sting", align: "left" },
		     { display: "记数", name: "co", width: 60, minWidth: 60, type: "number", align: "left" },
		     { display: "合计", name: "sumResult", width: 100, minWidth: 60, type: "number", align: "left" },
		     { display: "平均", name: "avgResult", width: 100, minWidth: 60, type: "number", align: "left" },
		     { display: "最大", name: "maxResult", width: 100, minWidth: 60, type: "sting", align: "left" },
		     { display: "最小", name: "minResult", width: 100, minWidth: 60, type: "sting", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/oaInfoAction!slicedQueryFeedBackStatClearUp.ajax',
		parms:{infoPromulgateId:$('#infoPromulgateId').val()},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
}