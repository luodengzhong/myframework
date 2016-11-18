var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	initializeGrid();
	/*$.getFormButton([{name:'保 存  ',event:function(){
		save();
		}},{id:"submit",name:'提 交',event:function(){
			submit();
		}}]);*/
});

//初始化表格
function initializeGrid() {
	var teacherScoreId=$('#teacherScoreId').val();
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "内容", name: "content", width: 600, minWidth: 60, type: "string", align: "left" },		   
		{ display: "分值", name: "totalScore", width: 100, minWidth: 60, type: "string", align: "left"},		   
		{ display: "得分", name: "score", width: 100, minWidth: 60, type: "string", align: "left",
			editor:{type:'text',required:'true',mask:'nn'}}		   
		],
		dataAction : 'server',
		url: web_app.name+'/teacherScoreAction!slicedQueryScoreDetail.ajax',
		parms:{teacherScoreId:teacherScoreId},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 'auto',
		enabledEdit: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true
		
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

function save(){
	var detailData =getExtendedData();
	if(detailData===false){
		return;
	}
	
	
	$('#submitForm').ajaxSubmit({url: web_app.name + '/teacherScoreAction!update.ajax',
		param : $.extend({}, detailData),
		success : function() {
			//如果不关闭对话框这里需要对主键赋值
			refreshFlag = true;
		}
	});
}

function getExtendedData(){
	var detailData = DataUtil.getGridData({gridManager: gridManager,idFieldName:'detailId'});
	if(!detailData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(detailData))};
}

function getId() {
	return $("#teacherScoreId").val() || 0;
}

function setId(value){
	$("#teacherScoreId").val(value);
	gridManager.options.parms['teacherScoreId'] =value;

}

function advance(){
	var detailData =getExtendedData();
	if(detailData===false){
		return;
	}
	
	
	$('#submitForm').ajaxSubmit({url: web_app.name + '/teacherScoreAction!submit.ajax',
		param : $.extend({}, detailData),
		success : function() {
			UICtrl.closeAndReloadTabs("TaskCenter", null);


		}
	});
	
}


