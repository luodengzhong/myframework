var gridManager = null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	$('#examSubject').searchbox({
		type: 'hr', name: 'examStartQuery',
		manageType:'hrExaminationManage',
		back: {
			examStartId: '#examStartId', 
			subject:'#examSubject'
		}
	});
}

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		},
		viewTaskHandler:{id:'viewTask',text:'考试记录',img:'page_url.gif',click:function(){
			viewTaskHandler();
		}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
			{ display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "发起人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "考试类型", name: "examinationTypeName", width: 100, minWidth: 60, type: "string", align: "left" },
		    { display: "考试主题", name: "subject", width: 250, minWidth: 60, type: "string", align: "left" },
		    { display: "姓名", name: "personName", width: 100, minWidth: 60, type: "string", align: "left",
		    	render: function (item) { 
					return "<font color='"+(item.isQualified==1?'green':'red')+"'>"+item.personName+"</font>";
				}
		    },	
			{ display: "人员路径", name: "personFullName", width: 300, minWidth: 60, type: "string", align: "left" },	
			{ display: "考试次数", name: "examCount", width: 80, minWidth: 60, type: "string", align: "left"},
			{ display: "是否合格", name: "isQualifiedTextView", width: 80, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return "<font color='"+(item.isQualified==1?'green':'red')+"'>"+(item.isQualifiedTextView?item.isQualifiedTextView:'')+"</font>";
				}
			},
			{ display: "最终分数", name: "finalScore", width: 80, minWidth: 60, type: "string", align: "left"},
			{ display: "开始考试时间", name: "examStartTime", width:100, minWidth: 60, type: "date", align: "left"},
			{ display: "完成考试时间", name: "examEndTime", width: 100, minWidth: 60, type: "date", align: "left"},
			{ display: "状态", name: "personStatusTextView", width: 80, minWidth: 60, type: "string", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/examStartAction!slicedQueryExamPersonResultByStart.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'exam_start_person_id',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return !($('#examStartId').val()=='');
		}
	});
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	if(!param) return false;
	UICtrl.gridSearch(gridManager, param);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}