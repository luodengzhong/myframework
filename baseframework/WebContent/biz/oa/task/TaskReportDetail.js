Public.tip.topDiff=10;

$(document).ready(function() {
	UICtrl.autoGroupAreaToggle();
	initializeUI();
	bindEvent();
});

function setId(id){
	$('#taskReportId').val(id);
	$('#taskReporAttachment').fileList({bizId:id});
}

function getId() {
	return $("#taskReportId").val() || 0;
}
function initializeUI(){
	var isFinish=$('#isFinish0').getValue();
	if(isFinish==''){
		$('#isFinish0').setValue(1);
	}
	var actualStart=$('#actualStart').val();
	if(actualStart==''){
		$('#actualStart').val($('#startDate').val());
	}

	$('#estimatedFinish').datepicker({left:function(){
		return $('#estimatedFinish').offset().left-23;
	}}).mask('9999-99-99');
	$('#taskReporAttachment').fileList();
	var rows = $("div.ui-attachment-list");
	 $.each(rows, function (index, market) {
		    $('#'+market.id).fileList();
		
	    });
	initUIByIsFinish();
}
function bindEvent(){
	$('#isFinish0').parent('td').on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
    	if($clicked.is('input')){
    		setTimeout(initUIByIsFinish,0);
    	} 
	});
}
//更具是否完成标志初始化页面显示
function initUIByIsFinish(){
	var isFinish=$('#isFinish0').getValue();
	if(isFinish==1){
		$('#percentComplete').val(100);
		$('#analyzeCauseTR').hide();
		UICtrl.disable('#percentComplete');
		UICtrl.disable('#estimatedFinish');
		$('#actualFinish').attr('required',true);
		UICtrl.enable('#actualFinish');
		$('#estimatedFinish').val('').removeAttr('required');
	}else{
		var val=parseInt($('#percentComplete').val(),10);
		if(val==100){
			$('#percentComplete').val('');
		}
		$('#analyzeCauseTR').show();
		$('#estimatedFinish').attr('required',true);
		UICtrl.enable('#percentComplete');
		UICtrl.enable('#estimatedFinish');
		UICtrl.disable('#actualFinish');
		$('#actualFinish').val('').removeAttr('required');
	}
}

function getParam(){
	var param=$('#submitForm').formToJSON();
	if(!param) return false;
	var isFinish=param['isFinish'];
	var percentComplete=parseInt(param['percentComplete'],0);
	if(isNaN(percentComplete)){
		Public.tips({type:2,content:'完成进度(%)录入错误,请重新录入!',time:5000});
		return false;
	}
	if(isFinish==0){
		if(percentComplete>=100){
		    Public.tips({type:2,content:'确定当前工作项未完成，则当前进度必须小于100%!',time:5000});
			return false;
		}
		if(Public.dateDiff('m',param['actualStart'],param['estimatedFinish'])>0){
			Public.tips({type:2,content:'预计完成日期不允许早于实际开始日期!',time:5000});
			return false;
		}
	}else{
		if(Public.dateDiff('m',param['actualStart'],param['actualFinish'])>0){
			Public.tips({type:2,content:'实际完成日期不允许早于实际开始日期!',time:5000});
			return false;
		}
	}
	return param;
}

function saveTaskReport(){
	var param=getParam();
	if(!param) return false;
	var url=web_app.name + "/planTaskManagerAction!saveTaskReport.ajax";
	Public.ajax(url,param,function(id){
		$('#taskReportId').val(id);
		$('#taskReporAttachment').fileList({bizId:id});
	});
}

function submitTaskReport(fn){
	var _selfDialog=this;
	var param=getParam();
	if(!param) return false;
	UICtrl.confirm('您确定提交当前数据吗?', function() {
		var url=web_app.name + "/planTaskManagerAction!submitTaskReport.ajax";
		Public.ajax(url,param,function(id){
			fn();
		});
	});
}


function openPlanDetail(){
	var planTaskId=$('#planTaskId').getValue();	
	var url=web_app.name + '/planTaskManagerAction!showTaskDetail.do?planTaskId='+planTaskId;
	parent.parent.addTabItem({ tabid: 'viewTask'+planTaskId, text: '任务详情', url:url});	
}