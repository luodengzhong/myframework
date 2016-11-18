var gridManager = null,historyGridManager=null,refreshFlag=false;
var registrationUserKind={};
$(document).ready(function() {
	registrationUserKind=$('#mainRegistrationUserKind').combox('getJSONData');
	initializePersonGrid();
	initializeHistoryGrid();
	initializeUI();
});

function initializeUI(){
	$('#personGrid').find('#toolbar_menuAdd').comboDialog({type:'hr',name:'personArchiveSelect',width:635,
		dataIndex:'archivesId',
		checkbox:true,onChoose:function(){
	    	var rows=this.getSelectedRows();
	    	var addRows = [];
	    	$.each(rows, function(i, o){
	    		var addRow={};
	    		addRow["archivesId"] = o["archivesId"];
	    		addRow["staffName"] = o["staffName"];
	    		addRows.push(addRow);
	    	});
	    	gridManager.addRows(addRows);
	    	return true;
    }});
    $.getFormButton(
		[
	      {id:'saveDetail',name:'保 存',event:doSave},
	      {name:'关 闭',event:closeWindow}
	    ]
	);
	$('#businessRegistrationFileList').fileList();
}

//初始化表格
function initializePersonGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function(){}, 
		deleteHandler: deletePersonHandler
	});
	gridManager = UICtrl.grid('#personGrid', {
		columns: [
		{ display: "人员", name: "staffName", width: 80, minWidth: 60, type: "string", align: "left" },		   
		{ display: "类别", name: "registrationUserKind", width: 80, minWidth: 60, type: "string", align: "left",
			editor: { type:'combobox',data:registrationUserKind,required: true},
			render: function (item) { 
				return registrationUserKind[item.registrationUserKind];
			}
		},
		{ display: "备注", name: "remark", width: 220, minWidth: 60, type: "string", align: "left",
			editor: { type:'text',maxLength:100}
		},
		{ display: "编辑人", name: "lastModifByName", width: 80, minWidth: 60, type: "string", align: "left" },		   
		{ display: "编辑时间", name: "lastModifDate", width: 80, minWidth: 60, type: "date", align: "left" }	
		],
		dataAction : 'server',
		url: web_app.name+'/hrSetupAction!slicedQueryBusinessRegistrationUsers.ajax',
		parms:{businessRegistrationId:getId(),status:0},
		enabledEdit: true,
		pageSize : 10,
		width : '100%',
		height : 300,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'lastModifDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return !($('#detailId').val()=='');
		}
	});
}
function initializeHistoryGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHistoryHandler, 
		updateHandler: function(){updateHistoryHandler();}, 
		deleteHandler: deleteHistoryHandler
	});
	historyGridManager = UICtrl.grid('#historyGrid', {
		columns: [
		{ display: "变更内容", name: "content", width: 400, minWidth: 60, type: "string", align: "left" },
		{ display: "编辑人", name: "lastModifByName", width: 80, minWidth: 60, type: "string", align: "left" },		   
		{ display: "编辑时间", name: "lastModifDate", width: 80, minWidth: 60, type: "date", align: "left" }	
		],
		dataAction : 'server',
		url: web_app.name+'/hrSetupAction!slicedQueryBusinessRegistrationHistory.ajax',
		parms:{businessRegistrationId:getId(),status:0},
		pageSize : 10,
		width : '100%',
		height : 300,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'lastModifDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return !($('#detailId').val()=='');
		},
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHistoryHandler(data);
		}
	});
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
	historyGridManager.loadData();
} 
function getId(){
	return $('#detailId').val()||0;
}
//新增保存
function doSave() {
	var id=$('#detailId').val();
	var url=web_app.name + '/hrSetupAction!insertBusinessRegistration.ajax';
	if(id!=''){
		url=web_app.name + '/hrSetupAction!updateBusinessRegistration.ajax';
	}
    var usersData = DataUtil.getGridData({gridManager: gridManager});
	if(!usersData){
		return false;
	}
	/*var modifData = DataUtil.getGridData({gridManager: historyGridManager});
	if(!modifData){
		return false;
	}
	,modifData:encodeURI($.toJSON(modifData))
	*/
	$('#submitForm').ajaxSubmit({url:url ,
		param:{usersData:encodeURI($.toJSON(usersData))},
		success : function(data) {
			if(id==''){
				$('#detailId').val(data);
				$('#businessRegistrationFileList').fileList({bizId:data});
			}
			refreshFlag=true;
			reloadGrid();
		}
	});
}
//删除人员信息
function deletePersonHandler(){
	DataUtil.delSelectedRows({action:'hrSetupAction!deleteBusinessRegistrationUsers.ajax',
		gridManager:gridManager,idFieldName:'registrationUserId',
		onSuccess:function(){
			gridManager.loadData();
		}
	});
}
//添加变更历史
function addHistoryHandler(){
	if($('#detailId').val()==''){
		Public.tip('请先保存工商登记信息！'); 
		return;
	}
	showDialog();
}

//编辑变更历史
function updateHistoryHandler(data){
	if(!data){
		var data = historyGridManager.getSelectedRow();
		if (!data) {Public.tip('请选择数据！'); return; }
	}
	showDialog(data.modifHistoryId,data.content);
}
function showDialog(id,content){
	id=id||'';
	content=content||'';
	var html=['<textarea maxlength="400" style="height:100px;width:250px;" class="textarea" id="historyContent">',content,'</textarea>']
	UICtrl.showDialog( {
		width:270,
		top:100,
		title : '编辑变更历史',
		content:html.join(''),
		ok : function(){
			var _self=this,historyContent=$('#historyContent').val();
			Public.ajax(web_app.name + "/hrSetupAction!saveBusinessRegistrationHistory.ajax",
				{modifHistoryId:id,businessRegistrationId:getId(),content:encodeURI(historyContent)},
			function(){
				historyGridManager.loadData();
				_self.close();
			});
			return false;
		}
	});
}
//删除变更历史
function deleteHistoryHandler(){
	DataUtil.delSelectedRows({action:'hrSetupAction!deleteBusinessRegistrationHistory.ajax',
		gridManager:historyGridManager,idFieldName:'modifHistoryId',
		onSuccess:function(){
			historyGridManager.loadData();
		}
	});
}

function closeWindow(){
	if(refreshFlag){
		UICtrl.closeAndReloadParent('businessRegistration');
	}else{
		UICtrl.closeCurrentTab();
	}
}