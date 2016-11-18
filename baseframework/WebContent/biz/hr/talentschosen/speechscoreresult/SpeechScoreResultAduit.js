var gridManager = null, refreshFlag = false;
var dataSource={
		yesOrNo:{1:'是',0:'否'}
	};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
    $('#speechScoreResultFileList').fileList();
	initializeGrid();
});

//初始化表格
function initializeGrid() {	
	var resultAduitId=$('#resultAduitId').val();
gridManager = UICtrl.grid('#maingrid', {
		columns: [
	   { display: "机构", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left" },		   
  		{ display: "中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "员工姓名", name: "staffName", width: 80, minWidth: 60, type: "string", align: "left" },		   
		{ display: "选拨岗位", name: "chosenPosName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "选拨机构", name: "chosenOrganName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "选拨中心", name: "chosenCenterName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "主评委平均分", name: "mainJuryAvgscore", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "平级评委平均分", name: "commonJuryAvgscore", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "下级评委平均分", name: "lowerAvgscore", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "合计平均分", name: "sumAvgscore", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "是否通过", name: "isAgree", width: 100, minWidth: 60, type: "string", align: "left",
	    editor: { type:'combobox',data:dataSource.yesOrNo},
			render: function (item) { 
				return dataSource.yesOrNo[item.isAgree];
			} },	
		{ display: "拟定岗位", name: "planPosName", width: 230, minWidth: 60, type: "string", align: "left",
		editor: { type: 'tree', required: true,data:{name : 'org',width:230,hasSearch:false,filter:'pos',getParam:function(rowData){
			return {a:1,b:1,orgRoot:'orgRoot',searchQueryCondition:"org_kind_id in('ogn','dpt','pos')"};
		}},textField:'planPosName',valueField:'planPosId'}
		}		   
		],
		dataAction : 'server',
		url: web_app.name+'/speechscoreresultAction!slicedQuerySpeechScoreResult.ajax',
		parms:{resultAduitId:resultAduitId},
		pageSize : 20,
		width : '99%',
		enabledEdit: true,
		height : 300,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'createTime',
		sortOrder:'desc',
		fixedCellHeight : true,
		autoAddRowByKeydown:false,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.resultId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);}
	
function getId() {
	return $("#resultAduitId").val() || 0;
}


function getExtendedData(){
	var extendedData = DataUtil.getGridData({gridManager: gridManager});
	if(!extendedData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(extendedData))};
}
function setId(value){
	$("#resultAduitId").val(value);
    $('#speechScoreResultFileList').fileList({bizId:value});
	gridManager.options.parms['resultAduitId'] =value;
}
