var gridManager;
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

//刷新表格
function reloadGrid() {
    gridManager.loadData();
}

function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

//重置表格
function resetForm(obj) {
	$(obj).formClean();
}

function initializeGrid() {
    gridManager = UICtrl.grid("#maingrid", {
        columns: [
            { display: "单据编号", name: "billCode", width: 120, minWidth: 100, type: "string", align: "center"},      
		    { display: "主题", name: "subject", width: 260, minWidth: 160, type: "string", align: "left" },		   
			{ display: "类型", name: "meetingKindName", width: 120, minWidth: 60, type: "string", align: "left" },		   
			{ display: "主持人", name: "managerName", width: 120, minWidth: 60, type: "string", align: "left" },
			{ display: "负责人", name: "dutyName", width: 140, minWidth: 60, type: "string", align: "left" },	
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
			}}
		 ],
        dataAction: "server",
        url: web_app.name + "/meetingAction!slicedQueryOnMeeting.ajax",
        pageSize: 20,
        width: "99.8%",
        height: '100%',
        rownumbers: true,
        heightDiff: -10,
        headerRowHeight: 25,
        rowHeight: 25,
        sortName: 'startTime',
        sortOrder: 'desc',
        fixedCellHeight: true,
        selectRowButtonOnly: true,
        onDblClickRow: function (data, rowIndex, rowObj) {
        	editMeeting(data);
        }
    });
    UICtrl.setSearchAreaToggle(gridManager);
}

function editMeeting(meetingData){
	var meetingId = meetingData.meetingId;
	var subject = meetingData.subject;
	var status = meetingData.status;
	var isReadOnly = true;
	if(status=="0"||status=="1"||status=="2"||status=="3"){
		isReadOnly = false;
	}
	var url= web_app.name+'/meetingAction!forwardUpdateMeeting.do?isManager=true&isReadOnly='+isReadOnly+'&meetingId='+meetingId;
	parent.addTabItem({
		tabid : meetingId,
		text : subject,
		url : url
	});
}

function formatDateTime(datetime){
	if(datetime.length>16){
		return datetime.substring(0,16);
	}
	return datetime;
}