var gridManager = null,planCalendarExceptionsGridManager=null, refreshFlag = false;
var yesorno={1:'是',0:'否'};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler,
		enableHandler: enableHandler,
		disableHandler: disableHandler,
		saveSortIDHandler: saveSortIDHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [   
		{ display: "日历编码", name: "calendarCode", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "日历名称", name: "calendarName", width: 150, minWidth: 60, type: "string", align: "left" },		   
		{ display: "是否是默认日历", name: "isBaseCalendar", width: 100, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return yesorno[item.isBaseCalendar];
			}
		},		   
		{ display: "序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left" ,
			render: function (item) { 
				return UICtrl.sequenceRender(item,'calendarId');
			}
		},		   
		{ display: "状态", name: "status", width: 60, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.getStatusInfo(item.status);
			}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/planCalenderAction!slicedQueryPlanCalendar.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox:true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.calendarId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
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

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}

//添加按钮 
function addHandler() {
	UICtrl.showAjaxDialog({
		url: web_app.name + '/planCalenderAction!showInsertPlanCalendar.load',
		width:650,
		init:initDetailPage, 
		ok: doSave,
		close: dialogClose
	});
}

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.calendarId;
	}
	UICtrl.showAjaxDialog({
		url: web_app.name + '/planCalenderAction!showUpdatePlanCalendar.load',
		width:650,
		param:{calendarId:id},
		init:initDetailPage,
		ok: doSave,
		close: dialogClose
	});
}


function initDetailPage(){
	$('#calendarTabDiv').tab();//初始化选项卡
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function(){
			UICtrl.addGridRow(planCalendarExceptionsGridManager);
		}, 
		deleteHandler: function(){
			DataUtil.delSelectedRows({action:'planCalenderAction!deletePlanCalendarExceptions.ajax',
				gridManager:planCalendarExceptionsGridManager,idFieldName:'exceptionsId',
				onSuccess:function(){
					planCalendarExceptionsGridManager.loadData();
				}
			});
		}
	});
	planCalendarExceptionsGridManager = UICtrl.grid('#planCalendarExceptionsGrid', {
		columns: [		   
		{ display: "例外名称", name: "exceptionsName", width: 120, minWidth: 60, type: "string", align: "left",
			editor: { type: 'text',required:true}
		},		   
		{ display: "是否工作", name: "dayWorking", width: 60, minWidth: 60, type: "string", align: "left",
			editor: { type:'combobox',data:yesorno,required: true},
			render: function (item) { 
				return yesorno[item.dayWorking];
			}
		},		   
		{ display: "开始时间", name: "fromDate", width: 140, minWidth: 60, type: "date", align: "left",
			editor: { type:'date',required: true}
		},		   
		{ display: "结束时间", name: "toDate", width: 140, minWidth: 60, type: "date", align: "left",
			editor: { type:'date',required: true}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/planCalenderAction!slicedQueryPlanCalendarExceptions.ajax',
		pageSize : 10,
		width : '99%',
		height :'248',
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fromDate',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		enabledEdit: true,
		selectRowButtonOnly : true,
		checkbox:true,
		autoAddRow:{dayWorking:0},
		onLoadData :function(){
			return !($('#detailCalendarId').val()=='');
		}
	});
}

//删除按钮
function deleteHandler(){
	DataUtil.del({action:'planCalenderAction!deletePlanCalendar.ajax',
		gridManager:gridManager,idFieldName:'calendarId',
		onCheck:function(data){
			if(parseInt(data.status)!=0){
				Public.tip(data.calendarName+'不是草稿状态,不能删除!');
				return false;
			}
		},
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

//保存
function doSave() {
	//获取例外时间
	var detailData=DataUtil.getGridData({gridManager:planCalendarExceptionsGridManager,idFieldName:'exceptionsId'});
	if(!detailData) return false;
	//获取工作周数据
	var weekDays=new Array(),working = false;
	$('#planCalendarWeekDays').find('input').each(function(){
		var checked=$(this).is(':checked'),value=$(this).val();
		weekDays.push({dayType:value,dayWorking:checked?1:0});
		if(checked){
			working=true;
		}
	});
	if(!working){
		Public.tip('工作周必须有一天是工作日!');
		return false;
	}
	$('#submitForm').ajaxSubmit({url: web_app.name + '/planCalenderAction!savePlanCalendar.ajax',
		param:{detailData:encodeURI($.toJSON(detailData)),weekDays:$.toJSON(weekDays)},
		success : function(data) {
			$('#detailCalendarId').val(data);
			planCalendarExceptionsGridManager.loadData();
			refreshFlag = true;
		}
	});
}

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "planCalenderAction!updatePlanCalendarSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'calendarId', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'planCalenderAction!updatePlanCalendarStatus.ajax',
		gridManager: gridManager,idFieldName:'calendarId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'planCalenderAction!updatePlanCalendarStatus.ajax',
		gridManager: gridManager,idFieldName:'calendarId',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
