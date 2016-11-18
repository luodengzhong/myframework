
var gridManager = null, refreshFlag = false,yesOrNo = {0:'否', 1:'是'};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	$('#ownerNameQ').orgTree({
		param: {searchQueryCondition: "org_kind_id in('ogn','dpt')"},
		back:{
		text:'#ownerNameQ',
		value:'#ownerId',
        name:"#ownerNameQ",id:"#ownerId"
		}
	});
	/*$('#ownerNameQ').orgTree({filter:'ogn,dpt',
		param:{searchQueryCondition:"org_kind_id in('ogn','dpt')"}
	});*/
	
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
		   
		{ display: "编码", name: "code", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "名称", name: "name", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "地点", name: "place", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "考勤机编码", name: "macSn", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "所属机构", name: "ownerName", width: 140, minWidth: 60, type: "string", align: "left" },		
		{ display: "是否专用", name: "isSpecial", width: 60, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return yesOrNo[item.isSpecial];
			}},	
		{ display: "是否启用", name: "status", width: 60, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return yesOrNo[item.status];
			}},		   
		{ display: "是否支持视频", name: "supportVideo", width: 60, minWidth: 60, type: "string", align: "left" ,
			render: function (item) { 
				return yesOrNo[item.supportVideo];
			}},		   
		{ display: "容纳人数", name: "galleryful", width: 60, minWidth: 60, type: "string", align: "left" },
		{ display: "序列号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left",
			render: function(item){
				return "<input type='text' id='txtSequence_" + item.meetingRoomId + "' class='textbox' value='" + item.sequence + "' />";
			}},	
		{ display: "描述", name: "description", width: 220, minWidth: 120, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/meetingRoomAction!slicedQuery.ajax',
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
		checkbox: true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.meetingRoomId);
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

function initDialog(){
	$('#ownerName').orgTree({
		param: {searchQueryCondition: "org_kind_id in('ogn','dpt')"},
		back:{
			text:'#ownerName',
			value:'#ownerId',
	        name:"#ownerName",id:"#ownerId"
			}
	});
}

//添加按钮 
var meetingRoomTmpId = '';
function addHandler() {
	meetingRoomTmpId = '';
	UICtrl.showAjaxDialog({url: web_app.name + '/meetingRoomAction!showInsert.load', 
		ok: insert, close: dialogClose,init:initDialog,
		title:'新增会议室定义',width:610});
}

//编辑按钮
function updateHandler(meetingRoomId){
	if(!meetingRoomId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		meetingRoomId=row.meetingRoomId;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/meetingRoomAction!showUpdate.load', 
		param:{meetingRoomId:meetingRoomId},
		ok: update, close: dialogClose,init:initDialog,
		title:'修改会议室定义',width:600});
}

//删除按钮
function deleteHandler(){
	DataUtil.delSelectedRows({ action:web_app.name + '/meetingRoomAction!delete.ajax', 
		gridManager: gridManager, idFieldName: 'meetingRoomId',
		onSuccess:function(){
			reloadGrid();
		}
	});
}


//新增保存
function insert() {
	if(meetingRoomTmpId==''){
		$('#submitForm').ajaxSubmit({url: web_app.name + '/meetingRoomAction!insert.ajax',
			success : function(id) {
				meetingRoomTmpId = id;
				$('#meetingRoomId').val(id);
				refreshFlag = true;
			}
		});
	}
	else{
		update();
	}
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/meetingRoomAction!update.ajax',
		success : function() {
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
	var action = "meetingRoomAction!updateSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'meetingRoomId', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'meetingRoomAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'meetingRoomId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'meetingRoomAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'meetingRoomId', param:{status:0},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}