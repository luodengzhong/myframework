var gridManager = null,lineUpGridManager=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
	initializeLineUpGrid();
});
function initializeUI(){
	$('#personId').combox({onChange:function(){
		setTimeout(function(){
			query($('#queryMainForm'));
		},0);
	}});
	$("#layoutGrid").ligerLayout({
            leftWidth:  ($(window).width() - 200) /2,
            heightDiff: -5
    });
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		viewHandler:function(){
			var data = gridManager.getSelectedRow();
			if (!data) {Public.tip('请选择数据！'); return; }
			viewHandler(data);
		},
		addToLineUp:{id:'addToLineUp',text:'添加到排队',img:'page_tag_red.gif',click:function(){
			var data = gridManager.getSelectedRow();
			if (!data) {Public.tip('请选择数据！'); return; }
			var personId=$('#personId').val();
			Public.ajax(web_app.name + '/askReportAction!saveAskReportLineUp.ajax',{bizId:data.bizId,personId:personId},function(){
				reloadGrid();
				reloadLineUpGrid();
			});
		}}
	});
	var personId=$('#personId').val();
	gridManager = UICtrl.grid('#maingrid', {
		columns: [	   
			{ display: "标题", name: "description", width: 400, minWidth: 60, type: "string", align: "left" },	
			{ display: "发起人", name: "applicantPersonMemberName", width: 120, minWidth: 60, type: "string", align: "left" },
			{ display: "提交时间", name: "procInstStartTime", width: 120, minWidth: 60, type: "date", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/askReportAction!slicedQueryAskReportTask.ajax',
		parms:{personId:personId},
		pageSize : 20,
		width : '100%',
		height : '100%',
		sortName:'proc_inst_start_time',
		sortOrder:'asc',
		heightDiff : -10,
		headerRowHeight : 25,
		toolbar: toolbarOptions,
		rowHeight : 25,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data);
		},
		onLoadData :function(){
			var personId=$('#personId').val();
			return !(Public.isBlank(personId));
		}
	});
}

function initializeLineUpGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		viewHandler:function(){
			var data = lineUpGridManager.getSelectedRow();
			if (!data) {Public.tip('请选择数据！'); return; }
			viewHandler(data);
		},
		deleteHandler: function(){
			var data = lineUpGridManager.getSelectedRow();
			if (!data) {Public.tip('请选择数据！'); return; }
			Public.ajax(web_app.name + '/askReportAction!deleteAskReportLineUp.ajax',{reportLineUpId:data.reportLineUpId},function(){
				reloadGrid();
				reloadLineUpGrid();
			});
		},
		saveSortIDHandler: saveSortIDHandler
	});
	var personId=$('#personId').val();
	lineUpGridManager = UICtrl.grid('#lineUpGrid', {
		columns: [	   
			{ display: "序号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left" ,frozen: true,
				render: function (item) { 
					return UICtrl.sequenceRender(item,'reportLineUpId');
				}
			},
			{ display: "标题", name: "description", width: 500, minWidth: 60, type: "string", align: "left" },	
			{ display: "发起人", name: "applicantPersonMemberName", width: 120, minWidth: 60, type: "string", align: "left" },
			{ display: "提交时间", name: "procInstStartTime", width: 120, minWidth: 60, type: "date", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/askReportAction!slicedQuerySupperAskReport.ajax',
		parms:{personId:personId},
		pageSize : 20,
		width : '100%',
		height : '100%',
		sortName:'sequence asc,proc_inst_start_time asc',
		sortOrder:true,
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data);
		},
		onLoadData :function(){
			var personId=$('#personId').val();
			return !(Public.isBlank(personId));
		}
	});
	UICtrl.createGridQueryBtn('#lineUpGrid','div.l-panel-topbar',function(param){
		UICtrl.gridSearch(lineUpGridManager, {params:encodeURI(param)});
	});
}
// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 
function reloadLineUpGrid() {
	lineUpGridManager.loadData();
} 
//重置表单
function resetForm(obj) {
	//不清空被管理人
	$(obj).formClean(['personId','personId_text']);
}

//查看按钮
function viewHandler(data){
	var bizId=data.bizId;
	var url=web_app.name + '/askReportAction!showUpdateAskReport.job?bizId='+bizId+'&isReadOnly=true';
	parent.addTabItem({ tabid: 'askReport'+bizId, text: '查看请示报告', url:url});
}

//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "askReportAction!updateSupperAskReportSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: lineUpGridManager,idFieldName:'reportLineUpId', onSuccess: function(){
		reloadLineUpGrid(); 
	}});
	return false;
}