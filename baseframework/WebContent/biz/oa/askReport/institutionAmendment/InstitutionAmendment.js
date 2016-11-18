var defaultTitle = "制度/工具修订报批单";
var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initGrid();
	initGetDispatchNoBtn();
	initUI();
});

//初始化表格
function initGrid() {
	$('#institutionIdAttachment').fileList();
	
	
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: showInsertDialog,
		updateHandler : showUpdateDialog,
		deleteHandler: function(){
			DataUtil.delSelectedRows({action:'institutionAmendmentAction!deleteItem.ajax',
				gridManager:gridManager,idFieldName:'institutionItemId',
				onSuccess:function(){
					gridManager.loadData();
				}
			});
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
				{ display: "序号", name: "sequence", width: 20, minWidth: 60, type: "string", align: "center" },		   
				{ display: "修订制度/工具名称", name: "name", width: 100, minWidth: 120, type: "string", align: "left" },		   
				{ display: "修订原因", name: "reason", width: 100, minWidth: 120, type: "string", align: "left" },	
				{ display: "主要修订内容", columns:[
				{ display: "修订前", name: "beforeTheChange", width: 250, minWidth: 60, type: "string", align: "left" },		   
				{ display: "修订后", name: "modifiedContent", width: 250, minWidth: 60, type: "string", align: "left" }]}		   
		],
		title:"修订内容",
		dataAction : 'server',
		url: web_app.name+'/institutionAmendmentAction!queryItemList.ajax',
		parms:{institutionId:function(){return getId();}},
		width : '99.7%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : false,
		selectRowButtonOnly : true,
		allowAdjustColWidth:true,
		enabledEdit: false,
		usePager: false,
		checkbox: true,
		onDblClickRow : function(data, rowindex, rowobj) {
			if(UICtrl.isApplyProcUnit()){
				doShowUpdateDialog(data.institutionItemId);
			}
		},
		onAfterShowData: function () {
			$(".l-grid-row-cell-inner").css("height", "auto"); //单元格高度自动化，撑开
			var i = 0;
			$("tr", ".l-grid2", "#maingrid").each(function () {
				$($("tr", ".l-grid1", "#maingrid")[i]).css("height", $(this).height()); //2个表格的tr高度一致
				i++;
			});
		},
		onAfterChangeColumnWidth: function () {
			$(".l-grid-row-cell-inner").css("height", "auto");
			var i = 0;
			$("tr", ".l-grid2", "#maingrid").each(function () {
				$($("tr", ".l-grid1", "#maingrid")[i]).css("height", $(this).height());
				i++;
			});
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}


//初始化获取发文号按钮
function initGetDispatchNoBtn(){
	var dispatchNo=$('#dispatchNo').val();
	var fn='show';
	//已存在文号或在只读审核状态下不能修改文号
	if(Public.isReadOnly||!UICtrl.isApplyProcUnit()){
		fn='hide';
	}
	$('#getDispatchNoBtn')[fn]();
}


//获取发文号
function getDispatchNo(){
	var institutionId=getId();
	if(institutionId==''){
		Public.tip('请先保存表单后再获取发文号');
		return false;
	}
	UICtrl.getDispatchNo({
		bizId:institutionId,
		bizUrl:'institutionAmendmentAction!showUpdate.job?isReadOnly=true&bizId='+institutionId,
		title:defaultTitle,
		callback:function(param){
			var _self = this;
            $('#dispatchNo').val(param['dispatchNo']);
            _self.close();
		}
	});
}

/**
* 检查约束
* 
*/
function checkConstraints() {
	var dispatchNo=$('#dispatchNo').val();
	if(dispatchNo==''){
		Public.tips({type:1,content:'发起流程前,请先获取文件编号!',time:4000});
		return false;
	}
    return true;
}

function beforeSave() {
	var subject = $("#subject").val();
	if (subject == "") {
		subject = defaultTitle;
	}
	$("#subject").val(subject);
	
	return true;
}

function setId(value) {
	$("#institutionId").val(value);
	$('#institutionIdAttachment').fileList({
		bizId : value
	});
}

function getId() {
	return $("#institutionId").val();
}
function initUI(){
	$('#institutionIdAttachment').fileList();
}

//弹出新增对话框
function showInsertDialog() {
	if(!getId()) {
		Public.tip('请先保存表单！'); return;
	}
	UICtrl.showAjaxDialog({
				title : "修订内容",
				param : {
					institutionId : getId()
				},
				width : 450,
				url : web_app.name+ '/institutionAmendmentAction!showItemInsert.load',
				ok : doSaveFunction,
				close : onDialogCloseHandler
			});
}

//弹出修改对话框
function showUpdateDialog() {
	var row = UICtrl.checkSelectedRows(gridManager);
	if(row){
		doShowUpdateDialog(row.institutionItemId);
	}
}

//进行修改操作
function doShowUpdateDialog(institutionItemId) {
	UICtrl.showAjaxDialog({
				title : "修订内容",
				url : web_app.name + '/institutionAmendmentAction!showItemUpdate.load',
				param : {
					institutionItemId : institutionItemId
				},
				width : 450,
				ok : doSaveFunction,
				close : onDialogCloseHandler
			});
}

//进行新增、修改操作
function doSaveFunction() {
	var _self = this;
	$('#submitForm').ajaxSubmit({
		url : web_app.name + '/institutionAmendmentAction!saveItem.ajax',
		success : function() {
			refreshFlag = true;
			_self.close();
			gridManager.loadData();
		}
	});
}