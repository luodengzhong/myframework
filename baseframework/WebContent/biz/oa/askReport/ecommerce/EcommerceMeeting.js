var defaultTitle = "电子商务合作会议决议表";
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
			DataUtil.delSelectedRows({action:'ecommerceMeetingAction!deleteDetail.ajax',
				gridManager:gridManager,idFieldName:'ecommerceDetailId',
				onSuccess:function(){
					gridManager.loadData();
				}
			});
		}
	});
	gridManager = UICtrl.grid('#grid_manager', {
		columns: [
			{ display: "项目优惠政策", name: "preferentialPolicy", width: 200, minWidth: 60, type: "string", align: "left" },		   
			{ display: "合作开始时间", name: "startDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
			{ display: "合作截止时间", name: "endDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
			{ display: "合作房源数量", name: "housesCount", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "房源合计金额", name: "housesAmount", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "其它约定", name: "otherPromise", width: 200, minWidth: 60, type: "string", align: "left" },		   
			{ display: "与会人员最终意见", name: "finalOpinion", width: 200, minWidth: 60, type: "string", align: "left" },	
		],
		title:"合作信息",
		dataAction : 'server',
		url: web_app.name+'/ecommerceMeetingAction!queryDetail.ajax',
		parms:{ecommerceId:function(){return getId();}},
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
				doShowUpdateDialog(data.ecommerceDetailId);
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
	var ecommerceId=getId();
	if(ecommerceId==''){
		Public.tip('请先保存表单后再获取发文号');
		return false;
	}
	UICtrl.getDispatchNo({
		bizId:ecommerceId,
		bizUrl:'ecommerceMeetingAction!showUpdate.job?isReadOnly=true&bizId='+ecommerceId,
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
	$("#ecommerceId").val(value);
	$('#ecommerceIdAttachment').fileList({
		bizId : value
	});
}

function getId() {
	return $("#ecommerceId").val();
}
function initUI(){
	$('#ecommerceIdAttachment').fileList();
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
					ecommerceId : getId()
				},
				width : 450,
				url : web_app.name+ '/ecommerceMeetingAction!showInsertDetail.load',
				ok : doSaveFunction,
				close : onDialogCloseHandler
			});
}

//弹出修改对话框
function showUpdateDialog() {
	var row = UICtrl.checkSelectedRows(gridManager);
	if(row){
		doShowUpdateDialog(row.ecommerceDetailId);
	}
}

//进行修改操作
function doShowUpdateDialog(ecommerceDetailId) {
	UICtrl.showAjaxDialog({
				title : "修改合作信息",
				url : web_app.name + '/ecommerceMeetingAction!showUpdateDetail.load',
				param : {
					ecommerceDetailId : ecommerceDetailId
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
		url : web_app.name + '/ecommerceMeetingAction!saveDetail.ajax',
		success : function() {
			refreshFlag = true;
			_self.close();
			gridManager.loadData();
		}
	});
}