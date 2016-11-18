var defaultTitle = "非战略类投放广告会议决议";
var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initGrid();
	initGetDispatchNoBtn();
	initUI();
	initSerchBox();
});

//初始化表格
function initGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: showInsertDialog,
		updateHandler : showUpdateDialog,
		deleteHandler: function(){
			DataUtil.delSelectedRows({action:'nonStrategicAdMeetingAction!deleteDetail.ajax',
				gridManager:gridManager,idFieldName:'nonStrategicAdDetailId',
				onSuccess:function(){
					gridManager.loadData();
				}
			});
		}
	});
	gridManager = UICtrl.grid('#grid_manager', {
		columns: [
		{ display: "投放目的", name: "purpose", width: 150, minWidth: 60, type: "string", align: "left"},		   
		{ display: "媒体名称", name: "mediaName", width: 120, minWidth: 60, type: "string", align: "left" },	   
		{ display: "媒体介绍", name: "mediaRecommend", width: 100, minWidth: 60, type: "string", align: "left"},		   
		{ display: "合作内容", name: "content", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "合作时间", name: "startDate", width: 100, minWidth: 60, type: "date", align: "left"},	   
//		{ display: "合作结束时间", name: "endDate", width: 100, minWidth: 60, type: "string", align: "left" ,editor: { type: 'text',required:false}},		   
		{ display: "执行价", name: "price", width: 100, minWidth: 60, type: "float", align: "left" },		   
		{ display: "付款方式", name: "modeOfPayment", width: 100, minWidth: 60, type: "string", align: "left"},	   
		{ display: "是否有可用资源", name: "resourcesTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "其它开发商使用记录", name: "record", width: 200, minWidth: 60, type: "string", align: "left" },	   
		{ display: "与会人员最终意见", name: "finalOpinion", width: 200, minWidth: 60, type: "string", align: "left"},
		],
		title:"合作信息",
		dataAction : 'server',
		url: web_app.name+'/nonStrategicAdMeetingAction!queryDetail.ajax',
		parms:{nonStrategicAdId:function(){return getId();}},
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
				doShowUpdateDialog(data.nonStrategicAdDetailId);
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
	var nonStrategicAdId=getId();
	if(nonStrategicAdId==''){
		Public.tip('请先保存表单后再获取发文号');
		return false;
	}
	UICtrl.getDispatchNo({
		bizId:nonStrategicAdId,
		bizUrl:'nonStrategicAdMeetingAction!showUpdate.job?isReadOnly=true&bizId='+nonStrategicAdId,
		title:$('#subject').val(),
		callback:function(param){
			var _self = this;
            $('#dispatchNo').val(param['dispatchNo']);
            _self.close();
		}
	});
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
	$("#nonStrategicAdId").val(value);
	$('#nonStrategicAdIdAttachment').fileList({
		bizId : value
	});
}

function getId() {
	return $("#nonStrategicAdId").val();
}
function initUI(){
	$('#nonStrategicAdIdAttachment').fileList();
}


function initSerchBox() {
	$("#hostName").searchbox({
		type : "sys",
		name : "orgSelect",
		getParam : function() {
			return {
				a : 1,
				b : 1,
				searchQueryCondition : " org_kind_id ='psm'"
			};
		},
		back : {
			personId : "#hostId",
			personMemberName : "#hostName"
		}
	});

}
//弹出新增对话框
function showInsertDialog() {
	if(!getId()) {
		Public.tip('请先保存表单！'); return;
	}
	UICtrl.showAjaxDialog({
				title : "添加合作信息",
				param : {
					nonStrategicAdId : getId()
				},
				width : 450,
				url : web_app.name+ '/nonStrategicAdMeetingAction!showInsertDetail.load',
				ok : doSaveFunction,
				close : onDialogCloseHandler
			});
}

//弹出修改对话框
function showUpdateDialog() {
	var row = UICtrl.checkSelectedRows(gridManager);
	if(row){
		doShowUpdateDialog(row.nonStrategicAdDetailId);
	}
}

//进行修改操作
function doShowUpdateDialog(nonStrategicAdDetailId) {
	UICtrl.showAjaxDialog({
				title : "修改合作信息",
				url : web_app.name + '/nonStrategicAdMeetingAction!showUpdateDetail.load',
				param : {
					nonStrategicAdDetailId : nonStrategicAdDetailId
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
		url : web_app.name + '/nonStrategicAdMeetingAction!saveDetail.ajax',
		success : function() {
			refreshFlag = true;
			_self.close();
			gridManager.loadData();
		}
	});
}