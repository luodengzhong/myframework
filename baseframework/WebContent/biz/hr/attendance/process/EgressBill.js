var gridManager = null;

$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	cancelIsReadHandleResult();

	// 缓存登录人信息，用于代理请假
	$("#deputyIdTemp").val($("#personMemberId").val());
	$("#deputyFullIdTemp").val($("#fullId").val());
	$("#deputyNameTemp").val($("#personMemberName").val());
	$("#personMemberName").searchbox({type : "sys", name : "orgSelect",
		getParam : function() {
			return {a : 1, b : 1, searchQueryCondition : " org_id = '" + getOrganId() + "'  and  org_kind_id ='psm' and instr(full_id, '.prj') = 0 "};
		},
		back : {
			fullId : "#fullId",
			orgId : "#organId",
			orgName : "#organName",
			centerId : "#centerId",
			centerName : "#centerName",
			deptId : "#deptId",
			deptName : "#deptName",
			positionId : "#positionId",
			positionName : "#positionName",
			personMemberId : "#personMemberId",
			personMemberName : "#personMemberName"
		},
		onChange : function() {
			$("#deputyName").val($("#deputyNameTemp").val());
		}
	});
});

function getOrganId() {
	return $("#organId").val();
}

function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "开始时间", name: "startDate", width: 120, minWidth: 180, type: "datetime", align: "left", 
			editor: { type:'dateTime' ,required:true}
		},	   
		{ display: "结束时间", name: "endDate", width: 120, minWidth: 180, type: "datetime", align: "left", 
			editor: { type:'dateTime',required:true}
		},			
		{ display: "公出地点及事由", name: "addressReason", width: 600, minWidth: 600, type: "string", align: "left", 
			editor: { type:'text',required:true,maxlength:256}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/attEgressAction!queryEgressDetail.ajax',
		parms:{ egressId: getId() || 0,pagesize:1000},
		usePager: false,
		width : '99%',
		height : 300,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		enabledEdit: true,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true, 
		autoAddRow:{fullId: "", organId:"", centerId:"", deptId:"", positionId: "", personMemberId: ""},
		onLoadData: function(){
			return !($('#egressId').val()=='');
		}
	});
}

function addHandler() {
	UICtrl.addGridRow(gridManager);
}

function reloadGrid() {
	gridManager.loadData();
} 

function deleteHandler(){
	DataUtil.delSelectedRows({ action:'attEgressAction!deleteEgressDetail.ajax', 
		gridManager: gridManager, idFieldName: 'detailId',
		onSuccess:function(){
			reloadGrid();
		}
	});
}

function getId() {
	return $("#egressId").val() || 0;
}

function setId(value){
	$("#egressId").val(value);
	gridManager.options.parms['egressId'] =value;
}


function afterSave(){
	reloadGrid();
}

function getExtendedData(){
	var detailData = DataUtil.getGridData({gridManager: gridManager});
	if(!detailData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(detailData))};
}


