var gridManager = null;
var meetingStatusData={};
$(document).ready(function(){
	UICtrl.autoSetWrapperDivHeight();
	meetingStatusData = $("#meetingStatusId").combox("getJSONData");
	initKindTree();
	$('#personName').searchbox({ type:"hr", name: "queryAllArchiveSelect",
		back:{
                 staffName:"#personName",personId:"#personId"
		}
	});
	$('#meetingRoomName').searchbox({ type:"oa", name: "chooseMeetingRoom",
		back:{
                 name:"#meetingRoomName",meetingRoomId:"#meetingRoomId"
		}
	});
	initializeGrid();
});

function initKindTree(){
	$('#selectViewMeetingKind').treebox({
		treeLeafOnly: true,name:"meetingKind",
		beforeChange:function(data){
			if(data.nodeType=='f'){
				return false;
			}
			return true;
		},
		back:{text:'#selectViewMeetingKind',value:'#meetingKindId'}
    });
}

function formatDateTime(datetime){
	if(datetime.length>16){
		return datetime.substring(0,16);
	}
	return datetime;
}

function initializeGrid(){
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		exportExcelHandler: function(){
			var params = {};
			params.datas = $.toJSON(gridManager.rows);
			UICtrl.gridExport(gridManager, params);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "主题", name: "subject", width: 220, minWidth: 160, type: "string", align: "left" },		   
			{ display: "类型", name: "meetingKindName", width: 120, minWidth: 60, type: "string", align: "left" },		   
			{ display: "主持人", name: "managerName", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "负责人", name: "dutyName", width: 100, minWidth: 60, type: "string", align: "left" },	
			{ display: "开始时间", name: "startTime", width:120, minWidth: 60, type: "dateTime", align: "left",
				render: function (item) { 
					return formatDateTime(item.startTime);
				}},
			{ display: "结束时间", name: "endTime", width: 120, minWidth: 60, type: "dateTime", align: "left",
				render: function (item) { 
					return formatDateTime(item.endTime);
				}},	
			{ display: "状态", name: "status", width: 80, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return meetingStatusData[item.status];
				}},		
			{ display: "会议室数", name: "roomCount", width: 60, minWidth: 60, type: "string", align: "left"},
			{ display: "参会人数", name: "participantCount", width: 60, minWidth: 60, type: "string", align: "left"},
			{ display: "列席人数", name: "attendanceCount", width: 60, minWidth: 60, type: "string", align: "left"} 
		],
		dataAction : 'server',
		url: web_app.name+'/meetingAction!slicedQueryMeetingStatistics.ajax',
		manageType:'meetingManage,CenterAssetManager',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'startTime',
		sortOrder:'desc',
		checkbox:false,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		onDblClickRow: function (data, rowIndex, rowObj) {
		    openUrl(data.meetingId,data.subject);
		},
		selectRowButtonOnly : true
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

function openUrl(bizId,subject){
	subject = '会议申请单['+subject+']';
	var url= web_app.name+'/meetingAction!showUpdate.job?bizId='+bizId+'&isReadOnly=true&useDefaultHandler=0&isStatistic=1';
	parent.addTabItem({
		tabid : bizId,
		text : subject,
		url : url
	});
}