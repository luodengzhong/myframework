var gridManager = null, refreshFlag = false,wageFlag=null;
$(document).ready(function() {
	wageFlag=$('#mainWageFlag').combox('getJSONData');
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	$('#toolbar_menuAddBatch').comboDialog({type:'hr',name:'personArchiveSelect',width:635,
		dataIndex:'archivesId',manageType:'hrPayFreezeManage',
		checkbox:true,onChoose:function(){
	    	var rows=this.getSelectedRows();
	    	var addRows = [], addRow;
	    	$.each(rows, function(i, o){
	    		addRow = $.extend({}, o);
	    		addRow["organId"] = o["ognId"];
	    		addRow["organName"] = o["ognName"];
	    		addRow["deptId"] = o["dptId"];
	    		addRow["deptName"] = o["dptName"];
	    		addRow["archivesName"] = o["staffName"];
	    		addRows.push(addRow);
	    	});
	    	gridManager.addRows(addRows);
	    	return true;
    }});
	$('#payFreezeFileList').fileList();
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addBatchHandler: function(){},
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "机构名称", name: "organName", width: 80, minWidth: 60, type: "string", align: "left",frozen: true },	
		{ display: "所属一级中心", name: "centreName", width: 80, minWidth: 60, type: "string", align: "left",frozen: true },
		{ display: "部门名称", name: "deptName", width: 80, minWidth: 60, type: "string", align: "left",frozen: true },	   
		{ display: "姓名", name: "archivesName", width: 100, minWidth: 60, type: "string", align: "left",frozen: true},		   
		{ display: "工资发放标志", name: "wageFlag", width: 100, minWidth: 60, type: "string", align: "left",
			editor: { type:'combobox',data:wageFlag,required: true},
			render: function (item) { 
				return wageFlag[item.wageFlag];
			}
		},   
		{ display: "原因", name: "content", width: 400, minWidth: 60, type: "string", align: "left" ,
			editor: { type:'text'}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/payFreezeAction!slicedQueryPayFreezeDetail.ajax',
		parms:{freezeId:$('#freezeId').val()},
		pageSize : 20,
		width : '99%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		enabledEdit: true,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		autoAddRow:{organId:'',auditId:'',deptId:'',posId:'',centreId:'',fullId:''},
		onLoadData :function(){
			return !($('#freezeId').val()=='');
		}
	});
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 
function getId() {
	var id=$("#freezeId").val();
	return Public.isBlank(id)?0:id;
}

function setId(value){
	$("#freezeId").val(value);
	gridManager.options.parms['freezeId'] =value;
	$('#payFreezeFileList').fileList({bizId:value});
}
function afterSave(){
	reloadGrid();
}

function checkConstraints(){
	if (gridManager.getData().length == 0){
		Public.tip("没有选择员工信息，不能提交！");
		return false;
	}
	return true;
}
function deleteHandler(){
	DataUtil.delSelectedRows({action:'payFreezeAction!deletePayFreezeDetail.ajax',
		gridManager: gridManager,idFieldName:'detailId',
		onSuccess:function(){
			gridManager.loadData();
		}
	});
}
function getExtendedData(){
	var detailData = DataUtil.getGridData({gridManager: gridManager});
	if(!detailData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(detailData))};
}