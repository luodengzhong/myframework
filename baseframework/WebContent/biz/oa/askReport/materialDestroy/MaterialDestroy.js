var defaultTitle = "资料销毁申请单";
var gridManager = null, refreshFlag = false;
var isFirstAddItem = false;//是否正在执行添加详情操作；
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initGetDispatchNoBtn();
	initGrid();
	initUI();
});

//初始化表格
function initGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function () {
			if(!getId()) {
				isFirstAddItem = true; 
				save();//先保存表单
				isFirstAddItem = false;
			}
			var dataLength = gridManager.getData().length;
			var seq = 1;
			if(dataLength > 0){
				seq = gridManager.getRow(dataLength-1).sequence+1;
			}
            UICtrl.addGridRow(gridManager,
                    { sequence: seq,materialDestroyId:"",materialItemId:"",materialName:"",graphPage:"",wordsPage:"",reason:""
                    });
            },
            saveHandler : saveDetail,
		deleteHandler: function(){
			DataUtil.delSelectedRows({action:'materialDestroyAction!deleteDetail.ajax',
				gridManager:gridManager,idFieldName:'materialItemId',
				onSuccess:function(){
					gridManager.loadData();
				}
			});
		}
	});
	gridManager = UICtrl.grid('#grid_manager', {
		columns: [
		    { name: "materialDestroyId",hide:"true"},		   
		    { name: "materialItemId",hide:"true"},		   
			{ display: "序号",hide:"true", name: "sequence" },		   
			{ display: "资料名称", name: "materialName", width: 200, minWidth: 60, type: "string", align: "left" ,editor:{type:"text", required: true}},		   
			{ display: "数量(页)", columns:[
			                          { display: "图纸", name: "graphPage", width: 100, minWidth: 60, type: "string", align: "left",editor:{type:"text", required: true,mask:"nnnnnn"}},	   
			                          { display: "文字", name: "wordsPage", width: 100, minWidth: 60, type: "string", align: "left" ,editor:{type:"text", required: true,mask:"nnnnnn"}}		   
			                          ] },		   
			{ display: "销毁原因", name: "reason", width:300, minWidth: 60, type: "string", align: "left",editor:{type:"text", required: false} },		   
		],
		dataAction : 'server',
		url: web_app.name+'/materialDestroyAction!queryDetail.ajax',
		parms:{materialDestroyId:function(){return getId();}},
		width : '99.7%',
		heightDiff : -5,
		headerRowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : false,
		selectRowButtonOnly : true,
		allowAdjustColWidth:true,
		enabledEdit: true,
		usePager: false,
		checkbox: true,
        rownumbers: true,
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
}
function beforeSave(){
	var subject = $("#subject").val();
	if (subject == "") {
		subject = defaultTitle;
	}
	$("#subject").val(subject);
	if(getId()){
		saveDetail();
	}
	return true;
}

function getExtendedData(){
	if($(":radio:checked").length==0 && !isFirstAddItem){
		Public.tip("文件类型不能为空！");
		return false;
	}
	var subject = $("#subject").val();
	if (subject == "") {
		subject = defaultTitle;
	}
	return {subject:subject};
}

function setId(value) {
	$("#materialDestroyId").val(value);
	$('#materialDestroyIdAttachment').fileList({
		bizId : value
	});
}

function getId() {
	return $("#materialDestroyId").val();
}
function initUI(){
	$('#materialDestroyIdAttachment').fileList();
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
	var materialDestroyId=getId();
	if(materialDestroyId==''){
		Public.tip('请先保存表单后再获取发文号');
		return false;
	}
	UICtrl.getDispatchNo({
		bizId:materialDestroyId,
		bizUrl:'materialDestroyAction!showUpdate.job?isReadOnly=true&bizId='+materialDestroyId,
		title:$('#subject').val(),
		callback:function(param){
			var _self = this;
            $("#dispatchNo").val(data['dispatchNo']).removeClass('grayColor');
            $("#titleDispatchNo").val(data['dispatchNo']);
            //$("#editSubject").val(param['dispatchNo'] + $("#editSubject").html());
            //$("#subject").val(param['dispatchNo'] + defaultTitle);
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

//弹出新增对话框
function showInsertDialog() {
	if(!getId()) {
		Public.tip('请先保存表单！'); return;
	}
	UICtrl.showAjaxDialog({
				title : "添加销毁资料",
				param : {
					materialDestroyId : getId()
				},
				width : 450,
				url : web_app.name+ '/materialDestroyAction!showInsertDetail.load',
				ok : doSaveFunction,
				close : onDialogCloseHandler
			});
}

function saveDetail() {
    var handlerData = DataUtil.getGridData({ gridManager: gridManager });
    if (!handlerData) return false;
    Public.ajax(web_app.name + '/materialDestroyAction!saveDetail.load',
        { data: encodeURI($.toJSON(handlerData)),materialDestroyId : getId() },
        function () {
        		gridManager.loadData();
        }
    );
}
