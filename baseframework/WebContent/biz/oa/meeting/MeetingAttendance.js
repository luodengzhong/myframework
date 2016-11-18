var gridManager = null,attendanceGrid = null,refreshFlag = false,attendanceFlgData={};
var yesOrNo = {1:'是',0:'否'};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	gridInit();
	initTab();
	attendanceFlgData = $("#attendanceFlg").combox("getJSONData");
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds : "ogn,dpt,pos"};
			}
			return {showDisabledOrg:0};
		},
		changeNodeIcon:function(data){
			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
		},
		IsShowMenu:false,
		onClick : onFolderTreeNodeClick
	});
}

function onFolderTreeNodeClick(data) {
	var html=[],id='',name='',orgKindId='',fullId='',fullName='';
	if(!data){
		html.push('参会人员查看');
	}else{
		id=data.id,name=data.name,orgKindId=data.orgKindId,fullId=data.fullId,fullName=data.fullName;
		$('#fullId').val(fullId);
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>参会人员查看');
		refreshGrid();
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
}

//查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
	if(attendanceGrid!=null)
	UICtrl.gridSearch(attendanceGrid, param);
}

function getId() {
	return $("#meetingId").val();
}

function gridInit(){
	gridManager = UICtrl.grid('#participateGrid', {
		columns: [
			{ display: "参会人", name: "personName", width: 140, minWidth: 120, type: "string", align: "left"},
			{ display: "是否考勤", name: "needSign", width: 60, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return yesOrNo[item.needSign];
				}},
			{ display: "参与状态", name: "attendanceFlag", width: 80, minWidth: 80, type: "string", align: "left",
					render: function (item) { 
						return attendanceFlgData[item.attendanceFlag];
					}},
			{ display: "代理人", name: "agentPersonName", width: 140, minWidth: 120, type: "string", align: "left"},
			{ display: "序列号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left"	}
		],
		dataAction : 'server',
		url: web_app.name+'/meetingAction!slicedQueryMeetingAttendance.ajax',
		parms:{meetingId:getId(),attendanceKindId:'participant'},
		pageSize : 20,
		width : '99%',
		height : 340,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		checkbox:false,
		usePager: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

function attendanceGridInit(){
	attendanceGrid = UICtrl.grid('#attendanceGrid', {
		columns: [
			{ display: "参会人", name: "personName", width: 140, minWidth: 120, type: "string", align: "left"},
			{ display: "是否考勤", name: "needSign", width: 60, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return yesOrNo[item.needSign];
				}},
			{ display: "参与状态", name: "attendanceFlag", width: 80, minWidth: 80, type: "string", align: "left",
					render: function (item) { 
						return attendanceFlgData[item.attendanceFlag];
					}},
			{ display: "代理人", name: "agentPersonName", width: 140, minWidth: 120, type: "string", align: "left"},
			{ display: "序列号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left"	}
		],
		dataAction : 'server',
		url: web_app.name+'/meetingAction!slicedQueryMeetingAttendance.ajax',
		parms:{meetingId:getId(),attendanceKindId:'attendance'},
		pageSize : 20,
		width : '99%',
		height : 340,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		usePager: true,
		checkbox:false,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
	attendanceGrid.loadData();
}

function refreshGrid(){
	var obj = $("#queryMainForm");
	query(obj);
}

function initTab(){
	$('#meetingAttendanceTab').tab().on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.is('li')){
			var id=$clicked.attr('id');
			if(id=='attendance'){
				if(attendanceGrid==null){
					attendanceGridInit();
				}
				attendanceGrid._onResize.ligerDefer(attendanceGrid, 50);
			}
			else if(id=='participate'){
				if(gridManager==null){
					gridInit();
				}
				gridManager._onResize.ligerDefer(gridManager, 50);
			}
		}
	});
}