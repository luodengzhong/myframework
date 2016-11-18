var gridManager=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	cancelIsReadHandleResult();
});

function getId() {
	return $("#activityHolidayId").val() || 0;
}

function setId(value){
	$("#activityHolidayId").val(value);
	gridManager.options.parms['activityHolidayId'] = value;
}

function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		//addBatchHandler: function(){}, 
		addHandler: addPersonHandler, 
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "人员ID", name: "personId", width: 180, minWidth: 60, type: "string", align: "left", hide: "true"},
		{ display: "全路径", name: "fullName", width: 250, minWidth: 60, type: "string", align: "left",},
		{ display: "人员名称", name: "personName", width: 150, minWidth: 60, type: "string", align: "left",},		   
		{ display: "天数", name: "holidayDay", width: 180, minWidth: 60, type: "string", align: "left",
			editor : {
				type : 'text',
				required : true,
				mask : "nn.n"
			}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/activityHolidayAction!slicedQueryDetailList.ajax',
		parms:{ activityHolidayId: getId(),pagesize:1000},
		usePager: false,
		width : '98.8%',
		height : 400,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		autoAddRow:{activityHolidayId:""},
		enabledEdit: true,
		checkbox: true,
		onLoadData: function(){
			return (getId() > 0);
		}
	});
}

function addPersonHandler(){
    var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();
	UICtrl.showFrameDialog({
		title : "选择人员",
		url : web_app.name + "/orgAction!showSelectOrgDialog.do",
		param : selectOrgParams,
		width : 700,
		height : 400,
		ok : function() {
			var _self=this,data = _self.iframe.contentWindow.selectedData;
			if (!data)
				return;
			addPersons(data,'id','name');
			_self.close();
		}
	});
}

function addPersons(data,idName,name){
	var addRows = [], addRow;
	$.each(data, function(i, o) {
		addRow = $.extend({}, o);
		addRow["personId"]=o[idName];
		addRow["personName"]=o[name];
		addRow["fullName"]=o['fullName'];
		addRow["holidayDay"] = '';
		addRows.push(addRow);
	});
	gridManager.addRows(addRows);
}

function addHandler() {
	UICtrl.addGridRow(gridManager);
}

function reloadGrid() {
	gridManager.loadData();
} 

function deleteHandler(){
	DataUtil.delSelectedRows({ action:'activityHolidayAction!deleteDetail.ajax', 
		gridManager: gridManager, idFieldName: 'activityHolidayDetailId',
		onSuccess:function(){
			reloadGrid();
		}
	});
}

function addDateFast(){
}


function getExtendedData(){
	var detailData = DataUtil.getGridData({gridManager: gridManager});
	if(!detailData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(detailData))};
}