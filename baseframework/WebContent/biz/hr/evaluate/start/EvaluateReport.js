
$(document).ready(function() {
	initializeUI();
	initToolBar();
});
function initializeUI(){
	$('#evaluateReportFileList').fileList();
	var div=$('#evaluateChartsDiv');
	var height = UICtrl.getPageSize().h;
	div.height(height);
	var url=web_app.name + '/evaluateStatAction!forwardEvaluateStartCharts.do?evaluateStartId='+$('#evaluateStartId').val();
	AttachmentUtil.addConvertPreviewFileIFrame(div,url);
}

function initToolBar(){
	$('#chartsToolBar').toolBar([
		{id:'save',name:'保存',icon:'save',event:doSave},
		{line:true},
		{id:'view',name:'预览',icon:'view',event: previewInfo},
	    {line:true},
		{id:'turn',name:'发送报告',icon:'turn',event:sendReoprt},
		{line:true},
		{id:'showReportTask',name:'已发送人员',icon:'table',event:function(){}},
		{line:true}
	]);
	$('#showReportTask').comboDialog({type:'sys',name:'bizTaskQuery',
		title:'已发送人员',width:610,
		onShow:function(){
			if(!canEidt()){
				Public.tip('请先保存单据!');
				return false;
			}
		},
		getParam:function(){
			var evaluateReportId=$('#evaluateReportId').val();
			return {bizId:evaluateReportId};
		},
		onChoose:function(){
			return true;
	    }
   });
}
//保存
function doSave(fn){
	var url= web_app.name +'/evaluateStartAction!saveEvaluateReport.ajax';
	$('#submitForm').ajaxSubmit({url: url,success : function(data) {
		if(!canEidt()){
			setId(data);
		}
		if($.isFunction(fn)){
			fn.call(window,data);
		}
	}});
}

function sendReoprt(){
	if(!canEidt()){
		Public.tip('请先保存单据!');
		return;
	}
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams	();
	selectOrgParams['selectableOrgKinds']='psm';
	var options = { params: selectOrgParams,title : "请选择人员",
		confirmHandler: function(){
			var data = this.iframe.contentWindow.selectedData;
			if (data.length == 0) {
				Public.errorTip("请选择数据。");
				return;
			}
			if(!canEidt()){
			    Public.errorTip("主表未保存，不能添加人员!");
				return;
			}
			var ids=[],_self=this;
			$.each(data,function(i,o){
				ids.push(o['id']);
			});
			var evaluateReportId=$('#evaluateReportId').val();
			var url=web_app.name + '/evaluateStartAction!saveSendReport.ajax';
			Public.ajax(url, {evaluateReportId:evaluateReportId,ids:$.toJSON(ids)}, function(data){_self.close();});
		}
	};
	OpmUtil.showSelectOrgDialog(options);
}

function previewInfo(){
	if(!canEidt()){
		Public.tip('请先保存单据!');
		return;
	}
	var evaluateReportId=$('#evaluateReportId').val();
	var url=web_app.name + '/evaluateStartAction!showEvaluateReport.do?evaluateReportId='+evaluateReportId;
	parent.addTabItem({ tabid: 'HREvaluateChartsView'+evaluateReportId, text: '评价结果', url:url});
}

function canEidt(){
	var evaluateReportId=$('#evaluateReportId').val();
	return !(evaluateReportId=='');
}
function setId(id){
	$('#evaluateReportId').val(id);
	$('#evaluateReportFileList').fileList({bizId:id});
}
function getId(){
	$('#evaluateReportId').val();
}