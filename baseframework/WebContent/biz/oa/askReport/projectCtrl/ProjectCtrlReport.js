var defaultTitle = "项目季度重要隐蔽工程管控要点梳理表";
var isAddDetail = false;//是否正在执行添加详情操作；
var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initGetDispatchNoBtn();
	initGrid();
//	bindEvent();
	initUI();
});

//初始化表格
function initGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: showInsertDialog,
		updateHandler : showUpdateDialog,
		deleteHandler: function(){
			DataUtil.delSelectedRows({action:'projectCtrlReportAction!deleteDetail.ajax',
				gridManager:gridManager,idFieldName:'projectCtrlDetailId',
				onSuccess:function(){
					gridManager.loadData();
				}
			});
		}
	});
	gridManager = UICtrl.grid('#grid_manager', {
		columns: [
			{ display: "隐蔽工程管控项目", name: "projectName", width: 200, minWidth: 60, type: "string", align: "left" },		   
			{ display: "序号", name: "sequence", width: 40, minWidth: 40, type: "string", align: "center" },	
			{ display: "名称及部位", name: "nameAndLocation", width: 200, minWidth: 60, type: "string", align: "left" },		   
			{ display: "管控要点/主控内容分解", name: "pointAndContent", width: 200, minWidth: 60, type: "string", align: "left" },		   
			{ display: "建设单位参数部门", name: "joinInDept", width: 200, minWidth: 60, type: "string", align: "left" },		   
			{ display: "管控要求/相关记录", name: "requestAndRecord", width: 200, minWidth: 60, type: "string", align: "left" },		   
			{ display: "备注", name: "remark", width: 200, minWidth: 60, type: "string", align: "left" },		   
		],
		dataAction : 'server',
		url: web_app.name+'/projectCtrlReportAction!queryDetail.ajax',
		parms:{projectCtrlReportId:function(){return getId();}},
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
				doShowUpdateDialog(data.projectCtrlDetailId);
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
	var projectCtrlReportId=getId();
	if(projectCtrlReportId==''){
		Public.tip('请先保存表单后再获取发文号');
		return false;
	}
	UICtrl.getDispatchNo({
		bizId:projectCtrlReportId,
		bizUrl:'projectCtrlReportAction!showUpdate.job?isReadOnly=true&bizId='+projectCtrlReportId,
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

function afterSave(){
	if(isAddDetail){
		isAddDetail = false;
		showInsertDialog();
	}
}

function setId(value) {
	$("#projectCtrlReportId").val(value);
	$('#projectCtrlReportIdAttachment').fileList({
		bizId : value
	});
}

function getId() {
	return $("#projectCtrlReportId").val();
}
function initUI(){
	$('#projectCtrlReportIdAttachment').fileList();
}

function bindEvent(){
	//标题编辑事件
	$('#editSubject').on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.is('input')){
			return false;
		}
		var style="width:300px;height:25px;font-size:16px;border: 0px;border-bottom: 2px solid #d6d6d6;";
		var subject=$.trim($(this).text()),html=[];
		html.push('<input type="text" style="',style,'" value="',subject,'" maxlength="100" id="editSubjectInput">');
		$(this).html(html.join(''));
		setTimeout(function(){
			$('#editSubject').find('input').focus();
		},0);
	});
	$('#editSubject').on('focus','input',function(){
		var text=$(this).val();
		if(text==defaultTitle){
	//		$(this).val('');
		}
	}).on('blur','input',function(){
		var text=$(this).val();
		if(text==''){
			text=defaultTitle;
		}
		$('#subject').val($(this).val());
		$('#editSubject').html(text);
	});
}

//弹出新增对话框
function showInsertDialog() {
	if(!getId()) {//未保存表单，则调用保存表单方法，保存之后再弹出新增对话框
		isAddDetail = true;
		save();//保存表单数据，创建流程实例job.js中的方法
		return;
	}
	UICtrl.showAjaxDialog({
				title : "添加管控要点",
				param : {
					projectCtrlReportId : getId()
				},
				width : 450,
				url : web_app.name+ '/projectCtrlReportAction!showInsertDetail.load',
				ok : doSaveFunction,
				close : onDialogCloseHandler
			});
}

//弹出修改对话框
function showUpdateDialog() {
	var row = UICtrl.checkSelectedRows(gridManager);
	if(row){
		doShowUpdateDialog(row.projectCtrlDetailId);
	}
}

//进行修改操作
function doShowUpdateDialog(projectCtrlDetailId) {
	UICtrl.showAjaxDialog({
				title : "修改管控要点",
				url : web_app.name + '/projectCtrlReportAction!showUpdateDetail.load',
				param : {
					projectCtrlDetailId : projectCtrlDetailId
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
		url : web_app.name + '/projectCtrlReportAction!saveDetail.ajax',
		success : function() {
			refreshFlag = true;
			_self.close();
			gridManager.loadData();
		}
	});
}