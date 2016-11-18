$(document).ready(function() {
	if(Public.isReadOnly){
		//只读状态不显示按钮
		$('a.orangeBtn').hide();
		$('#showViewAnswerDiv').hide();
	}
	initUI();
});
function initUI(){
	//处理附件显示
	var showExamStartFileList=$('#showExamStartFileList');
	if(showExamStartFileList.find('div.file').length>0){
		$('#examStartFileList').fileList({readOnly:true});
		showExamStartFileList.show();
	}
}
//倒计时函数
function countDown(intDiff){
    window.setInterval(function(){
	    var day=0,hour=0,minute=0,second=0;//时间默认值        
	    if(intDiff > 0){
	        day = Math.floor(intDiff / (60 * 60 * 24));
	        hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
	        minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
	        second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
	    }
	    if (minute <= 9) minute = '0' + minute;
	    if (second <= 9) second = '0' + second;
	    //$('#day_show').html(day+"天");
	    $('#hour_show').html('<s id="h"></s>'+hour+'时');
	    $('#minute_show').html('<s></s>'+minute+'分');
	    $('#second_show').html('<s></s>'+second+'秒');
	    intDiff--;
    }, 1000);
}
//启动倒计时
function startCountDown(){
	var allTimeout=parseInt($('#allTimeout').val(),10);
	var usedTimeout=parseInt($('#usedTimeout').val(),10);
	if(isNaN(usedTimeout)) usedTimeout=0;
	var intDiff=allTimeout*60-usedTimeout;
	countDown(intDiff);
	$('#show_count_down').show();
}

function showExamQuestionInfo(data){
	var main=$('#examQuestionInfo').html(data).show();
	var imgDiv=$('div.show_question_img',main);
	if(imgDiv.length>0){
		imgDiv.find('img').each(function(i,o){
			UICtrl.autoResizeImage($(this),256);
			$(this).show();
		});
		setTimeout(function(){imgDiv.show();},100);
	}
	//完成考试隐藏时间显示
	if($('#examEndDiv').length>0){
		$('#show_count_down').hide();
	}
}
function showQuestionImg(id){
	var url=web_app.name+'/attachmentAction!downFile.ajax?id='+id;
	$.thickbox({imgURL:url});
}
//开始考试
function startExamTask(){
	var examPersonTaskId=$('#examPersonTaskId').val();
	var url=web_app.name + '/examTaskAction!startExamTask.load'
	Public.load(url,{examPersonTaskId:examPersonTaskId},function(data){
		$('#examMainInfo').hide();
		showExamQuestionInfo(data);
		startCountDown();
	});
}
//继续考试
function continueExamTask(){
	var examPersonTaskId=$('#examPersonTaskId').val();
	var url=web_app.name + '/examTaskAction!continueExamTask.load'
	Public.load(url,{examPersonTaskId:examPersonTaskId},function(data){
		$('#examMainInfo').hide();
		showExamQuestionInfo(data);
		startCountDown();
	});
}

//提交答案
function submitQuestions(obj){
	var personTaskQuestionsId=$(obj).attr('id');
	var timer=$(obj).attr('timer');
	var isSubjective=parseInt($(obj).attr('isSubjective'),10);
	var inputs=$('input',$('#examQuestionInfo'));
	var examPersonTaskId=$('#examPersonTaskId').val();
	var params={examPersonTaskId:examPersonTaskId,personTaskQuestionsId:personTaskQuestionsId,timer:timer};
	if(!isNaN(isSubjective)&&isSubjective==1){//主观题
		var answer=$('#text'+personTaskQuestionsId).val();
		if(answer==''){
			Public.tip('请输入答案!');
			return;
		}
		params['answer']=encodeURI(answer);
		params['isSubjective']=1;
	}else{//客观题
		var items=[],flag=false,isSelect=0;
		inputs.each(function(){
			isSelect=$(this).is(':checked')?1:0;
			if(isSelect==1) flag=true;
			items.push({id:$(this).attr('id'),isSelect:isSelect});
		});
		if(!flag){
			Public.tip('没有选择答案,不能提交!');
			return;
		}
		params['isSubjective']=0;
		params['items']=$.toJSON(items);
	}
	var url=web_app.name + '/examTaskAction!submitQuestions.load'
	Public.load(url,params,function(data){
		showExamQuestionInfo(data);
	});
}
//完成考试任务
function saveCompleteExamTaskWriteBack(){
	var examPersonTaskId=$('#examPersonTaskId').val(),taskId=$('#mainPanelTaskId').val();
	Public.ajax(web_app.name + '/examTaskAction!saveCompleteExamTaskWriteBack.ajax', {examPersonTaskId:examPersonTaskId,taskId:taskId}, function(){
		UICtrl.closeAndReloadTabs("TaskCenter", null);
	});
}
//重新考试
function saveReStartExamTask(){
	var examPersonTaskId=$('#examPersonTaskId').val(),taskId=$('#mainPanelTaskId').val();
	Public.ajax(web_app.name + '/examTaskAction!saveReStartExamTask.ajax', {examPersonTaskId:examPersonTaskId,taskId:taskId}, function(data){
		var url= '/examTaskAction!forwardExamTask.do?isReadOnly=false&taskKindId=task&bizId='+data['examPersonTaskId']+'&taskId='+data['taskId'];
		//重新进入考试页面
		window.location.replace(web_app.name +url);
	});
}
//完成考试任务并生成阅卷任务
function saveCompleteExamTaskCreateMarking(){
	var examPersonTaskId=$('#examPersonTaskId').val(),taskId=$('#mainPanelTaskId').val();
	Public.ajax(web_app.name + '/examTaskAction!saveCompleteExamTaskCreateMarking.ajax', {examPersonTaskId:examPersonTaskId,taskId:taskId}, function(){
		UICtrl.closeAndReloadTabs("TaskCenter", null);
	});
}
function forwardQuestionAnswerList(){
	var examPersonTaskId=$('#examPersonTaskId').val();
	var url= web_app.name +'/examTaskAction!forwardQuestionAnswerList.do?examPersonTaskId='+examPersonTaskId;
	parent.addTabItem({ tabid: 'QuestionAnswerList'+examPersonTaskId, text: '查看考试答案 ', url:url});
}