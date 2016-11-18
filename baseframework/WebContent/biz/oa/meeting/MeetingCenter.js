var gridManager, requestViewMeetingKind,meetingKind="1";
var meetingStatusData={};
$(function () {
    bindEvents();
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
    initializateUI();
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

function editMeeting(meetingData){
	var meetingId = meetingData.meetingId;
	var subject = meetingData.subject;
	var status = meetingData.status;
	var isReadOnly = true;
	if(status=="0"||status=="1"||status=="2"||status=="3"){
		isReadOnly = false;
	}
	var url= web_app.name+'/meetingAction!forwardUpdateMeeting.do?isReadOnly='+isReadOnly+'&meetingId='+meetingId;
	parent.addTabItem({
		tabid : meetingId,
		text : subject,
		url : url
	});
}

function bindEvents() {
    //我的会议事件绑定
    $('#myselfMeetingSearch').bind('click', function (e) {
        var $clicked = $(e.target || e.srcElement);
        $('div.taskCenterChoose').removeClass('taskCenterChoose');
        if ($clicked.is('div.taskCenterSearch')) {//使用taskCenterSearch的样式
        	$clicked.addClass('taskCenterChoose');
            meetingKind = $clicked.attr('meetingKind');
            doQuery();
        }
    });
}

function doQuery(){
	gridManager.options.parms = {};
	var obj = $('#queryMainForm');
	var param = $(obj).formToJSON();
	param.viewMeetingKind = meetingKind;
	 UICtrl.gridSearch(gridManager,param);
}

//刷新表格
function reloadGrid() {
    gridManager.loadData();
}

//重置表格
function resetForm(obj) {
	$(obj).formClean();
}

function initializeGrid() {
    gridManager = UICtrl.grid("#maingrid", {
        columns: [
		    { display: "主题", name: "subject", width: 210, minWidth: 160, type: "string", align: "left" },		   
			{ display: "类型", name: "meetingKindName", width: 110, minWidth: 60, type: "string", align: "left" },		   
			{ display: "主持人", name: "managerName", width: 90, minWidth: 60, type: "string", align: "left" },
			{ display: "负责人", name: "dutyName", width: 90, minWidth: 60, type: "string", align: "left" },	
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
        url: web_app.name + "/meetingAction!slicedQuerySelfMeeting.ajax",
        pageSize: 20,
        parms: { viewMeetingKind: meetingKind },
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
        	if(meetingKind=="2"){
        		editMeeting(data);
        	}
        	else{
        		openUrl(data.meetingId,data.subject);
        	}
        }
    });
}

function initializateUI() {
    var layout = $("#layout"), bodyHeight;
    UICtrl.layout(layout, { leftWidth: 230, heightDiff: -5, onHeightChanged: function (options) {
        bodyHeight = layout.height() - 2;
        $('#divTreeArea').height(bodyHeight - 38);
    } 
    });
    bodyHeight = layout.height() - 2;
    $('#divTreeArea').height(bodyHeight - 38);
 
    UICtrl.autoGroupAreaToggle();
    //查询条件默认不显示
    $('#titleConditionArea').find('a.togglebtn').trigger('click');
}

function formatDateTime(datetime){
	if(datetime.length>16){
		return datetime.substring(0,16);
	}
	return datetime;
}

function openUrl(bizId,subject){
	var url= web_app.name+'/meetingAction!showUpdate.job?bizId='+bizId+'&isReadOnly=true';
	parent.addTabItem({
		tabid : bizId,
		text : subject,
		url : url
	});
}