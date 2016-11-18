var historyGridManager=null,refreshFlag=false;
$(document).ready(function() {
	initializeHistoryGrid();
	initializeUI();
});

function initializeUI(){
    $.getFormButton(
		[
	      {id:'saveDetail',name:'保 存',event:doSave},
	      {name:'关 闭',event:closeWindow}
	    ]
	);
    //只读权限不允许下载附件
	$('#estateQualificationFileList').fileList({downloadEnable:!Public.isReadOnly});
}

function initializeHistoryGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHistoryHandler, 
		updateHandler: function(){updateHistoryHandler();}, 
		deleteHandler: deleteHistoryHandler
	});
	historyGridManager = UICtrl.grid('#historyGrid', {
		columns: [
		{ display: "变更内容", name: "content", width: 600, minWidth: 60, type: "string", align: "left" },
		{ display: "编辑人", name: "lastModifByName", width: 80, minWidth: 60, type: "string", align: "left" },		   
		{ display: "编辑时间", name: "lastModifDate", width: 80, minWidth: 60, type: "date", align: "left" }	
		],
		dataAction : 'server',
		url: web_app.name+'/estateQualificationAction!slicedQueryEstateQualificationChange.ajax',
		parms:{estateQualificationId:getId(),status:1},
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
	historyGridManager.loadData();
} 
function getId(){
	return $('#detailId').val()||0;
}
//新增保存
function doSave() {
	var id=$('#detailId').val();
	var url=web_app.name + '/estateQualificationAction!saveEstateQualification.ajax';
	$('#submitForm').ajaxSubmit({url:url ,
		success : function(data) {
			if(id==''){
				$('#detailId').val(data);
				$('#estateQualificationFileList').fileList({bizId:data});
			}
			refreshFlag=true;
		}
	});
}

//添加变更历史
function addHistoryHandler(){
	if($('#detailId').val()==''){
		Public.tip('请先主信息！'); 
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
	showDialog(data.qualificationChangeId,data.content);
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
			Public.ajax(web_app.name + "/estateQualificationAction!saveEstateQualificationChange.ajax",
				{qualificationChangeId:id,estateQualificationId:getId(),content:encodeURI(historyContent)},
			function(){
				reloadGrid();
				_self.close();
			});
			return false;
		}
	});
}
//删除变更历史
function deleteHistoryHandler(){
	DataUtil.delSelectedRows({action:'estateQualificationAction!deleteEstateQualificationChange.ajax',
		gridManager:historyGridManager,idFieldName:'qualificationChangeId',
		onSuccess:function(){
			historyGridManager.loadData();
		}
	});
}

function closeWindow(){
	if(refreshFlag){
		UICtrl.closeAndReloadParent('hrEstateQualification');
	}else{
		UICtrl.closeCurrentTab();
	}
}