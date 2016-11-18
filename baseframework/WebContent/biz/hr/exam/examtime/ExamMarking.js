$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	bindEvent();
	initQuestionView();
	if($('#examMarkingId').val()==''){
		chooseFirstExamPaper();
	}
});

function initializeUI(){
	$('html').addClass("html-body-overflow");
	var layout=$("#layout"),bodyHeight;
	UICtrl.layout(layout, { leftWidth : 250,  heightDiff :-3 , onHeightChanged: function(options){
		bodyHeight = layout.height() - 2;
        $('#examMarkingLeft').height(bodyHeight-38);
        $('#examMarkingCenter').height(bodyHeight-38);
    }});
	bodyHeight = layout.height() - 2;
	$('#examMarkingLeft').height(bodyHeight-38);
	$('#examMarkingCenter').height(bodyHeight-38).css({ overflowX:'hidden',overflowY:'auto'});
	//处理toolbar
	var div=$('div.l-layout-center').find('div.l-layout-header').attr('id','examMarkingToolbar');
	div.html('<div style="float: left;margin-top:3px;"><label id="showSubjective"><input type="checkbox"/>&nbsp;<b style="color:Tomato;">只显示问答题</b></label></div>')
		.css({border:'0px',borderBottom:'1px',fontWeight:'normal'});
	div.toolBar([
	    {id:'save',name:'保存',icon:'save',event:save},
		{line:true,id:'saveLine'},
		{id:'savesubmit',name:'提交',icon:'turn',event:submit},
		{line:true,id:'savesubmitLine'}
	]);
}

function bindEvent(){
	$('#examMarkingLeft').on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.is('a.GridStyle')){
			$('div.divChoose',this).removeClass('divChoose');
			var id=$clicked.attr('id');
			loadExamPaper(id);
			$clicked.parent().addClass('divChoose');
		}
	});
	//只显示问答题选项
	$('#showSubjective').on('click',function(){
		setTimeout(initQuestionTypeView,0);
	});
}
//初始化显示答卷
function initQuestionView(){
	intiQuestionImg();
	initfinalScores();
	initQuestionTypeView();
	$('#examMarkingToolbar').toolBar('enable');
}
//只显示问答题选项
function initQuestionTypeView(){
	var checkbox=$('#showSubjective').find('input');
	if(checkbox.is(':checked')){
		$('div.questionType0').hide();
	}else{
		$('div.questionType0').show();
	}
}
function initfinalScores(){
	var finalScores=$('#examMarkingQuestion').find('input[name="finalScore"]');
	finalScores.mask('999',{number:true});
}
//图片比例显示
function intiQuestionImg(){
	var imgDiv=$('#examMarkingQuestion').find('div.show_question_img');
	if(imgDiv.length>0){
		imgDiv.find('img').each(function(i,o){
			UICtrl.autoResizeImage($(this),256);
			$(this).show();
		});
		setTimeout(function(){imgDiv.show();},100);
	}
}

function showQuestionImg(id){
	var url=web_app.name+'/attachmentAction!downFile.ajax?id='+id;
	$.thickbox({imgURL:url});
}
function chooseFirstExamPaper(){
	var aList=$('#examMarkingLeft').find('a.GridStyle');
	if(aList.length>0){
		var first=null;
		if(!first){
			first=$(aList.get(0));
		}
		var id=first.attr('id');
		loadExamPaper(id);
		first.parent().addClass('divChoose');
	}else{//没有数据了关闭本页面
		UICtrl.closeAndReloadTabs("TaskCenter", null);
	}
}

//获取保存参数
function getExamMarkingQuestionParam(){
	var finalScores=$('#examMarkingQuestion').find('input[name="finalScore"]');
	var flag=true,scoreList=[];
	var finalScore='',id='',score='',index='';
	finalScores.each(function(){
		finalScore=$(this).val(),id=$(this).attr('id');
		score=$(this).attr('score'),index=$(this).attr('index');
		if(finalScore==''){
			flag=false;
			Public.errorTip('请填写题目['+index+']的得分!');
			return false;
		}
		finalScore=parseInt(finalScore,10);
		score=parseInt(score,10);
		if(isNaN(finalScore)){
			flag=false;
			Public.errorTip('题目['+index+']的得分输入错误!');
			return false;
		}
		/*if(finalScore>score){
			flag=false;
			Public.errorTip('题目['+index+']的得分大于题目分值,请确认!');
			return false;
		}*/
		scoreList.push({id:id,finalScore:finalScore});
	});
	if(!flag){
		return false;
	}
	var param={examMarkingId:$('#examMarkingId').val(),examPersonTaskId:$('#examPersonTaskId').val()};
	param['questions']=$.toJSON(scoreList);
	return param;
}
//保存
function save(){
	var param=getExamMarkingQuestionParam();
	if(!param) return false;
	Public.ajax(web_app.name + "/examTaskAction!saveExamMarking.ajax",param,function(){});
}
//提交
function submit(){
	var param=getExamMarkingQuestionParam();
	if(!param) return false;
	UICtrl.showAjaxDialog({
		url: web_app.name + '/examTaskAction!showSubmitExamMarking.load', 
		title: "确认",
		param:param,width:600,
		okVal:'确认提交',
		ok: function(){
			var _self=this;
			var param={examMarkingId:$('#examMarkingId').val(),examPersonTaskId:$('#examPersonTaskId').val()};
			Public.ajax(web_app.name + "/examTaskAction!submitExamMarking.ajax",param,function(){
				reLoadExamPapers();
				_self.close();
			});
		}
	});
}
//加载试卷
function loadExamPaper(examMarkingId){
	var tip=Public.tips({autoClose:false});
	var url="/examTaskAction!loadExamPaper.ajax";
	$('#examMarkingToolbar').toolBar('disable');
	$('#examMarkingQuestion').load(web_app.name + url,{examMarkingId:examMarkingId},function(){
		tip.remove();
		initQuestionView();
	});
}
//刷新
function reLoadExamPapers(){
	$('#examMarkingToolbar').toolBar('disable');
	Public.ajax(web_app.name + "/examTaskAction!queryExamPaperByPersonId.ajax",{},function(data){
		var html = [];
		$.each(data, function(i, o){
			html.push('<div class="list_view">');
			html.push('<a href="javascript:void(null);" class="GridStyle" ');
			html.push('id="',o.examMarkingId,'" >');
			html.push(o.subject,'</a>');
			html.push('</div>');
        });
		$("#examMarkingLeft").html(html.join(""));
		chooseFirstExamPaper();
	});
}